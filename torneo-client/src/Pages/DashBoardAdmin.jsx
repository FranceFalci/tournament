import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/Auth'
import { SeasonContext } from '../context/Season'

const DashBoardAdmin = () => {
  const { user } = useContext( AuthContext )
  const { setSeason, season } = useContext( SeasonContext )
  const { logout } = useContext( AuthContext )

  useEffect( () => {
    const fetchSeason = async () => {
      try {
        const res = await fetch(
          `/api/season/active/${ user.id }`
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
        <button type='button' className='button' onClick={() => {}}>
          <Link to={`/match/${ season?.id_temporada }`} className='link'>
            Partidos
          </Link>
        </button>
        <button type='button' className='button' onClick={() => {}}>
          <Link to={'/categories/admin'} className='link'>
            Categorias
          </Link>
        </button>
        <button type='button' className='button' onClick={() => {}}>
          <Link to={`/zones/${ season?.id_temporada }`} className='link'>
            Zonas
          </Link>
        </button>
        <button type='button' className='button' onClick={() => {}}>
          <Link to={`/teams/adm/${ season?.id_temporada } `} className='link'>
            Equipos
          </Link>
        </button>
        <button type='button' className='button'>
          <Link to={`/cups/admin/${ season?.id_temporada } `} className='link'>
            Copas
          </Link>
        </button>
        <button type='button' className='button'>
          <Link to={'/user/admin'} className='link'>
            Usuario
          </Link>
        </button>
        <button type='button' className='button'>
          <Link to={'/'} className='link'>
            Inicio
          </Link>
        </button>
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
