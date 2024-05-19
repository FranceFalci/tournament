import express from 'express'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { tournamentRouter } from './src/routes/torunament.route.js'
import { seasonRouter } from './src/routes/season.route.js'
import { zoneRouter } from './src/routes/zone.route.js'
import { categoryRouter } from './src/routes/category.route.js'
import { teamRouter } from './src/routes/team.route.js'
import { playerRouter } from './src/routes/player.route.js'
import { matchRouter } from './src/routes/match.route.js'
import { sheetRouter } from './src/routes/sheet.route .js'
import { cupRouter } from './src/routes/cup.route.js'
import { phaseRouter } from './src/routes/phase.route.js'
import { userRouter } from './src/routes/user.route.js'

const allowedOrigins = ['http://localhost:5173', 'https://xp98dj70-5173.brs.devtunnels.ms']

const corsOptions = {
  origin: function ( origin, callback ) {
    if ( allowedOrigins.indexOf( origin ) !== -1 || !origin ) {
      callback( null, true )
    } else {
      callback( new Error( 'Not allowed by CORS' ) )
    }
  },
  credentials: true
}
const app = express()
app.use( cookieParser() )
app.use( express.json() )
app.use( cors( corsOptions ) )

app.use( '/api/user/', userRouter )
app.use( '/api/tournament/', tournamentRouter )
app.use( '/api/season/', seasonRouter )
app.use( '/api/category/', categoryRouter )
app.use( '/api/zone/', zoneRouter )
app.use( '/api/team/', teamRouter )
app.use( '/api/player/', playerRouter )
app.use( '/api/match/', matchRouter )
app.use( '/api/sheet/', sheetRouter )
app.use( '/api/cup/', cupRouter )
app.use( '/api/phase/', phaseRouter )

app.listen( 3002, ( req, res ) => {
  console.log( 'servidor conrriendo en el puerto', 3002 )
} )
