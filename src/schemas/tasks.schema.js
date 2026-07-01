const {z} = require('zod');


const taskSchema = z.object({
  title: z.string(),
  status: z.string(),
  description: z.string().optional(),
  priority: z.string().optional(),
  projectId: z.number().optional(),
  categoryId: z.number().optional()
})

const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  projectId: z.number().optional(),
  categoryId: z.number().optional()
})

module.exports = { taskSchema, updateTaskSchema };