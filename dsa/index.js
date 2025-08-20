"use strict";
// DSA Implementations for TodoAppPro
Object.defineProperty(exports, "__esModule", { value: true });
exports.DSAAlgorithms = exports.TaskUnionFind = exports.TaskGraph = exports.TaskTrie = exports.TaskPriorityQueue = exports.TaskBST = exports.TaskBinaryTree = exports.TaskHashTable = exports.TaskLinkedList = exports.TaskQueue = exports.CommandStack = exports.TaskArray = void 0;
// 1. Arrays - Task lists, search results
class TaskArray {
    constructor() {
        this.items = [];
    }
    add(item) { this.items.push(item); }
    remove(index) { return this.items.splice(index, 1)[0]; }
    get(index) { return this.items[index]; }
    size() { return this.items.length; }
    search(predicate) { return this.items.filter(predicate); }
    sort(compareFn) { return [...this.items].sort(compareFn); }
    clear() { this.items = []; }
    getAll() { return [...this.items]; }
}
exports.TaskArray = TaskArray;
// 2. Stack - Command history, undo/redo
class CommandStack {
    constructor() {
        this.items = [];
    }
    push(item) { this.items.push(item); }
    pop() { return this.items.pop(); }
    peek() { return this.items[this.items.length - 1]; }
    isEmpty() { return this.items.length === 0; }
    size() { return this.items.length; }
}
exports.CommandStack = CommandStack;
// 3. Queue - Notifications, scheduled tasks
class TaskQueue {
    constructor() {
        this.items = [];
    }
    enqueue(item) { this.items.push(item); }
    dequeue() { return this.items.shift(); }
    front() { return this.items[0]; }
    isEmpty() { return this.items.length === 0; }
    size() { return this.items.length; }
}
exports.TaskQueue = TaskQueue;
// 4. Linked List - Task history, undo chains
class ListNode {
    constructor(data, next = null) {
        this.data = data;
        this.next = next;
    }
}
class TaskLinkedList {
    constructor() {
        this.head = null;
        this.size_ = 0;
    }
    append(data) {
        const newNode = new ListNode(data);
        if (!this.head) {
            this.head = newNode;
        }
        else {
            let current = this.head;
            while (current.next)
                current = current.next;
            current.next = newNode;
        }
        this.size_++;
    }
    prepend(data) {
        this.head = new ListNode(data, this.head);
        this.size_++;
    }
    remove(data) {
        if (!this.head)
            return false;
        if (this.head.data === data) {
            this.head = this.head.next;
            this.size_--;
            return true;
        }
        let current = this.head;
        while (current.next && current.next.data !== data)
            current = current.next;
        if (current.next) {
            current.next = current.next.next;
            this.size_--;
            return true;
        }
        return false;
    }
    toArray() {
        const result = [];
        let current = this.head;
        while (current) {
            result.push(current.data);
            current = current.next;
        }
        return result;
    }
    size() { return this.size_; }
}
exports.TaskLinkedList = TaskLinkedList;
// 5. Hash Table - Fast task lookup, tag associations
class TaskHashTable {
    constructor(capacity = 16) {
        this.capacity = capacity;
        this.size_ = 0;
        this.buckets = Array.from({ length: capacity }, () => []);
    }
    hash(key) {
        const str = String(key);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * 31 + str.charCodeAt(i)) % this.capacity;
        }
        return hash;
    }
    set(key, value) {
        const index = this.hash(key);
        const bucket = this.buckets[index];
        const existing = bucket.find(([k]) => k === key);
        if (existing)
            existing[1] = value;
        else {
            bucket.push([key, value]);
            this.size_++;
        }
    }
    get(key) {
        const index = this.hash(key);
        const bucket = this.buckets[index];
        const found = bucket.find(([k]) => k === key);
        return found ? found[1] : undefined;
    }
    delete(key) {
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
    has(key) { return this.get(key) !== undefined; }
    size() { return this.size_; }
    keys() {
        const result = [];
        for (const bucket of this.buckets) {
            for (const [key] of bucket)
                result.push(key);
        }
        return result;
    }
}
exports.TaskHashTable = TaskHashTable;
// 6. Binary Tree - Task categorization
class TreeNode {
    constructor(data, left = null, right = null) {
        this.data = data;
        this.left = left;
        this.right = right;
    }
}
class TaskBinaryTree {
    constructor() {
        this.root = null;
    }
    insert(data) {
        this.root = this.insertRec(this.root, data);
    }
    insertRec(node, data) {
        if (!node)
            return new TreeNode(data);
        if (Math.random() < 0.5)
            node.left = this.insertRec(node.left, data);
        else
            node.right = this.insertRec(node.right, data);
        return node;
    }
    inOrderTraversal() {
        const result = [];
        this.inOrder(this.root, result);
        return result;
    }
    inOrder(node, result) {
        if (node) {
            this.inOrder(node.left, result);
            result.push(node.data);
            this.inOrder(node.right, result);
        }
    }
}
exports.TaskBinaryTree = TaskBinaryTree;
// 7. BST - Tasks sorted by priority/deadline
class TaskBST {
    constructor(compare) {
        this.compare = compare;
        this.root = null;
    }
    insert(data) {
        this.root = this.insertRec(this.root, data);
    }
    insertRec(node, data) {
        if (!node)
            return new TreeNode(data);
        if (this.compare(data, node.data) < 0)
            node.left = this.insertRec(node.left, data);
        else
            node.right = this.insertRec(node.right, data);
        return node;
    }
    inOrderTraversal() {
        const result = [];
        this.inOrder(this.root, result);
        return result;
    }
    inOrder(node, result) {
        if (node) {
            this.inOrder(node.left, result);
            result.push(node.data);
            this.inOrder(node.right, result);
        }
    }
    findMin() {
        if (!this.root)
            return null;
        let current = this.root;
        while (current.left)
            current = current.left;
        return current.data;
    }
    findMax() {
        if (!this.root)
            return null;
        let current = this.root;
        while (current.right)
            current = current.right;
        return current.data;
    }
}
exports.TaskBST = TaskBST;
// 8. Heap/Priority Queue - Task prioritization
class TaskPriorityQueue {
    constructor(compare) {
        this.compare = compare;
        this.heap = [];
    }
    insert(item) {
        this.heap.push(item);
        this.heapifyUp(this.heap.length - 1);
    }
    extractMin() {
        if (this.heap.length === 0)
            return undefined;
        if (this.heap.length === 1)
            return this.heap.pop();
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        return min;
    }
    peek() { return this.heap[0]; }
    size() { return this.heap.length; }
    isEmpty() { return this.heap.length === 0; }
    heapifyUp(index) {
        const parentIndex = Math.floor((index - 1) / 2);
        if (parentIndex >= 0 && this.compare(this.heap[index], this.heap[parentIndex]) < 0) {
            [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
            this.heapifyUp(parentIndex);
        }
    }
    heapifyDown(index) {
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
exports.TaskPriorityQueue = TaskPriorityQueue;
// 9. Trie - Autocomplete for tags/task names
class TrieNode {
    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
        this.suggestions = [];
    }
}
class TaskTrie {
    constructor() {
        this.root = new TrieNode();
    }
    insert(word) {
        let current = this.root;
        for (const char of word.toLowerCase()) {
            if (!current.children.has(char)) {
                current.children.set(char, new TrieNode());
            }
            current = current.children.get(char);
            current.suggestions.push(word);
            if (current.suggestions.length > 10)
                current.suggestions.shift();
        }
        current.isEndOfWord = true;
    }
    search(prefix) {
        let current = this.root;
        for (const char of prefix.toLowerCase()) {
            if (!current.children.has(char))
                return [];
            current = current.children.get(char);
        }
        return current.suggestions;
    }
    startsWith(prefix) {
        let current = this.root;
        for (const char of prefix.toLowerCase()) {
            if (!current.children.has(char))
                return false;
            current = current.children.get(char);
        }
        return true;
    }
}
exports.TaskTrie = TaskTrie;
// 10. Graph - Task dependencies
class TaskGraph {
    constructor() {
        this.adjacencyList = new Map();
    }
    addVertex(vertex) {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, []);
        }
    }
    addEdge(from, to) {
        this.addVertex(from);
        this.addVertex(to);
        this.adjacencyList.get(from).push(to);
    }
    getNeighbors(vertex) {
        return this.adjacencyList.get(vertex) || [];
    }
    topologicalSort() {
        const visited = new Set();
        const stack = [];
        for (const vertex of this.adjacencyList.keys()) {
            if (!visited.has(vertex)) {
                this.topologicalSortUtil(vertex, visited, stack);
            }
        }
        return stack.reverse();
    }
    topologicalSortUtil(vertex, visited, stack) {
        visited.add(vertex);
        for (const neighbor of this.getNeighbors(vertex)) {
            if (!visited.has(neighbor)) {
                this.topologicalSortUtil(neighbor, visited, stack);
            }
        }
        stack.push(vertex);
    }
}
exports.TaskGraph = TaskGraph;
// 11. Disjoint Set Union - Grouping related tasks
class TaskUnionFind {
    constructor() {
        this.parent = new Map();
        this.rank = new Map();
    }
    makeSet(item) {
        this.parent.set(item, item);
        this.rank.set(item, 0);
    }
    find(item) {
        if (!this.parent.has(item))
            this.makeSet(item);
        if (this.parent.get(item) !== item) {
            this.parent.set(item, this.find(this.parent.get(item)));
        }
        return this.parent.get(item);
    }
    union(item1, item2) {
        const root1 = this.find(item1);
        const root2 = this.find(item2);
        if (root1 === root2)
            return;
        const rank1 = this.rank.get(root1);
        const rank2 = this.rank.get(root2);
        if (rank1 < rank2) {
            this.parent.set(root1, root2);
        }
        else if (rank1 > rank2) {
            this.parent.set(root2, root1);
        }
        else {
            this.parent.set(root2, root1);
            this.rank.set(root1, rank1 + 1);
        }
    }
    connected(item1, item2) {
        return this.find(item1) === this.find(item2);
    }
}
exports.TaskUnionFind = TaskUnionFind;
// 12-19: Algorithms as utility functions
class DSAAlgorithms {
    // 12. Linear Search
    static linearSearch(arr, target) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === target)
                return i;
        }
        return -1;
    }
    // 13. Binary Search
    static binarySearch(arr, target, compare) {
        let left = 0, right = arr.length - 1;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const cmp = compare(arr[mid], target);
            if (cmp === 0)
                return mid;
            if (cmp < 0)
                left = mid + 1;
            else
                right = mid - 1;
        }
        return -1;
    }
    // 14. Quick Sort
    static quickSort(arr, compare) {
        if (arr.length <= 1)
            return arr;
        const pivot = arr[0];
        const less = arr.slice(1).filter(x => compare(x, pivot) < 0);
        const greater = arr.slice(1).filter(x => compare(x, pivot) >= 0);
        return [...this.quickSort(less, compare), pivot, ...this.quickSort(greater, compare)];
    }
    // 15. Merge Sort
    static mergeSort(arr, compare) {
        if (arr.length <= 1)
            return arr;
        const mid = Math.floor(arr.length / 2);
        const left = this.mergeSort(arr.slice(0, mid), compare);
        const right = this.mergeSort(arr.slice(mid), compare);
        return this.merge(left, right, compare);
    }
    static merge(left, right, compare) {
        const result = [];
        let i = 0, j = 0;
        while (i < left.length && j < right.length) {
            if (compare(left[i], right[j]) <= 0) {
                result.push(left[i++]);
            }
            else {
                result.push(right[j++]);
            }
        }
        return result.concat(left.slice(i)).concat(right.slice(j));
    }
    static factorial(n) {
        if (n <= 1)
            return 1;
        if (this.memoCache.has(n))
            return this.memoCache.get(n);
        const result = n * this.factorial(n - 1);
        this.memoCache.set(n, result);
        return result;
    }
    // 17. Greedy - Next best task
    static greedyTaskSelection(tasks, getValue) {
        return [...tasks].sort((a, b) => getValue(b) - getValue(a));
    }
    // 18. Bit manipulation - Status flags
    static setBit(flags, position) {
        return flags | (1 << position);
    }
    static clearBit(flags, position) {
        return flags & ~(1 << position);
    }
    static toggleBit(flags, position) {
        return flags ^ (1 << position);
    }
    static checkBit(flags, position) {
        return (flags & (1 << position)) !== 0;
    }
    // 19. Sliding Window - Time analysis
    static slidingWindowMax(arr, k) {
        if (k > arr.length)
            return [];
        const result = [];
        const deque = [];
        for (let i = 0; i < arr.length; i++) {
            while (deque.length && deque[0] <= i - k)
                deque.shift();
            while (deque.length && arr[deque[deque.length - 1]] <= arr[i])
                deque.pop();
            deque.push(i);
            if (i >= k - 1)
                result.push(arr[deque[0]]);
        }
        return result;
    }
}
exports.DSAAlgorithms = DSAAlgorithms;
// 16. Factorial with memoization (DP)
DSAAlgorithms.memoCache = new Map();
//# sourceMappingURL=index.js.map