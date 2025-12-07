---
sidebar_position: 4
---

# C/C++ SDK

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

## Vector Database

KeraDB includes a powerful lightweight vector database for similarity search, making it ideal for AI/ML applications, semantic search, recommendations, and RAG (Retrieval-Augmented Generation) systems.

### Why Vector Database?

Modern AI applications often need to:
- Store embeddings from language models (OpenAI, Sentence Transformers, etc.)
- Find semantically similar documents or images
- Build recommendation systems
- Implement RAG for LLM applications

KeraDB's vector database provides all this functionality in a lightweight, embedded package—no separate vector database server required.

### Quick Start

```cpp
#include "keradb.hpp"
#include <iostream>
#include <vector>

int main() {
    try {
        auto db = keradb::Database::create("vectors.ndb");
        
        // Create a vector collection (384 dimensions for sentence embeddings)
        keradb::Database::VectorConfig config(384, keradb::Database::Distance::Cosine);
        db.createVectorCollection("embeddings", config);
        
        // Insert a vector with metadata
        std::vector<float> embedding(384, 0.0f);
        embedding[0] = 0.8f;
        embedding[1] = 0.6f;
        // ... fill with actual embedding values
        
        auto id = db.insertVector("embeddings", embedding, R"({
            "text": "Hello world",
            "category": "greeting",
            "language": "en"
        })");
        std::cout << "Inserted vector: " << id << std::endl;
        
        // Search for similar vectors
        std::vector<float> query(384, 0.0f);
        query[0] = 0.9f;
        query[1] = 0.5f;
        
        auto results = db.vectorSearch("embeddings", query, 5);
        std::cout << "Similar vectors: " << results << std::endl;
        
    } catch (const keradb::Exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
    return 0;
}
```

### Distance Metrics

KeraDB supports multiple distance metrics for different use cases:

| Metric | Enum Value | Best For | Description |
|--------|------------|----------|-------------|
| **Cosine** | `Distance::Cosine` | Text embeddings, normalized vectors | Measures angle between vectors (0 = identical, 1 = opposite) |
| **Euclidean** | `Distance::Euclidean` | Spatial data, image features | Straight-line distance in vector space |
| **Dot Product** | `Distance::DotProduct` | Pre-normalized vectors, recommendations | Inner product of vectors |
| **Manhattan** | `Distance::Manhattan` | High-dimensional sparse data | Sum of absolute differences |

```cpp
// Cosine similarity (default) - best for text embeddings
keradb::Database::VectorConfig textConfig(384, keradb::Database::Distance::Cosine);

// Euclidean distance - best for image features
keradb::Database::VectorConfig imageConfig(512, keradb::Database::Distance::Euclidean);

// Dot product - for pre-normalized vectors
keradb::Database::VectorConfig dotConfig(768, keradb::Database::Distance::DotProduct);

// Manhattan distance - for sparse high-dimensional data
keradb::Database::VectorConfig sparseConfig(1024, keradb::Database::Distance::Manhattan);
```

### Vector API Reference

#### Creating Vector Collections

```cpp
// VectorConfig constructor
VectorConfig(int dimensions, Distance metric = Distance::Cosine);

// Create collection
void createVectorCollection(const std::string& collection, const VectorConfig& config);
```

**Example:**
```cpp
// Create a collection for OpenAI embeddings (1536 dimensions)
keradb::Database::VectorConfig openaiConfig(1536, keradb::Database::Distance::Cosine);
db.createVectorCollection("openai_embeddings", openaiConfig);

// Create a collection for image features (512 dimensions)
keradb::Database::VectorConfig imageConfig(512, keradb::Database::Distance::Euclidean);
db.createVectorCollection("image_features", imageConfig);
```

#### Inserting Vectors

```cpp
std::string insertVector(
    const std::string& collection,
    const std::vector<float>& vector,
    const std::string& metadata = ""  // Optional JSON metadata
);
```

**Example:**
```cpp
// Insert with metadata
std::vector<float> embedding = getEmbedding("The quick brown fox");
auto id = db.insertVector("documents", embedding, R"({
    "text": "The quick brown fox",
    "source": "document1.txt",
    "page": 5,
    "category": "animals"
})");

// Insert without metadata
auto id2 = db.insertVector("documents", anotherEmbedding);
```

#### Similarity Search

