const prisma = require('../../prisma/dbConnection')
exports.getAll = async(req, res, next) => {
    try {

        const result = await prisma.categroy.findMany()
        res.json({ success: true, "message": "show successfully", result})
        
    } catch (error) {
        
    }   
}

exports.create = async(req, res, next) => {
    try {
        const {categoryName} = req.body
        const result = await prisma.categroy.create({
            data: {
                productName,
                // orgId: req.user.orgId
            }
        })        
        res.json({ success: true, "message": "show successfully", result})
        
    } catch (error) {
        next(error)
    }   


}
