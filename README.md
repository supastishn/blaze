# ts2cpp

A simple compiler to translate a subset of TypeScript into modern C++.

## Live Demo

This repository contains a React-based web application that demonstrates the compiler's functionality in real-time. You can try it out on GitHub Pages.

The demo is deployed from the `examples/react` directory via a GitHub Action. You can find the live version under the "Pages" section of this repository's settings, or by navigating to `https://<your-github-username>.github.io/ts2cpp/`.

## Features

*   Translates a subset of TypeScript to C++.
*   Supports:
    *   Variable declarations (`let`).
    *   Basic arithmetic (`+`, `-`, `*`, `/`).
    *   Control flow statements (`if`/`else`, `while`, `for`).
    *   Functions, including parameters and `return` statements.
    *   Classes with constructors, methods, and `this` keyword.
    *   `new` keyword for object instantiation.
    *   `console.log` mapped to `std::cout`.
    *   Literals: numbers, strings, booleans.
    *   Arrays and Objects (mapped to `std::vector<std::any>` and `std::map<std::string, std::any>`).
    *   Member access (`.`, `[]`).
    *   Logical operators (`&&`, `||`).
*   Generates modern C++ (C++17) using `std::any`, `std::vector`, `std::map`, and smart pointers.
*   CLI tool for compiling files.
*   Packaged as a Single Executable Application (SEA) for Node.js.
*   Provides pre-built binaries for Linux (x64, arm64) and Windows (x64) via GitHub Releases.

## Installation

You can download pre-built binaries for Linux and Windows from the Releases page of this repository.

## Usage

Once you have the executable, you can use it to compile a TypeScript file:

**Linux/macOS:**
```bash
./ts2cpp-linux-x64 compile your-script.ts -o output.cpp
```

**Windows:**
```powershell
./ts2cpp-windows-x64.exe compile your-script.ts -o output.cpp
```

### Options

*   `<source>`: The path to the source TypeScript file.
*   `-o, --output <file>`: The path to write the C++ output file. If omitted, the output is printed to standard output.

## Building from Source

To build the project from source, you need Node.js (v22 or later) and `npm`.

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/<your-github-username>/ts2cpp.git
    cd ts2cpp
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **(Optional) Download Node.js binaries for cross-platform packaging:**

    The project can package itself into standalone executables for different platforms. To do this, it needs the corresponding Node.js binaries. A helper script is provided to download them.

    ```bash
    npm run get-deps
    ```

    This will download Node.js for Linux and Windows into the `dist-bin/` directory.

4.  **Build and package the application:**

    ```bash
    npm run package
    ```

    This script will:
    1.  Compile the TypeScript source code (`npm run build`).
    2.  Bundle it for the SEA (`npm run bundle`).
    3.  Create the single executable files in the `dist-sea/` directory.

    If you only want to build for your local platform, the script will do that automatically. If `dist-bin/` contains other platform binaries, it will attempt to build for those as well.

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.
