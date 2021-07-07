require('../config/lib')
const attachfile_groupModel = require('../schema/attachfile_group.sch');
const SummaryGroupSchema = require('../schema/summaryGroup.sch')
const transaction_Schema = require('../schema/transaction_document')
const {
    connonsql
} = require('../config/mongo_db')

async function select_summaryGroup(json_data,summaryGroup_id){
    try {
        const dbconfig = json_data.db_connect
        await connonsql(dbconfig)
        var result_SummaryGroup = await SummaryGroupSchema.findOne({ 
            _id:summaryGroup_id
        },"StatusUpdateGroup attachfile_group array_transaction_id")
        if (result_SummaryGroup.length!==0){
            return [true,result_SummaryGroup]
        }else {
            return [false,'not found Group']
        }
    } catch (error) {
        console.log(error)
        return [false,error.message]
    }
}

async function update_SummaryGroup_attachfile(json_data,attachfile_group,attachfile_id,summaryGroup_id){
    try {
        const dbconfig = json_data.db_connect
        await connonsql(dbconfig)
        if (attachfile_group===null||attachfile_group===""){
            const reuslt_update = await SummaryGroupSchema.findOneAndUpdate(
                {_id:summaryGroup_id},
                {"$set":{attachfile_group:attachfile_id}})
            return [true,'success']
        }else{
            return [false]
        }
    } catch (error) {
        console.log(error)
        return [false,error.message]
    }
}

async function select_attachfileGroup(json_data,attachfile_id){
    try {
        const dbconfig = json_data.db_connect
        await connonsql(dbconfig)
        var result_attachfile = await attachfile_groupModel.findOne({ 
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

async function select_attachfileGroup_from_fileid(dbconfig,file_id){
    try {
        await connonsql(dbconfig)
        var result_attachfile = await attachfile_groupModel.findOne( { 
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

async function insert_attachfileGroup(json_data,data){
    try {
        const dbconfig = json_data.db_connect
        await connonsql(dbconfig)
        let newdocument = new attachfile_groupModel (data)
        var Value = await newdocument.save()
        return [true,Value]

    } catch (error) {
        console.log(error)
        return [false,error]
    }

}

async function update_attachfile_to_transactionOne(json_data,list_transaction,attachfile_id){
    try {
        const dbconfig = json_data.db_connect
        await connonsql(dbconfig)
        for (var i = 0; i < list_transaction.length; i++){
            const reuslt_update = await transaction_Schema.findOneAndUpdate(
                {_id:list_transaction[i]},
                {"$set":{attachfile_summarygroup:attachfile_id}})
        }
        return [true,"success"]
    } catch (error) {
        console.log(error)
        return[false,error.message]
    }
}

module.exports = {
    select_summaryGroup,
    insert_attachfileGroup,
    select_attachfileGroup,
    select_attachfileGroup_from_fileid,
    update_SummaryGroup_attachfile,
    update_attachfile_to_transactionOne
}