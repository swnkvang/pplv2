require('../config/global')
require('../config/mongo_db')
const ProfileSchema = require('../schema/sch_profile')
const Doc_typeSchema = require('../schema/document_type.sch')
const Doc_type_transSchema = require('../schema/doc_type_trans.sch')
const Doc_typ_refeSchema = require('../schema/transaction_ref_document')
const Trans_doc = require('../schema/transaction_document')
const Work_flow = require('../schema/workflow.sch')
const permission_Schema = require('../schema/permission.sch')

const {
    connonsql
} = require('../config/mongo_db')

// var updateProfile = async function (account_id, username, access_token, refresh_token, hash_data, one_update_time, biz_detail, email_one, sign_hash, employee_email, ipaddress, json) {
//     await ProfileSchema.findOne({
//         username: username,
//         account_id: account_id
//     }, function (err, data) {
//         console.log(typeof(json))
//         if (!err) {
//             if (!data) {
//                 console.log('data',data)
//                 data = new ProfileSchema();
//                 data.account_id = account_id
//                 data.username = username
//                 data.citizen_data = json
//                 data.email_citizen = employee_email
//                 data.emil_one = email_one
//                 data.business_default = null
//                 data.one_token = access_token
//                 data.refresh_token = refresh_token
//                 data.sign = null
//                 data.update_time = new Date
                
//             }
//             // console.log(data)
//             // console.log(one_update_time)
//             // console.log(email_one)
//             // console.log(employee_email)
//             data.citizen_data = json
//             data.emil_one = email_one
//             data.email_citizen = employee_email
//             data.one_token = access_token
//             data.refresh_token = refresh_token
//             data.update_time = new Date
//             data.save(function (err) {
//                 if (!err) {
//                     console.log("Success: save profile success");
//                 } else {
//                     console.log("Error: could not save profile " + data.id + " message " + err);
//                 }
//             });
//         } else {
//             console.log(err)
//         }
//     });
// }

var updatedoc_type = async function (type_name, keyword, type, detail, dept_role, prefix, digit, createBy, updateBy,connectiondb) {
    if (connectiondb != null) { await connonsql(connectiondb) }
    await Doc_typeSchema.findOne({
        type_name: type_name,
        keyword: keyword
    }, function (err, data) {
        // console.log(typeof(json))
        if (!err) {
            if (!data) {
                data = new Doc_typeSchema();
                data.type_name = type_name
                data.keyword = keyword
                data.type = type
                data.detail = detail
                data.dept_role = dept_role
                data.prefix = prefix
                data.digit = digit
                data.createBy = createBy
                data.updateBy = updateBy
                // data.createAt = new Date
                // data.updateAt = new Date
            }
            data.detail = detail
            data.dept_role = dept_role
            data.prefix = prefix
            data.digit = digit
            // data.updateAt = new Date
            data.save(function (err) {
                if (!err) {
                    console.log("Success: save document_type success");
                } else {
                    console.log("Error: could not save document_type " + data.type_name + " message " + err);
                }
            });
        } else {
            console.log(err)
        }
    });
}

var updatedoc_type_v2 = async function (type_name, keyword, type, detail, dept_role, prefix, digit,connectiondb) {
    if (connectiondb != null) { await connonsql(connectiondb) }
    const reuslt_update = await Doc_typeSchema.findOneAndUpdate(
        {type_name: type_name,
            keyword: keyword},
        {"$set":{
                    type_name : type_name,
                    keyword : keyword,
                    type : type,
                    detail : detail,
                    dept_role : dept_role,
                    prefix : prefix,
                    digit : digit,
                }
        },{upsert:true,new: true})
    if (reuslt_update != null){
        return [true,reuslt_update]
    }
    else{
        return [false,'Update Fails']
    }
}

var updatedoc_type_trans = async function (type_name,keyword,type,last_digit,connectiondb) {
    if (connectiondb != null) { await connonsql(connectiondb) }
    const reuslt_update = await Doc_type_transSchema.findOneAndUpdate(
        {type_name: type_name,
            keyword: keyword},
        {"$set":{
                    type_name : type_name,
                    keyword : keyword,
                    type : type,
                    last_digit : last_digit
                }
        },{upsert:true,new: true})
    if (reuslt_update != null){
        return [true,reuslt_update]
    }
    else{
        return [false,'Update Fails']
    }
    // await Doc_type_transSchema.findOne({
    //     type_name: type_name,
    //     keyword: keyword
    // }, async function (err, data) {
    //     // console.log(typeof(json))
    //     if (!err) {
    //         if (!data) {
    //             data = new Doc_type_transSchema();
    //             data.type_name = type_name
    //             data.keyword = keyword
    //             data.type = type
    //             data.last_digit = last_digit
    //             // data.createAt = new Date
    //             // data.updateAt = new Date
    //         }
    //         data.last_digit = last_digit
    //         // data.updateAt = new Date
    //         await data.save(function (err) {
    //             if (!err) {
    //                 console.log("Success: save doc_type_transaction success");
    //                 return 'OK'
    //             } else {
    //                 console.log("Error: could not save doc_type_transaction " + data.type_name + " message " + err);
    //                 return 'ER'
    //             }
                
    //         });
    //     } else {
    //         console.log(err)
    //     }
    // });
}



