---
sidebar_position: 1
slug: /
---

# Welcome to KeraDB

KeraDB is a lightweight, embedded NoSQL document database written in Rust. It provides high-performance data storage with SDKs for multiple programming languages including Node.js, Python, Rust, Go, Java, Kotlin, Swift, C#, C/C++, PHP, Flutter, React Native, and Objective-C.

## Key Features

- **High Performance**: Written in Rust for maximum speed and safety
- **Embedded Database**: No separate server required - runs in your application
- **Vector Database**: Built-in similarity search for AI/ML embeddings and RAG applications
- **Multi-Language SDKs**: Available for 13+ programming languages
- **Simple API**: Clean, intuitive CRUD operations
- **Lightweight**: Minimal dependencies and small footprint
- **Cross-Platform**: Works on Windows, macOS, Linux, iOS, and Android
- **Persistent Storage**: Data is stored on disk with automatic syncing

## Quick Start

Get started with KeraDB in your preferred language:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```bash
npm install keradb
```

```javascript
const { Database } = require('keradb');

// Create a new database
const db = Database.create('myapp.ndb');

// Insert a document
const id = db.insert('users', {
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
});

console.log('Inserted document with ID:', id);

// Find by ID
const user = db.findById('users', id);
console.log('Found:', user);

// Update document
db.update('users', id, {
  name: 'John Doe',
  email: 'john@example.com',
  age: 31
});

// Find all documents
const allUsers = db.findAll('users');
console.log('All users:', allUsers);

// Close when done
db.close();
```

  </TabItem>
  <TabItem value="python" label="Python">

```bash
pip install keradb
```

```python
from keradb import Database

# Create a new database
db = Database.create('myapp.ndb')

# Insert a document
doc_id = db.insert('users', {
    'name': 'John Doe',
    'email': 'john@example.com',
    'age': 30
})

print(f'Inserted document with ID: {doc_id}')

# Find by ID
user = db.find_by_id('users', doc_id)
print(f'Found: {user}')

# Update document
db.update('users', doc_id, {
    'name': 'John Doe',
    'email': 'john@example.com',
    'age': 31
})

# Find all documents
all_users = db.find_all('users')
print(f'All users: {all_users}')

# Close when done
db.close()
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```toml
[dependencies]
keradb = "0.1"
serde_json = "1.0"
```

```rust
use keradb::Database;
use serde_json::json;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Create a new database
    let db = Database::create("myapp.ndb")?;

    // Insert a document
    let id = db.insert("users", json!({
        "name": "John Doe",
        "email": "john@example.com",
        "age": 30
    }))?;

    println!("Inserted document with ID: {}", id);

    // Find by ID
    let user = db.find_by_id("users", &id)?;
    println!("Found: {:?}", user);

    // Update document
    db.update("users", &id, json!({
        "name": "John Doe",
        "email": "john@example.com",
        "age": 31
    }))?;

    // Find all documents
    let all_users = db.find_all("users", None, None)?;
    println!("All users: {:?}", all_users);

    Ok(())
}
```

  </TabItem>
  <TabItem value="go" label="Go">

```bash
go get github.com/keradb/keradb-go
```

```go
package main

import (
    "fmt"
    "log"
    
    "github.com/keradb/keradb-go"
)

func main() {
    // Create a new database
    db, err := keradb.Create("myapp.ndb")
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    // Insert a document
    id, err := db.Insert("users", map[string]interface{}{
        "name":  "John Doe",
        "email": "john@example.com",
        "age":   30,
    })
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("Inserted document with ID: %s\n", id)

    // Find by ID
    user, err := db.FindByID("users", id)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("Found: %v\n", user)

    // Find all documents
    allUsers, err := db.FindAll("users", nil)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("All users: %v\n", allUsers)
}
```

  </TabItem>
</Tabs>

## Why KeraDB?

KeraDB is perfect for applications that need a simple, embedded database without the overhead of running a separate database server. Common use cases include:

- **Desktop Applications**: Electron, Tauri, or native desktop apps
- **Mobile Apps**: iOS, Android, Flutter, and React Native applications
- **CLI Tools**: Command-line applications that need local storage
- **Embedded Systems**: IoT devices and edge computing
- **Development & Testing**: Local development without database setup
- **Prototyping & MVPs**: Quickly build and iterate on ideas

## Supported Languages

| Language | Package | Status |
|----------|---------|--------|
| **Node.js/TypeScript** | `npm install keradb` | ✅ Stable |
| **Python** | `pip install keradb` | ✅ Stable |
| **Rust** | `keradb = "0.1"` | ✅ Stable |
| **Go** | `go get github.com/keradb/keradb-go` | ✅ Stable |
| **Java** | Maven/Gradle | ✅ Stable |
| **Kotlin** | Maven/Gradle | ✅ Stable |
| **C#/.NET** | `dotnet add package keradb` | ✅ Stable |
| **Swift** | Swift Package Manager | ✅ Stable |
| **C/C++** | CMake/Header-only | ✅ Stable |
| **PHP** | Composer | ✅ Stable |
| **Flutter/Dart** | `flutter pub add keradb_flutter` | ✅ Stable |
| **React Native** | `npm install keradb-react-native` | ✅ Stable |
| **Objective-C** | CocoaPods | ✅ Stable |

## Next Steps

- [Node.js Getting Started Guide](/docs/getting-started/nodejs)
- [Python Getting Started Guide](/docs/getting-started/python)
- [Rust Getting Started Guide](/docs/getting-started/rust)
- [Examples](/docs/examples)
- [Query Guide](/docs/query-guide)
