import { useContext, lazy, Suspense } from 'react'
// import Home from '../Pages/Home'
import Tournament from '../Pages/Tournament'
// import MatchSheet from '../Pages/MatchSheet'
// import Login from '../Pages/Login'
import { Route, Routes, Navigate } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'
import { AuthContext } from '../context/Auth'
import { checkCookie } from '../helpers/checkCookie'
import TeamsAdmin from '../Pages/TeamsAdmin'
import { Loader } from '../components/Loader'
import { Prueba } from '../Pages/prueba'
const HomeLazy = lazy( () => import( '../Pages/Home' ) )
const LoginLazy = lazy( () => import( '../Pages/Login' ) )
const MatchSheetLazy = lazy( () => import( '../Pages/MatchSheet' ) )
const PlayersStaticsLazy = lazy( () => import( '../Pages/PlayersStatics' ) )
const TeamsLazy = lazy( () => import( '../Pages/Teams' ) )
const CardsLazy = lazy( () => import( '../Pages/Cards' ) )
const PositionsLazy = lazy( () => import( '../Pages/Positions' ) )
const FixtureLazy = lazy( () => import( '../Pages/Fixture' ) )
const CupsPublicLazy = lazy( () => import( '../Pages/CupsPublic' ) )
const CupPublicLazy = lazy( () => import( '../Pages/SingleCupPublic' ) )
const ScorersLazy = lazy( () => import( '../Pages/Scorers' ) )
const CategoriesLazy = lazy( () => import( '../Pages/Categories' ) )
const ZonesLazy = lazy( () => import( '../Pages/Zones' ) )
const ZoneLazy = lazy( () => import( '../Pages/Zone' ) )
const TeamsByZonesLazy = lazy( () => import( '../Pages/TeamsByZone' ) )
const TeamsAdminLazy = lazy( () => import( '../Pages/TeamsAdmin' ) )
const TeamsEditLazy = lazy( () => import( '../components/TeamEdit' ) )
const PlayersInfoLazy = lazy( () => import( '../Pages/PlayersInfo' ) )
const MatchLazy = lazy( () => import( '../Pages/Match' ) )
const SheetLazy = lazy( () => import( '../Pages/Sheet' ) )
const CupsAdminLazy = lazy( () => import( '../Pages/Cups' ) )
const PhasesLazy = lazy( () => import( '../Pages/Phases' ) )
const PhasesMatchLazy = lazy( () => import( '../Pages/MatchCup' ) )
const DashboardLazy = lazy( () => import( '../Pages/DashBoardAdmin' ) )
const UserLazy = lazy( () => import( '../Pages/User' ) )
// import { Suspense } from 'react'

export const AppRouter = () => {
  const { logged } = useContext( AuthContext )

  return (
    <Suspense fallback={<Loader />}>

      <Routes>
        <Route path='/' element={<HomeLazy />} />

        {logged && checkCookie( 'access_token' ) && (
          <Route path='/login' element={<Navigate to='/dashboard/admin' />} />
        )}
        <Route path='/login' element={<LoginLazy />} />
        <Route path='/latercera' element={<Tournament idTournamentProp={1} />} />
        <Route path='/:nombreTorneo' element={<Tournament />} />
        <Route path='/teams/:idCategory' element={<TeamsLazy />} />
        <Route path='/players/:idTeam' element={<PlayersStaticsLazy />} />
        <Route path='/cards/:idCategory' element={<CardsLazy />} />
        <Route path='/scorers/:idCategory' element={<ScorersLazy />} />
        <Route path='/positions/:idCategory' element={<PositionsLazy />} />
        <Route path='/fixture/:idCategory' element={<FixtureLazy />} />
        <Route path='/fixture/sheet/:idMatch' element={<MatchSheetLazy />} />
        <Route path='/cups/:idCategory' element={<CupsPublicLazy />} />
        <Route path='/cup/:idCup' element={<CupPublicLazy />} />

        <Route
          path='/*'
          element={
            <PrivateRoute>
              <Routes>
                {logged && !checkCookie( 'access_token' ) && (
                  <Route
                    path='/dashboard/admin'
                    element={<Navigate to='/login' />}
                  />
                )}
                <Route path='/dashboard/admin' element={<DashboardLazy />} />
                <Route path='/categories/admin' element={<CategoriesLazy />} />
                <Route path='/zone/admin' element={<ZoneLazy />} />
                <Route path='/zones/admin' element={<ZonesLazy />} />
                <Route
                  path='/teams/zone/admin'
                  element={<TeamsByZonesLazy />}
                />
                <Route path='/equipos/admin' element={<TeamsAdmin />} />
                <Route path='/team/edit/:idTeam' element={<TeamsEditLazy />} />
                <Route
                  path='/players/info/admin'
                  element={<PlayersInfoLazy />}
                />
                <Route path='/partidos/admin' element={<MatchLazy />} />
                <Route path='/sheet/:idMatch' element={<SheetLazy />} />
                <Route path='/cups/admin/info' element={<CupsAdminLazy />} />
                <Route path='/phases/admin' element={<PhasesLazy />} />
                <Route
                  path='/phases/match/admin'
                  element={<PhasesMatchLazy />}
                />
                <Route path='/user/admin' element={<UserLazy />} />
              </Routes>
            </PrivateRoute>
          }
        />
      </Routes>
    </Suspense>
  )
}
