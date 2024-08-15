import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/Auth'
import { SeasonContext } from '../context/Season'
import { baseUrl } from '../helpers/baseUrlApi'

const DashBoardAdmin = () => {
  const { user } = useContext( AuthContext )
  const { setSeason, season } = useContext( SeasonContext )
  const { logout } = useContext( AuthContext )

  useEffect( () => {
    const fetchSeason = async () => {
      try {
        const res = await fetch(
          `${ baseUrl }/season/active/${ user.id }`
        )
        const data = await res.json()
        if ( !res.ok ) {
          console.log( data.message )
        } else {
          console.log( data )
          setSeason( data )
        }
      } catch ( error ) {
        console.log( error.message )
      }
    }
    fetchSeason()
  }, [] )
  return (
    <>
      <div className='options'>
        <h1>Hola, Admin!</h1>
        <Link to={'/partidos/admin'} className='link'>
          <button type='button' className='button' onClick={() => {}}>
            Partidos
          </button>
        </Link>
        <Link to={'/categories/admin'} className='link'>
          <button type='button' className='button' onClick={() => {}}>
            Categorias
          </button>
        </Link>
        <Link to={'/zones/admin'} className='link'>
          <button type='button' className='button' onClick={() => {}}>
            Zonas
          </button>
        </Link>
        <Link to={'/equipos/admin'} className='link'>
          <button type='button' className='button'>
            Equipos
          </button>
        </Link>
        <Link to={'/cups/admin/info '} className='link'>
          <button type='button' className='button'>
            Copas
          </button>
        </Link>
        <Link to={'/user/admin'} className='link'>
          <button type='button' className='button'>
            Usuario
          </button>
        </Link>
        <Link to={'/'} className='link'>
          <button type='button' className='button'>
            Inicio
          </button>
        </Link>
        <button
          className='button'
          onClick={() => {
            logout()
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </>
  )
}

export default DashBoardAdmin
