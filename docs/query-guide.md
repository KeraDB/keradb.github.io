---
sidebar_position: 4
---

# Query Guide

KeraDB supports MongoDB-compatible query operators for powerful data retrieval and manipulation.

## Basic Queries

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

### Exact Match

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
// Find by single field
const user = await users.findOne({ name: 'Alice' });

// Find by multiple fields
const user = await users.findOne({ 
  name: 'Alice', 
  age: 28 
});

// Find all matching documents
const developers = await users.find({ role: 'developer' }).toArray();
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
# Find by single field
user = users.find_one({'name': 'Alice'})

# Find by multiple fields
user = users.find_one({
    'name': 'Alice',
    'age': 28
})

# Find all matching documents
developers = list(users.find({'role': 'developer'}))
```

  </TabItem>
</Tabs>

## Comparison Operators

### $eq (Equal)

Matches values that are equal to a specified value.

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
const users = await users.find({ age: { $eq: 25 } }).toArray();
// Same as: { age: 25 }
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
users_list = list(users.find({'age': {'$eq': 25}}))
# Same as: {'age': 25}
```

  </TabItem>
</Tabs>

### $ne (Not Equal)

Matches values that are not equal to a specified value.

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
const users = await users.find({ role: { $ne: 'admin' } }).toArray();
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
users_list = list(users.find({'role': {'$ne': 'admin'}}))
```

  </TabItem>
</Tabs>

### $gt, $gte (Greater Than, Greater Than or Equal)

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
// Greater than
const adults = await users.find({ age: { $gt: 18 } }).toArray();

// Greater than or equal
const voters = await users.find({ age: { $gte: 18 } }).toArray();
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
# Greater than
adults = list(users.find({'age': {'$gt': 18}}))

# Greater than or equal
voters = list(users.find({'age': {'$gte': 18}}))
```

  </TabItem>
</Tabs>

### $lt, $lte (Less Than, Less Than or Equal)

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
// Less than
const minors = await users.find({ age: { $lt: 18 } }).toArray();

// Less than or equal
const eligible = await users.find({ age: { $lte: 65 } }).toArray();
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
# Less than
minors = list(users.find({'age': {'$lt': 18}}))

# Less than or equal
eligible = list(users.find({'age': {'$lte': 65}}))
```

  </TabItem>
</Tabs>

### $in (In Array)

Matches any of the values specified in an array.

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
const staff = await users.find({ 
  role: { $in: ['admin', 'moderator', 'editor'] } 
}).toArray();
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
staff = list(users.find({
    'role': {'$in': ['admin', 'moderator', 'editor']}
}))
```

  </TabItem>
</Tabs>

### $nin (Not In Array)

Matches none of the values specified in an array.

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
const regularUsers = await users.find({ 
  role: { $nin: ['admin', 'moderator'] } 
}).toArray();
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
regular_users = list(users.find({
    'role': {'$nin': ['admin', 'moderator']}
}))
```

  </TabItem>
</Tabs>

## Logical Operators

### $and

Joins query clauses with a logical AND.

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
const result = await users.find({
  $and: [
    { age: { $gte: 18 } },
    { role: 'developer' },
    { active: true }
  ]
}).toArray();
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
result = list(users.find({
    '$and': [
        {'age': {'$gte': 18}},
        {'role': 'developer'},
        {'active': True}
    ]
}))
```

  </TabItem>
</Tabs>

### $or

Joins query clauses with a logical OR.

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
const result = await users.find({
  $or: [
    { role: 'admin' },
    { role: 'moderator' },
    { permissions: 'superuser' }
  ]
}).toArray();
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
result = list(users.find({
    '$or': [
        {'role': 'admin'},
        {'role': 'moderator'},
        {'permissions': 'superuser'}
    ]
}))
```

  </TabItem>
</Tabs>

### $not

Inverts the effect of a query expression.

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
const result = await users.find({
  age: { $not: { $lt: 18 } }
}).toArray();
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
result = list(users.find({
    'age': {'$not': {'$lt': 18}}
}))
```

  </TabItem>
