import { useEffect, useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { useParams } from 'react-router-dom'
import { MatchForm } from '../components/MatchForm'
import { SelectCategory } from '../components/Select'
import { MatchCrud } from '../components/MatchCRUD'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { SelectCategoryLoader } from '../components/SelectCategoryLoader'

const Match = () => {
  const { idSeason } = useParams()
  const { data: categories } = useFetch( `api/category/${ idSeason }` )
  const [matchAdded, setMatchAdded] = useState( false )
  const [selectedOption, setSelectedOption] = useLocalStorage( 'selectedOption', '' )
  const [matchs, setMatchs] = useState( [] )

  const handleMatchAdded = () => {
    setMatchAdded( !matchAdded )
  }

  useEffect( () => {
    const fetchMatchs = async () => {
      try {
        const response = await fetch(
          `api/match/category/${ selectedOption }`
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
