require('../config/lib')
require('../config/global')
const middleware = require('../method/middleware')
const router = express.Router();
router.use(middleware)
const { response } = require('express');
const db_transaction = require('../database/actiondb_transaction')
const db_log_doc = require('../database/db_document_log')
const importdocument = require('../method/import_document')
const method_refesh = require('../method/refesh_process')


router.get("/get",async function (req, res) {
    try {
        let json_data = req.json_data 
        let params = req.query
        let id_transaction = params.id_transaction
        let connectiondb = json_data.db_connect
        var resp_transaction = await db_transaction.find_transaction(connectiondb,id_transaction)
        if (resp_transaction[0]) {
            return res.status(200).json({
                status: true,
                message: null,
                data: resp_transaction[1]
            })
            
           
        } else {
            throw ({
                message: resp_transaction[1]
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

router.get("/get_history",async function (req, res) {
    try {
        let json_data = req.json_data
        let params = req.query
        let id_transaction = params.id_transaction
        var resp_log_transaction = await db_log_doc.select_tb_document_log(json_data,id_transaction)
        if (resp_log_transaction[0]) {
            return res.status(200).json({
                status: true,
                message: null,
                data: resp_log_transaction[1]
            })
        } else {
            throw ({
                message: resp_log_transaction[1]
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

router.get("/import_document",async function (req, res) {
    try {
        let json_data = req.json_data
        let params = req.query
        let document_id = params.document_id
        var result_document = await importdocument.import_data_from_documentid(json_data,document_id)
        if (result_document[0]) {
            return res.status(200).json({
                status: true,
                message: null,
                data: result_document[1]
            })
        } else {
            throw ({
                message: result_document[2]
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

router.post("/refesh_input_transaction",async function (req, res) {
    try {
        var token = req.headers.authorization
        let body = req.body
        let data = body.data
        let group_id = body.group_id
        let qt_id = body.qt_id
        var json_data = req.json_data
        var result_process = await method_refesh.refesh_trans_process(json_data,group_id,data,qt_id,token)
        if (result_process[0] == true){
            return res.status(200).json({
                status: true,
                message: 'success',
                data: result_process[1]
            })
        }
        else{
            throw ({
                message: result_process[1]
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