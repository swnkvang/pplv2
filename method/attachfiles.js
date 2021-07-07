require('../config/lib')
require('../config/global')

const file_method = require('../function/func_savefile');
const replace_func = require('../function/func_replace');
const func_datetime = require('../function/func_datetime')
const func_hash = require('../function/func_hash')
const attachfiledb = require('../database/attachfiles_db')
const attachfile_groupdb = require('../database/attachfile_group')
const db_transaction = require('../database/actiondb_transaction');

async function add_attachfiles(json_data,files_req,attachfile_id,tax_id,list_filename,transaction_id){
    try {
        var now = new Date
        var dtnow = await func_datetime.formatDate(now)
        var filetime = timemoment().format();
        const dbconfig = json_data.db_connect
        if (attachfile_id===null||attachfile_id===""||attachfile_id==="null"||attachfile_id==="undefined"){
            let data_file = []
            var floder_name = uuid()
            var file_name = null
            let limit_file = false
            let storage_use = 0
            somepath = '/storage/'+tax_id+'/attachfile' + '/' + dtnow+'/'+ floder_name + '/'
            path_folder = path_local+'/storage/'+tax_id+'/attachfile' + '/' + dtnow+'/'+ floder_name 
            for (i=0 ; i<files_req.length ; i++){
                for (j=0 ; j<list_filename.length ; j++){
                    if (i===j){
                        file_name = list_filename[j]
                        var file_name_replace = file_name
                        replace_method = await replace_func.replace_characters(list_filename[j])
                        if (replace_method[0]){
                            file_name_replace = replace_method[1]
                        }
                        type_file_split = list_filename[j].split(".")
                        len_file = type_file_split.length
                        if (type_file_split.length==2){
                            type_file_split =  type_file_split[1]
                        }else{
                            var index_type = len_file-1
                            type_file_split = type_file_split[index_type]
                        }
                    }
                }
                var file_id = uuid()
                var data = files_req[i].buffer
                storage_use+=files_req[i].size
                if (storage_use<=52428800){
                    save_file = await file_method.createFile(path_local,somepath,file_id,type_file_split,data)
                }else{
                    storage_use-=files_req[i].size
                    limit_file = true
                    var tmperror = {
                        msg_thai : 'ขนาดไฟล์แนบเกินที่กำหนดไว้',
                        msg_eng : 'Size attachfile over limit'
                    }
                }
                if (save_file[0]){
                    info = {
                        file_id:file_id,
                        file_name:file_name_replace,
                        file_name_new:file_id,
                        account_id:json_data.one_result_data.id,
                        path_file:save_file[1],
                        size_file:files_req[i].size,
                        url_dowload:"/attachfile/api/v1/view_download_attachfiles?file="+file_id,
                        url_view:"/attachfile/api/v1/view_download_attachfiles?file="+file_id,
                        url_delete:"/attachfile/api/v1/delete_attachfiles?file="+file_id,
                        status:"Y",
                        create_at:filetime,
                        update_time:filetime
                    }
                    if (!limit_file){
                        data_file.push(info)
                    }
                }else{
                    return [false,null,save_file[1]]
                }
            }
            data = {
                folder_name:floder_name,
                detail:data_file,
                storage_use:storage_use,
                path_folder:path_folder,
                transaction_id:transaction_id
            }
            result_insert = await attachfiledb.insert_attachfile(json_data,data)
            if (result_insert[0]){
                if (transaction_id != undefined && transaction_id != '' && transaction_id != null){
                    attachfile_id = result_insert[1]._id
                    db_transaction.update_attachfile_id(dbconfig,transaction_id,attachfile_id)
                }
                result_getattachfile = await get_attachfiles(json_data,result_insert[1]._id)
                if (result_getattachfile[0]){
                    if (!limit_file){
                        return [true,result_getattachfile[1]]
                    }else{
                        return [false,null,tmperror]
                    }
                }else{
                    return [false,null,result_getattachfile[1]]
                }
            }else{
                return [false,null,result_insert[1]]
            }
        }else{
            result_attachfile = await attachfiledb.select_attachfile(json_data,attachfile_id)
            if (result_attachfile){
                var floder_name = result_attachfile[1].folder_name
                let detail = result_attachfile[1].detail
                let storage_use = result_attachfile[1].storage_use
                const limit_storage = result_attachfile[1].limit_storage
                somepath = '/storage/'+tax_id+'/attachfile' + '/' + dtnow+'/'+ floder_name + '/'
                var file_name = null
                let limit_file = false
                for (i=0 ; i<files_req.length ; i++){
                    for (j=0 ; j<list_filename.length ; j++){
                        if (i===j){
                            file_name = list_filename[j]
                            var file_name_replace = file_name
                            replace_method = await replace_func.replace_characters(list_filename[j])
                            if (replace_method[0]){
                                file_name_replace = replace_method[1]
                            }
                            type_file_split = list_filename[j].split(".")
                            len_file = type_file_split.length
                            if (type_file_split.length==2){
                                type_file_split =  type_file_split[1]
                            }else{
                                var index_type = len_file-1
                                type_file_split = type_file_split[index_type]
                            }
                        }
                    }
                    var file_id = uuid()
                    var data = files_req[i].buffer
                    storage_use+=files_req[i].size
                    if (storage_use<=limit_storage){
                        save_file = await file_method.createFile(path_local,somepath,file_id,type_file_split,data)
                    }else{
                        storage_use-=files_req[i].size
                        limit_file = true
                        var tmperror = {
                            msg_thai : 'ขนาดไฟล์แนบเกินที่กำหนดไว้',
                            msg_eng : 'Size attachfile over limit'
                        }
                    }
                    if (save_file[0]){
                        info = {
                            file_id:file_id,
                            file_name:file_name_replace,
                            file_name_new:file_id,
                            account_id:json_data.one_result_data.id,
                            path_file:save_file[1],
                            size_file:files_req[i].size,
                            url_dowload:"/attachfile/api/v1/view_download_attachfiles?file="+file_id,
                            url_view:"/attachfile/api/v1/view_download_attachfiles?file="+file_id,
                            url_delete:"/attachfile/api/v1/delete_attachfiles?file="+file_id,
                            status:"Y",
                            create_at:filetime,
                            update_time:filetime
                        }
                        if (!limit_file){
                            detail.push(info)
                        }
                    }else{
                        return [false,null,save_file[1]]
                    }
                }
                result_update = await attachfiledb.update_attachfile(json_data,attachfile_id,detail,storage_use)
                if (result_update[0]){
                    if (transaction_id != undefined && transaction_id != '' && transaction_id != null){
                        db_transaction.update_attachfile_id(dbconfig,transaction_id,attachfile_id)
                    }
                    result_getattachfile = await get_attachfiles(json_data,attachfile_id)
                    if (result_getattachfile[0]){
                        if (!limit_file){
                            return [true,result_getattachfile[1]]
                        }else{
                            return [false,null,tmperror]
                        }
                    }else{
                        return [false,null,result_getattachfile[1]]
                    }
                }else{
                    return [false,null,result_update[1]]
                }
            }else{
                return [false,null,result_attachfile[1]]
            }
        }
        
    } catch (error) {
        console.log(error)
        return [false,null,error]
    }
}

