import { Router } from 'express'
import { CupController } from '../controllers/cup.controller.js'
import { CupModel } from '../models/cup.model.js'
import { verifyToken } from '../middleware/verifyToken.js'

export const cupRouter = Router()

const cupController = new CupController( { cupModel: CupModel } )

cupRouter.get( '/:idCategory', cupController.getAllByCategory )
cupRouter.get( '/name/:idCup', cupController.getNameByCup )

cupRouter.use( verifyToken )
cupRouter.post( '/:idCategory', cupController.create )

cupRouter.put( '/:idCup', cupController.update )

cupRouter.delete( '/:idCup', cupController.delete )
