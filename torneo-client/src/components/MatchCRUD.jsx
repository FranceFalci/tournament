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
