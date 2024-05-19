export const helpHttp = () => {
  const customFetch = async ( endpoint, options ) => {
    const defaultHeader = { 'Content-Type': 'application/json' }

    const controller = new AbortController()
    options.signal = controller.signal

    options.method = options.method || 'GET'
    options.headers = options.headers
      ? { ...defaultHeader, ...options.headers }
      : defaultHeader

    options.body = options.body || false
    if ( !options.body ) delete options.body
    setTimeout( () => controller.abort(), 3000 )

    try {
      const response = await fetch( endpoint, options )
      const data = await response.json()

      if ( response.ok !== false ) {
        return data
      } else {
        const err = new Error( 'Error!' )
        err.status = response.status || '00'
        err.statusText = response.statusText || response.mesagge || 'Ocurrió un error'
        if ( data && Array.isArray( data.message ) && data.message.length > 0 ) {
          err.message = data.message[0].message
        } else {
          err.message = data.message
        }
        throw err
      }
    } catch ( err ) {
      throw new Error( err )
    }
  }

  const get = ( url, options = {} ) => customFetch( url, options )

  const post = ( url, body, options = {} ) => {
    options.method = 'POST'
    options.credentials = 'include'
    options.body = JSON.stringify( body ) // Configurar el cuerpo de la solicitud directamente en options.body
    return customFetch( url, options )
  }

  const put = ( url, body, options = {} ) => {
    options.method = 'PUT'
    options.credentials = 'include'
    options.body = JSON.stringify( body )
    return customFetch( url, options )
  }

  const del = ( url, options = {} ) => {
    options.method = 'DELETE'
    options.credentials = 'include'

    return customFetch( url, options )
  }

  return {
    get,
    post,
    put,
    del
  }
}
