require('../config/lib')
require('../config/global')
const Select_db = require('../database/db_select');
const {
    connonsql
} = require('../config/mongo_db')
const SummaryGroupSchema = require('../schema/summaryGroup.sch')
const transaction_Schema = require('../schema/transaction_document')
const flowSchema = require('../schema/flow.sch')
const flowFunc = require('../function/flow.func')
const Flow = require('../method/process_flow');
const logService = require('../database/transaction.service_')
const ProcessSaveSchema = require("../schema/process.sch")
const actiontransaction = require('../database/actiondb_transaction');

const GetProcessId = async (db_connect, process_id) => {
    try {
        await connonsql(db_connect)
        var Data = await ProcessSaveSchema.findOne({
            _id: process_id
        })
        return [true, Data]
    } catch (error) {
        console.log(error);
        return [false, String(error)]
    }
};

const MultiSign = async (json_data, db_connect, one_result_data, taxid, summary_group_id, Signature, data, process_id, token) => {
    try {
        var ProcessData = []
        var arrResp = []
        var arrTransaction_id = []
        var account_id = one_result_data.id
        for (let i = 0; i < data.length; i++) {
            const data_element = data[i];
            let transaction_id = data_element.transaction_id
            let json_update = data_element.json_update
            let input_info = data_element.input_info
            var sign_info = data_element.sign_info
            if (Signature) {
                sign_info = Signature
            }
            let attachfile_id = data_element.attachfile_id
            // let jsonDetail = dataJson.jsonDetail
            let firstDate = new Date()
            // logService.SaveLogProcess(db_connect, one_result_data, summary_group_id, infoData)
            var id_log = String(uuid())
            var RequestData = {
                attachfile_id: attachfile_id,
                transaction_id: transaction_id,
                json_update: json_update,
                input_info: input_info,
                sign_info: sign_info
            }

            var resp = await Flow.update_flow_transaction_version2(json_data, transaction_id, json_update, input_info, taxid, sign_info, attachfile_id)
            // console.log(resp)
            var jsonResult = {
                status: resp[0],
                transaction_id: transaction_id,
                message: {
                    message1: resp[1],
                    message2: resp[2]
                }
            }
            let secondDate = new Date()
            timeDifference = Math.abs(secondDate.getTime() - firstDate.getTime());
            let jsonSaveData = {
                id: id_log,
                url: "/MultiSign",
                token: token,
                tax_id: taxid,
                datetime: "",
                account_id: account_id,
                body: RequestData,
                query: "",
                params: "",
                response: jsonResult,
                time_duration: String(timeDifference) + " ms",
                statusCode: "200"
            }
            console.log(jsonSaveData)
            actiontransaction.insert_logtransac(jsonSaveData, taxid)
            if (!resp[0]) {
                await logService.UpdateLogProcess(db_connect, process_id, transaction_id, resp[1], false)
                arrTransaction_id.push(transaction_id)
            } else {
                await logService.UpdateLogProcess(db_connect, process_id, transaction_id, "Sign Success", true)
            }
            arrResp.push(jsonResult)
        }
        if (summary_group_id) {
            var ResGetData = await GetSummaryGroupOne(json_data, summary_group_id)
            if (ResGetData[0]) {
                var DataSummaryGroup = ResGetData[1]
                var array_transaction_id = DataSummaryGroup.array_transaction_id
                ArrayTransactionId = array_transaction_id
                var DataDocumentId = await FindTransactionIdtoDoc(json_data, ArrayTransactionId)
                if (DataDocumentId[0]) {
                    var DocumentIdArray = DataDocumentId[1]
                }
                await UpdateGroupSummaryFromId(json_data, summary_group_id, ArrayTransactionId, DocumentIdArray, sign_info)
                if (arrTransaction_id.length >= 1) {
                    await logService.UpdateLogProcessSuccess(db_connect, process_id, "Y")
                } else {
                    await logService.UpdateLogProcessSuccess(db_connect, process_id, "Y")
                }
            }
        }
        await CreateUpdateGroupSumTemp(json_data)
    } catch (error) {
        console.log(error)
    }
};

