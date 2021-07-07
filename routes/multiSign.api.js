require('../config/lib')
require('../config/global')
const middleware = require('../method/middleware')
const summaryGroupFunc = require('../function/summaryGroup.func')
const flowFunc = require('../function/flow.func')
const Flow = require('../method/process_flow');
const logService = require('../database/transaction.service_');

const router = express.Router();


router.use(middleware)
router.get("/GetProcess", async function (req, res) {
    try {
        let json_data = req.json_data
        var db_connect = json_data.db_connect
        let body = req.query
        let process_id = body.id
        var GetDataProcessId = await summaryGroupFunc.GetProcessId(db_connect, process_id)

        return res.status(200).json({
            status: true,
            message: "Get Data Success",
            data: GetDataProcessId[1]
        }).end()
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: "Get Data Success && Not Found " + String(error),
            data: null
        }).end()
    }
});

router.post("/GetDetailMultiSign", async function (req, res) {
    try {
        let json_data = req.json_data
        let body = req.body
        let transaction = body.transaction_id
        var db_connect = json_data.db_connect
        var one_result_data = json_data.one_result_data
        let hederbiz = req.headers.taxid
        var ResData = await flowFunc.flowCalJsonUpdate(db_connect, transaction, one_result_data, hederbiz, "Complete")
        if (ResData[0]) {
            return res.status(200).json({
                status: true,
                message: "Get Data Success",
                data: ResData[1]
            })
        }
        return res.status(400).json({
            status: false,
            message: "Get Data Success && Not Found",
            data: null
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: "Get Data Success && Not Found " + String(error),
            data: null
        })
    }
});

router.post("/MultiSign", async function (req, res) {
    try {
        var ProcessData = []
        let json_data = req.json_data
        let db_connect = json_data.db_connect
        let one_result_data = json_data.one_result_data
        let dataJson = req.body
        var summary_group_id = dataJson.summary_group_id
        var Signature = dataJson.signature
        var data = dataJson.data
        let hederbiz = req.headers.taxid
        var token = req.headers.authorization
        for (let i = 0; i < data.length; i++) {
            const data_element = data[i];
            let transaction_id = data_element.transaction_id
            var infoData = {
                transaction: transaction_id,
                status: false,
                message: "onprocess"
            }
            ProcessData.push(infoData)
        }
        var GetIdProcess = await logService.SaveLogProcess(db_connect, one_result_data, summary_group_id, ProcessData)
        var ProcessId = GetIdProcess[1]._id
        await summaryGroupFunc.UpdateGroupSummaryProcessId(json_data, summary_group_id, ProcessId)
        summaryGroupFunc.MultiSign(json_data, db_connect, one_result_data, hederbiz, summary_group_id, Signature, data, ProcessId, token)
        return res.status(200).json({
            status: true,
            message: 'success',
            data: {
                process_id: GetIdProcess[1]._id
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: error.message,
            data: null
        })
    }

});

router.post("/CreateUpdateSummaryGroup", async function (req, res) {
    try {
        let json_data = req.json_data
        var ResData = await summaryGroupFunc.CreateUpdateGroupSumTemp(json_data)
        return res.status(200).json({
            status: true,
            message: 'success',
            data: ResData[1]
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: 'create fail ' + String(error),
            data: null
        })
    }
});

router.get("/GetSummaryGroup", async function (req, res) {
    try {
        let json_data = req.json_data
        let body = req.query
        let id = body.id
        let keyword = body.keyword
        let filter = body.filter
        let datetime = body.datetime
        let limit = body.limit
        let offset = body.offset
        if (limit) {
            limit = parseInt(limit)
        } else {
            limit = 100
        }
        if (offset) {
            offset = parseInt(offset)
        } else {
            offset = 0
        }
        // console.log(!id, !keyword, !filter, !datetime)
        if (!id && !keyword && !filter && !datetime) {
            console.log("GetSummaryGroup")
            var ResGetData = await summaryGroupFunc.GetSummaryGroup(json_data, limit, offset)
        } else if (id && !keyword) {
            console.log("GetSummaryGroupOne")
            var ResGetData = await summaryGroupFunc.GetSummaryGroupOne(json_data, id)
        } else if (keyword) {
            console.log("GetSummaryGroupFind")
            var ResGetData = await summaryGroupFunc.GetSummaryGroupFind(json_data, keyword, limit, offset)
        }else if (datetime  || filter) {
            var ResGetData = await summaryGroupFunc.GetSummaryGroupFilterDatetime(json_data, filter,datetime, limit, offset)
        }
        // } else if (filter) {
        //     console.log("GetSummaryGroupFilter")
        //     var ResGetData = await summaryGroupFunc.GetSummaryGroupFilter(json_data, filter, limit, offset)
        // } else if (datetime) {
        //     console.log("GetSummaryGroupDateTime")
        //     var ResGetData = await summaryGroupFunc.GetSummaryGroupDateTime(json_data, datetime, limit, offset)
        // }
        if (ResGetData[0]) {
            return res.status(200).json({
                status: true,
                message: 'Get Data Success',
                data: ResGetData[1]
            })
        }
        return res.status(200).json({
            status: false,
            message: 'Get Data Success',
            data: ResGetData[1]
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: 'fail'
        })
    }
});

router.get("/GetStatusSummaryGroup", async function (req, res) {
    try {
        let json_data = req.json_data
        let body = req.query
        var GetDataStatus = await summaryGroupFunc.GetStatusSummaryGroup(json_data)
        return res.status(200).json({
            status: true,
            message: "Get Data Success",
            data: GetDataStatus[1]
        }).end()
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: String(error),
            data: null
        }).end()
    }
});

