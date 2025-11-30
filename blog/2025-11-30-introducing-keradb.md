---
slug: introducing-keradb
title: Introducing KeraDB - A Lightweight Embedded Database with Vector Search
authors: [keradb]
tags: [announcement, release, database, vector-search]
---

We're thrilled to announce the official launch of **KeraDB** — a lightweight, embedded database with MongoDB-compatible APIs and built-in vector search capabilities.

<!-- truncate -->

## Why KeraDB?

Building modern applications often requires a database, but not every project needs the complexity of running a separate database server. Whether you're prototyping a new idea, building an Electron app, or developing an AI application that needs vector similarity search, KeraDB provides a simple, powerful solution.

### 🚀 Key Features

- **MongoDB-Compatible SDK** — If you know MongoDB, you already know KeraDB. Our familiar query syntax means zero learning curve.

- **Embedded & Serverless** — No separate database process to manage. Your database lives right alongside your application.

- **Vector Search Built-in** — Perfect for AI/ML applications. Store and query embeddings with efficient similarity search.

- **Multi-Language Support** — Available for Node.js, Python, and Rust with consistent APIs across all platforms.

- **Lightweight & Fast** — Written in Rust for maximum performance with minimal footprint.

## Getting Started

Getting up and running takes just a few lines of code:

```javascript
const { KeraDB } = require('keradb');

const db = new KeraDB('./myapp.db');
const users = db.collection('users');

await users.insertOne({ 
  name: 'Alice', 
  email: 'alice@example.com' 
});

const user = await users.findOne({ name: 'Alice' });
```

## What's Next?

This is just the beginning. We're actively working on:

- Enhanced vector search algorithms
- Additional language SDKs
- Performance optimizations
- More query operators

## Join the Community

We'd love to hear from you! Check out our [documentation](/docs) to get started, and don't hesitate to:

- ⭐ Star us on [GitHub](https://github.com/keradb/keradb)
- 🐛 Report issues or request features
- 💬 Join the conversation

Thank you for being part of the KeraDB journey. We can't wait to see what you build!

*— The KeraDB Team*
