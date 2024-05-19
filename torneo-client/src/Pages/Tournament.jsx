import { Link, useLocation } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { SelectCategory } from '../components/Select'
import { SelectCategoryLoader } from '../components/SelectCategoryLoader'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Loader } from '../components/Loader'

const Tournament = ( { idTournamentProp = 0 } ) => {
  // const { idTournament } = useParams();
  const location = useLocation()
  const { idTournament } = location.state || 0
  const id = idTournament || idTournamentProp
  const [selectedOption, setSelectedOption] = useLocalStorage(
    'selectCategoryTournament',
    ''
  )
  localStorage.removeItem( 'dateSelectedOption' )

  const { data: season, loading: seasonLoading } = useFetch(
    `api/season/${ id }`
  )

  const { data: categories, loading: categoriesLoading } = useFetch(
    season
      ? `api/category/${ season[0]?.id_temporada }`
      : null
  )

  // Definir un cargando general para la temporada y categorías
  const loading = seasonLoading || categoriesLoading

  return (
    <div className='cont-tournament'>
      {loading
        ? (
          <Loader />
        )
        : (
          <div className='main-tournament'>
            <SelectCategory
              selectedOption={selectedOption}
              items={categories}
              handleChange={( e ) => setSelectedOption( e.target.value )}
            />

            {selectedOption
              ? (
                <div className='options'>
                  <Link to={`/positions/${ selectedOption }`} className='link'>
                    <button type='button' className='button' onClick={() => {}}>
                  Posiciones
                    </button>
                  </Link>
                  <button type='button' className='button' onClick={() => {}}>
                    <Link to={`/fixture/${ selectedOption }`} className='link'>
                  Fixture
                    </Link>
                  </button>
                  <button type='button' className='button' onClick={() => {}}>
                    <Link to={`/cups/${ selectedOption }`} className='link'>
                  Copas
                    </Link>
                  </button>
                  <button type='button' className='button' onClick={() => {}}>
                    <Link to={`/scorers/${ selectedOption }`} className='link'>
                  Goleadores
                    </Link>
                  </button>
                  <button type='button' className='button' onClick={() => {}}>
                    <Link to={`/cards/${ selectedOption }`} className='link'>
                  Tarjetas
                    </Link>
                  </button>
                  <button type='button' className='button' onClick={() => {}}>
                    <Link to={`/teams/${ selectedOption }`} className='link'>
                  Equipos
                    </Link>
                  </button>
                </div>
              )
              : (
                <SelectCategoryLoader />
              )}
          </div>
        )}
    </div>
  )
}

export default Tournament
