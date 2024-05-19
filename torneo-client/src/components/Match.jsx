import React from 'react'
import { Link } from 'react-router-dom'

export const Match = ( { match } ) => {
  const {
    nombre_eq_dos: nameTeamTwo,
    nombre_eq_uno: nameTeamOne,
    logo_eq_uno: photoTeamOne,
    logo_eq_dos: photoTeamTwo,
    res_uno: resultOne,
    res_dos: resultTwo,
    id_partido: idMatch
  } = match

  return (
    <div className='container-partido'>
      <div className='container-equipo'>
        <figure>
          <img className='logo-fixture' src={photoTeamOne}></img>
        </figure>
        <p>{nameTeamOne.toUpperCase()}</p>
      </div>
      <div className='container-result-sheet'>
        <div className='container-result'>
          <p>{resultOne}</p>
          <p>-</p>
          <p>{resultTwo}</p>
        </div>
        {resultOne !== null && (
          <Link to={`/fixture/sheet/${ idMatch }`} className='link'>
            <button className='btn-green-border'>
              <span>FICHA</span>
              <svg
                width='16'
                height='20'
                viewBox='0 0 7 7'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M4.59375 1.59211H5.375C5.54076 1.59211 5.69973 1.65449 5.81694 1.76553C5.93415 1.87657 6 2.02718 6 2.18421V6.0329C6 6.18994 5.93415 6.34054 5.81694 6.45158C5.69973 6.56262 5.54076 6.625 5.375 6.625H1.625C1.45924 6.625 1.30027 6.56262 1.18306 6.45158C1.06585 6.34054 1 6.18994 1 6.0329V2.18421C1 2.02718 1.06585 1.87657 1.18306 1.76553C1.30027 1.65449 1.45924 1.59211 1.625 1.59211H2.40625'
                  stroke='white'
                  strokeWidth='0.4'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M2.44406 1.44852C2.47786 1.32042 2.55588 1.20671 2.66573 1.12544C2.77557 1.04417 2.91094 1.00002 3.05031 1H3.94937C4.08875 1.00002 4.22411 1.04417 4.33396 1.12544C4.44381 1.20671 4.52183 1.32042 4.55563 1.44852L4.75 2.18421H2.25L2.44406 1.44852Z'
                  stroke='white'
                  strokeWidth='0.4'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M2.5625 3.96053H4.4375M2.5625 5.14474H4.4375'
                  stroke='white'
                  strokeWidth='0.4'
                  strokeLinecap='round'
                />
              </svg>
            </button>
          </Link>
        )}
      </div>
      <div className='container-equipo'>
        <figure>
          <img className='logo-fixture' src={photoTeamTwo}></img>
        </figure>

        <p>{nameTeamTwo.toUpperCase()}</p>
      </div>
    </div>
  )
}
