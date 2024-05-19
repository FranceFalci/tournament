import React, { useState } from 'react'
import { Modal } from './Modal'
import { useModal } from '../hooks/useModal'
import { Link } from 'react-router-dom'

export const ZonesComponent = ( { zones, onEdit, onDelete } ) => {
  const [isOpen, openModal, closeModal] = useModal()
  const [editedZoneName, setEditedZoneName] = useState( '' )
  const [editedZoneId, setEditedZoneId] = useState( '' )

  const handleInputChange = ( e ) => {
    setEditedZoneName( e.target.value )
  }
  return (
    <div>
      {zones
        ? (
          <div>
            {zones.map( ( zone ) => (
              <div key={zone.id_zona} className='d-flex gap-2 m-4'>
                <h4>{zone.nombre}</h4>
                <button
                  className='btn btn-primary'
                  onClick={() => {
                    setEditedZoneName( zone.nombre )
                    setEditedZoneId( zone.id_zona )

                    openModal()
                  }}
                >
                editar
                </button>
                <button
                  className='btn btn-danger'
                  onClick={() => {
                    onDelete( zone.id_zona, zone.nombre )
                  }}
                >
                eliminar
                </button>
                <button
                  className='btn btn-success'
                >
                  <Link to={`/teams/zone/${ zone.id_zona }`}>
                    equipos
                  </Link>
                </button>
                <Modal isOpen={isOpen} closeModal={closeModal}>
                  <input
                    type='text'
                    value={editedZoneName}
                    onChange={handleInputChange}
                  />
                  <button
                    onClick={() => {
                      onEdit( editedZoneId, editedZoneName )
                      closeModal()
                    }}
                  >
                  guardar
                  </button>
                </Modal>
              </div>
            ) )}
          </div>
        )
        : (
          <p>aun no hay zonas</p>
        )}
    </div>
  )
}
