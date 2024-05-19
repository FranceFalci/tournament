import { useContext, lazy } from 'react'
// import Home from '../Pages/Home'
import Tournament from '../Pages/Tournament'
// import MatchSheet from '../Pages/MatchSheet'
// import Login from '../Pages/Login'
import { Route, Routes, Navigate } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'
import { AuthContext } from '../context/Auth'
import { checkCookie } from '../helpers/checkCookie'
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

export const AppRouter = () => {
  const { logged } = useContext( AuthContext )

  return (
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
      <Route path='/cups/:isdCategory' element={<CupsPublicLazy />} />
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
              <Route path='/zones/:idSeason' element={<ZonesLazy />} />
              <Route path='/zone/:idCategory' element={<ZoneLazy />} />
              <Route
                path='/teams/zone/:idZone'
                element={<TeamsByZonesLazy />}
              />
              <Route path='/teams/adm/:idSeason' element={<TeamsAdminLazy />} />
              <Route path='/team/edit/:idTeam' element={<TeamsEditLazy />} />
              <Route
                path='/players/info/:idTeam'
                element={<PlayersInfoLazy />}
              />
              <Route path='/match/:idSeason' element={<MatchLazy />} />
              <Route path='/sheet/:idMatch' element={<SheetLazy />} />
              <Route path='/cups/admin/:idSeason' element={<CupsAdminLazy />} />
              <Route path='/phases/:idCup' element={<PhasesLazy />} />
              <Route
                path='/phases/match/:idPhase'
                element={<PhasesMatchLazy />}
              />
              <Route path='/user/admin' element={<UserLazy />} />
            </Routes>
          </PrivateRoute>
        }
      />
    </Routes>
  )
}