const UpdateGroupSummaryProcessId = async (json_data, summaryGroupid, process_id) => {
    try {
        var data_citizen = json_data
        var one_result_data = data_citizen.one_result_data
        var connectiondb = data_citizen.db_connect
        var account_id = one_result_data.id
        if (connectiondb != null) {
            await connonsql(connectiondb)
        }
        var JsonUpdate = {
            process_id: process_id,
            status: "O"
        }
        var ResSaveGroup = await SummaryGroupSchema.findOneAndUpdate({
            _id: summaryGroupid
        }, JsonUpdate, {
            upsert: true,
            setDefaultsOnInsert: true
        }, function (err, doc) {
            if (err) return [false, err];
        });
        return [true, "UpdateSummaryGroup Success"]
    } catch (error) {
        console.log(error)
        return [false, String(error)]
    }
}

const UpdateGroupSummaryFromId = async (json_data, summaryGroupid, ArrayTransactionId, ArrayDocumentId, signature) => {
    try {
        var data_citizen = json_data
        var one_result_data = data_citizen.one_result_data
        var connectiondb = data_citizen.db_connect
        var account_id = one_result_data.id
        if (connectiondb != null) {
            await connonsql(connectiondb)
        }
        var JsonUpdate = {
            array_document_id: ArrayDocumentId,
            array_transaction_id: ArrayTransactionId,
            status: "Y",
            signature: signature
        }
        var ResSaveGroup = await SummaryGroupSchema.findOneAndUpdate({
            _id: summaryGroupid
        }, JsonUpdate, {
            upsert: true,
            setDefaultsOnInsert: true
        }, function (err, doc) {
            console.log(err)
            if (err) return [false, err];
        });
        return [true, "UpdateSummaryGroup Success"]
    } catch (error) {
        return [false, String(error)]
    }
};

const RemoveGroupSummary = async (account_id) => {
    try {
        var ResultGetGroup = await SummaryGroupSchema.remove({
            $and: [{
                "actor.id": account_id
            }, {
                "status": "W"
            },{
                "StatusUpdateGroup": {$ne: false}
            }]
        }, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
        });
    } catch (error) {
        console.log(error)
    }
};

const CreateGroupSummary = async (json_data, account_id, DataJson) => {
    try {
        var data_citizen = json_data
        var one_result_data = data_citizen.one_result_data
        var connectiondb = data_citizen.db_connect
        var account_id = one_result_data.id
        if (connectiondb != null) {
            await connonsql(connectiondb)
        }
        var ArrayId = []
        if (DataJson.length == 0) {
            await RemoveGroupSummary(account_id)
        }
        for (let i = 0; i < DataJson.length; i++) {
            const DataJsonelement = DataJson[i];
            var actor = DataJsonelement.actor
            var account_id = actor.id
            var color = DataJsonelement.color
            var document_type = DataJsonelement.document_type
            var ResSaveGroup = await SummaryGroupSchema.findOneAndUpdate({
                $and: [{
                    "actor.id": account_id,
                }, {
                    "status": "W",
                }, {
                    "color": color,
                }, {
                    "document_type": document_type,
                }, {
                    "process_id": ""
                }]
            }, DataJsonelement, {
                upsert: true,
                setDefaultsOnInsert: true
            }, function (err, doc) {
                if (doc != null) {
                    ArrayId.push(String(doc._doc._id))
                }

                if (err) return [false, err];
            });
        }
        if (ArrayId.length > 0) {
            var GetDataGroup = await SummaryGroupSchema.remove({
                $and: [{
                    "actor.id": account_id,
                }, {
                    "_id": {
                        $nin: ArrayId
                    }
                }, {
                    "status": "W"
                }]
            }, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(result);
                }
            })
        }
        return [true, "CreateSummaryGroup Success"]
    } catch (error) {
        return [false, String(error)]
    }
};

