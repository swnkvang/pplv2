require('../config/lib')
require('../config/global')
// require('../config/mongo_db')

// const Update_db = require('../db/update.db');
// const Select_db = require('../db/select.db');

const Update_db = require('../database/db_update');
const Select_db = require('../database/db_select');
const db_transaction = require('../database/actiondb_transaction');
const transactiongroup_db = require('../database/transaction_group')
const db_log_doc = require('../database/db_document_log')
const {
    connonsql
} = require('../config/mongo_db')

const GetDocumentService = async (dtm_start, dtm_end, document_type, connectiondb) => {
    try {
        if (connectiondb != null) {
            await connonsql(connectiondb)
        }
        GetData = await Select_db.FuncGetDocumentAllDateRange(dtm_start, dtm_end, document_type)
        if (GetData[0] === true) {
            return [true, GetData[1]]
        } else {
            return [false, GetData[1]]
        }
    } catch (error) {
        console.log(error)
        return [false, error]
    }
}

const GetDocumentService_v2 = async (dtm_start, dtm_end, document_type, connectiondb) => {
    try {
        arrResult = []
        GetData = await Select_db.FuncGetDocumentAllDateRange_v2(dtm_start, dtm_end, document_type,connectiondb)
        if (GetData[0]) {
            let Dataquery = GetData[1]
            var Dataall = []
            for (let i = 0; i < Dataquery.length; i++) {
                var DataqueryElement = Dataquery[i]
                arrResult.push(DataqueryElement._id)
            }
            const result_history = await db_log_doc.select_tb_document_log_list(connectiondb,arrResult)
            if (result_history[0]){
                var history_list = result_history[1]
                let list_data = []
                var new_Dataquery = JSON.parse(JSON.stringify(Dataquery))
                for (let x = 0; x < new_Dataquery.length; x++){
                    list_data = history_list.filter(history_dict=>history_dict.id_transaction==new_Dataquery[x]._id)
                    new_Dataquery[x]['document_history'] = list_data
                }
                return [true, new_Dataquery]
            }else{
                return [false, result_history[1]]
            }
        } else {
            return [false, GetData[1]]
        }
    } catch (error) {
        console.log(error)
        return [false, error.message]
    }
}

async function update_doc_type(type_name, keyword, type, detail, dept_role, prefix, digit, createBy, updateBy, connectiondb) {
    try {
        if (connectiondb != null) {
            await connonsql(connectiondb)
        }
        result_update = await Update_db.updatedoc_type(type_name, keyword, type, detail, dept_role, prefix, digit, createBy, updateBy, connectiondb)
        // console.log('result_update:',result_update)
        return [200, result_update]

    } catch (err) {
        console.log(err)
    }
}

async function update_doc_type_v2(type_name, keyword, type, detail, dept_role, prefix, digit, connectiondb) {
    try {
        // if (connectiondb != null) {
        //     await connonsql(connectiondb)
        // }
        result_update = await Update_db.updatedoc_type_v2(type_name, keyword, type, detail, dept_role, prefix, digit, connectiondb)
        // console.log('result_update:',result_update)
        return [200, result_update]

    } catch (err) {
        console.log(err)
    }
}

async function get_doc_type(keyword, connectiondb) {
    try {
        // if (connectiondb != null) {
        //     await connonsql(connectiondb)
        // }
        result_select = await Select_db.func_get_doc_type(keyword,connectiondb)
        // console.log('result_select:',result_select)
        if (!(result_select[0] == 200)) {
            return [400, result_select[1]]
        }
        return [200, result_select[1]]

    } catch (err) {
        console.log(err)
        return [400, err]
    }
}

async function get_all_doc_type(connectiondb) {
    // if (connectiondb != null) {
    //     await connonsql(connectiondb)
    // }
    try {
        var result_select = await Select_db.func_get_all_doc_type(connectiondb)
        // console.log('result_select:',result_select)
        if (!(result_select[0] == 200)) {
            return [400, result_select[1]]
        }
        return [200, result_select[1]]

    } catch (err) {
        console.log(err)
        return [400, err]
    }
}

