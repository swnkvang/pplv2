require('../config/lib')
const {transactiongroupModel} = require('../schema/transaction_group.sch');
const action_workflow = require('../database/actiondb_workflow');
const {connonsql} = require('../config/mongo_db');
const db_transaction = require('../database/actiondb_transaction');
// const Flow = require('../method/process_flow');
const func_doc = require('../function/func_docuement') 
const actiontransaction = require('../database/actiondb_transaction')
const insertlogdoc = require('../database/db_document_log')
const func_html = require('../function/func_dataTohtml')
const func_hash = require('../function/func_hash')
const Trans_doc = require('../schema/transaction_document')

var createValue_inDetailGroup = async function (detail_in_group,newobj_tmp) {
    try {
        for (let i=0;i<detail_in_group.length;i++) {
            let create_new_key = detail_in_group[i].create_new_key
            if (create_new_key.length != 0) {
                for (let k=0;k<create_new_key.length;k++) {
                    let key_name = create_new_key[k].key_name
                    let self = create_new_key[k].self
                    let ref = create_new_key[k].ref
                    let default_ = create_new_key[k]. default
                    detail_in_group[i][key_name] = default_
                    if (self == true) {
                        let idx = newobj_tmp.findIndex(x => x.doctype === detail_in_group[i].document_type)
                        if (idx >= 0) {
                            for (const property in newobj_tmp[idx]) {
                                console.log(property,key_name)
                                if (property == key_name) {
                                    detail_in_group[i][key_name] = newobj_tmp[idx][property]
                                }
                            }
                        } else {
                            detail_in_group[i][key_name] = default_
                        }
                    } else if (ref == true) {
                        let idx_main = detail_in_group.findIndex(x => x.relevance_type === 'main')
                        if (idx_main >= 0) {
                            detail_in_group[i][key_name] = detail_in_group[idx_main][key_name]
                        }
                    }
                }
            }
        }
        return [true,detail_in_group]
    } catch (error) {
        console.log(error.message)
        return [false,error.message]
    }
}

var func_takeout_document = async function (json_data,group_id,doctype,token) {
    try {
        let one_result_data = json_data.one_result_data
        let User_account_id = one_result_data.id
        let arr_takeout = []
        let taxid = json_data.db_connect.t
        let firstDate = new Date()
        if (doctype == 'QT' || doctype == 'QT_TEST2') {
            var result_tran_group = await select_transactiongroup(json_data,group_id)
            // console.log('result_tran_group',result_tran_group)
            if (result_tran_group[0]) {
                var data = result_tran_group[1]
                let status = data.status
                let list_transaction = data.list_transaction
                let idx_qt = data.detail.findIndex(x => x.document_type === doctype)
                // console.log('idx_qt',idx_qt)
                if (idx_qt > 0) {
                    let document_success = data.detail[idx_qt].document_success
                    // console.log('document_success',document_success)
                    for (let u=0; u<list_transaction.length; u++) {
                        if (list_transaction[u].document_id != document_success) {
                            if (list_transaction[u].doctype != 'CS' || (list_transaction[u].doctype != 'CS_TEST2')) {
                                arr_takeout.push(list_transaction[u].transaction_id)
                            }
                        }
                    }
                    
                    // var res_update = await Trans_doc.updateMany(
                    //     { _id: { $in: arr_takeout }, $or : [{doctype : 'QT'},{doctype : 'QT_TEST2'},{status : { $ne: 'CANCLE'}}]},
                    //     { $set: { 
                    //                 "status_document" : 'R'
                    //             } 
                    //         }
                    // )
                    var res_update = await Trans_doc.updateMany(
                        { _id: { $in: arr_takeout }, 
                        $and : [
                            { $or : [{doctype : 'QT'},{doctype : 'QT_TEST2'}]},
                            {"status_document" : "N"},
                            {"status" : {"$ne": "CANCEL"}} 
                        ]
                        },
                        { $set: { 
                                    "status_document" : 'R'
                                } 
                        },
                        {
                            _id: 1
                        }

                    )
                    // console.log('res_update5678',res_update)
                    var id_log = String(uuid())
                    var RequestData = {
                        transaction_id: String(arr_takeout),
                        status_document: 'R'
                    }
                    let secondDate = new Date()
                    let timeDifference = Math.abs(secondDate.getTime() - firstDate.getTime());
                    let jsonResult = {
                        message:res_update,
                        status: true
                    }
                    let jsonSaveData = {
                        id: id_log,
                        url: "/function/func_takeout_document",
                        token: token,
                        tax_id: taxid,
                        datetime: "",
                        account_id: User_account_id,
                        body: RequestData,
                        query: "",
                        params: "",
                        response: jsonResult,
                        time_duration: String(timeDifference) + " ms",
                        statusCode: "200"
                    }
                    let result_insert_log= await actiontransaction.insert_logtransac(jsonSaveData, taxid)
                    console.log('result_insert_log',result_insert_log)
                }
            
            }
        }
       
        return [true]
    } catch (err) {
        console.log(err)
        return [false,err]
    }
} 

