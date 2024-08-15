/* eslint-disable multiline-ternary */
import React from 'react'
import { Link } from 'react-router-dom'
import { helpHttp } from '../helpers/helpHttp'
import Swal from 'sweetalert2'
import { baseUrl } from '../helpers/baseUrlApi'

export const TeamCrud = ( { teams, setTeams } ) => {
  const http = helpHttp()

  const onDelete = ( id, name ) => {
    Swal.fire( {
      title: `¿Estás seguro de eliminar el equipo ${ name }?`,
      text: 'Recuerda que esto implica eliminar a los jugadores perteneciente al equipo ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    } ).then( async ( result ) => {
      if ( result.isConfirmed ) {
        http
          .del( `${ baseUrl }/team/${ id }` )
          .then( ( response ) => {
            if ( response.ok === false ) {
              throw Error( 'Ocurrió un error' )
            }
            Swal.fire(
              ' Equipo eliminado',
              'Has eliminado el equipo correctamente.',
              'success'
            )
            setTeams( ( prevTeams ) =>
              prevTeams.filter( ( team ) => team.id_equipo !== id )
            )
          } )
          .catch( ( err ) => {
            Swal.fire( {
              title: 'Ocurrió un error',
              text: err.message,
              icon: 'error'
            } )
          } )
      }
    } )
  }
  return (
    <div className='container-item'>
      {teams.length > 0 ? (
        teams.map( ( item ) => (
          <div key={item.id_equipo}>
            <div className='item'>
              <div className='d-flex-row'>
                {item.logo_url && (
                  <img
                    src={item.logo_url}
                    width='40px'
                    height='40px'
                    // alt='Team Logo'
                  ></img>
                )}

                <h4 className='item-name'> {item.nombre.toUpperCase()}</h4>
              </div>

              <div className='cont-btn-crud'>
                <button className='edit'>
                  <Link to={`/team/edit/${ item.id_equipo }`}>
                    <svg
                      width='18'
                      height='18'
                      viewBox='0 0 18 18'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M0 18V13.75L13.2 0.575C13.4 0.391667 13.621 0.25 13.863 0.15C14.105 0.0500001 14.359 0 14.625 0C14.891 0 15.1493 0.0500001 15.4 0.15C15.6507 0.25 15.8673 0.4 16.05 0.6L17.425 2C17.625 2.18333 17.771 2.4 17.863 2.65C17.955 2.9 18.0007 3.15 18 3.4C18 3.66667 17.9543 3.921 17.863 4.163C17.7717 4.405 17.6257 4.62567 17.425 4.825L4.25 18H0ZM14.6 4.8L16 3.4L14.6 2L13.2 3.4L14.6 4.8Z'
                        fill='#4D4D4D'
                      />
                    </svg>
                  </Link>
                </button>
                <button
                  className='delete'
                  onClick={() => {
                    onDelete( item.id_equipo, item.nombre )
                  }}
                >
                  <svg
                    width='16'
                    height='18'
                    viewBox='0 0 16 18'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M3 18C2.45 18 1.97933 17.8043 1.588 17.413C1.19667 17.0217 1.00067 16.5507 1 16V3H0V1H5V0H11V1H16V3H15V16C15 16.55 14.8043 17.021 14.413 17.413C14.0217 17.805 13.5507 18.0007 13 18H3ZM5 14H7V5H5V14ZM9 14H11V5H9V14Z'
                      fill='#4D4D4D'
                    />
                  </svg>
                </button>

                <button className='other'>
                  <Link to={'/players/info/admin'} state={{ idTeam: item.id_equipo }}>jugadores</Link>
                </button>
              </div>
            </div>
          </div>
        ) )
      ) : (
        <p className='text-center'>Aún no hay equipos!</p>
      )}
    </div>
  )
}
