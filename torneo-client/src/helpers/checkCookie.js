export function checkCookie ( cookieName ) {
  const cookies = document.cookie.split( ';' )

  for ( let i = 0; i < cookies.length; i++ ) {
    const cookie = cookies[i].trim()
    if ( cookie.indexOf( cookieName + '=' ) === 0 ) {
      return true
    }
  }
  return false
}
