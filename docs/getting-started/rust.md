---
sidebar_position: 3
---

# Rust SDK

Learn how to install and use KeraDB in your Rust applications. KeraDB is written natively in Rust, providing the best performance and most complete feature set.

## Installation

Add KeraDB to your `Cargo.toml`:

```toml
[dependencies]
keradb = "0.1"
serde_json = "1.0"
```

## Requirements

- Rust 1.70 or higher
- Cargo

## Quick Start

```rust
use keradb::Database;
use serde_json::json;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Create a database
    let db = Database::create("mydata.ndb")?;
    
    // Insert a document
    let id = db.insert("users", json!({
        "name": "Alice",
        "email": "alice@example.com"
    }))?;
    
    // Find the document
    let user = db.find_by_id("users", &id)?;
    println!("Found: {:?}", user);
    
    Ok(())
}
```

## Database

The database is the top-level container for your data. Each database is stored in a single file.

### Creating a Database

```rust
use keradb::{Database, Config};
use serde_json::json;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Create a new database file
    let db = Database::create("mydata.ndb")?;
    
    // Or open an existing database
    // let db = Database::open("mydata.ndb")?;
    
    // With custom configuration
    let config = Config {
        page_size: 8192,      // Page size in bytes
        cache_size: 1000,     // Number of pages to cache
        ..Default::default()
    };
    let db = Database::create_with_config("mydata.ndb", config)?;
    
    Ok(())
}
```

### Database Methods

| Method | Description |
|--------|-------------|
| `Database::create(path)` | Create a new database file |
| `Database::open(path)` | Open an existing database |
| `insert(collection, data)` | Insert a document |
| `find_by_id(collection, id)` | Find a document by ID |
| `find_all(collection, limit, skip)` | Find all documents |
| `update(collection, id, data)` | Update a document |
| `delete(collection, id)` | Delete a document |
| `count(collection)` | Count documents |
| `list_collections()` | List all collections |
| `sync()` | Flush changes to disk |

## Collections

Collections are groups of related documents, analogous to tables in relational databases.

### Working with Collections

```rust
use keradb::Database;
use serde_json::json;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let db = Database::create("mydata.ndb")?;
    
    // Insert documents into collections (collections are created automatically)
    db.insert("users", json!({"name": "Alice"}))?;
    db.insert("users", json!({"name": "Bob"}))?;
    db.insert("posts", json!({"title": "Hello World"}))?;
    
    // Count documents in a collection
    let user_count = db.count("users");
    println!("Users: {}", user_count);
    
    // List all collections with their document counts
    let collections = db.list_collections();
    for (name, count) in collections {
        println!("Collection '{}': {} documents", name, count);
    }
    
    // Sync to disk (flush pending writes)
    db.sync()?;
    
    Ok(())
}
```

### Insert Operations

```rust
use keradb::Database;
use serde_json::json;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let db = Database::create("mydata.ndb")?;
    
    // Insert a single document
    let id = db.insert("users", json!({
        "name": "Alice Johnson",
        "email": "alice@example.com",
        "age": 28,
        "role": "developer"
    }))?;
    
    println!("Inserted document with ID: {}", id);
    
    Ok(())
}
```

### Query Operations

```rust
use keradb::Database;
use serde_json::json;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let db = Database::create("mydata.ndb")?;
    
    let id = db.insert("users", json!({
        "name": "Alice",
        "email": "alice@example.com"
    }))?;
    
    // Find by ID
    let doc = db.find_by_id("users", &id)?;
    println!("Found: {:?}", doc);
    
    // Find all documents in a collection
    let all_users = db.find_all("users", None, None)?;
    println!("Total users: {}", all_users.len());
    
    // Find with pagination (limit: 10, skip: 0)
    let page1 = db.find_all("users", Some(10), None)?;
    let page2 = db.find_all("users", Some(10), Some(10))?;
    
    Ok(())
}
```

### Update Operations

```rust
use keradb::Database;
use serde_json::json;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let db = Database::create("mydata.ndb")?;
    
    let id = db.insert("users", json!({
        "name": "Alice",
        "age": 28
    }))?;
    
    // Update the document (full replacement)
    db.update("users", &id, json!({
        "name": "Alice Johnson",
        "age": 29,
        "email": "alice@example.com"
    }))?;
    
    println!("Document updated successfully");
    
    Ok(())
}
```

### Delete Operations

```rust
use keradb::Database;
use serde_json::json;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let db = Database::create("mydata.ndb")?;
    
    let id = db.insert("users", json!({"name": "Alice"}))?;
    
    // Delete by ID
    db.delete("users", &id)?;
    println!("Document deleted");
    
    Ok(())
}
```

## Documents

Documents are JSON-like objects that store your data. Each document is stored in a collection.

### Document Structure

Documents are flexible and schema-free:

