require("../config/lib")
// require("../configs/maria_db")
const {querySql} = require("../config/maria_db")

async function insert_transactionlog_input(json_data,input_document,html,documemt_id,index) {
    try {
        const dbconfig = json_data.db_connect
        var str_input_document = JSON.stringify(input_document)
        var sql = {
            sql:`INSERT INTO tb_transactionlog_input (input_document,html,document_id,index_now) VALUES (?,?,?,?);`,
            values:[str_input_document, html, documemt_id, index]
        }
        result_insert = await querySql(dbconfig,sql)
        return [true,'success']
    } 
    catch (err) {
      console.log(err)
      return [false,err]
    } 
}

  
module.exports = {
    insert_transactionlog_input
}