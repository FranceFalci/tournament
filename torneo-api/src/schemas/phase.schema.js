import z from 'zod'

const phaseSchema = z.object( {
  order: z.number().int().gte( 0 ),
  name: z.string().toUpperCase()
} )

export function validatePhase ( input ) {
  return phaseSchema.safeParse( input )
}

export function validatePartialPhase ( input ) {
  return phaseSchema.partial().safeParse( input )
}
