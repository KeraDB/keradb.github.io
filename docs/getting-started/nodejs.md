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

### Creating a Database

```javascript
const { KeraDB } = require('keradb');

// Create a new database with a file path
const db = new KeraDB('./data/myapp.db');

// Or use in-memory mode
const memDb = new KeraDB(':memory:');
```

### Working with Collections

Collections in KeraDB are similar to MongoDB collections. They store related documents.

```javascript
// Get or create a collection
const users = db.collection('users');
```

### Inserting Documents

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

### Querying Documents

```javascript
// Find a single document
const user = await users.findOne({ email: 'alice@example.com' });
console.log(user);

// Find multiple documents
const developers = await users.find({ role: 'developer' }).toArray();
console.log(developers);

// Find with query operators
const adults = await users.find({ age: { $gte: 18 } }).toArray();

// Find with limit and sort
const topUsers = await users.find()
  .sort({ age: -1 })
  .limit(5)
  .toArray();
```

### Updating Documents

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

// Replace a document
await users.replaceOne(
  { email: 'bob@example.com' },
  { name: 'Robert Smith', email: 'bob@example.com', age: 36, role: 'manager' }
);
```

### Deleting Documents

```javascript
// Delete a single document
const deleteResult = await users.deleteOne({ email: 'carol@example.com' });
console.log('Deleted count:', deleteResult.deletedCount);

// Delete multiple documents
await users.deleteMany({ age: { $lt: 18 } });
```

### Creating Indexes

Indexes improve query performance:

```javascript
// Create a single field index
await users.createIndex({ email: 1 });

// Create a unique index
await users.createIndex({ email: 1 }, { unique: true });

// Create a compound index
await users.createIndex({ role: 1, age: -1 });
```

### Closing the Database

```javascript
// Close the database connection when done
await db.close();
```

## Complete Example

Here's a complete example putting it all together:

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

## Next Steps

- [Core Concepts](/docs/core-concepts) - Learn about databases, collections, and documents
- [Query Guide](/docs/query-guide) - Master MongoDB-compatible query operators
- [Examples](/docs/examples) - See real-world examples
