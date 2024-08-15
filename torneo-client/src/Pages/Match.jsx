import { useContext, useEffect, useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { useParams } from 'react-router-dom'
import { MatchForm } from '../components/MatchForm'
import { SelectCategory } from '../components/Select'
import { MatchCrud } from '../components/MatchCRUD'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { SelectCategoryLoader } from '../components/SelectCategoryLoader'
import { baseUrl } from '../helpers/baseUrlApi'
import { SeasonContext } from '../context/Season'

const Match = () => {
  // const { idSeason } = useParams()
  const { season } = useContext( SeasonContext )
  console.log( 'hola' )

  const { data: categories } = useFetch(
    `${ baseUrl }/category/${ season.id_temporada }`
  )
  const [matchAdded, setMatchAdded] = useState( false )
  const [selectedOption, setSelectedOption] = useLocalStorage( 'selectedOption', '' )
  const [matchs, setMatchs] = useState( [] )

  console.log( categories )
  const handleMatchAdded = () => {
    setMatchAdded( !matchAdded )
  }

  useEffect( () => {
    const fetchMatchs = async () => {
      try {
        const response = await fetch(
          `${ baseUrl }/match/category/${ selectedOption }`
        )
        if ( response.ok ) {
          const data = await response.json()
          setMatchs( data )
        } else {
          const err = new Error( 'Error en la petición Fetch' )
          err.status = response.status || '00'
          err.statusText = response.statusText || 'Ocurrió un error'
          throw err
        }
      } catch ( err ) {
        // throw new Error( err )
      }
    }
    if ( selectedOption ) { fetchMatchs() }
  }, [selectedOption, matchAdded] )
  console.log( categories )
  return (
    <div className='container-match'>
      <SelectCategory
        selectedOption={selectedOption}
        items={categories}
        handleChange={( e ) => { setSelectedOption( e.target.value ) }}
      />
      {selectedOption
        ? (
          <>
            <MatchForm
              idCategory={selectedOption}
              onMatchAdded={handleMatchAdded}
            />
            {matchs && matchs.length > 0
              ? (
                <MatchCrud
                  partidos={matchs}
                  category={selectedOption}
                  onMatchAdded={handleMatchAdded}
                />
              )
              : (
                <SelectCategoryLoader text='Crea tu primer partido!' />
              )}
          </>
        )
        : (
          <SelectCategoryLoader/>
        )}
    </div>
  )
}

export default Match
