# 🔬 Cursor AI Models Benchmark: Comparative Analysis

[![MLH Challenge](https://img.shields.io/badge/MLH-Global%20Hack%20Week%20Challenge%202-orange.svg)](https://www.mlh.com/)
[![Cursor](https://img.shields.io/badge/Benchmarked%20in-Cursor%20Editor-blue.svg)](https://cursor.com/)

A comparative benchmarking analysis conducted inside **Cursor Desktop App** across three leading AI models for **MLH Global Hack Week: Hacktoberfest (Challenge 2: Benchmark Cursor’s Models)**.

---

## 🎯 Test Methodology

To ensure consistency, an identical prompt was submitted across three major models available in Cursor:
1. **Claude 3.5 Sonnet** (Anthropic)
2. **GPT-4o** (OpenAI)
3. **Cursor-Small / Gemini Flash** (Low-latency lightweight model)

### 📌 The Standardized Prompt
> *"Write a production-ready LRU (Least Recently Used) Cache class in TypeScript with `get(key)`, `put(key, value, ttlMs?)`, and a strict capacity limit. Handle edge cases (TTL expiration, capacity eviction, updating existing keys, zero/negative capacity) with $O(1)$ time complexity for all core operations, and explain your design decisions."*

---

## 📊 Summary Comparison Matrix

| Evaluation Criteria | 🥇 Claude 3.5 Sonnet | 🥈 GPT-4o | ⚡ Cursor-Small / Gemini Flash |
| :--- | :--- | :--- | :--- |
| **Data Structure Approach** | Doubly Linked List + Map ($O(1)$) | Doubly Linked List + Map ($O(1)$) | Native JavaScript `Map` ($O(1)$ keys insertion order) |
| **Response Latency** | Moderate (~3.8s) | Fast (~2.7s) | Ultra-Fast (~0.9s) |
| **Type Safety & Generics** | Complete (`LRUCache<K, V>`) | Complete (`LRUCache<K, V>`) | Basic TypeScript types |
| **TTL Handling** | Lazy expiration + cleanup hooks | Lazy expiration on `get()` / `put()` | Simple timestamp check |
| **Edge Case Resilience** | Exceptional (handles capacity = 0, node detachment, key renewal) | Great (guards against stale nodes, capacity overflows) | Good (misses zero-capacity validation edge case) |
| **Documentation & Explanation**| Deep breakdown of pointers and invariants | Clear, readable comments and complexity breakdown | Concise, minimal summary |

---

## 🔍 Detailed Model Breakdown & Pros/Cons

### 1. Claude 3.5 Sonnet
* **Role**: Primary heavy coding & architectural reasoning.
* **Output Characteristics**: Provided a textbook doubly-linked list with dummy `head` and `tail` sentinels to eliminate null-check edge cases. Wrapped all operations in strict TypeScript generics with comprehensive JSDoc comments.
* **Pros**:
  - Highest architectural correctness; engineered true $O(1)$ doubly-linked list nodes without pointer leakage.
  - Anticipated obscure edge cases: properly resets TTL on updating an existing key and handles sub-millisecond expirations.
  - Exceptional explanation detailing pointer manipulation invariants and memory considerations.
* **Cons**:
  - Higher response latency compared to small models.
  - Output is more verbose, generating substantial boilerplate code.

---

### 2. GPT-4o
* **Role**: General-purpose multimodal reasoning & rapid scaffolding.
* **Output Characteristics**: Delivered a clean, readable implementation balancing boilerplate with concise utility methods (`_remove(node)`, `_insert(node)`).
* **Pros**:
  - Very fast time-to-first-token while maintaining high code quality.
  - Balanced verbosity—concise code structure that is very easy for human developers to scan and integrate quickly.
  - Accurately implemented $O(1)$ lookups and updates with intuitive error throwing.
* **Cons**:
  - Slightly less defensive with boundary inputs (e.g. didn't validate negative TTL input).
  - Explanation was standard rather than diving into low-level runtime memory management.

---

### 3. Cursor-Small (Fast / Flash)
* **Role**: Inline completions, quick edits, and low-latency drafting.
* **Output Characteristics**: Leveraged JavaScript's native `Map` property (which preserves insertion order) with `map.delete(key)` and `map.set(key, value)` to simulate LRU eviction without manual pointer manipulation.
* **Pros**:
  - Blazing fast generation speed (near-instantaneous response).
  - Remarkably concise and practical for everyday JS/TS projects that don't need low-level pointer management.
  - Lowest token usage and resource footprint.
* **Cons**:
  - Relies on JavaScript engine internal Map hash-table reordering instead of true algorithmic linked-list pointers.
  - Less detailed explanations and fewer defensive type assertions.

---

## 💡 Key Takeaways & Recommendations

- **Use Claude 3.5 Sonnet in Cursor when**: Writing complex algorithms, multi-file refactors, deep debugging, and architecture scaffolding where edge-case correctness is paramount.
- **Use GPT-4o in Cursor when**: You need well-balanced, rapid full-function generation, general API integration, or quick explanations.
- **Use Cursor-Small when**: You need instantaneous code completions, short utility functions, or quick regex/boilerplate generation without waiting on large reasoning models.

---

## 📝 MLH Submission Details

* **Challenge**: [CHALLENGE 2: Benchmark Cursor’s Models](https://www.mlh.com/events/global-hack-week-open-source-90/challenges/01a11d25-134c-17e5-e22c-8af278534580)
* **Project Name**: `Cursor Model Benchmark: Comparative Performance Analysis`
* **Project URL**: `https://github.com/YTxFSGAMERz/cursor-model-benchmark`
* **Technologies Used**: `Cursor AI`, `TypeScript`, `Node.js`, `LLM Benchmarking`

### Description for Submission:
> Benchmarked 3 prominent Cursor AI models (Claude 3.5 Sonnet, GPT-4o, and Cursor-Small) on an identical algorithmic prompt: building a production-ready LRU Cache with TTL support and $O(1)$ guarantees in TypeScript. Evaluated each model based on data structure selection, response latency, edge-case coverage, and explanation quality.
>
> **Pros & Cons Summary**:
> - **Claude 3.5 Sonnet**: *Pros:* Flawless pointer architecture with sentinel nodes and deep edge case handling. *Cons:* Slower response time and higher verbosity.
> - **GPT-4o**: *Pros:* Excellent speed-to-quality ratio with clean, readable code. *Cons:* Less rigorous defensive validation on negative boundaries.
> - **Cursor-Small**: *Pros:* Instantaneous generation and pragmatic native JS Map usage. *Cons:* Less rigorous algorithmic structure and minimal explanations.
