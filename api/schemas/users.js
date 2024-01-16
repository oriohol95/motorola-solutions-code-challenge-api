import z from 'zod'

const userSchema = z.object({
  country: z.string({
    invalid_type_error: 'User country must be a string',
    required_error: 'User country is required.'
  }),
  region: z.string({
    invalid_type_error: 'User region must be a string',
    required_error: 'User region is required.'
  }),
  name: z.string({
    invalid_type_error: 'User name must be a string',
    required_error: 'User name is required.'
  }),
  email: z.string({
    invalid_type_error: 'User email must be a string',
    required_error: 'User email is required.'
  })
})

export function validateUser (input) {
  return userSchema.safeParse(input)
}

export function validatePartialUser (input) {
  return userSchema.partial().safeParse(input)
}
