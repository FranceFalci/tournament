import { useLocation, useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { Modal } from '../components/Modal'
import Swal from 'sweetalert2'
import { helpHttp } from '../helpers/helpHttp'

import { ItemComponent } from '../components/ItemComponent'
import { useModal } from '../hooks/useModal'
import { useState } from 'react'
import { baseUrl } from '../helpers/baseUrlApi'

const initialState = {
  name: ''
}

const PlayersInfo = () => {
  // const { idTeam } = useParams()
  const location = useLocation()
  const { idTeam } = location.state || {}
  const http = helpHttp()
  const [isOpenAdd, openModalAdd, closeModalAdd] = useModal()
  const [formDataNewPlayer, setFormDataNewPlayer] = useState( initialState )
  const { data: players, setData: setPlayers } = useFetch(
    `${ baseUrl }/player/team/${ idTeam }`
  )

  const onEdit = async ( id, value ) => {
    http
      .put( `${ baseUrl }/player/info/${ id }`, {
        name: value
      } )
      .then( ( response ) => {
        if ( response.ok === false ) {
          throw Error( 'Ocurrió un error' )
        }
        Swal.fire(
          'jugador editado',
          'Has editado el jugador correctamente.',
          'success'
        )
        setPlayers( ( prevTeams ) =>
          prevTeams.map( ( team ) =>
            team.id_jugador === id ? { ...team, nombre: value } : team
          )
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

  const onDelete = ( id, name ) => {
    Swal.fire( {
      title: `¿Estás seguro de eliminar  el jugador ${ name }?`,
      text: 'Recuerda que esto implica eliminar sus estadisticas',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    } ).then( async ( result ) => {
      if ( result.isConfirmed ) {
        http
          .del( `${ baseUrl }/player/${ id }` )
          .then( ( response ) => {
            if ( response.ok === false ) { throw Error( 'Ocurrió un error' ) }
            Swal.fire(
              ' Jugador eliminada',
              'Has eliminado el jugador correctamente.',
              'success'
            )
            setPlayers( ( prevTeams ) =>
              prevTeams.filter( ( team ) => team.id_jugador !== id )
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
  const handleAddSubmit = async ( e ) => {
    e.preventDefault()
    if ( !formDataNewPlayer.name ) {
      Swal.fire( {
        title: 'El nombre es obligatorio',
        icon: 'error'
      } )
      openModalAdd()
      return
    }
    http
      .post( `${ baseUrl }/player/${ idTeam }`, {
        name: formDataNewPlayer.name
      } )
      .then( ( response ) => {
        if ( response.ok === false ) {
          throw Error( 'Ocurrió un error' )
        }
        setFormDataNewPlayer( initialState )

        setPlayers( [...players, response] )
        Swal.fire( {
          title: 'Jugador agregado con exito',
          icon: 'success'
        } )
      } )
      .catch( ( err ) => {
        Swal.fire( {
          title: 'Ocurrió un error',
          text: err.message,
          icon: 'error'
        } )
      } )
  }

  const handleChangeInput = ( e ) => {
    setFormDataNewPlayer( {
      ...formDataNewPlayer,
      [e.target.id]: e.target.value
    } )
  }
  return (
    <div className='container-match d-flex'>
      <button
        className='add-button'
        onClick={() => {
          openModalAdd()
        }}
      >
        Agregar Jugador
      </button>
      <Modal
        isOpen={isOpenAdd}
        openModal={openModalAdd}
        closeModal={closeModalAdd}
      >
        <form onSubmit={handleAddSubmit} className='form-modal-gral'>
          <input
            placeholder='Nombre Jugador'
            type='text'
            id='name'
            value={formDataNewPlayer.name}
            onChange={handleChangeInput}
          ></input>
          <button
            className='btn-input'
            type='submit'
            onClick={() => {
              closeModalAdd()
            }}
          >
            Agregar
          </button>
        </form>
      </Modal>
      {players && (
        <ItemComponent
          items={players.map( ( player ) => ( {
            id: player.id_jugador,
            nombre: player.nombre
          } ) )}
          onEdit={onEdit}
          onDelete={onDelete}

        />
      )}
    </div>
  )
}
export default PlayersInfo
