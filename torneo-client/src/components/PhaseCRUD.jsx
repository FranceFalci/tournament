/* eslint-disable multiline-ternary */

import { MatchUl } from './MatchUl'

export const PhaseCrud = ( { category, partidos, onMatchAdded } ) => {
  return (
    <div>

      <MatchUl
        phase={true}
        matchs={partidos}
        category={category}
        onMatchAdded={onMatchAdded}
      />

    </div>
  )
}
