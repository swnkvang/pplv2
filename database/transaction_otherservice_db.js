require("../config/lib")
// require("../configs/maria_db")
const {querySql} = require("../config/maria_db")

async function insert_transaction_other_service(json_data,request,url,response,status,time_duration_ms,transaction_id) {
    try {
        var str_request = null
        var dbconfig = null
        if (json_data.hasOwnProperty('db_connect')){
            dbconfig = json_data.db_connect
        }else{
            let token = json_data.body.token
            let tax_id =  json_data.body.tax_id
            let r = await sodium_ppl.login_service(token,tax_id)
            dbconfig = r[1].db_data
            // console.log(r)
        }
        // console.log(dbconfig)
        if (request != null || request != undefined){
            str_request = JSON.stringify(request)
        }
        var str_response = JSON.stringify(response)
        var sql = {
            sql:`INSERT INTO tb_transaction_other_service (request,url,response,status,time_duration_ms,transaction_id) VALUES (?,?,?,?,?,?);`,
            values:[str_request,url,str_response,status,time_duration_ms,transaction_id]
        }
        result_insert = await querySql(dbconfig,sql)
        return [true,'success']
    } 
    catch (err) {
      console.log(err)
      return [false,err]
    } 
}

async function insert_transactionlog_attachfile(json_data,tax_id) {
    try {
        var transaction_id = null
        let arrbizUser_Select = []
        if (json_data.url=='/attachfile/api/v1/add_files'){
            transaction_id = json_data.body.transaction_id
        }else{
            transaction_id = json_data.body.SummaryGroup_id
        }
        const token = json_data.token.split(' ')[1]
        let status = null
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
        var sqlinsertdoc = {
            sql:`INSERT INTO tb_transaction_attachfile (
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
          result_insert = await querySql(connectiondb,sqlinsertdoc)
        return [true,'success']
    } 
    catch (err) {
      console.log(err)
      return [false,err]
    } 
}

module.exports = {
    insert_transaction_other_service,
    insert_transactionlog_attachfile
}