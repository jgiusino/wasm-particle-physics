<div align="center">

  <h1><code>wasm-particle-physics</code></h1>

  <strong>A WebAssembly program to perform particle physics</strong>

  <sub>Built with 🦀🕸 by <a href="https://rustwasm.github.io/">The Rust and WebAssembly Working Group</a></sub>
</div>

## About

This particle physics simualtion is written in Rust and compiled into WebAssembly using `wasm-pack`.

## 🚴 Usage

Clone this repository
```
git clone https://github.com/jgiusino/wasm-particle-physics.git
```

### 🛠️ Build with `wasm-pack build`

```
wasm-pack build
```

### Run Web Server
```
cd www
npm install
npm run start
```

## 🔋 Batteries Included

* [`wasm-bindgen`](https://github.com/rustwasm/wasm-bindgen) for communicating
  between WebAssembly and JavaScript.
* [`console_error_panic_hook`](https://github.com/rustwasm/console_error_panic_hook)
  for logging panic messages to the developer console.
* [`wee_alloc`](https://github.com/rustwasm/wee_alloc), an allocator optimized
  for small code size.
