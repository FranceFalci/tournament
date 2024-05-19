import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { validatePartialUser, validateUser } from '../schemas/user.schema.js'

export class UserController {
  constructor ( { userModel } ) {
    this.userModel = userModel
  }

  create = async ( req, res ) => {
    const result = validateUser( req.body )
    if ( !result.success ) {
      return res.status( 400 ).json( { error: JSON.parse( result.error.message ) } )
    }
    try {
      const hashedPassword = bcryptjs.hashSync( result.data.password, 10 )
      const input = {
        name: result.data.name,
        password: hashedPassword
      }
      const newTournament = await this.userModel.create( { input } )
      res.status( 201 ).json( newTournament )
    } catch ( error ) {
      res.status( 404 ).json( { message: error.message, ok: false } )
    }
  }

  signIn = async ( req, res ) => {
    const { name, password } = req.body
    try {
      const validUser = await this.userModel.getByName( { name } )
      if ( !validUser ) return res.status( 400 ).json( { ok: false, message: 'Datos incorrectos!' } )

      const validPassword = bcryptjs.compareSync( password, validUser.contrasenia )
      if ( !validPassword ) return res.status( 400 ).json( { ok: false, message: 'Datos incorrectos' } )

      const token = jwt.sign( { id: validUser.id_usuario }, process.env.JWT_SECRET )
      res.status( 200 ).cookie( 'access_token', token, {
        httpOnly: false
      } ).json( { ok: true, id: validUser.id_usuario, name: validUser.name } )
    } catch ( error ) {
      res.status( 404 ).json( { ok: false, message: error.message } )
    }
  }

  delete = async ( req, res ) => {
    const { id } = req.params

    const result = await this.userModel.delete( { id } )

    if ( result === false ) {
      return res.status( 404 ).json( { ok: false, message: 'User not found' } )
    }

    return res.json( { ok: true, message: 'User deleted' } )
  }

  update = async ( req, res ) => {
    const result = validatePartialUser( req.body )

    if ( !result.success ) {
      return res.status( 400 ).json( { message: JSON.parse( result.error.message ) } )
    }
    try {
      const { id } = req.params
      const user = await this.userModel.getById( { id } )
      const validPassword = bcryptjs.compareSync( result.data.password, user.contrasenia )
      if ( !validPassword ) return res.status( 400 ).json( { message: 'Contraseña incorrecta' } )

      const newHashedPassword = bcryptjs.hashSync( result.data.newPassword, 10 )

      await this.userModel.update( { id, input: { password: newHashedPassword } } )
      return res.json( { ok: true } )
    } catch ( error ) {
      res.status( 404 ).json( { message: error.message } )
    }
  }
}
