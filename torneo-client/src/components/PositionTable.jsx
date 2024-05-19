import { useFetch } from '../hooks/useFetch'

export const PositionTable = ( { idZone, name } ) => {
  const { data: teams } = useFetch(
    `api/team/position/${ idZone }`
  )

  return (
    <div className=''>
      <h3 className='text-center'> {name.toUpperCase()}</h3>
      <table className=' table-positions '>
        <thead>
          <tr>
            <th>#</th>
            <th>Equipo</th>
            <th>PJ</th>
            <th>PE</th>
            <th>PP</th>
            <th>PG</th>
            {/* <th>GF</th> */}
            {/* <th>GC</th> */}
            <th>DG</th>
            <th>PTS</th>
          </tr>
        </thead>
        <tbody>
          {teams &&
            teams.map( ( team, index ) => (
              <tr key={index}>
                <td className='strong'>{index + 1}</td>
                <td className='text-left'>
                  <div className='container-team-position-table text-left'>
                    <img src={team.logo_url} width='30px'></img>
                    <span>{team.nombre.slice( 0, 10 ).toUpperCase() }</span>
                  </div>
                </td>
                <td>{team.PJ}</td>
                <td>{team.PE}</td>
                <td>{team.PP}</td>
                <td>{team.PG}</td>
                {/* <td>{team.GF}</td> */}
                {/* <td>{team.GC}</td> */}
                <td>{team.DG}</td>
                <td>{team.PTS}</td>
              </tr>
            ) )}
        </tbody>
      </table>
    </div>
  )
}
