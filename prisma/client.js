const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')

const adapter = new PrismaPg({
  connectionString: 'postgresql://lucio:senha123@localhost:5432/tasks_db'
})

const prisma = new PrismaClient({ adapter })

module.exports = prisma