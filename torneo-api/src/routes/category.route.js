import { Router } from 'express'
import { CategoryController } from '../controllers/category.controller.js'
import { CategoryModel } from '../models/category.model.js'
import { verifyToken } from '../middleware/verifyToken.js'

export const categoryRouter = Router()

const categoryController = new CategoryController( { categoryModel: CategoryModel } )

categoryRouter.get( '/:id', categoryController.getAllBySeason )
categoryRouter.get( '/phase/:idPhase', categoryController.getByIdPhase )

categoryRouter.use( verifyToken )
categoryRouter.post( '/:idSeason', categoryController.create )

categoryRouter.put( '/:id', categoryController.update )

categoryRouter.delete( '/:id', categoryController.delete )
