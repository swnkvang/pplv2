require('../config/lib')
require('../config/global')
const middleware = require('../method/middleware')
const router = express.Router();
router.use(middleware)
const { response } = require('express');
const action_workflow = require('../database/actiondb_workflow');
const { connection } = require('mongoose');


router.post("/insert",async function (req, res) {
    try {
        var dataJson = req.body
        var json_workflow = dataJson.json_workflow
        var json_data = req.json_data
        var connectiondb = json_data.db_connect
        json_workflow.user_create = json_data.one_result_data
        var result_insert = await action_workflow.insert_workflow(connectiondb,json_workflow)
        if (result_insert[0]) {
            return res.status(200).json({
                status: true,
                message: 'insert success',
                data: result_insert[1]
            }) 
        } else {
            throw ({
                message: res_flow[1]
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

router.get("/get",async function (req, res) {
    try {
        var params = req.query
        var id_workflow = params.id_workflow
        var json_data = req.json_data
        // var connectiondb = json_data.db_connect
        var result_select = await action_workflow.select_workflow(json_data,id_workflow)
        if (result_select[0]) {
            return res.status(200).json({
                status: true,
                message: null,
                data: result_select[1]
            })
        } else {
            throw ({
                message: result_select[1]
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(400).json({
            status: false,
            message: err.message,
            data: null
        })
    }
});

router.get("/getlist",async function (req, res) {
    try {
        var params = req.query
        var json_data = req.json_data
        var result_select = await action_workflow.select_workflow_all(json_data)
        if (result_select[0]) {
            return res.status(200).json({
                status: true,
                message: null,
                data: result_select[1]
            })
        } else {
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