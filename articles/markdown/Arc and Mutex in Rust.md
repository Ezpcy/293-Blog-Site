# Arc and Mutex in Rust

In Rust, `Arc` and `Mutex` are both types that are used for concurrent programming.

`Arc` stands for "Atomically Reference Counted". It is a type that allows multiple ownership of a value, and ensures that the value is only dropped when all owners have released it. `Arc` is used to share data between multiple threads in a thread-safe way. When you clone an `Arc`, it increments the reference count, and when an `Arc` is dropped, it decrements the reference count. When the reference count reaches zero, the value is dropped.

`Mutex` stands for "Mutual Exclusion". It is a type that provides a way to synchronize access to a shared resource. `Mutex` ensures that only one thread can access the shared resource at a time. When a thread acquires a `Mutex`, it gains exclusive access to the shared resource, and all other threads that try to acquire the `Mutex` will be blocked until the first thread releases it.

In the given code snippet, `Arc` and `Mutex` are used together to create a thread-safe shared data structure. The `Arc` is used to allow multiple threads to own the data structure, and the `Mutex` is used to synchronize access to the data structure to ensure that only one thread can modify it at a time.

Here's an example of using `Arc` and `Mutex` together to create a thread-safe shared data structure:

```rust
use std::sync::{Arc, Mutex};
use std::thread;

struct Counter {
    count: u32,
}

impl Counter {
    fn new() -> Counter {
        Counter { count: 0 }
    }

    fn increment(&mut self) {
        self.count += 1;
    }

    fn get_count(&self) -> u32 {
        self.count
    }
}

fn main() {
    let counter = Arc::new(Mutex::new(Counter::new()));

    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut counter = counter.lock().unwrap();
            counter.increment();
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    let counter = counter.lock().unwrap();
    println!("Final count: {}", counter.get_count());
}
```

In this example, we define a `Counter` struct with a `count` field and methods to increment the count and get the current count. We then create an `Arc` of a `Mutex` that wraps the `Counter` struct to make it thread-safe.

We create 10 threads that each increment the count of the `Counter` struct. We use `Arc::clone()` to create a new reference to the `Arc` that we can pass to each thread. In each thread, we lock the `Mutex` using `lock().unwrap()` to gain exclusive access to the `Counter` struct, increment the count, and then release the lock.

After all the threads have finished, we lock the `Mutex` again to get the final count and print it to the console.
