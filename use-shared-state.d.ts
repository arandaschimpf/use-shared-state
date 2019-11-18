/// <reference types="react" />
export default function createSharedState<T>(initialValue?: React.SetStateAction<T>): () => [T, import("react").Dispatch<import("react").SetStateAction<T>>];
