require('../config/lib')
const {attachfileModel} = require('../schema/attachfiles.sch');
const {
    connonsql
} = require('../config/mongo_db')

async function select_attachfile(json_data,attachfile_id){
    try {
        const dbconfig = json_data.db_connect
        await connonsql(dbconfig)
        var result_attachfile = await attachfileModel.findOne({ 
            _id:attachfile_id
        })
        if (result_attachfile.length!==0){
            return [true,result_attachfile]
        }else {
            return [false,'not found file']
        }
    } catch (error) {
        console.log(error)
        return [false,error]
    }
    
}

async function select_attachfile_from_fileid(json_data,file_id){
    try {
        const dbconfig = json_data.db_connect
        await connonsql(dbconfig)
        var result_attachfile = await attachfileModel.findOne( { 
            "detail.file_id":file_id 
        } )
        if (result_attachfile.length!==0){
            return [true,result_attachfile]
        }else {
            return [false,'not found file']
        }
    } catch (error) {
        console.log(error)
        return [false,error]
    }
    
}

async function select_attachfile_from_fileid_v2(dbconfig,file_id){
    try {
        await connonsql(dbconfig)
        var result_attachfile = await attachfileModel.findOne( { 
            "detail.file_id":file_id 
        },"detail" )
        if (result_attachfile.length!==0){
            return [true,result_attachfile]
        }else {
            return [false,'not found file']
        }
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

async function insert_attachfile(json_data,data){
    try {
        const dbconfig = json_data.db_connect
        await connonsql(dbconfig)
        let newdocument = new attachfileModel (data)
        var Value = await newdocument.save()
        return [true,Value]

    } catch (error) {
        console.log(error)
        return [false,error]
    }

}

async function update_attachfile(json_data,attachfile_id,detail,storage_use){
    try{
        const dbconfig = json_data.db_connect
        await connonsql(dbconfig)
        const reuslt_update = await attachfileModel.findOneAndUpdate(
            {_id:attachfile_id},
            {"$set":{detail:detail,storage_use:storage_use}})
            return [true,'success']
    }catch (error) {
        console.log(error)
        return [false,error]
    }
}

async function select_attachfile_transactionid(json_data,transaction_id){
    try {
        const dbconfig = json_data
        await connonsql(dbconfig)
        var result_attachfile = await attachfileModel.findOne({ 
            transaction_id:transaction_id
        })
        if (result_attachfile.length!==0){
            return [true,result_attachfile]
        }else {
            return [false,'not found file']
        }
    } catch (error) {
        console.log(error)
        return [false,error]
    }
    
}

module.exports = {
    insert_attachfile,
    select_attachfile,
    update_attachfile,
    select_attachfile_from_fileid,
    select_attachfile_transactionid,
    select_attachfile_from_fileid_v2
}