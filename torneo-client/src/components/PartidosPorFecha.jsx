// import MenuItem from '@mui/material/MenuItem'
// import Select from '@mui/material/Select'
import { Match } from './Match'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { lazy } from 'react'
const MenuItemLazy = lazy( () => import( '@mui/material/MenuItem' ) )
const SelectLazy = lazy( () => import( '@mui/material/Select' ) )
export const PartidosPorFecha = ( { partidos } ) => {
  const [selectedOption, setSelectedOption] = useLocalStorage( 'dateSelectedOption', '' )
  const partidosPorFecha = partidos.reduce( ( acc, partido ) => {
    const { num_fecha: numFecha } = partido
    if ( !acc[numFecha] ) {
      acc[numFecha] = []
    }
    acc[numFecha].push( partido )
    return acc
  }, {} )
  return (
    <>
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

      {selectedOption
        ? (
          <article key={selectedOption} className='article-fixture'>
            <h2 className='mb-20'>FECHA {selectedOption}</h2>
            {partidosPorFecha[selectedOption].map( ( partido ) => (
              <Match match={partido} key={partido.id_partido} />
            ) )}
          </article>
        )
        : (
          <>
            {Object.keys( partidosPorFecha ).map( ( numFecha ) => (
              <article key={numFecha} className='article-fixture'>
                <h2 className='mb-20'>FECHA {numFecha}</h2>

                {partidosPorFecha[numFecha].map( ( partido ) => (
                  <Match match={partido} key={partido.id_partido} />
                ) )}
              </article>
            ) )}
          </>
        )}
    </>
  )
}