```rust
use keradb::Database;
use serde_json::json;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let db = Database::create("mydata.ndb")?;
    
    let user = json!({
        "name": "Alice Johnson",
        "email": "alice@example.com",
        "age": 28,
        "address": {
            "street": "123 Main St",
            "city": "San Francisco",
            "country": "USA"
        },
        "tags": ["developer", "rust", "python"],
        "metadata": {
            "login_count": 42
        }
    });
    
    db.insert("users", user)?;
    
    Ok(())
}
```

### Nested Documents

Documents can contain nested objects and arrays:

```rust
use keradb::Database;
use serde_json::json;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let db = Database::create("mydata.ndb")?;
    
    db.insert("posts", json!({
        "title": "Getting Started with KeraDB",
        "author": {
            "name": "Alice Johnson",
            "email": "alice@example.com"
        },
        "tags": ["database", "tutorial", "rust"],
        "comments": [
            {
                "user": "Bob",
                "text": "Great article!"
            },
            {
                "user": "Carol",
                "text": "Very helpful"
            }
        ]
    }))?;
    
    Ok(())
}
```

## Data Types

KeraDB supports standard JSON data types through `serde_json`:

| Type | Description | Example |
|------|-------------|---------|
| String | Text data | `json!("Hello World")` |
| Number | Integers and floats | `json!(42)`, `json!(3.14)` |
| Boolean | true/false | `json!(true)` |
| Object | Nested documents | `json!({"key": "value"})` |
| Array | Lists of values | `json!([1, 2, 3])` |
| Null | Null value | `json!(null)` |

```rust
use keradb::Database;
use serde_json::json;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let db = Database::create("mydata.ndb")?;
    
    db.insert("examples", json!({
        "string": "Hello World",
        "number": 42,
        "float": 3.14,
        "boolean": true,
        "object": {"nested": "value"},
        "array": [1, 2, 3],
        "null": null
    }))?;
    
    Ok(())
}
```

## Error Handling

```rust
use keradb::{Database, KeraDBError};
use serde_json::json;

fn main() {
    let db = match Database::create("mydata.ndb") {
        Ok(db) => db,
        Err(e) => {
            eprintln!("Failed to create database: {}", e);
            return;
        }
    };
    
    // Handle specific errors
    match db.find_by_id("users", "non-existent-id") {
        Ok(doc) => println!("Found: {:?}", doc),
        Err(KeraDBError::DocumentNotFound(id)) => {
            println!("Document {} not found", id);
        }
        Err(KeraDBError::CollectionNotFound(name)) => {
            println!("Collection {} not found", name);
        }
        Err(e) => println!("Error: {}", e),
    }
}
```

## Vector Search

KeraDB includes powerful vector database capabilities for AI/ML applications, similarity search, and semantic queries.

### Creating a Vector Collection

```rust
use keradb::{Database, VectorConfig, Distance};
use serde_json::json;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let db = Database::create("vectors.ndb")?;
    
    // Create a vector collection with configuration
    let config = VectorConfig::new(384)  // 384 dimensions
        .with_distance(Distance::Cosine)
        .with_m(16)                       // HNSW M parameter
        .with_ef_construction(200);       // HNSW ef_construction
    
    db.create_vector_collection("embeddings", config)?;
    
    Ok(())
}
```

### Inserting Vectors

```rust
use keradb::{Database, VectorConfig, Distance};
use serde_json::json;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let db = Database::create("vectors.ndb")?;
    
    let config = VectorConfig::new(4).with_distance(Distance::Cosine);
    db.create_vector_collection("embeddings", config)?;
    
    // Insert vectors with metadata
    let vectors = vec![
        (vec![1.0, 0.0, 0.0, 0.0], json!({"label": "north", "category": "direction"})),
        (vec![0.0, 1.0, 0.0, 0.0], json!({"label": "east", "category": "direction"})),
        (vec![0.7, 0.7, 0.0, 0.0], json!({"label": "northeast", "category": "direction"})),
    ];
    
    for (vector, metadata) in vectors {
        let id = db.insert_vector("embeddings", vector, Some(metadata))?;
        println!("Inserted vector with ID: {}", id);
    }
    
    Ok(())
}
```

### Vector Similarity Search

```rust
use keradb::{Database, VectorConfig, Distance};
use serde_json::json;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let db = Database::create("vectors.ndb")?;
    
    let config = VectorConfig::new(4).with_distance(Distance::Cosine);
    db.create_vector_collection("embeddings", config)?;
    
    // Insert some vectors
    db.insert_vector("embeddings", vec![1.0, 0.0, 0.0, 0.0], 
                     Some(json!({"label": "north"})))?;
    db.insert_vector("embeddings", vec![0.7, 0.7, 0.0, 0.0], 
                     Some(json!({"label": "northeast"})))?;
    db.insert_vector("embeddings", vec![0.0, 1.0, 0.0, 0.0], 
                     Some(json!({"label": "east"})))?;
    
    // Search for similar vectors
    let query = vec![0.8, 0.6, 0.0, 0.0];
    let results = db.vector_search("embeddings", &query, 3)?;
    
    println!("Top 3 similar vectors:");
    for result in results {
        println!("  - {} (score: {:.4})", 
                 result.document.metadata["label"],
                 result.score);
    }
    
    Ok(())
}
```

