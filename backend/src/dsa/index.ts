// DSA Implementations for TodoAppPro

// 1. Arrays - Task lists, search results
export class TaskArray<T> {
  private items: T[] = [];
  
  add(item: T): void { this.items.push(item); }
  remove(index: number): T | undefined { return this.items.splice(index, 1)[0]; }
  get(index: number): T | undefined { return this.items[index]; }
  size(): number { return this.items.length; }
  search(predicate: (item: T) => boolean): T[] { return this.items.filter(predicate); }
  sort(compareFn?: (a: T, b: T) => number): T[] { return [...this.items].sort(compareFn); }
  clear(): void { this.items = []; }
  getAll(): T[] { return [...this.items]; }
}

// 2. Stack - Command history, undo/redo
export class CommandStack<T> {
  private items: T[] = [];
  
  push(item: T): void { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
  peek(): T | undefined { return this.items[this.items.length - 1]; }
  isEmpty(): boolean { return this.items.length === 0; }
  size(): number { return this.items.length; }
}

// 3. Queue - Notifications, scheduled tasks
export class TaskQueue<T> {
  private items: T[] = [];
  
  enqueue(item: T): void { this.items.push(item); }
  dequeue(): T | undefined { return this.items.shift(); }
  front(): T | undefined { return this.items[0]; }
  isEmpty(): boolean { return this.items.length === 0; }
  size(): number { return this.items.length; }
}

// 4. Linked List - Task history, undo chains
class ListNode<T> {
  constructor(public data: T, public next: ListNode<T> | null = null) {}
}

export class TaskLinkedList<T> {
  private head: ListNode<T> | null = null;
  private size_ = 0;
  
  append(data: T): void {
    const newNode = new ListNode(data);
    if (!this.head) { this.head = newNode; }
    else {
      let current = this.head;
      while (current.next) current = current.next;
      current.next = newNode;
    }
    this.size_++;
  }
  
  prepend(data: T): void {
    this.head = new ListNode(data, this.head);
    this.size_++;
  }
  
  remove(data: T): boolean {
    if (!this.head) return false;
    if (this.head.data === data) {
      this.head = this.head.next;
      this.size_--;
      return true;
    }
    let current = this.head;
    while (current.next && current.next.data !== data) current = current.next;
    if (current.next) {
      current.next = current.next.next;
      this.size_--;
      return true;
    }
    return false;
  }
  
  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }
  
  size(): number { return this.size_; }
}

// 5. Hash Table - Fast task lookup, tag associations
export class TaskHashTable<K, V> {
  private buckets: Array<Array<[K, V]>>;
  private size_ = 0;
  
  constructor(private capacity = 16) {
    this.buckets = Array.from({ length: capacity }, () => []);
  }
  
  private hash(key: K): number {
    const str = String(key);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) % this.capacity;
    }
    return hash;
  }
  
  set(key: K, value: V): void {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    const existing = bucket.find(([k]) => k === key);
    if (existing) existing[1] = value;
    else {
      bucket.push([key, value]);
      this.size_++;
    }
  }
  
  get(key: K): V | undefined {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    const found = bucket.find(([k]) => k === key);
    return found ? found[1] : undefined;
  }
  
  delete(key: K): boolean {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    const foundIndex = bucket.findIndex(([k]) => k === key);
    if (foundIndex !== -1) {
      bucket.splice(foundIndex, 1);
      this.size_--;
      return true;
    }
    return false;
  }
  
  has(key: K): boolean { return this.get(key) !== undefined; }
  size(): number { return this.size_; }
  keys(): K[] {
    const result: K[] = [];
    for (const bucket of this.buckets) {
      for (const [key] of bucket) result.push(key);
    }
    return result;
  }
}

// 6. Binary Tree - Task categorization
class TreeNode<T> {
  constructor(
    public data: T,
    public left: TreeNode<T> | null = null,
    public right: TreeNode<T> | null = null
  ) {}
}

export class TaskBinaryTree<T> {
  private root: TreeNode<T> | null = null;
  
  insert(data: T): void {
    this.root = this.insertRec(this.root, data);
  }
  
  private insertRec(node: TreeNode<T> | null, data: T): TreeNode<T> {
    if (!node) return new TreeNode(data);
    if (Math.random() < 0.5) node.left = this.insertRec(node.left, data);
    else node.right = this.insertRec(node.right, data);
    return node;
  }
  
  inOrderTraversal(): T[] {
    const result: T[] = [];
    this.inOrder(this.root, result);
    return result;
  }
  
