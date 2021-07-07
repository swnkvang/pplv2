require('../config/global')
const {querySql} = require("../config/maria_db")

async function insert_tb_comment(json_data,id_transaction,index_transaction,action_comment,detail_comment) {
    try {
        const dbconfig = json_data.db_connect
        var one_result_data = json_data.one_result_data
        var account_id = one_result_data.id
        let sqlcomment = {
          sql:`INSERT INTO tb_comment (id_transaction, actor, index_in_transaction, action_comment, detail_comment) VALUES (?,?,?,?,?)`,
          values: [id_transaction, account_id, index_transaction, action_comment, detail_comment]
      }
        var res_insert = await querySql(dbconfig,sqlcomment)
        return [true,res_insert]
    } 
    catch (err) {
      console.log(err)
      return [false,err]
    } 
}

  
module.exports = {
    insert_tb_comment
}