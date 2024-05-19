import { useState, useEffect } from 'react'

export const useLocalStorage = ( key, initialValue ) => {
  const [state, setState] = useState( () => {
    const storedValue = localStorage.getItem( key )
    return storedValue !== null ? storedValue : initialValue
  } )

  useEffect( () => {
    localStorage.setItem( key, state )
  }, [key, state] )

  return [state, setState]
}
