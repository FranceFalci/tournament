import { useParams } from 'react-router-dom'
import { SelectCategory } from '../components/Select'
import { useFetch } from '../hooks/useFetch'
import { lazy, useContext, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Modal } from '../components/Modal'
import { useModal } from '../hooks/useModal'
import Swal from 'sweetalert2'
import { helpHttp } from '../helpers/helpHttp'
import { InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { baseUrl } from '../helpers/baseUrlApi'
import { SeasonContext } from '../context/Season'

const CupsByCategoryLazy = lazy( () => import( '../components/CupsByCategory' ) )
const initialState = {
  type: '',
  order: ''
}
const Cups = () => {
  const { season } = useContext( SeasonContext )
  const { data: categories } = useFetch( `${ baseUrl }/category/${ season.id_temporada }` )
  const [selectedOption, setSelectedOption] = useLocalStorage( 'categoryCup', '' )
  const [isOpenAdd, openModalAdd, closeModalAdd] = useModal()
  const [formDataNewCup, setFormDataNewCup] = useState( initialState )
  const [shouldUpdate, setShouldUpdate] = useState( false )

  const http = helpHttp()
  const reload = () => {
    setShouldUpdate( !shouldUpdate )
  }
  const handleInputChange = ( e ) => {
    setFormDataNewCup( {
      ...formDataNewCup,
      [e.target.name]: e.target.value
    } )
  }
  const handleAddCupSubmit = async ( e ) => {
    e.preventDefault()

    if ( !formDataNewCup.type || !formDataNewCup.order ) {
      Swal.fire( {
        title: 'Ambos campos son obligatorios!',
        icon: 'error'
      } )
      openModalAdd()
      return
    }
    http
      .post( `${ baseUrl }/cup/${ selectedOption }`, formDataNewCup )
      .then( ( response ) => {
        if ( response === false ) {
          throw Error( 'Ocurrió un error' )
        }
        setFormDataNewCup( initialState )
        reload()
        Swal.fire( {
          title: 'Copa agregada con exito',
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
    <div className='container-match'>
      <SelectCategory
        selectedOption={selectedOption}
        items={categories}
        handleChange={( e ) => {
          setSelectedOption( e.target.value )
        }}
      />

      {selectedOption && (
        <>
          <button
            className='add-button'
            onClick={() => {
              openModalAdd()
            }}
          >
          Agregar Copa
          </button>
          <Modal
            isOpen={isOpenAdd}
            openModal={openModalAdd}
            closeModal={closeModalAdd}
          >
            <form onSubmit={handleAddCupSubmit} className='form-modal-cup'>
              <InputLabel htmlFor='type'>Nombre</InputLabel>

              <TextField
                className='select-sheet'
                fullWidth
                size='small'
                type='text'
                id='type'
                name='type'
                value={formDataNewCup.type}
                onChange={handleInputChange}
              />

              <InputLabel htmlFor='order'>Orden</InputLabel>
              <Select
                size='small'
                className='select-sheet'
                id='order'
                name='order'
                value={formDataNewCup.order}
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
          <CupsByCategoryLazy
            idCategory={selectedOption}
            reload={reload}
            key={shouldUpdate}
          />
        </>
      )}
    </div>
  )
}

export default Cups
