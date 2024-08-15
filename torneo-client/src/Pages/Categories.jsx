import React, { useContext, useState } from 'react'
import { SeasonContext } from '../context/Season'
import { ItemComponent } from '../components/ItemComponent'
import Swal from 'sweetalert2'
import { Modal } from '../components/Modal'
import { useModal } from '../hooks/useModal'
import { useFetch } from '../hooks/useFetch'
import { helpHttp } from '../helpers/helpHttp'
import { baseUrl } from '../helpers/baseUrlApi'
const initialState = {
  name: ''
}

const Categories = () => {
  const { season } = useContext( SeasonContext )
  const [isOpenAdd, openModalAdd, closeModalAdd] = useModal()
  const [formDataNewCategory, setFormDataNewCategory] = useState( initialState )
  const http = helpHttp()
  const { data: categories, setData: setCategories } = useFetch(
    season?.id_temporada
      ? `${ baseUrl }/category/${ season.id_temporada }`
      : null
  )

  const handleAddCategorySubmit = async ( e ) => {
    e.preventDefault()
    if ( !formDataNewCategory.name ) {
      Swal.fire( {
        title: 'El nombre es obligatorio',
        icon: 'error'
      } )
      openModalAdd()
    }
    http
      .post( `${ baseUrl }/category/${ season.id_temporada }`, {
        name: formDataNewCategory.name
      } )
      .then( ( response ) => {
        if ( response === false ) {
          throw Error( 'Ocurrió un error' )
        }
        setFormDataNewCategory( initialState )
        setCategories( [...categories, response.newCategory] )
        Swal.fire( {
          title: 'Categoria agregada con exito',
          icon: 'success'
        } )
      } )
      .catch( ( err ) => {
        Swal.fire( {
          title: 'Ocurrió un error',
          text: err.mesage,
          icon: 'error'
        } )
      } )
  }

  const handleChangeCategoryInput = ( e ) => {
    setFormDataNewCategory( {
      ...formDataNewCategory,
      [e.target.id]: e.target.value
    } )
  }
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
      .put( `${ baseUrl }/category/${ id }`, {
        name: value
      } )
      .then( ( response ) => {
        if ( response === false ) {
          throw Error( 'Ocurrió un error' )
        }
        Swal.fire(
          'Categoria editada',
          'Has editado la categoria correctamente.',
          'success'
        )
        setCategories( ( prevCategories ) =>
          prevCategories.map( ( category ) =>
            category.id_categoria === id ? { ...category, nombre: value } : category
          )
        )
      } )
      .catch( ( err ) => {
        Swal.fire( {
          title: 'Ocurrió un error',
          text: err.mesage,
          icon: 'error'
        } )
      } )
  }

  const onDelete = ( id, name ) => {
    Swal.fire( {
      title: `¿Estás seguro de eliminar la categoria ${ name }?`,
      text: 'Recuerda que esto implica eliminar las zonas pertenecientes a esta categoria y a los equipos y jugadores perteneciente a las zonas',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    } ).then( async ( result ) => {
      if ( result.isConfirmed ) {
        http
          .del( `${ baseUrl }/category/${ id }` )
          .then( ( response ) => {
            if ( response === false ) {
              throw Error( 'Ocurrió un error' )
            }
            Swal.fire(
              'Categoria eliminada',
              'Has eliminado la categoria correctamente.',
              'success'
            )
            setCategories( ( prevCategories ) =>
              prevCategories.filter( ( category ) => category.id_categoria !== id )
            )
          } )
          .catch( ( err ) => {
            Swal.fire( {
              title: 'Ocurrió un error',
              text: err.mesage,
              icon: 'error'
            } )
          } )
      }
    } )
  }

  return (
    <div className='d-flex container-match'>
      <button
        className='add-button'
        onClick={() => {
          openModalAdd()
        }}
      >
        Agregar Categoria
      </button>
      <Modal
        isOpen={isOpenAdd}
        openModal={openModalAdd}
        closeModal={closeModalAdd}
      >
        <form onSubmit={handleAddCategorySubmit} className='form-modal-gral'>
          <input
            type='text'
            id='name'
            value={formDataNewCategory.name}
            onChange={handleChangeCategoryInput}
            placeholder='Nombre Categoria'
          ></input>
          <button
            className='btn-input '
            type='submit'
            onClick={() => {
              closeModalAdd()
            }}
          >
            agregar
          </button>
        </form>
      </Modal>
      {!!season && categories && (
        <ItemComponent
          items={categories.map( ( category ) => ( {
            id: category.id_categoria,
            nombre: category.nombre
          } ) )}
          onEdit={onEdit}
          onDelete={onDelete}
          redirectLink={'zone'}
          redirectName={'zonas'}
        />
      )}
    </div>
  )
}

export default Categories
