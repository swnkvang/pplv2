require('../config/lib')
require('../config/global')
require('../callAPI/axiosAPI')
const onebox_func = require('../function/onebox_func')
const db_select = require('../database/db_select')
const {
    connonsql
} = require('../config/mongo_db')

async function process_savefile_base64_onebox_test(transaction_id,account_id,folder_id,connectiondb){
    try {
        // if (connectiondb != null) {await connonsql(connectiondb)}
        var result_select = await db_select.find_file_document_transaction(transaction_id,connectiondb)
        if (result_select[0] == true){
            let document_id = result_select[1].document_id
            let doctype = result_select[1].doctype
            let doctype_name = result_select[1].doctype_name
            let path_pdf_sign = result_select[1].path_pdf_sign
            let fileName = result_select[1].subject
            var result_readfile = await fs.readFileSync(path_pdf_sign, 'utf-8')
            let base64_str = result_readfile
            var result_savefile = await onebox_func.savefile_base64_onebox(account_id,fileName,'pdf',base64_str,folder_id)
            return [true,result_savefile]
        }
        else{
            return [false,result_select[1]]
        }
        
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

async function process_savefile_onebox_test(transaction_id,account_id,folder_id,account_id_ppl,connectiondb){
    try {
        // if (connectiondb != null) {await connonsql(connectiondb)}
        var result_select = await db_select.find_file_attach(transaction_id,connectiondb)
        // console.log('result_select:',result_select)
        if (result_select[0] == true){
            
            let detail = result_select[1].detail
            for (let i =0 ; i<detail.length ; i++){
                let path_file_now =  detail[i].path_file
                let file_name = (detail[i].file_name).split('.')[0]
                let type_file = (detail[i].file_name).split('.')[1]
                var result_readfile = fs.readFileSync(path_file_now,{encoding: 'base64'})
                console.log('path_file_now:',path_file_now)
                console.log('file_name:',file_name)
                console.log('type_file:',type_file)
                var result_savefile = await onebox_func.savefile_base64_onebox(account_id,file_name,'pdf',result_readfile,folder_id,account_id_ppl,connectiondb)

            }

            return [true,result_savefile]
        }
        else{
            return [false,result_select[1]]
        }
        
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

// Save file ลง onebox folder paperless
async function process_savefile_base64_onebox(transaction_id,access_token,account_id_ppl,connectiondb){
    try {
        // if (connectiondb != null) {await connonsql(connectiondb)}
        let tax_id = connectiondb.t
        var check_save = false
        var fol_paperless_v2_id = null
        var fol_in_for_id = null
        var name_main = 'Private Main Folder'
        
        // find เอกสาร
        var result_select = await db_select.find_file_document_transaction(transaction_id,connectiondb)
        if (result_select[0] == true){
            var document_id = result_select[1].document_id
            let doctype = result_select[1].doctype
            let doctype_name = result_select[1].doctype_name
            let path_pdf_sign = result_select[1].path_pdf_sign
            var fileName = result_select[1].subject
            var result_readfile = await fs.readFileSync(path_pdf_sign, 'utf-8')
            var base64_str = result_readfile
            var doc_type_name_fol = doctype + '_' + doctype_name
            // console.log('doc_type_name_fol:',doc_type_name_fol)
        }
        else{
            return [false,result_select[1]]
        }
        var list_fol_name = ['ประเภทเอกสาร',doc_type_name_fol,document_id]
        var result_get_account = await onebox_func.get_account_byuserid(access_token,account_id_ppl,connectiondb) // get account onebox ของ user
        // console.log('result_get_account:',result_get_account[1])
        if (result_get_account[0] == true){
            // console.log('result_get_account:',result_get_account[1])
            let result_account = result_get_account[1].result
            for (let i=0 ; i<result_account.length ; i++){
                if (result_account[i].taxid == tax_id){
                    let account_id = String(result_account[i].account_id)
                    var result_main_folder = await onebox_func.get_mainfolder_byaccountid(account_id,account_id_ppl,connectiondb) // get main folder ของ user
                    // console.log('result_main_folder:',result_main_folder[1])
                    if (result_main_folder[0] == true){
                        let result_get_main_fol = result_main_folder[1].result
                        if (result_get_main_fol.length == 0){ // ถ้า main folder เป็น []
                            let index = result_get_main_fol.findIndex(function(item, i){
                                return item.folder_name === name_main // หา index ตัวที่ folder_name = Private Main Folder
                            });
                            let parent_folder_id = result_get_main_fol[index].folder_id
                            // สร้าง folder paperless_v2
                            let result_create_folder = await onebox_func.create_folder_with_permission(account_id,'paperless_v2','05',[],[],parent_folder_id,account_id_ppl,connectiondb)
                            if (result_create_folder[0] == true){
                                fol_paperless_v2_id = result_create_folder[1].data.folder_id
                            }
                            else{
                                return [false,result_create_folder[1]]
                            }
                        }
                        else{
                            // เช็คว่ามี folder paperless_v2 อยู่ใน Private Main Folder ไหม
                            var result_check_folder = await onebox_func.check_folder_in(account_id,result_get_main_fol,'Private Main Folder','paperless_v2',account_id_ppl,connectiondb)
                            // console.log('result_check_folder:',result_check_folder)
                        }
                        if (result_check_folder[0] == true){
                            fol_paperless_v2_id = result_check_folder[1]
                            // var result_get_sub_folder = await onebox_func.get_subfolder_onebox(account_id,fol_paperless_v2_id) // get sub folder
                            // console.log('result_get_sub_folder:',result_get_sub_folder[1])
                            // if ((result_get_sub_folder[1].result.length) == 0){ // ถ้า sub folder นั้นเป็น []
                            //     // สร้างโฟลเดอร์ประเภทเอกสาร
                            //     let result_create_folder_type_doc = await onebox_func.create_folder_with_permission(account_id,'ประเภทเอกสาร','05',[],[],fol_paperless_v2_id)
                            //     console.log('result_create_folder_type_doc:',result_create_folder_type_doc)
                            //     fol_doc_type_id = result_create_folder_type_doc[1].data.folder_id
                            // }
                            // else{
                            //     // เช็คโฟลเดอร์ประเภทเอกสาร
                            //     var result_check_folder_type_doc = await onebox_func.check_folder_in_other(result_get_sub_folder[1].result,fol_paperless_v2_id,'ประเภทเอกสาร')
                            //     console.log('result_check_folder_type_doc:',result_check_folder_type_doc)
                            //     fol_doc_type_id = result_check_folder_type_doc[1]
                            // }
                            // console.log('fol_doc_type_id:',fol_doc_type_id)
                            for (let k=0 ; k<list_fol_name.length;k++){
                                var result_get_sub_folder = await onebox_func.get_subfolder_onebox(account_id,fol_paperless_v2_id,account_id_ppl,connectiondb) // get sub folder
                                // console.log('result_get_sub_folder:',result_get_sub_folder[1])
                                if ((result_get_sub_folder[1].result.length) == 0){ // ถ้า sub folder นั้นเป็น []
                                    // สร้างโฟลเดอร์ประเภทเอกสาร
                                    let result_create_folder_type_doc = await onebox_func.create_folder_with_permission(account_id,list_fol_name[k],'05',[],[],fol_paperless_v2_id,account_id_ppl,connectiondb)
                                    // console.log('result_create_folder_type_doc:',result_create_folder_type_doc)
                                    fol_in_for_id = result_create_folder_type_doc[1].data.folder_id
                                }
                                else{
                                    // เช็คโฟลเดอร์ประเภทเอกสาร
                                    var result_check_folder_type_doc = await onebox_func.check_folder_in_other(account_id,result_get_sub_folder[1].result,fol_paperless_v2_id,list_fol_name[k],account_id_ppl,connectiondb)
                                    // console.log('result_check_folder_type_doc:',result_check_folder_type_doc)
                                    fol_in_for_id = result_check_folder_type_doc[1]
                                }
                                // console.log('fol_in_for_id:',fol_in_for_id)
                                fol_paperless_v2_id = fol_in_for_id
                                if (k == list_fol_name.length - 1){
                                    var result_savefile = await onebox_func.savefile_base64_onebox(account_id,fileName,'pdf',base64_str,fol_paperless_v2_id,account_id_ppl,connectiondb)
                                    check_save = true
                                }
                            }
                            if (check_save == true){
                                return [true,result_savefile[1]]
                            }
                            if (check_save == false){
                                return [true,'Save file fails']
                            }
                            
                        }
                        else{
                            return [false,result_get_sub_folder[1]]
                        }
                    }
                    else{
                        return [false,result_main_folder[1]]
                    }
                    
                }
            }

        }
        else{
            return [false,result_get_account[1]]
        }
        
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

async function process_savefile_base64_onebox_biz(transaction_id,access_token,biz_name,account_id_ppl,connectiondb){
    try {
        // if (connectiondb != null) {await connonsql(connectiondb)}
        // console.log('connectiondb:',connectiondb)
        let tax_id = connectiondb.t
        var check_save = false
        var fol_paperless_v2_id = null
        var fol_in_for_id = null
        var name_main = biz_name
        // find เอกสาร
        var result_select = await db_select.find_file_document_transaction(transaction_id,connectiondb)
        if (result_select[0] == true){
            var document_id = result_select[1].document_id
            let doctype = result_select[1].doctype
            let doctype_name = result_select[1].doctype_name
            let path_pdf_sign = result_select[1].path_pdf_sign
            var fileName = result_select[1].subject
            var result_readfile = await fs.readFileSync(path_pdf_sign, 'utf-8')
            var base64_str = result_readfile
            var doc_type_name_fol = doctype + '_' + doctype_name
            // console.log('doc_type_name_fol:',doc_type_name_fol)
        }
        else{
            return [false,result_select[1]]
        }
        var list_fol_name = ['ประเภท',doc_type_name_fol,document_id]
        var result_get_account = await onebox_func.get_account_byuserid(access_token,account_id_ppl,connectiondb) // get account onebox ของ user
        if (result_get_account[0] == true){
            // console.log('result_get_account:',result_get_account[1])
            let result_account = result_get_account[1].result
            for (let i=0 ; i<result_account.length ; i++){
                if (result_account[i].taxid == tax_id){
                    let account_id = String(result_account[i].account_id)
                    var result_main_folder = await onebox_func.get_mainfolder_byaccountid(account_id,account_id_ppl,connectiondb) // get main folder ของ user
                    
                    if (result_main_folder[0] == true){
                        let result_get_main_fol = result_main_folder[1].result
                        if (result_get_main_fol.length == 0){ // ถ้า main folder เป็น []
                            let index = result_get_main_fol.findIndex(function(item, i){
                                return item.folder_name === name_main // หา index ตัวที่ folder_name = Private Main Folder
                            });
                            let parent_folder_id = result_get_main_fol[index].folder_id
                            // สร้าง folder paperless_v2
                            let result_create_folder = await onebox_func.create_folder_with_permission(account_id,'paperless_v2','05',[],[],parent_folder_id,account_id_ppl,connectiondb)
                            if (result_create_folder[0] == true){
                                fol_paperless_v2_id = result_create_folder[1].data.folder_id
                            }
                            else{
                                return [false,result_create_folder[1]]
                            }
                        }
                        else{
                            // เช็คว่ามี folder paperless_v2 อยู่ใน Private Main Folder ไหม
                            var result_check_folder = await onebox_func.check_folder_in_biz(account_id,result_get_main_fol,name_main,'paperless_v2',account_id_ppl,connectiondb)
                            // console.log('result_check_folder:',result_check_folder)
                        }
                        if (result_check_folder[0] == true){
                            fol_paperless_v2_id = result_check_folder[1]
                            // var result_get_sub_folder = await onebox_func.get_subfolder_onebox(account_id,fol_paperless_v2_id) // get sub folder
                            // console.log('result_get_sub_folder:',result_get_sub_folder[1])
                            // if ((result_get_sub_folder[1].result.length) == 0){ // ถ้า sub folder นั้นเป็น []
                            //     // สร้างโฟลเดอร์ประเภทเอกสาร
                            //     let result_create_folder_type_doc = await onebox_func.create_folder_with_permission(account_id,'ประเภทเอกสาร','05',[],[],fol_paperless_v2_id)
                            //     console.log('result_create_folder_type_doc:',result_create_folder_type_doc)
                            //     fol_doc_type_id = result_create_folder_type_doc[1].data.folder_id
                            // }
                            // else{
                            //     // เช็คโฟลเดอร์ประเภทเอกสาร
                            //     var result_check_folder_type_doc = await onebox_func.check_folder_in_other(result_get_sub_folder[1].result,fol_paperless_v2_id,'ประเภทเอกสาร')
                            //     console.log('result_check_folder_type_doc:',result_check_folder_type_doc)
                            //     fol_doc_type_id = result_check_folder_type_doc[1]
                            // }
                            // console.log('fol_doc_type_id:',fol_doc_type_id)
                            for (let k=0 ; k<list_fol_name.length;k++){
                                var result_get_sub_folder = await onebox_func.get_subfolder_onebox(account_id,fol_paperless_v2_id,account_id_ppl,connectiondb) // get sub folder
                                // console.log('result_get_sub_folder:',result_get_sub_folder[1])
                                if ((result_get_sub_folder[1].result.length) == 0){ // ถ้า sub folder นั้นเป็น []
                                    // สร้างโฟลเดอร์ประเภทเอกสาร
                                    let result_create_folder_type_doc = await onebox_func.create_folder_with_permission(account_id,list_fol_name[k],'05',[],[],fol_paperless_v2_id,account_id_ppl,connectiondb)
                                    // console.log('result_create_folder_type_doc:',result_create_folder_type_doc)
                                    fol_in_for_id = result_create_folder_type_doc[1].data.folder_id
                                }
                                else{
                                    // เช็คโฟลเดอร์ประเภทเอกสาร
                                    var result_check_folder_type_doc = await onebox_func.check_folder_in_other(account_id,result_get_sub_folder[1].result,fol_paperless_v2_id,list_fol_name[k],account_id_ppl,connectiondb)
                                    // console.log('result_check_folder_type_doc:',result_check_folder_type_doc)
                                    fol_in_for_id = result_check_folder_type_doc[1]
                                }
                                // console.log('fol_in_for_id:',fol_in_for_id)
                                fol_paperless_v2_id = fol_in_for_id
                                if (k == list_fol_name.length - 1){
                                    var result_savefile = await onebox_func.savefile_base64_onebox(account_id,fileName,'pdf',base64_str,fol_paperless_v2_id,account_id_ppl,connectiondb)
                                    check_save = true
                                }
                            }
                            if (check_save == true){
                                return [true,result_savefile[1]]
                            }
                            if (check_save == false){
                                return [true,'Save file fails']
                            }
                            
                        }
                        else{
                            return [false,result_get_sub_folder[1]]
                        }
                    }
                    else{
                        return [false,result_main_folder[1]]
                    }
                    
                }
            }

        }
        else{
            return [false,result_get_account[1]]
        }
        
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

//รวมการเซฟทั้ง 2 ที่
async function process_savefile_base64_onebox_all(transaction_id,access_token,biz_name,account_id_ppl,connectiondb){
    try {
        const [b, c] = await Promise.all([process_savefile_base64_onebox(transaction_id,access_token,account_id_ppl,connectiondb), process_savefile_base64_onebox_biz(transaction_id,access_token,biz_name,account_id_ppl,connectiondb)]);
        return [true,'success']
        
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

// save ไฟล์แนบ
async function process_save_attachfile_base64_onebox(transaction_id,access_token,account_id_ppl,connectiondb){
    try {
        // if (connectiondb != null) {await connonsql(connectiondb)}
        let tax_id = connectiondb.t
        var check_save = false
        var fol_paperless_v2_id = null
        var fol_in_for_id = null
        var name_main = 'Private Main Folder'
        
        // find เอกสาร
        var result_select = await db_select.find_file_document_transaction(transaction_id,connectiondb)
        if (result_select[0] == true){
            var document_id = result_select[1].document_id
            let doctype = result_select[1].doctype
            let doctype_name = result_select[1].doctype_name
            let path_pdf_sign = result_select[1].path_pdf_sign
            var fileName = result_select[1].subject

            var result_readfile = await fs.readFileSync(path_pdf_sign, 'utf-8')
            var base64_str = result_readfile
            var doc_type_name_fol = doctype + '_' + doctype_name
            // console.log('doc_type_name_fol:',doc_type_name_fol)
        }
        else{
            return [false,result_select[1]]
        }
        var list_fol_name = ['ประเภทเอกสาร',doc_type_name_fol,document_id,'attach_folder']
        var result_get_account = await onebox_func.get_account_byuserid(access_token,account_id_ppl,connectiondb) // get account onebox ของ user
        // console.log('result_get_account:',result_get_account[1])
        if (result_get_account[0] == true){
            // console.log('result_get_account:',result_get_account[1])
            let result_account = result_get_account[1].result
            for (let i=0 ; i<result_account.length ; i++){
                if (result_account[i].taxid == tax_id){
                    let account_id = String(result_account[i].account_id)
                    var result_main_folder = await onebox_func.get_mainfolder_byaccountid(account_id,account_id_ppl,connectiondb) // get main folder ของ user
                    // console.log('result_main_folder:',result_main_folder[1])
                    if (result_main_folder[0] == true){
                        let result_get_main_fol = result_main_folder[1].result
                        if (result_get_main_fol.length == 0){ // ถ้า main folder เป็น []
                            let index = result_get_main_fol.findIndex(function(item, i){
                                return item.folder_name === name_main // หา index ตัวที่ folder_name = Private Main Folder
                            });
                            let parent_folder_id = result_get_main_fol[index].folder_id
                            // สร้าง folder paperless_v2
                            let result_create_folder = await onebox_func.create_folder_with_permission(account_id,'paperless_v2','05',[],[],parent_folder_id,account_id_ppl,connectiondb)
                            if (result_create_folder[0] == true){
                                fol_paperless_v2_id = result_create_folder[1].data.folder_id
                            }
                            else{
                                return [false,result_create_folder[1]]
                            }
                        }
                        else{
                            // เช็คว่ามี folder paperless_v2 อยู่ใน Private Main Folder ไหม
                            var result_check_folder = await onebox_func.check_folder_in(account_id,result_get_main_fol,'Private Main Folder','paperless_v2',account_id_ppl,connectiondb)
                            // console.log('result_check_folder:',result_check_folder)
                        }
                        if (result_check_folder[0] == true){
                            fol_paperless_v2_id = result_check_folder[1]
                            // var result_get_sub_folder = await onebox_func.get_subfolder_onebox(account_id,fol_paperless_v2_id) // get sub folder
                            // console.log('result_get_sub_folder:',result_get_sub_folder[1])
                            // if ((result_get_sub_folder[1].result.length) == 0){ // ถ้า sub folder นั้นเป็น []
                            //     // สร้างโฟลเดอร์ประเภทเอกสาร
                            //     let result_create_folder_type_doc = await onebox_func.create_folder_with_permission(account_id,'ประเภทเอกสาร','05',[],[],fol_paperless_v2_id)
                            //     console.log('result_create_folder_type_doc:',result_create_folder_type_doc)
                            //     fol_doc_type_id = result_create_folder_type_doc[1].data.folder_id
                            // }
                            // else{
                            //     // เช็คโฟลเดอร์ประเภทเอกสาร
                            //     var result_check_folder_type_doc = await onebox_func.check_folder_in_other(result_get_sub_folder[1].result,fol_paperless_v2_id,'ประเภทเอกสาร')
                            //     console.log('result_check_folder_type_doc:',result_check_folder_type_doc)
                            //     fol_doc_type_id = result_check_folder_type_doc[1]
                            // }
                            // console.log('fol_doc_type_id:',fol_doc_type_id)
                            for (let k=0 ; k<list_fol_name.length;k++){
                                var result_get_sub_folder = await onebox_func.get_subfolder_onebox(account_id,fol_paperless_v2_id,account_id_ppl,connectiondb) // get sub folder
                                // console.log('result_get_sub_folder:',result_get_sub_folder[1])
                                if ((result_get_sub_folder[1].result.length) == 0){ // ถ้า sub folder นั้นเป็น []
                                    // สร้างโฟลเดอร์ประเภทเอกสาร
                                    let result_create_folder_type_doc = await onebox_func.create_folder_with_permission(account_id,list_fol_name[k],'05',[],[],fol_paperless_v2_id,account_id_ppl,connectiondb)
                                    // console.log('result_create_folder_type_doc:',result_create_folder_type_doc)
                                    fol_in_for_id = result_create_folder_type_doc[1].data.folder_id
                                }
                                else{
                                    // เช็คโฟลเดอร์ประเภทเอกสาร
                                    var result_check_folder_type_doc = await onebox_func.check_folder_in_other(account_id,result_get_sub_folder[1].result,fol_paperless_v2_id,list_fol_name[k],account_id_ppl,connectiondb)
                                    // console.log('result_check_folder_type_doc:',result_check_folder_type_doc)
                                    fol_in_for_id = result_check_folder_type_doc[1]
                                }
                                // console.log('fol_in_for_id:',fol_in_for_id)
                                fol_paperless_v2_id = fol_in_for_id
                                if (k == list_fol_name.length - 1){
                                    var result_select_att = await db_select.find_file_attach(transaction_id,connectiondb)
                                    let detail = result_select_att[1].detail
                                    for (let i =0 ; i<detail.length ; i++){
                                        let path_file_now =  detail[i].path_file
                                        let file_name = (detail[i].file_name).split('.')[0]
                                        let type_file = (detail[i].file_name).split('.')[1]
                                        var result_readfile = fs.readFileSync(path_file_now,{encoding: 'base64'})
                                        console.log('path_file_now:',path_file_now)
                                        console.log('file_name:',file_name)
                                        console.log('type_file:',type_file)
                                        var result_savefile = await onebox_func.savefile_base64_onebox(account_id,file_name,'pdf',result_readfile,fol_paperless_v2_id,account_id_ppl,connectiondb)
                        
                                    }
                                    // var result_savefile = await onebox_func.savefile_base64_onebox(account_id,fileName,'pdf',base64_str,fol_paperless_v2_id,account_id_ppl,connectiondb)
                                    check_save = true
                                }
                            }
                            if (check_save == true){
                                return [true,result_savefile[1]]
                            }
                            if (check_save == false){
                                return [true,'Save file fails']
                            }
                            
                        }
                        else{
                            return [false,result_get_sub_folder[1]]
                        }
                    }
                    else{
                        return [false,result_main_folder[1]]
                    }
                    
                }
            }

        }
        else{
            return [false,result_get_account[1]]
        }
        
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

// save ไฟล์แนบ ใน biz
async function process_save_attachfile_base64_onebox_biz(transaction_id,access_token,biz_name,account_id_ppl,connectiondb){
    try {
        // if (connectiondb != null) {await connonsql(connectiondb)}
        // console.log('connectiondb:',connectiondb)
        let tax_id = connectiondb.t
        var check_save = false
        var fol_paperless_v2_id = null
        var fol_in_for_id = null
        var name_main = biz_name
        // find เอกสาร
        var result_select = await db_select.find_file_document_transaction(transaction_id,connectiondb)
        if (result_select[0] == true){
            var document_id = result_select[1].document_id
            let doctype = result_select[1].doctype
            let doctype_name = result_select[1].doctype_name
            let path_pdf_sign = result_select[1].path_pdf_sign
            var fileName = result_select[1].subject
            var result_readfile = await fs.readFileSync(path_pdf_sign, 'utf-8')
            var base64_str = result_readfile
            var doc_type_name_fol = doctype + '_' + doctype_name
            // console.log('doc_type_name_fol:',doc_type_name_fol)
        }
        else{
            return [false,result_select[1]]
        }
        var list_fol_name = ['ประเภท',doc_type_name_fol,document_id,'attach_folder']
        var result_get_account = await onebox_func.get_account_byuserid(access_token,account_id_ppl,connectiondb) // get account onebox ของ user
        if (result_get_account[0] == true){
            // console.log('result_get_account:',result_get_account[1])
            let result_account = result_get_account[1].result
            for (let i=0 ; i<result_account.length ; i++){
                if (result_account[i].taxid == tax_id){
                    let account_id = String(result_account[i].account_id)
                    var result_main_folder = await onebox_func.get_mainfolder_byaccountid(account_id,account_id_ppl,connectiondb) // get main folder ของ user
                    
                    if (result_main_folder[0] == true){
                        let result_get_main_fol = result_main_folder[1].result
                        if (result_get_main_fol.length == 0){ // ถ้า main folder เป็น []
                            let index = result_get_main_fol.findIndex(function(item, i){
                                return item.folder_name === name_main // หา index ตัวที่ folder_name = Private Main Folder
                            });
                            let parent_folder_id = result_get_main_fol[index].folder_id
                            // สร้าง folder paperless_v2
                            let result_create_folder = await onebox_func.create_folder_with_permission(account_id,'paperless_v2','05',[],[],parent_folder_id,account_id_ppl,connectiondb)
                            if (result_create_folder[0] == true){
                                fol_paperless_v2_id = result_create_folder[1].data.folder_id
                            }
                            else{
                                return [false,result_create_folder[1]]
                            }
                        }
                        else{
                            // เช็คว่ามี folder paperless_v2 อยู่ใน Private Main Folder ไหม
                            var result_check_folder = await onebox_func.check_folder_in_biz(account_id,result_get_main_fol,name_main,'paperless_v2',account_id_ppl,connectiondb)
                            // console.log('result_check_folder:',result_check_folder)
                        }
                        if (result_check_folder[0] == true){
                            fol_paperless_v2_id = result_check_folder[1]
                            // var result_get_sub_folder = await onebox_func.get_subfolder_onebox(account_id,fol_paperless_v2_id) // get sub folder
                            // console.log('result_get_sub_folder:',result_get_sub_folder[1])
                            // if ((result_get_sub_folder[1].result.length) == 0){ // ถ้า sub folder นั้นเป็น []
                            //     // สร้างโฟลเดอร์ประเภทเอกสาร
                            //     let result_create_folder_type_doc = await onebox_func.create_folder_with_permission(account_id,'ประเภทเอกสาร','05',[],[],fol_paperless_v2_id)
                            //     console.log('result_create_folder_type_doc:',result_create_folder_type_doc)
                            //     fol_doc_type_id = result_create_folder_type_doc[1].data.folder_id
                            // }
                            // else{
                            //     // เช็คโฟลเดอร์ประเภทเอกสาร
                            //     var result_check_folder_type_doc = await onebox_func.check_folder_in_other(result_get_sub_folder[1].result,fol_paperless_v2_id,'ประเภทเอกสาร')
                            //     console.log('result_check_folder_type_doc:',result_check_folder_type_doc)
                            //     fol_doc_type_id = result_check_folder_type_doc[1]
                            // }
                            // console.log('fol_doc_type_id:',fol_doc_type_id)
                            for (let k=0 ; k<list_fol_name.length;k++){
                                var result_get_sub_folder = await onebox_func.get_subfolder_onebox(account_id,fol_paperless_v2_id,account_id_ppl,connectiondb) // get sub folder
                                // console.log('result_get_sub_folder:',result_get_sub_folder[1])
                                if ((result_get_sub_folder[1].result.length) == 0){ // ถ้า sub folder นั้นเป็น []
                                    // สร้างโฟลเดอร์ประเภทเอกสาร
                                    let result_create_folder_type_doc = await onebox_func.create_folder_with_permission(account_id,list_fol_name[k],'05',[],[],fol_paperless_v2_id,account_id_ppl,connectiondb)
                                    // console.log('result_create_folder_type_doc:',result_create_folder_type_doc)
                                    fol_in_for_id = result_create_folder_type_doc[1].data.folder_id
                                }
                                else{
                                    // เช็คโฟลเดอร์ประเภทเอกสาร
                                    var result_check_folder_type_doc = await onebox_func.check_folder_in_other(account_id,result_get_sub_folder[1].result,fol_paperless_v2_id,list_fol_name[k],account_id_ppl,connectiondb)
                                    // console.log('result_check_folder_type_doc:',result_check_folder_type_doc)
                                    fol_in_for_id = result_check_folder_type_doc[1]
                                }
                                // console.log('fol_in_for_id:',fol_in_for_id)
                                fol_paperless_v2_id = fol_in_for_id
                                if (k == list_fol_name.length - 1){
                                    var result_select_att = await db_select.find_file_attach(transaction_id,connectiondb)
                                    let detail = result_select_att[1].detail
                                    for (let i =0 ; i<detail.length ; i++){
                                        let path_file_now =  detail[i].path_file
                                        let file_name = (detail[i].file_name).split('.')[0]
                                        let type_file = (detail[i].file_name).split('.')[1]
                                        var result_readfile = fs.readFileSync(path_file_now,{encoding: 'base64'})
                                        // console.log('path_file_now:',path_file_now)
                                        // console.log('file_name:',file_name)
                                        // console.log('type_file:',type_file)
                                        var result_savefile = await onebox_func.savefile_base64_onebox(account_id,file_name,'pdf',result_readfile,fol_paperless_v2_id,account_id_ppl,connectiondb)
                                    }
                                    // var result_savefile = await onebox_func.savefile_base64_onebox(account_id,fileName,'pdf',base64_str,fol_paperless_v2_id,account_id_ppl,connectiondb)
                                    check_save = true
                                }
                            }
                            if (check_save == true){
                                return [true,result_savefile[1]]
                            }
                            if (check_save == false){
                                return [true,'Save file fails']
                            }
                            
                        }
                        else{
                            return [false,result_get_sub_folder[1]]
                        }
                    }
                    else{
                        return [false,result_main_folder[1]]
                    }
                    
                }
            }

        }
        else{
            return [false,result_get_account[1]]
        }
        
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

// save ไฟล์แนบรวม 2
async function process_save_attachfile_base64_onebox_all(transaction_id,access_token,biz_name,account_id_ppl,connectiondb){
    try {
        const [b, c] = await Promise.all([process_save_attachfile_base64_onebox(transaction_id,access_token,account_id_ppl,connectiondb), process_save_attachfile_base64_onebox_biz(transaction_id,access_token,biz_name,account_id_ppl,connectiondb)]);
        return [true,'success']
        
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

module.exports = {
    process_savefile_base64_onebox_test,
    process_savefile_base64_onebox,
    process_savefile_base64_onebox_biz,
    process_savefile_base64_onebox_all,
    process_savefile_onebox_test,
    process_save_attachfile_base64_onebox,
    process_save_attachfile_base64_onebox_biz,
    process_save_attachfile_base64_onebox_all,
}