### Distance Metrics

```rust
use keradb::{VectorConfig, Distance};

// Cosine similarity (default) - best for normalized embeddings
let config = VectorConfig::new(384).with_distance(Distance::Cosine);

// Euclidean (L2) distance - best for spatial data
let config = VectorConfig::new(384).with_distance(Distance::Euclidean);

// Dot product - best for unnormalized embeddings
let config = VectorConfig::new(384).with_distance(Distance::DotProduct);

// Manhattan (L1) distance
let config = VectorConfig::new(384).with_distance(Distance::Manhattan);
```

### LEANN-Style Compression

KeraDB supports LEANN-inspired compression for massive storage savings (up to 97%):

```rust
use keradb::{Database, VectorConfig, Distance};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let db = Database::create("compressed.ndb")?;
    
    // Enable delta compression
    let config = VectorConfig::new(384)
        .with_distance(Distance::Cosine)
        .with_delta_compression();
    
    db.create_vector_collection("embeddings", config)?;
    
    // Or use quantized compression
    let quantized_config = VectorConfig::new(384)
        .with_quantized_compression();
    
    db.create_vector_collection("quantized_embeddings", quantized_config)?;
    
    Ok(())
}
```

## Complete Example

```rust
use keradb::{Database, VectorConfig, Distance};
use serde_json::json;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Document Database Operations
    let db = Database::create("complete_example.ndb")?;
    
    // Insert users
    let alice_id = db.insert("users", json!({
        "name": "Alice Johnson",
        "email": "alice@example.com",
        "age": 28,
        "department": "Engineering"
    }))?;
    
    println!("Created user: {}", alice_id);
    
    // Query users
    let alice = db.find_by_id("users", &alice_id)?;
    println!("Found Alice: {:?}", alice);
    
    // Update Alice
    db.update("users", &alice_id, json!({
        "name": "Alice Johnson",
        "email": "alice.johnson@example.com",
        "age": 29,
        "department": "Engineering",
        "promoted": true
    }))?;
    
    // Collection stats
    println!("User count: {}", db.count("users"));
    
    // Vector Database Operations
    let vector_config = VectorConfig::new(4)
        .with_distance(Distance::Cosine);
    
    db.create_vector_collection("product_embeddings", vector_config)?;
    
    // Insert product embeddings
    let products = vec![
        (vec![0.9, 0.1, 0.0, 0.0], json!({"name": "Laptop", "category": "Electronics"})),
        (vec![0.8, 0.2, 0.1, 0.0], json!({"name": "Tablet", "category": "Electronics"})),
        (vec![0.1, 0.9, 0.0, 0.0], json!({"name": "Shirt", "category": "Clothing"})),
    ];
    
    for (embedding, metadata) in products {
        db.insert_vector("product_embeddings", embedding, Some(metadata))?;
    }
    
    // Search for similar products
    let query = vec![0.85, 0.15, 0.05, 0.0];
    let similar_products = db.vector_search("product_embeddings", &query, 2)?;
    
    println!("\nProducts similar to electronics query:");
    for result in similar_products {
        println!("  - {} (score: {:.4})", 
                 result.document.metadata["name"], 
                 result.score);
    }
    
    // Sync and cleanup
    db.sync()?;
    std::fs::remove_file("complete_example.ndb").ok();
    
    println!("\nComplete example finished successfully!");
    
    Ok(())
}
```

## API Reference

### Document Operations

| Method | Description |
|--------|-------------|
| `insert(collection, data)` | Insert a document, returns document ID |
| `find_by_id(collection, id)` | Find a document by ID |
| `update(collection, id, data)` | Update/replace a document |
| `delete(collection, id)` | Delete a document |
| `find_all(collection, limit, skip)` | Find all documents with pagination |

### Vector Operations

| Method | Description |
|--------|-------------|
| `create_vector_collection(name, config)` | Create a vector-enabled collection |
| `insert_vector(collection, vector, metadata)` | Insert a vector with optional metadata |
| `vector_search(collection, query, k)` | Search for k nearest neighbors |
| `vector_stats(collection)` | Get vector collection statistics |

## Building from Source

```bash
# Clone the repository
git clone https://github.com/keradb/keradb.git
cd keradb

# Build in release mode
cargo build --release

# Run tests
cargo test

# Run examples
cargo run --example basic
cargo run --example vector_search
```

## Next Steps

- [Query Guide](/docs/query-guide) - Advanced querying techniques
- [Examples](/docs/examples) - More usage examples
