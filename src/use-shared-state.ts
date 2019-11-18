import { useEffect, useState, useCallback } from 'react'

function setValue(setter: any, previous?: any) {
  if (typeof setter === 'function') {
    return setter(previous)
  } else {
    return setter
  }
}

export default function createSharedState<T>(initialValue?: React.SetStateAction<T>) {
  let value: T = setValue(initialValue)

  let listeners: Set<React.Dispatch<React.SetStateAction<T>>> = new Set()

  return function useSharedState() {
    const memoizedSetState = useCallback(
      function setState(newValue?: React.SetStateAction<T>) {
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
    const result: [T, React.Dispatch<React.SetStateAction<T>>] = [
      value,
      memoizedSetState
    ]
    return result
  }
}
