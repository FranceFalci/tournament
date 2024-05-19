// import MenuItem from '@mui/material/MenuItem'

import { lazy } from 'react'

// import Select from '@mui/material/Select'
const MenuItemLazy = lazy( () => import( '@mui/material/MenuItem' ) )
const SelectLazy = lazy( () => import( '@mui/material/Select' ) )
export const SelectCategory = ( {
  items,
  selectedOption,
  handleChange,
  defaultText = 'Selecciona...'
} ) => {
  return (
    <SelectLazy
      value={selectedOption}
      onChange={handleChange}
      className='select'
      displayEmpty
      inputProps={{ 'aria-label': 'Without label' }}
    >
      <MenuItemLazy value=''>{defaultText}</MenuItemLazy>
      {items &&
        items.map( ( item ) => (
          <MenuItemLazy key={item.id_categoria} value={item.id_categoria}>
            {item.nombre}
          </MenuItemLazy>
        ) )}
    </SelectLazy>
  )
}
