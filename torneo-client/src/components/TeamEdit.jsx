/* eslint-disable multiline-ternary */
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loader } from './Loader'
import useImageUpload from '../hooks/useImageUpload'
import Swal from 'sweetalert2'
import { helpHttp } from '../helpers/helpHttp'
import { baseUrl } from '../helpers/baseUrlApi'

const TeamEdit = () => {
  const { idTeam } = useParams()
  const http = helpHttp()

  const [formData, setFormData] = useState()
  const { loading, imageUrl, uploadImage, setImageUrl } = useImageUpload()
  const fileInputRef = useRef( null )

  const handleImageChange = ( e ) => {
    const file = e.target.files[0]
    if ( file ) {
      uploadImage( file )
    }
  }

  const handleEditTeamSubmit = async ( e ) => {
    e.preventDefault()
    if ( loading ) return

    if ( !formData.nombre ) {
      Swal.fire( {
        title: 'El nombre es obligatorio',
        icon: 'error'
      } )
      return
    }

    http
      .put( `${ baseUrl }/team/info/${ formData.id_equipo }`, {
        name: formData.nombre,
        photoUrl: formData.logo_url
      } )
      .then( ( response ) => {
        if ( response.ok === false ) {
          throw Error( 'Ocurrió un error' )
        }
        Swal.fire( {
          title: 'Equipo editado con exito',
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

  useEffect( () => {
    setFormData( { ...formData, logo_url: imageUrl } )
  }, [imageUrl] )

  useEffect( () => {
    const fetchTeamById = async () => {
      try {
        const res = await fetch(
          `${ baseUrl }/team/${ idTeam }`
        )
        const data = await res.json()
        if ( res.ok === false ) {
          throw Error( 'Ocurrió un error' )
        } else {
          setFormData( data )
        }
      } catch ( error ) {
      }
    }
    fetchTeamById()
  }, [idTeam] )

  return (
    <>
      {formData ? (
        <div className='edit-team '>
          <input
            placeholder='Nombre equipo'
            type='text'
            id='name'
            value={formData.nombre}
            onChange={( e ) =>
              setFormData( { ...formData, nombre: e.target.value } )
            }
          ></input>
          {/* <div className='cont-input-file'> */}
          <label htmlFor='photoUrl' className='file-input'>
            <input
              className=''
              type='file'
              id='photoUrl'
              accept='image/*'
              onChange={handleImageChange}
              ref={fileInputRef}
            ></input>
            <svg
              className='svg-file'
              width='16'
              height='16'
              viewBox='0 0 16 16'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M0.513 1.513C0.84101 1.18476 1.28596 1.00023 1.75 1H5.25C5.8 1 6.32 1.26 6.65 1.7L7.55 2.9C7.57329 2.93105 7.60348 2.95625 7.6382 2.97361C7.67291 2.99096 7.71119 3 7.75 3H13C13.2652 3 13.5196 3.10536 13.7071 3.29289C13.8946 3.48043 14 3.73478 14 4V4.5H2.75C2.55109 4.5 2.36032 4.57902 2.21967 4.71967C2.07902 4.86032 2 5.05109 2 5.25C2 5.44891 2.07902 5.63968 2.21967 5.78033C2.36032 5.92098 2.55109 6 2.75 6H14.728C14.8693 5.99988 15.009 6.02969 15.1379 6.08747C15.2668 6.14525 15.382 6.22969 15.4759 6.33522C15.5698 6.44075 15.6403 6.56499 15.6827 6.69974C15.7251 6.83449 15.7385 6.9767 15.722 7.117L15 13.25C15 13.7141 14.8156 14.1592 14.4874 14.4874C14.1592 14.8156 13.7141 15 13.25 15H1.75C1.28587 15 0.840752 14.8156 0.512563 14.4874C0.184374 14.1592 0 13.7141 0 13.25L0 2.75C0 2.286 0.184 1.84 0.513 1.513Z'
                fill='#4D4D4D'
              />
            </svg>
            Editar logo del equipo
          </label>

          {formData.logo_url && (
            <>
              <figure className='figure-logo-edit'>
                <img src={formData.logo_url} className='img-logo-edit'></img>
              </figure>
              <button
                className='btn-delete-img'
                onClick={() => {
                  setImageUrl( null )
                  setFormData( {
                    ...formData,
                    logo_url: ''
                  } )

                  // setImageFile( null )
                  fileInputRef.current.value = null
                }}
                type='button'
              >
                Borrar imagen
                <svg
                  width='16'
                  height='18'
                  viewBox='0 0 16 18'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M3 18C2.45 18 1.97933 17.8043 1.588 17.413C1.19667 17.0217 1.00067 16.5507 1 16V3H0V1H5V0H11V1H16V3H15V16C15 16.55 14.8043 17.021 14.413 17.413C14.0217 17.805 13.5507 18.0007 13 18H3ZM5 14H7V5H5V14ZM9 14H11V5H9V14Z'
                    fill='#F8F8F8'
                  />
                </svg>
              </button>
            </>
          )}
          <button
            className='btn-input'
            onClick={handleEditTeamSubmit}
            disabled={loading}
          >
            {loading ? 'Cargando..' : 'Editar'}
          </button>
        </div>
      ) : (
        <Loader />
      )}
    </>
  )
}

export default TeamEdit