async function add_attachfiles_v2(json_data,files_req,attachfile_id,tax_id,list_filename,transaction_id){
    try {
        var now = new Date
        var dtnow = await func_datetime.formatDate(now)
        var filetime = timemoment().format();
        var token = null
        const dbconfig = json_data.db_connect
        const result_token = await func_hash.encode(dbconfig)
        if (result_token[0]){
            token = result_token[1]
        }
        if (attachfile_id===null||attachfile_id===""||attachfile_id==="null"||attachfile_id==="undefined"){
            let data_file = []
            var floder_name = uuid()
            var file_name = null
            let limit_file = false
            let storage_use = 0
            var somepath = '/storage/'+tax_id+'/attachfile' + '/' + dtnow+'/'+ floder_name + '/'
            path_folder = path_local+'/storage/'+tax_id+'/attachfile' + '/' + dtnow+'/'+ floder_name 
            for (i=0 ; i<files_req.length ; i++){
                for (j=0 ; j<list_filename.length ; j++){
                    if (i===j){
                        file_name = list_filename[j]
                        var file_name_replace = file_name
                        replace_method = await replace_func.replace_characters(list_filename[j])
                        if (replace_method[0]){
                            file_name_replace = replace_method[1]
                        }
                        type_file_split = list_filename[j].split(".")
                        len_file = type_file_split.length
                        if (type_file_split.length==2){
                            type_file_split =  type_file_split[1]
                        }else{
                            var index_type = len_file-1
                            type_file_split = type_file_split[index_type]
                        }
                    }
                }
                var file_id = uuid()
                var data = files_req[i].buffer
                storage_use+=files_req[i].size
                if (storage_use<=52428800){
                    var save_file = await file_method.createFile(path_local,somepath,file_id,type_file_split,data)
                }else{
                    storage_use-=files_req[i].size
                    limit_file = true
                    var tmperror = {
                        msg_thai : 'ขนาดไฟล์แนบเกินที่กำหนดไว้',
                        msg_eng : 'Size attachfile over limit'
                    }
                }
                if (save_file[0]){
                    var info = {
                        file_id:file_id,
                        file_name:file_name_replace,
                        file_name_new:file_id,
                        account_id:json_data.one_result_data.id,
                        path_file:save_file[1],
                        size_file:files_req[i].size,
                        url_dowload:"/attachfile/api/v2/download_attachfiles?file="+file_id+"&con="+token,
                        url_view:"/attachfile/api/v2/view_attachfiles?file="+file_id+"&con="+token,
                        url_delete:"/attachfile/api/v1/delete_attachfiles?file="+file_id,
                        status:"Y",
                        create_at:filetime,
                        update_time:filetime
                    }
                    if (!limit_file){
                        data_file.push(info)
                    }
                }else{
                    return [false,null,save_file[1]]
                }
            }
            data = {
                folder_name:floder_name,
                detail:data_file,
                storage_use:storage_use,
                path_folder:path_folder,
                transaction_id:transaction_id
            }
            result_insert = await attachfiledb.insert_attachfile(json_data,data)
            if (result_insert[0]){
                if (transaction_id != undefined && transaction_id != '' && transaction_id != null){
                    attachfile_id = result_insert[1]._id
                    db_transaction.update_attachfile_id(dbconfig,transaction_id,attachfile_id)
                }
                result_getattachfile = await get_attachfiles(json_data,result_insert[1]._id)
                if (result_getattachfile[0]){
                    if (!limit_file){
                        return [true,result_getattachfile[1]]
                    }else{
                        return [false,null,tmperror]
                    }
                }else{
                    return [false,null,result_getattachfile[1]]
                }
            }else{
                return [false,null,result_insert[1]]
            }
        }else{
            result_attachfile = await attachfiledb.select_attachfile(json_data,attachfile_id)
            if (result_attachfile){
                var floder_name = result_attachfile[1].folder_name
                let detail = result_attachfile[1].detail
                let storage_use = result_attachfile[1].storage_use
                const limit_storage = result_attachfile[1].limit_storage
                var somepath = '/storage/'+tax_id+'/attachfile' + '/' + dtnow+'/'+ floder_name + '/'
                var file_name = null
                let limit_file = false
                for (i=0 ; i<files_req.length ; i++){
                    for (j=0 ; j<list_filename.length ; j++){
                        if (i===j){
                            file_name = list_filename[j]
                            var file_name_replace = file_name
                            replace_method = await replace_func.replace_characters(list_filename[j])
                            if (replace_method[0]){
                                file_name_replace = replace_method[1]
                            }
                            type_file_split = list_filename[j].split(".")
                            len_file = type_file_split.length
                            if (type_file_split.length==2){
                                type_file_split =  type_file_split[1]
                            }else{
                                var index_type = len_file-1
                                type_file_split = type_file_split[index_type]
                            }
                        }
                    }
                    var file_id = uuid()
                    var data = files_req[i].buffer
                    storage_use+=files_req[i].size
                    if (storage_use<=limit_storage){
                        save_file = await file_method.createFile(path_local,somepath,file_id,type_file_split,data)
                    }else{
                        storage_use-=files_req[i].size
                        limit_file = true
                        var tmperror = {
                            msg_thai : 'ขนาดไฟล์แนบเกินที่กำหนดไว้',
                            msg_eng : 'Size attachfile over limit'
                        }
                    }
                    if (save_file[0]){
                        info = {
                            file_id:file_id,
                            file_name:file_name_replace,
                            file_name_new:file_id,
                            account_id:json_data.one_result_data.id,
                            path_file:save_file[1],
                            size_file:files_req[i].size,
                            url_dowload:"/attachfile/api/v2/download_attachfiles?file="+file_id+"&con="+token,
                            url_view:"/attachfile/api/v2/view_attachfiles?file="+file_id+"&con="+token,
                            url_delete:"/attachfile/api/v1/delete_attachfiles?file="+file_id,
                            status:"Y",
                            create_at:filetime,
                            update_time:filetime
                        }
                        if (!limit_file){
                            detail.push(info)
                        }
                    }else{
                        return [false,null,save_file[1]]
                    }
                }
                result_update = await attachfiledb.update_attachfile(json_data,attachfile_id,detail,storage_use)
                if (result_update[0]){
                    if (transaction_id != undefined && transaction_id != '' && transaction_id != null){
                        db_transaction.update_attachfile_id(dbconfig,transaction_id,attachfile_id)
                    }
                    result_getattachfile = await get_attachfiles(json_data,attachfile_id)
                    if (result_getattachfile[0]){
                        if (!limit_file){
                            return [true,result_getattachfile[1]]
                        }else{
                            return [false,null,tmperror]
                        }
                    }else{
                        return [false,null,result_getattachfile[1]]
                    }
                }else{
                    return [false,null,result_update[1]]
                }
            }else{
                return [false,null,result_attachfile[1]]
            }
        }
        
    } catch (error) {
        console.log(error)
        return [false,null,error]
    }
}

