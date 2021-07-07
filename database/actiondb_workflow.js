require('../config/lib')
require('../config/global')
require('../config/mongo_db')
const workflow_Schema = require('../schema/workflow.sch')
const {
    connonsql
} = require('../config/mongo_db')

var insert_workflow = async function(json_data,datainsert) {
    try {
        var connectiondb = json_data.connectiondb
        if (connectiondb != null) { await connonsql(connectiondb) }
        let res_insert = new workflow_Schema (datainsert)
        await res_insert.save()
        return [true,res_insert]
    } catch (error) {
        console.log(error)
        return [false,error.message]
    }
    
}

var select_workflow = async function(json_data,id_workflow) {
    try {
        var connectiondb = json_data.db_connect
        if (connectiondb != null) { await connonsql(connectiondb) }
        let r_workflow = await workflow_Schema.findOne({
            _id: id_workflow,
            
        })
        return [true,r_workflow]
    } catch (error) {
        console.log(error)
        return [false,error.message]
    }
    
}

// var select_workflow_all = async function(json_data) {
//     try {
//         var connectiondb = json_data.db_connect
//         if (connectiondb != null) { await connonsql(connectiondb) }
//         let r_workflow = await workflow_Schema.find({
//             status: 'ACTIVE'
//         },{
//             __v: 0,
//             pdfbase64:0
//         })
//         return [true,r_workflow]
//     } catch (error) {
//         console.log(error)
//         return [false,error.message]
//     }
    
// }

var select_workflow_all = async function(json_data) {
    try {
        var list_workflow = []
        var connectiondb = json_data.db_connect
        if (connectiondb != null) { await connonsql(connectiondb) }
        let r_workflow = await workflow_Schema.find({
            status: 'ACTIVE'
        },{
            __v: 0,
            pdfbase64:0
        })
        var biz_user_select = json_data.biz_user_select
        for (let j=0 ; j<r_workflow.length ; j++){
            var tmp_permission = r_workflow[j].permission
            if (tmp_permission.length == 0){
                list_workflow.push(r_workflow[j])
            }
            else{
                for (let k=0 ; k<tmp_permission.length ; k++){
                    var dept_id = tmp_permission[k].dept_id
                    var role_id = tmp_permission[k].role_id
                    for (let i=0 ; i<biz_user_select.length ; i++){
                        var User_deptid = biz_user_select[i].dept_id
                        var User_roleid = biz_user_select[i].role_id
                        var arr_User_permis = []
                        if (dept_id != null) {
                            if (User_deptid == dept_id) {
                                arr_User_permis.push(true)
                            } else {
                                arr_User_permis.push(false)
                            }
                        }else {
                            arr_User_permis.push(true)
                        }
                        if (role_id != null) {
                            if (User_roleid == role_id) {
                                arr_User_permis.push(true)
                            } else {
                                arr_User_permis.push(false)
                            }
                        } else {
                            arr_User_permis.push(true)
                        }
                        if(arr_User_permis.includes(false)){
                            // pass
                        } else {
                            list_workflow.push(r_workflow[j])
                        }
                        
                       
                    }
                }
            }
        }
        return [true,list_workflow]
    } catch (error) {
        console.log(error)
        return [false,error.message]
    }
    
}




var self = module.exports = {
    insert_workflow,
    select_workflow_all,
    select_workflow
}