require('../config/lib')
require('../config/global')
require('../config/mongo_db')
const {querySql} = require("../config/maria_db")
const transaction_Schema = require('../schema/transaction_document')
const {
    connonsql
} = require('../config/mongo_db')
const { mongo } = require('mongoose')

var find_all_document = async function(connectiondb) {
    try {
        if (connectiondb != null) { await connonsql(connectiondb) }
        let r_transaction = await transaction_Schema.find({
            $or : [{doctype: 'CS'},{doctype: "QT"}],
            
        }, {
            __v: 0
        })
        return [true,r_transaction]
    } catch (error) {
        console.log(error)
        return [false,error.message]
    }
    
}

var find_document_bytracking = async function(connectiondb,doc_no) {
    try {
        if (connectiondb != null) { await connonsql(connectiondb) }
        let r_doc = await transaction_Schema.findOne({
            document_id: doc_no,
            
        }, {
            flow: 1,
            step_now: 1,
            step_max: 1,
            groupid: 1,
            document_id: 1,
            tracking_id: 1,
            status_document: 1
        })
        if (r_doc == null) {
            let r_traking = await transaction_Schema.findOne({
                tracking_id: doc_no
                
            }, {
                flow: 1,
                step_now: 1,
                step_max: 1,
                groupid: 1,
                document_id: 1,
                tracking_id: 1,
                status_document: 1
            })
            if (r_traking == null) {
                let tmperror = {
                    msg_thai : 'ไม่พบเลขเอกสารที่ต้องการค้นหา',
                    msg_eng : 'The document number was not found.'
                }
                return[false,null,tmperror]
            }
            else {
                return[true,r_traking,null]
            }
        } else {
            return[true,r_doc,null]
        }
    } catch (error) {
        console.log(error)
        return [false,error.message,null]
    }
    
    
}

var findflow_in_transaction = async function(connectiondb,transactionid) {
    try {
        if (connectiondb != null) { await connonsql(connectiondb) }
        let r_transaction = await transaction_Schema.findOne({
            _id: transactionid,
            
        }, {
            flow: 1,
            step_now: 1,
            step_max: 1,
            groupid: 1
        })
        return [true,r_transaction]
    } catch (error) {
        console.log(error)
        return [false,error.message]
    }
    
}

var find_transaction = async function(connectiondb,transactionid) {
    try {
        // console.log('connectiondb',connectiondb)
        if (connectiondb != null) { await connonsql(connectiondb) }
        let r_transaction = await transaction_Schema.findOne({
            _id: transactionid,
            
        }, {
            __v: 0
        })
        return [true,r_transaction]
    } catch (error) {
        console.log(error)
        return [false,error.message]
    }
    
}

var find_transaction_from_documentid = async function(connectiondb,documentid) {
    try {
        if (connectiondb != null) { await connonsql(connectiondb) }
        let r_transaction = null
        if (documentid.match(/^[0-9a-fA-F]{24}$/)){
            r_transaction = await transaction_Schema.findOne({
                _id: documentid,
                
            })
        }else{
            r_transaction = await transaction_Schema.findOne({
                document_id:documentid
            })
        }
        return [true,r_transaction]
    } catch (error) {
        console.log(error)
        return [false,error.message]
    }
    
}

var update_transaction = async function(connectiondb,transactionid,data_transaction) {
    try {
        if (connectiondb != null) { await connonsql(connectiondb) }
        var resupdate = await transaction_Schema.findOneAndUpdate({
            _id: transactionid
        }, data_transaction, {
            upsert: true,
            setDefaultsOnInsert: true
        }, function (err) {
            console.log(err)
        });
        
        return [true,resupdate]
    } catch (error) {
        console.log(error)
        return [false,error.message]
    }
}

