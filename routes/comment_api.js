require('../config/lib')
require('../config/global')
const middleware = require('../method/middleware')
const router = express.Router();
router.use(middleware)
const { response } = require('express');
const db_document_log = require('../database/db_document_log')


router.post("/insert",async function (req, res) {
    try {
        let json_data = req.json_data
        let dataJson = req.body
        let tmpinsert = {
            id_transaction: dataJson.id_transaction,
            actor: json_data.one_result_data.id,
            action: dataJson.action,
            detail: JSON.stringify(dataJson.detail),
            index_actor: dataJson.index_actor,
            status: dataJson.status

        }
        var res_insert = await db_document_log.insert_tb_document_log(json_data,tmpinsert)
        if (res_insert[0]) {
            return res.status(200).json({
                status: true,
                message: null,
                data: res_insert[1]
            })
        } else {
            throw ({
                message: res_insert[1]
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