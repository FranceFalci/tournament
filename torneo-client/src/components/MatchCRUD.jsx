/* eslint-disable multiline-ternary */

// import MenuItem from '@mui/material/MenuItem'
// import Select from '@mui/material/Select'
import { lazy } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { MatchUl } from './MatchUl'
const MenuItemLazy = lazy( () => import( '@mui/material/MenuItem' ) )
const SelectLazy = lazy( () => import( '@mui/material/Select' ) )

export const MatchCrud = ( { category, partidos, onMatchAdded } ) => {
  const [selectedOption, setSelectedOption] =
    useLocalStorage( 'dateSelectedOption', '' )

  const partidosPorFecha = partidos.reduce( ( acc, partido ) => {
    const { num_fecha: numFecha } = partido
    if ( !acc[numFecha] ) {
      acc[numFecha] = []
    }
    acc[numFecha].push( partido )
    return acc
  }, {} )

  return (
    <div>
      <SelectLazy
        className='select'
        onChange={( e ) => {
          setSelectedOption( e.target.value )
        }}
        value={selectedOption}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
      >
        <MenuItemLazy value=''>Todas las fechas</MenuItemLazy>
        {Object.keys( partidosPorFecha ).map( ( numFecha ) => (
          <MenuItemLazy key={numFecha} value={numFecha}>
            {numFecha}
          </MenuItemLazy>
        ) )}
      </SelectLazy>

      {selectedOption ? (
        <div key={selectedOption}>
          <h2 className='text-center'>FECHA {selectedOption}</h2>
          <MatchUl
            matchs={partidosPorFecha[selectedOption]}
            category={category}
            onMatchAdded={onMatchAdded}
          />
        </div>
      ) : (
        <>
          {Object.keys( partidosPorFecha ).map( ( numFecha ) => (
            <div key={numFecha}>
              <h2 className='text-center'>FECHA {numFecha}</h2>
              <MatchUl
                matchs={partidosPorFecha[numFecha]}
                category={category}
                onMatchAdded={onMatchAdded}
              />
            </div>
          ) )}
        </>
      )}
    </div>
  )
}

//  <ul>
//    {partidosPorFecha[numFecha].map((match) => (
//      <li key={match.id_partido}>
//        {/* <Match match={match} /> */}
//        <div className="cont-team-match">
//          <p className="min-w">{match.nombre_eq_uno}</p>
//          <div className="result-match">
//            <p>{match.res_uno ? <span>({match.res_uno})</span> : " "}</p>
//            <p> - </p>
//            <p>{match.res_uno ? <span>({match.res_uno})</span> : " "}</p>
//          </div>
//          <p>{match.nombre_eq_dos}</p>
//        </div>
//        <div className="cont-btn-crud">
//          <button
//            className="edit"
//            onClick={() => {
//              setIdTeamOne(match.id_eq_uno);
//              setIdTeamTwo(match.id_eq_dos);
//              setResultOne(match.res_uno === null ? " " : match.res_uno);
//              setResultTwo(match.res_dos === null ? " " : match.res_dos);
//              setNumDate(match.num_fecha);
//              setEditedMatchId(match.id_partido);