```cpp
// Basic search - returns top K similar vectors
std::string vectorSearch(
    const std::string& collection,
    const std::vector<float>& query,
    int topK = 10
);

// Filtered search - with metadata filter
std::string vectorSearchFiltered(
    const std::string& collection,
    const std::vector<float>& query,
    int topK,
    const std::string& filter  // JSON filter
);
```

**Example:**
```cpp
// Find 5 most similar vectors
std::vector<float> queryVector = getEmbedding("A fox jumps");
auto results = db.vectorSearch("documents", queryVector, 5);

// Results format (JSON):
// [
//   {"id": "abc123", "score": 0.95, "metadata": {"text": "The quick brown fox", ...}},
//   {"id": "def456", "score": 0.87, "metadata": {"text": "A red fox runs", ...}},
//   ...
// ]

// Filtered search - only "animals" category
auto filtered = db.vectorSearchFiltered("documents", queryVector, 5, 
    R"({"category": "animals"})");

// Multiple filter conditions
auto multiFilter = db.vectorSearchFiltered("documents", queryVector, 10,
    R"({"category": "animals", "page": 5})");
```

#### Vector CRUD Operations

```cpp
// Get a vector by ID
std::string getVector(const std::string& collection, const std::string& vectorId);

// Delete a vector
void deleteVector(const std::string& collection, const std::string& vectorId);

// Update vector metadata (vector values cannot be changed)
void updateVectorMetadata(
    const std::string& collection,
    const std::string& vectorId,
    const std::string& metadata
);
```

**Example:**
```cpp
// Get vector details
auto vectorData = db.getVector("documents", vectorId);
// Returns: {"id": "abc123", "vector": [0.1, 0.2, ...], "metadata": {...}}

// Update metadata
db.updateVectorMetadata("documents", vectorId, R"({
    "text": "The quick brown fox",
    "reviewed": true,
    "timestamp": "2024-01-15T10:30:00Z"
})");

// Delete vector
db.deleteVector("documents", vectorId);
```

#### Collection Statistics

```cpp
// Get collection stats
std::string vectorStats(const std::string& collection);

// Count vectors
int vectorCount(const std::string& collection);
```

**Example:**
```cpp
auto stats = db.vectorStats("documents");
// Returns: {"vector_count": 1000, "dimensions": 384, "distance": "cosine"}

int count = db.vectorCount("documents");
std::cout << "Total vectors: " << count << std::endl;
```

### Complete Vector Search Example

Here's a complete example demonstrating all vector database features:

```cpp
#include "keradb.hpp"
#include <iostream>
#include <vector>
#include <cmath>

// Helper: Normalize vector for cosine similarity
std::vector<float> normalize(const std::vector<float>& v) {
    float norm = 0.0f;
    for (float x : v) norm += x * x;
    norm = std::sqrt(norm);
    
    std::vector<float> result(v.size());
    for (size_t i = 0; i < v.size(); ++i) {
        result[i] = v[i] / norm;
    }
    return result;
}

int main() {
    try {
        std::cout << "🚀 KeraDB Vector Database Example\n" << std::endl;
        
        // Create database
        auto db = keradb::Database::create("vector_demo.ndb");
        
        // Create vector collection (4D for demo, use 384+ for real embeddings)
        keradb::Database::VectorConfig config(4, keradb::Database::Distance::Cosine);
        db.createVectorCollection("embeddings", config);
        std::cout << "✅ Created vector collection" << std::endl;
        
        // Insert vectors representing directions
        struct Item {
            std::vector<float> vec;
            std::string meta;
            std::string name;
        };
        
        std::vector<Item> items = {
            {{1.0f, 0.0f, 0.0f, 0.0f}, R"({"type": "direction", "name": "north"})", "north"},
            {{0.0f, 1.0f, 0.0f, 0.0f}, R"({"type": "direction", "name": "east"})", "east"},
            {{0.7f, 0.7f, 0.0f, 0.0f}, R"({"type": "direction", "name": "northeast"})", "northeast"},
            {{0.5f, 0.5f, 0.5f, 0.5f}, R"({"type": "mixed", "name": "center"})", "center"},
            {{-1.0f, 0.0f, 0.0f, 0.0f}, R"({"type": "direction", "name": "south"})", "south"},
        };
        
        std::vector<std::string> ids;
        std::cout << "\n📥 Inserting vectors..." << std::endl;
        for (const auto& item : items) {
            auto id = db.insertVector("embeddings", item.vec, item.meta);
            ids.push_back(id);
            std::cout << "  • " << item.name << " -> " << id << std::endl;
        }
        
        // Similarity search
        std::cout << "\n🔍 Searching for vectors similar to [0.8, 0.6, 0, 0]..." << std::endl;
        std::vector<float> query = {0.8f, 0.6f, 0.0f, 0.0f};
        auto results = db.vectorSearch("embeddings", query, 3);
        std::cout << "Results: " << results << std::endl;
        
        // Filtered search
        std::cout << "\n🔍 Filtered search (type=direction only)..." << std::endl;
        auto filtered = db.vectorSearchFiltered("embeddings", query, 3, 
            R"({"type": "direction"})");
        std::cout << "Filtered: " << filtered << std::endl;
        
        // Get stats
        std::cout << "\n📊 Collection stats:" << std::endl;
        std::cout << db.vectorStats("embeddings") << std::endl;
        std::cout << "Vector count: " << db.vectorCount("embeddings") << std::endl;
        
        // Update metadata
        std::cout << "\n✏️ Updating metadata..." << std::endl;
        db.updateVectorMetadata("embeddings", ids[0], 
            R"({"type": "direction", "name": "north", "primary": true})");
        std::cout << "Updated: " << db.getVector("embeddings", ids[0]) << std::endl;
        
        // Delete a vector
        std::cout << "\n🗑️ Deleting vector..." << std::endl;
        db.deleteVector("embeddings", ids.back());
        std::cout << "New count: " << db.vectorCount("embeddings") << std::endl;
        
        // Cleanup
        db.sync();
        db.close();
        
        std::cout << "\n✨ Done!" << std::endl;
        
    } catch (const keradb::Exception& e) {
        std::cerr << "❌ Error: " << e.what() << std::endl;
        return 1;
    }
    
    return 0;
}
```

