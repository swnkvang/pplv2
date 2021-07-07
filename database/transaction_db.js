require('../config/lib')
require('../config/global')
require('../config/mongo_db')
const transaction_Schema = require('../schema/transaction_document')
const {
    connonsql
} = require('../config/mongo_db')

var find_transaction_all = async function(json_data,document_type,keyword,limit,offset){
    try {
        const connectiondb = json_data.db_connect
        await connonsql(connectiondb)
        var transaction_all = await transaction_Schema.find({
            $and: [{doctype:document_type},{input_data:{$elemMatch: {value: { $regex: '.*' + keyword + '.*' }}}}] 
        },"flow tracking_id document_id doctype sender_detail status_document status doctype_name step_now step_max createdAt updatedAt").skip(offset).limit(limit).sort({updatedAt: -1})
        return [true,transaction_all]
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

var count_transaction = async function(json_data,document_type){
    try {
        const connectiondb = json_data.db_connect
        await connonsql(connectiondb)
        var count_all = await transaction_Schema.count({
            doctype:document_type
        })
        var count_newcus = await transaction_Schema.count({
            $and: [{doctype:document_type},{input_data:{$elemMatch: {value: { $regex: '.*New Customer.*' }}}}] 
        })
        var count_newservice= await transaction_Schema.count({
            $and: [{doctype:document_type},{input_data:{$elemMatch: {value: { $regex: '.*New Service.*' }}}}] 
        })
        var count_renewal = await transaction_Schema.count({
            $and: [{doctype:document_type},{input_data:{$elemMatch: {value: { $regex: '.*Renewal.*' }}}}] 
        })
        var count_renewal_change = await transaction_Schema.count({
            $and: [{doctype:document_type},{input_data:{$elemMatch: {value: { $regex: '.*Renewal&Change.*' }}}}] 
        })
        var count_change = await transaction_Schema.count({
            $and: [{doctype:document_type},{input_data:{$elemMatch: {value: { $regex: '.*Change.*' }}}}] 
        })
        const count_data = {
            all:count_all,
            New_Customer:count_newcus,
            New_Service:count_newservice,
            Renewal:count_renewal,
            Renewal_Change:count_renewal_change,
            Change:count_change
        }
        return [true,count_data]
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

module.exports = {
    find_transaction_all,
    count_transaction
}