async function update_doc_type_trans(keyword, connectiondb) {
    // if (connectiondb != null) {
    //     await connonsql(connectiondb)
    // }
    try {
        var result_select = await Select_db.func_get_doc_type(keyword,connectiondb)
        // console.log('result_select:',result_select)
        if (!(result_select[0] == 200)) {
            return [200, result_select[1]]
        }
        var prefix_type = result_select[1]['prefix']
        var digit = result_select[1]['digit']
        var type_name = result_select[1]['type_name']
        // if (prefix_type == 'YYYYMM') {
        //     date_now = new Date
        //     month = '' + (date_now.getMonth() + 1),
        //         // year = date_now.getFullYear(); // ค.ศ.
        //         year = date_now.getFullYear() + 543; // พ.ศ. 
        //     if (month.length < 2)
        //         month = '0' + month;
        //     var prefix = [year, month].join('')
        //     console.log('prefix:',prefix)
        //     console.log('sysdate ::==',timemoment().add(543, 'year').format(prefix_type));
        // }
        if (prefix_type == 'YYYYMM') {
            var prefix = timemoment().format(prefix_type)
            // console.log('prefix:',prefix)
        }
        let str_digit = ''
        // for (i=0 ; i<digit ; i++){
        //     str_digit = str_digit + '0'
        // }
        var result_select_doc = await Select_db.func_get_doc_type_trans(keyword,connectiondb)
        if (!(result_select_doc[0] == 200)) {
            return [false, result_select_doc[1]]
        }
        if (result_select_doc[1].length == 0) {
            for (let i = 0; i < digit - 1; i++) {
                str_digit = str_digit + '0'
            }
            let doc_id = keyword + '-' + prefix + str_digit + '1'
            var result_update = await Update_db.updatedoc_type_trans(type_name, keyword, '', 1,connectiondb)
            if (result_update[0] == true){
                return [true, doc_id]
            }
            else{
                return [false, result_update[1]]
            }
        } else {
            var last_digit = result_select_doc[1]['last_digit']
            if ((last_digit + 1).toString().length <= digit) {
                let docno = last_digit + 1
                for (let i = 0; i < digit - (last_digit + 1).toString().length; i++) {
                    str_digit = str_digit + '0'
                }
                let doc_id = keyword + '-' + prefix + str_digit + docno

                // RECURSIVE
                // doc_id = 'CS_TEST2-256404000007'
                var result_select_doc = await Select_db.select_doc_id(doc_id,connectiondb) 
                if (!(result_select_doc[1].length == 0)){
                    console.log('RECURSIVE')
                    await update_doc_type_trans(keyword,connectiondb)
                }
                else{
                    var result_update = await Update_db.updatedoc_type_trans(type_name, keyword, '', docno,connectiondb)
                    if (result_update[0] == true){
                        return [true, doc_id]
                    }
                    else{
                        return [false, result_update[1]]
                    }
                }

                
            } else {
                // console.log('The number has exceeded the limit digit '+ digit)
                return [false, 'The number has exceeded the limit digit ' + digit]
            }
        }

    } catch (err) {
        console.log(err)
        return [400, err]
    }
}

async function update_doc_type_trans_ref(keyword, ref_doc_id, group_id, connectiondb) {
    // if (connectiondb != null) {
    //     await connonsql(connectiondb)
    // }
    try {
        var result_select_group = await Select_db.func_get_group_id_ref(group_id, keyword,connectiondb)
        if (result_select_group[1] == null || result_select_group[1] === undefined || result_select_group[1].length == 0) {
            let doc_id_new = keyword + '-' + ref_doc_id.split('-')[1]
            let doc_type_ref = ref_doc_id.split('-')[0]
            let result_select = await Select_db.func_get_doc_id_ref(doc_id_new,connectiondb)
            if (!(result_select[0] == 200)) {
                return [false, result_select[0]]
            } else {
                if (!(result_select[1].length == 0)) {
                    let last_ref = Number(result_select[1][0].last_ref)
                    let doc_id_ref_new = doc_id_new
                    // console.log('doc_id_ref_new:',doc_id_ref_new)
                    result_update = await Update_db.updatedoc_type_trans_ref(doc_id_new, keyword, doc_type_ref, ref_doc_id, last_ref,connectiondb)
                    return [true, doc_id_ref_new]
                } else {
                    let last_ref = 0
                    let doc_id_ref_new = doc_id_new
                    // console.log('doc_id_ref_new:',doc_id_ref_new)
                    result_update = await Update_db.updatedoc_type_trans_ref(doc_id_new, keyword, doc_type_ref, ref_doc_id, last_ref,connectiondb)
                    return [true, doc_id_ref_new]
                }
            }
        } else {
            let doc_id_new = keyword + '-' + ref_doc_id.split('-')[1]
            let doc_type_ref = ref_doc_id.split('-')[0]
            let result_select = await Select_db.func_get_doc_id_ref(doc_id_new,connectiondb)
            if (!(result_select[0] == 200)) {
                return [false, result_select[0]]
            } else {
                if (!(result_select[1].length == 0)) {
                    let last_ref = Number(result_select[1][0].last_ref) + 1
                    let doc_id_ref_new = doc_id_new + 'Rev.' + last_ref
                    console.log('doc_id_ref_new:', doc_id_ref_new)
                    result_update = await Update_db.updatedoc_type_trans_ref(doc_id_new, keyword, doc_type_ref, ref_doc_id, last_ref,connectiondb)
                    return [true, doc_id_ref_new]
                } else {
                    let last_ref = 1
                    let doc_id_ref_new = doc_id_new + 'Rev.' + last_ref
                    console.log('doc_id_ref_new:', doc_id_ref_new)
                    result_update = await Update_db.updatedoc_type_trans_ref(doc_id_new, keyword, doc_type_ref, ref_doc_id, last_ref,connectiondb)
                    return [true, doc_id_ref_new]
                }
            }
        }
    } catch (err) {
        console.log(err)
        return [false, err]
    }
}