const FilterDocumentType = async (DataDoc, data_citizen) => {
    var ArrayDocumentType = []
    var Docid = []
    var Array_transaction_id = []
    var JsonTemp = null
    var ResJsonTemp = []
    var ArrayDocument = []
    var defaultStatusUpdateGroup = true
    var attachfile_group = ""
    for (let i = 0; i < DataDoc.length; i++) {
        const DataDocelement = DataDoc[i]._doc;
        var transaction_id = DataDocelement._id
        var doctype = DataDocelement.doctype
        var color = DataDocelement.color
        var document_id = DataDocelement.document_id
        var doctype_name = DataDocelement.doctype_name
        var flow = DataDocelement.flow
        for (let j = 0; j < flow.length; j++) {
            const flow_element = flow[j];
            var action = flow_element.action
            var status = flow_element.status
            if (color === undefined || color === null) {
                color = "other"
            }
            if ((action == 'e-sign' || action == 'approve') && status == 'W') {
                ArrayDocument.push({
                    array_transaction_id: String(transaction_id),
                    document_type: doctype,
                    color: color,
                    array_document_id: document_id,
                    doctype_name: doctype_name,
                    StatusUpdateGroup: defaultStatusUpdateGroup,
                    attachfile_group: attachfile_group
                })
            }
        }

    }
    var output = [];
    ArrayDocument.forEach(function (item) {
        var existing = output.filter(function (v, i) {
            return v.document_type == item.document_type && v.color == item.color;
        });
        if (existing.length) {
            var existingIndex = output.indexOf(existing[0]);
            output[existingIndex].array_document_id = output[existingIndex].array_document_id.concat(item.array_document_id);
            output[existingIndex].array_transaction_id = output[existingIndex].array_transaction_id.concat(item.array_transaction_id);
            // output[existingIndex].doctype_name = output[existingIndex].doctype_name.concat(item.doctype_name);
        } else {
            if (typeof item.array_document_id == 'string')
                item.array_document_id = [item.array_document_id];
            if (typeof item.array_transaction_id == 'string')
                item.array_transaction_id = [item.array_transaction_id];
            // if (typeof item.doctype_name == 'string')
            //     item.doctype_name = [item.doctype_name]
            output.push(item);
        }
    });
    for (let i = 0; i < output.length; i++) {
        const output_element = output[i];
        output_element.name = output_element.doctype_name
        output_element.status = "W"
        output_element.actor = data_citizen
        output_element.signature = ""
    }
    return [true, output]
};

const FindTransactionIdtoDoc = async (json_data, transaction_id_array) => {
    try {
        var arrayDocumentId = []
        var data_citizen = json_data
        var one_result_data = data_citizen.one_result_data
        var connectiondb = data_citizen.db_connect
        if (connectiondb != null) {
            await connonsql(connectiondb)
        }
        var DataDocument = await transaction_Schema.find({
            _id: {
                $in: transaction_id_array
            }
        }).select({
            document_id: 1
        })
        if (DataDocument.length == 0) {
            return [false, "Not Found"]
        }
        for (let i = 0; i < DataDocument.length; i++) {
            const DataDocument_element = DataDocument[i]._doc;
            arrayDocumentId.push(DataDocument_element.document_id)
        }
        return [true, arrayDocumentId]
    } catch (error) {
        console.log(error)
        return [false, String(error)]
    }
};

const CreateUpdateGroupSumTemp = async (json_data) => {
    try {
        var data_citizen = json_data
        var one_result_data = data_citizen.one_result_data
        var connectiondb = data_citizen.db_connect
        var account_id = one_result_data.id
        if (connectiondb != null) {
            await connonsql(connectiondb)
        }
        var DetaDocumentForUser = await Select_db.func_get_all_doc_recp_filter_v2_haveflow(account_id, "W", "", "", "", "",connectiondb);
        if (DetaDocumentForUser[0] === 200) {
            var DataDoc = DetaDocumentForUser[1]
            if (DataDoc.length == 0) {
                await RemoveGroupSummary(account_id)
                return [false, "Not Found"]
            }
            var DataDocumentSummaryGroup = await FilterDocumentType(DataDoc, one_result_data)
            if (DataDocumentSummaryGroup[0]) {
                var ResData = DataDocumentSummaryGroup[1]
                // var GroupCretaeInfo = await CreateGroupSummary(json_data, account_id, ResData)
                var GroupCretaeInfo = await CreateGroupSummary_V2(json_data, account_id, ResData)
                if (GroupCretaeInfo[0]) {
                    return [true, ResData]
                } else {
                    return [false,ResData ]
                }
            }
        }
        return [false, "Cant CreateGroupSummary"]
    } catch (error) {
        console.log(error)
        return [false, String(error)]
    }
};

