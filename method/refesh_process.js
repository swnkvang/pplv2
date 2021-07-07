require('../config/lib')
require('../config/global')
const transactiongroup_db = require('../database/transaction_group')
const update_db = require('../database/db_update')
const actiontransaction = require('../database/actiondb_transaction')


async function refesh_trans_process(json_data,group_id,data,qt_id,token) {
    try {
        list_trans = []
        let firstDate = new Date()
        resp_group = await transactiongroup_db.select_transactiongroup(json_data,group_id)
        // console.log('resp_group:',(resp_group[1].list_transaction))
        if (resp_group[0]){
            var list_transaction = resp_group[1].list_transaction
            for (let i=0 ; i<list_transaction.length ; i++){
                if (list_transaction[i].doctype == 'CS' || list_transaction[i].doctype == 'CS_TEST' || list_transaction[i].doctype == 'CS_TEST2'){
                    let transaction_id = list_transaction[i].transaction_id
                    list_trans.push(transaction_id)
                }
                else if (list_transaction[i].transaction_id == qt_id){
                    let transaction_id = list_transaction[i].transaction_id
                    list_trans.push(transaction_id)
                }
                
            }
            var id_workflow = resp_group[1].id_workflow
            var result_update = await update_db.update_input_trans(list_trans,data,id_workflow)
            // console.log('result_update:',result_update)
            let secondDate = new Date()
            let timeDifference = Math.abs(secondDate.getTime() - firstDate.getTime());
            var id_log = String(uuid())
            var taxid = json_data.db_connect.t
            let jsonSaveData = {
                id: id_log,
                url: "/transaction/api/v1/refesh_input_transaction",
                token: token,
                tax_id: taxid,
                datetime: "",
                account_id: json_data.one_result_data.id,
                body: {
                    data : data ,
                    group_id : group_id,
                    qt_id : qt_id
                },
                query: "",
                params: "",
                response: result_update,
                time_duration: String(timeDifference) + " ms",
                statusCode: "200"
            }
            // 
            if (result_update[0] == true){
                jsonSaveData.status = true
                actiontransaction.insert_logtransac(jsonSaveData, taxid)
                return [true,result_update[1]]
            }
            else{
                jsonSaveData.status = false
                actiontransaction.insert_logtransac(jsonSaveData, taxid)
                return [false,result_update[1]]
            }
        }
        else{
            jsonSaveData.status = false
            actiontransaction.insert_logtransac(jsonSaveData, taxid)
            return [false,resp_group[1]]
        }
        
    } catch (error) {
        let jsonSaveData = {
            id: id_log,
            url: "/transaction/api/v1/refesh_input_transaction",
            token: token,
            tax_id: json_data.db_connect.t,
            datetime: "",
            account_id: json_data.one_result_data.id,
            body: {
                data : data ,
                group_id : group_id,
                qt_id : qt_id
            },
            query: "",
            params: "",
            response: result_update,
            time_duration: String(timeDifference) + " ms",
            statusCode: "200",
            status : false
        }
        actiontransaction.insert_logtransac(jsonSaveData, taxid)
        return [false,error]
    }
}

module.exports = {
    refesh_trans_process
}