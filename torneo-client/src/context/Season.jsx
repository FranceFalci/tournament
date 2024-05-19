import React, { createContext, useEffect, useState } from 'react'

export const SeasonContext = createContext()

export const SeasonProvider = ( { children } ) => {
  const [season, setSeason] = useState( null )

  const saveSeasonToLocalStorage = ( seasonData ) => {
    localStorage.setItem( 'season', JSON.stringify( seasonData ) )
  }

  const getSeasonFromLocalStorage = () => {
    const savedSeason = localStorage.getItem( 'season' )
    if ( savedSeason ) {
      setSeason( JSON.parse( savedSeason ) )
    }
  }

  useEffect( () => {
    getSeasonFromLocalStorage()
  }, [] )

  useEffect( () => {
    if ( season ) {
      saveSeasonToLocalStorage( season )
    }
  }, [season] )

  return (
    <SeasonContext.Provider
      value={{ season, setSeason, getSeasonFromLocalStorage }}
    >
      {children}
    </SeasonContext.Provider>
  )
}