async function get_all_doc_recipient(account_id, connectiondb, limit, offset) {
    // if (connectiondb != null) {
    //     await connonsql(connectiondb)
    // }
    try {
        // result_select1111 = await Select_db.func_get_all_doc_recp(account_id,limit,offset)
        var result_select = await Select_db.func_get_all_doc_recp_v2(account_id, limit, offset,connectiondb)

        // console.log('result_select1111:',result_select1111[1].length)
        // console.log('result_select:',result_select[1].length)
        if (!(result_select[0] == 200)) {
            return [400, result_select[1]]
        }
        return [200, result_select[1]]

    } catch (err) {
        console.log(err)
        return [400, err]
    }
}

async function get_count_all_doc_recipient(account_id, connectiondb) {
    // if (connectiondb != null) {
    //     await connonsql(connectiondb)
    // }
    try {
        // result_select1111 = await Select_db.func_get_all_doc_recp(account_id,limit,offset)
        var result_select = await Select_db.func_get_count_all_doc_recp_v2(account_id,connectiondb)
        // console.log('result_select:',result_select)
        if (!(result_select[0] == 200)) {
            return [400, result_select[1]]
        }
        return [200, result_select[1]]

    } catch (err) {
        console.log(err)
        return [400, err]
    }
}

async function get_all_doc_recipient_filter(account_id, status, keyword, doc_type, limit, offset, connectiondb) {
    // if (connectiondb != null) {
    //     await connonsql(connectiondb)
    // }
    try {
        // result_select = await Select_db.func_get_all_doc_recp_filter(account_id,status,limit,offset)
        var result_select_tt = await Select_db.func_get_all_doc_recp_filter_v2(account_id, status, keyword, doc_type, limit, offset,connectiondb)

        // console.log('result_select:',result_select[1].length)
        // console.log('result_select_tt:',result_select_tt[1].length)
        if (!(result_select_tt[0] == 200)) {
            return [400, result_select_tt[1]]
        }
        return [200, result_select_tt[1]]

    } catch (err) {
        console.log(err)
        return [400, err]
    }
}

async function get_all_doc_recipient_cancel(account_id,limit, offset, connectiondb) {
    // if (connectiondb != null) {
    //     await connonsql(connectiondb)
    // }
    try {
        // result_select = await Select_db.func_get_all_doc_recp_filter(account_id,status,limit,offset)
        var result_select_tt = await Select_db.func_get_all_doc_recp_cancel(account_id, limit, offset,connectiondb)

        // console.log('result_select:',result_select[1].length)
        // console.log('result_select_tt:',result_select_tt[1].length)
        if (!(result_select_tt[0] == 200)) {
            return [400, result_select_tt[1]]
        }
        return [200, result_select_tt[1]]

    } catch (err) {
        console.log(err)
        return [400, err]
    }
}