  private inOrder(node: TreeNode<T> | null, result: T[]): void {
    if (node) {
      this.inOrder(node.left, result);
      result.push(node.data);
      this.inOrder(node.right, result);
    }
  }
}

// 7. BST - Tasks sorted by priority/deadline
export class TaskBST<T> {
  private root: TreeNode<T> | null = null;
  
  constructor(private compare: (a: T, b: T) => number) {}
  
  insert(data: T): void {
    this.root = this.insertRec(this.root, data);
  }
  
  private insertRec(node: TreeNode<T> | null, data: T): TreeNode<T> {
    if (!node) return new TreeNode(data);
    if (this.compare(data, node.data) < 0) node.left = this.insertRec(node.left, data);
    else node.right = this.insertRec(node.right, data);
    return node;
  }
  
  inOrderTraversal(): T[] {
    const result: T[] = [];
    this.inOrder(this.root, result);
    return result;
  }
  
  private inOrder(node: TreeNode<T> | null, result: T[]): void {
    if (node) {
      this.inOrder(node.left, result);
      result.push(node.data);
      this.inOrder(node.right, result);
    }
  }
  
  findMin(): T | null {
    if (!this.root) return null;
    let current = this.root;
    while (current.left) current = current.left;
    return current.data;
  }
  
  findMax(): T | null {
    if (!this.root) return null;
    let current = this.root;
    while (current.right) current = current.right;
    return current.data;
  }
}

// 8. Heap/Priority Queue - Task prioritization
export class TaskPriorityQueue<T> {
  private heap: T[] = [];
  
  constructor(private compare: (a: T, b: T) => number) {}
  
  insert(item: T): void {
    this.heap.push(item);
    this.heapifyUp(this.heap.length - 1);
  }
  
  extractMin(): T | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();
    const min = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.heapifyDown(0);
    return min;
  }
  
  peek(): T | undefined { return this.heap[0]; }
  size(): number { return this.heap.length; }
  isEmpty(): boolean { return this.heap.length === 0; }
  
  private heapifyUp(index: number): void {
    const parentIndex = Math.floor((index - 1) / 2);
    if (parentIndex >= 0 && this.compare(this.heap[index], this.heap[parentIndex]) < 0) {
      [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
      this.heapifyUp(parentIndex);
    }
  }
  
  private heapifyDown(index: number): void {
    const leftChild = 2 * index + 1;
    const rightChild = 2 * index + 2;
    let smallest = index;
    
    if (leftChild < this.heap.length && this.compare(this.heap[leftChild], this.heap[smallest]) < 0) {
      smallest = leftChild;
    }
    if (rightChild < this.heap.length && this.compare(this.heap[rightChild], this.heap[smallest]) < 0) {
      smallest = rightChild;
    }
    
    if (smallest !== index) {
      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      this.heapifyDown(smallest);
    }
  }
}

// 9. Trie - Autocomplete for tags/task names
class TrieNode {
  children = new Map<string, TrieNode>();
  isEndOfWord = false;
  suggestions: string[] = [];
}

export class TaskTrie {
  private root = new TrieNode();
  
  insert(word: string): void {
    let current = this.root;
    for (const char of word.toLowerCase()) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char)!;
      current.suggestions.push(word);
      if (current.suggestions.length > 10) current.suggestions.shift();
    }
    current.isEndOfWord = true;
  }
  
  search(prefix: string): string[] {
    let current = this.root;
    for (const char of prefix.toLowerCase()) {
      if (!current.children.has(char)) return [];
      current = current.children.get(char)!;
    }
    return current.suggestions;
  }
  
  startsWith(prefix: string): boolean {
    let current = this.root;
    for (const char of prefix.toLowerCase()) {
      if (!current.children.has(char)) return false;
      current = current.children.get(char)!;
    }
    return true;
  }
}

// 10. Graph - Task dependencies
export class TaskGraph<T> {
  private adjacencyList = new Map<T, T[]>();
  
  addVertex(vertex: T): void {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }
  
  addEdge(from: T, to: T): void {
    this.addVertex(from);
    this.addVertex(to);
    this.adjacencyList.get(from)!.push(to);
  }
  
  getNeighbors(vertex: T): T[] {
    return this.adjacencyList.get(vertex) || [];
  }
  
  topologicalSort(): T[] {
    const visited = new Set<T>();
    const stack: T[] = [];
    
    for (const vertex of this.adjacencyList.keys()) {
      if (!visited.has(vertex)) {
        this.topologicalSortUtil(vertex, visited, stack);
      }
    }
    
    return stack.reverse();
  }
  
