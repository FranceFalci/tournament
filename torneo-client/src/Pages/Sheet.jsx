/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { useParams } from 'react-router-dom'
import { useModal } from '../hooks/useModal'
import Swal from 'sweetalert2'
import { helpHttp } from '../helpers/helpHttp'
import { InputLabel, MenuItem, Modal, Select, TextField } from '@mui/material'
import { MatchSheetProp } from '../components/MatchSheetProp'

const initialState = {
  time: '1',
  minute: '',
  idPlayer: '',
  type: '0'
}
const Sheet = () => {
  const { idMatch } = useParams()
  const [isOpenAdd, openModalAdd, closeModalAdd] = useModal()
  const [formData, setFormData] = useState( initialState )
  const http = helpHttp()
  const { data: sheets, setData: setSheets } = useFetch(
    `/api/sheet/${ idMatch }`
  )
  const { data: players } = useFetch(
    `/api/player/match/${ idMatch }`
  )
  const handleAddZoneSubmit = async ( e ) => {
    e.preventDefault()
    if ( formData.idPlayer === '' ) {
      Swal.fire( {
        title: 'El jugador es obligatorio!',
        icon: 'error'
      } )
      return openModalAdd()
    }
    http.post( `/api/sheet/${ idMatch }`, {
      ...formData
    } )
      .then( ( response ) => {
        if ( response.ok === false ) {
          throw Error( 'Ocurrió un error!' )
        }
        Swal.fire( {
          title: 'Agregado con exito!',
          icon: 'success'
        } )
        setSheets( [...sheets, response] )
        setFormData( initialState )
      } )
      .catch( ( err ) => {
        Swal.fire( {
          title: 'Ocurrió un error!',
          text: err.message,
          icon: 'error'
        } )
      } )
  }

  const onDelete = ( idSheet ) => {
    Swal.fire( {
      title: '¿Estás seguro de eliminar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    } ).then( async ( result ) => {
      if ( result.isConfirmed ) {
        http
          .del( `/api/sheet/${ idSheet }` )
          .then( ( response ) => {
            if ( response.ok === false ) {
              throw Error( 'Ocurrió un error!' )
            }
            Swal.fire( {
              title: 'Eliminado con exito!',
              icon: 'success'
            } )
            setSheets( ( prevSheets ) =>
              prevSheets.filter( ( sheet ) => sheet.id_ficha !== idSheet )
            )
          } )
          .catch( ( err ) => {
            Swal.fire( {
              title: 'Ocurrió un error al eliminar!',
              text: err.message,
              icon: 'error'
            } )
          } )
      }
    } )
  }
  const handleChangeInput = ( e ) => {
    setFormData( {
      ...formData,
      [e.target.name]: e.target.value
    } )
  }
  useEffect( () => {
    if ( sheets ) {
      // Este efecto se activará cada vez que sheets cambie
      // Aquí puedes agregar lógica adicional que deseas ejecutar cuando sheets se actualice
    }
  }, [sheets] )

  return (
    <>
      <div className='cont-button-sheet '>
        <button
          className='add-button'
          onClick={() => {
            openModalAdd()
            console.log( 'que pasa' )
          }}
        >
          Agregar
        </button>
        <Modal
          isOpen={isOpenAdd}
          openModal={openModalAdd}
          closeModal={closeModalAdd}
        >
          <form onSubmit={handleAddZoneSubmit} className='form-modal-sheet'>
            <InputLabel htmlFor='type'>Tipo</InputLabel>

            <Select
              id='type'
              name='type'
              value={formData.type}
              onChange={handleChangeInput}
              className='select-sheet'
            >
              <MenuItem value='0'>GOL</MenuItem>
              <MenuItem value='1'>TARJETA AMARILLA</MenuItem>
              <MenuItem value='2'>TARJETA ROJA</MenuItem>
            </Select>
            <InputLabel htmlFor='minute'>Minuto</InputLabel>
            <TextField
              className='select-sheet'
              name='minute'
              type='number'
              value={formData.minute}
              onChange={handleChangeInput}
            />

            <InputLabel htmlFor='time'>Tiempo</InputLabel>
            <Select
              name='time'
              id='time'
              onChange={handleChangeInput}
              value={formData.time}
              displayEmpty
              className='select-sheet'
            >
              <MenuItem value='1'>primer</MenuItem>
              <MenuItem value='2'>segundo</MenuItem>
            </Select>
            <InputLabel htmlFor='idPlayer'>Jugador</InputLabel>
            <Select
              name='idPlayer'
              id='idPlayer'
              onChange={handleChangeInput}
              value={formData.idPlayer}
              displayEmpty
              className='select-sheet'
            >
              <MenuItem value=''>Seleccione..</MenuItem>
              {players &&
              players.map( ( player ) => (
                <MenuItem key={player.id_jugador} value={player.id_jugador}>
                  {player.nombre}
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
            Agregar
            </button>
          </form>
        </Modal>
      </div>
      <>
        {sheets ? (
          <MatchSheetProp sheets={sheets} onDelete={onDelete}/>

        ) : (
          <p>Aún no hay ficha!</p>
        )}
      </>
    </>
  )
}

export default Sheet
