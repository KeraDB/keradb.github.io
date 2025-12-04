---
slug: keradb-vs-rocksdb-benchmark-v0-1-0
title: KeraDB vs RocksDB Benchmark (v0.1.0) — Yes, We Got Destroyed… For Now
authors: [keradb]
tags: [benchmark, performance, rocksdb, nosql, rust]
date: 2025-12-04
---

# KeraDB vs RocksDB Benchmark (v0.1.0)

This post shares our **KeraDB vs RocksDB benchmark results**, and let’s just say it upfront:  
**RocksDB absolutely outperformed us in most categories.**

But that’s okay.

Because RocksDB has:
- 10+ years of optimization,
- dozens of Facebook engineers behind it,
- and billions of production workloads tuning it daily.

KeraDB has:
- one maintainer with coffee,
- dreams,
- and version **v0.1.0**.

So yes — RocksDB is faster. But KeraDB is just getting started, and this benchmark gives us a map for where to improve next.  
(Also: we did win *one* category. Let us enjoy that.)

<!-- truncate -->

All benchmarks come from our Criterion.rs suite.

---

## Quick Comparison

| Category | Winner | Performance Advantage |
|----------|--------|-----------------------|
| Single Insert | **RocksDB** | ~5× faster |
| Point Query | **RocksDB** | ~6.8× faster |
| Range Queries | **RocksDB** | 28–180× faster (yes… ouch) |
| Complex JSON Insert | **RocksDB** | ~3.3× faster |
| Mixed Read/Write (80/20) | **RocksDB** | ~4.5× faster |
| Delete (100 docs) | **RocksDB** | ~2.3× faster |
| Bulk Storage (5k docs) | **RocksDB** | ~22× faster |
| Bulk Insert (100 docs) | **KeraDB** | ~7× faster (our one glorious win) |
| Bulk Insert (≥1k docs) | **RocksDB** | 1.05–4.2× faster |
| Updates | **RocksDB** | ~1.35× faster |

**TL;DR:** RocksDB won almost every round except the first 100-doc bulk insert test, where KeraDB stood tall and said:  
*"Not today, giant."*

---

## Key Metrics

### Single Document Insert
| Database | Mean Time |
|----------|-----------|
| **RocksDB** | **12.45 µs** |
| KeraDB | 63.01 µs |

### Bulk Insert
| Size | KeraDB | RocksDB |
|------|--------|----------|
| 100 docs | **8.72 ms** | 62.80 ms |
| 1,000 docs | 66.45 ms | **63.43 ms** |
| 5,000 docs | 333.0 ms | **79.59 ms** |

> KeraDB wins the smallest batch… and then gets folded immediately after.

### Point Query
| Database | Mean Time |
|----------|-----------|
| **RocksDB** | **1.33 µs** |
| KeraDB | 9.10 µs |

### Range Queries
| Limit | KeraDB | RocksDB |
|-------|--------|---------|
| 10 docs | 986 µs | **5.50 µs** |
| 100 docs | 1.821 ms | **41.76 µs** |
| 1000 docs | 11.64 ms | **412.4 µs** |

This chart hurt our feelings.

### Complex JSON Insert
| Database | Mean Time |
|----------|-----------|
| **RocksDB** | **21.64 µs** |
| KeraDB | 70.86 µs |

### Mixed Workload (80% read / 20% write)
| Database | Mean Time |
|----------|------------|
| **RocksDB** | **4.61 µs** |
| KeraDB | 20.88 µs |

### Delete Operations
| Count | KeraDB | RocksDB |
|-------|--------|----------|
| 100 docs | 1.77 ms | **0.74 ms** |
| 500 docs | 10.74 ms | **4.69 ms** |

### Storage Throughput (5,000 docs)
| Database | Throughput |
|----------|-------------|
| **RocksDB** | **386K docs/sec** |
| KeraDB | 17.7K docs/sec |

---

## So… Why Did RocksDB Win So Hard?

RocksDB is basically the final form of an LSM-tree database:  
- highly optimized write paths,  
- background compaction,  
- lightning-fast key-range iteration,  
- efficient prefix scanning,  
- production-grade caches and bloom filters.

Meanwhile, KeraDB is intentionally simple today:
- no compaction,
- no write-ahead log,
- no tiered storage,
- no bloom filters,
- no column families,
- no LSM tree… yet.

We’re playing checkers while RocksDB is playing 6D chess.

---

## Where KeraDB Still Shines

Even in v0.1.0, KeraDB has early strengths:

- **Low dependency footprint** — pure Rust, no native bindings  
- **Simple, document-first API**  
- **Fast small-batch inserts (100 docs)**  
- **Predictable, clean codebase that’s easy to evolve**  
- **Native JSON/document storage** without schema overhead  

And most importantly:

> **KeraDB isn’t trying to be RocksDB.**

At least not yet.

KeraDB is built for:
- embedded AI agents  
- local-first apps  
- edge workloads  
- vector search  
- document-centric micro-databases  

These workloads value simplicity and flexibility, not raw LSM-tree throughput.

---

## The Road Ahead (a.k.a. Our Villain Arc Begins)

Based on these results, here’s what we’re improving next:

### Coming Soon
- Range scan optimization  
- Write batching  
- Early compaction strategies  
- Optional WAL mode  
- Prefix-based iteration  
- Better on-disk layout for sequential scans  
- Optimized delete paths  

### Coming Later
- A lightweight LSM-tree variant  
- Configurable storage engines  
- Bloom filters  
- Caching layers  
- Column families  

In short:  
**v0.2.x and v0.3.x are going to be spicy.**

---

## Final Thoughts  
RocksDB is still the heavyweight champion of embedded key-value stores — as it should be.  
KeraDB is the new challenger, still stretching, still sipping pre-workout.

But benchmarks like this give us the roadmap to get stronger.

We’ll get faster.  
We’ll get smarter.  
We’ll absolutely close these gaps.

And one day — maybe not today, maybe not tomorrow — **KeraDB will run this rematch.**

Stay tuned.