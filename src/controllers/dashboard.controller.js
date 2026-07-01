const prisma = require('../../prisma/client');

exports.getDashboard = async (req, res) => {
    const totalTasks = await prisma.task.count();
    const porStatus = await prisma.task.groupBy({
        by: ['status'],
        _count: {id:true}
    });
    const porPriority = await prisma.task.groupBy({
        by: ['priority'],
        _count: {id: true}
    });
    const porProject = await prisma.task.groupBy({
        by: ['projectId'],
        _count: {id: true}
    });
    res.json({totalTasks, porStatus, porPriority, porProject })
};