async function insert_transactiongroup(json_data,id_workflow,transaction_id,document_type,document_id,newobj_tmp){
    try {
        const dbconfig = json_data.db_connect
        await connonsql(dbconfig)
        const result_workflow = await action_workflow.select_workflow(json_data,id_workflow)
        if (result_workflow[0]){
            const result_document = await db_transaction.find_transaction(dbconfig,transaction_id)
            if (result_document[0]){
                const body = result_document[1].body
                const subject = result_document[1].subject
                const doctype = result_document[1].doctype
                const flow = result_document[1].flow
                let detail = result_workflow[1].detail
                check_index = flow.findIndex(x => x.action === "generate")
                for (i=0;i<detail.length;i++){
                    if (detail[i].document_type===doctype){
                        detail[i].index_generate = check_index+1
                    }
                }
                let resdetail = await createValue_inDetailGroup(detail,newobj_tmp)
                if (resdetail[0]) {
                    detail = resdetail[1]
                } else {
                    return [false,resdetail[1]]
                }
                var data_transac = {
                    doctype:document_type,
                    transaction_id:transaction_id,
                    document_id:document_id,
                    body:body,
                    subject:subject
                }
                var data = {
                    detail:detail,
                    list_transaction:[data_transac],
                    step_now:1,
                    step_max:detail.length,
                    id_workflow:id_workflow,
                    status:"N"
                }
                let newdocument = new transactiongroupModel (data)
                var Value = await newdocument.save()
                return [true,Value._id]
            }else{
                return [false,result_document[1]]
            }
        }else{
            return [false,result_workflow[1]]
        }
    } catch (error) {
        console.log(error)
        return [false,error]
    }

}

async function select_transactiongroup(json_data,group_id){
    try {
        const dbconfig = json_data.db_connect
        await connonsql(dbconfig)
        const result_trasaction = await transactiongroupModel.findOne({_id:group_id})
        if (result_trasaction.length!==0){
            return [true,result_trasaction]
        }else {
            return [false,'not found detail']
        }
    } catch (error) {
        console.log(error)
        return [false,error]
    }

}

