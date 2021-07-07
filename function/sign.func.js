require('../config/lib')
require('../config/global')
require('../callAPI/axiosAPI')
const {
    connonsql
} = require('../config/mongo_db')
const {querySql} = require("../config/maria_db")
const transactionlog = require('../method/transaction_log_func')
const Trans_doc = require('../schema/transaction_document')

async function jsonPdfSigning_v1(base64pdf,document_id,sadData,cadData,reason,location,certifyLevel,hashAlgorithm,overwriteOriginal,visibleSignature,visibleSignaturePage,visibleSignatureRectangle,visibleSignatureImagePath,token_header,sign_position,username,transaction_id,step_sign,index_sign,arrlist,connectiondb){
    payload = ''
    one_access_token = ''
    var time_duration = ''
    var jwsData = null
    var pdfdata = null
    var type = 'pdfsing'
    var status = null
    var use_status = 'ACTIVE'
    try {
        visibleSignatureRectangle = '' + sign_position['sign_llx'] + ',' + sign_position['sign_lly'] + ',' + sign_position['sign_urx'] + ',' + sign_position['sign_ury'] + ''
        visibleSignaturePage = Number(sign_position['sign_page'])
        payload = {
            "sadData": sadData,
            "cadData": cadData,
            "documentId": document_id,
            "bcResponseURL": "",
            "signatureContent": "",
            "signatureAppearance": {
              "reason": reason,
              "location": location,
              "certifyLevel": certifyLevel,
              "hashAlgorithm": hashAlgorithm,
              "overwriteOriginal": overwriteOriginal,
              "visibleSignature": visibleSignature,
              "visibleSignaturePage": visibleSignaturePage,
              "visibleSignatureRectangle": visibleSignatureRectangle,
              "visibleSignatureImagePath": visibleSignatureImagePath
            },
            "signatureList": arrlist,
            "pdfData": base64pdf
        }
        // return[false,payload]
        var result_call = await Call.callPost_v2(url_jsonpdf_v1,token_header,payload)
        time_duration = result_call.time_duration
        if (result_call.result == 'OK'){
            jwsData = result_call.msg.jwsData
            pdfdata = result_call.msg.pdfData
            status = 'OK'
            res_insert_jws = await transactionlog.insert_jws_sign(transaction_id,jwsData,step_sign,index_sign,pdfdata,type,username,status,connectiondb,use_status)
            result_insert_log = transactionlog.insert_transaction_sign(payload,url_jsonpdf_v1,username,result_call.msg,result_call.result,transaction_id,step_sign,index_sign,connectiondb,time_duration)
            return { result : "OK" ,msg: result_call.msg}
        }     
        else{
            status = 'ER'
            res_insert_jws = transactionlog.insert_jws_sign(transaction_id,jwsData,step_sign,index_sign,pdfdata,type,username,status,connectiondb,use_status)
            result_insert_log = transactionlog.insert_transaction_sign(payload,url_jsonpdf_v1,username,result_call.msg,result_call.result,transaction_id,step_sign,index_sign,connectiondb,time_duration)
            return { result : "ER" ,msg: result_call.msg}
        }
        
    } catch (error) {
        console.log('error:',error)
        status = 'ER'
        res_insert_jws = transactionlog.insert_jws_sign(transaction_id,jwsData,step_sign,index_sign,pdfdata,type,username,status,connectiondb,use_status)
        result_insert_log = transactionlog.insert_transaction_sign(payload,url_pdfSigning_Sign_v3,username,error.message,'ER',transaction_id,step_sign,index_sign,connectiondb,time_duration)
        return {
            result: 'ER',
            message: error.message,
            status_code:400
        }
    }

}

