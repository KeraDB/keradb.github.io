---
sidebar_position: 5
---

# Examples

Practical examples demonstrating common use cases for KeraDB.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Todo Application

A simple todo list application demonstrating CRUD operations.

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
const { KeraDB } = require('keradb');

class TodoApp {
  constructor(dbPath) {
    this.db = new KeraDB(dbPath);
    this.todos = this.db.collection('todos');
    this.init();
  }

  async init() {
    // Create indexes for better performance
    await this.todos.createIndex({ userId: 1 });
    await this.todos.createIndex({ completed: 1 });
    await this.todos.createIndex({ createdAt: -1 });
  }

  async addTodo(userId, title, description) {
    const result = await this.todos.insertOne({
      userId,
      title,
      description,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return result.insertedId;
  }

  async getTodosByUser(userId, showCompleted = false) {
    const query = { userId };
    if (!showCompleted) {
      query.completed = false;
    }
    return await this.todos.find(query)
      .sort({ createdAt: -1 })
      .toArray();
  }

  async completeTodo(todoId) {
    return await this.todos.updateOne(
      { _id: todoId },
      { 
        $set: { 
          completed: true, 
          completedAt: new Date(),
          updatedAt: new Date()
        } 
      }
    );
  }

  async updateTodo(todoId, updates) {
    return await this.todos.updateOne(
      { _id: todoId },
      { 
        $set: { 
          ...updates, 
          updatedAt: new Date() 
        } 
      }
    );
  }

  async deleteTodo(todoId) {
    return await this.todos.deleteOne({ _id: todoId });
  }

  async getStats(userId) {
    const allTodos = await this.todos.find({ userId }).toArray();
    const completed = allTodos.filter(t => t.completed).length;
    
    return {
      total: allTodos.length,
      completed,
      pending: allTodos.length - completed
    };
  }

  async close() {
    await this.db.close();
  }
}

// Usage example
async function main() {
  const app = new TodoApp('./data/todos.db');

  // Add todos
  await app.addTodo('user1', 'Buy groceries', 'Milk, eggs, bread');
  await app.addTodo('user1', 'Write documentation', 'Complete API docs');
  await app.addTodo('user1', 'Review PRs', 'Check pending pull requests');

  // Get user's todos
  const todos = await app.getTodosByUser('user1');
  console.log('Active todos:', todos);

  // Complete a todo
  if (todos.length > 0) {
    await app.completeTodo(todos[0]._id);
  }

  // Get statistics
  const stats = await app.getStats('user1');
  console.log('Stats:', stats);

  await app.close();
}

main();
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
from keradb import KeraDB
from datetime import datetime

class TodoApp:
    def __init__(self, db_path):
        self.db = KeraDB(db_path)
        self.todos = self.db.collection('todos')
        self.init()

    def init(self):
        # Create indexes for better performance
        self.todos.create_index('user_id')
        self.todos.create_index('completed')
        self.todos.create_index('created_at', direction=-1)

    def add_todo(self, user_id, title, description):
        result = self.todos.insert_one({
            'user_id': user_id,
            'title': title,
            'description': description,
            'completed': False,
            'created_at': datetime.now(),
            'updated_at': datetime.now()
        })
        return result.inserted_id

    def get_todos_by_user(self, user_id, show_completed=False):
        query = {'user_id': user_id}
        if not show_completed:
            query['completed'] = False
        return list(self.todos.find(query).sort('created_at', -1))

    def complete_todo(self, todo_id):
        return self.todos.update_one(
            {'_id': todo_id},
            {
                '$set': {
                    'completed': True,
                    'completed_at': datetime.now(),
                    'updated_at': datetime.now()
                }
            }
        )

    def update_todo(self, todo_id, updates):
        updates['updated_at'] = datetime.now()
        return self.todos.update_one(
            {'_id': todo_id},
            {'$set': updates}
        )

    def delete_todo(self, todo_id):
        return self.todos.delete_one({'_id': todo_id})

    def get_stats(self, user_id):
        all_todos = list(self.todos.find({'user_id': user_id}))
        completed = len([t for t in all_todos if t['completed']])
        
        return {
            'total': len(all_todos),
            'completed': completed,
            'pending': len(all_todos) - completed
        }

    def close(self):
        self.db.close()

# Usage example
def main():
    app = TodoApp('./data/todos.db')

    # Add todos
    app.add_todo('user1', 'Buy groceries', 'Milk, eggs, bread')
    app.add_todo('user1', 'Write documentation', 'Complete API docs')
    app.add_todo('user1', 'Review PRs', 'Check pending pull requests')

    # Get user's todos
    todos = app.get_todos_by_user('user1')
    print('Active todos:', todos)

    # Complete a todo
    if todos:
        app.complete_todo(todos[0]['_id'])

    # Get statistics
    stats = app.get_stats('user1')
    print('Stats:', stats)

    app.close()

if __name__ == '__main__':
    main()
```

  </TabItem>
</Tabs>

## User Management System

A user management system with authentication and role-based access.

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
const { KeraDB } = require('keradb');
const crypto = require('crypto');

class UserManager {
  constructor(dbPath) {
    this.db = new KeraDB(dbPath);
    this.users = this.db.collection('users');
    this.sessions = this.db.collection('sessions');
    this.init();
  }

  async init() {
    // Create unique index on email
    await this.users.createIndex({ email: 1 }, { unique: true });
    await this.users.createIndex({ role: 1 });
    await this.sessions.createIndex({ userId: 1 });
    await this.sessions.createIndex({ expiresAt: 1 });
  }

  hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  async createUser(email, password, name, role = 'user') {
    const hashedPassword = this.hashPassword(password);
    
    try {
      const result = await this.users.insertOne({
        email,
        password: hashedPassword,
        name,
        role,
        active: true,
        createdAt: new Date(),
        lastLogin: null
      });
      
      return result.insertedId;
    } catch (error) {
      if (error.code === 'DUPLICATE_KEY') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  async authenticate(email, password) {
    const hashedPassword = this.hashPassword(password);
    const user = await this.users.findOne({ 
      email, 
      password: hashedPassword,
      active: true
    });

    if (!user) {
      return null;
    }

    // Update last login
    await this.users.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    // Create session
    const sessionId = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await this.sessions.insertOne({
      sessionId,
      userId: user._id,
      createdAt: new Date(),
      expiresAt
    });

    return { user, sessionId };
  }

  async getUserBySession(sessionId) {
    const session = await this.sessions.findOne({
      sessionId,
      expiresAt: { $gt: new Date() }
    });

    if (!session) {
      return null;
    }

    return await this.users.findOne({ _id: session.userId });
  }

  async getUsersByRole(role) {
    return await this.users.find({ role, active: true }).toArray();
  }

  async updateUserRole(userId, newRole) {
    return await this.users.updateOne(
      { _id: userId },
      { $set: { role: newRole } }
    );
  }

  async deactivateUser(userId) {
    await this.users.updateOne(
      { _id: userId },
      { $set: { active: false } }
    );
    
    // Delete all sessions
    await this.sessions.deleteMany({ userId });
  }

  async logout(sessionId) {
    return await this.sessions.deleteOne({ sessionId });
  }

  async close() {
    await this.db.close();
  }
}

// Usage example
async function main() {
  const userMgr = new UserManager('./data/users.db');

  // Create users
  await userMgr.createUser('admin@example.com', 'password123', 'Admin User', 'admin');
  await userMgr.createUser('john@example.com', 'password123', 'John Doe', 'user');

  // Authenticate
  const auth = await userMgr.authenticate('john@example.com', 'password123');
  console.log('Authenticated:', auth.user.name);

  // Get user by session
  const user = await userMgr.getUserBySession(auth.sessionId);
  console.log('Session user:', user.name);

  // Get all admins
  const admins = await userMgr.getUsersByRole('admin');
  console.log('Admins:', admins);

  await userMgr.close();
}

main();
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
from keradb import KeraDB
from datetime import datetime, timedelta
import hashlib
import secrets

class UserManager:
    def __init__(self, db_path):
        self.db = KeraDB(db_path)
        self.users = self.db.collection('users')
        self.sessions = self.db.collection('sessions')
        self.init()

    def init(self):
        # Create unique index on email
        self.users.create_index('email', unique=True)
        self.users.create_index('role')
        self.sessions.create_index('user_id')
        self.sessions.create_index('expires_at')

    def hash_password(self, password):
        return hashlib.sha256(password.encode()).hexdigest()

    def create_user(self, email, password, name, role='user'):
        hashed_password = self.hash_password(password)
        
        try:
            result = self.users.insert_one({
                'email': email,
                'password': hashed_password,
                'name': name,
                'role': role,
                'active': True,
                'created_at': datetime.now(),
                'last_login': None
            })
            return result.inserted_id
        except Exception as error:
            if hasattr(error, 'code') and error.code == 'DUPLICATE_KEY':
                raise Exception('Email already exists')
            raise error

    def authenticate(self, email, password):
        hashed_password = self.hash_password(password)
        user = self.users.find_one({
            'email': email,
            'password': hashed_password,
            'active': True
        })

        if not user:
            return None

        # Update last login
        self.users.update_one(
            {'_id': user['_id']},
            {'$set': {'last_login': datetime.now()}}
        )

        # Create session
        session_id = secrets.token_hex(32)
        expires_at = datetime.now() + timedelta(hours=24)

        self.sessions.insert_one({
            'session_id': session_id,
            'user_id': user['_id'],
            'created_at': datetime.now(),
            'expires_at': expires_at
        })

        return {'user': user, 'session_id': session_id}

    def get_user_by_session(self, session_id):
        session = self.sessions.find_one({
            'session_id': session_id,
            'expires_at': {'$gt': datetime.now()}
        })

        if not session:
            return None

        return self.users.find_one({'_id': session['user_id']})

    def get_users_by_role(self, role):
        return list(self.users.find({'role': role, 'active': True}))

    def update_user_role(self, user_id, new_role):
        return self.users.update_one(
            {'_id': user_id},
            {'$set': {'role': new_role}}
        )

    def deactivate_user(self, user_id):
        self.users.update_one(
            {'_id': user_id},
            {'$set': {'active': False}}
        )
        
        # Delete all sessions
        self.sessions.delete_many({'user_id': user_id})

    def logout(self, session_id):
        return self.sessions.delete_one({'session_id': session_id})

    def close(self):
        self.db.close()

# Usage example
def main():
    user_mgr = UserManager('./data/users.db')

    # Create users
    user_mgr.create_user('admin@example.com', 'password123', 'Admin User', 'admin')
    user_mgr.create_user('john@example.com', 'password123', 'John Doe', 'user')

    # Authenticate
    auth = user_mgr.authenticate('john@example.com', 'password123')
    print('Authenticated:', auth['user']['name'])

    # Get user by session
    user = user_mgr.get_user_by_session(auth['session_id'])
    print('Session user:', user['name'])

    # Get all admins
    admins = user_mgr.get_users_by_role('admin')
    print('Admins:', admins)

    user_mgr.close()

if __name__ == '__main__':
    main()
```

  </TabItem>
</Tabs>

## Configuration Store

A flexible configuration management system with versioning.

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
const { KeraDB } = require('keradb');

class ConfigStore {
  constructor(dbPath) {
    this.db = new KeraDB(dbPath);
    this.configs = this.db.collection('configs');
    this.history = this.db.collection('config_history');
    this.init();
  }

  async init() {
    await this.configs.createIndex({ key: 1 }, { unique: true });
    await this.configs.createIndex({ category: 1 });
    await this.history.createIndex({ key: 1 });
    await this.history.createIndex({ timestamp: -1 });
  }

  async set(key, value, category = 'default', description = '') {
    const now = new Date();
    
    // Get current value for history
    const current = await this.configs.findOne({ key });
    if (current) {
      // Save to history
      await this.history.insertOne({
        key,
        value: current.value,
        category: current.category,
        description: current.description,
        timestamp: current.updatedAt
      });
    }

    // Update or insert config
    await this.configs.updateOne(
      { key },
      {
        $set: {
          key,
          value,
          category,
          description,
          updatedAt: now,
          createdAt: current ? current.createdAt : now
        }
      },
      { upsert: true }
    );
  }

  async get(key, defaultValue = null) {
    const config = await this.configs.findOne({ key });
    return config ? config.value : defaultValue;
  }

  async getByCategory(category) {
    const configs = await this.configs.find({ category }).toArray();
    return configs.reduce((acc, cfg) => {
      acc[cfg.key] = cfg.value;
      return acc;
    }, {});
  }

  async getAll() {
    const configs = await this.configs.find().toArray();
    return configs.reduce((acc, cfg) => {
      acc[cfg.key] = cfg.value;
      return acc;
    }, {});
  }

  async delete(key) {
    const current = await this.configs.findOne({ key });
    if (current) {
      // Save to history before deleting
      await this.history.insertOne({
        key,
        value: current.value,
        category: current.category,
        description: current.description,
        timestamp: new Date(),
        deleted: true
      });
    }
    
    return await this.configs.deleteOne({ key });
  }

  async getHistory(key, limit = 10) {
    return await this.history.find({ key })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
  }

  async restore(key, timestamp) {
    const historical = await this.history.findOne({ key, timestamp });
    if (!historical) {
      throw new Error('Historical version not found');
    }

    await this.set(
      key,
      historical.value,
      historical.category,
      historical.description
    );
  }

  async close() {
    await this.db.close();
  }
}

// Usage example
async function main() {
  const config = new ConfigStore('./data/config.db');

  // Set configurations
  await config.set('app.name', 'My Application', 'app', 'Application name');
  await config.set('app.version', '1.0.0', 'app', 'Application version');
  await config.set('db.host', 'localhost', 'database', 'Database host');
  await config.set('db.port', 5432, 'database', 'Database port');

  // Get single value
  const appName = await config.get('app.name');
  console.log('App name:', appName);

  // Get by category
  const dbConfig = await config.getByCategory('database');
  console.log('Database config:', dbConfig);

  // Update value
  await config.set('app.version', '1.1.0', 'app', 'Updated version');

  // Get history
  const history = await config.getHistory('app.version');
  console.log('Version history:', history);

  // Get all configs
  const allConfig = await config.getAll();
  console.log('All config:', allConfig);

  await config.close();
}

main();
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
from keradb import KeraDB
from datetime import datetime

class ConfigStore:
    def __init__(self, db_path):
        self.db = KeraDB(db_path)
        self.configs = self.db.collection('configs')
        self.history = self.db.collection('config_history')
        self.init()

    def init(self):
        self.configs.create_index('key', unique=True)
        self.configs.create_index('category')
        self.history.create_index('key')
        self.history.create_index('timestamp', direction=-1)

    def set(self, key, value, category='default', description=''):
        now = datetime.now()
        
        # Get current value for history
        current = self.configs.find_one({'key': key})
        if current:
            # Save to history
            self.history.insert_one({
                'key': key,
                'value': current['value'],
                'category': current['category'],
                'description': current['description'],
                'timestamp': current['updated_at']
            })

        # Update or insert config
        self.configs.update_one(
            {'key': key},
            {
                '$set': {
                    'key': key,
                    'value': value,
                    'category': category,
                    'description': description,
                    'updated_at': now,
                    'created_at': current['created_at'] if current else now
                }
            },
            upsert=True
        )

    def get(self, key, default_value=None):
        config = self.configs.find_one({'key': key})
        return config['value'] if config else default_value

    def get_by_category(self, category):
        configs = list(self.configs.find({'category': category}))
        return {cfg['key']: cfg['value'] for cfg in configs}

    def get_all(self):
        configs = list(self.configs.find())
        return {cfg['key']: cfg['value'] for cfg in configs}

    def delete(self, key):
        current = self.configs.find_one({'key': key})
        if current:
            # Save to history before deleting
            self.history.insert_one({
                'key': key,
                'value': current['value'],
                'category': current['category'],
                'description': current['description'],
                'timestamp': datetime.now(),
                'deleted': True
            })
        
        return self.configs.delete_one({'key': key})

    def get_history(self, key, limit=10):
        return list(self.history.find({'key': key})
                   .sort('timestamp', -1)
                   .limit(limit))

    def restore(self, key, timestamp):
        historical = self.history.find_one({'key': key, 'timestamp': timestamp})
        if not historical:
            raise Exception('Historical version not found')

        self.set(
            key,
            historical['value'],
            historical['category'],
            historical['description']
        )

    def close(self):
        self.db.close()

# Usage example
def main():
    config = ConfigStore('./data/config.db')

    # Set configurations
    config.set('app.name', 'My Application', 'app', 'Application name')
    config.set('app.version', '1.0.0', 'app', 'Application version')
    config.set('db.host', 'localhost', 'database', 'Database host')
    config.set('db.port', 5432, 'database', 'Database port')

    # Get single value
    app_name = config.get('app.name')
    print('App name:', app_name)

    # Get by category
    db_config = config.get_by_category('database')
    print('Database config:', db_config)

    # Update value
    config.set('app.version', '1.1.0', 'app', 'Updated version')

    # Get history
    history = config.get_history('app.version')
    print('Version history:', history)

    # Get all configs
    all_config = config.get_all()
    print('All config:', all_config)

    config.close()

if __name__ == '__main__':
    main()
```

  </TabItem>
</Tabs>

## Next Steps

- [Query Guide](/docs/query-guide) - Learn advanced query techniques
- [Getting Started](/docs/getting-started/nodejs) - SDK documentation with core concepts
- [Contributing](/docs/contributing) - Help improve KeraDB
