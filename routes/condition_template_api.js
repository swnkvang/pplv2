require('../config/lib')
require('../config/global')

const router = express.Router();
const middleware = require('../method/middleware')
const condition_method = require('../database/coditionmethod');
const db_flow = require('../database/actiondb_flow')

router.use(middleware)

router.get("/get_flow",async function (req, res) {
    try {
        let data = req.query
        if (data.hasOwnProperty('document_type') && data.hasOwnProperty('data') ){
            const document_type = data.document_type
            const condition_select = data.data
            var json_data = req.json_data
            resp = await condition_method.select_codition_template(json_data.db_connect,document_type,condition_select)
            if (resp[0]){
                return res.status(200).json({
                    status: true,
                    message: null,
                    data: resp[1]
                })
            }else {
                throw ({
                    message: resp[1]
                })
            }
        }else {
            throw ({
                message: 'parameter incorrect'
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

router.get("/get_flow_v2",async function (req, res) {
    try {
        let data = req.query
        if (data.hasOwnProperty('document_type') && data.hasOwnProperty('data') ){
            const document_type = data.document_type
            const condition_select = data.data
            var json_data = req.json_data
            resp = await condition_method.select_codition_template(json_data.db_connect,document_type,condition_select)
            if (resp[0]){
                var res_flow = await db_flow.find_flow(json_data.db_connect,resp[1])
                if (res_flow[0]){
                    var res_flow = await db_flow.find_flow(json_data.db_connect,resp[1])
                    if (res_flow[0]){
                        return res.status(200).json({
                            status: true,
                            message: null,
                            data: res_flow[1]
                        })
                    }else{
                        throw ({
                            message: res_flow[1]
                        })
                    }
                }else{
                    throw ({
                        message: res_flow[1]
                    })
                }
            }else {
                throw ({
                    message: resp[1]
                })
            }
        }else {
            throw ({
                message: 'parameter incorrect'
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