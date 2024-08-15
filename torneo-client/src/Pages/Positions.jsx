import { useParams } from 'react-router-dom'
import { PositionTable } from '../components/PositionTable'
import { useFetch } from '../hooks/useFetch'
import { Loader } from '../components/Loader'
import { SelectCategoryLoader } from '../components/SelectCategoryLoader'
import { baseUrl } from '../helpers/baseUrlApi'

const Positions = () => {
  const { idCategory } = useParams()
  const { data: zones, loading } = useFetch(
    `${ baseUrl }/zone/${ idCategory }`
  )

  return (
    <div className='container-mt'>
      {loading
        ? (
          <Loader />
        )
        : (
          <>
            {zones && zones.length > 0
              ? (
                <>
                  {zones.map( ( zone ) => (
                    <PositionTable
                      idZone={zone.id_zona}
                      name={zone.nombre}
                      key={zone.id_zona}
                    />
                  ) )}
                </>
              )
              : (
                <SelectCategoryLoader text={'Aún no hay posiciones..'} />
              )}
          </>
        )}
    </div>
  )
}
export default Positions
