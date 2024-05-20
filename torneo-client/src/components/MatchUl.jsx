/* eslint-disable multiline-ternary */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Modal } from './Modal'
import { helpHttp } from '../helpers/helpHttp'
import Swal from 'sweetalert2'
import { useModal } from '../hooks/useModal'
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useFetch } from '../hooks/useFetch'
import { Loader } from './Loader'

export const MatchUl = ( { matchs, category, onMatchAdded, phase } ) => {
  const http = helpHttp()
  const [isOpen, openModal, closeModal] = useModal()

  const [idTeamOne, setIdTeamOne] = useState( '' )
  const [idTeamTwo, setIdTeamTwo] = useState( '' )
  const [numDate, setNumDate] = useState( '' )
  const [resultOne, setResultOne] = useState( '' )
  const [resultTwo, setResultTwo] = useState( '' )
  const [editedMatchId, setEditedMatchId] = useState()

  const { data: teams, loading } = useFetch(
    category ? `/api/team/category/${ category }` : null
  )

  const onEdit = async ( e ) => {
    e.preventDefault()

    if ( phase ) {
      if ( !idTeamOne || !idTeamTwo ) {
        Swal.fire( {
          title: 'Complete los campos obligatorios',
          text: '(equipo uno , equipo dos, num fecha)',
          icon: 'error'
        } )
        openModal()
        return
      }
    } else {
      if ( !idTeamOne || !idTeamTwo || !numDate ) {
        Swal.fire( {
          title: 'Complete los campos obligatorios',
          text: '(equipo uno , equipo dos, num fecha)',
          icon: 'error'
        } )
        openModal()
        return
      }
    }

    http
      .put( `/api/match/${ editedMatchId }`, {
        idTeamOne,
        idTeamTwo,
        resultOne,
        resultTwo,
        numDate
      } )
      .then( ( response ) => {
        if ( response.ok === false ) {
          throw Error( 'Ocurrió un error' )
        }

        Swal.fire( {
          title: 'Partido editado con exito',
          icon: 'success'
        } )
        closeModal()
        onMatchAdded()
      } )
      .catch( ( err ) => {
        Swal.fire( {
          title: 'Ocurrió un error',
          text: err.message,
          icon: 'error'
        } )
      } )
  }
  const onDelete = ( idMatch ) => {
    Swal.fire( {
      title: '¿Estás seguro de eliminar ?',
      text: 'Recuerda que esto implica eliminar los puntos del partido ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    } ).then( async ( result ) => {
      if ( result.isConfirmed ) {
        http
          .del( `/api/match/${ idMatch }` )
          .then( ( response ) => {
            if ( response.ok === false ) {
              throw Error( 'Ocurrió un error' )
            }

            Swal.fire( {
              title: 'Partido eliminado con exito',
              icon: 'success'
            } )
            closeModal()
            onMatchAdded()
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
    <>
      {loading ? (
        <Loader />
      ) : (
        <ul className='ul-match'>
          {matchs.map( ( match ) => (
            <div key={match.id_partido}>
              <li
                key={match.id_partido}
                className={
                  match.res_uno !== null ? 'li-match played' : 'li-match'
                }
              >
                <div className='cont-team-match'>
                  <p className='min-w'>{match.nombre_eq_uno}</p>
                  <div className='result-match'>
                    <p>
                      {match.res_uno !== null ? (
                        match.res_uno !== 0 ? (
                          <span>({match.res_uno})</span>
                        ) : (
                          '(0)'
                        )
                      ) : (
                        ''
                      )}
                    </p>
                    <p> - </p>
                    <p>
                      {match.res_dos !== null ? (
                        match.res_dos !== 0 ? (
                          <span>({match.res_dos})</span>
                        ) : (
                          '(0)'
                        )
                      ) : (
                        ''
                      )}
                      {/* {match.res_dos ? <span>({match.res_dos})</span> : ' '} */}
                    </p>
                  </div>
                  <p>{match.nombre_eq_dos}</p>
                </div>
                <div className='cont-btn-crud'>
                  <button
                    className='edit'
                    onClick={() => {
                      setIdTeamOne( match.id_eq_uno )
                      setIdTeamTwo( match.id_eq_dos )
                      setResultOne(
                        match.res_uno === null ? ' ' : match.res_uno
                      )
                      setResultTwo(
                        match.res_dos === null ? ' ' : match.res_dos
                      )
                      setNumDate( match.num_fecha )
                      setEditedMatchId( match.id_partido )

                      openModal()
                    }}
                  >
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
                  </button>
                  <button
                    className='delete'
                    onClick={() => {
                      onDelete( match.id_partido )
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
                    </svg>{' '}
                  </button>
                  <button type='button' className='sheet-icon'>
                    <Link
                      to={`/sheet/${ match.id_partido }`}
                      className=' text-white'
                    >
                      <svg
                        width='20'
                        height='26'
                        viewBox='0 0 7 7'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M4.59375 1.59211H5.375C5.54076 1.59211 5.69973 1.65449 5.81694 1.76553C5.93415 1.87657 6 2.02718 6 2.18421V6.0329C6 6.18994 5.93415 6.34054 5.81694 6.45158C5.69973 6.56262 5.54076 6.625 5.375 6.625H1.625C1.45924 6.625 1.30027 6.56262 1.18306 6.45158C1.06585 6.34054 1 6.18994 1 6.0329V2.18421C1 2.02718 1.06585 1.87657 1.18306 1.76553C1.30027 1.65449 1.45924 1.59211 1.625 1.59211H2.40625'
                          stroke='#4D4D4D'
                          strokeWidth='0.6'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        ></path>
                        <path
                          d='M2.44406 1.44852C2.47786 1.32042 2.55588 1.20671 2.66573 1.12544C2.77557 1.04417 2.91094 1.00002 3.05031 1H3.94937C4.08875 1.00002 4.22411 1.04417 4.33396 1.12544C4.44381 1.20671 4.52183 1.32042 4.55563 1.44852L4.75 2.18421H2.25L2.44406 1.44852Z'
                          stroke='#4D4D4D'
                          strokeWidth='0.6'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        ></path>
                        <path
                          d='M2.5625 3.96053H4.4375M2.5625 5.14474H4.4375'
                          stroke='#4D4D4D'
                          strokeWidth='0.6'
                          strokeLinecap='round'
                        ></path>
                      </svg>
                    </Link>
                  </button>
                </div>
              </li>
              <Modal isOpen={isOpen} closeModal={closeModal}>
                <form onSubmit={onEdit} className='form-modal-match'>
                  <InputLabel id='age-label'>Equipo Local</InputLabel>
                  <FormControl sx={{ mb: 4, minWidth: 120 }}>
                    <Select
                      labelId='age-label'
                      // label='Age'
                      id='idTeamOne'
                      value={idTeamOne}
                      onChange={( e ) => setIdTeamOne( e.target.value )}
                    >
                      {/* <MenuItem value=''>Selecciona...</MenuItem> */}
                      {teams &&
                      teams.map( ( team ) => (
                        <MenuItem key={team.id_equipo} value={team.id_equipo}>
                          {team.nombre}
                        </MenuItem>
                      ) )}
                    </Select>
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
                  {phase ? (
                    ''
                  ) : (
                    <>
                      <InputLabel id='date-label'>Fecha</InputLabel>
                      <FormControl sx={{ mb: 4, minWidth: 120 }}>
                        <Select
                          id='numDate'
                          idlabel='date-label'
                          onChange={( e ) => setNumDate( e.target.value )}
                          value={numDate}
                        >
                          {/* <MenuItem value=''>Selecciona...</MenuItem> */}
                          {Array.from( { length: 20 }, ( _, index ) => (
                            <MenuItem key={index + 1} value={index + 1}>
                              {index + 1}
                            </MenuItem>
                          ) )}
                        </Select>
                      </FormControl>
                    </>
                  )}

                  <InputLabel id='date-label'>Equipo visitante</InputLabel>
                  <FormControl sx={{ mb: 4, minWidth: 120 }}>
                    <Select
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
                        <MenuItem key={team.id_equipo} value={team.id_equipo}>
                          {team.nombre}
                        </MenuItem>
                      ) )}
                    </Select>
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
                  <button
                    type='submit'
                    disabled={loading}
                    className='btn-input'
                  >
                    {loading ? 'Editando..' : 'Editar'}
                  </button>
                </form>
                {/* <form
                onSubmit={handleAddMatchSubmit}
                className='form-modal-match'
              >
                <div>
                  <label htmlFor='idTeamOne'>Equipo uno *</label>
                  <Select
                    id='idTeamOne'
                    value={idTeamOne}
                    onChange={( e ) => setIdTeamOne( e.target.value )}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    defaultValue=''
                  >
                    <MenuItem value=''>Selecciona...</MenuItem>
                    {teams &&
                      teams.map( ( team ) => (
                        <MenuItem key={team.id_equipo} value={team.id_equipo}>
                          {team.nombre}
                        </MenuItem>
                      ) )}
                  </Select>
                </div>
                <div>
                  <label htmlFor='resultOne'>Res uno</label>
                  <input
                    type='number'
                    id='resultOne'
                    value={resultOne}
                    className='input-number'
                    onChange={( e ) => setResultOne( e.target.value )}
                  ></input>
                </div>
                <div>
                  <label>Num fecha * </label>
                  <Select
                    id='numDate'
                    onChange={( e ) => setNumDate( e.target.value )}
                    value={numDate}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    defaultValue=''
                  >
                    <MenuItem value=''>Selecciona...</MenuItem>
                    {Array.from( { length: 20 }, ( _, index ) => (
                      <MenuItem key={index + 1} value={index + 1}>
                        {index + 1}
                      </MenuItem>
                    ) )}
                  </Select>
                </div>
                <div>
                  <label htmlFor='idTeamTwo'>Equipo dos * </label>
                  <Select
                    id='idTeamTwo'
                    value={idTeamTwo}
                    onChange={( e ) => setIdTeamTwo( e.target.value )}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    defaultValue=''
                  >
                    <MenuItem value=''>Selecciona...</MenuItem>
                    {teams &&
                      teams.map( ( team ) => (
                        <MenuItem key={team.id_equipo} value={team.id_equipo}>
                          {team.nombre}
                        </MenuItem>
                      ) )}
                  </Select>
                </div>
                <div>
                  <label htmlFor='resulTwo'>Res dos</label>
                  <input
                    className='input-number'
                    type='number'
                    id='resultTwo'
                    value={resultTwo}
                    onChange={( e ) => setResultTwo( e.target.value )}
                  ></input>
                </div>

                <button
                  type='submit'
                  onClick={() => {
                    closeModal()
                  }}
                  className='btn-input'
                >
                  Editar
                </button>
              </form> */}
              </Modal>
            </div>
          ) )}
        </ul>
      )}
    </>
  )
}
