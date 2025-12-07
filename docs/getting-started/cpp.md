---
sidebar_position: 4
---

# C/C++ Getting Started

Learn how to install and use KeraDB in your C and C++ applications.

## Installation

### Using CMake

```bash
cd sdks/cpp
mkdir build && cd build
cmake ..
make
sudo make install
```

### Manual Compilation

**C Example:**
```bash
gcc -o myapp main.c -L/path/to/keradb/target/release -lkeradb -I/path/to/keradb/include
```

**C++ Example:**
```bash
g++ -std=c++11 -o myapp main.cpp -L/path/to/keradb/target/release -lkeradb -I/path/to/keradb/include
```

## Requirements

- C compiler (GCC, Clang, MSVC)
- C++11 or higher (for C++ wrapper)
- CMake 3.10+ (optional)
- KeraDB native library

## Quick Start

### C API

```c
#include "keradb.h"
#include <stdio.h>
#include <stdlib.h>

int main() {
    // Create database
    KeraDB db = keradb_create("mydb.ndb");
    if (!db) {
        fprintf(stderr, "Failed to create database\n");
        return 1;
    }
    
    // Insert document
    const char* json = "{\"name\":\"Alice\",\"age\":30}";
    char* id = keradb_insert(db, "users", json);
    if (id) {
        printf("Inserted ID: %s\n", id);
        keradb_free_string(id);
    }
    
    // Find by ID
    char* doc = keradb_find_by_id(db, "users", id);
    if (doc) {
        printf("Found: %s\n", doc);
        keradb_free_string(doc);
    }
    
    // Close
    keradb_close(db);
    return 0;
}
```

### C++ API

The C++ wrapper provides a modern, RAII-based interface with automatic memory management and exception handling.

```cpp
#include "keradb.hpp"
#include <iostream>

int main() {
    try {
        // Create database
        auto db = keradb::Database::create("mydb.ndb");
        
        // Insert document
        auto id = db.insert("users", R"({
            "name": "Alice",
            "age": 30,
            "email": "alice@example.com"
        })");
        std::cout << "Inserted ID: " << id << std::endl;
        
        // Find by ID
        auto doc = db.findById("users", id);
        std::cout << "Found: " << doc << std::endl;
        
        // Update
        auto updated = db.update("users", id, R"({
            "name": "Alice Smith",
            "age": 31
        })");
        std::cout << "Updated: " << updated << std::endl;
        
        // Find all
        auto users = db.findAll("users");
        std::cout << "All users: " << users << std::endl;
        
        // Count
        int count = db.count("users");
        std::cout << "Total users: " << count << std::endl;
        
        // Delete
        db.remove("users", id);
        
        // Sync to disk
        db.sync();
        
    } catch (const keradb::Exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
    
    return 0;
}
```

## C API Reference

### Database Operations

| Function | Description |
|----------|-------------|
| `KeraDB keradb_create(const char* path)` | Create a new database |
| `KeraDB keradb_open(const char* path)` | Open an existing database |
| `void keradb_close(KeraDB db)` | Close database |
| `int keradb_sync(KeraDB db)` | Sync changes to disk |

### Document Operations

| Function | Description |
|----------|-------------|
| `char* keradb_insert(db, collection, json_data)` | Insert a document |
| `char* keradb_find_by_id(db, collection, doc_id)` | Find document by ID |
| `char* keradb_update(db, collection, doc_id, json_data)` | Update a document |
| `int keradb_delete(db, collection, doc_id)` | Delete a document |
| `char* keradb_find_all(db, collection, limit, skip)` | Find all documents |
| `int keradb_count(db, collection)` | Count documents |
| `char* keradb_list_collections(db)` | List all collections |

### Memory Management

| Function | Description |
|----------|-------------|
| `void keradb_free_string(char* s)` | Free strings returned by KeraDB |

:::warning Important
Always free strings returned by KeraDB functions using `keradb_free_string()` to avoid memory leaks.
:::

## C++ API Reference

The C++ wrapper provides RAII and exception-safe interface:

### Database Class

```cpp
namespace keradb {
    class Database {
    public:
        // Factory methods
        static Database create(const std::string& path);
        static Database open(const std::string& path);
        
        // CRUD operations
        std::string insert(const std::string& collection, const std::string& json);
        std::string findById(const std::string& collection, const std::string& id);
        std::string update(const std::string& collection, const std::string& id, const std::string& json);
        void remove(const std::string& collection, const std::string& id);
        
        // Query operations
        std::string findAll(const std::string& collection, int limit = -1, int skip = 0);
        int count(const std::string& collection);
        std::string listCollections();
        
        // Database operations
        void sync();
        void close();
        bool isOpen() const;
        const std::string& path() const;
    };
}
```

### Exception Handling

```cpp
try {
    auto db = keradb::Database::create("mydb.ndb");
    db.insert("users", "{\"name\":\"Alice\"}");
} catch (const keradb::Exception& e) {
    std::cerr << "KeraDB Error: " << e.what() << std::endl;
}
```

## Performance Benchmarks

The C++ SDK includes benchmarks comparing KeraDB vs SQLite performance.

### Running Benchmarks

**Windows (PowerShell):**
```powershell
cd sdks/cpp
.\build-benchmark.ps1 -Run
```

### Benchmark Results

*Tested on Windows 11, Intel Core i7, Release build*

#### Small Dataset (100 records)

| Operation | KeraDB (ms) | SQLite (ms) | Speedup |
|-----------|-------------|-------------|---------|
| INSERT | 3.05 | 44.06 | **14.5x faster** |
| READ BY ID | 0.27 | 1.00 | **3.7x faster** |
| COUNT (100x) | 0.02 | 0.94 | **46x faster** |
| UPDATE | 1.52 | 33.36 | **22x faster** |
| DELETE | 0.75 | 45.62 | **61x faster** |

#### Large Dataset (10,000 records)

| Operation | KeraDB (ms) | SQLite (ms) | Speedup |
|-----------|-------------|-------------|---------|
| READ BY ID | 6.99 | 11.30 | **1.62x faster** |
| COUNT (100x) | 0.01 | 1.02 | **137x faster** |
| UPDATE | 7.39 | 37.69 | **5.1x faster** |
| DELETE | 7.89 | 36.99 | **4.7x faster** |

### Performance Summary

**KeraDB excels at:**
- ✅ **COUNT operations** - 46-137x faster (in-memory metadata)
- ✅ **Single document lookups** - 1.6-3.7x faster
- ✅ **Updates** - 5-22x faster
- ✅ **Deletes** - 4.5-61x faster

**SQLite excels at:**
- ✅ **Bulk inserts** at large scale
- ✅ **Table scans** (READ ALL)

## Building from Source

### Prerequisites

- CMake 3.10+
- C++11 compatible compiler
- KeraDB library (build with `cargo build --release`)

### Build Steps

```bash
# Build KeraDB library first
cd keradb
cargo build --release

# Build C++ SDK
cd ../sdks/cpp
mkdir build && cd build
cmake ..
make

# Run examples
./basic_example
./basic_c_example
```

## Platform Support

| Platform | Compiler | Status |
|----------|----------|--------|
| Windows | MSVC 2019+ | ✅ Supported |
| Windows | MinGW-w64 | ✅ Supported |
| Linux | GCC 7+ | ✅ Supported |
| Linux | Clang 6+ | ✅ Supported |
| macOS | Clang | ✅ Supported |

## Next Steps

- [Query Guide](/docs/query-guide) - Learn advanced querying
- [API Reference](/docs/api-reference/core-concepts) - Core concepts
- [Examples](/docs/examples) - More code examples
