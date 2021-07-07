require('../config/lib')
require('../config/global')
const flow_Schema = require('../schema/flow.sch')
const transaction_Schema = require('../schema/transaction_document')
const func_infouser = require('../function/func_infouser')
const get_orgchart = require('../method/orgchart_process')
const tracking = require('../method/tracking.func')
const document = require('../method/document.func')
const func_pdf = require('../function/func_pdf')
const func_hash = require('../function/func_hash')
const condition = require('../method/conditon')
const db_transaction = require('../database/actiondb_transaction')
const func_doc = require('../function/func_docuement')
const func_html = require('../function/func_dataTohtml')
const actionflow = require('../database/actiondb_flow')
const actiontransaction = require('../database/actiondb_transaction')
const db_select = require('../database/db_select')
const html_to_pdf = require('../method/htmltopdf')
const func_datetime = require('../function/func_datetime')
const inputlog = require('../database/transaction_input')
const insertlogdoc = require('../database/db_document_log')
const sign_process = require('../method/sign_process')
const transac_group = require('../database/transaction_group')
const actionworkflow = require('../database/actiondb_workflow')
const serviceMethod = require('../method/service')
const otherProcess = require('../method/other.process')
const condition_method = require('../database/coditionmethod');
const func_smtp = require('../function/func_smtp')
const onebox_process = require('../method/onebox_process')
const db_doctype = require('../database/db_select')

// const noticationFunc = require('../function/notication.func')
const {
    connonsql
} = require('../config/mongo_db')
const compression = require('compression')
const fs = require('fs')
const { timeStamp, group } = require('console')


