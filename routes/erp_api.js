require('../config/lib')
require('../config/global')

const router = express.Router();
const middleware = require('../method/middleware')
const erp_db = require('../database/db_erp');

router.use(middleware)

router.get("/listSonumber",async function (req, res) {
    try {
        const result_erp = await erp_db.select_Sonumber()
        if (result_erp[0]){
            return res.status(200).json({
                status: true,
                message: 'success',
                data: result_erp[1]
            })
        }else{
            throw ({
                message: result_erp[1]
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

router.get("/data_Soone",async function (req, res) {
    try {
        const query_string = req.query
        if (query_string.so_number){
            const so_number = query_string.so_number
            const result_erp = await erp_db.select_So_one(so_number)
            if (result_erp[0]){
                return res.status(200).json({
                    status: true,
                    message: 'success',
                    data: result_erp[1]
                })
            }else{
                throw ({
                    message: result_erp[1]
                })
            }
        }else{
            throw ({
                message: 'parameter error'
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