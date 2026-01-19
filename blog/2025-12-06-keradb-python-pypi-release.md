---
slug: keradb-python-pypi-release
title: KeraDB Is Now Available on PyPI
authors: [keradb]
tags: [python, pypi, release, nosql, vector-search, embedded-db]
date: 2025-12-06
---

# KeraDB Is Now Available on PyPI

We're excited to share that **KeraDB is now available on PyPI**, making it easy to use KeraDB directly in Python applications.

You can now install KeraDB with a single command:

```bash
pip install keradb
```

This release makes KeraDB accessible to Python developers building local-first apps, agents, data tools, and embedded systems that need fast document storage and vector search without running an external database.

With the PyPI release, KeraDB can now be used directly inside Python projects for:

- Embedded document storage
- Fast single-record CRUD operations
- Local-first and offline workflows
- AI/agent pipelines that need lightweight persistence
- Prototyping without database setup or servers

KeraDB runs as an embedded database, so there's no service to manage and no configuration required to get started.

## Quick Example

```python
from keradb import KeraDB

db = KeraDB("example.kdb")

db.insert("users", {
    "id": "user_1",
    "name": "Alice",
    "role": "developer"
})

user = db.get("users", "user_1")
print(user)
```

The API is intentionally simple and document-first, designed to feel natural in Python while retaining KeraDB's low-latency core.

## Get Started

- **PyPI**: https://pypi.org/project/keradb/
- **Documentation**: https://keradb.github.io/docs
- **GitHub**: https://github.com/KeraDB/keradb

If you're building something with KeraDB in Python, we'd love to hear about it.
