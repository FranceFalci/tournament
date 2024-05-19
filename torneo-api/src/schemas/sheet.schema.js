import z from 'zod'

const matchSchema = z.object( {
  idPlayer: z.number().int().gte( 0 ).or( z.string().regex( /^[0-9]+$/ ) ),
  time: z.number().int().gt( 0 ).lte( 2 ).optional().or( z.string().regex( /^[0-9]*$/ ) ),
  minute: z.number().int().gte( 0 ).optional().or( z.string().regex( /^[0-9]*$/ ) ),
  type: z.number().int().gte( 0 ).lte( 2 ).or( z.string().regex( /^[0-9]*$/ ) )
} )

export function validateSheet ( input ) {
  return matchSchema.safeParse( input )
}

export function validatePartialSheet ( input ) {
  return matchSchema.partial().safeParse( input )
}