async function signing_json_v1(document_id,sadData,cadData,reason,location,certifyLevel,hashAlgorithm,overwriteOriginal,visibleSignature,visibleSignaturePage,visibleSignatureRectangle,visibleSignatureImagePath,token_header,sign_position,username,transaction_id,step_sign,index_sign,connectiondb){
    payload = ''
    one_access_token = ''
    var time_duration = ''
    var jwsData = null
    var pdfdata = null
    var type = 'jsonsign'
    var status = null
    var use_status = 'ACTIVE'
    try {
        visibleSignatureRectangle = '' + sign_position['sign_llx'] + ',' + sign_position['sign_lly'] + ',' + sign_position['sign_urx'] + ',' + sign_position['sign_ury'] + ''
        visibleSignaturePage = Number(sign_position['sign_page'])
        payload = {
            "sadData": sadData,
            "cadData": cadData,
            "documentId": document_id,
            "bcResponseURL": "",
            "signatureContent": "",
            "signatureAppearance": {
                "reason": reason,
                "location": location,
                "certifyLevel": certifyLevel,
                "hashAlgorithm": hashAlgorithm,
                "overwriteOriginal": overwriteOriginal,
                "visibleSignature": visibleSignature,
                "visibleSignaturePage": visibleSignaturePage,
                "visibleSignatureRectangle": visibleSignatureRectangle,
                "visibleSignatureImagePath": visibleSignatureImagePath
            }
        }
        var result_call = await Call.callPost_v2(url_jsonsigning_v1,token_header,payload)
        time_duration = result_call.time_duration
        if (result_call.result == 'OK'){
            jwsData = result_call.msg.jwsData
            status = 'OK'
            res_insert_jws = await transactionlog.insert_jws_sign(transaction_id,jwsData,step_sign,index_sign,pdfdata,type,username,status,connectiondb,use_status)
            if (!res_insert_jws[0]){
                return {
                    result: 'ER',
                    message: "ไม่สามารถเก็บข้อมูลการเซ็นได้",
                    status_code:400
                }
            }
            result_insert_log = transactionlog.insert_transaction_sign(payload,url_jsonsigning_v1,username,result_call.msg,result_call.result,transaction_id,step_sign,index_sign,connectiondb,time_duration)
            return { result : "OK" ,msg: result_call.msg}
        }     
        else{
            status = 'ER'
            res_insert_jws = transactionlog.insert_jws_sign(transaction_id,jwsData,step_sign,index_sign,pdfdata,type,username,status,connectiondb,use_status)
            result_insert_log = transactionlog.insert_transaction_sign(payload,url_jsonsigning_v1,username,result_call.msg,result_call.result,transaction_id,step_sign,index_sign,connectiondb,time_duration)
            return { result : "ER" ,msg: result_call.msg}
        }
        
    } catch (error) {
        console.log('error:',error)
        status = 'ER'
        res_insert_jws = transactionlog.insert_jws_sign(transaction_id,jwsData,step_sign,index_sign,pdfdata,type,username,status,connectiondb,use_status)
        result_insert_log = transactionlog.insert_transaction_sign(payload,url_pdfSigning_Sign_v3,username,error.message,'ER',transaction_id,step_sign,index_sign,connectiondb,time_duration)
        return {
            result: 'ER',
            message: error.message,
            status_code:400
        }
    }

}

async function credentials_list_v2(data_decry,userId,userName,maxResults,pageToken,cliendData,token_header,user_name,transaction_id,step_sign,index_sign) {
    time_duration = ''
    var connectiondb = data_decry.db_connect
    try {
        payload =  {
            "userId":   userId,
            "userName": userName,
            "maxResults": maxResults,
            "pageToken": pageToken,
            "cliendData": cliendData
        }
        result_call = await Call.callPost_v2(url_credentials_list_v2,token_header,payload)
        time_duration = result_call.time_duration
        if (result_call.result == 'OK'){
            result_insert_log = transactionlog.insert_transaction_sign(payload,url_credentials_list_v2,user_name,result_call.msg,result_call.result,transaction_id,step_sign,index_sign,connectiondb,time_duration)
            return { result : "OK" ,msg: result_call.msg, status_Code:200}
        }     
        else{
            result_insert_log = transactionlog.insert_transaction_sign(payload,url_credentials_list_v2,user_name,result_call.msg,result_call.result,transaction_id,step_sign,index_sign,connectiondb,time_duration)
            return { result : "ER" ,msg: result_call.msg, status_Code:200}
        }

        
    } catch (error) {
        console.log(error);
        result_insert_log = transactionlog.insert_transaction_sign(payload,url_credentials_list_v2,user_name,error.message,'ER',transaction_id,step_sign,index_sign,connectiondb,time_duration)        
        return {
            result: 'ER',
            message: error.message,
            status_code:400
        }
    }
}

