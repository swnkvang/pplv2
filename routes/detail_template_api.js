require('../config/lib')
require('../config/global')

const router = express.Router();
const detailtemplate = require('../database/detail_template_db');
const middleware = require('../method/middleware')

router.use(middleware)

router.post("/add_detail",async function (req, res) {
    try {
        let data = req.body
        var service_detail = data.detail_template
        var json_data = req.json_data
        const result_insert = await detailtemplate.insert_detailtemplate(json_data,service_detail)
        if (result_insert[0]){
            return res.status(200).json({
                status: true,
                message: 'success',
                data: result_insert[1]
            })
        }else{
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

router.get("/get_detailtemplate",async function (req, res) {
    try {
        let data = req.query
        var json_data = req.json_data
        var document_type = data.document_type
        var service = data.service
        var type_cloud = data.type_cloud
        const result_select = await detailtemplate.select_detailtemplate(json_data,document_type,service,type_cloud)
        if (result_select[0]){
            return res.status(200).json({
                status: true,
                message: 'success',
                data: result_select[1]
            })
        }else{
            throw ({
                message: result_select[1]
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