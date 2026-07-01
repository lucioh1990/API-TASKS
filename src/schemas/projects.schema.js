const {z} = require('zod');

const projectSchema = z.object({
  name: z.string(),
  status: z.string(),
  description: z.string().optional(),
})

const updateProjectSchema = z.object({
  name: z.string().optional(),
  status: z.string().optional(),
  description: z.string().optional(),
})

module.exports = { projectSchema, updateProjectSchema };