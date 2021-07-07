require('../config/global')
const {querySql} = require("../config/maria_db")

async function select_jws_sign(dbconfig,transaction_id) {
    try {
        let typequery = 'jsonsign'
        let sqlquery = {
          sql:'SELECT createAt,index_sign,step_sign,jwsdata FROM tb_jws_sign WHERE transaction_id = "'+transaction_id+'" \
          AND type = "'+typequery+'" ORDER BY createAt ASC'
        }
        var res_query = await querySql(dbconfig,sqlquery)
        return [true,res_query]   
    } 
    catch (err) {
      console.log(err)
      return [false,err]
    } 
}

module.exports = {
    select_jws_sign,
  }