async function update_generate(json_data,json_update,transaction_gen,ref_qt,token){
    try {
        const dbconfig = json_data.db_connect
        var result_document_gen = await db_transaction.find_transaction(dbconfig,transaction_gen)
        let flow_doc = result_document_gen[1].flow
        let User_account_id =  result_document_gen[1].sender_account
        let step_now = result_document_gen[1].step_now
        let step_max = result_document_gen[1].step_max
        let input = result_document_gen[1].input_data
        let doctype = result_document_gen[1].doctype
        let document_id = result_document_gen[1].document_id
        var reshtml = result_document_gen[1].html
        var hash_html = result_document_gen[1].hash_html
        if (doctype == 'CS' || doctype == 'CS_TEST' || doctype == 'CS_TEST2') {
            let inputparam = JSON.parse(JSON.stringify(input))
            reshtml = await func_html.genHtmlCs(inputparam,document_id,String(ref_qt))
            reshtml = reshtml.replace(/\n/g, "")
            hash_html = await func_hash.sha512(reshtml)
        } 
        // data for save log upda
        var id_log = String(uuid())
        var RequestData = {
            transaction_id: transaction_gen,
            json_update: json_update,
            flow_doc: flow_doc,
            User_account_id: User_account_id,
            step_max: step_max,
            step_now: step_now
        }
        let taxid = dbconfig.t
        let firstDate = new Date()
        
        // 
        let res_update_generate = await func_doc.updateflowdoc_by_system(json_update,flow_doc,User_account_id,step_max,step_now)
        if (res_update_generate[0]) {
            // time ในการทำงานของ function 
            let secondDate = new Date()
            let timeDifference = Math.abs(secondDate.getTime() - firstDate.getTime());
            // 
            result_document_gen[1].flow = res_update_generate[1].flow_doc
            result_document_gen[1].step_now =  res_update_generate[1].step_now
            result_document_gen[1].html = reshtml
            result_document_gen[1].hash_html = hash_html
            result_document_gen[1].ref_document = ref_qt
            var arrlog = res_update_generate[1].arrlog
            var res_update = await actiontransaction.update_transaction(dbconfig,transaction_gen,result_document_gen[1])
            if (res_update[0]) {
                for (let r=0;r<arrlog.length;r++) {
                    arrlog[r].id_transaction = transaction_gen
                    result = await insertlogdoc.insert_tb_document_log(json_data,arrlog[r])
                }
            }
            // data for save log
            let jsonResult = {
                status: res_update[0],
                transaction_id: transaction_gen,
                message: {
                    message1: res_update[1],
                    message2: res_update[2]
                }
            }
            let jsonSaveData = {
                id: id_log,
                url: "/function/update_generate",
                token: token,
                tax_id: taxid,
                datetime: "",
                account_id: User_account_id,
                body: RequestData,
                query: "",
                params: "",
                response: jsonResult,
                time_duration: String(timeDifference) + " ms",
                statusCode: "200"
            }
            actiontransaction.insert_logtransac(jsonSaveData, taxid)
            return [true,'success']
        } else {
            return [false,res_update_generate[1]]
        }
        
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

async function update_transactiongroup(json_data,group_id,transaction_id,token){
    try{
        const dbconfig = json_data.db_connect
        await connonsql(dbconfig)
        const result_document = await db_transaction.find_transaction(dbconfig,transaction_id)
        if (result_document[0]){
            var document_id_tran = result_document[1].document_id
            const result_transaction = await select_transactiongroup(json_data,group_id)
            if (result_transaction[0]){
                var doctype = result_document[1].doctype
                var status_document = result_document[1].status_document
                const body = result_document[1].body
                const subject = result_document[1].subject
                var document_id = document_id_tran
                var step_now = result_transaction[1].step_now
                var step_max = result_transaction[1].step_max
                var step_new = step_now
                let detail = result_transaction[1].detail
                let list_transaction = result_transaction[1].list_transaction
                var status = result_transaction[1].status
                var flow_doc = result_document[1].flow
                var taxid = result_document[1].taxid
                var status_group_node = false
                let status_node_flow = "W"
                if (status_document!='Y'){
                    for (let i=0;i<flow_doc.length;i++) {
                        status_group_node = flow_doc[i].status_group_node
                        if (status_group_node === true){
                            status_node_flow = flow_doc[i].status
                        }
                    }
                    if (status_node_flow=='Y'){
                        var check_data = list_transaction.find(transaction => transaction.document_id === document_id)
                        if (check_data!=undefined){
                            if (step_now !== step_max){
                                step_new = step_now+1
                                for (i=0;i<detail.length;i++) {
                                    var index = detail[i].index
                                    if (detail[i].hasOwnProperty('status_generate')){
                                        if (detail[i].document_type===doctype){
                                            detail[i].status_generate = "N"
                                        }else if (index===step_new){
                                            detail[i].status_generate = "Y"
                                        } else{
                                            detail[i].status_generate = "N"
                                        }
                                    }else{
                                        if (detail[i].document_type===doctype){
                                            detail[i].status = "Y"
                                        }else if (index===step_new){
                                            detail[i].status = "W"
                                        } else{
                                            detail[i].status = "I"
                                        }
                                    }
                                }
                            }else{
                                for (i=0;i<detail.length;i++) {
                                    var index = detail[i].index
                                    if (detail[i].document_type===doctype){
                                        if (detail[i].hasOwnProperty('status_generate')){
                                            detail[i].status_generate = "N"
                                            // detail[i].status = "Y"
                                        }else{
                                            detail[i].status = "Y"
                                            status = 'Y'
                                        }
                                    }
                                }
                            }
                        }else{
                            return [false,"not found transactionid in group"]
                        }
                    }else{
                        for (let i=0;i<detail.length;i++) {
                            if (detail[i].document_type===doctype){
                                var limit_create = detail[i].limit_create
                                var check_lenght = list_transaction.filter(transaction => transaction.doctype === detail[i].document_type).length
                                if (check_lenght<limit_create){
                                    var data = {
                                        doctype:doctype,
                                        transaction_id:transaction_id,
                                        document_id:document_id,
                                        body:body,
                                        subject:subject
                                    }
                                    index = list_transaction.findIndex(x => x.document_id === document_id)
                                    if (index==-1){
                                        list_transaction.push(data)
                                        if (check_lenght+1>=limit_create &&limit_create!=1){
                                            detail[i].status_generate = "N"
                                        }
                                    }
                                }else{
                                    detail[i].status_generate = "N"
                                    const reuslt_update = await transactiongroupModel.findOneAndUpdate(
                                        {_id:group_id},
                                        {"$set":{detail:detail}})
                                    return [false,"Create document over the limit"]
                                }
                            }
                        }
                    }
                }else{
                    for (let i=0;i<detail.length;i++) {
                        var index = detail[i].index
                        if (detail[i].document_type===doctype){
                            detail[i].status_generate = "N"
                            detail[i].status = "Y"
                            detail[i].document_success = document_id_tran
                        }
                        console.log('eieieiei',detail[i].index_generate,detail[i].status)
                        if (detail[i].index_generate!==null && detail[i].status !== 'Y'){
                            console.log('inininin00')
                            // var index_generate = detail[i].index_generate
                            var transaction_gen = list_transaction.find(element => element.doctype === detail[i].document_type).transaction_id
                            const detail_transactiongen = await db_transaction.find_transaction(dbconfig,transaction_gen)
                            let flow_transaction_gen = detail_transactiongen[1].flow
                            var index_generate = flow_transaction_gen.findIndex(x => x.action === 'generate')
                            var json_update = [{
                                index: index_generate + 1,
                                status: "Complete"
                            }]
                            var ree_updategen = await update_generate(json_data,json_update,transaction_gen,document_id_tran,token)
                        }
                    }
                    var check_status_doc = detail.filter(transaction => transaction.status === 'Y').length
                    if (check_status_doc==step_max){
                        status = 'Y'
                    }
                }
                const reuslt_update = await transactiongroupModel.findOneAndUpdate(
                    {_id:group_id},
                    {"$set":{detail:detail,step_now:step_new,status:status,list_transaction:list_transaction}})
                if (doctype == 'QT' || doctype == 'QT_TEST2') {
                    if (status_document == 'Y') {
                        func_takeout_document(json_data,group_id,doctype,token)
                    }
                }
                const serviceMethod = require('../method/service')
                const otherProcess = require('../method/other.process')
                var Arr_tran = [transaction_id]
                serviceMethod.SendDocumentService(Arr_tran, taxid, dbconfig, json_data)
                otherProcess.GetServiceWebhookData(transaction_id,'',dbconfig, json_data)
                return [true,"success"]
            }else{
                return [false,result_transaction[1]]
            }
        }else{
            return [false,result_document[1]]
        }
    }catch (error) {
        console.log(error)
        return [false,error]
    }
}

async function get_transactiongroup(json_data,group_id){
    try {
        const dbconfig = json_data.db_connect
        await connonsql(dbconfig)
        const result_trasaction = await transactiongroupModel.findOne({_id:group_id})
        if (result_trasaction.length!==0){
            let detail = result_trasaction.detail
            return [true,result_trasaction]
        }else {
            return [false,'not found detail']
        }
    } catch (error) {
        console.log(error)
        return [false,error]
    }

}

module.exports = {
    insert_transactiongroup,
    select_transactiongroup,
    update_transactiongroup,
    get_transactiongroup,
    createValue_inDetailGroup
}