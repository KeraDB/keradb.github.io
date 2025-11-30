---
sidebar_position: 6
---

# Contributing

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Thank you for your interest in contributing to KeraDB! This guide will help you get started.

## Ways to Contribute

There are many ways to contribute to KeraDB:

- Report bugs and request features
- Improve documentation
- Submit bug fixes
- Add new features
- Write tests
- Review pull requests

## Getting Started

### Prerequisites

For Node.js development:
- Node.js 14.0 or higher
- npm 6.0 or higher
- Git

For Python development:
- Python 3.7 or higher
- pip
- Git

### Fork and Clone

1. Fork the KeraDB repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/keradb.git
cd keradb
```

3. Add the upstream repository:

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/keradb.git
```

### Development Setup

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build

# Run linter
npm run lint
```

  </TabItem>
  <TabItem value="python" label="Python">

```bash
# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -e .[dev]

# Run tests
pytest

# Run linter
flake8 src tests
```

  </TabItem>
</Tabs>

## Development Workflow

### 1. Create a Branch

Create a branch for your work:

```bash
git checkout -b feature/my-new-feature
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `test/` - Test improvements
- `refactor/` - Code refactoring

### 2. Make Changes

- Write clear, concise code
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Keep commits focused and atomic

### 3. Write Tests

All new features and bug fixes should include tests:

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
// tests/collection.test.js
describe('Collection', () => {
  it('should insert a document', async () => {
    const db = new KeraDB(':memory:');
    const users = db.collection('users');
    
    const result = await users.insertOne({ name: 'Alice' });
    
    expect(result.insertedId).toBeDefined();
    await db.close();
  });
});
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
# tests/test_collection.py
def test_insert_document():
    db = KeraDB(':memory:')
    users = db.collection('users')
    
    result = users.insert_one({'name': 'Alice'})
    
    assert result.inserted_id is not None
    db.close()
```

  </TabItem>
</Tabs>

### 4. Run Tests

Before submitting, make sure all tests pass:

```bash
# Node.js
npm test

# Python
pytest
```

### 5. Commit Changes

Write clear commit messages:

```bash
git add .
git commit -m "Add support for compound indexes

- Implement multi-field index creation
- Add tests for compound indexes
- Update documentation"
```

Commit message guidelines:
- Use present tense ("Add feature" not "Added feature")
- First line should be 50 characters or less
- Include detailed description if needed
- Reference issues and pull requests

### 6. Push Changes

```bash
git push origin feature/my-new-feature
```

### 7. Create Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill in the PR template:
   - Description of changes
   - Related issues
   - Testing done
   - Screenshots (if applicable)

## Code Style

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

- Follow the existing ESLint configuration
- Use 2 spaces for indentation
- Use single quotes for strings
- Use async/await over promises
- Add JSDoc comments for public APIs

Example:

```javascript
/**
 * Insert a single document into the collection
 * @param {Object} document - The document to insert
 * @returns {Promise<Object>} Insert result with insertedId
 */
async insertOne(document) {
  // Implementation
}
```

  </TabItem>
  <TabItem value="python" label="Python">

- Follow PEP 8 style guide
- Use 4 spaces for indentation
- Use snake_case for functions and variables
- Use type hints where appropriate
- Add docstrings for public APIs

Example:

```python
def insert_one(self, document: Dict[str, Any]) -> InsertOneResult:
    """
    Insert a single document into the collection.
    
    Args:
        document: The document to insert
        
    Returns:
        InsertOneResult with inserted_id
    """
    # Implementation
```

  </TabItem>
</Tabs>

## Testing Guidelines

- Write tests for all new features
- Ensure tests are independent and can run in any order
- Use descriptive test names
- Test edge cases and error conditions
- Aim for high code coverage

### Test Structure

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  it('should handle normal case', () => {
    // Test
  });

  it('should handle edge case', () => {
    // Test
  });

  it('should throw error for invalid input', () => {
    // Test
  });
});
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
class TestFeatureName:
    def setup_method(self):
        # Setup
        pass

    def teardown_method(self):
        # Cleanup
        pass

    def test_normal_case(self):
        # Test
        pass

    def test_edge_case(self):
        # Test
        pass

    def test_invalid_input(self):
        # Test
        pass
```

  </TabItem>
</Tabs>

## Documentation

### Code Documentation

- Add comments for complex logic
- Use JSDoc (Node.js) or docstrings (Python)
- Include examples in documentation
- Keep documentation up to date

### User Documentation

Documentation is in the `docs/` directory using Docusaurus:

```bash
cd docs
npm install
npm start
```

Update documentation when:
- Adding new features
- Changing APIs
- Fixing bugs that affect usage
- Adding examples

## Reporting Bugs

When reporting bugs, include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Minimal steps to reproduce the bug
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: OS, Node.js/Python version, KeraDB version
6. **Code Sample**: Minimal code that reproduces the issue

Example bug report:

```markdown
**Description**
Query with $regex operator fails on nested fields

**Steps to Reproduce**
1. Create collection with nested documents
2. Query with { 'user.email': { $regex: /test/ } }
3. Error is thrown

**Expected Behavior**
Should return matching documents

**Actual Behavior**
Throws TypeError: Cannot read property 'match' of undefined

**Environment**
- OS: macOS 12.0
- Node.js: 16.13.0
- KeraDB: 1.0.0

**Code Sample**
\`\`\`javascript
const db = new KeraDB(':memory:');
const users = db.collection('users');
await users.insertOne({ user: { email: 'test@example.com' } });
await users.find({ 'user.email': { $regex: /test/ } }).toArray();
\`\`\`
```

## Feature Requests

When requesting features:

1. **Use Case**: Describe the problem you're trying to solve
2. **Proposed Solution**: How you think it should work
3. **Alternatives**: Other solutions you've considered
4. **Examples**: Code examples of how it would be used

## Review Process

1. Maintainers will review your PR
2. Address any feedback or requested changes
3. Once approved, your PR will be merged
4. Your contribution will be included in the next release

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Follow the project's code of conduct

## Questions?

If you have questions:

- Open an issue for discussion
- Check existing issues and PRs
- Read the documentation

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Recognition

Contributors will be recognized in:
- Release notes
- Contributors list
- Project README

Thank you for contributing to KeraDB!