### Use Cases

#### 1. Semantic Document Search

```cpp
// Store document embeddings
for (const auto& doc : documents) {
    auto embedding = getEmbedding(doc.content);  // Your embedding model
    db.insertVector("docs", embedding, R"({
        "title": ")" + doc.title + R"(",
        "path": ")" + doc.path + R"("
    })");
}

// Search
auto queryEmb = getEmbedding("How to configure logging?");
auto results = db.vectorSearch("docs", queryEmb, 5);
```

#### 2. RAG (Retrieval-Augmented Generation)

```cpp
// Retrieve context for LLM
std::string getContext(const std::string& question) {
    auto queryEmb = getEmbedding(question);
    auto results = db.vectorSearch("knowledge_base", queryEmb, 3);
    
    // Parse results and concatenate relevant text
    // ... 
    return context;
}

// Use with LLM
std::string answer = llm.generate(
    "Context: " + getContext(userQuestion) + 
    "\nQuestion: " + userQuestion
);
```

#### 3. Image Similarity

```cpp
// Store image features
for (const auto& image : images) {
    auto features = extractFeatures(image);  // CNN feature extraction
    db.insertVector("images", features, R"({
        "path": ")" + image.path + R"(",
        "tags": [")" + join(image.tags, "\", \"") + R"("]
    })");
}

// Find similar images
auto queryFeatures = extractFeatures(queryImage);
auto similar = db.vectorSearch("images", queryFeatures, 10);
```

#### 4. Recommendation System

```cpp
// User-item embeddings
db.insertVector("users", userEmbedding, R"({"user_id": "user123"})");
db.insertVector("items", itemEmbedding, R"({"item_id": "item456", "name": "Product X"})");

// Find items similar to user's taste
auto recommendations = db.vectorSearch("items", userEmbedding, 20);
```

### Best Practices

:::tip Performance Tips
1. **Normalize vectors** before inserting when using cosine distance
2. **Use appropriate dimensions** - higher isn't always better
3. **Batch inserts** when loading large datasets
4. **Index frequently searched collections** for better performance
:::

:::warning Memory Considerations
- Each vector uses `dimensions × 4 bytes` of memory
- 1 million vectors at 384 dimensions ≈ 1.5 GB
- Consider using smaller embedding models for large datasets
:::

:::info Choosing Distance Metric
- **Cosine**: Best for text embeddings (OpenAI, Sentence Transformers)
- **Euclidean**: Best for image features, spatial data
- **Dot Product**: Use when vectors are pre-normalized
- **Manhattan**: Good for sparse, high-dimensional data
:::

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
