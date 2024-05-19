import z from 'zod'

const teamSchema = z.object( {
  name: z.string( {
    invalid_type_error: 'El título del equipo debe ser una cadena',
    required_error: 'El título del equipo es obligatorio.'
  } ),
  photoUrl: z.string().url().optional().nullable().or( z.literal( '' ) )

} )

export function validateTeam ( input ) {
  return teamSchema.safeParse( input )
}

export function validatePartialTeam ( input ) {
  return teamSchema.partial().safeParse( input )
}

const teamStaticsSchema = z.object( {
  scoredGoals: z.number().positive().optional(),
  concededGoals: z.number().positive().optional(),
  wonMatches: z.number().positive().optional(),
  drawnMatches: z.number().positive().optional(),
  lostMatches: z.number().positive().optional(),
  points: z.number().positive().optional(),
  playedMatches: z.number().positive().optional()
} )

export function validateTeamStatics ( input ) {
  return teamStaticsSchema.safeParse( input )
}
