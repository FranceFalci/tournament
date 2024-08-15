import React from 'react'
import { useFetch } from '../hooks/useFetch'
import { Match } from './Match'
import { baseUrl } from '../helpers/baseUrlApi'

export const MatchForPhases = ( { phase } ) => {
  const { data: matchs } = useFetch(
    `${ baseUrl }/match/phase/${ phase.id_fase }`
  )

  return (
    <div className=' container-fixture-cup'>
      <h2 className='text-center'>{phase.nombre}</h2>
      {matchs &&
        matchs.length > 0 &&
        matchs.map( ( match ) => <Match match={match} key={match.id_partido} /> )}
    </div>
  )
}
