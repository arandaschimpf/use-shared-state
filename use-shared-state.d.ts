export default function createSharedState<T>(initialValue?: T | (() => T)): () => (T | ((newValue: T | ((prev?: T | undefined) => T)) => void))[];
