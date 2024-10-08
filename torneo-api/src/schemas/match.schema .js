import z from 'zod'

const matchSchema = z.object( {
  idTeamOne: z.string().regex( /^[0-9]+$/ ).or( z.number() ),
  idTeamTwo: z.string().regex( /^[0-9]+$/ ).or( z.number() ),
  idPhase: z.string().regex( /^[0-9]+$/ ).or( z.number() ).optional().nullable(),
  resultOne: z
    .union( [
      z.string().regex( /^[0-9]*$/ ).transform( ( val ) => {
        return val.trim() === '' ? undefined : Number( val )
      } ),
      z.number()
    ] )
    .optional()
    .nullable(),
  resultTwo: z
    .union( [
      z.string().regex( /^[0-9]*$/ ).transform( ( val ) => {
        return val.trim() === '' ? undefined : Number( val )
      } ),
      z.number()
    ] )
    .optional()
    .nullable(),
  date: z.string().datetime( { offset: true } ).transform( ( val ) => val.substring( 0, 10 ) ).nullable().optional(),
  hour: z.string().optional(),
  field: z.string().optional(),
  state: z.number().int().gte( 0 ).lte( 3 ).optional(),
  numDate: z.string().regex( /^[0-9]+$/ ).or( z.number() )

} )

export function validateMatch ( input ) {
  return matchSchema.safeParse( input )
}

export function validatePartialMatch ( input ) {
  return matchSchema.partial().safeParse( input )
}
