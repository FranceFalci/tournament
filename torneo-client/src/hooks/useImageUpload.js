import { useState } from 'react'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { FirebaseApp } from '../firebase.js'

const useImageUpload = () => {
  const [imageUrl, setImageUrl] = useState( null )
  const [progress, setProgress] = useState( null )
  const [error, setError] = useState( null )
  const [loading, setLoading] = useState( false )

  const uploadImage = async ( imageFile ) => {
    if ( !imageFile ) return
    try {
      const storage = getStorage( FirebaseApp )
      const fileName = new Date().getTime() + imageFile.name
      const storageRef = ref( storage, fileName )
      const uploadTask = uploadBytesResumable( storageRef, imageFile )

      uploadTask.on(
        'state_changed',
        ( snapshot ) => {
          setLoading( true )

          const progress = ( snapshot.bytesTransferred / snapshot.totalBytes ) * 100
          setProgress( progress.toFixed( 0 ) )
        },
        ( error ) => {
          console.log( error )

          // setError( 'Could not upload image (file must be less than 2MB)' )
        },
        () => {
          getDownloadURL( uploadTask.snapshot.ref ).then( ( downloadURL ) => {
            setImageUrl( downloadURL )
            setLoading( false )

            setProgress( null )
            setError( null )
          } )
        }
      )
    } catch ( error ) {
      setLoading( false )

      setError( error.message )
    }
  }

  return { progress, error, uploadImage, loading, setImageUrl, imageUrl }
}

export default useImageUpload
