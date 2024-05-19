import z from 'zod'

const cupSchema = z.object( {
  order: z.number().int().gte( 0 ).or( z.string().regex( /^[0-9]+$/ ) ),
  type: z.string().toUpperCase()
} )

export function validateCup ( input ) {
  return cupSchema.safeParse( input )
}

export function validatePartialCup ( input ) {
  return cupSchema.partial().safeParse( input )
}
