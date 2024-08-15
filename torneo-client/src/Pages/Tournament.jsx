import { Link, useLocation } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { SelectCategory } from '../components/Select'
import { SelectCategoryLoader } from '../components/SelectCategoryLoader'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Loader } from '../components/Loader'
import { baseUrl } from '../helpers/baseUrlApi'

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
    `${ baseUrl }/season/${ id }`
  )

  const { data: categories, loading: categoriesLoading } = useFetch(
    season
      ? `${ baseUrl }/category/${ season[0]?.id_temporada }`
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
                  <Link to={`/fixture/${ selectedOption }`} className='link'>
                    <button type='button' className='button' onClick={() => {}}>
                  Fixture
                    </button>
                  </Link>
                  <Link to={`/cups/${ selectedOption }`} className='link'>
                    <button type='button' className='button' onClick={() => {}}>
                  Copas
                    </button>
                  </Link>
                  <Link to={`/scorers/${ selectedOption }`} className='link'>
                    <button type='button' className='button' onClick={() => {}}>
                  Goleadores
                    </button>
                  </Link>
                  <Link to={`/cards/${ selectedOption }`} className='link'>
                    <button type='button' className='button' onClick={() => {}}>
                  Tarjetas
                    </button>
                  </Link>
                  <Link to={`/teams/${ selectedOption }`} className='link'>
                    <button type='button' className='button' onClick={() => {}}>
                  Equipos
                    </button>
                  </Link>
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
