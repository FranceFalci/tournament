import { useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { Loader } from '../components/Loader'
import { SelectCategoryLoader } from '../components/SelectCategoryLoader'

const Cards = () => {
  const { idCategory } = useParams()
  const { data: players, loading } = useFetch(
    `/api/player/cards/${ idCategory }`
  )

  return (
    <>
      {loading
        ? (
          <Loader />
        )
        : (
          <div className='container-player-static'>
            {players && players.length > 0
              ? (
                <table className=' table-padding table-cards'>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nombre</th>
                      <th>Equipo</th>
                      <th>
                        <svg
                          width='12'
                          height='15'
                          viewBox='0 0 12 15'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M10.8 15H1.2C0.88174 15 0.576515 14.8025 0.351472 14.4508C0.126428 14.0992 0 13.6223 0 13.125V1.875C0 1.37772 0.126428 0.900805 0.351472 0.549175C0.576515 0.197544 0.88174 0 1.2 0H10.8C11.1183 0 11.4235 0.197544 11.6485 0.549175C11.8736 0.900805 12 1.37772 12 1.875V13.125C12 13.6223 11.8736 14.0992 11.6485 14.4508C11.4235 14.8025 11.1183 15 10.8 15Z'
                            fill='#FAFF00'
                            fillOpacity='0.7'
                          />
                        </svg>
                      </th>
                      <th>
                        <svg
                          width='12'
                          height='15'
                          viewBox='0 0 12 15'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M10.8 15H1.2C0.88174 15 0.576515 14.8025 0.351472 14.4508C0.126428 14.0992 0 13.6223 0 13.125V1.875C0 1.37772 0.126428 0.900805 0.351472 0.549175C0.576515 0.197544 0.88174 0 1.2 0H10.8C11.1183 0 11.4235 0.197544 11.6485 0.549175C11.8736 0.900805 12 1.37772 12 1.875V13.125C12 13.6223 11.8736 14.0992 11.6485 14.4508C11.4235 14.8025 11.1183 15 10.8 15Z'
                            fill='#F20000'
                            fillOpacity='0.62'
                          />
                        </svg>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map( ( player, index ) => (
                      <tr key={index}>
                        <td className='medium'>{index + 1}</td>
                        <td>{player.nombre}</td>
                        <td>{player.equipo.toUpperCase()}</td>
                        <td>{player.tarjetas_amarillas}</td>
                        <td>{player.tarjetas_rojas}</td>
                      </tr>
                    ) )}
                  </tbody>
                </table>
              )
              : (
                <SelectCategoryLoader text='Todavía no hay tarjetas!' />
              )}
          </div>
        )}
    </>
  )
}

export default Cards
