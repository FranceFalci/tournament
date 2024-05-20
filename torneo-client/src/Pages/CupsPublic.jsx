import React from 'react'
import { useFetch } from '../hooks/useFetch'
import { Link, useParams } from 'react-router-dom'
import { Loader } from '../components/Loader'
import { NoCup } from '../components/NoCup'

const CupsPublic = () => {
  const { idCategory } = useParams()
  const { data: cups, loading } = useFetch(
    `/api/cup/${ idCategory }`
  )
  return (
    <div className='d-flex container-home'>
      {loading
        ? (
          <Loader />
        )
        : (
          <>
            {( cups && cups.length > 0 )
              ? (
                <div className='options'>

                  {cups.map( ( cup ) => (
                    <button type='button' className='button' key={cup.id_copa}>
                      <Link to={`/cup/${ cup.id_copa }`} className='link'>
                        {cup.tipo}
                      </Link>
                    </button>
                  ) )}
                </div>
              )
              : (
                <NoCup />
              ) }

          </>
        )}
    </div>
  )
}
export default CupsPublic
