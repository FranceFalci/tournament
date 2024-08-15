import React, { useContext } from 'react'
import { SelectCategory } from '../components/Select'
import { useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import Zone from './Zone'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { baseUrl } from '../helpers/baseUrlApi'
import { SeasonContext } from '../context/Season'

const Zones = () => {
  // const { idSeason } = useParams()
  const { season } = useContext( SeasonContext )

  const { data: categories } = useFetch(
    `${ baseUrl }/category/${ season.id_temporada }`
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
