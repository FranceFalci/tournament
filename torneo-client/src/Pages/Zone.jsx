import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import Swal from 'sweetalert2'
import { Modal } from '../components/Modal'
import { useModal } from '../hooks/useModal'
import { ItemComponent } from '../components/ItemComponent'
import { helpHttp } from '../helpers/helpHttp'

const initialState = {
  name: ''
}

const Zone = ( { idCatProp } ) => {
  const { idCategory: idCatParamFromRoute } = useParams()
  const idCategory = idCatProp || idCatParamFromRoute
  const [isOpenAdd, openModalAdd, closeModalAdd] = useModal()
  const [formDataNewZone, setFormDataNewZone] = useState( initialState )
  const { data: zones, setData: setZones } = useFetch( `/api/zone/${ idCategory }` )
  const http = helpHttp()
  const onEdit = async ( id, value ) => {
    if ( !value ) {
      Swal.fire( {
        title: 'El nombre es obligatorio',
        icon: 'error'
      } )
      openModalAdd()
      return
    }
    http
      .put( `/api/zone/${ id }`, {
        name: value
      } )
      .then( ( response ) => {
        if ( response === false ) {
          throw Error( 'Ocurrió un error' )
        }
        Swal.fire(
          'Zona editada',
          'Has editado la categoria correctamente.',
          'success'
        )
        setZones( ( prevCategories ) =>
          prevCategories.map( ( zone ) =>
            zone.id_zona === id ? { ...zone, nombre: value } : zone
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
      title: `¿Estás seguro de eliminar la zona ${ name }?`,
      text: 'Recuerda que esto implica eliminar los eqruipos pertenecientes a esta zona y los jugadores perteneciente a los mismos',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    } ).then( async ( result ) => {
      if ( result.isConfirmed ) {
        http
          .del( `/api/zone/${ id }` )
          .then( ( response ) => {
            if ( response === false ) {
              throw Error( 'Ocurrió un error' )
            }
            Swal.fire(
              ' Zona eliminada',
              'Has eliminado la zona correctamente.',
              'success'
            )
            setZones( ( prevCategories ) =>
              prevCategories.filter( ( zone ) => zone.id_zona !== id )
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

  const handleChangeZoneInput = ( e ) => {
    setFormDataNewZone( {
      ...formDataNewZone,
      [e.target.id]: e.target.value
    } )
  }
  const handleAddZoneSubmit = async ( e ) => {
    e.preventDefault()
    if ( !formDataNewZone.name ) {
      Swal.fire( {
        title: 'El nombre es obligatorio',
        icon: 'error'
      } )
      openModalAdd()
      return
    }
    http
      .post( `/api/zone/${ idCategory }`, {
        name: formDataNewZone.name
      } )
      .then( ( response ) => {
        if ( response === false ) {
          throw Error( 'Ocurrió un error' )
        }
        setFormDataNewZone( initialState )
        setZones( [...zones, response.newZone] )
        Swal.fire( {
          title: 'Zona agregada con exito',
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

  return (
    <div className='container-match d-flex '>
      <button
        className='add-button'
        onClick={() => {
          openModalAdd()
        }}
      >
        Agregar Zona
      </button>
      <Modal
        isOpen={isOpenAdd}
        openModal={openModalAdd}
        closeModal={closeModalAdd}
      >
        <form onSubmit={handleAddZoneSubmit} className='form-modal-gral'>
          <input
            type='text'
            id='name'
            placeholder='Nombre zona'
            value={formDataNewZone.name}
            onChange={handleChangeZoneInput}
          ></input>
          <button
            className='btn-input '
            type='submit'
            onClick={() => {
              closeModalAdd()
            }}
          >
            Agregar
          </button>
        </form>
      </Modal>
      {zones && (
        <ItemComponent
          items={zones.map( ( zone ) => ( {
            id: zone.id_zona,
            nombre: zone.nombre
          } ) )}
          onEdit={onEdit}
          onDelete={onDelete}
          redirectLink={'teams/zone'}
          redirectName={'Equipos'}
        />
      )}
    </div>
  )
}

export default Zone