  private topologicalSortUtil(vertex: T, visited: Set<T>, stack: T[]): void {
    visited.add(vertex);
    for (const neighbor of this.getNeighbors(vertex)) {
      if (!visited.has(neighbor)) {
        this.topologicalSortUtil(neighbor, visited, stack);
      }
    }
    stack.push(vertex);
  }
}

// 11. Disjoint Set Union - Grouping related tasks
export class TaskUnionFind<T> {
  private parent = new Map<T, T>();
  private rank = new Map<T, number>();
  
  makeSet(item: T): void {
    this.parent.set(item, item);
    this.rank.set(item, 0);
  }
  
  find(item: T): T {
    if (!this.parent.has(item)) this.makeSet(item);
    if (this.parent.get(item) !== item) {
      this.parent.set(item, this.find(this.parent.get(item)!));
    }
    return this.parent.get(item)!;
  }
  
  union(item1: T, item2: T): void {
    const root1 = this.find(item1);
    const root2 = this.find(item2);
    
    if (root1 === root2) return;
    
    const rank1 = this.rank.get(root1)!;
    const rank2 = this.rank.get(root2)!;
    
    if (rank1 < rank2) {
      this.parent.set(root1, root2);
    } else if (rank1 > rank2) {
      this.parent.set(root2, root1);
    } else {
      this.parent.set(root2, root1);
      this.rank.set(root1, rank1 + 1);
    }
  }
  
  connected(item1: T, item2: T): boolean {
    return this.find(item1) === this.find(item2);
  }
}

// 12-19: Algorithms as utility functions
export class DSAAlgorithms {
  // 12. Linear Search
  static linearSearch<T>(arr: T[], target: T): number {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === target) return i;
    }
    return -1;
  }
  
  // 13. Binary Search
  static binarySearch<T>(arr: T[], target: T, compare: (a: T, b: T) => number): number {
    let left = 0, right = arr.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const cmp = compare(arr[mid], target);
      if (cmp === 0) return mid;
      if (cmp < 0) left = mid + 1;
      else right = mid - 1;
    }
    return -1;
  }
  
  // 14. Quick Sort
  static quickSort<T>(arr: T[], compare: (a: T, b: T) => number): T[] {
    if (arr.length <= 1) return arr;
    const pivot = arr[0];
    const less = arr.slice(1).filter(x => compare(x, pivot) < 0);
    const greater = arr.slice(1).filter(x => compare(x, pivot) >= 0);
    return [...this.quickSort(less, compare), pivot, ...this.quickSort(greater, compare)];
  }
  
  // 15. Merge Sort
  static mergeSort<T>(arr: T[], compare: (a: T, b: T) => number): T[] {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = this.mergeSort(arr.slice(0, mid), compare);
    const right = this.mergeSort(arr.slice(mid), compare);
    return this.merge(left, right, compare);
  }
  
  private static merge<T>(left: T[], right: T[], compare: (a: T, b: T) => number): T[] {
    const result: T[] = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
      if (compare(left[i], right[j]) <= 0) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
    }
    return result.concat(left.slice(i)).concat(right.slice(j));
  }
  
  // 16. Factorial with memoization (DP)
  private static memoCache = new Map<number, number>();
  static factorial(n: number): number {
    if (n <= 1) return 1;
    if (this.memoCache.has(n)) return this.memoCache.get(n)!;
    const result = n * this.factorial(n - 1);
    this.memoCache.set(n, result);
    return result;
  }
  
  // 17. Greedy - Next best task
  static greedyTaskSelection<T>(tasks: T[], getValue: (task: T) => number): T[] {
    return [...tasks].sort((a, b) => getValue(b) - getValue(a));
  }
  
  // 18. Bit manipulation - Status flags
  static setBit(flags: number, position: number): number {
    return flags | (1 << position);
  }
  
  static clearBit(flags: number, position: number): number {
    return flags & ~(1 << position);
  }
  
  static toggleBit(flags: number, position: number): number {
    return flags ^ (1 << position);
  }
  
  static checkBit(flags: number, position: number): boolean {
    return (flags & (1 << position)) !== 0;
  }
  
  // 19. Sliding Window - Time analysis
  static slidingWindowMax(arr: number[], k: number): number[] {
    if (k > arr.length) return [];
    const result: number[] = [];
    const deque: number[] = [];
    
    for (let i = 0; i < arr.length; i++) {
      while (deque.length && deque[0] <= i - k) deque.shift();
      while (deque.length && arr[deque[deque.length - 1]] <= arr[i]) deque.pop();
      deque.push(i);
      if (i >= k - 1) result.push(arr[deque[0]]);
    }
    
    return result;
  }
}