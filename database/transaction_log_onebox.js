require("../config/lib")
// require("../configs/maria_db")
require('../config/global')
const {
    querySql
} = require("../config/maria_db")

async function insert_transaction_onebox_service(dbconfig, account_id, payload, result_data, status, url, time_duration,account_id_one) {
    try {
        var request = JSON.stringify(payload)
        var response = JSON.stringify(result_data)
        var sql = {
            sql: `INSERT INTO tb_transaction_onebox(account_id_onebox, request, response, status, url, time_duration ,account_id_ppl) VALUES (?,?,?,?,?,?,?)`,
            values: [account_id, request, response, status, url, time_duration,account_id_one]
        }
        await querySql(dbconfig, sql)
        return [true]
    } catch (error) {
        console.log(error)
        return [false, String(error)]
    }
}

module.exports = {
    insert_transaction_onebox_service
}