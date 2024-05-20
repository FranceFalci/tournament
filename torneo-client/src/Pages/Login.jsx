import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { AuthContext } from '../context/Auth'
import { helpHttp } from '../helpers/helpHttp'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useContext( AuthContext )
  const http = helpHttp()
  const [formData, setFormData] = useState( {} )
  const [showPassword, setShowPassword] = useState( false )
  const handleSubmit = async ( e ) => {
    e.preventDefault()

    if ( !formData || !formData.name || !formData.password ) {
      return Swal.fire( {
        title: 'Ambos Campos son obligatorios',
        icon: 'error'
      } )
    }
    http
      .post( '/api/user/sign-in', formData )
      .then( ( response ) => {
        if ( response.ok === false ) {
          throw Error( 'Ocurrió un error..' )
        }
        login( response.name, response.id )
        navigate( '/dashboard/admin', { replace: true } ) // no hace fata pero bue
      } )
      .catch( ( err ) => {
        Swal.fire( {
          title: 'Ocurrió un error',
          text: err.message,
          icon: 'error'
        } )
      } )
  }

  const handleInputChange = ( e ) => {
    setFormData( {
      ...formData,
      [e.target.name]: e.target.value.trim().toLowerCase()
    } )
  }

  return (
    <div className='container-login'>
      <img
        src='../public/icons/user-icon.png'
        alt='user-icon'
        width='200px'
      ></img>
      <h2>Inicia Sesión</h2>
      <form onSubmit={handleSubmit} className='login-form'>
        <div className='mb-3 '>
          <input
            type='text'
            className='form-control '
            name='name'
            onChange={handleInputChange}
            placeholder='Usuario'
          />
        </div>
        <div className='mb-3 cont-input'>
          <input
            placeholder='Contraseña'
            type={showPassword ? 'text' : 'password'}
            className='form-control'
            name='password'
            onChange={handleInputChange}
          />
          <svg
            className='input-eye'
            width='25'
            height='19'
            viewBox='0 0 22 15'
            fill='#999'
            xmlns='http://www.w3.org/2000/svg'
            onClick={() => {
              setShowPassword( !showPassword )
            }}
          >
            <path
              d='M11 4.5C10.2044 4.5 9.44129 4.81607 8.87868 5.37868C8.31607 5.94129 8 6.70435 8 7.5C8 8.29565 8.31607 9.05871 8.87868 9.62132C9.44129 10.1839 10.2044 10.5 11 10.5C11.7956 10.5 12.5587 10.1839 13.1213 9.62132C13.6839 9.05871 14 8.29565 14 7.5C14 6.70435 13.6839 5.94129 13.1213 5.37868C12.5587 4.81607 11.7956 4.5 11 4.5ZM11 12.5C9.67392 12.5 8.40215 11.9732 7.46447 11.0355C6.52678 10.0979 6 8.82608 6 7.5C6 6.17392 6.52678 4.90215 7.46447 3.96447C8.40215 3.02678 9.67392 2.5 11 2.5C12.3261 2.5 13.5979 3.02678 14.5355 3.96447C15.4732 4.90215 16 6.17392 16 7.5C16 8.82608 15.4732 10.0979 14.5355 11.0355C13.5979 11.9732 12.3261 12.5 11 12.5ZM11 0C6 0 1.73 3.11 0 7.5C1.73 11.89 6 15 11 15C16 15 20.27 11.89 22 7.5C20.27 3.11 16 0 11 0Z'
              fill='#777'
            />
          </svg>
        </div>
        <button type='submit' className='btn-white'>
          Ingresar
        </button>
      </form>
    </div>
  )
}

export default Login
