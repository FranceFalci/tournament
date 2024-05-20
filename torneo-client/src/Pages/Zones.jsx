import React from 'react'
import { SelectCategory } from '../components/Select'
import { useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import Zone from './Zone'
import { useLocalStorage } from '../hooks/useLocalStorage'

const Zones = () => {
  const { idSeason } = useParams()
  const { data: categories } = useFetch(
    `/api/category/${ idSeason }`
  )
  const [selectedOption, setSelectedOption] = useLocalStorage( 'selectedOptionZone', '' )

  return (
    <div className='container-match d-flex '>
      <SelectCategory
        selectedOption={selectedOption}
        items={categories}
        handleChange={( e ) => {
          setSelectedOption( e.target.value )
        }}
      />

      {selectedOption
        ? (
          <Zone idCatProp={selectedOption} />
        )
        : (
          <p> selecciones categoria</p>
        )}
    </div>
  )
}

export default Zones
