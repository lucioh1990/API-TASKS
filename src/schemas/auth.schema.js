const {z} = require('zod');

const registerSchema = z.object({
  email: z.string(),
  password: z.string()
})

const loginSchema = z.object({
  email: z.string(),
  password: z.string()
})

module.exports = { registerSchema, loginSchema };