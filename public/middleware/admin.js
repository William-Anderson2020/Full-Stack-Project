
const admin = async(req,res,next)=>{
    try {
        if(req.password=="ThisisaPassword"){
            next()
        }
    } catch (error) {
        res.status(400).send("Not an Admin")
    }
}
