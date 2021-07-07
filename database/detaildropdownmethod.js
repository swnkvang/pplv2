require('../config/lib')
const {detaildropdownModel} = require('../schema/detail_dropdown');
const {
    connonsql
} = require('../config/mongo_db')

async function insert_detail(json_data,data){
    try {
        const dbconfig = json_data.db_connect
        await connonsql(dbconfig)
        let newdocument = new detaildropdownModel (data)
        await newdocument.save()
        return [true,"success"]

    } catch (error) {
        console.log(error)
        return [false,error]
    }

}

async function get_detail(json_data,document_type){
    try {
        const dbconfig = json_data.db_connect
        await connonsql(dbconfig)
        const result_detail = await detaildropdownModel.findOne({"$and" : [
            {document_type:document_type},
            {type_of_team:null},
            {type_of_flow:null}
        ]},"detail")
        if (result_detail.length!==0){
            const detail = result_detail.detail
            return [true,detail]
        }else {
            return [false,'not found detail']
        }
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

async function get_detail_v2(json_data,document_type,type_of_team,type_of_flow){
    try {
        const dbconfig = json_data.db_connect
        await connonsql(dbconfig)
        const result_detail = await detaildropdownModel.findOne({"$and" : [
            {document_type:document_type},
            {type_of_team:type_of_team},
            {type_of_flow:type_of_flow}
        ]},"detail")
        if (result_detail.length!==0){
            const detail = result_detail.detail
            return [true,detail]
        }else {
            return [false,'not found detail']
        }
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

module.exports = {
    insert_detail,
    get_detail,
    get_detail_v2
}