var self = module.exports = {
    flow_to_transaction_version4: async function (data_decry,r_flow,jsonDetail,input,doctype,flowId,actor_update,hederbiz,sign_info,subject,body,id_workflow,group_id,token) {
        var attachfile_summarygroup = ""
        var status_summary_group = false
        var arrlog = []
        var stepaction_current = null
        var logdoc_action = 'create'
        var logdoc_status = 'yes'
        var status_doc = 'ACTIVE'
        var path = null
        var path_pdf_original = null
        var path_pdf_sign = null
        var path_hash_original = null
        var path_pdfhashsign = null
        var color = null
        var ref = ''
        var status_view_pdf = false
        // 
        var pdfSize = 0
        var now = timemoment().format();
        var status_group = null
        var type_of_team = r_flow.type_of_team
        var type_of_flow = r_flow.type_of_flow
        // check status group จาก workflow ที่ใช้
        var res_workflow = await actionworkflow.select_workflow(data_decry,id_workflow)
        if (res_workflow[0]) {
            status_group = res_workflow[1].status_group
        } else {
            let tmperror = {
                msg_thai : 'ไม่พบรูปแบบการทำงานที่ต้องการสร้าง',
                msg_eng : 'Cannot find the work flow to create the document'
            }
            return [false,res_workflow[1],tmperror]
        }
        // find group detail
        var ref_doc_id = null
        var res_detail_ref = null
        var ref_tranid = null
        if (group_id != '') {
            var res_find_detailgroup = await transac_group.select_transactiongroup(data_decry,group_id)
            if (!(res_find_detailgroup[0])) {
                 let tmperror = {
                     msg_thai: 'ไม่พบรายละเอียดเอกสารอ้างอิง',
                     msg_eng: 'No reference document was found'
                 }
                 return [false,res_find_detailgroup[1],tmperror]
            }
            var list_transactiongroup = res_find_detailgroup[1].list_transaction
            var indexref = res_find_detailgroup[1].detail.findIndex(x => x.document_type === doctype)
            if (indexref < 0) {
                let tmperror = {
                     msg_thai: 'ไม่พบรายละเอียดเอกสารอ้างอิง',
                     msg_eng: 'No reference document was found'
                }
                return[false,null,tmperror]
            }
            doctype_ref = res_find_detailgroup[1].detail[indexref-1].document_type
            var indexref_doctype = list_transactiongroup.findIndex(x => x.doctype === doctype_ref)
            ref_doc_id = list_transactiongroup[indexref_doctype].document_id
            ref_tranid = list_transactiongroup[indexref_doctype].transaction_id
        }
        if (group_id != '') {
            res_detail_ref = await actiontransaction.find_transaction_from_documentid(data_decry.db_connect,ref_tranid)
        }
        try {
            var biz_name = data_decry.biz_user_select[0].getbiz.first_name_th
            var access_token = data_decry.one_access_token
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
            var data = r_flow.flow_data
            var flow_name = r_flow.flow_name
            var status_pesonal = 'Incomplete'
            var status_imp_change = true
            for(let i=0;i<data.length;i++) {
                var data_actor_list = []
                var Arrdept_accept = []
                var Arrrole_accept = []
                var Arrrolename_accept = []
                var Arrdeptname_accept = []
                var action = data[i].action 
                var conditionflow = data[i].condition
                var condition_idflow = data[i].condition_id
                var actor_type = data[i].actor_type
                var self = data[i].self
                var permission_status = data[i].permission_status
                var permission = data[i].permission
                var index = data[i].index
                var status_implement = data[i].status_implement
                var input_status = data[i].input_status
                var ref_permis_status = data[i].ref_permis_status
                var ref_permission = data[i].ref_permission
                var flowStatus = data[i].flow
                var actor = data[i].actor
                let status_break = false
                // console.log('index',index)
                if (i != 0) {
                    if (data[i-1].status_implement === false) {
                        if (data[i-1].condition != true) {
                            let tmperror = {
                                msg_thai: 'ลำดับการทำงานที่ ' + String((i-1)+1) + 'ไม่พบสิทธิ์',
                                msg_eng: 'Your account does not have access rights.'
                            }
                            return [false,data,tmperror]
                        }
                    }
                }
                if (status_implement == false) {
                    if (flowStatus == false) {
                        if (permission_status == true) {
                            // console.log('permission_status true')
                            // console.log('self',self)
                            if (permission != null) {
                                for(k=0;k<permission.length;k++){
                                    var tmp_permission = permission[k]
                                    var tmp_role_id = tmp_permission.role_id
                                    var tmp_dept_id = tmp_permission.dept_id
                                    var tmp_role_name = tmp_permission.role_name
                                    var tmp_dept_name = tmp_permission.dept_name
                                    // console.log('k',k,tmp_role_id,tmp_dept_name)
                                    if (self == true) {
                                        for (m=0;m<arrbizUser_Select.length;m++){
                                            User_roleid =  null
                                            User_deptid = null
                                            if (doctype == 'CS' || doctype == 'CS_TEST2' || doctype == "CS_TEST") {
                                                var index_User_roleid = input.findIndex(x => x.key === "Sale_Team_Role_Id")
                                                var index_User_deptid =  input.findIndex(x => x.key === "Sale_Team_Dept_Id")
                                                if (index_User_roleid < 0) {
                                                    let tmperror = {
                                                        msg_thai : 'ไม่พบข้อมูลตำแหน่งของผู้ใช้',
                                                        msg_eng : 'No user role information was found.'
                                                    }
                                                    return [false,null,tmperror]
                                                }
                                                if (index_User_deptid < 0) {
                                                    let tmperror = {
                                                        msg_thai : 'ไม่พบข้อมูลแผนกของผู้ใช้',
                                                        msg_eng : 'No user department information was found.'
                                                    }
                                                    return [false,null,tmperror]
                                                }
                                                User_roleid  = input[index_User_roleid].value
                                                User_deptid = input[index_User_deptid].value
                                            } else if (doctype == 'QT' || doctype == 'QT_TEST2' || doctype == 'QT_TEST') {
                                                var fetch_infouser = res_detail_ref[1].input_data
                                                var index_User_roleid = fetch_infouser.findIndex(x => x.key === "Sale_Team_Role_Id")
                                                var index_User_deptid =  fetch_infouser.findIndex(x => x.key === "Sale_Team_Dept_Id")
                                                // console.log('index_User_roleid',index_User_roleid)
                                                // console.log('index_User_deptid',index_User_deptid)
                                                if (index_User_roleid < 0) {
                                                    let tmperror = {
                                                        msg_thai : 'ไม่พบข้อมูลตำแหน่งของผู้ใช้',
                                                        msg_eng : 'No user role information was found.'
                                                    }
                                                    return [false,null,tmperror]
                                                }
                                                if (index_User_deptid < 0) {
                                                    let tmperror = {
                                                        msg_thai : 'ไม่พบข้อมูลแผนกของผู้ใช้',
                                                        msg_eng : 'No user department information was found.'
                                                    }
                                                    return [false,null,tmperror]
                                                }
                                                User_roleid  = fetch_infouser[index_User_roleid].value
                                                User_deptid = fetch_infouser[index_User_deptid].value
                                            }
                                            // console.log('user',User_roleid,User_deptid)
                                            arr_User_permis = []
                                            if (tmp_role_id != null) {
                                                if (User_roleid == tmp_role_id) {
                                                    arr_User_permis.push(true)
                                                } else {
                                                    arr_User_permis.push(false)
                                                }
                                            }else {
                                                arr_User_permis.push(true)
                                            }
                                            if (tmp_dept_id != null) {
                                                if (User_deptid == tmp_dept_id) {
                                                    arr_User_permis.push(true)
                                                } else {
                                                    arr_User_permis.push(false)
                                                }
                                            }else {
                                                arr_User_permis.push(true)
                                            }
                                            if(arr_User_permis.includes(false)){
                                                // let errorindex = i+1
                                                // let message_rep = 'actor index ' + errorindex + ' permission denied'
                                                // return [false,message_rep]
                                            } else {
                                                if (status_break == false) {
                                                    Arrdept_accept.push(User_deptid)
                                                    Arrrole_accept.push(User_roleid)
                                                    var resdeptname = await func_infouser.find_deptName(connectiondb,User_deptid)
                                                    var resrolename = await func_infouser.find_roleName(connectiondb,User_roleid)
                                                    let finddeptid = resdeptname[1][0]
                                                    let findroleid = resrolename[1][0]
                                                    if (resdeptname[0]) Arrdeptname_accept.push(finddeptid.dept_name)
                                                    else return [false,'not found deptname user create']
                                                    if (resrolename[0]) Arrrolename_accept.push(findroleid.role_name)
                                                    else return [false,'not found rolename user create']
                                                    var tmp = {
                                                        account_id : User_account_id,
                                                        first_name_th : User_first_name_th,
                                                        last_name_th : User_last_name_th,
                                                        first_name_eng  : User_first_name_eng,
                                                        last_name_eng  : User_last_name_eng,
                                                        account_title_th  : User_account_title_th,
                                                        account_title_eng  : User_account_title_eng,
                                                        thai_email  : User_thai_email,
                                                        detp_id  : Arrdept_accept,
                                                        role_id  : Arrrole_accept,
                                                        role_name : Arrrolename_accept ,
                                                        dept_name :  Arrdeptname_accept,
                                                        status : status_pesonal,
                                                    }
                                                    var objactor = data[i].actor[0]
                                                    let keys = Object.keys(tmp)
                                                    keys.map(x=>{
                                                        objactor[x] =  tmp[x]
                                                      })
                                                    data_actor_list.push(objactor)
                                                    stepaction_current = index
                                                    status_break = true
                                                }
                                            }
                                        }
                                        if (data_actor_list.length != 0) {
                                            data[i].actor = data_actor_list
                                            // update เวลาใน node
                                            data[i].createdAt = now
                                            data[i].updatedAt = now
                                            data[i].status_implement = status_imp_change
                                        }
                                    } else if (input_status == true) {
                                        for(x=0;x<jsonDetail.length;x++) {
                                            if (jsonDetail[x].index == index) {
                                                var deail = jsonDetail[x].deail
                                                var res_user = await func_infouser.find_infoUserbyAcc_v2(deail.account_id,connectiondb)
                                                // return[false,res_user]
                                                for (let p=0;p<res_user.length;p++) {
                                                    // console.log('p',p,res_user[p].role_id,res_user[p].dept_id)
                                                    let arr_User_permis = []
                                                    if (tmp_role_id != null) {
                                                        if (tmp_role_id == res_user[p].role_id) {
                                                            arr_User_permis.push(true)
                                                        } else {
                                                            arr_User_permis.push(false)
                                                        }
                                                    }else {
                                                        arr_User_permis.push(true)
                                                    }
                                                    if (tmp_dept_id != null) {
                                                        if (tmp_dept_id == res_user[p].dept_id) {
                                                            arr_User_permis.push(true)
                                                        } else {
                                                            arr_User_permis.push(false)
                                                        }
                                                    }else {
                                                        arr_User_permis.push(true)
                                                    }
                                                    // console.log('arr_User_permis',arr_User_permis)
                                                    if(arr_User_permis.includes(false)){
                                                        // pass
                                                    } else {
                                                        var tmp = {
                                                            account_id : res_user[p].account_id,
                                                            first_name_th : res_user[p].first_name_th,
                                                            last_name_th : res_user[p].last_name_th,
                                                            first_name_eng  : res_user[p].first_name_eng,
                                                            last_name_eng  : res_user[p].last_name_eng,
                                                            account_title_th  : res_user[p].account_title_th,
                                                            account_title_eng  : res_user[p].account_title_eng,
                                                            thai_email  : res_user[p].thai_email,
                                                            detp_id  : [res_user[p].dept_id],
                                                            role_id  : [res_user[p].role_id],
                                                            role_name : [res_user[p].role_name],
                                                            dept_name : [res_user[p].dept_name],
                                                            status: status_pesonal
                                                        }
                                                        var objactor = actor[0]
                                                        let keys = Object.keys(tmp)
                                                        keys.map(x=>{
                                                            objactor[x] = tmp[x]
                                                        })
                                                        if (data_actor_list.length != 0) {
                                                            let idx_actorlist = data_actor_list.findIndex(x => x.account_id === tmp.account_id)
                                                            if (idx_actorlist < 0) {
                                                                data_actor_list.push(objactor)
                                                            }
                                                        } else {
                                                            data_actor_list.push(objactor)
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        if (data_actor_list.length != 0) {
                                            data[i].actor = data_actor_list
                                            data[i].createdAt = now
                                            data[i].updatedAt = now
                                            data[i].status_implement = status_imp_change
                                        }
                                    } else if (conditionflow == true) {
                                    } else if (ref_permis_status == true) {
                                        let index_flow = ref_permission.index_flow
                                        index_flow = index_flow - 1
                                        let role_id = ref_permission.role_id
                                        let dept_id =  ref_permission.dept_id
                                        let actor = ref_permission.actor
                                        if(actor == true){
                                            data[index_flow].actor.status = 'Incomplete'
                                            // ตัวหลัก
                                            for (let b=0;b<data[index_flow].actor.length;b++) {
                                                // หลัก
                                                let objactor = data[i].actor[0]
                                                let keys = Object.keys(data[index_flow].actor[b])
                                                keys.map(x=>{
                                                    objactor[x] = data[index_flow].actor[b][x]
                                                })
                                                data_actor_list.push(objactor) 
                                            }
                                        } else {
                                            if (tmp_role_id == null && role_id == true) {
                                                tmp_role_id = data[index_flow].actor.role_id[0]
                                            }
                                            if (tmp_dept_id == null && dept_id == true) {
                                                // จะ ref จาก user ที่มี actor คนเเรกเท่านั้น
                                                tmp_dept_id = data[index_flow].actor[0].detp_id[0]
                                            }
                                            // console.log('ref_permission',tmp_role_id,tmp_dept_id)
                                            let result_find_userByOrg = await func_infouser.find_userByOrg(tmp_role_id,tmp_dept_id,connectiondb)
                                            // return[false,result_find_userByOrg]
                                            if (result_find_userByOrg.status == 'SUCCESS') {
                                                let dataUser = result_find_userByOrg.data 
                                                for (r=0;r<dataUser.length;r++){
                                                    dataUser[r].role_id =  JSON.parse(dataUser[r].role_id)
                                                    dataUser[r].role_name = JSON.parse(dataUser[r].role_name)
                                                    dataUser[r].dept_id = JSON.parse(dataUser[r].dept_id)
                                                    dataUser[r].dept_name = JSON.parse(dataUser[r].dept_name)
                                                    dataUser[r].status = 'Incomplete'
                                                    let newinfo_user =  JSON.stringify(dataUser[r])
                                                    let newinfo_userjson = JSON.parse(newinfo_user)
                                                    let objactor_str = JSON.stringify(data[i].actor[0])
                                                    let objactor = JSON.parse(objactor_str)
                                                    let keys = Object.keys(newinfo_userjson)
                                                    keys.map(x=>{
                                                        objactor[x] = newinfo_userjson[x]
                                                      })
                                                    // data_actor_list.push(objactor)
                                                    let tmpobj = (JSON.stringify(objactor))
                                                    data_actor_list.push(JSON.parse(tmpobj))
                                                }  
                                            }
                                        }
                                        if (data_actor_list.length != 0) {
                                            data[i].actor = data_actor_list
                                            data[i].createdAt = now
                                            data[i].updatedAt = now
                                            data[i].status_implement = status_imp_change
                                        }
                                    } else if (self == false && input_status == false && conditionflow == false && ref_permis_status == false){
                                        var result_find_userByOrg = await func_infouser.find_userByOrg(tmp_role_id,tmp_dept_id,connectiondb)
                                        if (result_find_userByOrg.status == 'SUCCESS') {
                                            let dataUser = result_find_userByOrg.data 
                                            let objactor = JSON.parse(JSON.stringify(data[i].actor[0]))
                                            for (r=0;r<dataUser.length;r++){
                                                dataUser[r].role_id =  JSON.parse(dataUser[r].role_id)
                                                dataUser[r].role_name = JSON.parse(dataUser[r].role_name)
                                                dataUser[r].dept_id = JSON.parse(dataUser[r].dept_id)
                                                dataUser[r].dept_name = JSON.parse(dataUser[r].dept_name)
                                                dataUser[r].status = 'Incomplete'
                                                let keys = Object.keys(dataUser[r])
                                                keys.map(x=>{
                                                    objactor[x] = dataUser[r][x]
                                                    })
                                                let tmpobj = (JSON.stringify(objactor))
                                                data_actor_list.push(JSON.parse(tmpobj))
                                            }
                                        }
                                        if (data_actor_list.length != 0) {
                                            data[i].actor = data_actor_list
                                            data[i].createdAt = now
                                            data[i].updatedAt = now
                                            data[i].status_implement = status_imp_change
                                        }
                                    }
                                }
                            }
                        } 
                        else if (ref_permis_status == true) {
                            let index_flow = ref_permission.index_flow
                            index_flow = index_flow - 1
                            let role_id = ref_permission.role_id
                            let dept_id =  ref_permission.dept_id
                            let actor = ref_permission.actor
                            var objactor = data[i].actor[0]
                            // return [false,objactor]
                            if(actor == true){
                                let actornode = JSON.stringify(data[index_flow].actor)
                                let actornode_json = JSON.parse(actornode)
                                for (let b=0;b<actornode_json.length;b++) {
                                    // actornode_json
                                    delete actornode_json[b]['sign_position'];
                                    delete actornode_json[b]['sign_base64'];
                                    // หลัก
                                    let keys = Object.keys(actornode_json[b])
                                    keys.map(x=>{
                                        objactor[x] = actornode_json[b][x]
                                    })
                                    var tmpobj = (JSON.stringify(objactor))
                                    data_actor_list.push(JSON.parse(tmpobj))
                                }
                            }else {
                                if (tmp_role_id == null && role_id == true) {
                                    tmp_role_id = data[index_flow].actor.role_id
                                }
                                if (tmp_dept_id == null && dept_id == true) {
                                    tmp_dept_id = data[index_flow].actor[0].detp_id
                                } 
                                let result_find_userByOrg = await func_infouser.find_userByOrg(tmp_role_id,tmp_dept_id,connectiondb)
                                if (result_find_userByOrg.status == 'SUCCESS') {
                                    let dataUser = result_find_userByOrg.data
                                    for (r=0;r<dataUser.length;r++){
                                        dataUser[r].role_id =  JSON.parse(dataUser[r].role_id)
                                        dataUser[r].role_name = JSON.parse(dataUser[r].role_name)
                                        dataUser[r].dept_id = JSON.parse(dataUser[r].dept_id)
                                        dataUser[r].dept_name = JSON.parse(dataUser[r].dept_name)
                                        dataUser[r].status = 'Incomplete'
                                        let keys = Object.keys(dataUser[r])
                                        keys.map(x=>{
                                            objactor[x] =  dataUser[r][x]
                                        })
                                        // data_actor_list.push(objactor)
                                        var tmpobj = (JSON.stringify(objactor))
                                        data_actor_list.push(JSON.parse(tmpobj))
                                        
                                    }  
                                }
                            }
                            if (data_actor_list.length != 0) {
                                data[i].actor = data_actor_list
                                data[i].createdAt = now
                                data[i].updatedAt = now
                                data[i].status_implement = status_imp_change
                            }
                        }
                        // _______________ไม่มี flow _______________
                    } 
                    // else if (flowStatus == true) {
                    //     if (conditionflow == true) {
                    //         let dept_id_User = arrbizUser_Select[0].dept_id
                    //         res_condition = await condition.ch_condition_node_v3(input,condition_idflow,dept_id_User,connectiondb)
                    //         // console.log('res_condition',res_condition)
                    //         if (res_condition[0]){
                    //             flow_sign = res_condition[1]
                    //             data[i].action_detail = flow_sign
                    //             data[i].stepnow_actiondetail = 1
                    //             data[i].createdAt = now
                    //             data[i].updatedAt = now
                    //             data[i].status_implement = status_imp_change
                    //             for (let y;y<data[i].action_detail.length;y++) {
                    //                 data[i].action_detail[y].createdAt = now
                    //                 data[i].action_detail[y].updatedAt = now
                    //             }
                                
                    //         }else {
    
                    //         }
                    //     }
                    // }
                }
            }
            let tmpinsertlog = {
                actor : User_account_id,
                action : logdoc_action,
                detail : null,
                index_actor : stepaction_current,
                status : logdoc_status
            }
            arrlog.push(tmpinsertlog)
            var flow_doc = data
            // return[false,flow_doc]
            var step_max = flow_doc.length
            var step_now = 1
            var res_statustran = await func_doc.checkStatus_transaction(flow_doc)
            var status_document = 'N'
            if (res_statustran[0]) {
                status_document = res_statustran[1]
            }
            
            // เชื่อมต่อฟังก์ชันการ gen เลข tracking
            var tracking_id = null
            var document_id = null
            var res_gentrackingid = await tracking.gen_tracking()
            if (res_gentrackingid[0] == 200){
                tracking_id = res_gentrackingid[1]
            }
            if (doctype == '' || doctype == null) {
                doctype = 'OTHER'
            }
            var res_documentid = null
            if (doctype == 'QT_TEST' || doctype == 'QT' || doctype == 'QT_TEST2') {
                if (ref_doc_id != null) {
                    res_documentid = await document.update_doc_type_trans_ref(doctype,ref_doc_id,group_id,connectiondb)
                } else {
                    res_documentid = await document.update_doc_type_trans(doctype,connectiondb)
                }
                
            } else {
                res_documentid = await document.update_doc_type_trans(doctype,connectiondb)
            }
            // console.log('res_documentid',res_documentid)
            if (res_documentid[0]){
                document_id = res_documentid[1]
            }
            // console.log('document_id',document_id)
            var res_detaildoctype = await db_select.func_get_doc_type(doctype,connectiondb)
            // console.log('res_detaildoctype',res_detaildoctype)
            var doctype_name = ''
            if (res_detaildoctype[0] == 200) {
                doctype_name = res_detaildoctype[1].type_name
            } else {
                let tmperror = {
                    msg_thai: 'ไม่พบประเภทเอกสารที่ต้องการสร้าง',
                    msg_eng: 'The document you want to create cannot be found.'
                }
                return[false,null,tmperror]
            }
            // return[false,doctype_name]
            // gen html
            var reshtml = null
            if (doctype == 'CS' || doctype == 'CS_TEST' || doctype == 'CS_TEST2') {
                let inputparam = JSON.parse(JSON.stringify(input))
                reshtml = await func_html.genHtmlCs(inputparam,document_id,ref)
                reshtml = reshtml.replace(/\n/g, "")
            } 
            else if (doctype == 'QT') {
                let inputparam = JSON.parse(JSON.stringify(input))
                reshtml = await func_html.genHtmlQtBiLangV2(inputparam,document_id)
                reshtml = reshtml.replace(/\n/g, "")
            } else if (doctype == 'QT_TEST' || doctype == 'QT_TEST2') {
                let inputparam = JSON.parse(JSON.stringify(input))
                reshtml = await func_html.genHtmlQtBiLangV2(inputparam,document_id)
                reshtml = reshtml.replace(/\n/g, "")
            } else {
                let tmperror = {
                    msg_thai: 'ไม่สามารถแปลงเป็นไฟล์ .html ได้',
                    msg_eng: 'Can not generate to html'
                }
                return [false,reshtml,tmperror]
            }
            var hash_html = null
            hash_html = await func_hash.sha512(reshtml)
            // INSERT TRANSACTION BEGIN
            var res_insert_transac = await transaction_Schema.insertMany({
                status: status_doc,
                tracking_id: tracking_id,
                document_id: document_id,
                doctype: doctype,
                doctype_name: doctype_name,
                id_flow_tmp: flowId,
                flow: flow_doc,
                path: path,
                path_pdf_original: path_pdf_original,
                path_pdf_sign: path_pdf_sign,
                path_hash_original: path_hash_original,
                path_pdfhashsign: path_pdfhashsign,
                pdfSize: pdfSize,
                step_now: step_now,
                step_max: step_max,
                sender_account: User_account_id,
                sender_detail: one_result_data,
                input_data: input,
                html: reshtml,
                hash_html : hash_html,
                status_document: status_document,
                subject: subject,
                body: body,
                attachfile_id: "",
                groupid: group_id,
                taxid: hederbiz,
                color: color,
                flow_name_tmp:  flow_name,
                ref_document: ref,
                status_view_pdf: false,
                type_of_team: type_of_team,
                type_of_flow: type_of_flow,
                id_workflow: id_workflow,
                status_summary_group: status_summary_group,
                attachfile_summarygroup: attachfile_summarygroup
            })
            const id_transaction = String(res_insert_transac[0]._id)
            var data_insert = res_insert_transac[0]
            
            // insert OR update GROUP
            if (status_group == true) {
                if (group_id == '') {
                    newobj_tmp = [{
                        doctype : data_insert.doctype,
                        type_of_team : data_insert.type_of_team,
                        type_of_flow : data_insert.type_of_flow
                    }]
                    var resgroup = await transac_group.insert_transactiongroup(data_decry,id_workflow,id_transaction,doctype,data_insert.document_id,newobj_tmp)
                    if (resgroup[0]) {
                        data_insert.groupid = resgroup[1]
                        var resupdate_idgroup = await actiontransaction.update_transaction(connectiondb,id_transaction,data_insert)
                    }
                } else {
                    var resgroup =  transac_group.update_transactiongroup(data_decry,data_insert.groupid,id_transaction,token)
                }
            }
            // INSERT LOG CREATE TRANSACTION
            for (let r=0;r<arrlog.length;r++) {
                arrlog[r].id_transaction = id_transaction
                insertlogdoc.insert_tb_document_log(data_decry,arrlog[r])
            }
            // notication
            // noticationFunc.SendNotication([id_transaction], connectiondb)
            // insert log input
            inputlog.insert_transactionlog_input(data_decry,input,reshtml,document_id,step_now)
            // update transaction
            path = data_insert.path
            path_pdf_original = data_insert.path_pdf_original
            path_pdf_sign = data_insert.path_pdf_sign
            path_hash_original = data_insert.path_hash_original
            path_pdfhashsign = data_insert.path_pdfhashsign
            pdfSize = data_insert.pdfSize
            input = data_insert.input_data
            flow_doc = data_insert.flow
            reshtml = data_insert.html
            step_now = data_insert.step_now
            color = data_insert.color
            step_max = data_insert.step_max
            docuemnt_id = data_insert.docuemnt_id
            ref = data_insert.ref_document
            doctype = data_insert.doctype
            hash_html = data_insert.hash_html
            status_view_pdf = data_insert.status_view_pdf
            var res_updateflow = await func_doc.update_actor(path, path_pdf_original ,path_pdf_sign ,path_hash_original ,path_pdfhashsign , pdfSize, id_transaction, data_decry, input, now, actor_update,flow_doc,User_account_id,step_max,reshtml,step_now,hederbiz,sign_info,color,docuemnt_id,ref,doctype,hash_html,status_view_pdf)
            if (res_updateflow[0]) {
                data_insert.flow = res_updateflow[1].flow
                data_insert.path = res_updateflow[1].path
                data_insert.path_pdf_original = res_updateflow[1].path_pdf_original
                data_insert.path_hash_original =  res_updateflow[1].path_hash_original
                data_insert.path_pdf_sign = res_updateflow[1].path_pdf_sign
                data_insert.path_pdfhashsign = res_updateflow[1].path_pdfhashsign
                data_insert.pdfSize = res_updateflow[1].pdfSize
                data_insert.step_now = res_updateflow[1].step_now
                data_insert.color = res_updateflow[1].color
                data_insert.step_max = res_updateflow[1].step_max
                data_insert.status_view_pdf = res_updateflow[1].status_view_pdf
                if (res_updateflow[1].ch_statusupdate_input == true) {
                    data_insert.input_data =  res_updateflow[1].input_info
                    data_insert.html = res_updateflow[1].reshtml
                    data_insert.hash_html = res_updateflow[1].hash_html
                    // insert log input
                    inputlog.insert_transactionlog_input(data_decry,data_insert.input_data,data_insert.html,data_insert.document_id,step_now)
                }
                if (res_updateflow[1].pdfData != null) {
                    fs.writeFile(res_updateflow[1].path_pdf_sign, res_updateflow[1].pdfData, function (err) {
                        if (err) console.log('save pdf error ',err)
                    });
                }
                if (res_updateflow[1].hashpdfsign != null) {
                    fs.writeFile(res_updateflow[1].path_pdfhashsign, res_updateflow[1].hashpdfsign, function (err) {
                        if (err) console.log('save pdf error ',err)
                    });
                }
                arrlog = res_updateflow[1].arrlog
                var res_statusdoc = await func_doc.checkStatus_transaction(data_insert.flow)
                if (res_statusdoc[0]) {
                    data_insert.status_document = res_statustran[1]
                }
                var res_update = await actiontransaction.update_transaction(connectiondb,id_transaction,data_insert)
                if (res_update[0]) {
                    for (let y=0;y<actor_update.length;y++) {
                        let indexupdate = actor_update[y].index
                        if (indexupdate != '') {
                            if (res_update[1].flow[indexupdate-1].status_group_node == true) {
                                if (res_transaction[1].flow[indexupdate-1].status == 'Y') {
                                    if (data_insert.groupid != null) {
                                            var res_transac_group =  transac_group.update_transactiongroup(data_decry,data_insert.groupid,id_transaction,token)
                                        }
                                }
                                
                            }
                        }
                    }
                    if (res_update[1].status_document == 'Y') {
                        if (res_transaction[1].groupid != null) {
                            var res_transac_group =  transac_group.update_transactiongroup(data_decry,res_update[1].groupid,id_transaction,token)
                        }
                        var result_doctype = await db_doctype.document_type_2(connectiondb,doctype)
                        if (result_doctype[0]) {
                            // SEND MAIL
                            if (result_doctype[1].sendmail.status == true) {
                                let email_center = result_doctype[1].sendmail.mail
                                let bcc_email = result_doctype[1].sendmail.bcc_mail
                                let recvier = email_center
                                func_smtp.sendmail(data_decry,id_transaction,recvier,bcc_email)
                            } 
                            // ONEBOX
                            if (result_doctype[1].onebox.status == true) {
                                onebox_process.process_savefile_base64_onebox_all(id_transaction,access_token,biz_name,User_account_id,connectiondb)
                                onebox_process.process_save_attachfile_base64_onebox_all(id_transaction,access_token,biz_name,User_account_id,connectiondb)
                            }
                        }
                        // let Arr_tran = [id_transaction]
                        // serviceMethod.SendDocumentService(Arr_tran, hederbiz, connectiondb)
                        // otherProcess.GetServiceWebhookData(id_transaction,'',connectiondb)
                    }
                    for (let r=0;r<arrlog.length;r++) {
                        arrlog[r].id_transaction = id_transaction
                        insertlogdoc.insert_tb_document_log(data_decry,arrlog[r])
                    }
                    // notication
                    // noticationFunc.SendNotication([id_transaction], connectiondb)
                    return [true,res_update[1]]
                }
                
            } else {
                return [false,res_updateflow[1],res_updateflow[2]]
            }
        }catch (err) {
            console.log(err)
            let tmperror = {
                msg_thai : '',
                msg_eng : ''
            }
            return [false,err.message,tmperror]
        }
        
    },
    update_flow_transaction_version2: async function (data_decry,transaction_id,json_update,input_info,hederbiz,sign_info,token) {
        try {
            var arrlog = []
            var now = timemoment().format();
            var connectiondb = data_decry.db_connect
            var arrbizUser_Select = data_decry.biz_user_select
            var one_result_data = data_decry.one_result_data
            // var one_result_data = r[1].data_login.one_result_data
            // return[false,r[1]]
            var User_account_id = one_result_data.id
            var biz_name = data_decry.biz_user_select[0].getbiz.first_name_th
            var access_token = data_decry.one_access_token
            var User_first_name_th = one_result_data.first_name_th
            var User_last_name_th = one_result_data.last_name_th
            var User_first_name_eng = one_result_data.first_name_eng
            var User_last_name_eng = one_result_data.last_name_eng
            var User_account_title_th = one_result_data.account_title_th
            var User_account_title_eng = one_result_data.account_title_eng
            var User_thai_email = one_result_data.thai_email
            var biz_detail = one_result_data.biz_detail
            var res_transaction = await db_transaction.find_transaction(connectiondb,transaction_id)
            var document_id = res_transaction[1].document_id
            var doctype = res_transaction[1].doctype
            var ref = res_transaction[1].ref_document
            if (ref === undefined) {
                ref = ''
            }
            // let inputparams = input_info
            // 
            var reshtml = null
            if (doctype == 'CS' || doctype == 'CS_TEST' || doctype == 'CS_TEST2') {
                let inputparam = JSON.parse(JSON.stringify(input_info))
                reshtml = await func_html.genHtmlCs(inputparam,document_id,ref)
                if (reshtml == '') {

                }
                reshtml = reshtml.replace(/\n/g, "")
            } 
            else if (doctype == 'QT') {
                let inputparam = JSON.parse(JSON.stringify(input_info))
                reshtml = await func_html.genHtmlQtBiLangV2(inputparam,document_id)
                reshtml = reshtml.replace(/\n/g, "")
                if (reshtml == '') {
                    
                }
            } else if (doctype == 'QT_TEST' || doctype == 'QT_TEST2') {
                let inputparam = JSON.parse(JSON.stringify(input_info))
                reshtml = await func_html.genHtmlQtBiLangV2(inputparam,document_id)
                reshtml = reshtml.replace(/\n/g, "")
                if (reshtml == '') {
                    
                }
            }
             else {
                let tmperror = {
                    msg_thai: 'ไม่สามารถแปลงเป็นไฟล์ .html ได้',
                    msg_eng: 'Can not generate to html'
                }
                return [false,reshtml,tmperror]
            }
            // 
            // let inputparams = JSON.parse(JSON.stringify(input_info))
            // var reshtml = await func_html.genHtmlCs(inputparams,document_id)
            // reshtml = reshtml.replace(/\n/g, "")
            var hash_html = null            
            hash_html = await func_hash.sha512(reshtml)
            var flow_doc = null
            if (res_transaction[0]) {
                var data_document = res_transaction[1]
                var step_max = data_document.step_max
                var path_pdf_sign = data_document.path_pdf_sign
                var step_now = data_document.step_now
                var flow_doc = data_document.flow
                var path = data_document.path
                var path_pdf_original = data_document.path_pdf_original
                var path_pdf_sign = data_document.path_pdf_sign
                var path_hash_original = data_document.path_hash_original
                var pdfSize = data_document.pdfSize
                var path_pdfhashsign = data_document.path_pdfhashsign
                var color = data_document.color
                var status_view_pdf = data_document.status_view_pdf
                var res_updateflow = await func_doc.update_actor(path,path_pdf_original,path_pdf_sign,path_hash_original,path_pdfhashsign,pdfSize,transaction_id,data_decry,input_info,now,json_update,flow_doc,User_account_id,step_max,reshtml,step_now,hederbiz,sign_info,color,document_id,ref,doctype,hash_html,status_view_pdf)
                // return [false,res_updateflow[1]]
                if (res_updateflow[0]) {
                    flow_doc = res_updateflow[1].flow
                    res_transaction[1].flow = flow_doc
                    res_transaction[1].path  = res_updateflow[1].path,
                    res_transaction[1].path_pdf_original = res_updateflow[1].path_pdf_original
                    res_transaction[1].path_hash_original = res_updateflow[1].path_hash_original
                    res_transaction[1].path_pdf_sign =  res_updateflow[1].path_pdf_sign
                    res_transaction[1].path_pdfhashsign = res_updateflow[1].path_pdfhashsign
                    res_transaction[1].pdfSize = res_updateflow[1].pdfSize
                    res_transaction[1].step_now =  res_updateflow[1].step_now
                    res_transaction[1].color = res_updateflow[1].color
                    res_transaction[1].step_max = res_updateflow[1].step_max
                    res_transaction[1].status_view_pdf = res_updateflow[1].status_view_pdf
                    // res_transaction[1].html = res_updateflow[1].reshtml
                    // res_transaction[1].input_info = res_updateflow[1].input_data
                    if (res_updateflow[1].ch_statusupdate_input == true) {
                        res_transaction[1].input_data = res_updateflow[1].input_info
                        res_transaction[1].html = res_updateflow[1].reshtml          
                        res_transaction[1].hash_html = res_updateflow[1].hash_html
                        // insert log input
                        inputlog.insert_transactionlog_input(data_decry,res_updateflow[1].input_info,res_updateflow[1].reshtml ,res_updateflow[1].document_id,step_now)
                    }
                    if (res_updateflow[1].pdfData != null) {
                        fs.writeFile(res_updateflow[1].path_pdf_sign, res_updateflow[1].pdfData, function (err) {
                            if (err) console.log('save pdf error ',err)
                        });
                    }
                    if (res_updateflow[1].hashpdfsign != null) {
                        fs.writeFile(res_updateflow[1].path_pdfhashsign, res_updateflow[1].hashpdfsign, function (err) {
                            if (err) console.log('save pdf error ',err)
                        });
                    }
                    arrlog = res_updateflow[1].arrlog
                } else {
                    return [false,res_updateflow[1],res_updateflow[2]]
                }
                // return [true,res_transaction[1]]
                // เช็ค สถานะของ transaction
                var res_statustran = await func_doc.checkStatus_transaction(flow_doc)
                // return[false,flow_doc]
                if (res_statustran[0]) {
                    res_transaction[1].status_document = res_statustran[1]
                }
                // res_transaction[1].attachfile_id = attachfile_id
                // return [false,res_statustran[1]]
                // update transaction in db
                var res_update = await actiontransaction.update_transaction(connectiondb,transaction_id,res_transaction[1])
                // return [false,res_update]
                if (res_update[0]) {
                    const id_transaction = String(res_transaction[1]._id)
                    for (let r=0;r<arrlog.length;r++) {
                        arrlog[r].id_transaction = id_transaction
                        insertlogdoc.insert_tb_document_log(data_decry,arrlog[r])
                    }
                    // notication
                    // noticationFunc.SendNotication([id_transaction], connectiondb)
                    for (let y=0;y<json_update.length;y++) {
                        let indexupdate = json_update[y].index
                        if (indexupdate != '') {
                            if (res_transaction[1].flow[indexupdate-1].status_group_node == true) {
                                if (res_transaction[1].flow[indexupdate-1].status == 'Y') {
                                    if (res_transaction[1].groupid != null) {
                                            var res_transac_group =  transac_group.update_transactiongroup(data_decry,res_transaction[1].groupid,transaction_id,token)
                                        }
                                }
                            }
                        }
                    }
                    if (res_transaction[1].status_document == 'Y') {
                        if (res_transaction[1].groupid != null) {
                            var res_transac_group =  transac_group.update_transactiongroup(data_decry,res_transaction[1].groupid,transaction_id,token)
                        }
                        var result_doctype = await db_doctype.document_type_2(connectiondb,doctype)
                        if (result_doctype[0]) {
                            // SEND MAIL
                            if (result_doctype[1].sendmail.status == true) {
                                let email_center = result_doctype[1].sendmail.mail
                                let recvier = email_center
                                let bcc_email = result_doctype[1].sendmail.bcc_mail
                                func_smtp.sendmail(data_decry,transaction_id,recvier,bcc_email)
                            } 
                            // ONEBOX
                            if (result_doctype[1].onebox.status == true) {
                                onebox_process.process_savefile_base64_onebox_all(transaction_id,access_token,biz_name,User_account_id,connectiondb)
                                onebox_process.process_save_attachfile_base64_onebox_all(transaction_id,access_token,biz_name,User_account_id,connectiondb)
                            }
                        }
                        // const serviceMethod = require('../method/service')
                        // Arr_tran = [id_transaction]
                        // serviceMethod.SendDocumentService(Arr_tran, hederbiz, connectiondb)
                        // otherProcess.GetServiceWebhookData(id_transaction,'',connectiondb)
                    }
                    return [true,res_transaction[1]]
                }
                else {
                    return [false,'update error']
                }

            } else {
                return [false,res_transaction[1]]
            }
        } catch (error) {
            console.log('error',error)
            return [false,error.message]
        }
    },
    reverse_transaction: async function (data_decry,hederbiz,transaction_id) {
        try {
            // value for log
            var logdoc_action = 'reverse'
            var logdoc_status = 'yes'
            var tmpdetail = {}
            var stepaction_current = null
            // 
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
            var res_transaction = await db_transaction.find_transaction(connectiondb,transaction_id)
            if (!(res_transaction[0])) {
                let tmperror = {
                    'msg_thai' : 'ไม่พบเลขที่เอกสารนี้ในฐานข้อมูล',
                    'msg_eng' : 'The document number was not found in the database.'
                }
                return [false,res_transaction[1],tmperror]
            }
            var transaction = res_transaction[1].flow
            var step_now = res_transaction[1].step_now
            if (step_now == 1) {
                let tmperror = {
                    'msg_thai' : 'ลำดับปัจจุบันไม่สามารถทำการส่งคืนแก้ไขได้',
                    'msg_eng' : 'The current sequence cannot be returned.'
                }
                return [false,null,tmperror]
            }
            var step_now_update = null
            for (let k=0;k<transaction.length;k++) {
                var status_flow = transaction[k].flow
                var index  = transaction[k].index
                var actor = transaction[k].actor
                var action_detail = transaction[k].action_detail
                var name_reverse_th = []
                var name_reverse_eng = []
                if (step_now == index) {
                    stepaction_current = index
                    if (status_flow == false) {
                        for (let i=0;i<actor.length;i++) {
                            if (actor[i].account_id == User_account_id) {
                                stepaction_current = index
                                let status_node =  transaction[k].status
                                let action = transaction[k].action
                                if (status_node == 'W') {
                                    // if (action == 'e-sign' || action == 'sign') {
                                    //     let tmperror = {
                                    //         'msg_thai' : 'ลำดับปัจจุบันไม่สามารถทำการส่งคืนแก้ไขได้',
                                    //         'msg_eng' : 'The current sequence cannot be returned.'
                                    //     }
                                    //     return [false,null,tmperror]
                                    // }
                                    // if (transaction[k-1].status_group_node == true) {
                                    //     let tmperror = {
                                    //         'msg_thai' : 'ลำดับปัจจุบันไม่สามารถทำการส่งคืนแก้ไขได้',
                                    //         'msg_eng' : 'The current sequence cannot be returned.'
                                    //     }
                                    //     return [false,null,tmperror]
                                    // }
                                    if (transaction[k-1].action == 'generate') {
                                        let tmperror = {
                                            'msg_thai' : 'ลำดับก่อนหน้าคือลำดับการสร้างเอกสารจึงไม่สามารถส่งคืนแก้ไขได้',
                                            'msg_eng' : 'The preceding sequence is the document creation order, so it cannot be returned.'
                                        }
                                        return [false,null,tmperror]
                                    }
                                    // --ย้อน status ลำดับปัจจบุัน
                                    transaction[k].status = 'I'
                                    //  --ย้อน status ลำดับก่อนหน้า
                                    if (transaction[k-1].flow == false) {
                                        for (let m=0;m<transaction[k-1].actor.length;m++) {
                                            if (transaction[k-1].actor[m].status == 'Complete') {
                                                transaction[k-1].actor[m].status = 'Incomplete'
                                                let first_name_th = transaction[k-1].actor[m].first_name_th
                                                let last_name_th = transaction[k-1].actor[m].last_name_th
                                                let first_name_eng = transaction[k-1].actor[m].first_name_eng
                                                let last_name_eng = transaction[k-1].actor[m].last_name_eng
                                                name_reverse_th.push(String(first_name_th + ' ' + String(last_name_th)))
                                                name_reverse_eng.push(String(first_name_eng) + ' ' + String(last_name_eng))
                                            }
                                        }
                                    } else if (transaction[k-1].flow == true) {
                                        for (let m=0;k<transaction[k-1].action_detail.length;m++) {
                                            if (transaction[k-1].action_detail[m].status == "Complete") {
                                                transaction[k-1].action_detail[m].status = 'Incomplete'
                                                let first_name_th = transaction[k-1].action_detail[m].first_name_th
                                                let last_name_th = transaction[k-1].action_detail[m].last_name_th
                                                let first_name_eng = transaction[k-1].action_detail[m].first_name_eng
                                                let last_name_eng = transaction[k-1].action_detail[m].last_name_eng
                                                name_reverse_th.push(String(first_name_th + ' ' + String(last_name_th)))
                                                name_reverse_eng.push(String(first_name_eng) + ' ' + String(last_name_eng))
                                            }
                                        }
                                    }
                                    transaction[k].status = 'I'
                                    transaction[k-1].status = 'W'
                                    step_now_update = transaction[k-1].index
                                    tmpdetail = {
                                        'name_th': name_reverse_th,
                                        'name_eng': name_reverse_eng,
                                        'step': step_now_update
                                    }
                                } else {
                                    let tmperror = {
                                        'msg_thai' : 'ลำดับปัจจุบันไม่สามารถทำการส่งคืนแก้ไขได้',
                                        'msg_eng' : 'The current sequence cannot be returned.'
                                    }
                                    return [false,null,tmperror]
                                }
                            }
                        }
                    } else if (status_flow == true) {
                        for (let i=0;i<action_detail.length;i++) {
                            if (action_detail[i].account_id == User_account_id) {
                                let status_node = transaction[k].status
                                let action = transaction[k].action
                                if (status_node == 'W') {
                                    // if (action == 'e-sign' || action == 'sign') {
                                    //     let tmperror = {
                                    //         'msg_thai' : 'ลำดับปัจจุบันไม่สามารถทำการส่งคืนแก้ไขได้',
                                    //         'msg_eng' : 'The current sequence cannot be returned.'
                                    //     }
                                    //     return [false,null,tmperror]
                                    // }
                                    // --ย้อน status ลำดับปัจจบุัน
                                    // if (transaction[k-1].status_group_node == true) {
                                    //     let tmperror = {
                                    //         'msg_thai' : 'ลำดับปัจจุบันไม่สามารถทำการส่งคืนแก้ไขได้',
                                    //         'msg_eng' : 'The current sequence cannot be returned.'
                                    //     }
                                    //     return [false,null,tmperror]
                                    // }
                                    if (transaction[k-1].action == 'generate') {
                                        let tmperror = {
                                            'msg_thai' : 'ลำดับก่อนหน้าคือลำดับการสร้างเอกสารจึงไม่สามารถส่งคืนแก้ไขได้',
                                            'msg_eng' : 'The preceding sequence is the document creation order, so it cannot be returned.'
                                        }
                                        return [false,null,tmperror]
                                    }
                                    //  --ย้อน status ลำดับก่อนหน้า
                                    if (transaction[k-1].flow == false) {
                                        for (let m=0;m<transaction[k-1].actor.length;m++) {
                                            if (transaction[k-1].actor[m].status == 'Complete') {
                                                transaction[k-1].actor[m].status = 'Incomplete'
                                                let first_name_th = transaction[k-1].actor[m].first_name_th
                                                let last_name_th = transaction[k-1].actor[m].last_name_th
                                                let first_name_eng = transaction[k-1].actor[m].first_name_eng
                                                let last_name_eng = transaction[k-1].actor[m].last_name_eng
                                                name_reverse_th.push(String(first_name_th + ' ' + String(last_name_th)))
                                                name_reverse_eng.push(String(first_name_eng) + ' ' + String(last_name_eng))
                                            }
                                        }
                                    } else if (transaction[k-1].flow == true) {
                                        for (let m=0;k<transaction[k-1].action_detail.length;m++) {
                                            if (transaction[k-1].action_detail[m].status == "Complete") {
                                                transaction[k-1].action_detail[m].status = 'Incomplete'
                                                let first_name_th = transaction[k-1].action_detail[m].first_name_th
                                                let last_name_th = transaction[k-1].action_detail[m].last_name_th
                                                let first_name_eng = transaction[k-1].action_detail[m].first_name_eng
                                                let last_name_eng = transaction[k-1].action_detail[m].last_name_eng
                                                name_reverse_th.push(String(first_name_th + ' ' + String(last_name_th)))
                                                name_reverse_eng.push(String(first_name_eng) + ' ' + String(last_name_eng))
                                            }
                                        }
                                    }
                                    transaction[k].status = 'I'
                                    transaction[k-1].status = 'W'
                                    step_now_update = transaction[k-1].index
                                    tmpdetail = {
                                        'name_th': name_reverse_th,
                                        'name_eng': name_reverse_eng,
                                        'step': step_now_update
                                    }
                                }
                            }
                        }
                    }
                }
               
            }
            if (step_now_update != null) {
                res_transaction[1].flow = transaction
                res_transaction[1].step_now = step_now_update
                var res_update = await actiontransaction.update_transaction(connectiondb,transaction_id,res_transaction[1])
                if (res_update[0]) {
                    // insert log
                    let tmpinsertlog = {
                        actor : User_account_id,
                        action : logdoc_action,
                        detail : JSON.stringify(tmpdetail),
                        index_actor : stepaction_current,
                        status : logdoc_status,
                        id_transaction : transaction_id
                    }
                    insertlogdoc.insert_tb_document_log(data_decry,tmpinsertlog)
                    return [true,res_update[1]]
                } else {
                    return [false,res_update[1]]
                }
            } else {
                let tmperror = {
                    'msg_thai' : 'ลำดับปัจจุบันไม่สามารถทำการส่งคืนแก้ไขได้',
                    'msg_eng' : 'The current sequence cannot be returned.'
                }
            }
           
            return [false,null,tmperror]
        } catch (err) {
            console.log(err)
            return [false,err]
        }
    },
    reverse_transaction_skipstep: async function (data_decry,hederbiz,transaction_id,index_reverse) {
        try {
            // value for log
            var logdoc_action = 'reverse'
            var logdoc_status = 'yes'
            var tmpdetail = {}
            var stepaction_current = null
            // 
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
            var res_transaction = await db_transaction.find_transaction(connectiondb,transaction_id)
            if (!(res_transaction[0])) {
                let tmperror = {
                    'msg_thai' : 'ไม่พบเลขที่เอกสารนี้ในฐานข้อมูล',
                    'msg_eng' : 'The document number was not found in the database.'
                }
                return [false,res_transaction[1],tmperror]
            }
            var transaction = res_transaction[1].flow
            var step_now = res_transaction[1].step_now
            if (step_now == 1) {
                let tmperror = {
                    'msg_thai' : 'ลำดับปัจจุบันไม่สามารถทำการส่งคืนแก้ไขได้',
                    'msg_eng' : 'The current sequence cannot be returned.'
                }
                return [false,null,tmperror]
            }
            var step_now_update = null
            for (let k=0;k<transaction.length;k++) {
                var status_flow = transaction[k].flow
                var index  = transaction[k].index
                var actor = transaction[k].actor
                var action_detail = transaction[k].action_detail
                var name_reverse_th = []
                var name_reverse_eng = []
                if (step_now == index) {
                    stepaction_current = index
                    if (status_flow == false) {
                        for (let i=0;i<actor.length;i++) {
                            if (actor[i].account_id == User_account_id) {
                                stepaction_current = index
                                let status_node =  transaction[k].status
                                let action = transaction[k].action
                                if (status_node == 'W') {
                                    if (transaction[k-1].action == 'generate') {
                                        let tmperror = {
                                            'msg_thai' : 'ลำดับก่อนหน้าคือลำดับการสร้างเอกสารจึงไม่สามารถส่งคืนแก้ไขได้',
                                            'msg_eng' : 'The preceding sequence is the document creation order, so it cannot be returned.'
                                        }
                                        return [false,null,tmperror]
                                    }
                                    // --ย้อน status ลำดับปัจจบุัน
                                    transaction[k].status = 'I'
                                    //  --ย้อน status ลำดับก่อนหน้า
                                    // console.log('ย้อนลำดับก่อนหน้า')
                                    for(let p=step_now; p>=0; p--){
                                        let k = p - 1
                                        if (transaction[k].flow == true) {
                                            let tmperror = {
                                                'msg_thai' : 'ลำดับปัจจุบันไม่สามารถทำการส่งคืนแก้ไขได้',
                                                'msg_eng' : 'The current sequence cannot be returned.'
                                            }
                                            return [false,null,tmperror]
                                        }
                                        if (k == (index_reverse-1)) {
                                            transaction[k].status = 'W'
                                            for (let m=0;m<transaction[k].actor.length;m++) {
                                                if (transaction[k].actor[m].status == 'Complete') {
                                                    transaction[k].actor[m].status = 'Incomplete'
                                                    let first_name_th = transaction[k].actor[m].first_name_th
                                                    let last_name_th = transaction[k].actor[m].last_name_th
                                                    let first_name_eng = transaction[k].actor[m].first_name_eng
                                                    let last_name_eng = transaction[k].actor[m].last_name_eng
                                                    name_reverse_th.push(String(first_name_th + ' ' + String(last_name_th)))
                                                    name_reverse_eng.push(String(first_name_eng) + ' ' + String(last_name_eng))
                                                }
                                            }
                                            break
                                        }
                                        else if (k >= (index_reverse-1)) {
                                            for (let m=0;m<transaction[k].actor.length;m++) {
                                                transaction[k].status = 'I'
                                                if (transaction[k].actor[m].status == 'Complete') {
                                                    transaction[k].actor[m].status = 'Incomplete'
                                                }
                                            }
                                        }
                                        
                                      
                                       

                                    }
                                    step_now_update = index_reverse 
                                    tmpdetail = {
                                        'name_th': name_reverse_th,
                                        'name_eng': name_reverse_eng,
                                        'step': index_reverse
                                    }
                                } else {
                                    let tmperror = {
                                        'msg_thai' : 'ลำดับปัจจุบันไม่สามารถทำการส่งคืนแก้ไขได้',
                                        'msg_eng' : 'The current sequence cannot be returned.'
                                    }
                                    return [false,null,tmperror]
                                }
                            }
                        }
                    } else if (status_flow == true) {
                        let tmperror = {
                            'msg_thai' : 'ลำดับปัจจุบันไม่สามารถทำการส่งคืนแก้ไขได้',
                            'msg_eng' : 'The current sequence cannot be returned.'
                        }
                        return [false,null,tmperror]
                    }
                }
               
            }
            // return [false,transaction]
            if (step_now_update != null) {
                res_transaction[1].flow = transaction
                res_transaction[1].step_now = step_now_update
                var res_update = await actiontransaction.update_transaction(connectiondb,transaction_id,res_transaction[1])
                if (res_update[0]) {
                    // insert log
                    let tmpinsertlog = {
                        actor : User_account_id,
                        action : logdoc_action,
                        detail : JSON.stringify(tmpdetail),
                        index_actor : stepaction_current,
                        status : logdoc_status,
                        id_transaction : transaction_id
                    }
                    var reslogawait = await insertlogdoc.insert_tb_document_log(data_decry,tmpinsertlog)
                    return [true,res_update[1]]
                } else {
                    return [false,res_update[1]]
                }
            } else {
                let tmperror = {
                    'msg_thai' : 'ลำดับปัจจุบันไม่สามารถทำการส่งคืนแก้ไขได้',
                    'msg_eng' : 'The current sequence cannot be returned.'
                }
                return [false,null,tmperror]
            }
           
        } catch (err) {
            console.log(err)
            return [false,err,'']
        }
    },
    process_flow_sale: async function (connectiondb,document_type) {
        try{
            var list_permis = []
            var resp = await condition_method.select_flow_for_sale(connectiondb,document_type)
            if (resp[0]){
                var res_flow = await actionflow.find_flow(connectiondb,resp[1])
                if (res_flow[0]){
                    
                    var flow_data = res_flow[1].flow_data[0]
                    var permission_flow = flow_data.permission
                    permission_flow.forEach(element => 
                        list_permis.push(element.role_id)
                    )
                    // console.log('list_permis:',list_permis)
                    return [true,list_permis]
                }
            }
        }
        catch (err) {
            console.log(err)
            return [false,err]
        }
    }
}