import z from 'zod'

const userSchema = z.object( {
  name: z.string(),
  password: z.string().min( 6, { message: 'La contraseña debe tener al menos 6 caracteres' } ),
  newPassword: z.string().min( 6, { message: 'La contraseña debe tener al menos 6 caracteres' } ).optional()
} )

export function validateUser ( input ) {
  return userSchema.safeParse( input )
}

export function validatePartialUser ( input ) {
  return userSchema.partial().safeParse( input )
}