async function get_count_all_doc_recipient_filter(account_id, status, keyword, doc_type, connectiondb) {
    // if (connectiondb != null) {
    //     await connonsql(connectiondb)
    // }
    try {
        // result_select = await Select_db.func_get_all_doc_recp_filter(account_id,status,limit,offset)
        var result_select = await Select_db.func_count_get_all_doc_recp_filter_v2(account_id, status, keyword, doc_type,connectiondb)

        // console.log('result_select:',result_select[1].length)
        // console.log('result_select_tt:',result_select_tt[1].length)
        if (!(result_select[0] == 200)) {
            return [400, result_select[1]]
        }
        return [200, result_select[1]]

    } catch (err) {
        console.log(err)
        return [400, err]
    }
}

async function get_all_doc_recipient_search(account_id, keyword, doc_type, status, limit, offset, connectiondb) {
    // console.log('connectiondb:',connectiondb)
    // if (connectiondb != null) {
    //     await connonsql(connectiondb)
    // }
    try {
        var result_select = await Select_db.func_get_all_doc_recp_search(account_id, keyword, doc_type, status,limit, offset,connectiondb)

        // console.log('result_select_SSS:',result_select[1].length)
        if (!(result_select[0] == 200)) {
            return [400, result_select[1]]
        }
        return [200, result_select[1]]

    } catch (err) {
        console.log(err)
        return [400, err]
    }
}

async function get_all_doc_recipient_search_cancel(account_id, keyword, doc_type, status, limit, offset, connectiondb) {
    // console.log('connectiondb:',connectiondb)
    // if (connectiondb != null) {
    //     await connonsql(connectiondb)
    // }
    try {
        var result_select = await Select_db.func_get_all_doc_recp_search_cancel(account_id, keyword, doc_type, status,limit, offset,connectiondb)

        // console.log('result_select_SSS:',result_select[1].length)
        if (!(result_select[0] == 200)) {
            return [400, result_select[1]]
        }
        return [200, result_select[1]]

    } catch (err) {
        console.log(err)
        return [400, err]
    }
}

async function get_count_all_doc_recipient_search(account_id, keyword, doc_type, status, connectiondb) {
    // console.log('connectiondb:',connectiondb)
    // if (connectiondb != null) {
    //     await connonsql(connectiondb)
    // }
    try {
        var result_select = await Select_db.func_get_count_all_doc_recp_search(account_id, keyword, doc_type, status,connectiondb)

        // console.log('result_select_SSS:',result_select[1].length)
        if (!(result_select[0] == 200)) {
            return [400, result_select[1]]
        }
        return [200, result_select[1]]

    } catch (err) {
        console.log(err)
        return [400, err]
    }
}

async function get_all_doc_recipient_search_datetime(account_id, datetime, keyword, doc_type, status, limit, offset, connectiondb) {
    // if (connectiondb != null) {
    //     await connonsql(connectiondb)
    // }
    try {
        // console.log('datetime:',datetime)
        dt_str = datetime.split('-')
        // console.log('dt_str:',dt_str)
        datetime_start = new Date(Number(dt_str[0]), Number(dt_str[1]) - 1, Number(dt_str[2]), 00, 00, 00)
        datetime_end = new Date(Number(dt_str[0]), Number(dt_str[1]) - 1, Number(dt_str[2]), 23, 59, 59)
        // console.log('datetime_start:',datetime_start)
        result_select = await Select_db.func_get_all_doc_recp_search_datetime(account_id, datetime_start, datetime_end, keyword, doc_type, status, limit, offset,connectiondb)

        // console.log('result_select_SSS:',result_select[1].length)
        if (!(result_select[0] == 200)) {
            return [400, result_select[1]]
        }
        return [200, result_select[1]]

    } catch (err) {
        console.log(err)
        return [400, err]
    }
}

async function get_all_doc_recipient_search_datetime_cancel(account_id, datetime, keyword, doc_type, status, limit, offset, connectiondb) {
    // if (connectiondb != null) {
    //     await connonsql(connectiondb)
    // }
    try {
        // console.log('datetime:',datetime)
        dt_str = datetime.split('-')
        // console.log('dt_str:',dt_str)
        datetime_start = new Date(Number(dt_str[0]), Number(dt_str[1]) - 1, Number(dt_str[2]), 00, 00, 00)
        datetime_end = new Date(Number(dt_str[0]), Number(dt_str[1]) - 1, Number(dt_str[2]), 23, 59, 59)
        // console.log('datetime_start:',datetime_start)
        result_select = await Select_db.func_get_all_doc_recp_search_datetime_cancel(account_id, datetime_start, datetime_end, keyword, doc_type, status, limit, offset,connectiondb)

        // console.log('result_select_SSS:',result_select[1].length)
        if (!(result_select[0] == 200)) {
            return [400, result_select[1]]
        }
        return [200, result_select[1]]

    } catch (err) {
        console.log(err)
        return [400, err]
    }
}

