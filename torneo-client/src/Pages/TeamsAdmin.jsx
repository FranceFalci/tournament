/* eslint-disable multiline-ternary */
import React, { useContext, useEffect, useState } from 'react'
import { SelectCategory } from '../components/Select'
import { useFetch } from '../hooks/useFetch'
import TeamsByZone from './TeamsByZone'
import { SelectCategoryLoader } from '../components/SelectCategoryLoader'
import { baseUrl } from '../helpers/baseUrlApi'
import { SeasonContext } from '../context/Season'

const TeamsAdmin = () => {
  // const { idSeason } = useParams()
  console.log( 'hola' )
  const { season } = useContext( SeasonContext )

  const { data: categories } = useFetch( `${ baseUrl }/category/6` )

  const [selectedOptionCategory, setSelectedOptionCategory] = useState( '' )
  const [selectedOptionZone, setSelectedOptionZone] = useState( '' )

  const { data: zones } = useFetch(
    selectedOptionCategory ? `${ baseUrl }/zone/${ selectedOptionCategory }` : null
  )
  const handleSelectCatChange = ( event ) => {
    const selectedValue = event.target.value
    setSelectedOptionCategory( selectedValue )
    setSelectedOptionZone( '' )
    localStorage.setItem( 'selectedOption', selectedValue )
  }
  const handleSelectZoneChange = ( event ) => {
    const selectedValue = event.target.value
    setSelectedOptionZone( selectedValue )
    localStorage.setItem( 'selectedZone', selectedValue )
  }
  useEffect( () => {
    console.log( 'TeamsAdmin component mounted' )
  }, [] )

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
    // <h1>fsd</h1>
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
