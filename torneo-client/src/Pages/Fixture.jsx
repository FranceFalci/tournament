import { useParams } from 'react-router-dom'
import { PartidosPorFecha } from '../components/PartidosPorFecha'
import { useFetch } from '../hooks/useFetch'
import { Loader } from '../components/Loader'
import { SelectCategoryLoader } from '../components/SelectCategoryLoader'
import { baseUrl } from '../helpers/baseUrlApi'

const Fixture = ( ) => {
  const { idCategory } = useParams()
  const { data: matchs, loading } = useFetch(
    `${ baseUrl }/match/category/${ idCategory }`
  )

  return (
    <div className='container-fixture'>
      {loading
        ? (
          <Loader />
        )
        : (
          <>
            {matchs && matchs.length > 0
              ? (
                <PartidosPorFecha partidos={matchs} />
              )
              : (
                <SelectCategoryLoader text='Todavía no hay partidos!'/>
              )}
          </>
        )}
    </div>
  )
}

export default Fixture
