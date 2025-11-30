---
slug: keradb-vs-sqlite-benchmark-v0-1-0
title: KeraDB vs SQLite Benchmark (v0.1.0)
authors: [keradb]
tags: [benchmark, performance, sqlite, nosql, vector-search]
date: 2025-01-15
---

# KeraDB vs SQLite Benchmark (v0.1.0)

This post summarizes the results of our **v0.1.0 benchmark comparison** between **KeraDB**, an embedded NoSQL + vector search database, and **SQLite**, the widely used embedded relational engine.  
The goal is to highlight the strengths of each system and provide transparency on where KeraDB excels today—and where we plan to optimize next.

<!-- truncate -->

All results are taken from our Criterion.rs benchmark suite.

---

## Quick Comparison

| Category | Winner | Notes |
|---------|--------|-------|
| Single Insert | **KeraDB (~240× faster)** | No SQL parsing; native document write path |
| Point Query | **KeraDB (~5× faster)** | Hash-based lookup; no query parser |
| Complex JSON Insert | **KeraDB (~124× faster)** | Efficient binary document storage |
| Mixed Read/Write (80/20) | **KeraDB (~63× faster)** | Optimized for interactive workloads |
| Delete (100 docs) | **KeraDB (2× faster)** | Low overhead for small batches |
| Bulk Inserts (5,000 docs) | **SQLite (~4× faster)** | Transaction batching efficiency |
| Range Queries | **SQLite (7–39× faster)** | Optimized B-tree sequential scanning |
| Storage Throughput | **SQLite (~10× faster)** | WAL + batched disk sync advantages |

---

## Key Metrics

### Single Document Insert
| Database | Mean Time |
|----------|-----------|
| **KeraDB** | **33.7 µs** |
| SQLite | 8.19 ms |

### Complex JSON Insert
| Database | Mean Time |
|----------|-----------|
| **KeraDB** | **35.6 µs** |
| SQLite | 4.40 ms |

### Point Query (Lookup by ID)
| Database | Mean Time |
|----------|-----------|
| **KeraDB** | **22.9 µs** |
| SQLite | 115 µs |

### Mixed Read/Write (80/20 Workload)
| Database | Mean Time per Op |
|----------|------------------|
| **KeraDB** | **14.5 µs** |
| SQLite | 916 µs |

### Range Queries
| Limit | KeraDB | SQLite |
|-------|--------|--------|
| 10 docs | 834 µs | 111 µs |
| 100 docs | 3.53 ms | 164 µs |
| 1000 docs | 27.6 ms | 714 µs |

### Bulk Insert (5,000 docs)
| Database | Time |
|----------|------|
| KeraDB | 153 ms |
| **SQLite (Transaction)** | **37 ms** |

### Storage Throughput (5,000 docs + sync)
| Database | Throughput |
|----------|------------|
| KeraDB | 25.8K docs/sec |
| **SQLite** | **255K docs/sec** |

---

## Interpretation

### Where KeraDB Excels
KeraDB consistently dominates in **low-latency, document-centric** operations:

- Very fast single inserts and point queries  
- High performance for nested/complex JSON  
- Excellent under mixed read/write workloads  
- Strong small-batch deletion performance  
- Zero configuration and native document formats  

These characteristics make KeraDB ideal for:

- Local-first applications  
- Edge/agent workflows  
- AI pipelines and LLM tooling  
- Apps working heavily with JSON documents  
- Workloads needing predictable sub-100µs response times  

---

### Where SQLite Excels
SQLite remains exceptional for **relational batch operations** and **large sequential scans**:

- Bulk inserts scale extremely well with transactions  
- Range queries are significantly faster  
- Write-ahead logging provides strong bulk throughput  
- SQL-based analytics remain unmatched  

SQLite is still the better fit for:

- Analytical queries  
- High-volume batch ingestion  
- Heavy use of `LIMIT/OFFSET` style iteration  
- Relational schemas and SQL flexibility  

---

## What’s Next for KeraDB

Based on the benchmark profile, our upcoming optimization areas include:

- Improving range scan performance  
- Adding cursor-based iteration  
- Exploring lazy/lite document deserialization  
- Optional batched write mode  
- Reduced overhead for large result sets  

These improvements will be part of our upcoming releases.

---

## Final Thoughts

KeraDB and SQLite serve different workloads well:

- If your application is **document-first**, **JSON-heavy**, or **latency-critical** → KeraDB is shaping up to be a strong choice.  
- If you need **SQL**, **batch-heavy writes**, or **analytical scans** → use SQLite for now.

We’ll continue publishing benchmark updates as KeraDB evolves.

If you have ideas, feedback, or would like to contribute, feel free to open a discussion or issue in our GitHub repo.