//              openModal();
//            }}
//          >
//            <svg
//              width="18"
//              height="18"
//              viewBox="0 0 18 18"
//              fill="none"
//              xmlns="http://www.w3.org/2000/svg"
//            >
//              <path
//                d="M0 18V13.75L13.2 0.575C13.4 0.391667 13.621 0.25 13.863 0.15C14.105 0.0500001 14.359 0 14.625 0C14.891 0 15.1493 0.0500001 15.4 0.15C15.6507 0.25 15.8673 0.4 16.05 0.6L17.425 2C17.625 2.18333 17.771 2.4 17.863 2.65C17.955 2.9 18.0007 3.15 18 3.4C18 3.66667 17.9543 3.921 17.863 4.163C17.7717 4.405 17.6257 4.62567 17.425 4.825L4.25 18H0ZM14.6 4.8L16 3.4L14.6 2L13.2 3.4L14.6 4.8Z"
//                fill="#4D4D4D"
//              />
//            </svg>
//          </button>
//          <button
//            className="delete"
//            onClick={() => {
//              onDelete(match.id_partido);
//            }}
//          >
//            <svg
//              width="16"
//              height="18"
//              viewBox="0 0 16 18"
//              fill="none"
//              xmlns="http://www.w3.org/2000/svg"
//            >
//              <path
//                d="M3 18C2.45 18 1.97933 17.8043 1.588 17.413C1.19667 17.0217 1.00067 16.5507 1 16V3H0V1H5V0H11V1H16V3H15V16C15 16.55 14.8043 17.021 14.413 17.413C14.0217 17.805 13.5507 18.0007 13 18H3ZM5 14H7V5H5V14ZM9 14H11V5H9V14Z"
//                fill="#4D4D4D"
//              />
//            </svg>{" "}
//          </button>
//          <button type="button" className="sheet-icon">
//            <Link to={`/sheet/${match.id_partido}`} className=" text-white">
//              <svg
//                width="20"
//                height="26"
//                viewBox="0 0 7 7"
//                fill="none"
//                xmlns="http://www.w3.org/2000/svg"
//              >
//                <path
//                  d="M4.59375 1.59211H5.375C5.54076 1.59211 5.69973 1.65449 5.81694 1.76553C5.93415 1.87657 6 2.02718 6 2.18421V6.0329C6 6.18994 5.93415 6.34054 5.81694 6.45158C5.69973 6.56262 5.54076 6.625 5.375 6.625H1.625C1.45924 6.625 1.30027 6.56262 1.18306 6.45158C1.06585 6.34054 1 6.18994 1 6.0329V2.18421C1 2.02718 1.06585 1.87657 1.18306 1.76553C1.30027 1.65449 1.45924 1.59211 1.625 1.59211H2.40625"
//                  stroke="#4D4D4D"
//                  strokeWidth="0.6"
//                  strokeLinecap="round"
//                  strokeLinejoin="round"
//                ></path>
//                <path
//                  d="M2.44406 1.44852C2.47786 1.32042 2.55588 1.20671 2.66573 1.12544C2.77557 1.04417 2.91094 1.00002 3.05031 1H3.94937C4.08875 1.00002 4.22411 1.04417 4.33396 1.12544C4.44381 1.20671 4.52183 1.32042 4.55563 1.44852L4.75 2.18421H2.25L2.44406 1.44852Z"
//                  stroke="#4D4D4D"
//                  strokeWidth="0.6"
//                  strokeLinecap="round"
//                  strokeLinejoin="round"
//                ></path>
//                <path
//                  d="M2.5625 3.96053H4.4375M2.5625 5.14474H4.4375"
//                  stroke="#4D4D4D"
//                  strokeWidth="0.6"
//                  strokeLinecap="round"
//                ></path>
//              </svg>
//            </Link>
//          </button>
//        </div>
// eslint-disable-next-line no-lone-blocks
{ /* <button
                          className='edit'
                          onClick={() => {
                            setIdTeamOne( match.id_eq_uno )
                            setIdTeamTwo( match.id_eq_dos )
                            setResultOne(
                              match.res_uno === null ? '' : match.res_uno
                            )
                            setResultTwo(
                              match.res_dos === null ? '' : match.res_dos
                            )
                            setNumDate( match.num_fecha )
                            setEditedMatchId( match.id_partido )

                            openModal()
                          }}
                        >
                          editar
                        </button>
                        <button type='button' className='sheet-'>
                          <Link
                            to={`/sheet/${ match.id_partido }`}
                            className='d-block text-decoration-none text-white'
                          >
                            Ficha
                          </Link>
                        </button>
                        <button
                          className='btn btn-danger'
                          onClick={() => {
                            onDelete( match.id_partido )
                          }}
                        >
                          eliminar
                        </button>
                        <Modal isOpen={isOpen} closeModal={closeModal}>
                          <form
                            onSubmit={handleAddMatchSubmit}
                            className='form-modal-match'
                          >
                            <div>
                              <label htmlFor='idTeamOne'>Equipo uno *</label>
                              <Select
                                id='idTeamOne'
                                value={idTeamOne}
                                onChange={( e ) => setIdTeamOne( e.target.value )}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                defaultValue=''
                              >
                                <MenuItem value=''>Selecciona...</MenuItem>
                                {teams &&
                                  teams.map( ( team ) => (
                                    <MenuItem
                                      key={team.id_equipo}
                                      value={team.id_equipo}
                                    >
                                      {team.nombre}
                                    </MenuItem>
                                  ) )}
                              </Select>
                            </div>
                            <div>
                              <label htmlFor='resultOne'>Res uno</label>
                              <input
                                type='number'
                                id='resultOne'
                                value={resultOne}
                                className='input-number'
                                onChange={( e ) => setResultOne( e.target.value )}
                              ></input>
                            </div>
                            <div>
                              <label>Num fecha * </label>
                              <Select
                                id='numDate'
                                onChange={( e ) => setNumDate( e.target.value )}
                                value={numDate}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                defaultValue=''
                              >
                                <MenuItem value=''>Selecciona...</MenuItem>
                                {Array.from( { length: 20 }, ( _, index ) => (
                                  <MenuItem key={index + 1} value={index + 1}>
                                    {index + 1}
                                  </MenuItem>
                                ) )}
                              </Select>
                            </div>
                            <div>
                              <label htmlFor='idTeamTwo'>Equipo dos * </label>
                              <Select
                                id='idTeamTwo'
                                value={idTeamTwo}
                                onChange={( e ) => setIdTeamTwo( e.target.value )}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                defaultValue=''
                              >
                                <MenuItem value=''>Selecciona...</MenuItem>
                                {teams &&
                                  teams.map( ( team ) => (
                                    <MenuItem
                                      key={team.id_equipo}
                                      value={team.id_equipo}
                                    >
                                      {team.nombre}
                                    </MenuItem>
                                  ) )}
                              </Select>
                            </div>
                            <div>
                              <label htmlFor='resulTwo'>Res dos</label>
                              <input
                                className='input-number'
                                type='number'
                                id='resultTwo'
                                value={resultTwo}
                                onChange={( e ) => setResultTwo( e.target.value )}
                              ></input>
                            </div>

                            <button
                              type='submit'
                              onClick={() => {
                                closeModal()
                              }}
                              className='btn-input'
                            >
                              Editar
                            </button>
                          </form>
                        </Modal> */ }
// eslint-disable-next-line no-lone-blocks
{ /* </li>
   ))}
 </ul>; */ }
