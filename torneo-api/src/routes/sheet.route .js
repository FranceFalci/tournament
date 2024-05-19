import { Router } from 'express'
import { SheetController } from '../controllers/sheet.controller.js'
import { SheetModel } from '../models/sheet.model.js'
import { verifyToken } from '../middleware/verifyToken.js'

export const sheetRouter = Router()

const sheetController = new SheetController( { sheetModel: SheetModel } )

sheetRouter.get( '/:idMatch', sheetController.getAllByMatch )
sheetRouter.use( verifyToken )

sheetRouter.post( '/:idMatch', sheetController.create )

sheetRouter.put( '/:idSheet', sheetController.update )

sheetRouter.delete( '/:idSheet', sheetController.delete )
