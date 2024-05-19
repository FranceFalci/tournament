import React, { useEffect, useState } from 'react'
import { MatchForm } from '../components/MatchForm'
import { useFetch } from '../hooks/useFetch'
import { useParams } from 'react-router-dom'
import { PhaseCrud } from '../components/PhaseCRUD'

const MatchCup = () => {
  const { idPhase } = useParams()
  const { data: categorie } = useFetch(
    `api/category/phase/${ idPhase }`
  )
  // const { data: matchs, setData: setMatchs } = useFetch(
  //   `api/match/phase/${ idPhase }`
  // )
  const [matchs, setMatchs] = useState()
  const [reload, setReload] = useState()

  useEffect( () => {
    const fetchMatchs = async () => {
      try {
        const response = await fetch(
          `api/match/phase/${ idPhase }`
        )
        if ( response !== false ) {
          const data = await response.json()
          setMatchs( data )
        } else {
          const err = new Error( 'Error en la petición Fetch' )
          err.status = response.status || '00'
          err.statusText = response.statusText || 'Ocurrió un error'
          throw err
        }
      } catch ( err ) {
        // throw new Error( err )
      }
    }
    fetchMatchs()
  }, [reload] )
  return (
    <div className='container-match'>
      {categorie && (
        <>
          <MatchForm
            idPhase={idPhase}
            idCategory={categorie.id_categoria}
            onMatchAdded={( e ) => {
              setReload( !reload )
            }}
          />
          <PhaseCrud
            partidos={matchs}
            category={categorie.id_categoria}
            onMatchAdded={( e ) => {
              setReload( !reload )
            }}
          />
        </>
      )}
    </div>
  )
}

export default MatchCup