var insert_logtransac = async function(json_data,tax_id) {
    try {
        let transaction_id = null
        let token = json_data.token.split(' ')[1]
        let status = null
        var arrbizUser_Select = []
        let r = await sodium_ppl.data_login_Decrypted(token)
        if (r[0] == 400 || r[0] == 401) {
            return [false,'401']
        }
        var one_result_data = r[1].data_login.one_result_data
        let account_id = one_result_data.id
        var biz_detail = one_result_data.biz_detail
        var db_data = r[1].db_data
        var one_access_token = r[1].data_login.one_access_token
        var connectiondb = null
        for (i = 0; i < db_data.length; i++) {
            if (db_data[i].t == tax_id) {
                connectiondb = db_data[i]
                break
            }
        }
        for (y = 0; y < biz_detail.length; y++) {
            tmp_id_card_num = biz_detail[y].getbiz.id_card_num
            if (tmp_id_card_num == tax_id) {
                arrbizUser_Select.push(biz_detail[y])
            }
        }
        status = json_data.response.status
        if (json_data.url == '/flow/api/v1/update_transaction') {
            transaction_id = json_data.body.transaction_id
        } else if (json_data.url == '/flow/api/v1/to_transaction') {
            // console.log(json_data.response)
            transaction_id = json_data.response.data._id
            if (transaction_id === undefined){
                transaction_id = null
            }
        }else if(json_data.url == '/MultiSign'){
            transaction_id = json_data.body.transaction_id
            json_data.body = JSON.stringify(json_data.body)
            json_data.response = JSON.stringify(json_data.response)
        } else if (json_data.url == '/function/update_generate') {
            transaction_id = json_data.body.transaction_id
            // json_data.body = JSON.stringify(json_data.body)
            // json_data.response = JSON.stringify(json_data.response)
        } 
        else if (json_data.url == '/transaction/api/v1/refesh_input_transaction') {
            var resp = json_data.response[1]
            list_trans_id = []
            if (json_data.response[0] == true){
                resp.forEach(element => 
                    list_trans_id.push(element._id)
                )
            }
            
            status = json_data.status
            transaction_id = String(list_trans_id)
            // json_data.body = JSON.stringify(json_data.body)
            // json_data.response = JSON.stringify(json_data.response)
        } else if (json_data.url = '/function/func_takeout_document') {
            transaction_id = json_data.body.transaction_id
        }
        let sqlinsertdoc = {
          sql:`INSERT INTO tb_transaction_updatedocument (
                    transaction_id,
                    request,
                    response,
                    time_duration,
                    accountid,
                    url,
                    status) 
                VALUES (?,?,?,?,?,?,?)`,
          values: [transaction_id, JSON.stringify(json_data.body), JSON.stringify(json_data.response), json_data.time_duration, account_id, json_data.url, String(status)]
        }
        // console.log(sqlinsertdoc)

        result_insert = await querySql(connectiondb,sqlinsertdoc)
        // console.log(result_insert)
        return [true,'success']
    } 
    catch (err) {
      console.log('ERRRRR',err)
      return [false,err]
    } 
}

var update_attachfile_id = async function(connectiondb,transactionid,attachfile_id) {
    try {
        if (connectiondb != null) { await connonsql(connectiondb) }
        reuslt_transaction = await find_transaction(connectiondb,transactionid)
        if (reuslt_transaction[0]){
            var attachfile_id_transaction = reuslt_transaction[1].attachfile_id
            console.log(attachfile_id_transaction,'attachfile_id_transaction')
            if (attachfile_id_transaction===null||attachfile_id_transaction===""){
                const reuslt_update = await transaction_Schema.findOneAndUpdate(
                    {_id:transactionid},
                    {"$set":{attachfile_id:attachfile_id}})
                
                return [true,'success']
            }else{
                return [false]
            }
        }else{

        }
    } catch (error) {
        console.log(error)
        return [false,error.message]
    }
    
}

var updatetransactiion_path = async function(connectiondb,transactionid,path_pdf_sign,path_pdfhashsign) {
    try {
        if (connectiondb != null) { await connonsql(connectiondb) }
        var resupdate = await transaction_Schema.updateOne(
            { _id:  transactionid} ,
            {
                "path_pdf_sign": path_pdf_sign,
                "path_pdfhashsign": path_pdfhashsign
            }
        )
        
        return [true,resupdate]
    } catch (error) {
        console.log(error)
        return [false,error.message]
    }
}

var updatetransactiion_statusviewpdf = async function(connectiondb,transactionid,status) {
    console.log('updatetransactiion_statusviewpdf',updatetransactiion_statusviewpdf)
    try {
        if (connectiondb != null) { await connonsql(connectiondb) }
        var resupdate = await transaction_Schema.updateOne(
            { _id:  transactionid} ,
             {"status_view_pdf": status}
        )
        
        return [true,resupdate]
    } catch (error) {
        console.log(error)
        return [false,error.message]
    }
}


var self = module.exports = {
    find_transaction,
    update_transaction,
    find_transaction_from_documentid,
    findflow_in_transaction,
    insert_logtransac,
    update_attachfile_id,
    updatetransactiion_path,
    updatetransactiion_statusviewpdf,
    find_document_bytracking,
    find_all_document
}