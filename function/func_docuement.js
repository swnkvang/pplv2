require('../config/lib')
const condition = require('../method/conditon')
const sign_process = require('../method/sign_process')
const func_pdf = require('../function/func_pdf')
const html_to_pdf = require('../method/htmltopdf')
const func_datetime = require('../function/func_datetime')
const func_hash = require('../function/func_hash')
const func_sign_advance = require('../function/func_sign_advance')
const actionworkflow = require('../database/actiondb_workflow')
const actiontransaction = require('../database/actiondb_transaction')
const db_update = require('../database/db_update')
const func_html = require('../function/func_dataTohtml')


var func_check_logstatus = async function (actiontype,status) {
    try {
        var statuslog = null
        if (actiontype == 'e-sign' || actiontype == 'sign' || actiontype == 'approve' || actiontype == 'input' || actiontype == 'input_sign' || actiontype == 'offer' || actiontype == 'generate' || actiontype == 'endtask') {
            if (status == 'Complete') {
                statuslog = 'yes'
            } else if (status == 'Reject') {
                statuslog = 'no'
            } else if (status == 'Incomplete') {
                statuslog = 'fail'
            } else if (status == 'Draft') {
                statuslog = 'yes'
            } else if (status == 'Win') {
                statuslog = 'yes'
            } else if (status == 'Lost') {
                statuslog = 'no'
            } else if (status == 'Succeed') {
                statuslog = 'yes'
            } else if (status == 'Failure') {
                statuslog = 'yes'
            }
        }
        return [true,statuslog]
    } catch (err) {
        console.log(err)
        return [false,err]
    }
} 

// ใช้สำหรับ เช็ค node ของ flow ,กรณี flow เป็น false 
var func_check_statusdoc = async function (status_actor) {
    try {
        var status_node = ''
        if (status_actor == 'Complete') {
            status_node = 'Y'
        } else if (status_actor == 'Reject') {
            status_node = 'R'
        } else if (status_actor == 'Incomplete') {
            status_node = 'W'
        } else if (status_actor =='Draft') {
            status_node = 'W'
        } else if (status_actor == 'Win') {
            status_node = 'Y'
        } else if (status_actor == 'Lost') {
            status_node = 'R'
        } else if (status_actor == 'Succeed') {
            status_node = 'Y'
        } else if (status_actor == 'Failure') {
            status_node = 'R'
        }
        return [true,status_node]
    } catch (err) {
        console.log(err)
        return [false,err]
    }
}

