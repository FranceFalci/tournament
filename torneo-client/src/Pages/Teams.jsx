import { Link, useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { Loader } from '../components/Loader'

const Teams = () => {
  const { idCategory } = useParams()
  const { data: teams, loading } = useFetch(
    `api/team/category/${ idCategory }`
  )

  return (
    <div className='container-teams'>
      {loading
        ? (
          <Loader />
        )
        : (
          <>
            <h2 className='text-center'>EQUIPOS </h2>
            {teams && (
              <div className='container-team'>
                {teams.map( ( team ) => (
                  <div key={team.id_equipo} className='team'>
                    <img
                      src={team.logo_url}
                      className=''
                      style={{ width: '60px', height: '60px' }} // Tamaño fijo de la imagen
                      alt='Logo del equipo'
                    />
                    <p className='flex-grow-1 mx-3 mb-0' style={{ flex: '1' }}>
                      {team.nombre.toUpperCase()}
                    </p>

                    <button className='btn-green'>
                      <Link to={`/players/${ team.id_equipo }`} className='link'>
                      PLANTEL
                      </Link>
                    </button>
                  </div>
                ) )}
              </div>
            )}
          </>
        )}
    </div>
  )
}
export default Teams
