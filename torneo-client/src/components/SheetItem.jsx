import React from 'react'

const SheetItem = ( { sheets, type, onDelete } ) => {
  const filteredSheet = sheets.filter( ( item ) => item.tipo === type )
  const hasEnContra = filteredSheet.some( ( item ) =>
    item.jugador.includes( 'en contra' )
  )

  return (
    <ul className='ul-sheet'>
      {filteredSheet.map( ( item, index ) => (
        <li key={index} className='li-sheet'>
          <p className=''>
            <svg
              className='m-1'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2ZM12 6C11.7348 6 11.4804 6.10536 11.2929 6.29289C11.1054 6.48043 11 6.73478 11 7V12C11.0001 12.2652 11.1055 12.5195 11.293 12.707L14.293 15.707C14.4816 15.8892 14.7342 15.99 14.9964 15.9877C15.2586 15.9854 15.5094 15.8802 15.6948 15.6948C15.8802 15.5094 15.9854 15.2586 15.9877 14.9964C15.99 14.7342 15.8892 14.4816 15.707 14.293L13 11.586V7C13 6.73478 12.8946 6.48043 12.7071 6.29289C12.5196 6.10536 12.2652 6 12 6Z'
                fill='black'
              />
            </svg>
            <span className=''>
              {item.tiempo}T{item.minuto}&apos;
            </span>
          </p>
          <p>
            <svg
              className='m-1'
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M1.66667 20C1.66667 20 0 20 0 18.3333C0 16.6667 1.66667 11.6667 10 11.6667C18.3333 11.6667 20 16.6667 20 18.3333C20 20 18.3333 20 18.3333 20H1.66667ZM10 10C11.3261 10 12.5979 9.47322 13.5355 8.53553C14.4732 7.59785 15 6.32608 15 5C15 3.67392 14.4732 2.40215 13.5355 1.46447C12.5979 0.526784 11.3261 0 10 0C8.67392 0 7.40215 0.526784 6.46447 1.46447C5.52678 2.40215 5 3.67392 5 5C5 6.32608 5.52678 7.59785 6.46447 8.53553C7.40215 9.47322 8.67392 10 10 10Z'
                fill='black'
              />
            </svg>

            <span className=''>
              {' '}
              <span>
                {item.jugador.includes( 'en contra' ) ? '' : item.jugador}{' '}
              </span>
            </span>
          </p>
          <p>
            <svg
              className='m-1'
              width='17'
              height='20'
              viewBox='0 0 17 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M8.5 20C6.03854 19.4167 4.00633 18.0873 2.40338 16.012C0.800417 13.9367 -0.000707864 11.6327 4.69302e-07 9.1V3L8.5 0L17 3V9.1C17 11.6333 16.1989 13.9377 14.5966 16.013C12.9944 18.0883 10.9622 19.4173 8.5 20Z'
                fill='black'
              />
            </svg>
            <span>{item.equipo} </span>
          </p>
          {onDelete && (
            <button
              className='delete mr-10'
              onClick={() => {
                onDelete( item.id_ficha )
              }}
            >
              <svg
                width='16'
                height='18'
                viewBox='0 0 16 18'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M3 18C2.45 18 1.97933 17.8043 1.588 17.413C1.19667 17.0217 1.00067 16.5507 1 16V3H0V1H5V0H11V1H16V3H15V16C15 16.55 14.8043 17.021 14.413 17.413C14.0217 17.805 13.5507 18.0007 13 18H3ZM5 14H7V5H5V14ZM9 14H11V5H9V14Z'
                  fill='#4D4D4D'
                />
              </svg>
            </button>
          )}
        </li>
      ) )}
    </ul>
  )
}

export default SheetItem
