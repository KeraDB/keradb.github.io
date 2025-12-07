---
slug: keradb-vs-duckdb-benchmark-v0-1-0
title: KeraDB vs DuckDB Benchmark (v0.1.0) — OLTP Meets OLAP (Quack Quack)
authors: [keradb]
tags: [benchmark, performance, duckdb, olap, oltp, nosql]
date: 2025-12-05
---

# KeraDB vs DuckDB Benchmark (v0.1.0)

Before we begin… yes, we know.  
**DuckDB is OLAP. KeraDB is OLTP.**  
One is built to slice through massive analytical datasets like a lightsaber.  
The other is optimized for fast, tiny transactional operations.

This benchmark is *not* a fair fight — and we knew that.  
But developers kept asking questions, and curiosity got the best of us.  
So we ran it anyway using Rust’s `criterion.rs` benchmarking suite.

And in the spirit of DuckDB:  
**Quack quack.** 🦆  
Let's see what happened.

<!-- truncate -->

---

## Quick Summary

Despite being an OLAP engine, **DuckDB held its own in range scans**, while KeraDB — as expected — dominated on OLTP-style operations such as inserts, updates, deletes, point lookups, mixed workloads, and JSON-heavy tasks.

In other words:

- When the workload looks like **“give me a bunch of rows, now!”** → DuckDB shines.  
- When the workload looks like **“insert, update, lookup, delete… repeat fast!”** → KeraDB zooms.  

This test confirms what we already suspected — and reveals where each engine’s internal design flexes its muscles.

---

## Quick Comparison

| Category | Winner | Performance Advantage |
|----------|--------|-----------------------|
| Single Insert | **KeraDB** | ~29× faster |
| Bulk Insert (100–5,000 docs) | **KeraDB** | 16–19× faster |
| Point Query | **KeraDB** | ~66× faster |
| Range Query (10 docs) | **DuckDB** | ~1.5× faster |
| Range Query (100 docs) | **KeraDB** | slight win |
| Range Query (1000 docs) | **DuckDB** | ~3.6× faster |
| Updates | **KeraDB** | ~70× faster |
| Deletes | **KeraDB** | ~40× faster |
| Complex JSON Insert | **KeraDB** | ~27× faster |
| Mixed Workload (80/20) | **KeraDB** | ~66× faster |
| Storage Sync (5k docs) | **KeraDB** | ~11× faster |

**Takeaway:**  
DuckDB can sprint across columns like an Olympian, but KeraDB handles OLTP-style workloads with ease — exactly as intended.

---

## Key Metrics

### 1. Single Insert
| Database | Mean Time |
|----------|-----------|
| **KeraDB** | **53.97 µs** |
| DuckDB | 1.58 ms |

### 2. Bulk Insert Performance
| Batch Size | KeraDB | DuckDB |
|------------|--------|--------|
| 100 docs | **6.48 ms** | 125.67 ms |
| 1,000 docs | **55.38 ms** | 955.61 ms |
| 5,000 docs | **283.96 ms** | 4.69 s |

### 3. Point Query
| Database | Mean Time |
|----------|-----------|
| **KeraDB** | **9.62 µs** |
| DuckDB | 635.78 µs |

### 4. Range Queries
| Limit | KeraDB | DuckDB | Winner |
|-------|--------|--------|--------|
| 10 docs | 1.221 ms | **0.799 ms** | DuckDB |
| 100 docs | **2.331 ms** | 2.462 ms | KeraDB (slight) |
| 1000 docs | 12.379 ms | **3.455 ms** | DuckDB |

This is the OLAP sweet spot: scanning across columns in batch.

### 5. Updates
| Database | Mean Time |
|----------|-----------|
| **KeraDB** | **23.18 µs** |
| DuckDB | 1.61 ms |

### 6. Deletes
| Count | KeraDB | DuckDB |
|-------|--------|--------|
| 100 docs | **2.14 ms** | 85.12 ms |
| 500 docs | **11.22 ms** | 336.45 ms |

### 7. Complex JSON Insert
| Database | Mean Time |
|----------|-----------|
| **KeraDB** | **60.33 µs** |
| DuckDB | 1.65 ms |

### 8. Mixed Read/Write (80% read / 20% write)
| Database | Mean Time |
|----------|-----------|
| **KeraDB** | **18.69 µs** |
| DuckDB | 1.24 ms |

### 9. Storage Sync (5,000 docs)
| Database | Mean Time |
|----------|-----------|
| **KeraDB** | **279 ms** |
| DuckDB | 3.05 s |

---

## Interpretation: OLTP vs OLAP (aka “The Quackening”)

DuckDB excels in exactly what it was designed for:

- analytic workloads  
- scanning many rows  
- vectorized execution  
- heavy range queries  

When we hit it with OLTP-style micro-operations (single inserts, updates, point lookups), it politely responded with:  

**“Sir… this is a columnar engine.” - 🧐**

Meanwhile, KeraDB — being a lightweight document OLTP store — tore through these tasks with microsecond-level latency.

This test didn’t crown a universal winner. It simply reaffirmed their **different purposes**.

---

## Where KeraDB Excels
- Single inserts  
- JSON-heavy writes  
- Point lookups  
- Updates & deletes  
- Mixed workloads  
- Storage syncs  
- Bulk inserts  

More importantly:  **KeraDB’s performance profile aligns with its OLTP design goals.**

---

## Where DuckDB Excels
- Range queries  
- Analytical scans  
- Columnar operations  
- Batched reads  

And of course:  **being a duck that quacks loudly in analytics.**
