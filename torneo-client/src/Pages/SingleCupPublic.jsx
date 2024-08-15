import { useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { MatchForPhases } from '../components/MatchForPhases'
import { baseUrl } from '../helpers/baseUrlApi'

const SingleCupPublic = () => {
  const { idCup } = useParams()
  const { data: phases } = useFetch( `${ baseUrl }/phase/${ idCup }` )

  const { data: cup } = useFetch( `${ baseUrl }/cup/name/${ idCup }` )

  return (
    <>
      {cup && <h1>{cup[0].tipo}</h1>}
      {phases &&
        phases.map( phase => (
          <MatchForPhases key={phase.id_fase} phase={phase}/>
        ) )
      }
    </>
  )
}
export default SingleCupPublic
