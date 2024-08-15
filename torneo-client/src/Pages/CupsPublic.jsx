import React from 'react'
import { useFetch } from '../hooks/useFetch'
import { Link, useParams } from 'react-router-dom'
import { Loader } from '../components/Loader'
import { NoCup } from '../components/NoCup'
import { baseUrl } from '../helpers/baseUrlApi'

const CupsPublic = () => {
  const { idCategory } = useParams()
  const { data: cups, loading } = useFetch(
    `${ baseUrl }/cup/${ idCategory }`
  )
  return (
    <div className='d-flex container-home'>
      {loading
        ? (
          <Loader />
        )
        : (
          <>
            {cups && cups.length > 0
              ? (
                <div className='options'>
                  {cups.map( ( cup ) => (
                    <Link
                      to={`/cup/${ cup.id_copa }`}
                      className='link'
                      key={cup.id_copa}
                    >
                      <button type='button' className='button'>
                        {cup.tipo}
                      </button>
                    </Link>
                  ) )}
                </div>
              )
              : (
                <NoCup />
              )}
          </>
        )}
    </div>
  )
}
export default CupsPublic
