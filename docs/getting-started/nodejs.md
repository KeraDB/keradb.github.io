---
sidebar_position: 1
---

# Node.js SDK

Learn how to install and use KeraDB in your Node.js applications.

## Installation

Install KeraDB using npm:

```bash
npm install keradb
```

Or using yarn:

```bash
yarn add keradb
```

## Requirements

- Node.js 14.0 or higher
- npm 6.0 or higher

## Quick Start

```javascript
const { KeraDB } = require('keradb');

// Create a database
const db = new KeraDB('./data/myapp.db');
const users = db.collection('users');

// Insert a document
await users.insertOne({ name: 'Alice', email: 'alice@example.com' });

// Find the document
const user = await users.findOne({ name: 'Alice' });
console.log(user);

// Close the database
await db.close();
```

## Database

The database is the top-level container for your data. Each database is stored in a single file (or in-memory).

### Creating a Database

```javascript
const { KeraDB } = require('keradb');

// File-based database
const db = new KeraDB('./data/myapp.db');

// In-memory database (data is lost when process exits)
const memDb = new KeraDB(':memory:');

// With options
const dbWithOptions = new KeraDB('./data/myapp.db', {
  autoCompact: true,
  compactInterval: 3600000 // Compact every hour
});
```

### Database Methods

| Method | Description |
|--------|-------------|
| `collection(name)` | Get or create a collection |
| `listCollections()` | List all collections in the database |
| `dropCollection(name)` | Delete a collection and all its documents |
| `close()` | Close the database connection |
| `compact()` | Manually trigger database compaction |

## Collections

Collections are groups of related documents, analogous to tables in relational databases.

### Working with Collections

```javascript
// Get a collection (creates it if it doesn't exist)
const users = db.collection('users');
const posts = db.collection('posts');

// List all collections
const collections = await db.listCollections();
console.log(collections); // ['users', 'posts']

// Drop a collection
await db.dropCollection('posts');
```

### Insert Operations

```javascript
// Insert a single document
const result = await users.insertOne({
  name: 'Alice Johnson',
  email: 'alice@example.com',
  age: 28,
  role: 'developer'
});
console.log('Inserted ID:', result.insertedId);

// Insert multiple documents
const bulkResult = await users.insertMany([
  { name: 'Bob Smith', email: 'bob@example.com', age: 35 },
  { name: 'Carol White', email: 'carol@example.com', age: 42 }
]);
console.log('Inserted count:', bulkResult.insertedCount);
```

### Query Operations

```javascript
// Find a single document
const user = await users.findOne({ email: 'alice@example.com' });

// Find multiple documents
const developers = await users.find({ role: 'developer' }).toArray();

// Find with query operators
const adults = await users.find({ age: { $gte: 18 } }).toArray();

// Find with limit and sort
const topUsers = await users.find()
  .sort({ age: -1 })
  .limit(5)
  .toArray();

// Count documents
const count = await users.count({ role: 'developer' });
```

### Update Operations

```javascript
// Update a single document
const updateResult = await users.updateOne(
  { email: 'alice@example.com' },
  { $set: { age: 29, lastLogin: new Date() } }
);
console.log('Modified count:', updateResult.modifiedCount);

// Update multiple documents
await users.updateMany(
  { role: 'developer' },
  { $set: { department: 'Engineering' } }
);

// Replace a document entirely
await users.replaceOne(
  { email: 'bob@example.com' },
  { name: 'Robert Smith', email: 'bob@example.com', age: 36, role: 'manager' }
);
```

### Delete Operations

```javascript
// Delete a single document
const deleteResult = await users.deleteOne({ email: 'carol@example.com' });
console.log('Deleted count:', deleteResult.deletedCount);

// Delete multiple documents
await users.deleteMany({ age: { $lt: 18 } });
```

## Documents

Documents are JSON-like objects that store your data. Each document is stored in a collection.

### Document Structure

Documents are flexible and schema-free:

```javascript
const user = {
  _id: 'auto-generated-id', // Automatically added if not provided
  name: 'Alice Johnson',
  email: 'alice@example.com',
  age: 28,
  address: {
    street: '123 Main St',
    city: 'San Francisco',
    country: 'USA'
  },
  tags: ['developer', 'nodejs', 'python'],
  createdAt: new Date(),
  metadata: {
    lastLogin: new Date(),
    loginCount: 42
  }
};

await users.insertOne(user);
```

### Document IDs

Every document has a unique `_id` field:

- Automatically generated if not provided
- Must be unique within a collection
- Can be a string, number, or any primitive type
- Cannot be changed after insertion

