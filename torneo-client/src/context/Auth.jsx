import { createContext, useReducer } from 'react'
import { authReducer } from './AuthReducer'
import { Navigate } from 'react-router-dom'

export const AuthContext = createContext()

const init = () => {
  const user = JSON.parse( localStorage.getItem( 'user' ) )
  return {
    logged: !!user,
    user
  }
}
export const AuthProvider = ( { children } ) => {
  const [authState, dispatch] = useReducer( authReducer, {}, init )

  const login = ( name = '', id ) => {
    const action = {
      type: 'login',
      payload: { name, id }
    }
    localStorage.setItem( 'user', JSON.stringify( { name, id } ) )
    dispatch( action )
  }

  const logout = () => {
    window.localStorage.removeItem( 'user' )
    document.cookie = 'access_token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
    const action = {
      type: 'logout',
      payload: null
    }
    dispatch( action )
    return <Navigate to='/login' />
  }
  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
