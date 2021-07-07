require('../config/lib')
require('../config/global')

const router = express.Router();
const detaildropdown_method = require('../database/detaildropdownmethod');
const middleware = require('../method/middleware')


router.use(middleware)

router.post("/v1/add_dropdown",async function (req, res) {
    try {
        let data = req.body
        var json_data = req.json_data
        const result_insert = await detaildropdown_method.insert_detail(json_data,data)
        if (result_insert[0]){
            return res.status(200).json({
                status: true,
                message: result_insert[1],
                data: null
            })
        }else {
            throw ({
                message: result_insert[1]
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

router.get("/v1/get_dropdown",async function (req, res) {
    try {
        let data = req.query
        var json_data = req.json_data
        var document = data.document_type
        const result_detail = await detaildropdown_method.get_detail(json_data,document)
        if (result_detail[0]){
            return res.status(200).json({
                status: true,
                message: null,
                data: result_detail[1]
            })
        }else {
            throw ({
                message: result_detail[1]
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

router.post("/v2/get_dropdown",async function (req, res) {
    try {
        let data = req.body
        var json_data = req.json_data
        var document = data.document_type
        var type_of_team = data.type_of_team
        var type_of_flow = data.type_of_flow
        const result_detail = await detaildropdown_method.get_detail_v2(json_data,document,type_of_team,type_of_flow)
        if (result_detail[0]){
            return res.status(200).json({
                status: true,
                message: null,
                data: result_detail[1]
            })
        }else {
            throw ({
                message: result_detail[1]
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