/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from 'react'
import { SelectCategory } from '../components/Select'
import { useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import TeamsByZone from './TeamsByZone'
import { SelectCategoryLoader } from '../components/SelectCategoryLoader'

const TeamsAdmin = () => {
  const { idSeason } = useParams()
  const { data: categories } = useFetch(
    `api/category/${ idSeason }`
  )

  const [selectedOptionCategory, setSelectedOptionCategory] = useState( '' )
  const [selectedOptionZone, setSelectedOptionZone] = useState( '' )

  const { data: zones } = useFetch(
    selectedOptionCategory
      ? `api/zone/${ selectedOptionCategory }`
      : null
  )
  const handleSelectCatChange = ( event ) => {
    const selectedValue = event.target.value
    setSelectedOptionCategory( selectedValue )
    localStorage.setItem( 'selectedOption', selectedValue )
  }
  const handleSelectZoneChange = ( event ) => {
    const selectedValue = event.target.value
    setSelectedOptionZone( selectedValue )
    localStorage.setItem( 'selectedZone', selectedValue )
  }

  useEffect( () => {
    const storedValueCategory = localStorage.getItem( 'selectedOption' )
    const storedValueZone = localStorage.getItem( 'selectedZone' )

    if ( storedValueCategory ) {
      setSelectedOptionCategory( storedValueCategory )
    }
    if ( storedValueZone ) {
      setSelectedOptionZone( storedValueZone )
    }
  }, [] )

  return (
    <div className='container-teams-admin'>
      <div className='cont-select'>
        <SelectCategory
          selectedOption={selectedOptionCategory}
          items={categories}
          handleChange={handleSelectCatChange}
        />
      </div>

      {selectedOptionCategory ? (
        <>
          {zones && (
            <div className='cont-select'>
              <SelectCategory
                handleChange={handleSelectZoneChange}
                selectedOption={selectedOptionZone}
                items={zones.map( ( zone ) => ( {
                  id_categoria: zone.id_zona,
                  nombre: zone.nombre
                } ) )}
                defaultText={'Selecciona una zona..'}
              />
            </div>
          )}

          {/* <option value=''>Seleccionar zona</option>
              {zones &&
              zones.map( ( item ) => (
                <option key={item.id_zona} value={item.id_zona}>
                  {item.nombre}
                </option>
              ) )} */}
          {/* </select> */}

          {selectedOptionZone ? (
            <TeamsByZone idZoneProp={selectedOptionZone} />
          ) : (
            <SelectCategoryLoader text={'Seleccione una zona..'} />
          )}
        </>
      ) : (
        <SelectCategoryLoader />
      )}
    </div>
  )
}

export default TeamsAdmin
