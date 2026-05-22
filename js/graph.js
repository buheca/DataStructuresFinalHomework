class HashMap {
  constructor(initialCapacity = 16) {
    this._buckets = new Array(initialCapacity).fill(null).map(() => []);
    this._size = 0;
    this._capacity = initialCapacity;
  }

  _hash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) % this._capacity;
    }
    return hash;
  }

  _resize() {
    const oldBuckets = this._buckets;
    this._capacity *= 2;
    this._buckets = new Array(this._capacity).fill(null).map(() => []);
    this._size = 0;
    for (const bucket of oldBuckets) {
      for (const [k, v] of bucket) {
        this.set(k, v);
      }
    }
  }

  set(key, value) {
    if (this._size / this._capacity > 0.75) this._resize();
    const idx = this._hash(key);
    const bucket = this._buckets[idx];
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket[i][1] = value;
        return;
      }
    }
    bucket.push([key, value]);
    this._size++;
  }

  get(key) {
    const idx = this._hash(key);
    const bucket = this._buckets[idx];
    for (const [k, v] of bucket) {
      if (k === key) return v;
    }
    return undefined;
  }

  has(key) {
    return this.get(key) !== undefined;
  }

  delete(key) {
    const idx = this._hash(key);
    const bucket = this._buckets[idx];
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket.splice(i, 1);
        this._size--;
        return true;
      }
    }
    return false;
  }

  keys() {
    const result = [];
    for (const bucket of this._buckets) {
      for (const [k] of bucket) result.push(k);
    }
    return result;
  }

  values() {
    const result = [];
    for (const bucket of this._buckets) {
      for (const [, v] of bucket) result.push(v);
    }
    return result;
  }

  entries() {
    const result = [];
    for (const bucket of this._buckets) {
      for (const pair of bucket) result.push(pair);
    }
    return result;
  }

  size() {
    return this._size;
  }

  clear() {
    this._buckets = new Array(this._capacity).fill(null).map(() => []);
    this._size = 0;
  }
}

class Graph {
  constructor() {
    this.adjacencyList = new HashMap();
    this.nodes = new HashMap();
  }

  addNode(id, data) {
    this.nodes.set(id, data);
    if (!this.adjacencyList.has(id)) {
      this.adjacencyList.set(id, []);
    }
  }

  addEdge(id1, id2) {
    if (!this.adjacencyList.has(id1) || !this.adjacencyList.has(id2)) return;
    const neighbors1 = this.adjacencyList.get(id1);
    const neighbors2 = this.adjacencyList.get(id2);
    if (!neighbors1.includes(id2)) neighbors1.push(id2);
    if (!neighbors2.includes(id1)) neighbors2.push(id1);
  }

  getNeighbors(id) {
    return this.adjacencyList.get(id) || [];
  }

  getNode(id) {
    return this.nodes.get(id);
  }

  getAllNodes() {
    return this.nodes.values();
  }

  getAllEdges() {
    const edges = [];
    const seen = new Set();
    for (const [id, neighbors] of this.adjacencyList.entries()) {
      for (const neighbor of neighbors) {
        const key = [id, neighbor].sort().join('|');
        if (!seen.has(key)) {
          seen.add(key);
          edges.push([id, neighbor]);
        }
      }
    }
    return edges;
  }

  getNodeCount() {
    return this.nodes.size();
  }

  getEdgeCount() {
    return this.getAllEdges().length;
  }
}