var func_implement_actor = async function (data_decry,flowdata,input,deptidindex_0,now,colorgroup,doctype) {
    try {
        var flowdata = [flowdata]
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
        var data = flowdata
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
            if (status_implement == false) {
                if (flowStatus == false) {
                    if (permission_status == true) {
                        if (permission != null) {
                            for(k=0;k<permission.length;k++){
                                var tmp_permission = permission[k]
                                var tmp_role_id = tmp_permission.role_id
                                var tmp_dept_id = tmp_permission.dept_id
                                var tmp_role_name = tmp_permission.role_name
                                var tmp_dept_name = tmp_permission.dept_name
                                if (self == true) {
                                    // console.log('tmp_role_id',tmp_role_id)
                                    // console.log('tmp_dept_id',tmp_dept_id)
                                    for (m=0;m<arrbizUser_Select.length;m++){
                                        User_roleid =  arrbizUser_Select[m].role_id
                                        User_deptid = arrbizUser_Select[m].dept_id
                                        // console.log('User_roleid',User_roleid)
                                        arr_User_permis = []
                                        if (tmp_role_id != null) {
                                            if (User_roleid == tmp_role_id) {
                                                // console.log('ok roleid',arr_User_permis)
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
                                        // console.log('arr_User_permis',arr_User_permis)
                                        if(arr_User_permis.includes(false)){
                                            let errorindex = i+1
                                            let message_rep = 'actor index ' + errorindex + ' permission denied'
                                            return [false,message_rep]
                                        } else {
                                            Arrdept_accept.push(User_deptid)
                                            Arrrole_accept.push(User_roleid)
                                            Arrrolename_accept.push(tmp_role_name)
                                            Arrdeptname_accept.push(tmp_dept_name)
                                            tmp = {
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
                                            data_actor_list.push(tmp)
                                            stepaction_current = index
                                        }
                                    }
                                    data[i].actor = data_actor_list
                                    // update เวลาใน node
                                    data[i].createdAt = now
                                    data[i].updatedAt = now
                                    data[i].status_implement = status_imp_change
                                } else if (input_status == true) {
                                    for(x=0;x<jsonDetail.length;x++) {
                                        if (jsonDetail[x].index == index) {
                                            var deail = jsonDetail[x].deail
                                            // var tmp_role_id = data[i].actor.role_id
                                            // var tmp_dept_id = data[i].actor.tmp_dept_id
                                            var res_user = await func_infouser.find_infoUserbyAcc(deail.account_id,connectiondb)
                                            // return [true,res_user]
                                            let resuser_rolename = JSON.parse(res_user[0].role_name)
                                            let resuser_roleid = JSON.parse(res_user[0].role_id)
                                            let resuser_deptid = JSON.parse(res_user[0].dept_id)
                                            let resuser_deptname = JSON.parse(res_user[0].dept_name)
                                            let arr_User_permis = []
                                            if (tmp_role_id != null) {
                                                if (tmp_role_id.includes(resuser_roleid)) {
                                                    arr_User_permis.push(true)
                                                } else {
                                                    arr_User_permis.push(false)
                                                }
                                            }else {
                                                arr_User_permis.push(true)
                                            }
                                            if (tmp_dept_id != null) {
                                                if (tmp_dept_id.includes(resuser_deptid)) {
                                                    arr_User_permis.push(true)
                                                } else {
                                                    arr_User_permis.push(false)
                                                }
                                            }else {
                                                arr_User_permis.push(true)
                                            }
                                            // console.log('arr_User_permis02',arr_User_permis)
                                            tmp = {
                                                account_id : res_user[0].account_id,
                                                first_name_th : res_user[0].first_name_th,
                                                last_name_th : res_user[0].last_name_th,
                                                first_name_eng  : res_user[0].first_name_eng,
                                                last_name_eng  : res_user[0].last_name_eng,
                                                account_title_th  : res_user[0].account_title_th,
                                                account_title_eng  : res_user[0].account_title_eng,
                                                thai_email  : res_user[0].thai_email,
                                                detp_id  : resuser_deptid[0],
                                                role_id  : resuser_roleid[0],
                                                role_name : resuser_rolename[0],
                                                dept_name : resuser_deptname[0],
                                                status: status_pesonal
                                            }
                                            if(arr_User_permis.includes(false)){
                                                // pass
                                            } else {
                                                data_actor_list.push(tmp)
                                            }
                                        }
                                    }
                                    data[i].actor = data_actor_list
                                    data[i].createdAt = now
                                    data[i].updatedAt = now
                                    data[i].status_implement = status_imp_change
                                } else if (conditionflow == true) {
                                } else if (ref_permis_status == true) {
                                    let index_flow = ref_permission.index_flow
                                    index_flow = index_flow - 1
                                    // let role_name = ref_permission.role_name
                                    let role_id = ref_permission.role_id
                                    let dept_id =  ref_permission.dept_id
                                    let actor = ref_permission.actor
                                    if(actor == true){
                                        data[index_flow].actor.status = 'Incomplete'
                                        data_actor_list = data[index_flow].actor
                                        
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
                                                dataUser[r].status = 'Incomplete'
                                                data_actor_list.push(dataUser[r])
                                            }  
                                        }
                                    }
                                    data[i].actor = data_actor_list
                                    data[i].createdAt = now
                                    data[i].updatedAt = now
                                    data[i].status_implement = status_imp_change
                                
                                } else if (self == false && input_status == false && conditionflow == false && ref_permis_status == false){
                                    var result_find_userByOrg = await func_infouser.find_userByOrg(tmp_role_id,tmp_dept_id,connectiondb)
                                    if (result_find_userByOrg.status == 'SUCCESS') {
                                        let dataUser = result_find_userByOrg.data 
                                        for (r=0;r<dataUser.length;r++){
                                            dataUser[r].status = 'Incomplete'
                                            data_actor_list.push(dataUser[r])
                                        }  
                                    }
                                    data[i].actor = data_actor_list
                                    data[i].createdAt = now
                                    data[i].updatedAt = now
                                    data[i].status_implement = status_imp_change
                                }
                            }
                        }
                    } 
                    else if (ref_permis_status == true) {
                        let index_flow = ref_permission.index_flow
                        index_flow = index_flow - 1
                        // let role_name = ref_permission.role_name
                        let role_id = ref_permission.role_id
                        let dept_id =  ref_permission.dept_id
                        let actor = ref_permission.actor
                        if(actor == true){
                            let actornode = JSON.stringify(data[index_flow].actor)
                            let actornode_json = JSON.parse(actornode)
                            data_actor_list =  actornode_json
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
                                    data_actor_list.push(dataUser[r])
                                }  
                            }
                        }
                        data[i].actor = data_actor_list
                        data[i].createdAt = now
                        data[i].updatedAt = now
                        data[i].status_implement = status_imp_change
                    }  
                    // _______________ไม่มี flow _______________
                } else if (flowStatus == true) {
                    if (conditionflow == true) {
                        let dept_id_User = arrbizUser_Select[0].dept_id
                        var res_condition = null
                        res_condition = await condition.ch_condition_flow(input,condition_idflow,deptidindex_0,connectiondb)
                        // **กำหนดการเลือกใช้โค้ดประมวลผลจากประเภทเอกสาร**  -เดี๋ยวต้องมาเอาออกหลังจากทดสอบได้เเล้ว
                        // if (doctype == 'CS_TEST2') {
                        //     console.log('in CS_TEST2')
                        //     res_condition = await condition.ch_condition_flow(input,condition_idflow,deptidindex_0,connectiondb)
                        // }
                        // else {
                        //     res_condition = await condition.ch_condition_node_v3(input,condition_idflow,deptidindex_0,connectiondb)
                        // }
                        if (res_condition[0]){
                            flow_sign = res_condition[1]
                            colorgroup = res_condition[2]
                            data[i].action_detail = flow_sign
                            data[i].stepnow_actiondetail = 1
                            data[i].createdAt = now
                            data[i].updatedAt = now
                            data[i].status_implement = status_imp_change
                            for (let y;y<data[i].action_detail.length;y++) {
                                data[i].action_detail[y].createdAt = now
                                data[i].action_detail[y].updatedAt = now
                            }
                        }else {
                            let tmperror = {
                                msg_thai : 'sf หรือ external ไม่ตรงตามเงือนไข ไม่สามารถประมวลผลลำดับถัดไปได้',
                                msg_eng : 'sf or external does not meet the conditions, it is not possible to process the next sequence.'
                            }
                            return [false,null,tmperror]
                        }
                    }
                }
                
            }
        } 
        return [true,data[0],colorgroup]
    } catch (err) {
        console.log(err)
        return [false,err]
    }
}

// ใช้สำหรับ เช็ค node ของ flow ,กรณี flow เป็น true 
var checkStatus_actiondetail = async function (action_detail) {
    try {
        var status_node = ''
        var count_complete = 0
        var count_reject = 0
        var count_incomplete = 0
        var count_draft = 0
        var count_win = 0
        var count_lose = 0
        var count_Succeed = 0
        var count_Failure = 0
        var actiondetail_length = action_detail.length
        var arr_status = []
        for (let k=0;k<action_detail.length;k++) {
            arr_status.push(action_detail[k].status)
            console.log(action_detail[k].status)
        }
        for (let y=0;y<arr_status.length;y++){
            if (arr_status[y] == 'Complete'){ 
                count_complete += 1
            } else if (arr_status[y] == 'Reject') {
                count_reject += 1
            } else if (arr_status[y] == 'Incomplete') {
                count_incomplete += 1
            } else if (arr_status[y] == 'Draft') {
                count_draft += 1
            } else if (arr_status[y] == 'Win') {
                count_win +=1
            } else if (arr_status[y] == 'Lose') {
                count_lose += 1
            } else if (arr_status[y] == 'Succeed') {
                count_Succeed += 1
            } else if (arr_status[y] == 'Failure') {
                count_Failure += 1
            }
        }
        count_complete = count_complete + count_win + count_Succeed
        count_reject = count_reject + count_lose + count_Failure
        if (actiondetail_length == count_complete) {
            status_node = 'Y'
        } else if (count_reject > 0) {
            status_node = 'R'
        } else if (count_incomplete > 0) {
            status_node = 'W'
        } else if (count_draft > 0) {
            status_node = 'W'
        }
        return [true,status_node]
    } catch (err) {
        console.log(err)
        return [false,err]
    }
}

var checkStatus_transaction= async function (flowdata) {
    try {
        var status_transaction = ''
        var arr_status_node = []
        var count_y = 0
        var count_r = 0
        var count_w = 0
        var count_i = 0
        var flowdata_length = flowdata.length
        for (let k=0;k<flowdata.length;k++) {
            arr_status_node.push(flowdata[k].status)
            if (flowdata[k].status == 'Y') {
                count_y += 1
            } else if (flowdata[k].status == 'R') {
                count_r += 1
            } else if (flowdata[k].status == 'W') {
                count_w += 1
            } else if (flowdata[k].status == 'I') {
                count_i += 1
            }
        }
        // console.log('arr_status_node',arr_status_node)
        // console.log(count_y,count_r,count_w,count_i)
        if (flowdata_length == count_y) {
            status_transaction = 'Y'
        } else if (count_r > 0) {
            status_transaction = 'R'
        } else if (count_w > 0 || count_i > 0) {
            status_transaction = 'N'
        } 

        return [true,status_transaction]
    } catch (err) {
        console.log(err)
        return [false,err]
    }
}