```javascript
// Auto-generated ID
await users.insertOne({ name: 'Alice' });

// Custom ID
await users.insertOne({ 
  _id: 'user_001', 
  name: 'Bob' 
});

// Numeric ID
await users.insertOne({ 
  _id: 12345, 
  name: 'Carol' 
});
```

### Nested Documents

Documents can contain nested objects and arrays:

```javascript
await posts.insertOne({
  title: 'Getting Started with KeraDB',
  author: {
    name: 'Alice Johnson',
    email: 'alice@example.com'
  },
  tags: ['database', 'tutorial', 'nodejs'],
  comments: [
    {
      user: 'Bob',
      text: 'Great article!',
      date: new Date()
    },
    {
      user: 'Carol',
      text: 'Very helpful',
      date: new Date()
    }
  ]
});

// Query nested fields using dot notation
const post = await posts.findOne({ 'author.email': 'alice@example.com' });
```

## Indexes

Indexes improve query performance by creating fast lookup structures.

### Creating Indexes

```javascript
// Single field index
await users.createIndex({ email: 1 });

// Unique index
await users.createIndex({ email: 1 }, { unique: true });

// Compound index (multiple fields)
await users.createIndex({ lastName: 1, firstName: 1 });

// Index with sort order
await users.createIndex({ createdAt: -1 }); // Descending

// Nested field index
await posts.createIndex({ 'author.email': 1 });

// Array field index
await posts.createIndex({ tags: 1 });
```

### Index Types

| Type | Description |
|------|-------------|
| Single Field Index | Index on one field |
| Compound Index | Index on multiple fields |
| Unique Index | Ensures field values are unique |
| Nested Field Index | Index on fields within nested documents |
| Array Index | Index on array elements |

### Managing Indexes

```javascript
// List all indexes
const indexes = await users.listIndexes();
console.log(indexes);

// Drop an index
await users.dropIndex('email_1');

// Drop all indexes
await users.dropIndexes();
```

### Index Best Practices

**Advantages:**
- Faster queries on indexed fields
- Support for unique constraints
- Efficient sorting

**Trade-offs:**
- Slower write operations
- Additional storage space
- Maintenance overhead

**Tips:**
- Create indexes on frequently queried fields
- Use compound indexes for multi-field queries
- Don't over-index (only create necessary indexes)

## Data Types

KeraDB supports standard JSON data types:

| Type | Description | Example |
|------|-------------|---------|
| String | Text data | `'Hello World'` |
| Number | Integers and floats | `42`, `3.14` |
| Boolean | true/false | `true` |
| Object | Nested documents | `{ nested: 'value' }` |
| Array | Lists of values | `[1, 2, 3]` |
| Date | Date and time | `new Date()` |
| Null | Null value | `null` |

```javascript
await collection.insertOne({
  string: 'Hello World',
  number: 42,
  float: 3.14,
  boolean: true,
  object: { nested: 'value' },
  array: [1, 2, 3],
  date: new Date(),
  null: null
});
```

## Error Handling

Always handle errors properly:

```javascript
try {
  await users.insertOne({ email: 'duplicate@example.com' });
  await users.insertOne({ email: 'duplicate@example.com' }); // Will throw
} catch (error) {
  if (error.code === 'DUPLICATE_KEY') {
    console.error('Duplicate email address');
  } else {
    console.error('Database error:', error);
  }
}
```

## Complete Example

```javascript
const { KeraDB } = require('keradb');

async function main() {
  // Initialize database
  const db = new KeraDB('./data/myapp.db');
  const users = db.collection('users');

  // Create unique index on email
  await users.createIndex({ email: 1 }, { unique: true });

  try {
    // Insert a user
    await users.insertOne({
      name: 'Jane Doe',
      email: 'jane@example.com',
      age: 25,
      role: 'developer',
      skills: ['JavaScript', 'Node.js', 'React']
    });

    // Find and display the user
    const user = await users.findOne({ email: 'jane@example.com' });
    console.log('Found user:', user);

    // Update the user
    await users.updateOne(
      { email: 'jane@example.com' },
      { $set: { age: 26 }, $push: { skills: 'TypeScript' } }
    );

    // Find all developers
    const developers = await users.find({ role: 'developer' }).toArray();
    console.log('All developers:', developers);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the database
    await db.close();
  }
}

main();
```

## Next Steps

- [Query Guide](/docs/query-guide) - Master MongoDB-compatible query operators
- [Examples](/docs/examples) - See real-world examples
