require('../config/lib')
const conditionModel = require('../schema/condition.sch');
const flowModel = require('../schema/flow.sch');
const {
    connonsql
} = require('../config/mongo_db')
const db_flow = require('../database/actiondb_flow')

async function update_codition_template(dbconfig,condition_id,detail,document_type){
    try{
        await connonsql(dbconfig)
        const reuslt_update = await conditionModel.findOneAndUpdate(
            {_id:condition_id},
            {"$set":{detail:detail,document_type:document_type}})
        // console.log(reuslt_update)
        return { result: 'OK', messageText: 'Success' }
    }catch (error) {
        console.log(error)
        return { result: 'ER', messageER: error }
    }
}

async function select_codition_template(dbconfig,document_type,data_check){
    try{
        await connonsql(dbconfig)
        const result_condition = await conditionModel.find({document_type:document_type})
        if (result_condition.length!==0){
            const detail = result_condition[0]['detail']
            let flow_id = ""
            if (data_check !== ""){
                for (let i =0; i<detail.length;i++){
                    condition_detail = detail[i]['condition']['condition_detail']
                    if (condition_detail.includes(data_check)){
                        flow_id = detail[i]['condition']['flow_id']
                        break
                    }
                }
            }else{
                flow_id = detail[0]['condition']['flow_id']
            }
            return [true,flow_id]
        }else {
            return [false,'not found condition']
        }

    }catch (error) {
        console.log(error)
        return [false,error]
    }
}

async function select_flow_for_sale(dbconfig,document_type){
    try{
        await connonsql(dbconfig)
        const result_condition = await conditionModel.find({document_type:document_type})
        if (result_condition.length!==0){
            const detail = result_condition[0]['detail']
            let flow_id = ""
            for (let i =0; i<detail.length;i++){                    
                    flow_id = detail[i]['condition']['flow_id']
                }
            return [true,flow_id]
        }else {
            return [false,'not found condition']
        }

    }catch (error) {
        console.log(error)
        return [false,error]
    }
}

async function select_codition(dbconfig,condition_id){
    try{
        await connonsql(dbconfig)
        const result_condition = await conditionModel.findOne({_id:condition_id})
        if (result_condition.length!==0){
            return { result: 'OK', messageText: result_condition }
        }else {
            return { result: 'ER', messageER: 'not found condition' }
        }
    }catch (error) {
        console.log(error)
        return { result: 'ER', messageER: error }
    }
}

async function find_template_v2(connectiondb,document_type,type_of_team,type_of_flow) {
    try {
        console.log(document_type,type_of_team,type_of_flow)
        if (connectiondb != null) { await connonsql(connectiondb)}
        let res_tmpflow = await flowModel.findOne({
            "$and" : [
                {
                    "doctype": document_type
                },
                {
                    "type_of_team": type_of_team
                },
                {
                    "type_of_flow": type_of_flow
                }

            ]
        })
        console.log('res_tmpflow',res_tmpflow)
        if (res_tmpflow == null) {
            let tmperror = {
                msg_thai: "ไม่พบรูปแบบที่ต้องการค้นหา",
                msg_eng: "Can't find the format you're looking for."
            }
            return[false,null,tmperror]
        } else {
            return[true,res_tmpflow,null]
        }
    }catch (error) {
        console.log(error)
        return [false,error,null]
    }
}

module.exports = {
    update_codition_template,
    select_codition_template,
    select_codition,
    select_flow_for_sale,
    find_template_v2
}