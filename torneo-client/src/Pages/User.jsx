import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/Auth'
import { helpHttp } from '../helpers/helpHttp'
import Swal from 'sweetalert2'

const initialStatePassword = {
  current: '',
  new: '',
  confirm: ''
}

const initialStateShow = {
  current: false,
  new: false,
  confirm: false
}
const User = () => {
  const { user } = useContext( AuthContext )
  const [passwords, setPasswords] = useState( initialStatePassword )
  const [showPasswords, setShowPasswords] = useState( initialStateShow )
  const http = helpHttp()

  const toggleShowPassword = ( field ) => {
    setShowPasswords( { ...showPasswords, [field]: !showPasswords[field] } )
  }

  const handleChange = ( e ) => {
    const { id, value } = e.target
    setPasswords( { ...passwords, [id]: value } )
  }

  const handleSubmit = async ( e ) => {
    e.preventDefault()
    if (
      passwords.new === '' ||
      passwords.current === '' ||
      passwords.confirm === ''
    ) {
      return Swal.fire( {
        title: 'Todos campos son obligatorios!',
        icon: 'error'
      } )
    }

    if ( passwords.new !== passwords.confirm ) {
      return Swal.fire( {
        title: 'Error!',
        text: 'No coincide la contraseña nueva',
        icon: 'error'
      } )
    }
    if ( passwords.new.length < 6 ) {
      return Swal.fire( {
        title: 'Error!',
        text: 'La contraseña debe tener por lo menos 6 caracteres',
        icon: 'error'
      } )
    }

    http
      .put( `/api/user/${ user.id }`, {
        password: passwords.current,
        newPassword: passwords.new
      } )
      .then( ( response ) => {
        if ( !response.ok ) {
          throw Error( 'erro' )
        }
        Swal.fire( {
          title: 'Contraseña cambiada con exito',
          icon: 'success'
        } )
      } )
      .catch( ( err ) => {
        Swal.fire( {
          title: 'Ocurrió un error!',
          text: err.message,
          icon: 'error'
        } )
      } )
  }

  return (
    <div className='d-flex'>
      <img src='../public/icons/user-icon.png' width='200px'></img>
      <p>Email: {user.email}</p>
      <form onSubmit={handleSubmit} className='login-form  '>
        {Object.entries( passwords ).map( ( [field, value] ) => (
          <div key={field} className='mb-3 cont-input'>
            <input
              type={showPasswords[field] ? 'text' : 'password'}
              id={field}
              value={value}
              onChange={handleChange}
              placeholder={
                field === 'current'
                  ? 'Contraseña actual'
                  : field === 'new'
                    ? 'Nueva contraseña'
                    : 'Confirmar contraseña'
              }
            />
            <svg
              className='input-eye'
              width='25'
              height='19'
              viewBox='0 0 22 15'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              onClick={() => { toggleShowPassword( field ) }}
            >
              <path
                d='M11 4.5C10.2044 4.5 9.44129 4.81607 8.87868 5.37868C8.31607 5.94129 8 6.70435 8 7.5C8 8.29565 8.31607 9.05871 8.87868 9.62132C9.44129 10.1839 10.2044 10.5 11 10.5C11.7956 10.5 12.5587 10.1839 13.1213 9.62132C13.6839 9.05871 14 8.29565 14 7.5C14 6.70435 13.6839 5.94129 13.1213 5.37868C12.5587 4.81607 11.7956 4.5 11 4.5ZM11 12.5C9.67392 12.5 8.40215 11.9732 7.46447 11.0355C6.52678 10.0979 6 8.82608 6 7.5C6 6.17392 6.52678 4.90215 7.46447 3.96447C8.40215 3.02678 9.67392 2.5 11 2.5C12.3261 2.5 13.5979 3.02678 14.5355 3.96447C15.4732 4.90215 16 6.17392 16 7.5C16 8.82608 15.4732 10.0979 14.5355 11.0355C13.5979 11.9732 12.3261 12.5 11 12.5ZM11 0C6 0 1.73 3.11 0 7.5C1.73 11.89 6 15 11 15C16 15 20.27 11.89 22 7.5C20.27 3.11 16 0 11 0Z'
                fill='#777'
              />
            </svg>
          </div>
        ) )}
        <button type='submit' className='btn-white'>
          Cambiar Contraseña
        </button>
      </form>
    </div>
  )
}

export default User
