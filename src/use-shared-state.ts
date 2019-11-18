import { useEffect, useState, useCallback } from 'react'

function setValue(setter: any, previous?: any) {
  if (typeof setter === 'function') {
    return setter(previous)
  } else {
    return setter
  }
}

export default function createSharedState<T>(initialValue?: T | (() => T)) {
  type setterFunction = (prev?: T) => T
  let value: T = setValue(initialValue)

  let listeners: Set<React.Dispatch<React.SetStateAction<T>>> = new Set()

  return function useSharedState() {
    const memoizedSetState = useCallback(
      function setState(newValue: T | setterFunction) {
        value = setValue(newValue, value)
        listeners.forEach(listener => listener(value))
      },
      [ listeners ]
    )

    const [, setLocalState] = useState(value)
    listeners.add(setLocalState)
    useEffect(
      () => () => {
        listeners.delete(setLocalState)
      },
      [setLocalState]
    )

    return [ value, memoizedSetState ]
  }
}
