import { Link } from 'react-router-dom'
import { Loader } from '../components/Loader'
import { useFetch } from '../hooks/useFetch'
import Swal from 'sweetalert2'

const Home = () => {
  const { data: tournaments, loading, error } = useFetch(
    '/api/tournament/'
  )
  localStorage.removeItem( 'selectCategoryTournament' )
  if ( error ) {
    return Swal.fire(
      'Lo sentimos, ha ocurrido un error!',
      'Intenta nuevamente',
      'error'
    )
  }
  return (
    <>
      {loading
        ? (
          <Loader />
        )
        : (
          <>
            <div className=' container-home  '>
              {tournaments &&
              tournaments.map( ( torneo ) => (
                <button
                  key={torneo.id_torneo}
                  type='button'
                  className='button '
                  onClick={() => {}}
                >
                  <Link
                    to={`/${ torneo.nombre.replace( /\s+/g, '' ).toLowerCase() }`}
                    state={{ idTournament: torneo.id_torneo }}
                    className='link'
                  >
                    {torneo.nombre}
                  </Link>
                  <svg
                    width='35'
                    height='35'
                    viewBox='0 0 25 25'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M20.7322 13.0638C21.0127 12.7822 21.1701 12.4008 21.1696 12.0033C21.1691 11.6058 21.0109 11.2247 20.7297 10.9438L15.0671 5.29134C14.7854 5.01027 14.4036 4.85263 14.0056 4.85309C13.6077 4.85355 13.2262 5.01208 12.9451 5.2938C12.6641 5.57552 12.5064 5.95735 12.5069 6.35531C12.5074 6.75326 12.6659 7.13473 12.9476 7.4158L16.0472 10.5092L4.5122 10.5226C4.11438 10.523 3.73303 10.6815 3.45205 10.9631C3.17107 11.2448 3.01348 11.6265 3.01394 12.0243C3.0144 12.4221 3.17288 12.8035 3.45451 13.0845C3.73614 13.3654 4.11785 13.523 4.51567 13.5226L16.0507 13.5092L12.9583 16.6088C12.8191 16.7483 12.7087 16.9138 12.6336 17.096C12.5584 17.2781 12.5198 17.4733 12.52 17.6703C12.5202 17.8673 12.5593 18.0624 12.6349 18.2444C12.7105 18.4263 12.8212 18.5916 12.9607 18.7308C13.1002 18.87 13.2657 18.9803 13.4479 19.0555C13.63 19.1307 13.8252 19.1693 14.0222 19.169C14.2193 19.1688 14.4143 19.1298 14.5963 19.0542C14.7783 18.9785 14.9435 18.8678 15.0827 18.7283L20.7322 13.0638Z'
                      fill='#26A380'
                    />
                  </svg>
                </button>
              ) )}
            </div>
          </>
        )}
      {/* <Loader /> */}
    </>
  )
}
export default Home
