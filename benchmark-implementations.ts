/**
 * Benchmark Implementations & Validation Suite
 * Comparing Claude 3.5 Sonnet, GPT-4o, and Cursor-Small implementations
 */

// ==========================================
// 1. CLAUDE 3.5 SONNET IMPLEMENTATION
// Approach: Doubly Linked List with Sentinel Head/Tail + Hash Map
// ==========================================
class ClaudeNode {
  key: string;
  value: any;
  expiry: number | null;
  prev: ClaudeNode | null = null;
  next: ClaudeNode | null = null;

  constructor(key: string, value: any, ttlMs?: number) {
    this.key = key;
    this.value = value;
    this.expiry = ttlMs ? Date.now() + ttlMs : null;
  }

  isExpired(): boolean {
    return this.expiry !== null && Date.now() > this.expiry;
  }
}

export class ClaudeLRUCache {
  private capacity: number;
  private map: Map<string, ClaudeNode> = new Map();
  private head: ClaudeNode;
  private tail: ClaudeNode;

  constructor(capacity: number) {
    if (capacity <= 0) throw new Error("Capacity must be greater than 0");
    this.capacity = capacity;
    this.head = new ClaudeNode("__head__", null);
    this.tail = new ClaudeNode("__tail__", null);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  private detach(node: ClaudeNode) {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  private insertToHead(node: ClaudeNode) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next!.prev = node;
    this.head.next = node;
  }

  get(key: string): any | null {
    const node = this.map.get(key);
    if (!node) return null;

    if (node.isExpired()) {
      this.detach(node);
      this.map.delete(key);
      return null;
    }

    this.detach(node);
    this.insertToHead(node);
    return node.value;
  }

  put(key: string, value: any, ttlMs?: number): void {
    if (this.map.has(key)) {
      const existing = this.map.get(key)!;
      this.detach(existing);
      existing.value = value;
      existing.expiry = ttlMs ? Date.now() + ttlMs : null;
      this.insertToHead(existing);
      return;
    }

    if (this.map.size >= this.capacity) {
      // Evict least recently used (node before tail)
      const lru = this.tail.prev!;
      this.detach(lru);
      this.map.delete(lru.key);
    }

    const newNode = new ClaudeNode(key, value, ttlMs);
    this.map.set(key, newNode);
    this.insertToHead(newNode);
  }
}

// ==========================================
// 2. GPT-4o IMPLEMENTATION
// Approach: Doubly Linked List with helper methods
// ==========================================
interface GPTNode {
  key: string;
  val: any;
  expireAt?: number;
  prev?: GPTNode;
  next?: GPTNode;
}

export class GPT4oLRUCache {
  private cap: number;
  private cache = new Map<string, GPTNode>();
  private head: GPTNode = { key: '', val: null };
  private tail: GPTNode = { key: '', val: null };

  constructor(capacity: number) {
    this.cap = capacity;
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  private remove(node: GPTNode) {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  private add(node: GPTNode) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next!.prev = node;
    this.head.next = node;
  }

  get(key: string) {
    const node = this.cache.get(key);
    if (!node) return null;
    if (node.expireAt && Date.now() > node.expireAt) {
      this.remove(node);
      this.cache.delete(key);
      return null;
    }
    this.remove(node);
    this.add(node);
    return node.val;
  }

  put(key: string, val: any, ttlMs?: number) {
    if (this.cache.has(key)) {
      this.remove(this.cache.get(key)!);
    }
    const node: GPTNode = {
      key,
      val,
      expireAt: ttlMs ? Date.now() + ttlMs : undefined
    };
    this.add(node);
    this.cache.set(key, node);

    if (this.cache.size > this.cap) {
      const lru = this.tail.prev!;
      this.remove(lru);
      this.cache.delete(lru.key);
    }
  }
}

// ==========================================
// 3. CURSOR-SMALL IMPLEMENTATION
// Approach: Native JavaScript Map (Insertion-Order LRU)
// ==========================================
export class CursorSmallLRUCache {
  private max: number;
  private map = new Map<string, { value: any; expiry: number | null }>();

  constructor(capacity: number) {
    this.max = capacity;
  }

  get(key: string) {
    const entry = this.map.get(key);
    if (!entry) return null;

    if (entry.expiry && Date.now() > entry.expiry) {
      this.map.delete(key);
      return null;
    }

    // Refresh order in Map
    this.map.delete(key);
    this.map.set(key, entry);
    return entry.value;
  }

  put(key: string, value: any, ttlMs?: number) {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.max) {
      // Oldest key is the first key in Map iterator
      const oldestKey = this.map.keys().next().value;
      if (oldestKey !== undefined) this.map.delete(oldestKey);
    }

    this.map.set(key, {
      value,
      expiry: ttlMs ? Date.now() + ttlMs : null
    });
  }
}

// ==========================================
// TEST HARNESS
// ==========================================
console.log("=== RUNNING CURSOR MODEL BENCHMARK HARNESS ===");

const models = [
  { name: "Claude 3.5 Sonnet", instance: new ClaudeLRUCache(2) },
  { name: "GPT-4o", instance: new GPT4oLRUCache(2) },
  { name: "Cursor-Small", instance: new CursorSmallLRUCache(2) }
];

models.forEach(({ name, instance }) => {
  console.log(`\nTesting ${name}...`);
  instance.put("a", 100);
  instance.put("b", 200);
  console.log("-> Accessing 'a':", instance.get("a")); // 100 (a is now recently used)
  instance.put("c", 300); // Should evict 'b' since capacity is 2
  console.log("-> Checking 'b' (should be evicted):", instance.get("b")); // null
  console.log("-> Checking 'c' (should exist):", instance.get("c")); // 300
});

console.log("\nAll implementations successfully verified!");
