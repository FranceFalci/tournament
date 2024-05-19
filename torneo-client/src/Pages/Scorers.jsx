import { useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { SelectCategoryLoader } from '../components/SelectCategoryLoader'
import { Loader } from '../components/Loader'

const Scorers = () => {
  const { idCategory } = useParams()
  const { data: players, loading } = useFetch(
    `api/player/scorers/${ idCategory }`
  )
  return (
    <div className='container-player-static'>
      {loading
        ? (
          <Loader />
        )
        : (
          <>
            {players && players.length > 0
              ? (
                <table className='table-padding '>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nombre</th>
                      <th>Equipo</th>
                      <th>
                        <svg
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M19.071 4.92898C18.1454 3.99604 17.0439 3.25598 15.8304 2.75167C14.6168 2.24736 13.3152 1.9888 12.001 1.99098C10.6865 1.98892 9.3847 2.24752 8.17081 2.75182C6.95693 3.25612 5.85508 3.99611 4.92901 4.92898C1.03001 8.82698 1.03001 15.172 4.92901 19.071C5.8551 20.0041 6.95709 20.7442 8.17118 21.2486C9.38527 21.7529 10.6873 22.0113 12.002 22.009C13.3161 22.0113 14.6177 21.7529 15.8312 21.2488C17.0448 20.7446 18.1463 20.0047 19.072 19.072C22.971 15.174 22.971 8.82898 19.071 4.92898ZM12.181 3.99998H11.822C11.883 3.99898 11.941 3.99098 12.002 3.99098C12.063 3.99098 12.12 3.99898 12.181 3.99998ZM18.243 17H16L14.742 19.516C13.8644 19.8402 12.9366 20.0071 12.001 20.009C11.0637 20.0073 10.1341 19.84 9.25501 19.515L8.00001 17.01H5.76501C4.94045 15.9849 4.38282 14.7713 4.14201 13.478L6.00001 11L4.78401 8.56698C5.17202 7.74157 5.69941 6.98922 6.34301 6.34298C7.2438 5.43904 8.3479 4.76389 9.56301 4.37398L12 5.99998L14.438 4.37498C15.6528 4.76517 16.7567 5.43989 17.658 6.34298C18.3009 6.98845 18.8279 7.73975 19.216 8.56398L18 11L19.858 13.478C19.6183 14.7672 19.0635 15.9771 18.243 17Z'
                            fill='black'
                          />
                          <path
                            d='M8.5 11L10 15H14L15.5 11L12 8.5L8.5 11Z'
                            fill='black'
                          />
                        </svg>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map( ( player, index ) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td className='text-right'>{player.nombre}</td>
                        <td className='text-right'>
                          {player.equipo.toUpperCase()}
                        </td>
                        <td>{player.goles}</td>
                      </tr>
                    ) )}
                  </tbody>
                </table>
              )
              : (
                <SelectCategoryLoader text='Todavía no hay goleadores!' />
              )}
          </>
        )}
    </div>
  )
}

export default Scorers