const GetSummaryGroup = async (json_data, limit, offset) => {
    try {
        var one_result_data = json_data.one_result_data
        var account_id = one_result_data.id
        var connectiondb = json_data.db_connect
        if (connectiondb != null) {
            await connonsql(connectiondb)
        }
        var GetDataFind = await SummaryGroupSchema.find({
            $and: [{
                "actor.id": account_id
            }]
        }).select({
            "actor.biz_detail": 0
        }).sort({
            createdAt: -1
        }).skip(offset).limit(limit)
        if (GetDataFind.length == 0) {
            return [false, "Not Found"]
        }
        return [true, GetDataFind]
    } catch (error) {
        console.log(error)
        return [false, String(error)]
    }
};

const GetStatusSummaryGroup = async (json_data) => {
    try {
        var one_result_data = json_data.one_result_data
        var account_id = one_result_data.id
        var connectiondb = json_data.db_connect
        if (connectiondb != null) {
            await connonsql(connectiondb)
        }
        var GetDataFind = await SummaryGroupSchema.find({
            $and: [{
                "actor.id": account_id
            }]
        }).select({
            status: 1
        }).sort({
            createdAt: -1
        })
        if (GetDataFind.length == 0) {
            return [false, "Not Found"]
        }
        return [true, GetDataFind]
    } catch (error) {
        console.log(error)
        return [false, String(error)]
    }
};

const GetSummaryGroupOne = async (json_data, id) => {
    try {
        var _id_Array = []
        var input_Array = []
        var DocumentIdArray = []
        var flow_name_tmpArray = []
        var one_result_data = json_data.one_result_data
        var account_id = one_result_data.id
        var connectiondb = json_data.db_connect
        var ArrayFlowName = []
        if (connectiondb != null) {
            await connonsql(connectiondb)
        }
        var GetDataFind = await SummaryGroupSchema.findOne({
            $and: [{
                "_id": id
            }, {
                "actor.id": account_id
            }]
        })
        if (GetDataFind == null) {
            return [false, "Not Found"]
        }
        GetDataFind = GetDataFind._doc
        var Array_transaction_id = GetDataFind.array_transaction_id
        var DataDocument = await transaction_Schema.find({
            _id: {
                $in: Array_transaction_id
            }
        }).select({
            input_data: 1,
            id_flow_tmp: 1,
            flow_name_tmp: 1,
            document_id: 1,
            _id: 1
        })
        for (let n = 0; n < DataDocument.length; n++) {
            const DataDocumentelement = DataDocument[n]._doc;
            _id_Array.push(String(DataDocumentelement._id))
            DocumentIdArray.push(String(DataDocumentelement.document_id))
            input_Array.push(DataDocumentelement.input_data)
            if (!"flow_name_tmp" in DataDocumentelement) {
                flow_name_tmpArray.push(null)
            } else {
                flow_name_tmpArray.push(DataDocumentelement.flow_name_tmp)
            }
        }
        GetDataFind.array_flow_name = flow_name_tmpArray
        GetDataFind.array_input_data = input_Array
        GetDataFind.array_transaction_id = _id_Array
        GetDataFind.array_document_id = DocumentIdArray
        return [true, GetDataFind]
    } catch (error) {
        console.log(error)
        return [false, String(error)]
    }
};

const GetSummaryGroupFind = async (json_data, keyword, limit, offset) => {
    try {
        var one_result_data = json_data.one_result_data
        var account_id = one_result_data.id
        var connectiondb = json_data.db_connect
        if (connectiondb != null) {
            await connonsql(connectiondb)
        }
        var GetDataFind = await SummaryGroupSchema.find({
            $and: [{
                "array_document_id": {
                    $regex: keyword
                }
            }, {
                "actor.id": account_id
            }]
        }).select({
            "actor.biz_detail": 0
        }).sort({
            createdAt: -1
        }).skip(offset).limit(limit)
        if (GetDataFind == null) {
            return [false, "Not Found"]
        }
        return [true, GetDataFind]
    } catch (error) {
        console.log(error)
        return [false, String(error)]
    }
};