var updatedoc_type_trans_ref = async function (document_id,doctype,doctype_ref,doc_id_ref,last_ref,connectiondb) {
    if (connectiondb != null) { await connonsql(connectiondb) }
    await Doc_typ_refeSchema.findOne({
        document_id: document_id,
    }, async function (err, data) {
        // console.log(typeof(json))
        if (!err) {
            if (!data) {
                data = new Doc_typ_refeSchema();
                data.document_id = document_id
                data.doctype = doctype
                data.doctype_ref = doctype_ref,
                data.doc_id_ref = doc_id_ref
                data.last_ref = last_ref
                // data.createAt = new Date
                // data.updateAt = new Date
            }
            data.last_ref = last_ref
            // data.updateAt = new Date
            await data.save(function (err) {
                if (!err) {
                    console.log("Success: save doc_type_transaction success");
                    return 'OK'
                } else {
                    console.log("Error: could not save doc_type_transaction " + data.type_name + " message " + err);
                    return 'ER'
                }
                
            });
        } else {
            console.log(err)
        }
    });
}

var update_input_trans = async function (list_trans,data,id_workflow) {

    try{
        // console.log('list_trans:',list_trans)
        list_id = []
        list_key_obj = Object.keys(data)
        list_value_obj = Object.values(data)
        // console.log(list_value_obj);
        // var str_update = ''
        var res_select = await Trans_doc.find({
                                                    "_id" : { $in: list_trans},
                                                    $and:[{"flow": {
                                                                    "$elemMatch":  {
                                                                                    "$and": [
                                                                                                {
                                                                                                    "status": {$ne : "Y"}
                                                                                                },
                                                                                                {
                                                                                                    "pdf_sign": true
                                                                                                }
                                                                                            ]
                                                                                    }
                                                                }       
                                                        }]
                                            },"_id document_id doctype")

        // return [true,res_select]

        var res_select_wf = await Work_flow.findOne({
            "_id" : id_workflow,
            },"list_document_type status_refesh_key")
        
        for (let y=0 ; y<res_select.length ; y++){
            if ((res_select_wf.list_document_type).includes(res_select[y].doctype)){
                list_id.push(res_select[y].id)
            }
        }
        // console.log('res_select:',res_select)

        if (!(res_select.length == 0)){
            // console.log('res_select_wf:',res_select_wf.status_refesh_key)
            if (res_select_wf.status_refesh_key == true){
                for (let i =0 ; i<list_key_obj.length ; i++){
                    if (!(list_key_obj[i] == 'Sales_Name' || list_key_obj[i] == 'ID_PreSale' || list_key_obj[i] == 'Name_PreSale')){
                        var res_update = await Trans_doc.updateMany(
                            // { _id: { $in: list_trans } ,"input_data.key" :list_key_obj[i] },
                            { _id: { $in: list_id } ,"input_data.key" :list_key_obj[i] },
                            { $set: { 
                                        "input_data.$.value" : list_value_obj[i]
                                    } 
                                }
                        )
                    }
                    
                }
            }
            else{
                for (let i =0 ; i<list_key_obj.length ; i++){
                    var res_update = await Trans_doc.updateMany(
                        // { _id: { $in: list_trans } ,"input_data.key" :list_key_obj[i] },
                        { _id: { $in: list_id } ,"input_data.key" :list_key_obj[i] },
                        { $set: { 
                                    "input_data.$.value" : list_value_obj[i]
                                } 
                            }
                    )
                }
            }
            // console.log('res_update:',res_update)
            return [true,res_select]
            
        }
        else{
            return [false,'No update']
        }

        
        // var res_update = await Trans_doc.find({ _id: { $in: list_trans }},'input_data')
        // var index = res_update[0].input_data.findIndex(x => x.key === EmployeeID)
    }
    catch (error) {
        console.log('error:',error)
        return [false,error]
    }
}

var update_cancel_document = async function (transaction_id,user_id,connectiondb) {

    try{
        if (connectiondb != null) { await connonsql(connectiondb) }
        var res_update = await Trans_doc.updateMany(
            { _id: transaction_id ,"sender_detail.id" :user_id},
            { $set: { 
                        "status" : 'CANCEL'
                    } 
                }
        )
        if (res_update.n == 0 && res_update.nModified == 0){
            return [false,'No update, This user is not sender']
        }
        else{
            return [true,'Success']
        }
        
    }
    catch (error) {
        console.log('error:',error)
        return [false,error]
    }
}

var update_cancel_document_v2 = async function (transaction_id,user_id,document_main,group_id,connectiondb) {
    try{
        if (connectiondb != null) { await connonsql(connectiondb) }
        if (document_main){
            var res_update = await Trans_doc.updateMany(
                { groupid: group_id ,"sender_detail.id" :user_id},
                { $set: { 
                            "status" : 'CANCEL'
                    } 
                }
            )
        }else{
            var res_update = await Trans_doc.findOneAndUpdate(
                { _id: transaction_id ,"sender_detail.id" :user_id},
                { $set: { 
                            "status" : 'CANCEL'
                        } 
                    }
            )
        }
        console.log(res_update,'60883aa5327030001a462f60')
        return [true,'Success']
    }
    catch (error) {
        console.log('error:',error)
        return [false,error]
    }
}

var self = module.exports = {
    // updateProfile,
    updatedoc_type,
    updatedoc_type_trans,
    updatedoc_type_trans_ref,
    update_input_trans,
    update_cancel_document,
    update_cancel_document_v2,
    updatedoc_type_v2
}