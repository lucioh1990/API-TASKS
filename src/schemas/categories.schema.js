const {z} = require('zod');



const categorySchema = z.object({
  name: z.string(),
  color: z.string()
})

const updatecategorySchema = z.object({
  name: z.string().optional(),
  color: z.string().optional()
})

module.exports = { categorySchema, updatecategorySchema };