const GetSummaryGroupFilterDatetime = async (json_data, filter, datetime, limit, offset) => {
    try {
        var one_result_data = json_data.one_result_data
        var account_id = one_result_data.id
        var connectiondb = json_data.db_connect
        if (connectiondb != null) {
            await connonsql(connectiondb)
        }

        if (filter && datetime) {
            var datetime = parseInt(datetime)
            var dateString = timemoment.unix(datetime).format("YYYY-MM-DD");
            dtm_start = dateString + " 00:00:00"
            dtm_end = dateString + " 23:59:59"
            var AndMg = [{
                "createdAt": {
                    $gte: dtm_start,
                    $lte: dtm_end
                }
            }, {
                "status": filter
            }, {
                "actor.id": account_id
            }]
        } else if (filter) {
            var AndMg = [{
                "status": filter
            }, {
                "actor.id": account_id
            }]
        } else if (datetime) {
            var datetime = parseInt(datetime)
            var dateString = timemoment.unix(datetime).format("YYYY-MM-DD");
            dtm_start = dateString + " 00:00:00"
            dtm_end = dateString + " 23:59:59"
            var AndMg = [{
                "createdAt": {
                    $gte: dtm_start,
                    $lte: dtm_end
                }
            }, {
                "actor.id": account_id
            }]
        }
        var GetDataFind = await SummaryGroupSchema.find({
            $and: AndMg
        }).select({
            "actor.biz_detail": 0
        }).sort({
            createdAt: -1
        }).skip(offset).limit(limit)
        if (GetDataFind == null) {
            return [false, "Not Found"]
        }
        return [true, GetDataFind]
    } catch (error) {
        console.log(error)
        return [false, String(error)]
    }
};

const GetSummaryGroupDateTime = async (json_data, datetime, limit, offset) => {
    try {
        var one_result_data = json_data.one_result_data
        var account_id = one_result_data.id
        var connectiondb = json_data.db_connect
        if (connectiondb != null) {
            await connonsql(connectiondb)
        }
        var datetime = parseInt(datetime)
        var dateString = timemoment.unix(datetime).format("YYYY-MM-DD");
        dtm_start = dateString + " 00:00:00"
        dtm_end = dateString + " 23:59:59"
        var GetDataFind = await SummaryGroupSchema.find({
            $and: [{
                "createdAt": {
                    $gte: dtm_start,
                    $lte: dtm_end
                }
            }, {
                "actor.id": account_id
            }]
        }).select({
            "actor.biz_detail": 0
        }).sort({
            createdAt: -1
        }).skip(offset).limit(limit)
        if (GetDataFind == null) {
            return [false, "Not Found"]
        }
        return [true, GetDataFind]
    } catch (error) {
        console.log(error)
        return [false, String(error)]
    }
};


const CreateGroupSummary_V2 = async (json_data, account_id, DataJson) => {
    try {
        var data_citizen = json_data
        var one_result_data = data_citizen.one_result_data
        var connectiondb = data_citizen.db_connect
        var account_id = one_result_data.id
        if (connectiondb != null) {
            await connonsql(connectiondb)
        }
        var ArrayId = []
        if (DataJson.length == 0) {
            await RemoveGroupSummary(account_id)
        }
        for (let i = 0; i < DataJson.length; i++) {
            const DataJsonelement = DataJson[i];
            var actor = DataJsonelement.actor
            var account_id = actor.id
            var color = DataJsonelement.color
            var document_type = DataJsonelement.document_type
            var StatusUpdateGroup = DataJsonelement.StatusUpdateGroup
            var ResSaveGroup = await SummaryGroupSchema.findOneAndUpdate({
                $and: [{
                    "actor.id": account_id,
                }, {
                    "status": "W",
                }, {
                    "color": color,
                }, {
                    "document_type": document_type,
                }, {
                    "process_id": ""
                },{
                    $or : [
                        {
                            "StatusUpdateGroup": true
                        },
                        {
                            "StatusUpdateGroup": undefined

                        }
                    ]
                }]
            }, DataJsonelement, {
                upsert: true,
                setDefaultsOnInsert: true
            }, function (err, doc) {
                if (doc != null) {
                    ArrayId.push(String(doc._doc._id))
                }
                if (err) return [false, err];
            });
        }
        if (ArrayId.length > 0) {
            var GetDataGroup = await SummaryGroupSchema.remove({
                $and: [{
                    "actor.id": account_id,
                }, {
                    "_id": {
                        $nin: ArrayId
                    }
                }, {
                    "status": "W"
                },{
                    "StatusUpdateGroup": {$ne: false}
                }]
            }, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(result);
                }
            })
        }
        return [true, "CreateSummaryGroup Success"]
    } catch (error) {
        return [false, String(error)]
    }
};

