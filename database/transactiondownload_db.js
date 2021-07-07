require("../config/lib")
const {querySql} = require("../config/maria_db")

async function insert_transactiondownload(json_data,transaction_document,html_hash,pdf_base) {
    try {
        const dbconfig = json_data.db_connect
        var sql = {
            sql:`INSERT INTO tb_transactionlog_download (transaction_document,html_hash,pdf_base) VALUES (?,?,?);`,
            values:[transaction_document, html_hash, pdf_base]
        }
        result_insert = await querySql(dbconfig,sql)
        return [true,'success']
    } 
    catch (err) {
      console.log(err)
      return [false,err]
    } 
}


async function select_transactiondownload(json_data,transaction_document) {
    try {
        const dbconfig = json_data.db_connect
        var sql = {
            sql:`SELECT
                transaction_document, html_hash, pdf_base
            FROM
                tb_transactionlog_download
            WHERE
                transaction_document = ? ;`,
            values:[transaction_document]
        }
        result_select = await querySql(dbconfig,sql)
        if (result_select.length!==0){
            return [true,result_select[0]]
        }else{
            return [true,"no_data"] 
        }
    } 
    catch (err) {
      console.log(err)
      return [false,err]
    } 
}

async function update_transactiondownload(json_data,transaction_document,html_hash,pdf_base) {
    try {
        const dbconfig = json_data.db_connect
        var sql = {
            sql:`UPDATE tb_transactionlog_download SET html_hash = ?, pdf_base = ? WHERE transaction_document=?;`,
            values:[html_hash, pdf_base, transaction_document]
        }
        result_update = await querySql(dbconfig,sql)
        return [true,'success']
    } 
    catch (err) {
      console.log(err)
      return [false,err]
    } 
}


module.exports = {
    insert_transactiondownload,
    select_transactiondownload,
    update_transactiondownload
}