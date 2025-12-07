---
sidebar_position: 2
---

# Python SDK

Learn how to install and use KeraDB in your Python applications.

## Installation

Install KeraDB using pip:

```bash
pip install keradb
```

## Requirements

- Python 3.7 or higher
- pip

## Quick Start

```python
from keradb import KeraDB

# Create a database
db = KeraDB('./data/myapp.db')
users = db.collection('users')

# Insert a document
users.insert_one({'name': 'Alice', 'email': 'alice@example.com'})

# Find the document
user = users.find_one({'name': 'Alice'})
print(user)

# Close the database
db.close()
```

## Database

The database is the top-level container for your data. Each database is stored in a single file (or in-memory).

### Creating a Database

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

### Database Methods

| Method | Description |
|--------|-------------|
| `collection(name)` | Get or create a collection |
| `list_collections()` | List all collections in the database |
| `drop_collection(name)` | Delete a collection and all its documents |
| `close()` | Close the database connection |
| `compact()` | Manually trigger database compaction |

## Collections

Collections are groups of related documents, analogous to tables in relational databases.

### Working with Collections

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

### Insert Operations

```python
# Insert a single document
result = users.insert_one({
    'name': 'Alice Johnson',
    'email': 'alice@example.com',
    'age': 28,
    'role': 'developer'
})
print('Inserted ID:', result.inserted_id)

# Insert multiple documents
bulk_result = users.insert_many([
    {'name': 'Bob Smith', 'email': 'bob@example.com', 'age': 35},
    {'name': 'Carol White', 'email': 'carol@example.com', 'age': 42}
])
print('Inserted count:', bulk_result.inserted_count)
```

### Query Operations

```python
# Find a single document
user = users.find_one({'email': 'alice@example.com'})

# Find multiple documents
developers = list(users.find({'role': 'developer'}))

# Find with query operators
adults = list(users.find({'age': {'$gte': 18}}))

# Find with limit and sort
top_users = list(users.find().sort('age', -1).limit(5))

# Count documents
count = users.count({'role': 'developer'})
```

### Update Operations

```python
from datetime import datetime

# Update a single document
update_result = users.update_one(
    {'email': 'alice@example.com'},
    {'$set': {'age': 29, 'last_login': datetime.now()}}
)
print('Modified count:', update_result.modified_count)

# Update multiple documents
users.update_many(
    {'role': 'developer'},
    {'$set': {'department': 'Engineering'}}
)

# Replace a document entirely
users.replace_one(
    {'email': 'bob@example.com'},
    {'name': 'Robert Smith', 'email': 'bob@example.com', 'age': 36, 'role': 'manager'}
)
```

### Delete Operations

```python
# Delete a single document
delete_result = users.delete_one({'email': 'carol@example.com'})
print('Deleted count:', delete_result.deleted_count)

# Delete multiple documents
users.delete_many({'age': {'$lt': 18}})
```

## Documents

Documents are JSON-like objects that store your data. Each document is stored in a collection.

### Document Structure

Documents are flexible and schema-free:

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

### Document IDs

Every document has a unique `_id` field:

- Automatically generated if not provided
- Must be unique within a collection
- Can be a string, number, or any primitive type
- Cannot be changed after insertion

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

### Nested Documents

Documents can contain nested objects and arrays:

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

# Query nested fields using dot notation
post = posts.find_one({'author.email': 'alice@example.com'})
```

## Indexes

Indexes improve query performance by creating fast lookup structures.

### Creating Indexes

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

### Index Types

| Type | Description |
|------|-------------|
| Single Field Index | Index on one field |
| Compound Index | Index on multiple fields |
| Unique Index | Ensures field values are unique |
| Nested Field Index | Index on fields within nested documents |
| Array Index | Index on array elements |

### Managing Indexes

```python
# List all indexes
indexes = users.list_indexes()
print(indexes)

# Drop an index
users.drop_index('email_1')

# Drop all indexes
users.drop_indexes()
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
| Boolean | True/False | `True` |
| Dict | Nested documents | `{'nested': 'value'}` |
| List | Lists of values | `[1, 2, 3]` |
| Date | Date and time | `datetime.now()` |
| None | Null value | `None` |

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

## Context Managers

Python supports context managers for automatic resource cleanup:

```python
from keradb import KeraDB

# Database will be automatically closed when exiting the context
with KeraDB('./data/myapp.db') as db:
    users = db.collection('users')
    
    users.insert_one({
        'name': 'John Doe',
        'email': 'john@example.com'
    })
    
    user = users.find_one({'email': 'john@example.com'})
    print(user)
# Database is automatically closed here
```

## Error Handling

Always handle errors properly:

```python
try:
    users.insert_one({'email': 'duplicate@example.com'})
    users.insert_one({'email': 'duplicate@example.com'})  # Will raise
except Exception as error:
    if hasattr(error, 'code') and error.code == 'DUPLICATE_KEY':
        print('Duplicate email address')
    else:
        print('Database error:', error)
```

## Type Hints

KeraDB supports Python type hints:

```python
from typing import Dict, List, Any
from keradb import KeraDB, Collection

db: KeraDB = KeraDB('./data/myapp.db')
users: Collection = db.collection('users')

user: Dict[str, Any] = users.find_one({'email': 'alice@example.com'})
all_users: List[Dict[str, Any]] = list(users.find())
```

## Complete Example

```python
from keradb import KeraDB
from datetime import datetime

def main():
    # Initialize database
    db = KeraDB('./data/myapp.db')
    users = db.collection('users')

    # Create unique index on email
    users.create_index('email', unique=True)

    try:
        # Insert a user
        users.insert_one({
            'name': 'Jane Doe',
            'email': 'jane@example.com',
            'age': 25,
            'role': 'developer',
            'skills': ['Python', 'Django', 'FastAPI']
        })

        # Find and display the user
        user = users.find_one({'email': 'jane@example.com'})
        print('Found user:', user)

        # Update the user
        users.update_one(
            {'email': 'jane@example.com'},
            {
                '$set': {'age': 26},
                '$push': {'skills': 'Flask'}
            }
        )

        # Find all developers
        developers = list(users.find({'role': 'developer'}))
        print('All developers:', developers)
    except Exception as error:
        print('Error:', error)
    finally:
        # Close the database
        db.close()

if __name__ == '__main__':
    main()
```

## Next Steps

- [Query Guide](/docs/query-guide) - Master MongoDB-compatible query operators
- [Examples](/docs/examples) - See real-world examples
