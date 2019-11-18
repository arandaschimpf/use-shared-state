import { useEffect, useState, useCallback } from 'react'

function setValue(setter: any, previous?: any) {
  if (typeof setter === 'function') {
    return setter(previous)
  } else {
    return setter
  }
}

type setter<T> = (prev?: T) => T
export type setterFunction<T> = (newValue?: T | setter<T>) => void

export default function createSharedState<T>(initialValue?: T | (() => T)) {
  let value: T = setValue(initialValue)

  let listeners: Set<React.Dispatch<React.SetStateAction<T>>> = new Set()

  return function useSharedState() {
    const memoizedSetState = useCallback(
      function setState(newValue?: T | setter<T>) {
        value = setValue(newValue, value)
        listeners.forEach(listener => listener(value))
      },
      []
    )

    const [, setLocalState] = useState(value)
    listeners.add(setLocalState)
    useEffect(
      () => () => {
        listeners.delete(setLocalState)
      },
      [setLocalState]
    )
    const result: [T, setterFunction<T>] = [value, memoizedSetState]
    return result
  }
}