var updateflowdoc_by_system = async function (actor_update,flow_doc,User_account_id,step_max,step_now) {
    try {
        var arrlog = []
        var stepnow_recheck = step_now
        var now = timemoment().format();
        for (let k=0;k<actor_update.length;k++) {
            let index_update = actor_update[k].index
            let status_update = actor_update[k].status
            for (let i=0;i<flow_doc.length;i++) {
                let index_tran_db = flow_doc[i].index
                let status_flow = flow_doc[i].flow
                let actor_flow = flow_doc[i].actor
                let action_detail = flow_doc[i].action_detail
                let action =  flow_doc[i].action
                let step_in_actiondetail = null
                let all_statusnode = null
                if (index_tran_db == index_update) {
                    if (action != 'generate') {
                        let tmperror = {
                            msg_thai: 'ไม่สามารถอัพเดตได้',
                            msg_eng: 'It is not action, Can not update'
                        }
                        return [false,tmperror]
                    }
                    if (index_update != stepnow_recheck) {
                        let tmperror = {
                            'msg_thai' : 'ไม่สามารถอนุมัติเอกสารได้เนื่องจากไม่ใช่ลำดับการทำงานของคุณ',
                            'msg_eng' : 'The document could not be released because it is not your work order.'
                        }
                        return [false,null,tmperror]
                    }
                    if (status_flow == false) {
                        // กรณีไม่มี flow
                        let res_checkstatus = await func_check_statusdoc(status_update)
                        if (res_checkstatus[0] == true) {
                            all_statusnode = res_checkstatus[1]
                            let statusnode = res_checkstatus[1]
                            for (let a=0;a<flow_doc[i].actor.length;a++){
                                if (flow_doc[i].actor[a].account_id == User_account_id) {
                                    if (flow_doc[i].status != 'W'){
                                        let tmperror = {
                                            'msg_thai' : 'ไม่สามารถอนุมัติเอกสารได้เนื่องจากไม่ใช่ลำดับการทำงานของคุณ',
                                            'msg_eng' : 'The document could not be released because it is not your work order.'
                                        }
                                        return[false,null,tmperror]
                                    }
                                    if (flow_doc[i].status == 'Y') {
                                        let indexof_complete = flow_doc[i].actor.findIndex(x => x.status === 'Complete')
                                        let firstnameth_complete = flow_doc[i].actor[indexof_complete].first_name_th
                                        let lastnameth_complete = flow_doc[i].actor[indexof_complete].last_name_th
                                        let firstname_eng_complete = flow_doc[i].actor[indexof_complete].first_name_eng
                                        let lastname_eng_complete = flow_doc[i].actor[indexof_complete].last_name_eng 
                                        if (indexof_complete < 0) {
                                            let tmperror = {
                                                'msg_thai' : 'ลำดับอนุมัติของคุณได้รับการอนุมัติเเล้ว',
                                                'msg_eng' : 'Your approval sequence has been approved.'
                                            }
                                            return[false,null,tmperror]
                                        } else {
                                            let tmperror = {
                                                'msg_thai' : 'ลำดับอนุมัติของคุณได้รับการอนุมัติเเล้วโดย คุณ' + firstnameth_complete + ' ' + lastnameth_complete,
                                                'msg_eng' : 'Your approval sequence has been approved by ' + firstname_eng_complete +  ' ' + lastname_eng_complete
                                            }
                                            return[false,null,tmperror]
                                        }
                                        
                                    }
                                    // var idx_actor = (flow_doc[i].actor).findIndex(x => x.account_id === User_account_id)
                                    // let step_cur = idx_actor + 1
                                    // let ch_pdfsign = flow_doc[i].actor[idx_actor].pdf_sign
                                    // if (statusnode == 'Y') {
                                    //     // เช็คว่าต้อง gen pdf หรือไม่
                                    //     if (ch_pdfsign == true) {
                                    //         if (path_pdf_sign == null) {
                                    //                 // gen pdf
                                    //                 var paper_size = 'A4'
                                    //                 var orientation = 'false'
                                    //                 var res_genpdf = await html_to_pdf.htmltoPDF(reshtml,paper_size,orientation,hederbiz)
                                    //                 // var res_genpdf = await func_pdf.generatePdf_v5(reshtml,null,false)
                                    //                 if (res_genpdf[0]) {
                                    //                     var base64 = res_genpdf[1]
                                    //                     // size base64
                                    //                     var convertbase64 = (Buffer.from(base64,'base64')).length
                                    //                     var buf = Buffer.alloc(convertbase64);
                                    //                     var pdfSize = Buffer.byteLength(buf);
                                    //                     // เก็บ base64 ลงเครื่อง
                                    //                     // var now = new Date
                                    //                     var dtnow = await func_datetime.formatDate(now)
                                    //                     var pathbiz = path_local + '/' +'storage' +'/' + hederbiz + '/' + 'pdf' + '/' + dtnow + '/'
                                    //                     var pdfdata = base64
                                    //                     var hashpdf = await func_hash.sha512(base64)
                                    //                     var res_storageBase64 = await func_pdf.createfile_pdfsign_v1(pdfdata,hashpdf,pathbiz)
                                    //                     if (res_storageBase64[0] == 200){
                                    //                         path =  res_storageBase64[1].path
                                    //                         path_pdf_original = res_storageBase64[1].path_pdf
                                    //                         path_hash_original = res_storageBase64[1].path_pdfhash
                                    //                         path_pdf_sign = res_storageBase64[1].path_pdfsign
                                    //                         path_pdfhashsign = res_storageBase64[1].path_pdfhashsign
                                    //                         pdfSize = pdfSize
                                    //                     } else {
                                    //                         return [false,res_storageBase64[1]]
                                    //                     }
                                    //                 }
                                    //         }
                                    //     }
                                    // }
                                    // ถ้าสถานะ Complete ถือว่า user ยืนยันการลงลายเซ็น
                                    // if (status_update == 'Complete') {
                                    //     if (action == 'e-sign' || action == 'input_sign') {
                                    //         if (sign_info == null || sign_info == '') {
                                    //             let tmperror = {
                                    //                 msg_thai : 'ไม่พบรายเซ็นของคุณ',
                                    //                 msg_eng : 'not found your signature.'
                                    //             }
                                    //             return [false,null,tmperror]
                                    //         }
                                    //         // ---jsonsign---
                                    //         // console.log('path_pdf_sign',path_pdf_sign)
                                    //         var res_signprocess = await func_sign_advance.jsonsigning(data_decry,transaction_id,step_cur,index_tran_db,sign_info,path_pdf_sign)
                                    //         // return [false,res_signprocess[1]]
                                    //         if (res_signprocess[0] == 200) {
                                    //             if (ch_pdfsign == true) {
                                    //                 pdfData = res_signprocess[1].pdfData
                                    //                 hashpdfsign = await func_hash.sha512(pdfData)
                                    //             } 
                                    //         } else {
                                    //             return[false,res_signprocess[1]]
                                    //         }
                                    //         // *
                                    //         // var res_signprocess = await sign_process.sign_pdf(transaction_id,step_cur,index_tran_db,sign_info,data_decry)
                                    //         // if (res_signprocess[0] == 200) {
                                    //         //     pdfData = res_signprocess[1].result_data.pdfData
                                    //         //     hashpdfsign = await func_hash.sha512(pdfData)
                                    //         // } else {
                                    //         //     return[false,res_signprocess[1]]
                                    //         // }
                                    //         // *
                                    //         // update รูปลายเซ็นใน flow
                                    //         flow_doc[i].actor[a].sign_base64 = sign_info
                                    //     } else if (action == 'sign') {
                                    //         // ยังไม่รองรับ
                                    //         // return [false,res_signprocess]
                                    //         // var res_signprocess = await sign_process.sign_pdf(transaction_id,step_cur,index_tran_db,sign_info,data_decry)
                                    //     }
                                    // }
                                    // update status in actor
                                    flow_doc[i].actor[a].status = status_update
                                    // update status in node
                                    flow_doc[i].status = statusnode
                                    flow_doc[i].updatedAt = now
                                    // check status log
                                    var res_statuslog = await func_check_logstatus(flow_doc[i].action,flow_doc[i].actor[a].status)
                                    if (!(res_statuslog[0])) {
                                        return [false,'check status log not complete ' + String(res_statuslog[1])]
                                    }
                                    // log
                                    let tmp =  {
                                        actor : User_account_id,
                                        action :   flow_doc[i].action,
                                        detail : null,
                                        index_actor : flow_doc[i].index,
                                        status: res_statuslog[1]
                                    }
                                    arrlog.push(tmp)
                                }
                            }
                        }
                    }
                    else if (status_flow == true) {
                        // กรณีมี flow
                        for (let k=0;k<flow_doc[i].action_detail.length;k++) {
                            if (flow_doc[i].action_detail[k].account_id == User_account_id) {
                                // update status in action_detail
                                // let step_cur = flow_doc[i].action_detail[k].step
                                // let ch_pdfsign = flow_doc[i].action_detail[k].pdf_sign
                                step_in_actiondetail = flow_doc[i].action_detail[k].step
                                flow_doc[i].action_detail[k].status = status_update
                                flow_doc[i].action_detail[k].updatedAt = now
                                res_ch_actiondetail = await checkStatus_actiondetail(flow_doc[i].action_detail)
                                all_statusnode = res_ch_actiondetail[1]
                                if (res_ch_actiondetail[0]) {
                                    flow_doc[i].status = res_ch_actiondetail[1]
                                    flow_doc[i].stepnow_actiondetail = flow_doc[i].stepnow_actiondetail + 1
                                    flow_doc[i].updatedAt = now
                                    // check status log
                                    var res_statuslog = await func_check_logstatus(flow_doc[i].action,flow_doc[i].action_detail[k].status)
                                    if (!(res_statuslog[0])) {
                                        return [false,'check status log not complete ' + String(res_statuslog[1])]
                                    }
                                    let tmp =  {
                                        actor : User_account_id,
                                        action :   flow_doc[i].action,
                                        detail : null,
                                        index_actor : flow_doc[i].index,
                                        status : res_statuslog[1]
                                    }
                                    arrlog.push(tmp)
                                }
                                // if (res_ch_actiondetail[1] == 'Y') {
                                //     // เช็คว่าต้อง gen pdf หรือไม่ 
                                //     if (ch_pdfsign == true) {
                                //         if (path_pdf_sign == null) {
                                //             // gen pdf
                                //             var paper_size = 'A4'
                                //             var orientation = 'false'
                                //             var res_genpdf = await html_to_pdf.htmltoPDF(reshtml,paper_size,orientation,hederbiz)
                                //             // var res_genpdf = await func_pdf.generatePdf_v5(reshtml,null,false)
                                //             if (res_genpdf[0]) {
                                //                 var base64 = res_genpdf[1]
                                //                 // size base64
                                //                 var convertbase64 = (Buffer.from(base64,'base64')).length
                                //                 var buf = Buffer.alloc(convertbase64);
                                //                 var pdfSize = Buffer.byteLength(buf);
                                //                 // เก็บ base64 ลงเครื่อง
                                //                 // var now = new Date
                                //                 var dtnow = await func_datetime.formatDate(now)
                                //                 var pathbiz = path_local + '/' +'storage' +'/' + hederbiz + '/' + 'pdf' + '/' + dtnow + '/'
                                //                 var pdfdata = base64
                                //                 var hashpdf = await func_hash.sha512(base64)
                                //                 var res_storageBase64 = await func_pdf.createfile_pdfsign_v1(pdfdata,hashpdf,pathbiz)
                                //                 if (res_storageBase64[0] == 200){
                                //                     path =  res_storageBase64[1].path
                                //                     path_pdf_original = res_storageBase64[1].path_pdf
                                //                     path_hash_original = res_storageBase64[1].path_pdfhash
                                //                     path_pdf_sign = res_storageBase64[1].path_pdfsign
                                //                     path_pdfhashsign = res_storageBase64[1].path_pdfhashsign
                                //                     pdfSize = pdfSize
                                //                 } else {
                                //                     return [false,res_storageBase64[1]]
                                //                 }
                                //             }
                                //         }
                                //     }
                                // }
                                // ถ้าสถานะ Complete ถือว่า user ยืนยันการลงลายเซ็น
                                // if (status_update == 'Complete') {
                                //     if (action == 'e-sign' || action == 'input_sign') {
                                //         if (sign_info == null || sign_info == '') {
                                //             let tmperror = {
                                //                 msg_thai : 'ไม่พบรายเซ็นของคุณ',
                                //                 msg_eng : 'not found your signature.'
                                //             }
                                //             return [false,null,tmperror]
                                //         }
                                        
                                //         // ---jsonsign---
                                //         var res_signprocess = await func_sign_advance.jsonsigning(data_decry,transaction_id,step_cur,index_tran_db,sign_info,path_pdf_sign)
                                //         // return[false,res_signprocess]
                                //         if (res_signprocess[0] == 200) {
                                //             if (ch_pdfsign == true) {
                                //                 pdfData = res_signprocess[1].pdfData
                                //                 hashpdfsign = await func_hash.sha512(pdfData)
                                //             } 
                                //         } else {
                                //             return[false,res_signprocess[1]]
                                //         } 
                                //         flow_doc[i].action_detail[k].sign_base64 = sign_info
                                //     } else if (action == 'sign') {
                                //         // ยังไม่รองรับ
                                //         // return [false,res_signprocess]
                                //         // var res_signprocess = await sign_process.sign_pdf(transaction_id,step_cur,index_tran_db,sign_info,data_decry)
                                //     }
                                // }
                            }
                        }
                    }
                    index_infront = index_tran_db + 1
                    if (status_update != 'Draft' && all_statusnode == 'Y') {
                        // console.log('in not draft')
                        if (index_infront <= step_max) {
                            step_now = index_infront
                            status_implement = flow_doc[index_infront-1].status_implement
                            action_front = flow_doc[index_infront-1].action
                            flow_front = flow_doc[index_infront-1].flow
                            flow_doc[index_infront-1].status = 'W'
                            // if (status_implement == false) {
                            //     // implement actor
                            //     var deptidindex_0 = flow_doc[0].actor[0].detp_id
                            //     var result_implement_actor = await func_implement_actor(data_decry,flow_doc[index_infront-1],input_info,deptidindex_0,now,color)
                            //     // console.log('result_implement_actor',result_implement_actor)
                            //     if (result_implement_actor[0]) {
                            //         flow_doc[index_infront-1] = result_implement_actor[1]
                            //         color = result_implement_actor[2]
                            //     } else {
                            //         return [false,'next step not implement actor or action_detail',result_implement_actor[2]]
                            //     }
                            // }
                        }
                    }
                    // if (action == 'input' || action == 'input_sign') {
                    //     ch_statusupdate_input = true
                    // }
                   
    
                }
            }
        }
        let tmpre = {
            flow_doc : flow_doc,
            step_now : step_now,
            arrlog : arrlog
        }
        return [true,tmpre]
    } catch (err) {
        console.log(err)
        return[false,err]
    }
}

