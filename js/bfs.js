class BFSQueue {
  constructor() {
    this._data = [];
    this._head = 0;
  }

  enqueue(item) {
    this._data.push(item);
  }

  dequeue() {
    if (this.isEmpty()) return undefined;
    const item = this._data[this._head];
    this._head++;
    if (this._head > this._data.length / 2) {
      this._data = this._data.slice(this._head);
      this._head = 0;
    }
    return item;
  }

  peek() {
    return this._data[this._head];
  }

  isEmpty() {
    return this._head >= this._data.length;
  }

  size() {
    return this._data.length - this._head;
  }
}

class BFSTraversal {
  constructor(graph, startId, maxDepth = 3) {
    this.graph = graph;
    this.startId = startId;
    this.maxDepth = maxDepth;
    this.steps = [];
    this.visitedMap = new HashMap();
    this._precompute();
  }

  _precompute() {
    const queue = new BFSQueue();
    queue.enqueue({ id: this.startId, depth: 0, parent: null });
    this.visitedMap.set(this.startId, { depth: 0, parent: null });

    while (!queue.isEmpty()) {
      const { id, depth, parent } = queue.dequeue();

      if (depth >= this.maxDepth) continue;

      const neighbors = this.graph.getNeighbors(id);
      for (const neighbor of neighbors) {
        if (!this.visitedMap.has(neighbor)) {
          this.visitedMap.set(neighbor, { depth: depth + 1, parent: id });
          queue.enqueue({ id: neighbor, depth: depth + 1, parent: id });
          this.steps.push({
            node: neighbor,
            from: id,
            depth: depth + 1,
            edgeKey: [id, neighbor].sort().join('|')
          });
        }
      }
    }
  }

  getSteps() {
    return this.steps;
  }

  getVisitedMap() {
    return this.visitedMap;
  }

  getTotalSteps() {
    return this.steps.length;
  }
}
