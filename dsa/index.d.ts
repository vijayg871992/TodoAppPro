export declare class TaskArray<T> {
    private items;
    add(item: T): void;
    remove(index: number): T | undefined;
    get(index: number): T | undefined;
    size(): number;
    search(predicate: (item: T) => boolean): T[];
    sort(compareFn?: (a: T, b: T) => number): T[];
    clear(): void;
    getAll(): T[];
}
export declare class CommandStack<T> {
    private items;
    push(item: T): void;
    pop(): T | undefined;
    peek(): T | undefined;
    isEmpty(): boolean;
    size(): number;
}
export declare class TaskQueue<T> {
    private items;
    enqueue(item: T): void;
    dequeue(): T | undefined;
    front(): T | undefined;
    isEmpty(): boolean;
    size(): number;
}
export declare class TaskLinkedList<T> {
    private head;
    private size_;
    append(data: T): void;
    prepend(data: T): void;
    remove(data: T): boolean;
    toArray(): T[];
    size(): number;
}
export declare class TaskHashTable<K, V> {
    private capacity;
    private buckets;
    private size_;
    constructor(capacity?: number);
    private hash;
    set(key: K, value: V): void;
    get(key: K): V | undefined;
    delete(key: K): boolean;
    has(key: K): boolean;
    size(): number;
    keys(): K[];
}
export declare class TaskBinaryTree<T> {
    private root;
    insert(data: T): void;
    private insertRec;
    inOrderTraversal(): T[];
    private inOrder;
}
export declare class TaskBST<T> {
    private compare;
    private root;
    constructor(compare: (a: T, b: T) => number);
    insert(data: T): void;
    private insertRec;
    inOrderTraversal(): T[];
    private inOrder;
    findMin(): T | null;
    findMax(): T | null;
}
export declare class TaskPriorityQueue<T> {
    private compare;
    private heap;
    constructor(compare: (a: T, b: T) => number);
    insert(item: T): void;
    extractMin(): T | undefined;
    peek(): T | undefined;
    size(): number;
    isEmpty(): boolean;
    private heapifyUp;
    private heapifyDown;
}
export declare class TaskTrie {
    private root;
    insert(word: string): void;
    search(prefix: string): string[];
    startsWith(prefix: string): boolean;
}
export declare class TaskGraph<T> {
    private adjacencyList;
    addVertex(vertex: T): void;
    addEdge(from: T, to: T): void;
    getNeighbors(vertex: T): T[];
    topologicalSort(): T[];
    private topologicalSortUtil;
}
export declare class TaskUnionFind<T> {
    private parent;
    private rank;
    makeSet(item: T): void;
    find(item: T): T;
    union(item1: T, item2: T): void;
    connected(item1: T, item2: T): boolean;
}
export declare class DSAAlgorithms {
    static linearSearch<T>(arr: T[], target: T): number;
    static binarySearch<T>(arr: T[], target: T, compare: (a: T, b: T) => number): number;
    static quickSort<T>(arr: T[], compare: (a: T, b: T) => number): T[];
    static mergeSort<T>(arr: T[], compare: (a: T, b: T) => number): T[];
    private static merge;
    private static memoCache;
    static factorial(n: number): number;
    static greedyTaskSelection<T>(tasks: T[], getValue: (task: T) => number): T[];
    static setBit(flags: number, position: number): number;
    static clearBit(flags: number, position: number): number;
    static toggleBit(flags: number, position: number): number;
    static checkBit(flags: number, position: number): boolean;
    static slidingWindowMax(arr: number[], k: number): number[];
}
//# sourceMappingURL=index.d.ts.map