async function view_download_attachfiles(json_data,file_id){
    try {
        const result_attachfile = await attachfiledb.select_attachfile_from_fileid(json_data,file_id)
        if (result_attachfile[0]){
            detail = result_attachfile[1].detail
            let path_file = null
            for (i=0;i<detail.length;i++) {
                var file_id_db = detail[i].file_id
                var status = detail[i].status
                if (file_id_db === file_id ){
                    if (status !== "N"){
                        path_file = detail[i].path_file
                        break
                    }
                }
            }
            if (path_file !== null){
                result_readfile = await fs.readFileSync(path_file, {encoding: 'base64'})
                return [true,result_readfile]
            }else{
                return [false,"Not foud file"]
            }
        }else{
            return [false,result_attachfile[1]]
        }
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

async function view_download_attachfiles_v2(conToken,file_id,action,res){
    try {
        var dbconfig = null
        const result_config = await func_hash.decode(conToken)
        if (result_config[0]){
            dbconfig = result_config[1]
        }
        const result_attachfile = await attachfiledb.select_attachfile_from_fileid_v2(dbconfig,file_id)
        if (result_attachfile[0]){
            detail = result_attachfile[1].detail
            let path_file = null
            let file_name = null
            for (i=0;i<detail.length;i++) {
                var file_id_db = detail[i].file_id
                var status = detail[i].status
                if (file_id_db === file_id ){
                    if (status !== "N"){
                        path_file = detail[i].path_file
                        file_name = detail[i].file_name
                        break
                    }
                }
            }
            if (path_file !== null){
                if (action==="downloand"){
                    res.download(path_file,file_name, (err) => {
                        if (err) {
                          res.status(500).send({
                            message: "Could not download the file. " + err,
                          });
                        }
                      });
                }else{
                    try {
                        res.sendFile(path_file)
                    } catch(err) {
                        console.error(err)
                        return [false,err]
                    }
                }
                return [true]
            }else{
                return [false,"Not foud file"]
            }
        }else{
            return [false,result_attachfile[1]]
        }
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

async function delete_attachfiles(json_data,file_id) {
    try {
        const result_attachfile = await attachfiledb.select_attachfile_from_fileid(json_data,file_id)
        if (result_attachfile[0]){
            var filetime = timemoment().format();
            let detail = result_attachfile[1].detail
            let attachfile_id = result_attachfile[1]._id
            let path_file = null
            let storage_use = result_attachfile[1].storage_use
            const path_folder = result_attachfile[1].path_folder
            const id_user = json_data.one_result_data.id
            for (i=0;i<detail.length;i++) {
                var file_id_db = detail[i].file_id
                var status = detail[i].status
                var account_id = detail[i].account_id
                if (file_id_db === file_id ){
                    if (status !== "N" && account_id === id_user){
                        storage_use-=detail[i].size_file
                        path_file = detail[i].path_file
                        detail[i].status = "N"
                        detail[i].update_time = filetime
                        result_update = await attachfiledb.update_attachfile(json_data,attachfile_id,detail,storage_use)
                        break
                    }else{
                        var tmperror = {
                            msg_thai : 'ไฟล์นี้ถูกลบไปแล้ว',
                            msg_eng : 'This file has been deleted.'
                        }
                        return [false,null,tmperror]
                    }
                }
            }
            if (path_file !== null){
                await file_method.RemoveFileInDir(path_file)
                const files = fs.readdirSync(path_folder)
                if (files.length === 0){
                    file_method.RemoveDir(path_folder)
                }
                return [true,"success"]
            }else{
                var tmperror = {
                    msg_thai : 'ไม่พบไฟล์',
                    msg_eng : 'Not foud file.'
                }
                [false,null,tmperror]
            }
        }else{
            return [false,null,result_attachfile[1]]
        }
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

async function delete_all_file(path_folder) {
    try {
        if (path_folder !== null && path_folder != "" && path_folder != undefined ){
            await file_method.RemoveDir(path_folder)
            return [true,"success"]
        }else{
            [false,"Not foud file"]
        }
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

async function get_attachfiles(json_data,attachfile_id) {
    try {
        if (attachfile_id!==undefined && attachfile_id!= ''){
            const result_attachfile = await attachfiledb.select_attachfile(json_data,attachfile_id)
            if (result_attachfile[0]){
                let detail = result_attachfile[1].detail
                for (i=0;i<detail.length;i++) {
                    var status = detail[i].status
                    detail[i].url_delete = url_ppl_prod+detail[i].url_delete
                    detail[i].url_view = url_ppl_prod+detail[i].url_view
                    detail[i].url_dowload = url_ppl_prod+detail[i].url_dowload
                    if (status === "N"){
                        detail.remove(detail[i])
                        i--
                    }
                }
                var data = {
                    attachfile_id:result_attachfile[1]._id,
                    folder_name:result_attachfile[1].folder_name,
                    detail:detail
                }
                return [true,data]
            }else{
                return [false,result_attachfile[1]]
            }
        }else{
            return [false,"not found attachfile id"]
        }
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

async function add_attachfiles_group(json_data,files_req,tax_id,list_filename,SummaryGroup_id){
    try {
        var now = new Date
        var dtnow = await func_datetime.formatDate(now)
        var filetime = timemoment().format();
        const dbconfig = json_data.db_connect
        let data_file = []
        var floder_name = uuid()
        var file_name = null
        var token = null
        if (!(files_req===undefined)&&files_req.length!==0){
            const result_SummaryGroup = await attachfile_groupdb.select_summaryGroup(json_data,SummaryGroup_id)
            if (result_SummaryGroup[0]){
                if (!result_SummaryGroup[1].StatusUpdateGroup){
                    const attachfile_summarygroup = result_SummaryGroup[1].attachfile_group
                    if (attachfile_summarygroup === null||attachfile_summarygroup === ''||attachfile_summarygroup === undefined) {
                        const array_transaction_id = result_SummaryGroup[1].array_transaction_id
                        const somepath = '/storage/'+tax_id+'/attachfile_group' + '/' + dtnow+'/'+ floder_name + '/'
                        const path_folder = path_local+'/storage/'+tax_id+'/attachfile_group' + '/' + dtnow+'/'+ floder_name 
                        const result_token = await func_hash.encode(dbconfig)
                        if (result_token[0]){
                            token = result_token[1]
                        }
                        for (i=0 ; i<files_req.length ; i++){
                            for (j=0 ; j<list_filename.length ; j++){
                                if (i===j){
                                    file_name = list_filename[j]
                                    var file_name_replace = file_name
                                    replace_method = await replace_func.replace_characters(list_filename[j])
                                    if (replace_method[0]){
                                        file_name_replace = replace_method[1]
                                    }
                                    type_file_split = list_filename[j].split(".")
                                    len_file = type_file_split.length
                                    if (type_file_split.length==2){
                                        type_file_split =  type_file_split[1]
                                    }else{
                                        var index_type = len_file-1
                                        type_file_split = type_file_split[index_type]
                                    }
                                }
                            }
                            var file_id = uuid()
                            var data = files_req[i].buffer
                            var save_file = await file_method.createFile(path_local,somepath,file_id,type_file_split,data)
                            if (save_file[0]){
                                info = {
                                    file_id:file_id,
                                    file_name:file_name_replace,
                                    file_name_new:file_id,
                                    account_id:json_data.one_result_data.id,
                                    path_file:save_file[1],
                                    url_dowload:"/attachfile_group/api/v1/download_attachfilesGroup?file="+file_id+"&con="+token,
                                    url_view:"/attachfile_group/api/v1/view_attachfilesGroup?file="+file_id+"&con="+token,
                                    create_at:filetime,
                                    update_time:filetime
                                }
                                data_file.push(info)
                            }else{
                                return [false,null,save_file[1]]
                            }
                        }
                        data = {
                            folder_name:floder_name,
                            detail:data_file,
                            path_folder:path_folder,
                            summarygroup_id:SummaryGroup_id
                        }
                        const result_insert = await attachfile_groupdb.insert_attachfileGroup(json_data,data)
                        if (result_insert[0]){
                            const attachfile_id = result_insert[1]._id
                            attachfile_groupdb.update_SummaryGroup_attachfile(json_data,attachfile_summarygroup,attachfile_id,SummaryGroup_id)
                            attachfile_groupdb.update_attachfile_to_transactionOne(json_data,array_transaction_id,attachfile_id)
                            const result_attach = await get_attachfileGroup(json_data,attachfile_id)
                            if(result_attach[0]){
                                return [true,result_attach[1]]
                            }else{
                                return [false,result_attach[1]]
                            }
                        }else{
                            return [false,null,result_insert[1]]
                        }
                    }else{
                        var tmperror = {
                            msg_thai : 'ไม่สามารถแนบไฟล์ได้เนื่องจากมีการแนบไฟล์แล้ว',
                            msg_eng : 'The file could not be attached because the file was already attached.'
                        }
                        return [false,null,tmperror]
                    }
                }else{
                    var tmperror = {
                        msg_thai : 'ไม่สามารถแนบไฟล์ได้เนื่องจากเอกสารสรุปนี้ยังดำเนินการไม่สำเร็จ',
                        msg_eng : 'The file could not be attached because this summary was unsuccessful.'
                    }
                    return [false,null,tmperror]
                }
            }else{
                return [false,null,result_SummaryGroup[1]]
            }
        }else{
            var tmperror = {
                msg_thai : 'ไม่พบไฟล์ที่ต้องการแนบ',
                msg_eng : 'Could not find the file you want to attach.'
            }
            return [false,null,tmperror]
        }
    } catch (error) {
        console.log(error)
        return [false,null,error.message]
    }
}

async function get_attachfileGroup(json_data,attachfile_id) {
    try {
        if (attachfile_id!==undefined && attachfile_id!= ''){
            const result_attachfile = await attachfile_groupdb.select_attachfileGroup(json_data,attachfile_id)
            if (result_attachfile[0]){
                let detail = result_attachfile[1].detail
                for (i=0;i<detail.length;i++) {
                    detail[i].url_view = url_ppl_prod+detail[i].url_view
                    detail[i].url_dowload = url_ppl_prod+detail[i].url_dowload
                }
                var data = {
                    attachfile_group:result_attachfile[1]._id,
                    folder_name:result_attachfile[1].folder_name,
                    detail:detail
                }
                return [true,data]
            }else{
                return [false,result_attachfile[1]]
            }
        }else{
            return [false,"not found attachfile id"]
        }
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

async function view_download_attachfileGroup(file_id,conToken,action,res){
    try {
        var dbconfig = null
        const result_config = await func_hash.decode(conToken)
        if (result_config[0]){
            dbconfig = result_config[1]
        }
        const result_attachfile = await attachfile_groupdb.select_attachfileGroup_from_fileid(dbconfig,file_id)
        if (result_attachfile[0]){
            detail = result_attachfile[1].detail
            let path_file = null
            let file_name = null
            for (i=0;i<detail.length;i++) {
                var file_id_db = detail[i].file_id
                if (file_id_db === file_id ){
                    path_file = detail[i].path_file
                    file_name = detail[i].file_name
                    break
                }
            }
            if (path_file !== null){
                if (action==="downloand"){
                    res.download(path_file,file_name, (err) => {
                        if (err) {
                          res.status(500).send({
                            message: "Could not download the file. " + err,
                          });
                        }
                      });
                }else{
                    try {
                        res.sendFile(path_file)
                    } catch(err) {
                        console.error(err)
                        return [false,err]
                    }
                }
                return [true]
            }else{
                return [false,"Not foud file"]
            }
        }else{
            return [false,result_attachfile[1]]
        }
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

module.exports = {
    add_attachfiles,
    get_attachfiles,
    delete_attachfiles,
    view_download_attachfiles,
    delete_all_file,
    add_attachfiles_group,
    get_attachfileGroup,
    view_download_attachfileGroup,
    add_attachfiles_v2,
    view_download_attachfiles_v2
}