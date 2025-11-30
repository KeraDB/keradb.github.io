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

For development from source:

```toml
[dependencies]
keradb = { path = "path/to/keradb" }
serde_json = "1.0"
```

## Requirements

- Rust 1.70 or higher
- Cargo

## Quick Start

### Creating a Database

```rust
use keradb::Database;
use serde_json::json;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Create a new database file
    let db = Database::create("mydata.ndb")?;
    
    // Or open an existing database
    // let db = Database::open("mydata.ndb")?;
    
    Ok(())
}
```

### Inserting Documents

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

### Finding Documents

```rust
use keradb::Database;
use serde_json::json;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let db = Database::create("mydata.ndb")?;
    
    // Insert a document first
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

### Updating Documents

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

### Deleting Documents

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

### Collection Operations

```rust
use keradb::Database;
use serde_json::json;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let db = Database::create("mydata.ndb")?;
    
    // Insert some documents
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

### Custom Configuration

```rust
use keradb::{Database, Config};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = Config {
        page_size: 8192,      // Page size in bytes
        cache_size: 1000,     // Number of pages to cache
        ..Default::default()
    };
    
    let db = Database::create_with_config("mydata.ndb", config)?;
    
    Ok(())
}
```

### Error Handling

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
        (vec![0.5, 0.5, 0.5, 0.5], json!({"label": "center", "category": "special"})),
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
        println!("  • {} (score: {:.4})", 
                 result.document.metadata["label"],
                 result.score);
    }
    
    Ok(())
}
```

### Distance Metrics

KeraDB supports multiple distance metrics for vector similarity:

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

### Vector Collection Stats

```rust
use keradb::{Database, VectorConfig, Distance};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let db = Database::create("vectors.ndb")?;
    
    let config = VectorConfig::new(384).with_distance(Distance::Cosine);
    db.create_vector_collection("embeddings", config)?;
    
    // Get collection statistics
    let stats = db.vector_stats("embeddings")?;
    
    println!("Vector Collection Stats:");
    println!("  Vectors: {}", stats.vector_count);
    println!("  Dimensions: {}", stats.dimensions);
    println!("  Distance Metric: {}", stats.distance.name());
    
    Ok(())
}
```

### LEANN-Style Compression (97% Storage Savings)

KeraDB supports LEANN-inspired compression for massive storage savings:

```rust
use keradb::{Database, VectorConfig, Distance, CompressionConfig};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let db = Database::create("compressed.ndb")?;
    
    // Enable delta compression (up to 97% storage savings)
    let config = VectorConfig::new(384)
        .with_distance(Distance::Cosine)
        .with_delta_compression();
    
    db.create_vector_collection("embeddings", config)?;
    
    // Or use quantized compression for even more savings
    let quantized_config = VectorConfig::new(384)
        .with_quantized_compression();
    
    db.create_vector_collection("quantized_embeddings", quantized_config)?;
    
    Ok(())
}
```

### Lazy Embeddings (Text-to-Vector)

Store text and compute embeddings on-demand:

```rust
use keradb::{Database, VectorConfig};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let db = Database::create("lazy.ndb")?;
    
    // Enable lazy embedding mode with model name
    let config = VectorConfig::new(384)
        .with_lazy_embedding("all-MiniLM-L6-v2");
    
    db.create_vector_collection("documents", config)?;
    
    // Insert text (embedding computed on-demand during search)
    // db.insert_text("documents", "This is a sample document", metadata)?;
    
    Ok(())
}
```

## Complete Example

Here's a complete example demonstrating all major features:

```rust
use keradb::{Database, VectorConfig, Distance};
use serde_json::json;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // ============================================
    // Document Database Operations
    // ============================================
    
    let db = Database::create("complete_example.ndb")?;
    
    // Insert users
    let alice_id = db.insert("users", json!({
        "name": "Alice Johnson",
        "email": "alice@example.com",
        "age": 28,
        "department": "Engineering"
    }))?;
    
    let bob_id = db.insert("users", json!({
        "name": "Bob Smith",
        "email": "bob@example.com",
        "age": 35,
        "department": "Marketing"
    }))?;
    
    println!("Created users: {}, {}", alice_id, bob_id);
    
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
    
    // List all users
    let all_users = db.find_all("users", None, None)?;
    println!("Total users: {}", all_users.len());
    
    // Collection stats
    println!("User count: {}", db.count("users"));
    
    // ============================================
    // Vector Database Operations
    // ============================================
    
    let vector_config = VectorConfig::new(4)
        .with_distance(Distance::Cosine);
    
    db.create_vector_collection("product_embeddings", vector_config)?;
    
    // Insert product embeddings with metadata
    let products = vec![
        (vec![0.9, 0.1, 0.0, 0.0], json!({"name": "Laptop", "category": "Electronics"})),
        (vec![0.8, 0.2, 0.1, 0.0], json!({"name": "Tablet", "category": "Electronics"})),
        (vec![0.1, 0.9, 0.0, 0.0], json!({"name": "Shirt", "category": "Clothing"})),
        (vec![0.2, 0.8, 0.1, 0.0], json!({"name": "Pants", "category": "Clothing"})),
    ];
    
    for (embedding, metadata) in products {
        db.insert_vector("product_embeddings", embedding, Some(metadata))?;
    }
    
    // Search for products similar to "electronics-like" query
    let query = vec![0.85, 0.15, 0.05, 0.0];
    let similar_products = db.vector_search("product_embeddings", &query, 2)?;
    
    println!("\nProducts similar to electronics query:");
    for result in similar_products {
        println!("  • {} (score: {:.4})", 
                 result.document.metadata["name"], 
                 result.score);
    }
    
    // Sync and cleanup
    db.sync()?;
    
    // Clean up demo file
    std::fs::remove_file("complete_example.ndb").ok();
    
    println!("\n✅ Complete example finished successfully!");
    
    Ok(())
}
```

## API Reference

### Database

#### Creation and Opening

| Method | Description |
|--------|-------------|
| `Database::create(path)` | Create a new database file |
| `Database::create_with_config(path, config)` | Create with custom configuration |
| `Database::open(path)` | Open an existing database |
| `Database::open_with_config(path, config)` | Open with custom configuration |

#### Document Operations

| Method | Description |
|--------|-------------|
| `insert(collection, data)` | Insert a document, returns document ID |
| `find_by_id(collection, id)` | Find a document by ID |
| `update(collection, id, data)` | Update/replace a document |
| `delete(collection, id)` | Delete a document |
| `find_all(collection, limit, skip)` | Find all documents with pagination |

#### Collection Operations

| Method | Description |
|--------|-------------|
| `count(collection)` | Count documents in a collection |
| `list_collections()` | List all collections with counts |
| `sync()` | Flush all changes to disk |

#### Vector Operations

| Method | Description |
|--------|-------------|
| `create_vector_collection(name, config)` | Create a vector-enabled collection |
| `insert_vector(collection, vector, metadata)` | Insert a vector with optional metadata |
| `vector_search(collection, query, k)` | Search for k nearest neighbors |
| `vector_stats(collection)` | Get vector collection statistics |

### Types

| Type | Description |
|------|-------------|
| `Document` | A document with ID and JSON data |
| `VectorConfig` | Configuration for vector collections |
| `VectorDocument` | A vector with ID, embedding, and metadata |
| `VectorSearchResult` | Search result with document and score |
| `Distance` | Distance metric enum (Cosine, Euclidean, DotProduct, Manhattan) |
| `KeraDBError` | Error type for database operations |

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

- [Core Concepts](/docs/core-concepts) - Understand KeraDB fundamentals
- [Examples](/docs/examples) - More usage examples
- [Query Guide](/docs/query-guide) - Advanced querying techniques
