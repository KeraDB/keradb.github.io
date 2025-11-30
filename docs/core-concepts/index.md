---
sidebar_position: 1
title: Core Concepts
---

# Core Concepts

Understanding the fundamental building blocks of KeraDB will help you build better applications.

## Database

The database is the top-level container for your data. Each database is stored in a single file (or in-memory).

### Creating a Database

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

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

  </TabItem>
  <TabItem value="python" label="Python">

```python
from keradb import KeraDB

# File-based database
db = KeraDB('./data/myapp.db')

# In-memory database (data is lost when process exits)
mem_db = KeraDB(':memory:')

# With options
db_with_options = KeraDB('./data/myapp.db', 
    auto_compact=True,
    compact_interval=3600  # Compact every hour
)
```

  </TabItem>
</Tabs>

### Database Methods

- **`collection(name)`** - Get or create a collection
- **`listCollections()`** - List all collections in the database
- **`dropCollection(name)`** - Delete a collection and all its documents
- **`close()`** - Close the database connection
- **`compact()`** - Manually trigger database compaction

## Collections

Collections are groups of related documents. They are analogous to tables in relational databases.

### Working with Collections

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

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

  </TabItem>
  <TabItem value="python" label="Python">

```python
# Get a collection (creates it if it doesn't exist)
users = db.collection('users')
posts = db.collection('posts')

# List all collections
collections = db.list_collections()
print(collections)  # ['users', 'posts']

# Drop a collection
db.drop_collection('posts')
```

  </TabItem>
</Tabs>

### Collection Methods

#### Insert Operations
- **`insertOne(document)`** - Insert a single document
- **`insertMany(documents)`** - Insert multiple documents

#### Query Operations
- **`findOne(query)`** - Find a single document
- **`find(query)`** - Find multiple documents (returns cursor)
- **`count(query)`** - Count documents matching query

#### Update Operations
- **`updateOne(query, update)`** - Update a single document
- **`updateMany(query, update)`** - Update multiple documents
- **`replaceOne(query, document)`** - Replace a document entirely

#### Delete Operations
- **`deleteOne(query)`** - Delete a single document
- **`deleteMany(query)`** - Delete multiple documents

#### Index Operations
- **`createIndex(keys, options)`** - Create an index
- **`dropIndex(name)`** - Remove an index
- **`listIndexes()`** - List all indexes

## Documents

Documents are JSON-like objects that store your data. Each document is stored in a collection.

### Document Structure

Documents are flexible and schema-free:

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

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

  </TabItem>
  <TabItem value="python" label="Python">

```python
from datetime import datetime

user = {
    '_id': 'auto-generated-id',  # Automatically added if not provided
    'name': 'Alice Johnson',
    'email': 'alice@example.com',
    'age': 28,
    'address': {
        'street': '123 Main St',
        'city': 'San Francisco',
        'country': 'USA'
    },
    'tags': ['developer', 'python', 'nodejs'],
    'created_at': datetime.now(),
    'metadata': {
        'last_login': datetime.now(),
        'login_count': 42
    }
}

users.insert_one(user)
```

  </TabItem>
</Tabs>

### Document IDs

Every document has a unique `_id` field:

- Automatically generated if not provided
- Must be unique within a collection
- Can be a string, number, or any primitive type
- Cannot be changed after insertion

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

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

  </TabItem>
  <TabItem value="python" label="Python">

```python
# Auto-generated ID
users.insert_one({'name': 'Alice'})

# Custom ID
users.insert_one({
    '_id': 'user_001',
    'name': 'Bob'
})

# Numeric ID
users.insert_one({
    '_id': 12345,
    'name': 'Carol'
})
```

  </TabItem>
</Tabs>

### Nested Documents

Documents can contain nested objects and arrays:

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

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

// Query nested fields
const post = await posts.findOne({ 'author.email': 'alice@example.com' });
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
from datetime import datetime

posts.insert_one({
    'title': 'Getting Started with KeraDB',
    'author': {
        'name': 'Alice Johnson',
        'email': 'alice@example.com'
    },
    'tags': ['database', 'tutorial', 'python'],
    'comments': [
        {
            'user': 'Bob',
            'text': 'Great article!',
            'date': datetime.now()
        },
        {
            'user': 'Carol',
            'text': 'Very helpful',
            'date': datetime.now()
        }
    ]
})

# Query nested fields
post = posts.find_one({'author.email': 'alice@example.com'})
```

  </TabItem>
</Tabs>

## Indexes

Indexes improve query performance by creating fast lookup structures.

### Creating Indexes

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

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

  </TabItem>
  <TabItem value="python" label="Python">

```python
# Single field index
users.create_index('email')

# Unique index
users.create_index('email', unique=True)

# Compound index (multiple fields)
users.create_index([('last_name', 1), ('first_name', 1)])

# Index with sort order
users.create_index('created_at', direction=-1)  # Descending

# Nested field index
posts.create_index('author.email')

# Array field index
posts.create_index('tags')
```

  </TabItem>
</Tabs>

### Index Types

1. **Single Field Index**: Index on one field
2. **Compound Index**: Index on multiple fields
3. **Unique Index**: Ensures field values are unique
4. **Nested Field Index**: Index on fields within nested documents
5. **Array Index**: Index on array elements

### Managing Indexes

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
// List all indexes
const indexes = await users.listIndexes();
console.log(indexes);

// Drop an index
await users.dropIndex('email_1');

// Drop all indexes
await users.dropIndexes();
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
# List all indexes
indexes = users.list_indexes()
print(indexes)

# Drop an index
users.drop_index('email_1')

# Drop all indexes
users.drop_indexes()
```

  </TabItem>
</Tabs>

### Index Performance

Indexes speed up queries but have trade-offs:

**Advantages:**
- Faster queries on indexed fields
- Support for unique constraints
- Efficient sorting

**Trade-offs:**
- Slower write operations
- Additional storage space
- Maintenance overhead

**Best Practices:**
- Create indexes on frequently queried fields
- Use compound indexes for multi-field queries
- Don't over-index (only create necessary indexes)
- Monitor query performance and adjust

## Data Types

KeraDB supports standard JSON data types:

- **String**: Text data
- **Number**: Integers and floats
- **Boolean**: true/false
- **Object**: Nested documents
- **Array**: Lists of values
- **Date**: Date and time (stored as ISO strings)
- **Null**: Null value

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

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

  </TabItem>
  <TabItem value="python" label="Python">

```python
from datetime import datetime

collection.insert_one({
    'string': 'Hello World',
    'number': 42,
    'float': 3.14,
    'boolean': True,
    'object': {'nested': 'value'},
    'array': [1, 2, 3],
    'date': datetime.now(),
    'null': None
})
```

  </TabItem>
</Tabs>

## Next Steps

- [Query Guide](/docs/query-guide) - Learn about query operators
- [Examples](/docs/examples) - See practical examples
- [Contributing](/docs/contributing) - Contribute to KeraDB
