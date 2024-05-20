import React, { useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { useParams } from 'react-router-dom'
import { InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useModal } from '../hooks/useModal'
import { Modal } from '../components/Modal'
import Swal from 'sweetalert2'
import { helpHttp } from '../helpers/helpHttp'
import { ItemComponent } from '../components/ItemComponent'

const initialState = {
  name: '',
  order: ''
}
const Phases = () => {
  const { idCup } = useParams()
  const [isOpenAdd, openModalAdd, closeModalAdd] = useModal()
  const [formDataNewPhase, setFormDataNewPhase] = useState( initialState )
  const { data: phases, setData: setPhases } = useFetch(
    `/api/phase/${ idCup }`
  )
  const http = helpHttp()
  const handleInputChange = ( e ) => {
    setFormDataNewPhase( {
      ...formDataNewPhase,
      [e.target.name]: e.target.value
    } )
  }
  const handleAddPhaseSubmit = async ( e ) => {
    e.preventDefault()

    if ( !formDataNewPhase.name || !formDataNewPhase.order ) {
      Swal.fire( {
        title: 'Ambos campos son obligatorios!',
        icon: 'error'
      } )
      openModalAdd()
      return
    }
    http
      .post( `/api/phase/${ idCup }`, formDataNewPhase )
      .then( ( response ) => {
        if ( response === false ) {
          throw Error( 'Ocurrio un error' )
        }
        setFormDataNewPhase( initialState )
        Swal.fire( {
          title: 'Copa agregada con exito',
          icon: 'success'
        } )
        setPhases( [...phases, response] )
      } )
      .catch( ( err ) => {
        Swal.fire( {
          title: 'Ocurrió un error',
          text: err.message,
          icon: 'error'
        } )
      } )
  }

  const onDelete = ( idPhase, name ) => {
    Swal.fire( {
      title: `¿Estás seguro de eliminar la fase ${ name }?`,
      // text: 'Recuerda que esto implica eliminar los puntos de los equipos ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    } ).then( async ( result ) => {
      if ( result.isConfirmed ) {
        http
          .del( `/api/phase/${ idPhase }` )
          .then( ( response ) => {
            if ( response.ok === false ) {
              throw Error( 'Ocurrió un error' )
            }

            Swal.fire( {
              title: 'Fase eliminada con exito',
              icon: 'success'
            } )
            setPhases( ( prevPhases ) =>
              prevPhases.filter( ( phase ) => phase.id_fase !== idPhase )
            )
            // closeModal()
            // onMatchAdded()
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

  const onEdit = async ( id, name, order ) => {
    http
      .put( `/api/phase/${ id }`, {
        order,
        name
      } )
      .then( ( response ) => {
        if ( response === false ) {
          throw Error( 'Ocurrió un error' )
        }
        Swal.fire(
          'Copa editada',
          'Has editado la copa correctamente.',
          'success'
        )
        setPhases( ( prevPhases ) =>
          prevPhases
            .map( ( phase ) =>
              phase.id_fase === id ? { ...phase, ...response } : phase
            )
            .sort( ( a, b ) => a.orden - b.orden )
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
  return (
    <div className='container-match'>
      <>
        <button
          className='add-button'
          onClick={() => {
            openModalAdd()
          }}
        >
          Agregar Fase
        </button>
        <Modal
          isOpen={isOpenAdd}
          openModal={openModalAdd}
          closeModal={closeModalAdd}
        >
          <form onSubmit={handleAddPhaseSubmit} className='form-modal-cup'>
            <InputLabel htmlFor='type'>Nombre</InputLabel>

            <TextField
              className='select-sheet'
              fullWidth
              size='small'
              type='text'
              id='type'
              name='name'
              value={formDataNewPhase.name}
              onChange={handleInputChange}
            />

            <InputLabel htmlFor='order'>Orden</InputLabel>
            <Select
              size='small'
              className='select-sheet'
              id='order'
              name='order'
              value={formDataNewPhase.order}
              onChange={handleInputChange}
            >
              <MenuItem value=''> Selecciona..</MenuItem>
              {Array.from( { length: 8 }, ( _, index ) => (
                <MenuItem key={index + 1} value={index + 1}>
                  {index + 1}
                </MenuItem>
              ) )}
            </Select>
            <button
              className='btn-input'
              type='submit'
              onClick={() => {
                closeModalAdd()
              }}
            >
            agregar
            </button>
          </form>
        </Modal>
        {/* <CupsByCategory
        idCategory={selectedOption}
        reload={reload}
        key={shouldUpdate}
      /> */}
        {phases && (
          <ItemComponent
            items={phases.map( ( phase ) => ( {
              id: phase.id_fase,
              nombre: phase.nombre,
              order: phase.orden
            } ) )}
            onEdit={onEdit}
            onDelete={onDelete}
            redirectLink={'phases/match'}
            redirectName={'Partidos'}
            order={true}
          />
        )}
      </>
    </div>
  )
}

export default Phases