async function credentials_authorize_v2(data_decry,credentialId,credentialAuthorizationData,numSignatures,hash_data,description,clientData,pin,otp,token_header,username,transaction_id,step_sign,index_sign){
    time_duration = ''
    var connectiondb = data_decry.db_connect
    try {
        payload =  {
            "credentialId": credentialId,
            "credentialAuthorizationData": credentialAuthorizationData,
            "numSignatures": numSignatures,
            "hash": [hash_data],
            "description": description,
            "clientData": clientData,
            "pin": pin,
            "otp": otp
        }
        result_call = await Call.callPost_v2(url_credentials_authorize_v2,token_header,payload)
        time_duration = result_call.time_duration
        if (result_call.result == 'OK'){
            result_insert_log = transactionlog.insert_transaction_sign(payload,url_credentials_authorize_v2,username,result_call.msg,result_call.result,transaction_id,step_sign,index_sign,connectiondb,time_duration)
            return { result : "OK" ,msg: result_call.msg}
        }     
        else{
            result_insert_log = transactionlog.insert_transaction_sign(payload,url_credentials_authorize_v2,username,result_call.msg,result_call.result,transaction_id,step_sign,index_sign,connectiondb,time_duration)
            return { result : "ER" ,msg: result_call.msg}
        }

        
    } catch (error) {
        result_insert_log = transactionlog.insert_transaction_sign(payload,url_credentials_authorize_v2,username,error.message,'ER',transaction_id,step_sign,index_sign,connectiondb,time_duration)
        console.log(error);
        return {
            result: 'ER',
            message: error.message,
            status_code:400
        }
    }

}

async function signing_pdfSigning_v3(json_data,pdfData,sadData,cadData,reason,location,certifyLevel,hashAlgorithm,overwriteOriginal,visibleSignature,visibleSignaturePage,visibleSignatureRectangle,visibleSignatureImagePath,token_header,sign_position,sign_string,username,transaction_id,step_sign,index_sign){
    payload = ''
    one_access_token = ''
    time_duration = ''
    var connectiondb = json_data.db_connect
    try {
        visibleSignatureRectangle = '' + sign_position['sign_llx'] + ',' + sign_position['sign_lly'] + ',' + sign_position['sign_urx'] + ',' + sign_position['sign_ury'] + ''
        // console.log('visibleSignatureRectangle:',visibleSignatureRectangle)
        visibleSignaturePage = Number(sign_position['sign_page'])
        payload =  {
            "pdfData": pdfData,
            "sadData": sadData,
            "cadData": cadData,
            "reason": reason,
            "location": location,
            "certifyLevel": certifyLevel,
            "hashAlgorithm": hashAlgorithm,
            "overwriteOriginal": true,
            "visibleSignature": "Graphics",
            "visibleSignaturePage": visibleSignaturePage,
            "visibleSignatureRectangle": visibleSignatureRectangle,
            "visibleSignatureImagePath": sign_string
        }
        result_call = await Call.callPost_v2(url_pdfSigning_Sign_v3,token_header,payload)
        time_duration = result_call.time_duration
        if (result_call.result == 'OK'){
            result_insert_log = transactionlog.insert_transaction_sign(payload,url_pdfSigning_Sign_v3,username,result_call.msg,result_call.result,transaction_id,step_sign,index_sign,connectiondb,time_duration)
            return { result : "OK" ,msg: result_call.msg}
        }     
        else{
            result_insert_log = transactionlog.insert_transaction_sign(payload,url_pdfSigning_Sign_v3,username,result_call.msg,result_call.result,transaction_id,step_sign,index_sign,connectiondb,time_duration)
            return { result : "ER" ,msg: result_call.msg}
        }
        
    } catch (error) {
        console.log('error:',error)
        result_insert_log = transactionlog.insert_transaction_sign(payload,url_pdfSigning_Sign_v3,username,error.message,'ER',transaction_id,step_sign,index_sign,connectiondb,time_duration)
        return {
            result: 'ER',
            message: error.message,
            status_code:400
        }
    }

}

