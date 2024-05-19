import React from 'react'
import '../css/Modal.css'

export const Modal = ( { children, isOpen, closeModal } ) => {
  const handleModalContainerClick = ( e ) => e.stopPropagation()

  return (
    <div className='modal'>
      <article
        className={`modalCss ${ isOpen && 'is-open' }`}
        onClick={closeModal}
      >
        <div className='modal-container' onClick={handleModalContainerClick}>
          {/* <button className='modal-close' onClick={closeModal}>
            X
          </button> */}
          <svg
            className='modal-close'
            onClick={closeModal}
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M14.9938 12L23.3736 3.62021C23.7713 3.22321 23.995 2.68448 23.9955 2.12254C23.996 1.5606 23.7732 1.02148 23.3762 0.623777C22.9792 0.226074 22.4405 0.00236781 21.8786 0.00187155C21.3166 0.00137528 20.7775 0.224129 20.3798 0.62113L12 9.00092L3.62021 0.62113C3.22251 0.223427 2.68311 0 2.12067 0C1.55823 0 1.01883 0.223427 0.62113 0.62113C0.223427 1.01883 0 1.55823 0 2.12067C0 2.68311 0.223427 3.22251 0.62113 3.62021L9.00092 12L0.62113 20.3798C0.223427 20.7775 0 21.3169 0 21.8793C0 22.4418 0.223427 22.9812 0.62113 23.3789C1.01883 23.7766 1.55823 24 2.12067 24C2.68311 24 3.22251 23.7766 3.62021 23.3789L12 14.9991L20.3798 23.3789C20.7775 23.7766 21.3169 24 21.8793 24C22.4418 24 22.9812 23.7766 23.3789 23.3789C23.7766 22.9812 24 22.4418 24 21.8793C24 21.3169 23.7766 20.7775 23.3789 20.3798L14.9938 12Z'
              fill='#888'
            />
          </svg>
          {children}
        </div>
      </article>
    </div>
  )
}
