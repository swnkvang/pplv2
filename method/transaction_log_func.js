require('../config/lib')
require('../config/global')

const {
    querySql
} = require('../config/maria_db')

async function insert_transaction_sign(request,url,username,result_listService,status,transaction_id,step_sign,index_sign,connectiondb,time_duration) {
    try {
        request = JSON.stringify(request)
        result_listService = JSON.stringify(result_listService)
        datetime = new Date()
        var sql = {
            sql:`INSERT INTO tb_transaction_sign (request,url,username,response,status,datetime,transaction_id,step_sign,index_sign,time_duration_ms) VALUES (?,?,?,?,?,?,?,?,?,?)`,
            values:[request,url,username,result_listService,status,datetime,transaction_id,step_sign,index_sign,time_duration]
            }
        result_insert = await querySql(connectiondb,sql)
        return [200,'update_success']
    } catch (error) {
        console.log('error',error)
        console.log(error.stack);
        return {
            result: 'ER',
            message: error.message,
            status_code:200
        }
    }
}

async function insert_jws_sign(transaction_id,jwsdata,step_sign,index_sign,pdfdata,type,username,status,connectiondb,use_status) {
    try {
        var sql_sel = {
            sql:'SELECT id,transaction_id FROM tb_jws_sign WHERE transaction_id ="'+transaction_id+'" AND step_sign = "'+step_sign+'" AND index_sign = "'+index_sign+'"',
            values:[transaction_id,jwsdata,step_sign,index_sign,pdfdata,type,username,status,use_status]
        }
        result_sel = await querySql(connectiondb,sql_sel)
        
        if (result_sel.length != 0) {
            let sql_update = {
                sql:`UPDATE tb_jws_sign SET jwsdata = ? WHERE transaction_id = ? AND index_sign = ? AND step_sign = ?`,
                values:[jwsdata,transaction_id,index_sign,step_sign]
            }
            res_update = await querySql(connectiondb,sql_update)
            return [true,res_update]
        } else {
            let sql_insert = {
                sql:`INSERT INTO tb_jws_sign (transaction_id,jwsdata,step_sign,index_sign,pdfdata,type,username,status,use_status) VALUES (?,?,?,?,?,?,?,?,?)`,
                values:[transaction_id,jwsdata,step_sign,index_sign,pdfdata,type,username,status,use_status]
            }
            res_insert = await querySql(connectiondb,sql_insert)
            if (res_insert===undefined){
                retuen [false,"sign error"]
            }else{
                return [true,res_insert]
            }
        } 
    } catch (error) {
        console.log(error);
        return [false,error]
    }
}

module.exports = {
    insert_transaction_sign,
    insert_jws_sign
}