import jwt from 'jsonwebtoken'
export const verifyToken = ( req, res, next ) => {
  // console.log( req.cookies )
  const token = req.cookies.access_token
  if ( !token ) {
    return res.status( 404 ).json( { message: 'No autorizado, no existe token. Pruebe iniciando sesión de nuevo.' } )
  }
  jwt.verify( token, process.env.JWT_SECRET, ( err, user ) => {
    if ( err ) {
      return res.status( 404 ).json( { message: 'no autorizado' } )
    }
    req.user = user
    return next()
  } )
}
