# TCP Listener API

## TCP

`TCP` is a protocol that is used to establish a connection between two devices. It is a connection-oriented protocol, which means that it establishes a connection before sending data and ensures that the data is delivered in the correct order. TCP is widely used in applications that require reliable data transfer, such as web browsing, email, and file transfer.

## TCP Listener in Rust

In Rust, you can create a TCP listener using the `TcpListener` struct from the `std::net` module. The `TcpListener` struct allows you to listen for incoming TCP connections on a specific port and address. Here is an example of how to create a TCP listener in Rust with `tokio`:

```rust
use tokio::{
    io::{AsyncReadExt, AsyncWriteExt},
    net::TcpListener,
};

#[tokio::main]
async fn main() -> std::io::Result<()> {

    let listener = TcpListener::bind("127.0.0.1:8080").await?;

    loop {
        let (mut socket, _) = listener.accept().await?;

        tokio::spawn(async move {
            if let Err(e) = handle_connection(&mut socket).await {
                error!("Failed to handle connection: {}", e);
                eprintln!("Failed to handle connection: {}", e);
            }
        });
    }
}
```

In this example, we create a `TcpListener` that listens for incoming connections on `127.0.0.1:8080`. When a connection is established, we spawn a new task to handle the connection asynchronously. The `handle_connection` function is responsible for processing the incoming data and responding to the client.

```rust
async fn handle_connection(socket: &mut tokio::net::TcpStream) -> std::io::Result<()> {
    let mut buf = [0; 1024];
    let n = socket.read(&mut buf).await?;

    if n == 0 {
        return Ok(());
    }

    let request = String::from_utf8_lossy(&buf[..n]);
    println!("Received request: {}", request);

    let response = "Hello, world!\n";
    socket.write_all(response.as_bytes()).await?;

    Ok(())
}
```

You might run into problems with the buffer size, as the buffer size is fixed in this example. You can handle this by dynamically resizing the buffer or using a more advanced buffer management system.

We can us a `loop` in which we read the incoming data in chunks, process it accordingly and break if the read size equals 0. This way, we can handle large amounts of data without running into buffer size limitations.

```rust
async fn handle_connection(socket: &mut tokio::net::TcpStream) -> std::io::Result<()> {
    let mut buf = vec![0; 1024];

    loop {
        let n = socket.read(&mut buf).await?;

        if n == 0 {
            break;
        }

        let request = String::from_utf8_lossy(&buf[..n]);
        println!("Received request: {}", request);

        let response = "Hello, world!\n";
        socket.write_all(response.as_bytes()).await?;
    }

    Ok(())
}
```

What you also might want to do, is to clear the buffer after each iteration, to avoid processing old data. You can do this by calling `buf.clear()` at the end of the loop.

```rust
async fn handle_connection(socket: &mut tokio::net::TcpStream) -> std::io::Result<()> {
    let mut buf = vec![0; 1024];

    loop {
        let n = socket.read(&mut buf).await?;

        if n == 0 {
            break;
        }

        let request = String::from_utf8_lossy(&buf[..n]);
        println!("Received request: {}", request);

        let response = "Hello, world!\n";
        socket.write_all(response.as_bytes()).await?;

        buf.clear();
    }

    Ok(())
}
```

Or you use another `Vec` to store the incoming data:

```rust
let mut buffer = [0; 4096];
let mut request = Vec::new();

loop {
    let bytes_read = socket.read(&mut buffer).await?;

    if bytes_read == 0 {
        break;
    }

    request.extend_from_slice(&buffer[..bytes_read]);
}
```