async function getSign_createNote(json_data, pdfData, noteDisplayPage, sign_position, noteDisplayImage, noteTitle, noteText, password, token_header,username,transaction_id,step_sign,index_sign){
    payload = ''
    one_access_token = ''
    time_duration = ''
    var connectiondb = json_data.db_connect
    try {
        noteDisplayRectangle = '' + sign_position['sign_llx'] + ',' + sign_position['sign_lly'] + ',' + sign_position['sign_urx'] + ',' + sign_position['sign_ury'] + ''
        // console.log('visibleSignatureRectangle:',visibleSignatureRectangle)
        visibleSignaturePage = Number(sign_position['sign_page'])
        
        var payload = {
            pdfData: pdfData,
            noteDisplayPage: (noteDisplayPage),
            noteDisplayRectangle: noteDisplayRectangle,
            noteDisplayImage: noteDisplayImage,
            noteTitle: noteTitle,
            noteText: noteText,
            // password: password
        }
        result_call = await Call.callPost_v2(url_CaList,token_header,payload)
        time_duration = result_call.time_duration
        if (result_call.result == 'OK'){
            result_insert_log = transactionlog.insert_transaction_sign(payload,url_pdfSigning_Sign_v3,username,result_call.msg,result_call.result,transaction_id,step_sign,index_sign,connectiondb,time_duration)
            return { result : "OK" ,msg: result_call.msg}
        }     
        else{
            result_insert_log = transactionlog.insert_transaction_sign(payload,url_pdfSigning_Sign_v3,username,result_call.msg,result_call.result,transaction_id,step_sign,index_sign,connectiondb,time_duration)
            return { result : "ER" ,msg: result_call.msg}
        }
        
    } catch (error) {
        console.log('error:',error)
        result_insert_log = transactionlog.insert_transaction_sign(payload,url_pdfSigning_Sign_v3,username,error.message,'ER',transaction_id,step_sign,index_sign,connectiondb,time_duration)
        return {
            result: 'ER',
            message: error.message,
            status_code:400
        }
    }

}

async function select_data_sign_pdf(account_id,transaction_id,connectiondb){
    if (connectiondb != null) { await connonsql(connectiondb) }
    try {
        list_recp = []
        queryyyy = await Trans_doc.findOne({
            $or: [{
                $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id,status: 'W'}}}]                      
            },{
                $and: [{flow: {$elemMatch: {"actor.account_id": account_id,status: 'W'}}}] 
                }],
            $and : [
                {
                    status : 'ACTIVE'
                },
                {
                    _id : transaction_id
                }
                // {flow: {$elemMatch: {"action_detail.account_id": account_id,status: 'W'}}}
            ]
                    
        })
        if (queryyyy == [] || queryyyy == null){
            return [400,'Not found data']
        }
        else{
            return [200,queryyyy]
        }
        
    } 
    catch (error) {
        console.log('error:',error)
        return [400,error.message]
        // return {
        //     result: 'ER',
        //     message: error.message,
        //     status_code:400
        // }
    }

}

async function select_string_sign(account_id,connectiondb) {
    try {
        var sql_text = {
            sql:`SELECT p_sign FROM tb_sign_account WHERE p_userid = ?`,
            values:[account_id]
          }
        result_select = await querySql(connectiondb,sql_text)
        if (!(result_select.length == 0)){
            return [200,result_select[0]]
        }
        else {
            return [400,'Not found account_id']
        }
        
    } 
    catch (error) {
        console.log(error.stack);
        return [400,error]
    }
}

async function insert_string_sign(account_id,sign_info,json_data) {
    try {
        var connectiondb = json_data.db_connect
        var username = json_data.one_result_data.username
        var sql_text = {
            sql:`SELECT p_sign FROM tb_sign_account WHERE p_userid = ?`,
            values:[account_id]
          }
        result_select = await querySql(connectiondb,sql_text)
        if (result_select.length == 0) {
            let sqlinsert = {
                sql: 'INSERT INTO tb_sign_account (p_userid,p_username,p_sign) VALUES (?,?,?)',
                values: [account_id,username,sign_info]
            }
            result_insert = await querySql(connectiondb, sqlinsert)
            return [200,'insert success']
        } else {
            let sqlupdate = {
                sql: 'UPDATE tb_sign_account SET p_sign = ? \
                WHERE p_userid = ?',
                values: [sign_info,account_id]
            }
            result_update = await querySql(connectiondb, sqlupdate)
            return [200,'update success']
        }
    } 
    catch (error) {
        console.log(error.stack);
        return [400,error]
    }
}

module.exports = {
    credentials_list_v2,
    credentials_authorize_v2,
    signing_pdfSigning_v3,
    select_data_sign_pdf,
    select_string_sign,
    getSign_createNote,
    signing_json_v1,
    jsonPdfSigning_v1,
    insert_string_sign
}