const EndtaskGroup = async (json_data, group_id) => {
    try {
        var connectiondb = json_data.db_connect
        var account_id = json_data.one_result_data.id
        if (connectiondb != null) {
            await connonsql(connectiondb)
        }
        var DataGroup = await SummaryGroupSchema.findOne({
            $and: [{
                "_id": group_id
            }, {
                "actor.id": account_id
            }]
        })
        DataGroup._doc.array_transaction_id
        DataGroup._doc.StatusUpdateGroup = false 
        var arr_transaction = DataGroup._doc.array_transaction_id
        if (DataGroup == null) {
            return [false, "Not Found"]
        }
        // update transaction one
        var ResUpdateTransaction = await transaction_Schema.updateMany(
            { _id: { $in: arr_transaction }, 
            },
            { $set: { 
                        "status_summary_group" : true
                    } 
            },
            {
                _id: 1
            }
        )
        // update group
        var ResUpdateGroup = await SummaryGroupSchema.updateOne(
            { _id: DataGroup._doc._id },
            {
                $set: { StatusUpdateGroup: false},
                $currentDate: { lastModified: true }
              }
        )
        return [true,DataGroup._doc]
    } catch (error) {
        return [false, String(error)]
    }
};

const find_endtask_status = async (list_transaction,account_id,connectiondb) => {
    try {
        if (connectiondb != null) {
            await connonsql(connectiondb)
        }
        var result_query = await transaction_Schema.find({
            $and: [
                    {
                        _id:  {
                                    $in: list_transaction
                                }
                    },
                    {
                         "flow": {
                                    "$elemMatch":  {
                                        "$and": [
                                            {
                                                "action_detail" : {"$elemMatch": {"$and":[
                                                                                            {
                                                                                                "account_id": account_id,
                                                                                                "status": "Incomplete",
                                                                                                "status_actiondetail": "W",
                                                                                                "status_endtask" : true
                                                                                             }
                                                                                             
                                                                                        ]
                                                                                   }
                                                                    }
                                            },
                                            {
                                                "status": "W"
                                            }
                                        ]
                                    } 
                                }
                    }
                ]
        })
        if (result_query.length == list_transaction.length){
            var tmp_data = {
                status_endtask : true,
                account_id : account_id,
            }
            return [true,tmp_data]
        }
        else{
            var tmp_data = {
                status_endtask : false,
                account_id : account_id,
            }
            return [true,tmp_data]
        }

    } catch (error) {
        return [false, String(error)]
    }
};





module.exports = {
    CreateUpdateGroupSumTemp,
    CreateGroupSummary,
    GetSummaryGroup,
    GetStatusSummaryGroup,
    GetSummaryGroupOne,
    GetSummaryGroupFind,
    // GetSummaryGroupFilter,
    GetSummaryGroupDateTime,
    GetSummaryGroupFilterDatetime,
    FindTransactionIdtoDoc,
    UpdateGroupSummaryFromId,
    MultiSign,
    UpdateGroupSummaryProcessId,
    GetProcessId,
    CreateGroupSummary_V2,
    EndtaskGroup,
    find_endtask_status
}