</Tabs>

### $nor

Joins query clauses with a logical NOR.

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
const result = await users.find({
  $nor: [
    { role: 'admin' },
    { banned: true }
  ]
}).toArray();
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
result = list(users.find({
    '$nor': [
        {'role': 'admin'},
        {'banned': True}
    ]
}))
```

  </TabItem>
</Tabs>

## Element Operators

### $exists

Matches documents that have the specified field.

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
// Find users with email field
const withEmail = await users.find({ 
  email: { $exists: true } 
}).toArray();

// Find users without phone field
const withoutPhone = await users.find({ 
  phone: { $exists: false } 
}).toArray();
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
# Find users with email field
with_email = list(users.find({
    'email': {'$exists': True}
}))

# Find users without phone field
without_phone = list(users.find({
    'phone': {'$exists': False}
}))
```

  </TabItem>
</Tabs>

### $type

Selects documents if a field is of the specified type.

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
const stringIds = await users.find({ 
  _id: { $type: 'string' } 
}).toArray();

const numericAges = await users.find({ 
  age: { $type: 'number' } 
}).toArray();
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
string_ids = list(users.find({
    '_id': {'$type': 'string'}
}))

numeric_ages = list(users.find({
    'age': {'$type': 'number'}
}))
```

  </TabItem>
</Tabs>

## Array Operators

### $all

Matches arrays that contain all elements specified in the query.

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
const experts = await users.find({
  skills: { $all: ['JavaScript', 'Python', 'Docker'] }
}).toArray();
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
experts = list(users.find({
    'skills': {'$all': ['Python', 'JavaScript', 'Docker']}
}))
```

  </TabItem>
</Tabs>

### $elemMatch

Matches documents that contain an array field with at least one element matching all criteria.

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
const results = await orders.find({
  items: {
    $elemMatch: {
      price: { $gte: 100 },
      quantity: { $gt: 1 }
    }
  }
}).toArray();
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
results = list(orders.find({
    'items': {
        '$elemMatch': {
            'price': {'$gte': 100},
            'quantity': {'$gt': 1}
        }
    }
}))
```

  </TabItem>
</Tabs>

### $size

Matches arrays with a specified number of elements.

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
const threeSkills = await users.find({
  skills: { $size: 3 }
}).toArray();
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
three_skills = list(users.find({
    'skills': {'$size': 3}
}))
```

  </TabItem>
</Tabs>

## String Operators

### $regex

Provides regular expression pattern matching.

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
// Case-insensitive search
const gmailUsers = await users.find({
  email: { $regex: /gmail\.com$/i }
}).toArray();

// Find names starting with 'A'
const aNames = await users.find({
  name: { $regex: /^A/ }
}).toArray();
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
# Case-insensitive search
gmail_users = list(users.find({
    'email': {'$regex': r'gmail\.com$', '$options': 'i'}
}))

# Find names starting with 'A'
a_names = list(users.find({
    'name': {'$regex': r'^A'}
}))
```

  </TabItem>
</Tabs>

## Update Operators

### $set

Sets the value of a field.

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
await users.updateOne(
  { email: 'alice@example.com' },
  { $set: { age: 29, role: 'senior developer' } }
);
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
users.update_one(
    {'email': 'alice@example.com'},
    {'$set': {'age': 29, 'role': 'senior developer'}}
)
```

  </TabItem>
</Tabs>

### $unset

Removes a field from a document.

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
await users.updateOne(
  { email: 'bob@example.com' },
  { $unset: { tempField: '' } }
);
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
users.update_one(
    {'email': 'bob@example.com'},
    {'$unset': {'temp_field': ''}}
)
```

  </TabItem>
</Tabs>

### $inc

Increments the value of a field by a specified amount.

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
await users.updateOne(
  { email: 'alice@example.com' },
  { $inc: { loginCount: 1, points: 10 } }
);
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
users.update_one(
    {'email': 'alice@example.com'},
    {'$inc': {'login_count': 1, 'points': 10}}
)
```

  </TabItem>
