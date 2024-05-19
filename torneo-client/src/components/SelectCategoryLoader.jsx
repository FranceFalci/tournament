import React from 'react'
import Lottie from 'react-lottie'
import animationData from '../lotties/football'
export const SelectCategoryLoader = ( { text } ) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }
  return (
    <div className='lottie'>
      <Lottie options={defaultOptions} height={250} width={250} />
      <h2 className='text-center'>{text || 'Selecciona una categoría...'}</h2>
    </div>
  )
}
