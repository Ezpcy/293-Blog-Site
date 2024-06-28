# Running Tests with Rust

## The `test` Attribute

In simple term, the `test` attribute is used to mark a function as a test function. When you run `cargo test`, Rust will compile the test functions into a test harness and run them.

```rust
#[test]
fn test_function() {
    assert_eq!(1, 1);
}
```

### Testing flags

- `#[ignore]` - This attribute is used to ignore a test function.
- `#[should_panic]` - This attribute is used to test that a function panics.
- `#[should_panic(expected = "error message")]` - This attribute is used to test that a function panics with a specific error message.

```rust
#[test]
#[should_panic]
fn test_function() {
    panic!("This test should panic");
}
```

There are also other attributes that can be used to test functions.

## Running Tests

To run tests, you can use the `cargo test` command. This command will compile the test functions into a test harness and run them.

```bash
cargo test
```

## Running a Single Test

To run a single test, you can use the `--test` flag with the `cargo test` command.

```bash
cargo test --test test_function
```

## Running Multiple Tests

To run multiple tests, you can use the `--test` flag with the `cargo test` command.

```bash
cargo test --test test_function1 --test test_function2
```

## Running Tests in Parallel

To run tests in parallel, you can use the `--jobs` flag with the `cargo test` command.

```bash
cargo test --jobs 4
```

## The `tests` Module

You can also create a `tests` module to organize your test functions.

```rust
#[cfg(test)]
mod tests {
    #[test]
    fn test_function1() {
        assert_eq!(1, 1);
    }

    #[test]
    fn test_function2() {
        assert_eq!(2, 2);
    }
}
```

## The `tests` Directory

You can also create a `tests` directory to organize your test functions, create a tests folder at the root of your project.

```rust
#[cfg(test)]
mod tests {
    #[test]
    fn test_function1() {
        assert_eq!(1, 1);
    }

    #[test]
    fn test_function2() {
        assert_eq!(2, 2);
    }
}
```