router.post("/ExtractDocument", async function (req, res) {
    try {
        var arrTransaction_id = []
        var arrResp = []
        let json_data = req.json_data
        var ResArray = []
        let body = req.body
        let transaction_id = body.transaction_id
        var summary_group_id = body.summary_group_id
        var db_connect = json_data.db_connect
        var one_result_data = json_data.one_result_data
        let hederbiz = req.headers.taxid
        var ResData = await flowFunc.flowCalJsonUpdate(db_connect, transaction_id, one_result_data, hederbiz, "Reject")
        if (ResData[0] === false) {
            return res.status(400).json({
                status: false,
                message: "flowCalJsonUpdate Error Pls Check Log",
                data: null
            })
        }
        var DataDetailUpdate = ResData[1]
        var sign_info = null
        for (let i = 0; i < DataDetailUpdate.length; i++) {
            const data_element = DataDetailUpdate[i];
            let transaction_id = data_element.transaction_id
            let json_update = data_element.json_update
            let input_info = data_element.input_info
            let attachfile_id = data_element.attachfile_id
            let sign_info = data_element.sign_info
            // let jsonDetail = dataJson.jsonDetail
            var resp = await Flow.update_flow_transaction_version2(json_data, transaction_id, json_update, input_info, hederbiz, sign_info, attachfile_id)
            var jsonResult = {
                status: resp[0],
                transaction_id: transaction_id,
                message: resp[1]
            }
            if (!resp[0]) {
                arrTransaction_id.push(transaction_id)
            }
            arrResp.push(jsonResult)
        }
        if (summary_group_id) {
            var ResGetData = await summaryGroupFunc.GetSummaryGroupOne(json_data, summary_group_id)
            if (ResGetData[0]) {
                var DataSummaryGroup = ResGetData[1]
                array_transaction_id = DataSummaryGroup.array_transaction_id
                var ArrayTransactionId = await flowFunc.removeItemAll(array_transaction_id, arrTransaction_id[0])
                var DataDocumentId = await summaryGroupFunc.FindTransactionIdtoDoc(json_data, ArrayTransactionId)
                if (DataDocumentId[0]) {
                    var DocumentIdArray = DataDocumentId[1]
                }
                await summaryGroupFunc.UpdateGroupSummaryFromId(summary_group_id, ArrayTransactionId, DocumentIdArray, sign_info)
            }
        }
        return res.status(200).json({
            status: true,
            message: "Success",
            data: arrResp
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: String(error),
            data: null
        })
    }
});

router.post("/EndtaskGroup", async function (req, res) {
    try {
        let json_data = req.json_data
        let dataJson = req.body
        let group_id = dataJson.group_id
        var res_endtaskgroup = await summaryGroupFunc.EndtaskGroup(json_data,group_id)
        if (res_endtaskgroup[0]) {
            return res.status(200).json({
                status: true,
                message: 'success',
                data: res_endtaskgroup[1]
            })
        } else {
            return res.status(400).json({
                status: false,
                message: 'fail',
                data: res_endtaskgroup[1]
            })
        }
        
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: 'create fail ' + String(error),
            data: null
        })
    }
});

router.post("/check_status_endtask", async function (req, res) {
    try {
        let json_data = req.json_data
        let connectiondb = json_data.db_connect
        let data = req.body
        let list_transaction = data.list_transaction
        let account_id = json_data.one_result_data.id
        var result_select = await summaryGroupFunc.find_endtask_status(list_transaction,account_id,connectiondb)
        if (result_select[0]) {
            return res.status(200).json({
                status: true,
                message: 'success',
                data: result_select[1]
            })
        }
        else{
            return res.status(400).json({
                status: false,
                message: 'fails',
                data: result_select[1]
            })
        }
        
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: 'create fail ' + String(error),
            data: null
        })
    }
});

module.exports = router