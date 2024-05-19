/* eslint-disable multiline-ternary */
import React, { lazy, useState } from 'react'
import InputLabel from '@mui/material/InputLabel'
import { useModal } from '../hooks/useModal'
import { useFetch } from '../hooks/useFetch'
// import MenuItem from '@mui/material/MenuItem'
// import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'

import { Modal } from './Modal'
import Swal from 'sweetalert2'

import { helpHttp } from '../helpers/helpHttp'
const MenuItemLazy = lazy( () => import( '@mui/material/MenuItem' ) )
const SelectLazy = lazy( () => import( '@mui/material/Select' ) )

export const MatchForm = ( { idCategory, onMatchAdded, idPhase = null } ) => {
  const http = helpHttp()
  const [isOpenAdd, openModalAdd, closeModalAdd] = useModal()
  const [loading, setLoading] = useState()
  const [idTeamOne, setIdTeamOne] = useState( '' )
  const [idTeamTwo, setIdTeamTwo] = useState( '' )
  const [numDate, setNumDate] = useState( '' )
  const [resultOne, setResultOne] = useState( '' )
  const [resultTwo, setResultTwo] = useState( '' )
  const { data: teams } = useFetch(
    idCategory
      ? `api/team/category/${ idCategory }`
      : null
  )
  let finalNumDate = null
  const handleAddMatchSubmit = async ( e ) => {
    e.preventDefault()
    if ( idPhase ) {
      if ( !idTeamOne || !idTeamTwo ) {
        Swal.fire( {
          title: 'Complete los campos obligatorios',
          text: '(equipo uno , equipo dos, num fecha)',
          icon: 'error'
        } )
        openModalAdd()
        return
      }
      finalNumDate = Math.floor( Math.random() * 301 )
    } else {
      if ( !idTeamOne || !idTeamTwo || !numDate ) {
        Swal.fire( {
          title: 'Complete los campos obligatorios',
          text: '(equipo uno , equipo dos, num fecha)',
          icon: 'error'
        } )
        openModalAdd()
        return
      }
      finalNumDate = numDate
    }
    setLoading( true )
    http
      .post(
        `api/match/${ idCategory }`,
        {
          idTeamOne,
          idTeamTwo,
          resultOne,
          resultTwo,
          numDate: finalNumDate,
          idPhase
        }
      )
      .then( ( response ) => {
        if ( response.ok === false ) {
          throw Error( 'Ocurrió un error' )
        }

        Swal.fire( {
          title: 'Partido agregado con exito',
          icon: 'success'
        } )

        onMatchAdded()
        closeModalAdd()
      } )
      .catch( ( err ) => {
        Swal.fire( {
          title: 'Ocurrió un error',
          text: err.message,
          icon: 'error'
        } )
      } ).finally(
        setLoading( false )
      )
  }

  return (
    <div>
      <button
        className='add-button'
        onClick={() => {
          openModalAdd()
        }}
      >
        Agregar Partido
      </button>
      <Modal
        isOpen={isOpenAdd}
        openModal={openModalAdd}
        closeModal={closeModalAdd}
      >
        <form onSubmit={handleAddMatchSubmit} className='form-modal-match'>
          <InputLabel id='age-label'>Equipo Local</InputLabel>
          <FormControl sx={{ mb: 4, minWidth: 120 }}>
            <SelectLazy
              labelId='age-label'
              // label='Age'
              id='idTeamOne'
              value={idTeamOne}
              onChange={( e ) => setIdTeamOne( e.target.value )}
            >
              {/* <MenuItem value=''>Selecciona...</MenuItem> */}
              {teams &&
                teams.map( ( team ) => (
                  <MenuItemLazy key={team.id_equipo} value={team.id_equipo}>
                    {team.nombre}
                  </MenuItemLazy>
                ) )}
            </SelectLazy>
          </FormControl>
          <div className='mb-32'>
            <InputLabel id='resultOne'>Resultado Local</InputLabel>

            <TextField
              fullWidth
              size='small'
              type='number'
              id='resultOne'
              value={resultOne}
              className='input-number'
              onChange={( e ) => setResultOne( e.target.value )}
            />
          </div>
          {idPhase ? (
            ''
          ) : (
            <>
              <InputLabel id='date-label'>Fecha</InputLabel>
              <FormControl sx={{ mb: 4, minWidth: 120 }}>
                <SelectLazy
                  id='numDate'
                  idlabel='date-label'
                  onChange={( e ) => setNumDate( e.target.value )}
                  value={numDate}
                >
                  {/* <MenuItem value=''>Selecciona...</MenuItem> */}
                  {Array.from( { length: 20 }, ( _, index ) => (
                    <MenuItemLazy key={index + 1} value={index + 1}>
                      {index + 1}
                    </MenuItemLazy>
                  ) )}
                </SelectLazy>
              </FormControl>
            </>
          )}

          <InputLabel id='date-label'>Equipo visitante</InputLabel>
          <FormControl sx={{ mb: 4, minWidth: 120 }}>
            <SelectLazy
              id='idTeamTwo'
              value={idTeamTwo}
              onChange={( e ) => setIdTeamTwo( e.target.value )}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              defaultValue=''
            >
              {/* <MenuItem value=''>Selecciona...</MenuItem> */}
              {teams &&
                teams.map( ( team ) => (
                  <MenuItemLazy key={team.id_equipo} value={team.id_equipo}>
                    {team.nombre}
                  </MenuItemLazy>
                ) )}
            </SelectLazy>
          </FormControl>
          <div className='mb-32'>
            <InputLabel id='resultTwo'>Resultado Visitante</InputLabel>

            <TextField
              fullWidth
              size='small'
              type='number'
              id='resultTwo'
              value={resultTwo}
              className='input-number'
              onChange={( e ) => setResultTwo( e.target.value )}
            />
          </div>
          <button type='submit' disabled={loading} className='btn-input'>
            {loading ? 'Agregando..' : 'Agregar'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
