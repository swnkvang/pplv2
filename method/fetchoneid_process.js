require('../config/lib')
require('../config/global')

const callOneid = require('../oneid/call_oneid');
const logService = require('../database/transaction.service_')
const {
    consql,
    querySql
} = require('../config/maria_db');
const {
    Console
} = require('winston/lib/winston/transports');

var self = module.exports = {
    fetch_department: async function (data_decry, tax_id, token_oneid) {
        var connectiondb = data_decry.db_connect
        var arrbizUser_Select = data_decry.biz_user_select
        var one_result_data = data_decry.one_result_data
        // var one_result_data = r[1].data_login.one_result_data
        var User_account_id = one_result_data.id
        var User_first_name_th = one_result_data.first_name_th
        var User_last_name_th = one_result_data.last_name_th
        var User_first_name_eng = one_result_data.first_name_eng
        var User_last_name_eng = one_result_data.last_name_eng
        var User_account_title_th = one_result_data.account_title_th
        var User_account_title_eng = one_result_data.account_title_eng
        var User_thai_email = one_result_data.thai_email
        var biz_detail = one_result_data.biz_detail
        // if (connectiondb != null) {
        //     await consql(connectiondb)
        // }
        // URL ONEID

        // console.log(IdSync)
        let url_oneid_business = globalUrlOne + '​/api/v2/service/business/department'
        let param_req_business = {
            tax_id: tax_id
        }
        token_oneid = 'Bearer ' + token_oneid
        let res_business = await callOneid.call_getDeptByBusiness_Oneid(url_oneid_business, param_req_business, token_oneid)
        if (res_business[0] == 200) {
            var data = res_business[1].data
            if (data.result == 'Success') {
                var data_arr_deptid = data.data
                for (i = 0; i < data_arr_deptid.length; i++) {
                    var dept_id = data_arr_deptid[i].id
                    var dept_name = data_arr_deptid[i].dept_name
                    var dept_position = data_arr_deptid[i].dept_position
                    var parent_dept_id = data_arr_deptid[i].parent_dept_id
                    // console.log(data_arr_deptid[i])
                    // if (dept_id == '3be13ee0-35ef-11ea-a752-7f474161d35d') {
                    //     console.log(dept_name)
                    // }
                    // cluster.getConnection = util.promisify(cluster.getConnection);
                    // var connection = await cluster.getConnection("master")
                    // connection.query = util.promisify(connection.query)
                    // connection.release();
                    // result_select = await connection.query('SELECT * FROM tb_org_biz_dept where dept_id = "' + dept_id + '" ')
                    let sqlselect = {
                        sql: 'SELECT COUNT(*) AS rescount FROM tb_org_biz_dept where dept_id = "' + dept_id + '" ',
                        values: []
                    }
                    // console.log(sqlselect)
                    var result_insert = await querySql(connectiondb, sqlselect)
                    // 
                    var resultArray = Object.values(JSON.parse(JSON.stringify(result_insert)))
                    // console.log(resultArray)
                    if (resultArray[0].rescount == 0) {
                        // console.log('insert',dept_id,)
                        // result_insert = await connection.query('INSERT INTO tb_org_biz_dept (dept_id, dept_name, dept_position, parent_dept_id) VALUES (?,?,?,?)',
                        //     [dept_id, dept_name, dept_position, parent_dept_id])
                        let sqlinsert = {
                            sql: 'INSERT INTO tb_org_biz_dept (dept_id, dept_name, dept_position, parent_dept_id) VALUES (?,?,?,?)',
                            values: [dept_id, dept_name, dept_position, parent_dept_id]
                        }
                        var resInsert = await querySql(connectiondb, sqlinsert)
                        console.log(resInsert)
                    } else {
                        // result_query = await connection.query('UPDATE tb_org_biz_dept SET dept_name = ?, dept_position = ?, \
                        // parent_dept_id = ? WHERE dept_id = ?',
                        //     [dept_name, dept_position, parent_dept_id, dept_id])
                        let sqlupdate = {
                            sql: 'UPDATE tb_org_biz_dept SET dept_name = ?, dept_position = ?, \
                            parent_dept_id = ? WHERE dept_id = ?',
                            values: [dept_name, dept_position, parent_dept_id, dept_id]
                        }
                        await querySql(connectiondb, sqlupdate)
                    }


                    // console.log(result_insert)
                }
                logService.SaveTransactionSyncData(connectiondb, "department", "Success")
                return [200, 'update success']
            }

        } else {
            return res_business
        }
    },
    fetch_department_v2: async function (data_decry, tax_id, token_oneid) {
        var connectiondb = data_decry.db_connect
        var arrbizUser_Select = data_decry.biz_user_select
        var one_result_data = data_decry.one_result_data
        // var one_result_data = r[1].data_login.one_result_data
        var User_account_id = one_result_data.id
        var User_first_name_th = one_result_data.first_name_th
        var User_last_name_th = one_result_data.last_name_th
        var User_first_name_eng = one_result_data.first_name_eng
        var User_last_name_eng = one_result_data.last_name_eng
        var User_account_title_th = one_result_data.account_title_th
        var User_account_title_eng = one_result_data.account_title_eng
        var User_thai_email = one_result_data.thai_email
        var biz_detail = one_result_data.biz_detail
        let dept_list = []
        // if (connectiondb != null) {
        //     await consql(connectiondb)
        // }
        // URL ONEID

        // console.log(IdSync)
        let url_oneid_business = globalUrlOne + '​/api/v2/service/business/department'
        let param_req_business = {
            tax_id: tax_id
        }
        token_oneid = 'Bearer ' + token_oneid
        let res_business = await callOneid.call_getDeptByBusiness_Oneid(url_oneid_business, param_req_business, token_oneid)
        if (res_business[0] == 200) {
            var data = res_business[1].data
            if (data.result == 'Success') {
                var data_arr_deptid = data.data
                for (i = 0; i < data_arr_deptid.length; i++) {
                    // console.log(i)
                    var dept_id = data_arr_deptid[i].id
                    var dept_name = data_arr_deptid[i].dept_name
                    var dept_position = data_arr_deptid[i].dept_position
                    var parent_dept_id = data_arr_deptid[i].parent_dept_id
                    var dep_data = {
                        dept_id:dept_id,
                        dept_name:dept_name,
                        dept_position:dept_position,
                        parent_dept_id:parent_dept_id
                    }
                    dept_list.push(Object.values(dep_data))
                }
                const sqldelete = {
                    sql: `DELETE FROM tb_org_biz_dept;`,
                    values: []
                }
                result_delete = await querySql(connectiondb, sqldelete)
                const sqlinsert = {
                    sql: 'INSERT INTO tb_org_biz_dept (dept_id, dept_name, dept_position, parent_dept_id) VALUES ?',
                    values: [dept_list]
                }
                var resInsert = await querySql(connectiondb, sqlinsert)
                logService.SaveTransactionSyncData(connectiondb, "department", "Success")
                return [200, 'update success']
            }

        } else {
            return res_business
        }
    },
    fetch_role: async function (data_decry, tax_id, token_oneid) {
        var connectiondb = data_decry.db_connect
        var arrbizUser_Select = data_decry.biz_user_select
        var one_result_data = data_decry.one_result_data
        // var one_result_data = r[1].data_login.one_result_data
        var User_account_id = one_result_data.id
        var User_first_name_th = one_result_data.first_name_th
        var User_last_name_th = one_result_data.last_name_th
        var User_first_name_eng = one_result_data.first_name_eng
        var User_last_name_eng = one_result_data.last_name_eng
        var User_account_title_th = one_result_data.account_title_th
        var User_account_title_eng = one_result_data.account_title_eng
        var User_thai_email = one_result_data.thai_email
        var biz_detail = one_result_data.biz_detail
        // if (connectiondb != null) {
        //     await consql(connectiondb)
        // }
        token_oneid = 'Bearer ' + token_oneid
        // URL ONEID
        let url_oneid_business = globalUrlOne + '/api/v2/service/business/dept-role'
        // console.log(url_oneid_business)
        let param_req_business = {
            tax_id: tax_id
        }
        let res_business = await callOneid.call_getRoleByBusiness_Oneid(url_oneid_business, param_req_business, token_oneid)
        if (res_business[0] == 200) {
            data = res_business[1].data
            if (data.result == 'Success') {
                data_arr_role = data.data
                for (i = 0; i < data_arr_role.length; i++) {
                    id_oneid = data_arr_role[i].id
                    role_id = data_arr_role[i].role.id
                    role_name = data_arr_role[i].role.role_name
                    role_level = data_arr_role[i].role.role_level
                    dept_id = data_arr_role[i].dept_id
                    parent_dept_role_id = data_arr_role[i].parent_dept_role_id
                    dept_role_level = data_arr_role[i].dept_role_level
                    dept_role_position = data_arr_role[i].dept_role_position
                    // result_select = await connection.query('SELECT * FROM tb_org_biz_role where id_oneid = "' + id_oneid + '" ')
                    let sqlselect = {
                        sql: 'SELECT * FROM tb_org_biz_role where id_oneid = "' + id_oneid + '" ',
                        values: []
                    }
                    result_select = await querySql(connectiondb, sqlselect)
                    // 
                    if (result_select.length == 0) {
                        // result_insert = await connection.query('INSERT INTO tb_org_biz_role (role_id, role_name, role_position, dept_id, id_oneid,\
                        // parent_dept_role_id,dept_role_level,dept_role_position) VALUES (?,?,?,?,?,?,?,?)',
                        //     [role_id, role_name, role_level, dept_id, id_oneid, parent_dept_role_id, dept_role_level, dept_role_position])
                        let sqlinsert = {
                            sql: 'INSERT INTO tb_org_biz_role (role_id, role_name, role_position, dept_id, id_oneid,\
                                parent_dept_role_id,dept_role_level,dept_role_position) VALUES (?,?,?,?,?,?,?,?)',
                            values: [role_id, role_name, role_level, dept_id, id_oneid, parent_dept_role_id, dept_role_level, dept_role_position]
                        }
                        result_insert = await querySql(connectiondb, sqlinsert)
                    } else {
                        try {
                            // result_query = await connection.query('UPDATE tb_org_biz_role SET role_id = ?, role_name = ?, \
                            // role_position = ?, dept_id = ?, parent_dept_role_id = ?, dept_role_level = ?, dept_role_position = ?  \
                            // WHERE id_oneid = ?',
                            //     [role_id, role_name, role_level, dept_id, parent_dept_role_id, dept_role_level, dept_role_position, id_oneid])
                            let sqlupdate = {
                                sql: 'UPDATE tb_org_biz_role SET role_id = ?, role_name = ?, \
                                role_position = ?, dept_id = ?, parent_dept_role_id = ?, dept_role_level = ?, dept_role_position = ?  \
                                WHERE id_oneid = ?',
                                values: [role_id, role_name, role_level, dept_id, parent_dept_role_id, dept_role_level, dept_role_position, id_oneid]
                            }
                            result_update = await querySql(connectiondb, sqlupdate)
                        } catch (err) {
                            console.log('error', err)
                        }

                    }
                }
                logService.SaveTransactionSyncData(connectiondb, "role", "Success")
                return [200, 'update success']
            }

        } else {
            return res_business
        }
    },
    fetch_role_v2: async function (data_decry, tax_id, token_oneid) {
        var connectiondb = data_decry.db_connect
        var arrbizUser_Select = data_decry.biz_user_select
        var one_result_data = data_decry.one_result_data
        // var one_result_data = r[1].data_login.one_result_data
        var User_account_id = one_result_data.id
        var User_first_name_th = one_result_data.first_name_th
        var User_last_name_th = one_result_data.last_name_th
        var User_first_name_eng = one_result_data.first_name_eng
        var User_last_name_eng = one_result_data.last_name_eng
        var User_account_title_th = one_result_data.account_title_th
        var User_account_title_eng = one_result_data.account_title_eng
        var User_thai_email = one_result_data.thai_email
        var biz_detail = one_result_data.biz_detail
        let role_list = []
        // if (connectiondb != null) {
        //     await consql(connectiondb)
        // }
        token_oneid = 'Bearer ' + token_oneid
        // URL ONEID
        let url_oneid_business = globalUrlOne + '/api/v2/service/business/dept-role'
        // console.log(url_oneid_business)
        let param_req_business = {
            tax_id: tax_id
        }
        let res_business = await callOneid.call_getRoleByBusiness_Oneid(url_oneid_business, param_req_business, token_oneid)
        if (res_business[0] == 200) {
            data = res_business[1].data
            if (data.result == 'Success') {
                data_arr_role = data.data
                for (i = 0; i < data_arr_role.length; i++) {
                    id_oneid = data_arr_role[i].id
                    role_id = data_arr_role[i].role.id
                    role_name = data_arr_role[i].role.role_name
                    role_level = data_arr_role[i].role.role_level
                    dept_id = data_arr_role[i].dept_id
                    parent_dept_role_id = data_arr_role[i].parent_dept_role_id
                    dept_role_level = data_arr_role[i].dept_role_level
                    dept_role_position = data_arr_role[i].dept_role_position
                    var role_data = {
                        role_id:role_id,
                        role_name:role_name,
                        role_position:role_level,
                        id_oneid:id_oneid,
                        dept_id:dept_id,
                        parent_dept_role_id:parent_dept_role_id,
                        dept_role_level:dept_role_level,
                        dept_role_position:dept_role_position
                    }
                    role_list.push(Object.values(role_data))
                }
                const sqldelete = {
                    sql: `DELETE FROM tb_org_biz_role;`,
                    values: []
                }
                result_delete = await querySql(connectiondb, sqldelete)
                const sqlinsert = {
                    sql: 'INSERT INTO tb_org_biz_role (role_id, role_name, role_position, dept_id, id_oneid,parent_dept_role_id,dept_role_level,dept_role_position) VALUES ?',
                    values: [role_list]
                }
                result_insert = await querySql(connectiondb, sqlinsert)
                logService.SaveTransactionSyncData(connectiondb, "role", "Success")
                return [200, role_list]
            }

        } else {
            return res_business
        }
    },
    fetch_bizaccount: async function (data_decry, tax_id, token_oneid) {
        try {
            var connectiondb = data_decry.db_connect
            var arrbizUser_Select = data_decry.biz_user_select
            var one_result_data = data_decry.one_result_data
            // var one_result_data = r[1].data_login.one_result_data
            var User_account_id = one_result_data.id
            var User_first_name_th = one_result_data.first_name_th
            var User_last_name_th = one_result_data.last_name_th
            var User_first_name_eng = one_result_data.first_name_eng
            var User_last_name_eng = one_result_data.last_name_eng
            var User_account_title_th = one_result_data.account_title_th
            var User_account_title_eng = one_result_data.account_title_eng
            var User_thai_email = one_result_data.thai_email
            var biz_detail = one_result_data.biz_detail
            token_oneid = 'Bearer ' + token_oneid
            data_arr_account = []
            url_oneid_business = globalUrlOne + '/api/v2/service/business/account'
            console.log(url_oneid_business)
            param_req_business = {
                tax_id: tax_id
            }
            res_business = await callOneid.call_getbusinessAccount(url_oneid_business, param_req_business, token_oneid)
            if (res_business[0] == 200) {
                data = res_business[1].data
                if (data.result == 'Success') {
                    data_arr_account = data.data
                    for (i = 0; i < data_arr_account.length; i++) {
                        account_id = data_arr_account[i].id
                        first_name_th = data_arr_account[i].first_name_th
                        last_name_th = data_arr_account[i].last_name_th
                        first_name_eng = data_arr_account[i].first_name_eng
                        last_name_eng = data_arr_account[i].last_name_eng
                        account_title_th = data_arr_account[i].account_title_th
                        account_title_eng = data_arr_account[i].account_title_eng
                        thai_email = data_arr_account[i].thai_email
                        thai_email2 = data_arr_account[i].thai_email2
                        thai_email3 = data_arr_account[i].thai_email3
                        employee_email = null
                        employee_id = null
                        mobile_no = null
                        if (data_arr_account[i].has_employee_detail != null) {
                            employee_email = data_arr_account[i].has_employee_detail.email
                            employee_id = data_arr_account[i].has_employee_detail.employee_id
                            mobile_no = data_arr_account[i].has_employee_detail.mobile_no
                        }
                        let sqlselect = 'SELECT * FROM tb_account where account_id = "' + account_id + '" '
                        result_select = await querySql(connectiondb, sqlselect)
                        if (result_select.length == 0) {
                            let sqlinsert = {
                                sql: `INSERT INTO tb_account (account_id,first_name_th, last_name_th,first_name_eng,last_name_eng, account_title_th, account_title_eng, thai_email, thai_email2, thai_email3,\
                                    employee_email,employee_id, mobile_no) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                                values: [account_id, first_name_th, last_name_th, first_name_eng, last_name_eng, account_title_th, account_title_eng, thai_email, thai_email2, thai_email3, employee_email, employee_id, mobile_no]
                            }
                            result_insert = await querySql(connectiondb, sqlinsert)
                        } else {
                            let sqlupdate = {
                                sql: `UPDATE tb_account SET first_name_th = ?, \
                                last_name_th = ?, first_name_eng = ?, last_name_eng = ? , account_title_th = ? , account_title_eng = ? , thai_email = ? , thai_email2 = ? , thai_email3 = ? ,\
                                employee_email = ? ,employee_id = ? , mobile_no = ?  WHERE account_id = ?`,
                                values: [first_name_th, last_name_th, first_name_eng, last_name_eng, account_title_th,
                                    account_title_eng, thai_email, thai_email2, thai_email3,
                                    employee_email, employee_id, mobile_no, account_id
                                ]
                            }
                            result_insert = await querySql(connectiondb, sqlupdate)
                        }
                    }
                    logService.SaveTransactionSyncData(connectiondb, "account", "Success")
                    return [200, 'update success']
                } else {
                    logService.SaveTransactionSyncData(connectiondb, "account", "Success")
                    return [200, 'update success']
                }
            }
            return data_arr_account
        } catch (err) {
            console.log(err)
            return [400, err]
            // return data_arr_account
        }
    },
    fetch_bizaccount_v2: async function (data_decry, tax_id, token_oneid) {
        try {
            var connectiondb = data_decry.db_connect
            var arrbizUser_Select = data_decry.biz_user_select
            var one_result_data = data_decry.one_result_data
            // var one_result_data = r[1].data_login.one_result_data
            var User_account_id = one_result_data.id
            var User_first_name_th = one_result_data.first_name_th
            var User_last_name_th = one_result_data.last_name_th
            var User_first_name_eng = one_result_data.first_name_eng
            var User_last_name_eng = one_result_data.last_name_eng
            var User_account_title_th = one_result_data.account_title_th
            var User_account_title_eng = one_result_data.account_title_eng
            var User_thai_email = one_result_data.thai_email
            var biz_detail = one_result_data.biz_detail
            token_oneid = 'Bearer ' + token_oneid
            data_arr_account = []
            let account_list = []
            url_oneid_business = globalUrlOne + '/api/v2/service/business/account'
            console.log(url_oneid_business)
            param_req_business = {
                tax_id: tax_id
            }
            res_business = await callOneid.call_getbusinessAccount(url_oneid_business, param_req_business, token_oneid)
            if (res_business[0] == 200) {
                data = res_business[1].data
                if (data.result == 'Success') {
                    data_arr_account = data.data
                    let account_list = []
                    for (i = 0; i < data_arr_account.length; i++) {
                        account_id = data_arr_account[i].id
                        first_name_th = data_arr_account[i].first_name_th
                        last_name_th = data_arr_account[i].last_name_th
                        first_name_eng = data_arr_account[i].first_name_eng
                        last_name_eng = data_arr_account[i].last_name_eng
                        account_title_th = data_arr_account[i].account_title_th
                        account_title_eng = data_arr_account[i].account_title_eng
                        thai_email = data_arr_account[i].thai_email
                        thai_email2 = data_arr_account[i].thai_email2
                        thai_email3 = data_arr_account[i].thai_email3
                        employee_email = null
                        employee_id = null
                        mobile_no = null
                        if (data_arr_account[i].has_employee_detail != null) {
                            employee_email = data_arr_account[i].has_employee_detail.email
                            employee_id = data_arr_account[i].has_employee_detail.employee_id
                            mobile_no = data_arr_account[i].has_employee_detail.mobile_no
                        }
                        var account_data = {
                            account_id:account_id,
                            first_name_th:first_name_th,
                            last_name_th:last_name_th,
                            first_name_eng:first_name_eng,
                            last_name_eng:last_name_eng,
                            account_title_th:account_title_th,
                            account_title_eng:account_title_eng,
                            thai_email:thai_email,
                            thai_email2:thai_email2,
                            thai_email3:thai_email3,
                            employee_email:employee_email,
                            employee_id:employee_id,
                            mobile_no:mobile_no
                        }
                        account_list.push(Object.values(account_data))
                    }
                    const sqldelete = {
                        sql: `DELETE FROM tb_account;`,
                        values: []
                    }
                    result_delete = await querySql(connectiondb, sqldelete)
                    let sqlinsert = {
                        sql: `INSERT INTO tb_account (account_id,first_name_th, last_name_th,first_name_eng,last_name_eng, account_title_th, account_title_eng, thai_email, thai_email2, thai_email3,\
                            employee_email,employee_id, mobile_no) VALUES ?`,
                        values: [account_list]
                    }
                    result_insert = await querySql(connectiondb, sqlinsert)
                    // if (result_insert!=)
                    logService.SaveTransactionSyncData(connectiondb, "account", "Success")
                    return [200, 'update success']
                } else {
                    logService.SaveTransactionSyncData(connectiondb, "account", "Success")
                    return [200, 'update success']
                }
            }
            return data_arr_account
        } catch (err) {
            console.log(err)
            return [400, err]
            // return data_arr_account
        }
    },
    fetch_OrgAccount: async function (data_decry, tax_id, token_oneid) {
        try {
            var connectiondb = data_decry.db_connect
            var arrbizUser_Select = data_decry.biz_user_select
            var one_result_data = data_decry.one_result_data
            // var one_result_data = r[1].data_login.one_result_data
            var User_account_id = one_result_data.id
            var User_first_name_th = one_result_data.first_name_th
            var User_last_name_th = one_result_data.last_name_th
            var User_first_name_eng = one_result_data.first_name_eng
            var User_last_name_eng = one_result_data.last_name_eng
            var User_account_title_th = one_result_data.account_title_th
            var User_account_title_eng = one_result_data.account_title_eng
            var User_thai_email = one_result_data.thai_email
            var biz_detail = one_result_data.biz_detail
            // if (connectiondb != null) {
            //     await consql(connectiondb)
            // }
            token_oneid = 'Bearer ' + token_oneid
            data_arr_account = []
            url_oneid_business = globalUrlOne + '/api/v2/service/business/account?tax_id=' + tax_id
            console.log(url_oneid_business)
            param_req_business = {
                tax_id: tax_id
            }
            // cluster.getConnection = util.promisify(cluster.getConnection);
            // var connection = await cluster.getConnection("master")
            // connection.query = util.promisify(connection.query)
            // connection.release();
            res_acc = await callOneid.call_getbusinessAccount(url_oneid_business, param_req_business, token_oneid)
            if (res_acc[0] === 200) {
                let data_acc = res_acc[1].data
                if (data_acc.result == 'Success') {
                    data_arr_acc = data_acc.data
                    for (let i = 0; i < data_arr_acc.length; i++) {
                        const element = data_arr_acc[i];
                        let user_id = element.id
                        let accone = globalUrlOne + '/api/v2/service/business/account/' + user_id + '?tax_id=' + tax_id
                        res_acc_one = await callOneid.call_getbusinessAccount(accone, param_req_business, token_oneid)
                        let data_accone = res_acc_one[1].data.data.has_role
                        if (data_accone.length != 0) {
                            for (let i = 0; i < data_accone.length; i++) {
                                var dept_name = null
                                var role_name = null
                                var role_id = null
                                var dept_id = null
                                var oneid = null
                                const element_one = data_accone[i];
                                if (element_one.department != null) dept_name = element_one.department.dept_name, dept_id = element_one.department.id
                                if (element_one.role != null) role_name = element_one.role.role_name, role_id = element_one.role.id
                                oneid = String(element_one.id)
                                // if (element_one.role != null) role_id = element_one.role.id
                                var Ainfo = []
                                var Jinfo = {
                                    account_id: user_id,
                                    role_name: role_name,
                                    role_id: role_id,
                                    dept_name: dept_name,
                                    detp_id: dept_id
                                }
                                Ainfo.push(String(user_id))
                                Ainfo.push(String(role_name))
                                Ainfo.push(String(role_id))
                                Ainfo.push(String(dept_name))
                                Ainfo.push(String(dept_id))
                                Ainfo.push(String(oneid))
                                try {
                                    // const resQuery = await conn.query(`INSERT INTO tb_org_personal (account_id, role_name, role_id,dept_name,dept_id) VALUES (?,?,?,?,?)`, Ainfo);
                                    // const resQuery = await connection.query(`SELECT * FROM tb_org_personal WHERE account_id=` + user_id + ``);
                                    let sqlupdate = {
                                        sql: `SELECT * FROM tb_org_personal WHERE one_id=?`,
                                        values: [oneid]
                                    }
                                    result_insert = await querySql(connectiondb, sqlupdate)
                                    console.log(result_insert[0])
                                    if (!result_insert[0]) {
                                        let sqlupdate = {
                                            sql: `INSERT INTO tb_org_personal (account_id, role_name, role_id,dept_name,dept_id,one_id) VALUES (?,?,?,?,?,?)`,
                                            values: Ainfo
                                        }
                                        result_insert = await querySql(connectiondb, sqlupdate)
                                        // const resQuery = await conn.query(`UPDATE tb_org_personal SET role_name=?, role_id=?,dept_name=?,dept_id=? WHERE account_id=?;`, [role_name, role_id, dept_name, dept_id, user_id]);
                                        // const resQuery = await connection.query(`INSERT INTO tb_org_personal (account_id, role_name, role_id,dept_name,dept_id) VALUES (?,?,?,?,?)`, Ainfo);
                                    } else {
                                        let sqlupdate = {
                                            sql: `UPDATE tb_org_personal SET role_name=?, role_id=?,dept_name=?,dept_id=? WHERE one_id=? AND account_id=?;`,
                                            values: [role_name, role_id, dept_name, dept_id, oneid, user_id]
                                        }
                                        result_insert = await querySql(connectiondb, sqlupdate)
                                        // const resQuery = await connection.query(`UPDATE tb_org_personal SET role_name=?, role_id=?,dept_name=?,dept_id=? WHERE account_id=?;`, [role_name, role_id, dept_name, dept_id, user_id]);
                                        // const resQuery = await conn.query(`INSERT INTO tb_org_personal (account_id, role_name, role_id,dept_name,dept_id) VALUES (?,?,?,?,?)`, Ainfo);
                                    }
                                    // const res = await conn.query(`INSERT INTO ppl_prod.tb_org_personal (account_id, role_name, role_id,dept_name,dept_id) VALUES (?,?,?,?,?)`, Ainfo);
                                } catch (error) {
                                    console.log(error)
                                    continue
                                }
                            }
                        }
                    }
                }
            }
            logService.SaveTransactionSyncData(connectiondb, "org_personal", "Success")
            return [200, 'update success']
        } catch (err) {
            console.log(err)
            return [400, err]
            // return data_arr_account
        }
    },
    fetch_OrgAccount_v2: async function (data_decry, tax_id, token_oneid) {
        try {
            var connectiondb = data_decry.db_connect
            var arrbizUser_Select = data_decry.biz_user_select
            var one_result_data = data_decry.one_result_data
            // var one_result_data = r[1].data_login.one_result_data
            var User_account_id = one_result_data.id
            var User_first_name_th = one_result_data.first_name_th
            var User_last_name_th = one_result_data.last_name_th
            var User_first_name_eng = one_result_data.first_name_eng
            var User_last_name_eng = one_result_data.last_name_eng
            var User_account_title_th = one_result_data.account_title_th
            var User_account_title_eng = one_result_data.account_title_eng
            var User_thai_email = one_result_data.thai_email
            var biz_detail = one_result_data.biz_detail
            // if (connectiondb != null) {
            //     await consql(connectiondb)
            // }
            let personal_list = []
            token_oneid = 'Bearer ' + token_oneid
            data_arr_account = []
            url_oneid_business = globalUrlOne + '/api/v2/service/business/account?tax_id=' + tax_id
            console.log(url_oneid_business)
            param_req_business = {
                tax_id: tax_id
            }
            res_acc = await callOneid.call_getbusinessAccount(url_oneid_business, param_req_business, token_oneid)
            if (res_acc[0] === 200) {
                let data_acc = res_acc[1].data
                if (data_acc.result == 'Success') {
                    data_arr_acc = data_acc.data
                    for (let i = 0; i < data_arr_acc.length; i++) {
                        const element = data_arr_acc[i];
                        let user_id = element.id
                        let accone = globalUrlOne + '/api/v2/service/business/account/' + user_id + '?tax_id=' + tax_id
                        res_acc_one = await callOneid.call_getbusinessAccount(accone, param_req_business, token_oneid)
                        let data_accone = res_acc_one[1].data.data.has_role
                        if (data_accone.length != 0) {
                            for (let i = 0; i < data_accone.length; i++) {
                                var dept_name = null
                                var role_name = null
                                var role_id = null
                                var dept_id = null
                                var oneid = null
                                const element_one = data_accone[i];
                                if (element_one.department != null) dept_name = element_one.department.dept_name, dept_id = element_one.department.id
                                if (element_one.role != null) role_name = element_one.role.role_name, role_id = element_one.role.id
                                oneid = String(element_one.id)
                                // if (element_one.role != null) role_id = element_one.role.id
                                var Ainfo = []
                                var Jinfo = {
                                    one_id:oneid,
                                    account_id: user_id,
                                    role_name: role_name,
                                    role_id: role_id,
                                    dept_name: dept_name,
                                    detp_id: dept_id
                                }
                                personal_list.push(Object.values(Jinfo))
                            }
                        }
                    }
                    const sqldelete = {
                        sql: `DELETE FROM tb_org_personal;`,
                        values: []
                    }
                    result_delete = await querySql(connectiondb, sqldelete)
                    const sqlupdate = {
                        sql: `INSERT INTO tb_org_personal (one_id, account_id, role_name, role_id, dept_name, dept_id) VALUES ?`,
                        values: [personal_list]
                    }
                    result_insert = await querySql(connectiondb, sqlupdate)
                }
            }
            logService.SaveTransactionSyncData(connectiondb, "org_personal", "Success")
            return [200, 'update success']
        } catch (err) {
            console.log(err)
            return [400, err]
            // return data_arr_account
        }
    }
}