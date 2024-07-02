# Actors and Concurrent Applications

## Example of an 'Actor'

An actor is useful when you want to handle data in a concurrent way. An actor is a type of object that is an independent unit of computation. It has a mailbox for receiving messages, and it can send messages to other actors. It can also create new actors. An actor can only do one thing at a time, and it can only do that one thing in response to a message. This makes it easy to reason about the behavior of an actor, and it makes it easy to write concurrent programs.

My application, that i use for this example, reads configuration from a XML file. With a actor, i can make sure that the configuration is handled by it. Only the actor can read and write the configuration and i don't have to use `Mutex` or `RwLock` to make sure that the configuration is not read or written by multiple threads at the same time.

### Message

An actor can receives messages via a struct that implements the `Message` trait. The `Message` trait has an associated type called `Result`, which is the type of the response that the actor will send back to the sender of the message. The `Message` trait also has a method called `handle`, which is called when the actor receives a message.

```rust
#[derive(Message)]
#[rtype(result = "Responses")]
pub enum Messages {
    ValidateRequest(JsonRequest),
    CreateConfig(Value),
    GetConfig,
}
```

- Here we define an enum called `Messages` that implements the `Message` trait. When i send a message to the actor, it can be one of the following:
- `ValidateRequest` - This message accept a `JsonRequest`.
- `CreateConfig` - This message accepts a `Value` which is parsed form a Json.
- `GetConfig` - This message does not accept any data but returns one of the `Responses` which we will define.

### Responses

Now that we have defined the messages that the actor can receive, we need to define the responses that the actor can send back to the sender of the message. This type is defined by the trait `MessageResponse` and looks like this:

```rust
pub trait MessageResponse<A: Actor, M: Message> {
    fn handle(self, ctx: &mut A::Context, tx: Option<OneshotSender<M::Result>>);
}
```

Most types like `String`, `u32`, `bool` etc. already implement the `MessageResponse` trait. If we want to return a custom type, we need to implement the `MessageResponse` trait for that type.

Here we have our `Responses` enum:

```rust
pub enum Responses {
    Success,
    Config(Config),
    Error(ConfigError),
}
```

Now we'll implement the `MessageResponse` trait for the `Responses` enum:

```rust
impl<A, M> MessageResponse<A, M> for Responses
where
    A: Actor,
    M: Message<Result = Responses>,
{
    fn handle(self, ctx: &mut A::Context, tx: Option<OneshotSender<M::Result>>) {
        if let Some(tx) = tx {
            tx.send(self);
        }
    }
}
```

- We'll need to define lifetime parameters for the `MessageResponse` trait. The `A` parameter is the actor that is handling the message, and the `M` parameter is the message that the actor is handling. We need to do this because the `MessageResponse` trait is generic over the actor and the message and without lifetime parameters, the compiler wouldn't know what `A` and `M` are.

- The `handle` method takes in `self`, `ctx` and `tx`. The `self` parameter is the response that the actor is sending back to the sender of the message. The `ctx` parameter is the actor's execution context, and the `tx` parameter is an `Option` that contains a `OneshotSender` that the actor can use to send the response back to the sender of the message.

### Actor definition

Now that we have defined the messages that the actor can receive and the responses that the actor can send back to the sender of the message, we can define the actor itself. The actor is defined by a struct that implements the `Actor` trait. The `Actor` trait has an associated type called `Context`, which is the type of the actor's execution context. The `Actor` trait also has a method called `started`, which is called when the actor is started.

```rust
pub struct ConfigActor {
    pub config: Option<Config>,
}

impl Actor for ConfigActor {
    type Context = Context<Self>;
}
```

- Now our actor is defined by a struct called `ConfigActor` that implements the `Actor` trait. The `Context` type is the actor's execution context, and it's a type that is used to manage the actor's lifecycle and message handling.

The next step is the implement a `Handler` trait for the actor, so it knows how to handle the messages that it can receive. The `Handler` trait has an associated type called `Result`, which is the type of the response that the actor will send back to the sender of the message. The `Handler` trait also has a method called `handle`, which is called when the actor receives a message.

```rust
impl Handler<Messages> for ConfigActor {
    type Result = Responses;

    fn handle(&mut self, msg: Messages, _ctx: &mut Context<Self>) -> Self::Result {
        match msg {
            Messages::ValidateRequest(json_req) => {
                if let Some(config) = &self.config {
                    match json_req.validate(config) {
                        Ok(_) => Responses::Success,
                        Err(e) => Responses::Error(e),
                    }
                } else {
                    Responses::Error(ConfigError::default(Some("No config found".to_string())))
                }
            }
            Messages::CreateConfig(value) => {
                let config = Config::new();
                match config.create_from_value(value) {
                    Ok(config) => {
                        self.config = Some(config.clone());
                        Responses::Config(config)
                    }
                    Err(e) => Responses::Error(e),
                }
            }
            Messages::GetConfig => {
                if let Some(config) = &self.config {
                    Responses::Config(config.clone())
                } else {
                    Responses::Error(ConfigError::default(Some("No config found".to_string())))
                }
            }
        }
    }
}
```

The `handle` method takes in `self`, `msg` and `ctx`. The `self` parameter is a mutable reference to the actor itself, the `msg` parameter is the message that the actor is handling, and the `ctx` parameter is the actor's execution context. The `handle` method returns a `Result` that is the response that the actor will send back to the sender of the message. Inside the `handle` method, we match on the `msg` parameter to determine which message the actor is handling, and then we return a response based on the message.

### Sending a message to the actor

Now that we have defined the actor and the messages that it can receive, we can send a message to the actor. We can do this by getting the actor's address and then sending a message to the address.

```rust
#[actix_rt::main]
async fn main() {
    let addr = ConfigActor { config: None }.start();

    let config = Nconfig::new_with_defaults();
    let json_con = xml_string_to_json(XML.to_owned(), &config).unwrap();

    let conf = addr.send(Messages::CreateConfig(json_con)).await;

    let res = match conf {
        Ok(Responses::Config(config)) => config,
        Ok(Responses::Error(e)) => {
            return;
        }
        _ => {
            dbg!("Error");
            return;
        }
    };

    dbg!(res);

    let json_req: Value = serde_json::from_str(JSON_TEST_REQUEST).unwrap();
    let json_req: JsonRequest = serde_json::from_value(json_req).unwrap();

    match addr.send(Messages::ValidateRequest(json_req)).await {
        Ok(Responses::Success) => {
            println!("Ok");
        }
        Ok(Responses::Error(e)) => {
            dbg!(e);
        }
        _ => {
            dbg!("Error");
        }
    }
}
```

- We start the actor by calling the `start` method on the `ConfigActor` struct. This returns an `Addr` that we can use to send messages to the actor.

- We then send a `CreateConfig` message to the actor by calling the `send` method on the `Addr`. This returns a `Response` that we can await.

- We then match on the `Response` to determine what the actor sent back to us.

- We then send a `ValidateRequest` message to the actor by calling the `send` method on the `Addr`. This returns a `Response` that we can await.

- We then match on the `Response` to determine what the actor sent back to us.
