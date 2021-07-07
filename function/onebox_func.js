require('../config/lib')
require('../config/global')
require('../callAPI/axiosAPI')
const db_transaction = require('../database/transaction_log_onebox')

//API ที่ใช้ค้นหาบัชญีผู้ใช้ด้วย User id เพื่อดูว่าผู้ใช้นั้นๆอยู่ใน Business id อะไร
async function get_account_byuserid(access_token,account_id_ppl,connectiondb){
    try {
        var url = url_onebox + '/onebox_uploads/api/v2/get_account_byuserid'
        var payload = {
            accesstoken : access_token
        }
        var result_call = await Call.callPost_onebox(url,token_onebox,payload)
        var time_duration = result_call.time_duration
        if (result_call.msg.status == 'OK'){
            var result_insert_log = db_transaction.insert_transaction_onebox_service(connectiondb, null, payload, result_call.msg, result_call.msg.status, url,time_duration,account_id_ppl)
            return [true,result_call.msg]
        }
        else{
            var result_insert_log = db_transaction.insert_transaction_onebox_service(connectiondb, null, payload, result_call.msg, result_call.msg.status, url,time_duration,account_id_ppl)
            return [false,result_call.msg]
        }
        
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

// API ใช้สำหรับการค้นหา folder ในหน้าหลัก
async function get_mainfolder_byaccountid(account_id,account_id_ppl,connectiondb){
    try {
        var url = url_onebox + '/onebox_uploads/api/get_mainfolder_byaccountid'
        var payload = {
            account_id : account_id
        }
        var result_call = await Call.callPost_onebox(url,token_onebox,payload)
        var time_duration = result_call.time_duration
        if (result_call.msg.status == 'OK'){
            var result_insert_log = db_transaction.insert_transaction_onebox_service(connectiondb, account_id, payload, result_call.msg, result_call.msg.status, url,time_duration,account_id_ppl)

            return [true,result_call.msg]
        }
        else{
            var result_insert_log = db_transaction.insert_transaction_onebox_service(connectiondb, account_id, payload, result_call.msg, result_call.msg.status, url,time_duration,account_id_ppl)
            return [false,result_call.msg]
        }
        
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

// API ใช้สำหรับการค้นหา folder ย่อย
async function get_subfolder_onebox(account_id,folder_id,account_id_ppl,connectiondb){
    try {
        var url = url_onebox + '/onebox_uploads/api/get_subfolder'
        var payload = {
            account_id : account_id,
            folder_id : folder_id
        }
        var result_call = await Call.callPost_onebox(url,token_onebox,payload)
        var time_duration = result_call.time_duration
        if (result_call.msg.status == 'OK'){
            var result_insert_log = db_transaction.insert_transaction_onebox_service(connectiondb, account_id, payload, result_call.msg, result_call.msg.status, url,time_duration,account_id_ppl)
            return [true,result_call.msg]
        }
        else{
            var result_insert_log = db_transaction.insert_transaction_onebox_service(connectiondb, account_id, payload, result_call.msg, result_call.msg.status, url,time_duration,account_id_ppl)
            return [false,result_call.msg]
        }
        
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

//API ใช้สำหรับเซฟไฟล์มาเก็บไว้ที่ One Box
async function create_folder_onebox(account_id,parent_folder_id,folder_name,connectiondb){
    try {
        var url = url_onebox + '/onebox_uploads/api/create_folder'
        var payload = {
            account_id : account_id,
            parent_folder_id : parent_folder_id,
            folder_name : folder_name
        }
        var result_call = await Call.callPost_onebox(url,token_onebox,payload)
        var time_duration = result_call.time_duration
        if (result_call.msg.status == 'OK'){
            var result_insert_log = db_transaction.insert_transaction_onebox_service(connectiondb, account_id, payload, result_call.msg, result_call.msg.status, url,time_duration,account_id_ppl)
            return [true,result_call.msg]
        }
        else{
            var result_insert_log = db_transaction.insert_transaction_onebox_service(connectiondb, account_id, payload, result_call.msg, result_call.msg.status, url,time_duration,account_id_ppl)
            return [false,result_call.msg]
        }
        
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

//API ใช้สำหรับสร้างและกำหนดสิทธิ์ให้กับโฟลเดอร์
async function create_folder_with_permission(account_id,folder_name,business_id_to_setting,account_id_to_setting,department_id_to_setting,parent_folder_id,account_id_ppl,connectiondb){
    try {
        var url = url_onebox + '/onebox_uploads/api/create_folder_with_permission'
        var payload = {
            account_id : account_id,
            folder_name : folder_name,
            business_id_to_setting : business_id_to_setting,
            account_id_to_setting : account_id_to_setting,
            department_id_to_setting : department_id_to_setting,
            parent_folder_id : parent_folder_id
        }
        var result_call = await Call.callPost_onebox(url,token_onebox,payload)
        var time_duration = result_call.time_duration
        if (result_call.msg.status == 'OK'){
            var result_insert_log = db_transaction.insert_transaction_onebox_service(connectiondb, account_id, payload, result_call.msg, result_call.msg.status, url,time_duration,account_id_ppl)
            return [true,result_call.msg]
        }
        else{
            var result_insert_log = db_transaction.insert_transaction_onebox_service(connectiondb, account_id, payload, result_call.msg, result_call.msg.status, url,time_duration,account_id_ppl)
            return [false,result_call.msg]
        }
        
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

// API ใช้สำหรับกำหนดสิทธิ์ให้กับโฟลเดอร์
async function setting_folder_permission(account_id,folder_id,business_id_to_setting,account_id_to_setting,department_id_to_setting,connectiondb){
    try {
        var url = url_onebox + '/onebox_uploads/api/setting_folder_permission'
        var payload = {
            account_id : account_id,
            folder_id : folder_id,
            business_id_to_setting : business_id_to_setting,
            account_id_to_setting : account_id_to_setting,
            department_id_to_setting : department_id_to_setting
        }
        var result_call = await Call.callPost_onebox(url,token_onebox,payload)
        var time_duration = result_call.time_duration
        if (result_call.msg.status == 'OK'){
            var result_insert_log = db_transaction.insert_transaction_onebox_service(connectiondb, account_id, payload, result_call.msg, result_call.msg.status, url,time_duration,account_id_ppl)
            return [true,result_call.msg]
        }
        else{
            var result_insert_log = db_transaction.insert_transaction_onebox_service(connectiondb, account_id, payload, result_call.msg, result_call.msg.status, url,time_duration,account_id_ppl)
            return [false,result_call.msg]
        }
        
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

// API ใช้สำหรับเซฟไฟล์มาเก็บไว้ที่ One Box แบบ base64
async function savefile_base64_onebox(account_id,fileName,fileExtension,base64,folder_id,account_id_ppl,connectiondb){
    try {
        var url = url_onebox + '/onebox_uploads/api/save_base64'
        var payload = {
            account_id : account_id,
            fileName : fileName,
            fileExtension : fileExtension,
            base64 : base64,
            folder_id : folder_id
        }
        var result_call = await Call.callPost_onebox(url,token_onebox,payload)
        var time_duration = result_call.time_duration
        if (result_call.msg.status == 'OK'){
            var result_insert_log = db_transaction.insert_transaction_onebox_service(connectiondb, account_id, payload, result_call.msg, result_call.msg.status, url,time_duration,account_id_ppl)
            return [true,result_call.msg]
        }
        else{
            var result_insert_log = db_transaction.insert_transaction_onebox_service(connectiondb, account_id, payload, result_call.msg, result_call.msg.status, url,time_duration,account_id_ppl)
            return [false,result_call.msg]
        }
        
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

// API ใช้สำหรับเซฟไฟล์มาเก็บไว้ที่ One Box แบบ file
async function savefile_onebox(account_id,folder_id,files,account_id_ppl,connectiondb){
    try {
        var url = url_onebox + '/onebox_uploads/api/savefile'
        // var payload = {
        //     account_id : account_id,
        //     folder_id : folder_id,
        //     file : files
        // }
        // var result_call = await Call.callPost_onebox(url,token_onebox,payload)
        
        let formData = new FormData();
        formData.append('file', files);
        formData.append('account_id',account_id);
        formData.append('folder_id',folder_id);
        // console.log('formData:',formData)
        var result_call = await Call.callPost_formdata_onebox(url,token_onebox,formData)
        // console.log('result_call:',result_call)
        var time_duration = result_call.time_duration
        if (result_call.msg.status == 'OK'){
            // var result_insert_log = db_transaction.insert_transaction_onebox_service(connectiondb, account_id, payload, result_call.msg, result_call.msg.status, url,time_duration,account_id_ppl)
            return [true,result_call.msg]
        }
        else{
            // var result_insert_log = db_transaction.insert_transaction_onebox_service(connectiondb, account_id, payload, result_call.msg, result_call.msg.status, url,time_duration,account_id_ppl)
            return [false,result_call.msg]
        }
        
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

//API check ว่ามี Folder นั้นๆอยู่ไหม ของ Private main folder
async function check_folder_in(account_id,list_data,name_main,name_find,account_id_ppl,connectiondb){
    try {
        var list_fol_name = []
        var fol_paperless_v2_id = null
        var result_get_main_fol = list_data
        // 1. ***** เช็คว่ามีโฟลเดอร์ paperless_v2 อยู่ใน onebox หน้าแรกไหม *****
        await result_get_main_fol.forEach(element => 
            list_fol_name.push(element.folder_name) // list ของชื่อโฟลเดอร์
        )
        // console.log('list_fol_name:',list_fol_name)
        let index = result_get_main_fol.findIndex(function(item, i){
            return item.folder_name === name_main // หา index ตัวที่ folder_name = Private Main Folder, ชื่อ biz
        });
        // console.log('index:',index)
        let parent_folder_id = result_get_main_fol[index].folder_id // folder_id ของ Private Main Folder(หน้าแรก) , ชื่อ biz
        // console.log('parent_folder_id:',parent_folder_id)
        // เช็คว่ามี folder paperless_v2 ไหม
        if (!(list_fol_name.includes(name_find))){ // ถ้าไม่มี folder paperless_v2 ให้ทำการสร้างใน Private Main Folder(หน้าแรก)
            let result_create_folder = await create_folder_with_permission(account_id,name_find,'05',[],[],parent_folder_id,account_id_ppl,connectiondb)
            // console.log('result_create_folder:',result_create_folder)
            if (result_create_folder[0] == true){
                fol_paperless_v2_id = result_create_folder[1].data.folder_id
            }
            else{
                return [false,result_create_folder[1]]
            }
        }
        else{
            let index_ppl2 = result_get_main_fol.findIndex(function(item, i){
                return item.folder_name === name_find // หา index ตัวที่ folder_name = paperless_v2
            });
            fol_paperless_v2_id = result_get_main_fol[index_ppl2].folder_id
        }
        return [true,fol_paperless_v2_id]
        
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

async function check_folder_in_biz(account_id,list_data,name_main,name_find,account_id_ppl,connectiondb){
    try {
        var list_fol_name = []
        var list_fol_name_sub = []
        var fol_paperless_v2_id = null
        var result_get_main_fol = list_data
        // 1. ***** เช็คว่ามีโฟลเดอร์ paperless_v2 อยู่ใน onebox หน้าแรกไหม *****
        await result_get_main_fol.forEach(element => 
            list_fol_name.push(element.folder_name) // list ของชื่อโฟลเดอร์
        )
        // console.log('list_fol_name:',list_fol_name)
        let index = result_get_main_fol.findIndex(function(item, i){
            return item.folder_name === name_main // หา index ตัวที่ folder_name = Private Main Folder, ชื่อ biz
        });
        // console.log('index:',index)
        let parent_folder_id = result_get_main_fol[index].folder_id // folder_id ของ Private Main Folder(หน้าแรก) , ชื่อ biz
        // console.log('parent_folder_id:',parent_folder_id)
        var result_fol_biz = await get_subfolder_onebox(account_id,parent_folder_id,account_id_ppl,connectiondb)
        // console.log('result_fol_biz:',result_fol_biz[1])
        if (result_fol_biz[0] == true){
            // เช็คว่ามี folder paperless_v2 ไหม
            var result_get_sub_fol = result_fol_biz[1].result
            await result_get_sub_fol.forEach(element => 
                list_fol_name_sub.push(element.folder_name) // list ของชื่อโฟลเดอร์
            )
            if (!(list_fol_name_sub.includes(name_find))){ // ถ้าไม่มี folder paperless_v2 ให้ทำการสร้างใน folder biz
                let result_create_folder = await create_folder_with_permission(account_id,name_find,'05',[],[],parent_folder_id,account_id_ppl,connectiondb)
                // console.log('result_create_folder:',result_create_folder)
                if (result_create_folder[0] == true){
                    fol_paperless_v2_id = result_create_folder[1].data.folder_id
                }
                else{
                    return [false,result_create_folder[1]]
                }
            }
            else{
                let index_ppl2 = result_get_sub_fol.findIndex(function(item, i){
                    return item.folder_name === name_find // หา index ตัวที่ folder_name = paperless_v2
                });
                fol_paperless_v2_id = result_get_sub_fol[index_ppl2].folder_id
            }
            return [true,fol_paperless_v2_id]
        }
        else{
            let result_create_folder = await create_folder_with_permission(account_id,name_find,'05',[],[],parent_folder_id,account_id_ppl,connectiondb)
                // console.log('result_create_folder:',result_create_folder)
                if (result_create_folder[0] == true){
                    fol_paperless_v2_id = result_create_folder[1].data.folder_id
                }
                else{
                    return [false,result_create_folder[1]]
                }
        }
        
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

// API check ว่ามี Folder นั้นๆอยู่ไหม ของ folder อื่น
async function check_folder_in_other(account_id,list_data,parent_folder_id,name_find,account_id_ppl,connectiondb){
    try {
        list_fol_name = []
        var fol_paperless_v2_id = null
        var result_get_main_fol = list_data
        // 1. ***** เช็คว่ามีโฟลเดอร์ paperless_v2 อยู่ใน onebox หน้าแรกไหม *****
        await result_get_main_fol.forEach(element => 
            list_fol_name.push(element.folder_name) // list ของชื่อโฟลเดอร์
        )
        // console.log('list_fol_name:',list_fol_name)
        
        // เช็คว่ามี folder paperless_v2 ไหม
        if (!(list_fol_name.includes(name_find))){ // ถ้าไม่มี folder paperless_v2 ให้ทำการสร้างใน Private Main Folder(หน้าแรก)
            let result_create_folder = await create_folder_with_permission(account_id,name_find,'05',[],[],parent_folder_id,account_id_ppl,connectiondb)
            // console.log('result_create_folder:',result_create_folder)
            if (result_create_folder[0] == true){
                fol_paperless_v2_id = result_create_folder[1].data.folder_id
            }
            else{
                return [false,result_create_folder[1]]
            }
        }
        else{
            let index_ppl2 = result_get_main_fol.findIndex(function(item, i){
                return item.folder_name === name_find // หา index ตัวที่ folder_name = paperless_v2
            });
            fol_paperless_v2_id = result_get_main_fol[index_ppl2].folder_id
        }
        return [true,fol_paperless_v2_id]
        
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

module.exports = {
    get_account_byuserid,
    get_mainfolder_byaccountid,
    get_subfolder_onebox,
    create_folder_onebox,
    create_folder_with_permission,
    setting_folder_permission,
    savefile_base64_onebox,
    check_folder_in,
    check_folder_in_other,
    check_folder_in_biz,
    savefile_onebox
}
