require('../config/lib')
require('../config/global')

// const {
//     consql
// } = require('../config/maria_db')

const {querySql} = require("../config/maria_db")

var self = module.exports = {
    get_orgchart_by_deptAndRoleV2: async function (dept_id,role_id) {
        // default Value
        arr_dept = []
        // 
        cluster.getConnection = util.promisify(cluster.getConnection);
        let connection = await cluster.getConnection("master")
        connection.query = util.promisify(connection.query)
        // connection.release();
        // result_select = await connection.query(
        //     'SELECT * \
        //     FROM tb_org_biz_role \
        //     WHERE tb_org_biz_role.role_id = "'+role_id+'"')
        result_select = await connection.query(
            'SELECT tb_org_biz_role.role_id,\
                    tb_org_biz_role.dept_id,\
                    tb_org_biz_role.role_name,\
                    tb_org_biz_dept.dept_name,\
                    tb_org_biz_dept.parent_dept_id,\
                    tb_org_biz_dept.dept_position \
            FROM tb_org_biz_role \
            INNER JOIN tb_org_biz_dept ON tb_org_biz_role.dept_id = tb_org_biz_dept.dept_id\
            WHERE tb_org_biz_role.role_id = "'+role_id+'" and tb_org_biz_role.dept_id = "'+dept_id+'"')
        if (result_select.length != 0 ) {
            data = result_select
            arr_info = []
            // return data
            for(x=0;x<data.length;x++){
                arr_account = []
                arr_dept = []

                glo_role_id = data[x].role_id
                glo_dept_id = data[x].dept_id
                glo_role_name = data[x].role_name
                glo_dept_name = data[x].dept_name
                glo_dept_position = data[x].dept_position
                glo_parent_dept_id = data[x].parent_dept_id
                parent_dept_id = data[x].parent_dept_id

                res_sel_personal= await connection.query(
                    'SELECT account_id FROM tb_org_personal \
                    WHERE dept_id = "'+glo_dept_id+'" AND role_id = "'+glo_role_id+'"')
                arr_account = res_sel_personal
                arr_dept = []
                // json_dept_info = {
                //     dept_id: glo_dept_id,
                //     dept_name: glo_dept_name,
                //     dept_position: dept_position,
                //     parent_dept_id: parent_dept_id,
                // }
                // arr_dept.push(json_dept_info)
                // 
                
                while(parent_dept_id != null){
                    res_sel_parent = await connection.query(
                        'SELECT * \
                        FROM tb_org_biz_dept \
                        WHERE tb_org_biz_dept.dept_id = "'+parent_dept_id+'"')
                   
                    dept_id = res_sel_parent[0].dept_id
                    parent_dept_id = res_sel_parent[0].parent_dept_id
                    
                    
                    json_dept_info = {
                        dept_id: dept_id,
                        dept_name: res_sel_parent[0].dept_name,
                        dept_position: res_sel_parent[0].dept_position,
                        parent_dept_id: parent_dept_id,
                    }
                    arr_dept.push(json_dept_info)
                }

                // 
                json_info_user = {
                    role_id: glo_role_id,
                    role_name: glo_role_name,
                    dept_id: glo_dept_id,
                    dept_name: glo_dept_name,
                    dept_position: glo_dept_position,
                    parent_dept_id:glo_parent_dept_id,
                    Arr_account_of_deptrole: arr_account,
                    arr_parent_dept: arr_dept
                    // dept_id: res_sel_parent[0].dept_id,
    //                     dept_name: res_sel_parent[0].dept_name,
    //                     dept_position: res_sel_parent[0].dept_position,
    //                     parent_dept_id: res_sel_parent[0].parent_dept_id,
    //                     arr_role: arr_role
                }
                
                arr_info.push(json_info_user)
                    
            
                
                
            }
            
            return {status: 'success',data: arr_info}

        } else {
            return {status: 'fail',data: 'not found data'}
        }
    },
    get_orgchart_roleid: async function (data_decry,role_id) {
        // เชื่อมต่อ connection
        // if (connectiondb != null) { await consql(connectiondb) }
        // cluster.getConnection = util.promisify(cluster.getConnection);
        // let connection = await cluster.getConnection("master")
        // connection.query = util.promisify(connection.query)
        // result_select = await connection.query(
        //     'SELECT tb_org_biz_role.role_id,\
        //             tb_org_biz_role.dept_id,\
        //             tb_org_biz_role.role_name,\
        //             tb_org_biz_dept.dept_name,\
        //             tb_org_biz_dept.parent_dept_id,\
        //             tb_org_biz_dept.dept_position \
        //     FROM tb_org_biz_role \
        //     INNER JOIN tb_org_biz_dept ON tb_org_biz_role.dept_id = tb_org_biz_dept.dept_id\
        //     WHERE tb_org_biz_role.role_id = "'+role_id+'"')
        var sql_text = {
            sql:`SELECT tb_org_biz_role.role_id,\
                    tb_org_biz_role.dept_id,\
                    tb_org_biz_role.role_name,\
                    tb_org_biz_dept.dept_name,\
                    tb_org_biz_dept.parent_dept_id,\
                    tb_org_biz_dept.dept_position \
            FROM tb_org_biz_role \
            INNER JOIN tb_org_biz_dept ON tb_org_biz_role.dept_id = tb_org_biz_dept.dept_id\
            WHERE tb_org_biz_role.role_id = ?`,
            values:[role_id]
        }
        result_select = await querySql(data_decry.db_connect,sql_text)
        if (result_select.length != 0 ) {
            var data = result_select
            arr_info = []
            for(x=0;x<data.length;x++){
                arr_account = []
                arr_dept = []
                glo_role_id = data[x].role_id
                glo_dept_id = data[x].dept_id
                glo_role_name = data[x].role_name
                glo_dept_name = data[x].dept_name
                glo_dept_position = data[x].dept_position
                glo_parent_dept_id = data[x].parent_dept_id
                parent_dept_id = data[x].parent_dept_id
                // res_sel_personal= await connection.query(
                //     'SELECT tb_org_personal.account_id,\
                //             tb_account.first_name_th, \
                //             tb_account.last_name_th, \
                //             tb_account.first_name_eng, \
                //             tb_account.last_name_eng, \
                //             tb_account.account_title_th, \
                //             tb_account.account_title_eng, \
                //             tb_account.thai_email \
                //         FROM tb_org_personal\
                //     INNER JOIN tb_account ON tb_org_personal.account_id = tb_account.account_id\
                //     WHERE dept_id = "'+glo_dept_id+'" AND role_id = "'+glo_role_id+'"')
                // console.log(glo_dept_id,glo_role_id)
                var sql02 = {
                    sql:`SELECT tb_org_personal.account_id,\
                            tb_account.first_name_th, \
                            tb_account.last_name_th, \
                            tb_account.first_name_eng, \
                            tb_account.last_name_eng, \
                            tb_account.account_title_th, \
                            tb_account.account_title_eng, \
                            tb_account.thai_email \
                        FROM tb_org_personal\
                    INNER JOIN tb_account ON tb_org_personal.account_id = tb_account.account_id\
                    WHERE dept_id = ? AND role_id = ?`,
                    values:[glo_dept_id,glo_role_id]
                }
                res_sel_personal = await querySql(data_decry.db_connect,sql02)
                arr_account = res_sel_personal
                arr_dept = []
                while(parent_dept_id != null){
                    // res_sel_parent = await connection.query(
                    //     'SELECT * \
                    //     FROM tb_org_biz_dept \
                    //     WHERE tb_org_biz_dept.dept_id = "'+parent_dept_id+'"')
                    var sql03 = {
                        sql:`SELECT * \
                        FROM tb_org_biz_dept \
                        WHERE tb_org_biz_dept.dept_id = ?`,
                        values:[parent_dept_id]
                    }
                    res_sel_parent = await querySql(data_decry.db_connect,sql03)
                    dept_id = res_sel_parent[0].dept_id
                    parent_dept_id = res_sel_parent[0].parent_dept_id
                    
                    
                    json_dept_info = {
                        dept_id: dept_id,
                        dept_name: res_sel_parent[0].dept_name,
                        dept_position: res_sel_parent[0].dept_position,
                        parent_dept_id: parent_dept_id,
                    }
                    arr_dept.push(json_dept_info)
                }

                // 
                json_info_user = {
                    role_id: glo_role_id,
                    role_name: glo_role_name,
                    deptid_of_role: glo_dept_id,
                    deptname_of_role: glo_dept_name,
                    deptposition_of_role: glo_dept_position,
                    parent_deptid_of_role:glo_parent_dept_id,
                    arr_accountid_in_roldedept: arr_account,
                    arr_parent_dept: arr_dept
                }
                
                arr_info.push(json_info_user)
                    
            
                
                
            }
            
            return {status: 'success',data: arr_info}

        } else {
            return {status: 'fail',data: 'not found data'}
        }
    },
    get_orgchart_by_deptAndRole: async function (dept_id,role_id) {
        // default Value
        arr_dept = []
        // 
        cluster.getConnection = util.promisify(cluster.getConnection);
        let connection = await cluster.getConnection("master")
        connection.query = util.promisify(connection.query)
        connection.release();
        result_select = await connection.query(
            'SELECT tb_org_biz_role.role_id,\
                    tb_org_biz_role.dept_id,\
                    tb_org_biz_role.role_name,\
                    tb_org_biz_dept.dept_name,\
                    tb_org_biz_dept.parent_dept_id,\
                    tb_org_biz_dept.dept_position \
            FROM tb_org_biz_role \
            INNER JOIN tb_org_biz_dept ON tb_org_biz_role.dept_id = tb_org_biz_dept.dept_id\
            WHERE tb_org_biz_role.role_id = "'+role_id+'" and tb_org_biz_role.dept_id = "'+dept_id+'"')
        if (result_select.length != 0 ) {
            data = result_select
            arr_info = []
            for(x=0;x<data.length;x++){
                dept_id = data[x].dept_id
                parent_dept_id = data[x].parent_dept_id
                dept_name = data[x].dept_name
                dept_position = data[x].dept_position
                res_role = await connection.query('SELECT role_id,role_name,role_position,dept_id,createAt,updateAt \
                FROM tb_org_biz_role where dept_id = "'+dept_id+'" ORDER BY CAST(role_position AS INT) DESC')
                json_info_user = {
                    dept_id: dept_id,
                    dept_name: dept_name,
                    dept_position: dept_position,
                    parent_dept_id: parent_dept_id,
                    role_detail: res_role
                }
                arr_info.push(json_info_user)
                while(parent_dept_id != null){
                    res_sel_parent = await connection.query('SELECT * FROM tb_org_biz_dept where dept_id = "'+parent_dept_id+'" ')
                    dept_id = res_sel_parent[0].dept_id
                    res_sel_bizrole = await connection.query('SELECT role_id,role_name,role_position,dept_id,createAt,updateAt \
                    FROM tb_org_biz_role where dept_id = "'+dept_id+'" ORDER BY CAST(role_position AS INT) DESC ')
                    parent_dept_id = res_sel_parent[0].parent_dept_id
                  
                    json_info_parent = {
                        dept_id: res_sel_parent[0].dept_id,
                        dept_name: res_sel_parent[0].dept_name,
                        dept_position: res_sel_parent[0].dept_position,
                        parent_dept_id: res_sel_parent[0].parent_dept_id,
                        role_detail: res_sel_bizrole
                    }
                    arr_info.push(json_info_parent)
                }
               
                
            }
          
            return arr_info
        } else {
            return [400,'not found data']
        }
    },
    get_orgchart_deptid: async function (dept_id) {
        // default Value
        arr_dept = []
        // 
        cluster.getConnection = util.promisify(cluster.getConnection);
        let connection = await cluster.getConnection("master")
        connection.query = util.promisify(connection.query)
        // connection.release();
        result_select = await connection.query(
            'SELECT \
                    tb_org_biz_dept.dept_id, \
                    tb_org_biz_dept.dept_name, \
                    tb_org_biz_dept.dept_position,\
                    tb_org_biz_dept.parent_dept_id \
            FROM tb_org_biz_dept \
            WHERE tb_org_biz_dept.dept_id = "'+dept_id+'"')
            console.log(result_select)
            if (result_select.length != 0 ) {
                data = result_select
                arr_info = []
                for(x=0;x<data.length;x++){
                    dept_id = data[x].dept_id
                    parent_dept_id = data[x].parent_dept_id
                    dept_name = data[x].dept_name
                    dept_position = data[x].dept_position
                    console.log('dept_id',dept_id)
                    res_role = await connection.query('SELECT * FROM tb_org_biz_role where dept_id = "'+dept_id+'" ')
                    arr_biz_role = []
                    // 
                    for (y=0;y<res_role.length;y++){
                        role_id = res_role[y].role_id
                        res_sel_personal= await connection.query(
                            'SELECT account_id FROM tb_org_personal \
                            WHERE dept_id = "'+dept_id+'" AND role_id = "'+role_id+'"')
                        console.log(res_sel_personal)
                        if (res_sel_personal.length != 0) {
                            res_role[y].account_id = res_sel_personal
                        }else {
                            res_role[y].account_id = null
                        }
                        arr_biz_role.push(res_role[y])
                    // 
                    }
                    json_info_user = {
                        dept_id: dept_id,
                        dept_name: dept_name,
                        dept_position: dept_position,
                        parent_dept_id: parent_dept_id,
                        arr_role: arr_biz_role
                    }
                    arr_info.push(json_info_user)
                    while(parent_dept_id != null){
                        // console.log('parent_dept_id',parent_dept_id)
                        res_sel_parent = await connection.query('SELECT * FROM tb_org_biz_dept where dept_id = "'+parent_dept_id+'" ')
                        dept_id = res_sel_parent[0].dept_id
                        res_sel_bizrole = await connection.query('SELECT * FROM tb_org_biz_role where dept_id = "'+dept_id+'" ')
                        parent_dept_id = res_sel_parent[0].parent_dept_id
                        // 
                        arr_role = []
                        for (y=0;y<res_sel_bizrole.length;y++){
                            role_id = res_sel_bizrole[y].role_id
                            res_sel_personal= await connection.query(
                                'SELECT account_id FROM tb_org_personal \
                                WHERE dept_id = "'+dept_id+'" AND role_id = "'+role_id+'"')
                            if (res_sel_personal.length != 0) {
                                res_sel_bizrole[y].account_id = res_sel_personal
                            }else {
                                res_sel_bizrole[y].account_id = null
                            }
                           
                            // console.log('account_id',res_sel_personal)
                            arr_role.push(res_sel_bizrole[y])
                        }
                        json_info_parent = {
                            dept_id: res_sel_parent[0].dept_id,
                            dept_name: res_sel_parent[0].dept_name,
                            dept_position: res_sel_parent[0].dept_position,
                            parent_dept_id: res_sel_parent[0].parent_dept_id,
                            arr_role: arr_role
                        }
                        arr_info.push(json_info_parent)
                    }
                   
                    
                }
              
                return arr_info
            } else {
                return [400,'not found data']
            }
    },
    get_orgchart_oneid: async function (token,Selected_taxid,account_id) {
        // default Value
        arr_dept = []
        // 
        arrbizUser_Select = []
        var token = token.split(' ')[1]
        console.log('token',token)
        r = await sodium_ppl.data_login_Decrypted(token)
        // return r
        console.log(r)
        if (r[0] === 401) {
            return {status:'fail',data:null,messageER:r}
        }
          
        var one_result_data = r.data_login.one_result_data
        var User_account_id = one_result_data.id
        // console.log('User_account_id',User_account_id)
        // var User_first_name_th = one_result_data.first_name_th
        // var User_last_name_th = one_result_data.last_name_th
        // var User_first_name_eng = one_result_data.first_name_eng
        // var User_last_name_eng = one_result_data.last_name_eng
        // var User_account_title_th = one_result_data.account_title_th
        // var User_account_title_eng = one_result_data.account_title_eng
        // var User_thai_email = one_result_data.thai_email
        var biz_detail = one_result_data.biz_detail
        var db_data = r.db_data
        var connectiondb = null
        for (i=0;i<db_data.length;i++) {
            console.log(db_data[i].t,Selected_taxid)
            if (db_data[i].t == Selected_taxid) {
                console.log('ok taxid')
                connectiondb = db_data[i]
                break
            }
        } 
          
        for (y=0;y<biz_detail.length;y++){
            tmp_id_card_num = biz_detail[y].getbiz.id_card_num
            if(tmp_id_card_num == Selected_taxid){
                console.log(tmp_id_card_num)
                arrbizUser_Select.push(biz_detail[y])
            }
        }
        // เชื่อมต่อ connection
        console.log('connectiondb',connectiondb)
        if (connectiondb != null) { await consql(connectiondb) }
        cluster.getConnection = util.promisify(cluster.getConnection);
        let connection = await cluster.getConnection("master")
        connection.query = util.promisify(connection.query)
        connection.release();
        result_select = await connection.query(
                        'SELECT tb_org_personal.account_id, \
                                tb_org_biz_dept.dept_id, \
                                tb_org_biz_dept.dept_name, \
                                tb_org_biz_dept.dept_position,\
                                tb_org_biz_dept.parent_dept_id \
                        FROM tb_org_personal \
                        INNER JOIN tb_org_biz_dept ON tb_org_personal.dept_id = tb_org_biz_dept.dept_id \
                        WHERE tb_org_personal.account_id = "'+account_id+'"')
        if (result_select.length != 0 ) {
            data = result_select
            arr_info = []
            for(x=0;x<data.length;x++){
                dept_id = data[x].dept_id
                parent_dept_id = data[x].parent_dept_id
                dept_name = data[x].dept_name
                dept_position = data[x].dept_position
                // console.log('dept_id',dept_id)
                res_role = await connection.query('SELECT * FROM tb_org_biz_role where dept_id = "'+dept_id+'" ORDER BY CAST(role_position AS INT) DESC')
                arr_biz_role = []
                // 
                for (y=0;y<res_role.length;y++){
                    role_id = res_role[y].role_id
                    res_sel_personal= await connection.query(
                        'SELECT account_id FROM tb_org_personal \
                        WHERE dept_id = "'+dept_id+'" AND role_id = "'+role_id+'"')
                    // console.log(res_sel_personal)
                    if (res_sel_personal.length != 0) {
                        res_role[y].account_id = res_sel_personal
                    }else {
                        res_role[y].account_id = null
                    }
                    arr_biz_role.push(res_role[y])
                // 
                }
                json_info_user = {
                    dept_id: dept_id,
                    dept_name: dept_name,
                    dept_position: dept_position,
                    parent_dept_id: parent_dept_id,
                    arr_role: arr_biz_role
                }
                arr_info.push(json_info_user)
                while(parent_dept_id != null){
                    // console.log('parent_dept_id',parent_dept_id)
                    res_sel_parent = await connection.query('SELECT * FROM tb_org_biz_dept where dept_id = "'+parent_dept_id+'" ')
                    dept_id = res_sel_parent[0].dept_id
                    res_sel_bizrole = await connection.query('SELECT * FROM tb_org_biz_role where dept_id = "'+dept_id+'" ')
                    parent_dept_id = res_sel_parent[0].parent_dept_id
                    // 
                    arr_role = []
                    for (y=0;y<res_sel_bizrole.length;y++){
                        role_id = res_sel_bizrole[y].role_id
                        res_sel_personal= await connection.query(
                            'SELECT account_id FROM tb_org_personal \
                            WHERE dept_id = "'+dept_id+'" AND role_id = "'+role_id+'"')
                        if (res_sel_personal.length != 0) {
                            res_sel_bizrole[y].account_id = res_sel_personal
                        }else {
                            res_sel_bizrole[y].account_id = null
                        }
                       
                        // console.log('account_id',res_sel_personal)
                        arr_role.push(res_sel_bizrole[y])
                    }
                    json_info_parent = {
                        dept_id: res_sel_parent[0].dept_id,
                        dept_name: res_sel_parent[0].dept_name,
                        dept_position: res_sel_parent[0].dept_position,
                        parent_dept_id: res_sel_parent[0].parent_dept_id,
                        arr_role: arr_role
                    }
                    arr_info.push(json_info_parent)
                }
               
                
            }
          
            return arr_info
        } else {
            return [400,'not found data']
        }
    },
    get_head_department: async function(data_decry,account_id) {
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
            var arr = []
            var sql_text = {
                sql:`SELECT tb_org_personal.account_id, 
                            tb_org_personal.dept_id,
                            tb_org_personal.role_id,
                            tb_org_biz_role.role_name,
                            tb_org_biz_role.role_position,
                            tb_org_biz_role.parent_dept_role_id,
                            tb_org_biz_role.dept_role_level,
                            tb_org_biz_role.dept_role_position, 
                            tb_account.first_name_th 
                    FROM tb_org_personal \
                    INNER JOIN tb_org_biz_role ON (tb_org_personal.role_id = tb_org_biz_role.role_id AND tb_org_personal.dept_id = tb_org_biz_role.dept_id) 
                    INNER JOIN tb_account ON (tb_org_personal.account_id = tb_account.account_id)
                    WHERE tb_org_personal.account_id = ?`,
                values:[account_id]
            }
            var res_personal = await querySql(data_decry.db_connect,sql_text)
            for (let i=0;i<res_personal.length;i++) {
                let role_id = res_personal[i].role_id
                let dept_id = res_personal[i].dept_id
                let role_position = res_personal[i].role_position
                let dept_role_level = res_personal[i].dept_role_level
                let dept_role_position = res_personal[i].dept_role_position
                // head value select
                let head_dept_role_level = Number(dept_role_level) - 1
                let ARR_dept_role_position = dept_role_position.split('.')
                let ARR_length = (ARR_dept_role_position.length) - 1
                var headdept_id = ''
                for (let i=0;i<ARR_length;i++) {
                    // ARR_dept_role_position[i]
                    if (i == 0){
                        headdept_id =  headdept_id + ARR_dept_role_position[i] + '.'
                    } else {
                        headdept_id =  headdept_id + ARR_dept_role_position[i]
                    }
                }
                // console.log('role_position',role_position)
                // console.log('head_dept_role_level',head_dept_role_level)
                // console.log('dept_role_position',headdept_id)
                // console.log('dept_id',dept_id)
                // console.log('_____________________--')
                

                let sql_txt2 = {
                    sql:'SELECT tb_org_personal.account_id ,tb_org_personal.role_id ,tb_org_personal.dept_id ,tb_org_personal.dept_name ,tb_org_personal.role_name ,tb_account.first_name_th \
                        from tb_org_personal \
                        inner join tb_org_biz_role on (tb_org_personal.role_id = tb_org_biz_role.role_id and tb_org_personal.dept_id = tb_org_biz_role.dept_id) \
                        INNER JOIN tb_account ON (tb_org_personal.account_id = tb_account.account_id) \
                        where tb_org_biz_role.role_position = "'+role_position+'" \
                        and tb_org_biz_role.dept_role_level = "'+head_dept_role_level+'" \
                        and tb_org_biz_role.dept_role_position = "'+headdept_id+'" \
                        and tb_org_personal.dept_id = "'+dept_id+'"'
                }
                var res_header = await querySql(data_decry.db_connect,sql_txt2)
                arr.push(res_header)
              
            }
            return [true,arr]
            // SELECT * from inetdb.tb_org_personal 
            // inner join inetdb.tb_org_biz_role on inetdb.tb_org_personal.role_id = inetdb.tb_org_biz_role.role_id
            // where inetdb.tb_org_biz_role.role_position = '10' and inetdb.tb_org_biz_role.dept_role_level = '2'
            // and dept_role_position = '1.1' and parent_dept_role_id = '9a732b00-369c-11ea-9b8d-e16275a2fb26'

            // INNER JOIN tb_org_biz_role ON tb_org_personal.role_id = tb_org_biz_role.role_id
            // INNER JOIN tb_account ON tb_org_personal.account_id = tb_account.account_id

            return [true,res_personal]
        }catch (err) {
            console.log(err)
            return [false,err]
        }
    }
}