import { useState } from 'react'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { FirebaseApp } from '../firebase.js'

const useImageUploadEdited = () => {
  const [imageUrlEdited, setImageUrlEdited] = useState( null )
  const [progress, setProgress] = useState( null )
  const [error, setError] = useState( null )
  const [loading, setLoading] = useState( false )

  const uploadImageEdited = async ( imageFile ) => {
    if ( !imageFile ) return
    setLoading( true )
    try {
      const storage = getStorage( FirebaseApp )
      const fileName = new Date().getTime() + imageFile.name
      const storageRef = ref( storage, fileName )
      const uploadTask = uploadBytesResumable( storageRef, imageFile )

      uploadTask.on(
        'state_changed',
        ( snapshot ) => {
          const progress = ( snapshot.bytesTransferred / snapshot.totalBytes ) * 100
          setProgress( progress.toFixed( 0 ) )
        },
        ( error ) => {
          console.log( error )
          setError( 'Could not upload image (file must be less than 2MB)' )
        },
        () => {
          getDownloadURL( uploadTask.snapshot.ref ).then( ( downloadURL ) => {
            setImageUrlEdited( downloadURL )
            setProgress( null )
            setError( null )
          } )
        }
      )
    } catch ( error ) {
      setError( error.message )
    } finally {
      setLoading( false )
    }
  }

  return { progress, error, uploadImageEdited, loading, setImageUrlEdited, imageUrlEdited }
}

export default useImageUploadEdited
