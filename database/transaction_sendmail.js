require('../config/lib')
require('../config/global')
const {querySql} = require("../config/maria_db")

async function insert_log_sendmail(data_decry, transaction_id, status, sender, recvier, subject, body, bcc_email, msg_error) {
   try {
    let dbconfig = data_decry.db_connect
    var sql = {
        sql:`INSERT INTO tb_transaction_sendmail
        (transaction_id, status, sender, recvier, subject, body, bcc_email, msg_error)
        VALUES( ?, ?, ?, ?, ?, ?, ?, ?);`,
        values:[transaction_id, status, sender, JSON.stringify(recvier), subject, body, JSON.stringify(bcc_email), msg_error]
    }
    result_insert = await querySql(dbconfig,sql)
   } catch(error) {
       console.log(error.message)
       return [false,error.message,null]
   }
}

module.exports = {
    insert_log_sendmail
}