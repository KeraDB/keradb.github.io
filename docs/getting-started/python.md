---
sidebar_position: 2
---

# Python Getting Started

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

### Creating a Database

```python
from keradb import KeraDB

# Create a new database with a file path
db = KeraDB('./data/myapp.db')

# Or use in-memory mode
mem_db = KeraDB(':memory:')
```

### Working with Collections

Collections in KeraDB are similar to MongoDB collections. They store related documents.

```python
# Get or create a collection
users = db.collection('users')
```

### Inserting Documents

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

### Querying Documents

```python
# Find a single document
user = users.find_one({'email': 'alice@example.com'})
print(user)

# Find multiple documents
developers = list(users.find({'role': 'developer'}))
print(developers)

# Find with query operators
adults = list(users.find({'age': {'$gte': 18}}))

# Find with limit and sort
top_users = list(users.find().sort('age', -1).limit(5))
```

### Updating Documents

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

# Replace a document
users.replace_one(
    {'email': 'bob@example.com'},
    {'name': 'Robert Smith', 'email': 'bob@example.com', 'age': 36, 'role': 'manager'}
)
```

### Deleting Documents

```python
# Delete a single document
delete_result = users.delete_one({'email': 'carol@example.com'})
print('Deleted count:', delete_result.deleted_count)

# Delete multiple documents
users.delete_many({'age': {'$lt': 18}})
```

### Creating Indexes

Indexes improve query performance:

```python
# Create a single field index
users.create_index('email')

# Create a unique index
users.create_index('email', unique=True)

# Create a compound index
users.create_index([('role', 1), ('age', -1)])
```

### Closing the Database

```python
# Close the database connection when done
db.close()
```

## Complete Example

Here's a complete example putting it all together:

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

## Using Context Managers

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

## Next Steps

- [Core Concepts](/docs/core-concepts) - Learn about databases, collections, and documents
- [Query Guide](/docs/query-guide) - Master MongoDB-compatible query operators
- [Examples](/docs/examples) - See real-world examples
