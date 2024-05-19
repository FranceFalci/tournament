import jwt from 'jsonwebtoken'
export const verifyToken = ( req, res, next ) => {
  // console.log( req.cookies )
  const token = req.cookies.access_token
  if ( !token ) {
    return res.status( 404 ).json( { message: 'no autorizado, no existe token' } )
  }
  jwt.verify( token, process.env.JWT_SECRET, ( err, user ) => {
    if ( err ) {
      return res.status( 404 ).json( { message: 'no autorizado' } )
    }
    req.user = user
    return next()
  } )
}
