require('../config/lib')
const {
    Promise
} = require('mongoose');
const cron = require('node-cron');
const fetchOneid = require('../method/fetchoneid_process');
const JOB_SCHEDULE = '0 3 * * *'
const JOB_REDIS = '0 * * * *' //every hour

const SyncOneid = async () => {
    console.log(`TestOneid`)
    var arrbizUser_Select = []
    let body = {
        username: 'jirayuknot',
        password: 'm12345678'
    }
    var tax_id = "0107544000094"
    try {
        let login_data = await sodium_ppl.login_ppl(body)
        if (login_data[0] == 200) {
            let r = await sodium_ppl.data_login_Decrypted(login_data[1].ciphertext)
            var one_result_data = r[1].data_login.one_result_data
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
            json_data = {
                db_connect: connectiondb,
                one_result_data: one_result_data,
                biz_user_select: arrbizUser_Select,
                one_access_token: one_access_token
            }
            // console.log(json_data)
            var token_oneid = json_data.one_access_token
            await Promise.all([
                fetchOneid.fetch_OrgAccount(json_data, tax_id, token_oneid),
                fetchOneid.fetch_department(json_data, tax_id, token_oneid),
                fetchOneid.fetch_role(json_data, tax_id, token_oneid),
                fetchOneid.fetch_bizaccount(json_data, tax_id, token_oneid)
            ]).then(function () {
                console.log("Update Oneid Success")
            });
        }
    } catch (error) {
        console.log(error)
    }
};

const SyncOneid_v2 = async () => {
    console.log(`TestOneid`)
    var arrbizUser_Select = []
    let body = {
        username: 'jirayuknot',
        password: 'm12345678'
    }
    var tax_id = "0107544000094"
    try {
        let login_data = await sodium_ppl.login_ppl(body)
        if (login_data[0] == 200) {
            let r = await sodium_ppl.data_login_Decrypted(login_data[1].ciphertext)
            var one_result_data = r[1].data_login.one_result_data
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
            json_data = {
                db_connect: connectiondb,
                one_result_data: one_result_data,
                biz_user_select: arrbizUser_Select,
                one_access_token: one_access_token
            }
            // console.log(json_data)
            var token_oneid = json_data.one_access_token
            await Promise.all([
                fetchOneid.fetch_OrgAccount_v2(json_data, tax_id, token_oneid),
                fetchOneid.fetch_department_v2(json_data, tax_id, token_oneid),
                fetchOneid.fetch_role_v2(json_data, tax_id, token_oneid),
                fetchOneid.fetch_bizaccount_v2(json_data, tax_id, token_oneid)
            ]).then(function () {
                console.log("Update Oneid Success")
            });
        }
    } catch (error) {
        console.log(error)
    }
};

if (process.env.NODE_ENV === 'production') {
    cron.schedule(JOB_REDIS, async () => {
        var ResultDel = await sodium_ppl.get_data_to_delete_from_redis()
        console.log(`Run Redis Job : ${ResultDel}`);
    });


    // cron.schedule(JOB_SCHEDULE, async () => {
    //     console.log(`TestOneid`)
    //     var arrbizUser_Select = []
    //     let body = {
    //         username: 'jirayuknot',
    //         password: 'm12345678'
    //     }
    //     var tax_id = "0107544000094"
    //     try {
    //         let login_data = await sodium_ppl.login_ppl(body)
    //         if (login_data[0] == 200) {
    //             let r = await sodium_ppl.data_login_Decrypted(login_data[1].ciphertext)
    //             var one_result_data = r[1].data_login.one_result_data
    //             var biz_detail = one_result_data.biz_detail
    //             var db_data = r[1].db_data
    //             var one_access_token = r[1].data_login.one_access_token
    //             var connectiondb = null
    //             for (i = 0; i < db_data.length; i++) {
    //                 if (db_data[i].t == tax_id) {
    //                     connectiondb = db_data[i]
    //                     break
    //                 }
    //             }
    //             for (y = 0; y < biz_detail.length; y++) {
    //                 tmp_id_card_num = biz_detail[y].getbiz.id_card_num
    //                 if (tmp_id_card_num == tax_id) {
    //                     arrbizUser_Select.push(biz_detail[y])
    //                 }
    //             }
    //             json_data = {
    //                 db_connect: connectiondb,
    //                 one_result_data: one_result_data,
    //                 biz_user_select: arrbizUser_Select,
    //                 one_access_token: one_access_token
    //             }
    //             // console.log(json_data)
    //             var token_oneid = json_data.one_access_token
    //             await Promise.all([
    //                 fetchOneid.fetch_OrgAccount(json_data, tax_id, token_oneid),
    //                 fetchOneid.fetch_department(json_data, tax_id, token_oneid),
    //                 fetchOneid.fetch_role(json_data, tax_id, token_oneid),
    //                 fetchOneid.fetch_bizaccount(json_data, tax_id, token_oneid)
    //             ]).then(function () {
    //                 console.log("Update Oneid Success")
    //             });
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // });
}

module.exports = {
    SyncOneid,
    SyncOneid_v2
}