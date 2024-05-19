import { validateCategory, validatePartialCategory } from '../schemas/category.schema.js'

export class CategoryController {
  constructor ( { categoryModel } ) {
    this.categoryModel = categoryModel
  }

  getAllBySeason = async ( req, res ) => {
    const { id } = req.params
    try {
      const categories = await this.categoryModel.getAllBySeason( { idTemporada: id } )
      if ( categories ) return res.json( categories )
    } catch ( error ) {
      res.status( 404 ).json( { ok: false, message: error.message } )
    }
  }

  getByIdPhase = async ( req, res ) => {
    const { idPhase } = req.params
    try {
      const categorie = await this.categoryModel.getByIdPhase( { idPhase } )
      if ( categorie ) return res.json( categorie )
    } catch ( error ) {
      res.status( 404 ).json( { ok: false, message: error.message } )
    }
  }

  create = async ( req, res ) => {
    const result = validateCategory( req.body )

    if ( !result.success ) {
      return res.status( 422 ).json( { ok: false, message: JSON.parse( result.error.message ) } )
    }
    const { idSeason } = req.params
    const input = {
      ...result.data,
      idSeason
    }
    try {
      const newCategory = await this.categoryModel.create( { input } )
      res.status( 201 ).json( { res: true, newCategory } )
    } catch ( error ) {
      return res.status( 400 ).json( { ok: false, message: error.message } )
    }
  }

  update = async ( req, res ) => {
    const result = validatePartialCategory( req.body )

    if ( !result.success ) {
      return res.status( 400 ).json( { ok: false, message: JSON.parse( result.error.message ) } )
    }

    const { id } = req.params
    try {
      const updatedCategory = await this.categoryModel.update( { id, input: result.data } )
      return res.json( { updatedCategory, ok: true } )
    } catch ( error ) {
      return res.status( 400 ).json( { ok: false, message: error.message } )
    }
  }

  delete = async ( req, res ) => {
    const { id } = req.params
    try {
      const result = await this.categoryModel.delete( { id } )

      if ( result === false ) {
        return res.status( 404 ).json( { message: 'Category not found' } )
      }
      return res.json( { message: 'Category deleted' } )
    } catch ( error ) {
      return res.status( 404 ).json( { message: 'Category not deleted' } )
    }
  }
}
