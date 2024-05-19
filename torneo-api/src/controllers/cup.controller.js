import { validateCup, validatePartialCup } from '../schemas/cup.schema.js'

export class CupController {
  constructor ( { cupModel } ) {
    this.cupModel = cupModel
  }

  getAllByCategory = async ( req, res ) => {
    const { idCategory } = req.params
    try {
      const cups = await this.cupModel.getAllByCategory( { idCategory } )
      if ( cups ) return res.json( cups )
    } catch ( error ) {
      res.status( 404 ).json( { message: error.message, ok: false } )
    }
  }

  getNameByCup = async ( req, res ) => {
    const { idCup } = req.params
    try {
      const cup = await this.cupModel.getNameByCup( { idCup } )
      if ( cup ) return res.json( cup )
    } catch ( error ) {
      res.status( 404 ).json( { message: error.message, ok: false } )
    }
  }

  create = async ( req, res ) => {
    const result = validateCup( req.body )

    if ( !result.success ) {
      return res.status( 422 ).json( { message: JSON.parse( result.error.message ), ok: false } )
    }
    const { idCategory } = req.params
    const input = {
      ...result.data,
      idCategory
    }
    try {
      const newCup = await this.cupModel.create( { input } )
      res.status( 201 ).json( newCup )
    } catch ( error ) {
      return res.status( 400 ).json( { message: error.message } )
    }
  }

  update = async ( req, res ) => {
    const result = validatePartialCup( req.body )

    if ( !result.success ) {
      return res.status( 400 ).json( { message: JSON.parse( result.error.message ), ok: false } )
    }

    const { idCup } = req.params
    try {
      const updatedCup = await this.cupModel.update( { idCup, input: result.data } )
      return res.json( updatedCup )
    } catch ( error ) {
      return res.status( 400 ).json( { message: error.message, ok: false } )
    }
  }

  delete = async ( req, res ) => {
    const { idCup } = req.params
    try {
      const result = await this.cupModel.delete( { idCup } )

      if ( result === false ) {
        return res.status( 404 ).json( { message: 'Cup not found', ok: false } )
      }
      return res.json( { message: 'Cup deleted' } )
    } catch ( error ) {
      return res.status( 404 ).json( { message: 'Cup not deleted', ok: false } )
    }
  }
}
