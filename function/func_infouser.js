require('../config/lib')
require('../config/global')

const {
    querySql
} = require('../config/maria_db')


var self = module.exports = {
    find_deptName: async function (connectionDB,dept_id) {
        try {
            let sql = 'SELECT * FROM tb_org_biz_dept WHERE tb_org_biz_dept.dept_id = "'+dept_id+'"'
            var result_select = await querySql(connectionDB,sql)
            return [true,result_select]
        } catch (err) {
            console.log(err)
            return [false,err]
        }
    },
    find_roleName: async function (connectionDB,role_id) {
        try {
            let sql = 'SELECT * FROM tb_org_biz_role WHERE tb_org_biz_role.role_id = "'+role_id+'"'
            var result_select = await querySql(connectionDB,sql)
            return [true,result_select]
        } catch (err) {
            console.log(err)
            return [false,err]
        }
    },
    find_infoUserbyAcc: async function (account_id,connectionDB) {
        try {
            let sql = 'SELECT \
                    tb_account.account_id, \
                    tb_account.first_name_th, \
                    tb_account.last_name_th, \
                    tb_account.first_name_eng, \
                    tb_account.last_name_eng , \
                    tb_account.account_title_th, \
                    tb_account.account_title_eng, \
                    tb_account.thai_email, \
                    tb_account.thai_email2, \
                    tb_account.thai_email3, \
                    tb_account.employee_email, \
                    tb_account.employee_id, \
                    tb_account.mobile_no, \
                    Json_Array(tb_org_personal.role_name) AS role_name, \
                    Json_Array(tb_org_personal.role_id) AS role_id, \
                    Json_Array(tb_org_personal.dept_name) AS dept_name, \
                    Json_Array(tb_org_personal.dept_id) AS dept_id\
                    FROM tb_account \
                    INNER JOIN tb_org_personal ON tb_account.account_id = tb_org_personal.account_id \
                    where tb_account.account_id = "'+account_id+'" GROUP BY account_id '
            result_select = await querySql(connectionDB,sql)
            return result_select
        }catch(err) {
            console.log('err',err)
            return[false,err]
        }
        
    },
    find_infoUserbyAcc_v2: async function (account_id,connectionDB) {
        try {
            arr_roleid = []
            arr_rolename = []
            arr_deptid = []
            arr_deptname = []
            let sql = 'SELECT \
                    tb_account.account_id, \
                    tb_account.first_name_th, \
                    tb_account.last_name_th, \
                    tb_account.first_name_eng, \
                    tb_account.last_name_eng , \
                    tb_account.account_title_th, \
                    tb_account.account_title_eng, \
                    tb_account.thai_email, \
                    tb_account.thai_email2, \
                    tb_account.thai_email3, \
                    tb_account.employee_email, \
                    tb_account.employee_id, \
                    tb_account.mobile_no, \
                    tb_org_personal.role_name, \
                    tb_org_personal.role_id, \
                    tb_org_personal.dept_name, \
                    tb_org_personal.dept_id\
                    FROM tb_org_personal \
                    INNER JOIN tb_account ON tb_org_personal.account_id = tb_account.account_id \
                    where tb_org_personal.account_id = "'+account_id+'" '
            var result_select = await querySql(connectionDB,sql)
            // var tmpdict = {}
            // var arrnew = []
            // for (let i=0;i<result_select.length;i++) {
            //     let idxaccount = arrnew.findIndex(x => x.account_id === result_select[i].account_id)
            //     if (idxaccount >= 0) {
            //         result_select[idxaccount].arr_roleid.push(result_select[i].role_id)
            //         result_select[idxaccount].arr_rolename.push(result_select[i].role_name)
            //         result_select[idxaccount].arr_deptname.push(result_select[i].dept_name)
            //         result_select[idxaccount].arr_deptid.push(result_select[i].dept_id)

            //     } else {
            //         tmpdict = (result_select[i])
            //         tmpdict.arr_roleid = [result_select[i].role_id]
            //         tmpdict.arr_deptid = [result_select[i].dept_id]
            //         tmpdict.arr_rolename = [result_select[i].role_name]
            //         tmpdict.arr_deptname = [result_select[i].dept_name]
            //         arrnew.push(tmpdict)
            //     }
            // }
            return result_select

            return result_select
        }catch(err) {
            console.log('err',err)
            return[false,err]
        }
        
    },
    check_permission: async function (tmp_role_id,User_roleid) {
        var pesmisStatus = false
        console.log(tmp_role_id,User_roleid)
        if (tmp_role_id != null) {
            if (User_roleid == tmp_role_id) {
                // arr_User_permis.push(true)
                pesmisStatus = true
            } else {
                // arr_User_permis.push(false)
                pesmisStatus = false
            }
        }else {
            // arr_User_permis.push(true)
            pesmisStatus = true
        }
        if (tmp_dept_id != null) {
            if (User_deptid == tmp_dept_id) {
                // arr_User_permis.push(true)
                pesmisStatus = true
            } else {
                // arr_User_permis.push(false)
                pesmisStatus = false
            }
        }else {
            // arr_User_permis.push(true)
            pesmisStatus = true
        }
        return pesmisStatus
    },
    find_userByOrg: async function (role_id,dept_id,connectionDB) {
        try {
            let sql = 'SELECT \
                        tb_account.account_id, \
                        tb_account.first_name_th, \
                        tb_account.last_name_th, \
                        tb_account.first_name_eng, \
                        tb_account.last_name_eng , \
                        tb_account.account_title_th, \
                        tb_account.account_title_eng, \
                        tb_account.thai_email, \
                        Json_Array(tb_org_personal.role_name) AS role_name, \
                        Json_Array(tb_org_personal.role_id) AS role_id, \
                        Json_Array(tb_org_personal.dept_name) AS dept_name, \
                        Json_Array(tb_org_personal.dept_id) AS dept_id\
                        FROM tb_account \
                        INNER JOIN tb_org_personal ON tb_account.account_id = tb_org_personal.account_id '
            let sqlwhere = 'where '
            if (role_id != null) {
                sqlwhere += 'tb_org_personal.role_id = "'+role_id+'"'
            }
            if (dept_id != null) {
                if (sqlwhere.length > 5) {
                    sqlwhere += ' AND '
                }
                sqlwhere += 'tb_org_personal.dept_id ="'+dept_id+'" '
            }   
            sql += sqlwhere + ' GROUP BY account_id'
            var result_select = await querySql(connectionDB,sql)
            return {
                status: 'SUCCESS',
                data:result_select,
                messageER: null
            }
        } catch (err) {
            console.log(err)
            return {
                status: 'FAIL',
                data: null,
                messageER: err
            }
        }
        
    }
  
}