</Tabs>

### $push

Adds an element to an array.

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
await users.updateOne(
  { email: 'alice@example.com' },
  { $push: { skills: 'TypeScript' } }
);
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
users.update_one(
    {'email': 'alice@example.com'},
    {'$push': {'skills': 'TypeScript'}}
)
```

  </TabItem>
</Tabs>

### $pull

Removes all array elements that match a specified query.

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
await users.updateOne(
  { email: 'alice@example.com' },
  { $pull: { skills: 'jQuery' } }
);
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
users.update_one(
    {'email': 'alice@example.com'},
    {'$pull': {'skills': 'jQuery'}}
)
```

  </TabItem>
</Tabs>

### $addToSet

Adds elements to an array only if they do not already exist.

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
await users.updateOne(
  { email: 'alice@example.com' },
  { $addToSet: { skills: 'React' } }
);
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
users.update_one(
    {'email': 'alice@example.com'},
    {'$addToSet': {'skills': 'React'}}
)
```

  </TabItem>
</Tabs>

## Query Modifiers

### Sorting

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
// Sort ascending
const users = await users.find().sort({ age: 1 }).toArray();

// Sort descending
const users = await users.find().sort({ age: -1 }).toArray();

// Multiple sort fields
const users = await users.find()
  .sort({ role: 1, age: -1 })
  .toArray();
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
# Sort ascending
users_list = list(users.find().sort('age', 1))

# Sort descending
users_list = list(users.find().sort('age', -1))

# Multiple sort fields
users_list = list(users.find().sort([('role', 1), ('age', -1)]))
```

  </TabItem>
</Tabs>

### Limiting Results

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
// Get first 10 results
const users = await users.find().limit(10).toArray();

// Skip and limit (pagination)
const page2 = await users.find()
  .skip(10)
  .limit(10)
  .toArray();
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
# Get first 10 results
users_list = list(users.find().limit(10))

# Skip and limit (pagination)
page2 = list(users.find().skip(10).limit(10))
```

  </TabItem>
</Tabs>

### Field Projection

Select which fields to return.

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
// Include only specific fields
const users = await users.find({}, { 
  name: 1, 
  email: 1 
}).toArray();

// Exclude specific fields
const users = await users.find({}, { 
  password: 0, 
  internalId: 0 
}).toArray();
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
# Include only specific fields
users_list = list(users.find({}, {
    'name': 1,
    'email': 1
}))

# Exclude specific fields
users_list = list(users.find({}, {
    'password': 0,
    'internal_id': 0
}))
```

  </TabItem>
</Tabs>

## Complex Query Examples

### Combining Multiple Operators

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
const result = await users.find({
  $and: [
    { age: { $gte: 18, $lte: 65 } },
    { 
      $or: [
        { role: 'developer' },
        { role: 'designer' }
      ]
    },
    { skills: { $all: ['JavaScript', 'React'] } },
    { email: { $exists: true } }
  ]
}).sort({ createdAt: -1 }).limit(20).toArray();
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
result = list(users.find({
    '$and': [
        {'age': {'$gte': 18, '$lte': 65}},
        {
            '$or': [
                {'role': 'developer'},
                {'role': 'designer'}
            ]
        },
        {'skills': {'$all': ['JavaScript', 'React']}},
        {'email': {'$exists': True}}
    ]
}).sort('created_at', -1).limit(20))
```

  </TabItem>
</Tabs>

## Next Steps

- [Examples](/docs/examples) - See practical query examples
- [Getting Started](/docs/getting-started/nodejs) - SDK documentation with core concepts
- [Contributing](/docs/contributing) - Help improve KeraDB