var update_actor = async function (path ,path_pdf_original, path_pdf_sign, path_hash_original ,path_pdfhashsign, pdfSize, transaction_id, data_decry, input_info,now,actor_update,flow_doc,User_account_id,step_max,reshtml,step_now,hederbiz,sign_info,color,document_id,ref,doctype,hash_html,status_view_pdf) {
    try {
        let base64_from_genpdf = null
        let stepnow_recheck = step_now
        var pdfData = null
        var hashpdfsign = null
        if (path_pdf_sign != null) {
            fs.readFile(path_pdf_sign, 'utf8' , (err, data) => {
                if (err) {
                    console.error(err)
                    return [false,err]
                }
                pdfData = data
                base64_from_genpdf = data
            })
        }
        if (path_pdfhashsign != null) {
            fs.readFile(path_pdfhashsign, 'utf8' , (err, data) => {
                if (err) {
                    console.error(err)
                    return [false,err]
                }
                hashpdfsign = data
            })
        }
        var arrlog = []
        var ch_statusupdate_input = false
        for (let k=0;k<actor_update.length;k++) {
            let index_update = actor_update[k].index
            let status_update = actor_update[k].status
            for (let i=0;i<flow_doc.length;i++) {
                let index_tran_db = flow_doc[i].index
                let status_flow = flow_doc[i].flow
                let actor_flow = flow_doc[i].actor
                let action_detail = flow_doc[i].action_detail
                let action =  flow_doc[i].action
                let step_in_actiondetail = null
                let all_statusnode = null
                let change_status = false
                let status_on_pdf = flow_doc[i].status_on_pdf
                let detail_on_pdf = flow_doc[i].detail_on_pdf
                if (index_tran_db == index_update) {
                    if (index_update != stepnow_recheck) {
                        let tmperror = {
                            'msg_thai' : 'ไม่สามารถอนุมัติเอกสารได้เนื่องจากไม่ใช่ลำดับการทำงานของคุณ',
                            'msg_eng' : 'The document could not be released because it is not your work order.'
                        }
                        return [false,null,tmperror]
                    }
                    if (status_flow == false) {
                        // กรณีไม่มี flow
                        let res_checkstatus = await func_check_statusdoc(status_update)
                        if (res_checkstatus[0] == true) {
                            all_statusnode = res_checkstatus[1]
                            let statusnode = res_checkstatus[1]
                            let CheckUpdateNode = false
                            for (let a=0;a<flow_doc[i].actor.length;a++){
                                if (flow_doc[i].actor[a].account_id == User_account_id) {
                                    change_status = true
                                    if (CheckUpdateNode == false) {
                                        if (flow_doc[i].status !== 'W'){
                                            let tmperror = {
                                                'msg_thai' : 'ไม่สามารถอนุมัติเอกสารได้เนื่องจากไม่ใช่ลำดับการทำงานของคุณ',
                                                'msg_eng' : 'The document could not be released because it is not your work order.'
                                            }
                                            return[false,null,tmperror]
                                        }
                                        if (flow_doc[i].status == 'Y') {
                                            let indexof_complete = flow_doc[i].actor.findIndex(x => x.status === 'Complete')
                                            let firstnameth_complete = flow_doc[i].actor[indexof_complete].first_name_th
                                            let lastnameth_complete = flow_doc[i].actor[indexof_complete].last_name_th
                                            let firstname_eng_complete = flow_doc[i].actor[indexof_complete].first_name_eng
                                            let lastname_eng_complete = flow_doc[i].actor[indexof_complete].last_name_eng 
                                            if (indexof_complete < 0) {
                                                let tmperror = {
                                                    'msg_thai' : 'ลำดับอนุมัติของคุณได้รับการอนุมัติเเล้ว',
                                                    'msg_eng' : 'Your approval sequence has been approved.'
                                                }
                                                return[false,null,tmperror]
                                            } else {
                                                let tmperror = {
                                                    'msg_thai' : 'ลำดับอนุมัติของคุณได้รับการอนุมัติเเล้วโดย คุณ' + firstnameth_complete + ' ' + lastnameth_complete,
                                                    'msg_eng' : 'Your approval sequence has been approved by ' + firstname_eng_complete +  ' ' + lastname_eng_complete
                                                }
                                                return[false,null,tmperror]
                                            }
                                            
                                        }
                                        var idx_actor = (flow_doc[i].actor).findIndex(x => x.account_id === User_account_id)
                                        let step_cur = idx_actor + 1
                                        let ch_pdfsign = flow_doc[i].actor[idx_actor].pdf_sign
                                        if (statusnode == 'Y') {
                                            // เช็คว่าต้อง update html หรือไม่
                                            if (status_on_pdf == true) {
                                                for(let u=0;u<detail_on_pdf.length;u++) {
                                                    if (detail_on_pdf[u].keyPdf == 'SBM_Name') {
                                                        // Qt_Lang
                                                        let lang = null
                                                        let index_lang = input_info.findIndex(x => x.key === "Qt_Lang")
                                                        if (index_lang > 0) {
                                                            lang = input_info[index_lang].value
                                                        }
                                                        // UPDATE input  KEY sbm
                                                        let name_th = flow_doc[i].actor[a].first_name_th + ' ' + flow_doc[i].actor[a].last_name_th
                                                        let name_eng = flow_doc[i].actor[a].first_name_eng + ' ' + flow_doc[i].actor[a].last_name_eng
                                                        let role_name = flow_doc[i].actor[a].role_name
                                                        for (let r=0;r < input_info.length;r++ ) {
                                                            if (input_info[r].key == "SBM_Name") {
                                                                if (lang != null) {
                                                                    if (lang == 'th') {
                                                                        input_info[r].value = name_th
                                                                    } else {
                                                                        input_info[r].value = name_eng
                                                                    }
                                                                } 
                                                            } 
                                                            if (input_info[r].key == "SBM_Role") {
                                                                input_info[r].value = role_name[0]
                                                            }
                                                        }
                                                        // update html
                                                        if (doctype == 'CS' || doctype == 'CS_TEST' || doctype == 'CS_TEST2') {
                                                            let inputparam = JSON.parse(JSON.stringify(input_info))
                                                            reshtml = await func_html.genHtmlCs(inputparam,document_id,ref)
                                                            reshtml = reshtml.replace(/\n/g, "")
                                                            hash_html = await func_hash.sha512(reshtml)
                                                            ch_statusupdate_input = true
                                                        } 
                                                        else if (doctype == 'QT') {
                                                            let inputparam = JSON.parse(JSON.stringify(input_info))
                                                            reshtml = await func_html.genHtmlQtBiLangV2(inputparam,document_id)
                                                            reshtml = reshtml.replace(/\n/g, "")
                                                            hash_html = await func_hash.sha512(reshtml)
                                                            ch_statusupdate_input = true
                                                        } 
                                                        else if (doctype == 'QT_TEST' || doctype == 'QT_TEST2') {
                                                            let inputparam = JSON.parse(JSON.stringify(input_info))
                                                            reshtml = await func_html.genHtmlQtBiLangV2(inputparam,document_id)
                                                            reshtml = reshtml.replace(/\n/g, "")
                                                            hash_html = await func_hash.sha512(reshtml)
                                                            ch_statusupdate_input = true
                                                        } else {
                                                            let tmperror = {
                                                                msg_thai: 'ไม่สามารถแปลงเป็นไฟล์ .html ได้',
                                                                msg_eng: 'Can not generate to html'
                                                            }
                                                            return [false,reshtml,tmperror]
                                                        }
                                                    }
                                                }
                                            }
                                            // เช็คว่าต้อง gen pdf หรือไม่
                                            if (ch_pdfsign == true) {
                                                if (path_pdf_sign == null) {
                                                        // gen pdf
                                                        var paper_size = 'A4'
                                                        var orientation = 'false'
                                                        var res_genpdf = await html_to_pdf.htmltoPDF(data_decry,reshtml,paper_size,orientation,hederbiz,transaction_id)
                                                        // var res_genpdf = await func_pdf.generatePdf_v5(reshtml,null,false)
                                                        if (res_genpdf[0]) {
                                                            var base64 = res_genpdf[1]
                                                            base64_from_genpdf = base64
                                                            // size base64
                                                            var convertbase64 = (Buffer.from(base64,'base64')).length
                                                            var buf = Buffer.alloc(convertbase64);
                                                            var pdfSize = Buffer.byteLength(buf);
                                                            // เก็บ base64 ลงเครื่อง
                                                            // var now = new Date
                                                            var dtnow = await func_datetime.formatDate(now)
                                                            var pathbiz = path_local + '/' +'storage' +'/' + hederbiz + '/' + 'pdf' + '/' + dtnow + '/'
                                                            var pdfdata = base64
                                                            var hashpdf = await func_hash.sha512(base64)
                                                            var res_storageBase64 = await func_pdf.createfile_pdfsign_v1(pdfdata,hashpdf,pathbiz)
                                                            // return [false,res_storageBase64,'']
                                                            if (res_storageBase64[0] == 200){
                                                                path =  res_storageBase64[1].path
                                                                path_pdf_original = res_storageBase64[1].path_pdf
                                                                path_hash_original = res_storageBase64[1].path_pdfhash
                                                                path_pdf_sign = res_storageBase64[1].path_pdfsign
                                                                path_pdfhashsign = res_storageBase64[1].path_pdfhashsign
                                                                pdfSize = pdfSize
                                                                // transaction_id
                                                                // var res_save_path = await actiontransaction.updatetransactiion_path(data_decry.db_connect,transaction_id,path_pdf_sign,path_pdfhashsign)
                                                                // return[false,resss,'']
                                                            } else {
                                                                return [false,res_storageBase64[1]]
                                                            }
                                                        }
                                                }
                                            }
                                        }
                                        // ถ้าสถานะ Complete ถือว่า user ยืนยันการลงลายเซ็น
                                        if (status_update == 'Complete') {
                                            if (action == 'e-sign' || action == 'input_sign') {
                                                if (sign_info == null || sign_info == '') {
                                                    let tmperror = {
                                                        msg_thai : 'ไม่พบรายเซ็นของคุณ',
                                                        msg_eng : 'not found your signature.'
                                                    }
                                                    return [false,null,tmperror]
                                                }
                                                // ---jsonsign---
                                                var res_signprocess = await func_sign_advance.jsonsigning(data_decry,transaction_id,step_cur,index_tran_db,sign_info,base64_from_genpdf)
                                                if (res_signprocess[0] == 200) {
                                                    // console.log(res_signprocess[0])
                                                    // return [false,res_signprocess[1]]
                                                    if (ch_pdfsign == true) {
                                                        pdfData = res_signprocess[1].pdfData
                                                        if (pdfData == null || pdfData == '') {
                                                            let tmperror = {
                                                                'msg_thai' : 'พบปัญหาในการบันทึก pdf',
                                                                'msg_eng' : 'There was a problem recording pdf.'
                                                            }
                                                            return[false,null,tmperror]
                                                        }
                                                        hashpdfsign = await func_hash.sha512(pdfData)
                                                        let convertbase64 = (Buffer.from(pdfData,'base64')).length
                                                        let buf = Buffer.alloc(convertbase64);
                                                        pdfSize = Buffer.byteLength(buf);
                                                        status_view_pdf = true
                                                    } 
                                                } else {
                                                    return[false,res_signprocess[1],res_signprocess[2]]
                                                }
                                                // *
                                                // var res_signprocess = await sign_process.sign_pdf(transaction_id,step_cur,index_tran_db,sign_info,data_decry)
                                                // if (res_signprocess[0] == 200) {
                                                //     pdfData = res_signprocess[1].result_data.pdfData
                                                //     hashpdfsign = await func_hash.sha512(pdfData)
                                                // } else {
                                                //     return[false,res_signprocess[1]]
                                                // }
                                                // *
                                                // update รูปลายเซ็นใน flow
                                                flow_doc[i].actor[a].sign_base64 = sign_info
                                            } else if (action == 'sign') {
                                                // ยังไม่รองรับ
                                                // return [false,res_signprocess]
                                                // var res_signprocess = await sign_process.sign_pdf(transaction_id,step_cur,index_tran_db,sign_info,data_decry)
                                            }
                                        }
                                        // update status in actor
                                        flow_doc[i].actor[a].status = status_update
                                        // update status in node
                                        flow_doc[i].status = statusnode
                                        flow_doc[i].updatedAt = now
                                        CheckUpdateNode = true
                                        // check status log
                                        var res_statuslog = await func_check_logstatus(flow_doc[i].action,flow_doc[i].actor[a].status)
                                        // console.log('res_statuslog',res_statuslog)
                                        // return [false,res_statuslog]
                                        if (!(res_statuslog[0])) {
                                            return [false,'check status log not complete ' + String(res_statuslog[1])]
                                        }
                                        // log
                                        let tmp =  {
                                            actor : User_account_id,
                                            action :   flow_doc[i].action,
                                            detail : null,
                                            index_actor : flow_doc[i].index,
                                            status: res_statuslog[1]
                                        }
                                        arrlog.push(tmp)
                                    }
                                }
                            }
                        }
                    }
                    else if (status_flow == true) {
                        // กรณีมี flow
                        let CheckUpdateNodeFlow = false
                        // เช็คว่า stepnow-actiondetail = index
                        for (let k=0;k<flow_doc[i].action_detail.length;k++) {
                            if (flow_doc[i].stepnow_actiondetail ==  flow_doc[i].action_detail[k].step) {
                                if (flow_doc[i].action_detail[k].account_id == User_account_id) {
                                    change_status = true
                                    if (CheckUpdateNodeFlow == false) {
                                        if (flow_doc[i].status !== 'W'){
                                            let tmperror = {
                                                'msg_thai' : 'ไม่สามารถอนุมัติเอกสารได้เนื่องจากไม่ใช่ลำดับการทำงานของคุณ',
                                                'msg_eng' : 'The document could not be released because it is not your work order.'
                                            }
                                            return[false,null,tmperror]
                                        }
                                        if (flow_doc[i].status == 'Y') {
                                            if (indexof_complete < 0) {
                                                let tmperror = {
                                                    'msg_thai' : 'ลำดับอนุมัติของคุณได้รับการอนุมัติเเล้ว',
                                                    'msg_eng' : 'Your approval sequence has been approved.'
                                                }
                                                return[false,null,tmperror]
                                            } else {
                                                let tmperror = {
                                                    'msg_thai' : 'ลำดับอนุมัติของคุณได้รับการอนุมัติเเล้ว',
                                                    'msg_eng' : 'Your approval sequence has been approved'
                                                }
                                                return[false,null,tmperror]
                                            }
                                        }
                                        // update status in action_detail
                                        var res_statusActor_inActiondetail = await func_check_statusdoc(status_update)
                                        if (!(res_statusActor_inActiondetail[0])) {
                                            let tmperror = {
                                                msg_thai : 'พบปัญหาในการประมวลผลสถานะเอกสาร',
                                                msg_eng : 'There was a problem processing the document status.'
                                            }
                                            return [false,null,tmperror]
                                        }
                                        let step_cur = flow_doc[i].action_detail[k].step
                                        let ch_pdfsign = flow_doc[i].action_detail[k].pdf_sign
                                        let status_endtask =  flow_doc[i].action_detail[k].status_endtask
                                        step_in_actiondetail = flow_doc[i].action_detail[k].step
                                        flow_doc[i].action_detail[k].status = status_update
                                        flow_doc[i].action_detail[k].updatedAt = now
                                        res_ch_actiondetail = await checkStatus_actiondetail(flow_doc[i].action_detail)
                                        // return [false,res_ch_actiondetail[1]]
                                        all_statusnode = res_ch_actiondetail[1]
                                        if (res_ch_actiondetail[0]) {
                                            flow_doc[i].status = res_ch_actiondetail[1]
                                            flow_doc[i].stepnow_actiondetail = flow_doc[i].stepnow_actiondetail + 1
                                            flow_doc[i].updatedAt = now
                                            CheckUpdateNodeFlow = true
                                            flow_doc[i].action_detail[k].status_actiondetail = res_statusActor_inActiondetail[1]
                                            if (res_ch_actiondetail[1] != 'Y') {
                                                flow_doc[i].action_detail[k+1].status_actiondetail = 'W'
                                            }
                                            // check status log
                                            var res_statuslog = await func_check_logstatus(flow_doc[i].action,flow_doc[i].action_detail[k].status)
                                            if (!(res_statuslog[0])) {
                                                return [false,'check status log not complete ' + String(res_statuslog[1])]
                                            }
                                            let tmp =  {
                                                actor : User_account_id,
                                                action :   flow_doc[i].action,
                                                detail : null,
                                                index_actor : flow_doc[i].index,
                                                status : res_statuslog[1]
                                            }
                                            arrlog.push(tmp)
                                        }
                                        if (res_ch_actiondetail[1] == 'Y') {
                                            // เช็คว่าต้อง gen pdf หรือไม่ 
                                            if (ch_pdfsign == true) {
                                                if (path_pdf_sign == null) {
                                                    // gen pdf
                                                    var paper_size = 'A4'
                                                    var orientation = 'false'
                                                    var res_genpdf = await html_to_pdf.htmltoPDF(data_decry,reshtml,paper_size,orientation,hederbiz,transaction_id)
                                                    // var res_genpdf = await func_pdf.generatePdf_v5(reshtml,null,false)
                                                    if (res_genpdf[0]) {
                                                        var base64 = res_genpdf[1]
                                                        base64_from_genpdf = base64
                                                        // size base64
                                                        var convertbase64 = (Buffer.from(base64,'base64')).length
                                                        var buf = Buffer.alloc(convertbase64);
                                                        pdfSize = Buffer.byteLength(buf);
                                                        // เก็บ base64 ลงเครื่อง
                                                        // var now = new Date
                                                        var dtnow = await func_datetime.formatDate(now)
                                                        var pathbiz = path_local + '/' +'storage' +'/' + hederbiz + '/' + 'pdf' + '/' + dtnow + '/'
                                                        var pdfdata = base64
                                                        var hashpdf = await func_hash.sha512(base64)
                                                        var res_storageBase64 = await func_pdf.createfile_pdfsign_v1(pdfdata,hashpdf,pathbiz)
                                                        if (res_storageBase64[0] == 200){
                                                            path =  res_storageBase64[1].path
                                                            path_pdf_original = res_storageBase64[1].path_pdf
                                                            path_hash_original = res_storageBase64[1].path_pdfhash
                                                            path_pdf_sign = res_storageBase64[1].path_pdfsign
                                                            path_pdfhashsign = res_storageBase64[1].path_pdfhashsign
                                                            pdfSize = pdfSize
                                                            // var res_save_path = await actiontransaction.updatetransactiion_path(data_decry.db_connect,transaction_id,path_pdf_sign,path_pdfhashsign)
        
                                                        } else {
                                                            return [false,res_storageBase64[1]]
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        // ถ้าสถานะ Complete ถือว่า user ยืนยันการลงลายเซ็น
                                        if (status_update == 'Complete') {
                                            if (status_endtask === false || status_endtask === undefined) {
                                                if (action == 'e-sign' || action == 'input_sign') {
                                                    if (sign_info == null || sign_info == '') {
                                                        let tmperror = {
                                                            msg_thai : 'ไม่พบรายเซ็นของคุณ',
                                                            msg_eng : 'not found your signature.'
                                                        }
                                                        return [false,null,tmperror]
                                                    }
                                                    // ---jsonsign---
                                                    var res_signprocess = await func_sign_advance.jsonsigning(data_decry,transaction_id,step_cur,index_tran_db,sign_info,base64_from_genpdf)
                                                    // return[false,res_signprocess]
                                                    if (res_signprocess[0] == 200) {
                                                        if (ch_pdfsign == true) {
                                                            pdfData = res_signprocess[1].pdfData
                                                            if (pdfData == null || pdfData == '') {
                                                                let tmperror = {
                                                                    'msg_thai' : 'พบปัญหาในการบันทึก pdf',
                                                                    'msg_eng' : 'There was a problem recording pdf.'
                                                                }
                                                                return[false,null,tmperror]
                                                            }
                                                            hashpdfsign = await func_hash.sha512(pdfData)
                                                            // size base64
                                                            let convertbase64 = (Buffer.from(pdfData,'base64')).length
                                                            let buf = Buffer.alloc(convertbase64);
                                                            pdfSize = Buffer.byteLength(buf);
                                                            status_view_pdf = true
                                                        } 
                                                    } else {
                                                        return[false,res_signprocess[1],res_signprocess[2]]
                                                    } 
                                                    flow_doc[i].action_detail[k].sign_base64 = sign_info
                                                } else if (action == 'sign') {
                                                    // ยังไม่รองรับ
                                                    // return [false,res_signprocess]
                                                    // var res_signprocess = await sign_process.sign_pdf(transaction_id,step_cur,index_tran_db,sign_info,data_decry)
                                                }
                                            }
                                           
                                        }
                                    }
                                   
                                }
                            }
                            
                        }
                    }
                    if (change_status == false) {
                        let tmperror = {
                            'msg_thai' : 'ไม่สามารถอนุมัติเอกสารได้เนื่องจากไม่ใช่ลำดับการทำงานของคุณ',
                            'msg_eng' : 'The document could not be released because it is not your work order.'
                        } 
                        return [false,null,tmperror]
                    } 
                    index_infront = index_tran_db + 1
                    if (status_update != 'Draft' && flow_doc[i].status == 'Y') {
                        if (index_infront <= step_max) {
                            step_now = index_infront
                            status_implement = flow_doc[index_infront-1].status_implement
                            action_front = flow_doc[index_infront-1].action
                            flow_front = flow_doc[index_infront-1].flow
                            flow_doc[index_infront-1].status = 'W'
                            if (status_implement == false) {
                                // implement actor
                                var deptidindex_0 = flow_doc[0].actor[0].detp_id
                                var result_implement_actor = await func_implement_actor(data_decry,flow_doc[index_infront-1],input_info,deptidindex_0,now,color,doctype)
                                // console.log('result_implement_actor',result_implement_actor[2])
                                // return[false,result_implement_actor[1]]
                                if (result_implement_actor[0]) {
                                    flow_doc[index_infront-1] = result_implement_actor[1]
                                    color = result_implement_actor[2]
                                    if (flow_doc[index_infront-1].action_detail == 0) {
                                        // ลดลำดับ step_max 
                                        step_max = step_max - 1
                                        step_stop  =index_infront-1
                                        if (flow_doc[index_infront-1].action_detail.length == 0) {
                                            for(let p=step_max; p>=0; p--){
                                                if (p == step_stop) {
                                                    break
                                                }
                                                if (p > step_stop) {
                                                    flow_doc[p].index = flow_doc[p].index - 1
                                                }
                                            }
                                            let status_group_node_cut = flow_doc[index_infront-1].status_group_node
                                            flow_doc[(index_infront-1)-1].status_group_node = status_group_node_cut
                                            flow_doc.splice(index_infront-1,1)
                                            if (index_infront <= step_max) {
                                                flow_doc[index_infront-1].status = 'W'
                                                
                                            }
                                        }
                                    }
                                } else {
                                    return [false,'next step not implement actor or action_detail',result_implement_actor[2]]
                                }
                            }
                        }
                    }
                    if (action == 'input' || action == 'input_sign') {
                        ch_statusupdate_input = true
                    }
                   

                }
            }
        }
        var tmpreturn = {
            path :  path,
            path_pdf_original : path_pdf_original,
            path_hash_original : path_hash_original,
            path_pdf_sign : path_pdf_sign,
            path_pdfhashsign: path_pdfhashsign,
            pdfSize : pdfSize,
            flow : flow_doc,
            step_now: step_now,
            arrlog: arrlog,
            ch_statusupdate_input: ch_statusupdate_input,
            pdfData: pdfData,
            hashpdfsign: hashpdfsign,
            color: color, 
            step_max: step_max,
            reshtml: reshtml,
            input_info: input_info,
            hash_html: hash_html,
            status_view_pdf: status_view_pdf
        }
        return [true,tmpreturn]
    } catch (err) {
        console.log('err',err)
        return [false,null,err]
    }
}

module.exports = {
    func_check_statusdoc,
    func_implement_actor,
    checkStatus_actiondetail,
    checkStatus_transaction,
    update_actor,
    updateflowdoc_by_system
}