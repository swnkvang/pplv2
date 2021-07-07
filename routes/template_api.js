require('../config/lib')
require('../config/global')

const router = express.Router();
const middleware = require('../method/middleware')
const templateinput_db = require('../database/templateinput_db')

router.use(middleware)

router.post("/add_templateinput",async function (req, res) {
    try {
        let json_data = req.json_data
        let data = req.body
        const result_template = templateinput_db.insert_templateinput(json_data,data)
        if (result_template[0]){
            return res.status(200).json({
                status: true,
                message: "success",
                data: null
            })
        }else{
            console.log(result_template[1])
            throw ({
                message: result_template[1]
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: error.message,
            data: null
        })
    }
});



module.exports = router