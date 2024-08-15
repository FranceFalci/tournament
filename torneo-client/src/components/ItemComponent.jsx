import React, { useState } from 'react'
import { Modal } from './Modal'
import { useModal } from '../hooks/useModal'
import { Link } from 'react-router-dom'
import { InputLabel, MenuItem, Select, TextField } from '@mui/material'

export const ItemComponent = ( {
  children,
  items,
  onEdit,
  onDelete,
  redirectLink,
  redirectName,
  title,
  order

} ) => {
  const [isOpen, openModal, closeModal] = useModal()
  const [editedItemName, setEditedItemName] = useState( '' )
  const [editedOrder, setEditedOrder] = useState( '' )
  const [editedItemId, setEditedItemId] = useState( '' )
  const handleInputChange = ( e ) => {
    setEditedItemName( e.target.value )
  }
  return (
    <div className='container-item'>
      {title && <h2>{title}</h2>}
      {items
        ? (
          <>
            {items.map( ( item ) => (
              <div key={item.id}>
                <div className='item'>
                  {item.photoUrl
                    ? (
                      <div className='d-flex-row'>
                        <img src={item.photoUrl} width='40px' height='40px'></img>
                        <h4 className='item-name'> {item.nombre.toUpperCase()}</h4>
                      </div>
                    )
                    : (
                      <h4>{item.nombre.toUpperCase()}</h4>
                    )}

                  <div className='cont-btn-crud'>
                    <button
                      className='edit'
                      onClick={() => {
                        setEditedItemName( item.nombre )
                        setEditedItemId( item.id )
                        if ( order ) {
                          setEditedOrder( item.order )
                        }

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
                        onDelete( item.id, item.nombre )
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
                    {redirectLink && (
                      <button className='other '>
                        <Link to={`/${ redirectLink }/admin`} state={{ idProp: item.id }}>
                          {redirectName}
                        </Link>
                      </button>
                    )}
                  </div>
                </div>
                <Modal isOpen={isOpen} closeModal={closeModal}>
                  <form
                    className=' form-modal-cup'
                    onSubmit={( e ) => {
                      e.preventDefault()
                    }}
                  >
                    <InputLabel>Nombre</InputLabel>
                    <TextField
                      size='small'
                      className='select-sheet'
                      type='text'
                      value={editedItemName}
                      onChange={handleInputChange}
                    />
                    {children}
                    {order && (
                      <>
                        <InputLabel htmlFor='order'>Orden</InputLabel>
                        <Select
                          size='small'
                          className='select-sheet'
                          id='order'
                          name='order'
                          value={editedOrder}
                          onChange={( e ) => {
                            setEditedOrder( e.target.value )
                          }}
                        >
                          <MenuItem value=''> Selecciona..</MenuItem>
                          {Array.from( { length: 8 }, ( _, index ) => (
                            <MenuItem key={index + 1} value={index + 1}>
                              {index + 1}
                            </MenuItem>
                          ) )}
                        </Select>
                      </>
                    )}
                    <button
                      className='btn-input'
                      onClick={() => {
                        if ( order ) {
                          onEdit( editedItemId, editedItemName, editedOrder )
                        } else {
                          onEdit( editedItemId, editedItemName )
                        }
                        closeModal()
                      }}
                    >
                    Guardar
                    </button>
                  </form>
                </Modal>
              </div>
            ) )}
          </>
        )
        : (
          <p className='text-center'> Aún no hay categorías</p>
        )}
    </div>
  )
}