async function get_count_all_doc_recipient_search_datetime(account_id, datetime, status, connectiondb) {
    // if (connectiondb != null) {
    //     await connonsql(connectiondb)
    // }
    try {
        // console.log('datetime:',datetime)
        dt_str = datetime.split('-')
        // console.log('dt_str:',dt_str)
        datetime_start = new Date(Number(dt_str[0]), Number(dt_str[1]) - 1, Number(dt_str[2]), 00, 00, 00)
        datetime_end = new Date(Number(dt_str[0]), Number(dt_str[1]) - 1, Number(dt_str[2]), 23, 59, 59)
        // console.log('datetime_start:',datetime_start)
        result_select = await Select_db.func_get_count_all_doc_recp_search_datetime(account_id, datetime_start, datetime_end, status,connectiondb)

        // console.log('result_select_SSS:',result_select[1].length)
        if (!(result_select[0] == 200)) {
            return [400, result_select[1]]
        }
        return [200, result_select[1]]

    } catch (err) {
        console.log(err)
        return [400, err]
    }
}

async function tracking_flow_document(tracking_id, connectiondb) {

    // if (connectiondb != null) {
    //     await connonsql(connectiondb)
    // }
    try {
        // console.log('datetime:',datetime)

        result_select = await Select_db.select_tracking_flow(tracking_id,connectiondb)

        // console.log('result_select_SSS:',result_select[1].length)
        if (!(result_select[0] == 200)) {
            return [400, result_select[1]]
        }
        return [200, result_select[1]]

    } catch (err) {
        console.log(err)
        return [400, err]
    }
}

async function func_cancel_document(transaction_id,user_id,connectiondb) {

    // if (connectiondb != null) {
    //     await connonsql(connectiondb)
    // }
    try {
        // console.log('datetime:',datetime)
        result_select = await Update_db.update_cancel_document(transaction_id,user_id,connectiondb)

        // console.log('result_select_SSS:',result_select[1].length)
        if (!(result_select[0] == true)) {
            return [false, result_select[1]]
        }
        return [true, result_select[1]]

    } catch (err) {
        console.log(err)
        return [false, err]
    }
}

async function func_cancel_document_v2(transaction_id,user_id,json_data) {
    try {
        const connectiondb = json_data.db_connect
        const result_document = await db_transaction.find_transaction(connectiondb,transaction_id)
        if (result_document[0]){
            const group_id = result_document[1].groupid
            const doctype = result_document[1].doctype
            var document_main = null
            result_group = await transactiongroup_db.select_transactiongroup(json_data,group_id)
            if (result_group[0]){
                const detail = result_group[1].detail
                for (let i =0; i<detail.length;i++){
                    if (detail[i].document_type===doctype){
                        document_main = detail[i].document_main
                        break
                    }
                }
                result_update = await Update_db.update_cancel_document_v2(transaction_id,user_id,document_main,group_id,connectiondb)
                if (result_update[0]){
                    return [true, result_update[1]]
                }else{
                    return [false, result_update[1]]
                }
            }else{
                return [false, result_group[1]]
            } 
        }else{
            return [false, result_document[1]]
        }
        
    } catch (err) {
        console.log(err)
        return [false, err]
    }
}

module.exports = {
    update_doc_type,
    update_doc_type_trans,
    get_doc_type,
    get_all_doc_type,
    get_all_doc_recipient,
    get_all_doc_recipient_filter,
    get_all_doc_recipient_search,
    get_all_doc_recipient_search_datetime,
    get_count_all_doc_recipient,
    get_count_all_doc_recipient_filter,
    get_count_all_doc_recipient_search,
    get_count_all_doc_recipient_search_datetime,
    tracking_flow_document,
    update_doc_type_trans_ref,
    GetDocumentService,
    func_cancel_document,
    get_all_doc_recipient_cancel,
    get_all_doc_recipient_search_cancel,
    get_all_doc_recipient_search_datetime_cancel,
    func_cancel_document_v2,
    update_doc_type_v2,
    GetDocumentService_v2
}