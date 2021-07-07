require('../config/lib')
require('../config/global')
require('../config/mongo_db')
// const BusinessSchema = require('../models/business.sch')
// const AccountSchema = require('../models/account.sch')
const Doc_typeSchema = require('../schema/document_type.sch')
const Doc_typ_refeSchema = require('../schema/transaction_ref_document')
const Doc_type_transSchema = require('../schema/doc_type_trans.sch')
const ConditionsSchema = require('../schema/condition.sch')
const FlowSchema = require('../schema/flow.sch')
const {
    connonsql
} = require('../config/mongo_db')
const {attachfileModel} = require('../schema/attachfiles.sch');

const Trans_doc = require('../schema/transaction_document')
const {transactiongroupModel} = require('../schema/transaction_group.sch');

var document_type_2 = async function (connectiondb,keyword) {
    try{
        if (connectiondb != null) { await connonsql(connectiondb) }
        var query = await Doc_typeSchema.find({keyword:keyword}).select({
            "_id" : 0
        })
        if (query.length == 0){
            return [false,'Not Found']
        }
        return [true,query[0]]
    }
    catch (error) {
        console.log(error)
        return [false,error.message]
    }
}

const FuncGetDocumentAllDateRange = async (dtm_start, dtm_end, document_type) => {
    try {
        var dateString_start = timemoment.unix(dtm_start).format("YYYY-MM-DD HH:mm:ss");
        var dateString_end = timemoment.unix(dtm_end).format("YYYY-MM-DD HH:mm:ss");
        var query = await Trans_doc.find({
            updatedAt: {
                $gte: dateString_start,
                $lt: dateString_end
            },
            doctype: document_type
        }, {
            _id:0,
            html: 0,
            pdfSize: 0,
            hash_html: 0,
            __v: 0,
            path: 0,
            path_pdf_original: 0,
            path_pdf_sign: 0,
            path_hash_original: 0,
            path_pdfhashsign: 0,
            id_flow_tmp: 0,
            "flow.actor.sign_base64": 0,
            "flow.action_detail.sign_base64": 0
        }).sort({
            updatedAt: -1
        })
        if (query.length == 0) {
            return [false, 'Not Found']
        }
        return [true, query]
    } catch (error) {
        console.log(error)
        return [false, error.message]
    }
};

const FuncGetDocumentAllDateRange_v2 = async (dtm_start, dtm_end, document_type,connectiondb) => {
    try {
        await connonsql(connectiondb)
        var dateString_start = timemoment.unix(dtm_start).format("YYYY-MM-DD HH:mm:ss");
        var dateString_end = timemoment.unix(dtm_end).format("YYYY-MM-DD HH:mm:ss");
        var query = await Trans_doc.find({
            updatedAt: {
                $gte: dateString_start,
                $lt: dateString_end
            },
            doctype: document_type
        }, {
            html: 0,
            pdfSize: 0,
            hash_html: 0,
            __v: 0,
            path: 0,
            path_pdf_original: 0,
            path_pdf_sign: 0,
            path_hash_original: 0,
            path_pdfhashsign: 0,
            id_flow_tmp: 0,
            "flow.actor.sign_base64": 0,
            "flow.action_detail.sign_base64": 0
        }).sort({
            updatedAt: -1
        })
        if (query.length != 0) {
            return [true, query]
        }else{
            return [false, 'Not Found']
        }
    } catch (error) {
        console.log(error)
        return [false, error.message]
    }
};

var func_get_doc_type = async function (keyword,connectiondb) {
    try{
        if (connectiondb != null) { await connonsql(connectiondb) }
        var query = await Doc_typeSchema.find({keyword:keyword}).select({
            "_id" : 0
        })
        if (query.length == 0){
            return [400,'Not Found']
        }
        return [200,query[0]]
    }
    catch (error) {
        console.log(error)
        return [400,error.message]
    }
}

var func_get_doc_id_ref = async function (doc_id,connectiondb) {
    try{
        if (connectiondb != null) { await connonsql(connectiondb) }
        var query = await Doc_typ_refeSchema.find({document_id:doc_id}).select({
            "_id" : 0
        })
       
        return [200,query]
    }
    catch (error) {
        console.log(error)
        return [400,error.message]
    }
}

var func_get_group_id_ref = async function (group_id,keyword,connectiondb) {
    try{
        if (connectiondb != null) { await connonsql(connectiondb) }
        var query = await transactiongroupModel.findOne(
            {
                $and:[
                    {_id : group_id},
                    {list_transaction:{$elemMatch: {doctype: keyword}}}
                ]
            }).select({
                "_id" : 0
            })
        return [200,query]
    }
    catch (error) {
        console.log(error)
        return [400,error.message]
    }
}

var func_get_all_doc_type = async function (connectiondb) {
    try{
        if (connectiondb != null) { await connonsql(connectiondb) }
        var query = await Doc_typeSchema.find().select({
            "_id" : 0
        })
        if (query.length == 0){
            return [400,'Not Found']
        }
        return [200,query]
    }
    catch (error) {
        console.log(error)
        return [400,error.message]
    }
}


var func_get_doc_type_trans = async function (keyword,connectiondb) {
    try{
        if (connectiondb != null) { await connonsql(connectiondb) }
        var query = await Doc_type_transSchema.find({keyword:keyword}).select({
            "_id" : 0,
            "createdAt" : 0,
            "updatedAt" : 0
        })
        if (query.length == 0){
            return [200,[]]
        }
        return [200,query[0]]
    }
    catch (error) {
        console.log(error)
        return [400,error.message]
    }
}

var func_get_all_doc_recp = async function (account_id,limit,offset) {
    try{
        statuss = 'W'
        list_recp = []
        var query = await Trans_doc.find().skip(offset).limit(limit)
        // console.log('query:',query.length)
        if (query.length == 0){
            return [400,'Not Found']
        }
        for (i=0 ; i<query.length ; i++){
            var flow = JSON.parse(JSON.stringify(query[i].flow))
            for (j=0 ; j<flow.length ; j++){
                if ((flow[j].action_detail).length == 0){
                    // console.log('AAAA')
                    actor = flow[j].actor
                    // console.log('actor:',actor)
                    actor_account_id = flow[j].actor.account_id
                    // console.log('actor_account_id:',actor_account_id)
                    if (actor_account_id == account_id){
                        // console.log('FFFFF')
                        list_recp.push(query[i])
                    }
                }
                else {
                    // console.log('BBB')
                    action_detail = flow[j].action_detail
                    for (k=0 ; k<action_detail.length ; k++){
                        action_account_id = action_detail[k].account_id
                        if (action_account_id == account_id){
                            // console.log('SSSS')
                            list_recp.push(query[i])
                        }
                    }
                    

                }

            }
            // console.log('flow:"',flow)
        }
        return [200,list_recp]
    }
    catch (error) {
        console.log(error)
        return [400,error.message]
    }
}

var func_get_all_doc_recp_filter = async function (account_id,status,limit,offset) {
    try{
        list_recp = []
        var query = await Trans_doc.find().skip(offset).limit(limit)
        // console.log('query:',query.length)
        if (query.length == 0){
            return [400,'Not Found']
        }
        for (i=0 ; i<query.length ; i++){
            var flow = JSON.parse(JSON.stringify(query[i].flow))
            for (j=0 ; j<flow.length ; j++){
                if ((flow[j].action_detail).length == 0){
                    // console.log('AAAA')
                    actor = flow[j].actor
                    status_db = flow[j].status
                    // console.log('status_db:',status_db)
                    actor_account_id = flow[j].actor.account_id
                    // console.log('actor_account_id:',actor_account_id)
                    if (actor_account_id == account_id && status_db == status){
                        // console.log('FFFFF')
                        list_recp.push(query[i])
                    }
                }
                else {
                    // console.log('BBB')
                    action_detail = flow[j].action_detail
                    for (k=0 ; k<action_detail.length ; k++){
                        action_account_id = action_detail[k].account_id
                        if (action_account_id == account_id && status_db == status){
                            // console.log('SSSS')
                            list_recp.push(query[i])
                        }
                    }
                    

                }

            }
            // console.log('flow:"',flow)
        }
        return [200,list_recp]
    }
    catch (error) {
        console.log(error)
        return [400,error.message]
    }
}

var func_get_all_doc_recp_v2 = async function (account_id,limit,offset,connectiondb) {
    try{
        if (connectiondb != null) { await connonsql(connectiondb) }
        list_recp = []
        queryyyy = await Trans_doc.find({
                $or: [{
                    flow: { $elemMatch: { "actor.account_id" : account_id}}
                },{$or : [{
                    flow: { $elemMatch: {action_detail: {$elemMatch: {account_id :account_id}}}}
                }]
                }]
            
            // ,
            // $and : [
            //     {
            //         status : 'ACTIVE'
            //     }
            // ]
            // $or : [{
            //     flow: { $elemMatch: {action_detail: {$elemMatch: {account_id :account_id}}}}
            // }]
            
        },"tracking_id document_id doctype sender_detail status_document status doctype_name step_now step_max subject body createdAt updatedAt").skip(offset).limit(limit).sort({updatedAt: -1})
        return [200,queryyyy]
    }
    catch (error) {
        console.log(error)
        return [400,error.message]
    }
}

var func_get_count_all_doc_recp_v2 = async function (account_id,connectiondb) {
    try{
        if (connectiondb != null) { await connonsql(connectiondb) }
        list_recp = []
        queryyyy = await Trans_doc.find({
            $or: [{
                flow: { $elemMatch: { "actor.account_id" : account_id}}
            },{$or : [{
                flow: { $elemMatch: {action_detail: {$elemMatch: {account_id :account_id}}}}
            }]
            }],
            $and : [
                {
                    status : 'ACTIVE'
                }
            ]
            // $or : [{
            //     flow: { $elemMatch: {action_detail: {$elemMatch: {account_id :account_id}}}}
            // }]
            
        }).countDocuments()

        return [200,queryyyy]
    }
    catch (error) {
        console.log(error)
        return [400,error.message]
    }
}


var func_get_all_doc_recp_filter_v2 = async function (account_id,status,keyword,doc_type,limit,offset,connectiondb) {
    try{
        if (connectiondb != null) { await connonsql(connectiondb) }
        list_recp = []
        // account_id = '12559994504'
        if (!(status == '' || status == null || status === undefined)){
            if (status == 'W'){
                var text_query = {flow: {$elemMatch: {status: status}}}
                var text_query_1 = [{ 
                    "flow": {
                        "$elemMatch":  {
                            "$and": [
                                {
                                    "action_detail" : {"$elemMatch": {"$or":[
                                                                                {
                                                                                    "account_id": account_id,
                                                                                    "status": "Incomplete",
                                                                                    "status_actiondetail": "W",
                                                                                    "$or": [
                                                                                        {
                                                                                            "status_endtask" : false
                                                                                        },
                                                                                        {
                                                                                            "status_endtask" : undefined
                                                                                        }
                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "account_id": account_id,
                                                                                    "status": "Draft",
                                                                                    "status_actiondetail": "W",
                                                                                    "$or": [
                                                                                        {
                                                                                            "status_endtask" : false
                                                                                        },
                                                                                        {
                                                                                            "status_endtask" : undefined
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                    }
                                                        }
                                },
                                {
                                    "status": "W"
                                }
                            ]
                        } 
                    }
                },
                {
                     "flow": {
                        "$elemMatch":  {
                            "$and": [
                                {
                                    "actor" : {"$elemMatch": {"$or":[
                                                                          {
                                                                                "account_id": account_id,
                                                                                "status": "Incomplete"
                                                                          },
                                                                          {
                                                                                "account_id": account_id,
                                                                                "status": "Draft"
                                                                          }
                                                                    ]
                                                               }    
                                                        }
                                },
                                {
                                    "status": "W"
                                }
                            ]
                        } 
                    }
                }
                ]
                var text_query_2 = {"status_document": {$ne:"R"}}
            }
            else if (status == 'Y'|| status == 'R'|| status == 'N'){
                // console.log('status',status)
                var text_query = {status_document : status}
                var text_query_1 = [{
                    $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]
                },{
                    $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                    }]
                var text_query_2 = {}
                
            }
            else {
                return [400,'invalid_status']
            } 
            // console.log('set query ') 
            if (!(doc_type == '' || doc_type == null || doc_type === undefined)){
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            text_query_2,
                            {
                                doctype : doc_type
                            },
                            {
                                status : 'ACTIVE'
                            },text_query,
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    subject: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).select({
                        "flow" : 0,
                        "html":0,
                        "input_data":0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            text_query_2,
                            {
                                doctype : doc_type
                            },
                            {
                                status : 'ACTIVE'
                            },text_query,
                        ]
                        
                    }).select({
                        "flow" : 0,
                        "html":0,
                        "input_data":0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                }
            }
            else {
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            text_query_2,
                            {
                                status : 'ACTIVE'
                            },text_query,
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    subject: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).select({
                        "flow" : 0,
                        "html":0,
                        "input_data":0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            text_query_2,
                            {
                                status : 'ACTIVE'
                            },text_query
                        ]
                    }).select({
                        "flow" : 0,
                        "html":0,
                        "input_data":0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                }
            }
        }
        else{
            // console.log('status:',status)
            var text_query_2 = {"status_document": {$ne:"R"}}
            if (!(doc_type == '' || doc_type == null || doc_type === undefined)){
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            text_query_2,
                            {
                                doctype : doc_type
                            },
                            {
                                status : 'ACTIVE'
                            },
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    subject: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).select({
                        "flow" : 0,
                        "html":0,
                        "input_data":0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            text_query_2,
                            {
                                doctype : doc_type
                            },
                            {
                                status : 'ACTIVE'
                            }
                        ]
                        
                    }).select({
                        "flow" : 0,
                        "html":0,
                        "input_data":0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                }
            }
            else {
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            text_query_2,
                            {
                                status : 'ACTIVE'
                            },
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    subject: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).select({
                        "flow" : 0,
                        "html":0,
                        "input_data":0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            text_query_2,
                            {
                                status : 'ACTIVE'
                            }
                        ]
                    }).select({
                        "flow" : 0,
                        "html":0,
                        "input_data":0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
            }
            }
        }
        return [200,query]
    }
    catch (error) {
        console.log(error)
        return [400,error.message]
    }
}

var func_get_all_doc_recp_cancel = async function (account_id,limit,offset,connectiondb) {
    try{
        if (connectiondb != null) { await connonsql(connectiondb) }
        list_recp = []

        queryyyy = await Trans_doc.find({
            $or: [{
                flow: { $elemMatch: { "actor.account_id" : account_id}}
            },{$or : [{
                flow: { $elemMatch: {action_detail: {$elemMatch: {account_id :account_id}}}}
            }]
            }],
            $and : [
                {
                    status : 'CANCEL'
                }
            ]
            // $or : [{
            //     flow: { $elemMatch: {action_detail: {$elemMatch: {account_id :account_id}}}}
            // }]
            
        },"tracking_id document_id doctype sender_detail status_document status doctype_name step_now step_max subject body createdAt updatedAt").skip(offset).limit(limit).sort({updatedAt: -1})

        return [200,queryyyy]
    }
    catch (error) {
        console.log(error)
        return [400,error.message]
    }
}

var func_get_all_doc_recp_filter_v2_haveflow = async function (account_id,status,keyword,doc_type,limit,offset,connectiondb) {
    try{
        if (connectiondb != null) { await connonsql(connectiondb) }
        list_recp = []
        // account_id = '12559994504'
        if (!(status == '' || status == null || status === undefined)){
            if (status == 'W'){
                text_query = {flow: {$elemMatch: {status: status}}}
                text_query_1 = [{ 
                    "flow": {
                        "$elemMatch":  {
                            "$and": [
                                {
                                    "action_detail" : {"$elemMatch": {"$or":[
                                                                                {
                                                                                    "account_id": account_id,
                                                                                    "status": "Incomplete",
                                                                                    "status_actiondetail": "W"
                                                                                 },
                                                                                 {
                                                                                    "account_id": account_id,
                                                                                    "status": "Draft",
                                                                                    "status_actiondetail": "W"
                                                                                 }
                                                                            ]
                                                                       }
                                                        }
                                },
                                {
                                    "status": "W"
                                }
                            ]
                        } 
                    }
                },
                {
                     "flow": {
                        "$elemMatch":  {
                            "$and": [
                                {
                                    "actor" : {"$elemMatch": {"$or":[
                                                                          {
                                                                                "account_id": account_id,
                                                                                "status": "Incomplete"
                                                                          },
                                                                          {
                                                                                "account_id": account_id,
                                                                                "status": "Draft"
                                                                          }
                                                                    ]
                                                               }    
                                                        }
                                },
                                {
                                    "status": "W"
                                }
                            ]
                        } 
                    }
                }
                ]
                text_query_2 = {"status_document": {$ne:"R"}}
            }
            else if (status == 'Y'|| status == 'R'|| status == 'N'){
                text_query = {status_document : status}
                text_query_1 = [{
                    $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]
                },{
                    $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                    }]
                text_query_2 = {}
            }
            else {
                return [400,'invalid_status']
            }  
            if (!(doc_type == '' || doc_type == null || doc_type === undefined)){
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            text_query_2,
                            {
                                doctype : doc_type
                            },
                            {
                                status : 'ACTIVE'
                            },text_query,
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).select({
                        "html":0,
                        "input_data":0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            text_query_2,
                            {
                                doctype : doc_type
                            },
                            {
                                status : 'ACTIVE'
                            },text_query,
                        ]
                        
                    }).select({
                        "html":0,
                        "input_data":0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                }
            }
            else {
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            text_query_2,
                            {$or : [
                                {
                                    doctype: "CS",
                                },
                                {
                                    doctype: "CS_TEST",
                                },
                                {
                                    doctype: "CS_TEST2"
                                }
                            ]},
                            {
                                "status_summary_group" : false
                            },
                            {
                                status : 'ACTIVE'
                            },text_query,
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }
                            ]
                        }
                        ]
                    }).select({
                        "html":0,
                        "input_data":0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                }
                else {
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            text_query_2,
                            {$or : [
                                {
                                    doctype: "CS",
                                },
                                {
                                    doctype: "CS_TEST",
                                },
                                {
                                    doctype: "CS_TEST2"
                                }
                            ]},
                            { 
                                $or : [
                                    {
                                        status_summary_group: false
                                    },
                                    {
                                        status_summary_group: undefined
                                    }
                                ]
                                
                            },
                            {
                                status : 'ACTIVE'
                            },text_query
                        ]
                    }).select({
                        "html":0,
                        "input_data":0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                }
            }
        }
        else{
            if (!(doc_type == '' || doc_type == null || doc_type === undefined)){
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            text_query_2,
                            {
                                doctype : doc_type
                            },
                            {
                                status : 'ACTIVE'
                            },
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).select({
                        "html":0,
                        "input_data":0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            text_query_2,
                            {
                                doctype : doc_type
                            },
                            {
                                status : 'ACTIVE'
                            }
                        ]
                        
                    }).select({
                        "html":0,
                        "input_data":0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                }
            }
            else {
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            text_query_2,
                            {
                                status : 'ACTIVE'
                            },
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).select({
                        "html":0,
                        "input_data":0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            text_query_2,
                            {
                                status : 'ACTIVE'
                            }
                        ]
                    }).select({
                        "html":0,
                        "input_data":0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
            }
            }
        }
        return [200,query]
    }
    catch (error) {
        console.log(error)
        return [400,error.message]
    }
}

var func_get_all_doc_recp_filter_v2_haveflow_v2 = async function (account_id,status,keyword,doc_type,limit,offset,connectiondb) {
    try{
        if (connectiondb != null) { await connonsql(connectiondb) }
        list_recp = []
        // account_id = '12559994504'
        console.log('YYYYYY')
        // doc_type = ['QT','QT_TEST','QT_TEST2']
        if (!(status == '' || status == null || status === undefined)){
            if (status == 'W'){
                text_query = {flow: {$elemMatch: {status: status}}}
                text_query_1 = [{ 
                    "flow": {
                        "$elemMatch":  {
                            "$and": [
                                {
                                    "action_detail" : {"$elemMatch": {"$or":[
                                                                                {
                                                                                    "account_id": account_id,
                                                                                    "status": "Incomplete",
                                                                                    "status_actiondetail": "W"
                                                                                 },
                                                                                 {
                                                                                    "account_id": account_id,
                                                                                    "status": "Draft",
                                                                                    "status_actiondetail": "W"
                                                                                 }
                                                                            ]
                                                                       }
                                                        }
                                },
                                {
                                    "status": "W"
                                }
                            ]
                        } 
                    }
                },
                {
                     "flow": {
                        "$elemMatch":  {
                            "$and": [
                                {
                                    "actor" : {"$elemMatch": {"$or":[
                                                                          {
                                                                                "account_id": account_id,
                                                                                "status": "Incomplete"
                                                                          },
                                                                          {
                                                                                "account_id": account_id,
                                                                                "status": "Draft"
                                                                          }
                                                                    ]
                                                               }    
                                                        }
                                },
                                {
                                    "status": "W"
                                }
                            ]
                        } 
                    }
                }
                ]
                text_query_2 = {"status_document": {$ne:"R"}}
            }
            else if (status == 'Y'|| status == 'R'|| status == 'N'){
                text_query = {status_document : status}
                text_query_1 = [{
                    $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]
                },{
                    $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                    }]
                text_query_2 = {}
            }
            else {
                return [400,'invalid_status']
            }  
            if (!(doc_type == '' || doc_type == null || doc_type === undefined)){
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            text_query_2,
                            {
                                doctype : {$nin: doc_type}
                            },
                            {
                                status : 'ACTIVE'
                            },text_query,
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).select({
                        "html":0,
                        "input_data":0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            text_query_2,
                            {
                                doctype : {$nin: doc_type}
                            },
                            {
                                status : 'ACTIVE'
                            },text_query,
                        ]
                        
                    }).select({
                        "html":0,
                        "input_data":0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                }
            }
            else {
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            text_query_2,
                            {
                                status : 'ACTIVE'
                            },text_query,
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).select({
                        "html":0,
                        "input_data":0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    console.log('XXXXX')
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            text_query_2,
                            {doctype:{$in: ['CS','CS_TEST','CS_TEST2']}},
                            {
                                status : 'ACTIVE'
                            },text_query
                        ]
                    }).select({
                        "html":0,
                        "input_data":0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                }
            }
        }
        else{
            if (!(doc_type == '' || doc_type == null || doc_type === undefined)){
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            text_query_2,
                            {
                                doctype : {$nin: doc_type}
                            },
                            {
                                status : 'ACTIVE'
                            },
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).select({
                        "html":0,
                        "input_data":0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            text_query_2,
                            {
                                doctype : {$nin: doc_type}
                            },
                            {
                                status : 'ACTIVE'
                            }
                        ]
                        
                    }).select({
                        "html":0,
                        "input_data":0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                }
            }
            else {
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            text_query_2,
                            {
                                status : 'ACTIVE'
                            },
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).select({
                        "html":0,
                        "input_data":0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            text_query_2,
                            {
                                status : 'ACTIVE'
                            }
                        ]
                    }).select({
                        "html":0,
                        "input_data":0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
            }
            }
        }
        return [200,query]
    }
    catch (error) {
        console.log(error)
        return [400,error.message]
    }
}

var func_get_all_doc_recp_filter_v2_old = async function (account_id,status,keyword,doc_type,limit,offset) {
    try{
        list_recp = []
        // account_id = '12559994504'
        if (!(status == '' || status == null || status === undefined)){
            if (status == 'W'){
                text_query = {flow: {$elemMatch: {status: status}}}
                text_query_1 = [{
                    $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id,status: "W","action_detail.status":  "Incomplete"}}}
                    ]                      
                },{
                    $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id,status: "W","action_detail.status":  "Draft"}}}
                    ]                      
                },{
                    $and: [{flow: {$elemMatch: {"actor.account_id": account_id,status: "W","actor.status":  "Incomplete"}}}
                    ] 
                },{
                    $and: [{flow: {$elemMatch: {"actor.account_id": account_id,status: "W","actor.status":  "Draft"}}}
                    ] 
                }
                ]
            }
            else if (status == 'Y'|| status == 'R'|| status == 'N'){
                text_query = {status_document : status}
                text_query_1 = [{
                    $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]
                },{
                    $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                    }]
            }
            else {
                return [400,'invalid_status']
            }            
            if (!(doc_type == '' || doc_type == null || doc_type === undefined)){
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    var query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            {
                                doctype : doc_type
                            },
                            {
                                status : 'ACTIVE'
                            },text_query,
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    var query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            {
                                doctype : doc_type
                            },
                            {
                                status : 'ACTIVE'
                            },text_query,
                        ]
                        
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                }
            }
            else {
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            {
                                status : 'ACTIVE'
                            },text_query,
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    var query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            {
                                status : 'ACTIVE'
                            },text_query
                        ]
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                }
            }
        }
        else{
            if (!(doc_type == '' || doc_type == null || doc_type === undefined)){
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    var query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            {
                                doctype : doc_type
                            },
                            {
                                status : 'ACTIVE'
                            },
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    var query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            {
                                doctype : doc_type
                            },
                            {
                                status : 'ACTIVE'
                            }
                        ]
                        
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                }
            }
            else {
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    var query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            {
                                status : 'ACTIVE'
                            },
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    var query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            {
                                status : 'ACTIVE'
                            }
                        ]
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
            }
            }
        }
        if (status == 'W'){
            var list_data = []
            for(let i =0 ; i<query.length ; i++){
                var flow = (query[i].flow)
                for(let j =0 ; j<flow.length ; j++){
                    var action_detail = flow[j].action_detail
                    var actor = flow[j].actor
                    // console.log(action_detail.length)
                    if (!(action_detail.length == 0)){
                        for(let k =0 ; k<action_detail.length ; k++){
                            // console.log('ACTION_DETAIL')
                            var account_id_flow = action_detail[k].account_id
                            if (account_id_flow == account_id && flow[j].status == "W" && (action_detail[k].status == "Incomplete" || action_detail[k].status == "Draft") && flow[j].stepnow_actiondetail == action_detail[k].step){
                                // console.log(list_data.some(item => item === query[i]));
                                if (list_data.some(item => item === query[i]) == false){ //เช็คว่ามี json data ซ้ำไหมใน Array นี้
                                    // var new_query = JSON.parse(JSON.stringify(query[i]))
                                    // delete (new_query['flow'])
                                    // list_data.push(new_query)
                                    list_data.push(query[i])
                                }
                                
                            }
                        }
                    }
                    else{
                        for(let k =0 ; k<actor.length ; k++){
                            // console.log('ACTOR')
                            var account_id_flow_ac = actor[k].account_id
                            if (account_id_flow_ac == account_id && flow[j].status == "W" && (actor[k].status == "Incomplete" || actor[k].status == "Draft")){ //เช็คว่ามี json data ซ้ำไหมใน Array นี้
                                // console.log(list_data.some(item => item === query[i]));
                                if (list_data.some(item => item === query[i]) == false){
                                    // var new_query = JSON.parse(JSON.stringify(query[i]))
                                    // delete (new_query['flow'])
                                    // list_data.push(new_query)
                                    list_data.push(query[i])
                                }
                            }
                        }
                    }
                    
                }
            }
        }
        else{
            list_data = query
        }
        return [200,list_data]
    }
    catch (error) {
        console.log(error)
        return [400,error.message]
    }
}


var func_count_get_all_doc_recp_filter_v2 = async function (account_id,status,keyword,doc_type,connectiondb) {
    try{
        if (connectiondb != null) { await connonsql(connectiondb) }
        list_recp = []
        // account_id = '12559994504'
        
        if (status == 'W'){
            text_query = {flow:{ $elemMatch: { "actor.account_id" : account_id,status: status}}}
            // console.log('text_query:',text_query)
        }
        else if (status == 'Y'|| status == 'R'|| status == 'N'){
            text_query = {status_document : status}
            // console.log('text_query:',text_query)
        }
        else if (status == '' || status == null || status === undefined){
            text_query = {flow:{ $elemMatch: { "actor.account_id" : account_id}}}
            // console.log('text_query:',text_query)
        }
        
        if (!(doc_type == '' || doc_type == null || doc_type === undefined)){
            if (!(keyword == '' || keyword == null || keyword === undefined)){
                query = await Trans_doc.find({
                    $or: [{
                        flow: { $elemMatch: { "actor.account_id" : account_id }}
                    },{$or : [{
                        flow: { $elemMatch: {action_detail: {$elemMatch: {account_id :account_id}}}}
                    }]
                    }],
                    $and : [
                        {
                            doctype : doc_type
                        },
                        {
                            status : 'ACTIVE'
                        },text_query,
                        {$or:[
                            {
                                doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                            },
                            {
                                document_id: { $regex: '.*' + keyword + '.*' }
                            },
                            {
                                subject: { $regex: '.*' + keyword + '.*' }
                            },
                            {
                                'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                            },
                            {
                                'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                            },
                            {
                                'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                            },
                            {
                                'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                            },
                            {
                                'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                            }

                        ]
                    }
                    ]
                    
                }).countDocuments()
                
            }
            else {
                query = await Trans_doc.find({
                    $or: [{
                        flow: { $elemMatch: { "actor.account_id" : account_id }}
                    },{$or : [{
                        flow: { $elemMatch: {action_detail: {$elemMatch: {account_id :account_id}}}}
                    }]
                    }],
                    $and : [
                        {
                            doctype : doc_type
                        },
                        {
                            status : 'ACTIVE'
                        },text_query
                    ]
                    
                }).countDocuments()
            }
    
        }
        else {
            if (!(keyword == '' || keyword == null || keyword === undefined)){
                query = await Trans_doc.find({
                    $or: [{
                        flow: { $elemMatch: { "actor.account_id" : account_id }}
                    },{$or : [{
                        flow: { $elemMatch: {action_detail: {$elemMatch: {account_id :account_id}}}}
                    }]
                    }],
                    $and : [
                        {
                            status : 'ACTIVE'
                        },text_query,
                        {$or:[
                            {
                                doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                            },
                            {
                                document_id: { $regex: '.*' + keyword + '.*' }
                            },
                            {
                                subject: { $regex: '.*' + keyword + '.*' }
                            },
                            {
                                'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                            },
                            {
                                'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                            },
                            {
                                'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                            },
                            {
                                'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                            },
                            {
                                'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                            }

                        ]
                    }
                    ]
                    
                }).countDocuments()
                
            }
            else {
                query = await Trans_doc.find({
                    $or: [{
                        flow: { $elemMatch: { "actor.account_id" : account_id }}
                    },{$or : [{
                        flow: { $elemMatch: {action_detail: {$elemMatch: {account_id :account_id}}}}
                    }]
                    }],
                    $and : [
                        {
                            status : 'ACTIVE'
                        },text_query
                    ]
                    
                }).countDocuments()
            }
        }

            

        return [200,query]
    }
    catch (error) {
        console.log(error)
        return [400,error.message]
    }
}

var func_get_all_doc_recp_search = async function (account_id,keyword,doc_type,status,limit,offset,connectiondb) {
    try{
        if (connectiondb != null) { await connonsql(connectiondb) }
        list_recp = []
        // account_id = '1567594420'
        if (!(status == '' || status == null || status === undefined)){
            if (status == 'W'){
                // console.log('XXXXX')
                text_query = {flow: {$elemMatch: {status: status}}}
                text_query_1 = [{ 
                    "flow": {
                        "$elemMatch":  {
                            "$and": [
                                {
                                    "action_detail" : {"$elemMatch": {"$or":[
                                                                                {
                                                                                    "account_id": account_id,
                                                                                    "status": "Incomplete",
                                                                                    "status_actiondetail": "W",
                                                                                    "$or": [
                                                                                        {
                                                                                            "status_endtask" : false
                                                                                        },
                                                                                        {
                                                                                            "status_endtask" : undefined
                                                                                        }
                                                                                    ]
                                                                                 },
                                                                                 {
                                                                                    "account_id": account_id,
                                                                                    "status": "Draft",
                                                                                    "status_actiondetail": "W",
                                                                                    "$or": [
                                                                                        {
                                                                                            "status_endtask" : false
                                                                                        },
                                                                                        {
                                                                                            "status_endtask" : undefined
                                                                                        }
                                                                                    ]
                                                                                 }
                                                                            ]
                                                                       }
                                                        }
                                },
                                {
                                    "status": "W"
                                }
                            ]
                        } 
                    }
                },
                {
                     "flow": {
                        "$elemMatch":  {
                            "$and": [
                                {
                                    "actor" : {"$elemMatch": {"$or":[
                                                                          {
                                                                                "account_id": account_id,
                                                                                "status": "Incomplete"
                                                                          },
                                                                          {
                                                                                "account_id": account_id,
                                                                                "status": "Draft"
                                                                          }
                                                                    ]
                                                               }    
                                                        }
                                },
                                {
                                    "status": "W"
                                }
                            ]
                        } 
                    }
                }
                ]
            }
            else if (status == 'Y'|| status == 'R'|| status == 'N'){
                text_query = {status_document : status}
                text_query_1 = [{
                    $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]
                },{
                    $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                    }]
            }
            else {
                return [400,'invalid_status']
            }            
            if (!(doc_type == '' || doc_type == null || doc_type === undefined)){
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            {
                                doctype : doc_type
                            },text_query,
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    subject: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            {
                                doctype : doc_type
                            },text_query
                        ]
                        
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                }
            }
            else {
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            text_query,
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    subject: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            text_query
                        ]
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                }
            }
        }
        else{
            if (!(doc_type == '' || doc_type == null || doc_type === undefined)){
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            {
                                doctype : doc_type
                            },
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    subject: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            {
                                doctype : doc_type
                            }
                        ]
                        
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                }
            }
            else {
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    subject: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }]
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
            }
            }
        }
        
        return [200,query]
    }
    catch (error) {
        console.log(error)
        return [400,error.message]
    }
}

var func_get_all_doc_recp_search_cancel = async function (account_id,keyword,doc_type,status,limit,offset,connectiondb) {
    try{
        if (connectiondb != null) { await connonsql(connectiondb) }
        list_recp = []
        // account_id = '1567594420'
        
        if (!(status == '' || status == null || status === undefined)){
            if (status == 'W'){
                text_query = {flow: {$elemMatch: {status: status}}}
                text_query_1 = [{ 
                    "flow": {
                        "$elemMatch":  {
                            "$and": [
                                {
                                    "action_detail" : {"$elemMatch": {"$or":[
                                                                                {
                                                                                    "account_id": account_id,
                                                                                    "status": "Incomplete",
                                                                                    "status_actiondetail": "W"
                                                                                 },
                                                                                 {
                                                                                    "account_id": account_id,
                                                                                    "status": "Draft",
                                                                                    "status_actiondetail": "W"
                                                                                 }
                                                                            ]
                                                                       }
                                                        }
                                },
                                {
                                    "status": "W"
                                }
                            ]
                        } 
                    }
                },
                {
                     "flow": {
                        "$elemMatch":  {
                            "$and": [
                                {
                                    "actor" : {"$elemMatch": {"$or":[
                                                                          {
                                                                                "account_id": account_id,
                                                                                "status": "Incomplete"
                                                                          },
                                                                          {
                                                                                "account_id": account_id,
                                                                                "status": "Draft"
                                                                          }
                                                                    ]
                                                               }    
                                                        }
                                },
                                {
                                    "status": "W"
                                }
                            ]
                        } 
                    }
                }
                ]
            }
            else if (status == 'Y'|| status == 'R'|| status == 'N'){
                text_query = {status_document : status}
                text_query_1 = [{
                    $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]
                },{
                    $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                    }]
            }
            else {
                return [400,'invalid_status']
            }            
            if (!(doc_type == '' || doc_type == null || doc_type === undefined)){
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            {
                                "status": 'CANCEL'
                            },
                            {
                                doctype : doc_type
                            },text_query,
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    subject: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            {
                                "status": 'CANCEL'
                            },
                            {
                                doctype : doc_type
                            },text_query
                        ]
                        
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                }
            }
            else {
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            {
                                "status": 'CANCEL'
                            },
                            text_query,
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    subject: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            {
                                "status": 'CANCEL'
                            },
                            text_query
                        ]
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                }
            }
        }
        else{
            if (!(doc_type == '' || doc_type == null || doc_type === undefined)){
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            {
                                "status": 'CANCEL'
                            },
                            {
                                doctype : doc_type
                            },
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    subject: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            {
                                "status": 'CANCEL'
                            },
                            {
                                doctype : doc_type
                            }
                        ]
                        
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                }
            }
            else {
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            {
                                "status": 'CANCEL'
                            },
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    subject: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and:[
                                {
                                    "status": 'CANCEL'
                                }
                            ]
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
            }
            }
        }
        
        return [200,query]
    }
    catch (error) {
        console.log(error)
        return [400,error.message]
    }
}


var func_get_count_all_doc_recp_search = async function (account_id,keyword,doc_type,status,connectiondb) {
    try{
        if (connectiondb != null) { await connonsql(connectiondb) }
        list_recp = []
        // account_id = '1567594420'
        // console.log('doc_type:',doc_type)
        if (!(doc_type == '' || doc_type == null || doc_type === undefined)){
            query = await Trans_doc.find({
                $or: [{
                    flow: { $elemMatch: { "actor.account_id" : account_id}}
                },{$or : [{
                    flow: { $elemMatch: {action_detail: {$elemMatch: {account_id :account_id}}}}
                }]
                }],
                $and : [{
                    doctype : doc_type
                },
                {
                    status : 'ACTIVE'
                }],
                $or :  [{$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }]
                
            }).countDocuments()
        }
        else {
            query = await Trans_doc.find({
                $or: [{
                    flow: { $elemMatch: { "actor.account_id" : account_id }}
                },{$or : [{
                    flow: { $elemMatch: {action_detail: {$elemMatch: {account_id :account_id}}}}
                }]
                }],
                $and : [
                {
                    status : 'ACTIVE'
                }],
                $and :  [{$or:[
                    {
                        doctype: { $regex: '.*' + keyword + '.*' }
                    },
                    {
                        document_id: { $regex: '.*' + keyword + '.*' }
                    },
                    {
                        'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                    },
                    {
                        'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                    },
                    {
                        'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                    },
                    {
                        'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                    },
                    {
                        'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                    }

                ]
            }]
                
            }).countDocuments()
        }
        return [200,query]
    }
    catch (error) {
        console.log(error)
        return [400,error.message]
    }
}


var func_get_all_doc_recp_search_datetime = async function (account_id,datetime_start,datetime_end,keyword,doc_type,status,limit,offset,connectiondb) {
    try{
        if (connectiondb != null) { await connonsql(connectiondb) }
        list_recp = []
        
        if (!(status == '' || status == null || status === undefined)){
            if (status == 'W'){
                text_query = {flow: {$elemMatch: {status: status}}}
                text_query_1 = [{ 
                    "flow": {
                        "$elemMatch":  {
                            "$and": [
                                {
                                    "action_detail" : {"$elemMatch": {"$or":[
                                                                                {
                                                                                    "account_id": account_id,
                                                                                    "status": "Incomplete",
                                                                                    "status_actiondetail": "W"
                                                                                 },
                                                                                 {
                                                                                    "account_id": account_id,
                                                                                    "status": "Draft",
                                                                                    "status_actiondetail": "W"
                                                                                 }
                                                                            ]
                                                                       }
                                                        }
                                },
                                {
                                    "status": "W"
                                }
                            ]
                        } 
                    }
                },
                {
                     "flow": {
                        "$elemMatch":  {
                            "$and": [
                                {
                                    "actor" : {"$elemMatch": {"$or":[
                                                                          {
                                                                                "account_id": account_id,
                                                                                "status": "Incomplete"
                                                                          },
                                                                          {
                                                                                "account_id": account_id,
                                                                                "status": "Draft"
                                                                          }
                                                                    ]
                                                               }    
                                                        }
                                },
                                {
                                    "status": "W"
                                }
                            ]
                        } 
                    }
                }
                ]
            }
            else if (status == 'Y'|| status == 'R'|| status == 'N'){
                text_query = {status_document : status}
                text_query_1 = [{
                    $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]
                },{
                    $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                    }]
            }
            else {
                return [400,'invalid_status']
            }   
        
            if (!(doc_type == '' || doc_type == null || doc_type === undefined)){
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            {
                                doctype : doc_type
                            },
                            {
                                createdAt : {
                                    $gte: datetime_start,
                                    $lt: datetime_end
                                }
                            },
                            {
                                status : 'ACTIVE'
                            },
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    subject: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            {
                                doctype : doc_type
                            },
                            {
                                createdAt : {
                                    $gte: datetime_start,
                                    $lt: datetime_end
                                }
                            },
                            {
                                status : 'ACTIVE'
                            }
                        ]
                        
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                }
        
            }
            else {
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            {
                                status : 'ACTIVE'
                            },
                            {
                                createdAt : {
                                    $gte: datetime_start,
                                    $lt: datetime_end
                                }
                            },
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    subject: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            {
                                status : 'ACTIVE'
                            },
                            {
                                createdAt : {
                                    $gte: datetime_start,
                                    $lt: datetime_end
                                }
                            }
                        ]
                        
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                }
            }
        }
        else{
            if (!(doc_type == '' || doc_type == null || doc_type === undefined)){
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            {
                                doctype : doc_type
                            },
                            {
                                createdAt : {
                                    $gte: datetime_start,
                                    $lt: datetime_end
                                }
                            },
                            {
                                status : 'ACTIVE'
                            },
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    subject: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            {
                                doctype : doc_type
                            },
                            {
                                createdAt : {
                                    $gte: datetime_start,
                                    $lt: datetime_end
                                }
                            },
                            {
                                status : 'ACTIVE'
                            }
                        ]
                        
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                }
        
            }
            else {
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            {
                                status : 'ACTIVE'
                            },
                            {
                                createdAt : {
                                    $gte: datetime_start,
                                    $lt: datetime_end
                                }
                            },
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    subject: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            {
                                status : 'ACTIVE'
                            },
                            {
                                createdAt : {
                                    $gte: datetime_start,
                                    $lt: datetime_end
                                }
                            }
                        ]
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                }
            }
        }
        return [200,query]
    }
    catch (error) {
        console.log(error)
        return [400,error.message]
    }
}

var func_get_all_doc_recp_search_datetime_cancel = async function (account_id,datetime_start,datetime_end,keyword,doc_type,status,limit,offset,connectiondb) {
    try{
        if (connectiondb != null) { await connonsql(connectiondb) }
        list_recp = []
        
        if (!(status == '' || status == null || status === undefined)){
            if (status == 'W'){
                text_query = {flow: {$elemMatch: {status: status}}}
                text_query_1 = [{ 
                    "flow": {
                        "$elemMatch":  {
                            "$and": [
                                {
                                    "action_detail" : {"$elemMatch": {"$or":[
                                                                                {
                                                                                    "account_id": account_id,
                                                                                    "status": "Incomplete",
                                                                                    "status_actiondetail": "W"
                                                                                 },
                                                                                 {
                                                                                    "account_id": account_id,
                                                                                    "status": "Draft",
                                                                                    "status_actiondetail": "W"
                                                                                 }
                                                                            ]
                                                                       }
                                                        }
                                },
                                {
                                    "status": "W"
                                }
                            ]
                        } 
                    }
                },
                {
                     "flow": {
                        "$elemMatch":  {
                            "$and": [
                                {
                                    "actor" : {"$elemMatch": {"$or":[
                                                                          {
                                                                                "account_id": account_id,
                                                                                "status": "Incomplete"
                                                                          },
                                                                          {
                                                                                "account_id": account_id,
                                                                                "status": "Draft"
                                                                          }
                                                                    ]
                                                               }    
                                                        }
                                },
                                {
                                    "status": "W"
                                }
                            ]
                        } 
                    }
                }
                ]
            }
            else if (status == 'Y'|| status == 'R'|| status == 'N'){
                text_query = {status_document : status}
                text_query_1 = [{
                    $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]
                },{
                    $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                    }]
            }
            else {
                return [400,'invalid_status']
            }   
        
            if (!(doc_type == '' || doc_type == null || doc_type === undefined)){
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            {
                                doctype : doc_type
                            },
                            {
                                createdAt : {
                                    $gte: datetime_start,
                                    $lt: datetime_end
                                }
                            },
                            {
                                status : 'CANCEL'
                            },
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            {
                                doctype : doc_type
                            },
                            {
                                createdAt : {
                                    $gte: datetime_start,
                                    $lt: datetime_end
                                }
                            },
                            {
                                status : 'CANCEL'
                            }
                        ]
                        
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                }
        
            }
            else {
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            {
                                status : 'CANCEL'
                            },
                            {
                                createdAt : {
                                    $gte: datetime_start,
                                    $lt: datetime_end
                                }
                            },
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    query = await Trans_doc.find({
                        $or: text_query_1,
                        $and : [
                            {
                                status : 'CANCEL'
                            },
                            {
                                createdAt : {
                                    $gte: datetime_start,
                                    $lt: datetime_end
                                }
                            }
                        ]
                        
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                }
            }
        }
        else{
            if (!(doc_type == '' || doc_type == null || doc_type === undefined)){
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            {
                                doctype : doc_type
                            },
                            {
                                createdAt : {
                                    $gte: datetime_start,
                                    $lt: datetime_end
                                }
                            },
                            {
                                status : 'CANCEL'
                            },
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            {
                                doctype : doc_type
                            },
                            {
                                createdAt : {
                                    $gte: datetime_start,
                                    $lt: datetime_end
                                }
                            },
                            {
                                status : 'CANCEL'
                            }
                        ]
                        
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                }
        
            }
            else {
                if (!(keyword == '' || keyword == null || keyword === undefined)){
                    query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            {
                                status : 'CANCEL'
                            },
                            {
                                createdAt : {
                                    $gte: datetime_start,
                                    $lt: datetime_end
                                }
                            },
                            {$or:[
                                {
                                    doctype: { $regex: '.*' + keyword + '.*' }  // regex is like
                                },
                                {
                                    document_id: { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_th': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.first_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.last_name_eng': { $regex: '.*' + keyword + '.*' }
                                },
                                {
                                    'sender_detail.thai_email': { $regex: '.*' + keyword + '.*' }
                                }

                            ]
                        }
                        ]
                        
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                    
                }
                else {
                    query = await Trans_doc.find({
                        $or: [{
                            $and: [{flow: {$elemMatch: {"action_detail.account_id": account_id}}}]                      
                        },{
                            $and: [{flow: {$elemMatch: {"actor.account_id": account_id}}}] 
                            }],
                        $and : [
                            {
                                status : 'CANCEL'
                            },
                            {
                                createdAt : {
                                    $gte: datetime_start,
                                    $lt: datetime_end
                                }
                            }
                        ]
                    }).select({
                        "flow" : 0
                    }).skip(offset).limit(limit).sort({updatedAt: -1})
                }
            }
        }
        return [200,query]
    }
    catch (error) {
        console.log(error)
        return [400,error.message]
    }
}


var func_get_count_all_doc_recp_search_datetime = async function (account_id,datetime_start,datetime_end,status,connectiondb) {
    try{
        if (connectiondb != null) { await connonsql(connectiondb) }
        // console.log('account_id:',account_id)
        // console.log('datetime_start:',datetime_start)
        // console.log('datetime_end:',datetime_end)
        list_recp = []
        if (status == 'W'){
            text_query = {flow:{ $elemMatch: { "actor.account_id" : account_id,status: status}}}
            // console.log('text_query:',text_query)
        }
        else if (status == 'Y'|| status == 'R'|| status == 'N'){
            text_query = {status_document : status}
            // console.log('text_query:',text_query)
        }
        else if (status == '' || status == null || status === undefined){
            text_query = {flow:{ $elemMatch: { "actor.account_id" : account_id}}}
            // console.log('text_query:',text_query)
        }
        if (!(datetime_start == '' || datetime_start == null || datetime_start === undefined)){
            query = await Trans_doc.find({
                $or: [{
                    flow: { $elemMatch: { "actor.account_id" : account_id}}
                },{$or : [{
                    flow: { $elemMatch: {action_detail: {$elemMatch: {account_id :account_id}}}}
                }]
                }],
                $and : [{
                    createdAt : {
                        $gte: datetime_start,
                        $lt: datetime_end
                    }
                },
                {
                    status : 'ACTIVE'
                },text_query]
                
            }).countDocuments()
        }
        return [200,query]
    }
    catch (error) {
        console.log(error)
        return [400,error.message]
    }
}


var select_tracking_flow = async function (tracking_id,connectiondb) {
    try{
        if (connectiondb != null) { await connonsql(connectiondb) }
        if (!(tracking_id == '' || tracking_id == null || tracking_id === undefined)){
            query = await Trans_doc.find({tracking_id:tracking_id}).select({
                "_id" : 0
            })
        }
        return [200,query]
    }
    catch (error) {
        console.log(error)
        return [400,error.message]
    }
}

var select_doc_id = async function (doc_id,connectiondb) {
    try{
        if (connectiondb != null) { await connonsql(connectiondb) }
        if (!(doc_id == '' || doc_id == null || doc_id === undefined)){
            query = await Trans_doc.find({document_id:doc_id},'_id')
        }
        return [200,query]
    }
    catch (error) {
        console.log(error)
        return [400,error.message]
    }
}

var func_get_condition_presale = async function (connectiondb) {
    try{
        if (connectiondb != null) { await connonsql(connectiondb) }
        var query = await ConditionsSchema.findOne({_id:'60a49bea02deae02769a6ab2'}).select({
            "_id" : 0,
            "createdAt" : 0,
            "updatedAt" : 0
        })
        if (query == null){
            return [false, 'Not found']
        }
        else{
            return [true,query]
        }
        
    }
    catch (error) {
        console.log(error)
        return [400,error.message]
    }
}

var func_get_flow_presale_v2 = async function (doctype,type_of_team,type_of_flow,connectiondb) {
    try{
        if (connectiondb != null) { await connonsql(connectiondb) }
        var query = await FlowSchema.findOne(
            {
                $and:[
                        {'type_of_team': type_of_team},
                        {'type_of_flow': type_of_flow},
                        {'doctype': doctype}
                    ]
            }
        )
        if (query == null){
            return [false, 'Not found']
        }
        else{
            return [true,query]
        }
        
    }
    catch (error) {
        console.log(error)
        return [400,error.message]
    }
}

var find_file_document_transaction = async function (transaction_id,connectiondb) {
    try{
        if (connectiondb != null) { await connonsql(connectiondb) }
        var query = await Trans_doc.findOne({_id:transaction_id},"document_id doctype doctype_name path_pdf_sign subject")
        if (query == null){
            return [false, 'Not found']
        }
        else{
            return [true,query]
        }
        
    }
    catch (error) {
        console.log(error)
        return [400,error.message]
    }
}

var find_file_attach = async function (transaction_id,connectiondb) {
    try{
        if (connectiondb != null) { await connonsql(connectiondb) }
        var query = await attachfileModel.findOne({transaction_id:transaction_id},"path_folder detail")
        if (query == null){
            return [false, 'Not found']
        }
        else{
            return [true,query]
        }
        
    }
    catch (error) {
        console.log(error)
        return [400,error.message]
    }
}

var self = module.exports = {
    // func_get_account,
    // func_get_citizenlogin_bizpaperless,
    func_get_doc_type,
    func_get_doc_type_trans,
    func_get_all_doc_type,
    func_get_all_doc_recp,
    func_get_all_doc_recp_filter,
    func_get_all_doc_recp_v2,
    func_get_all_doc_recp_filter_v2,
    func_get_all_doc_recp_search,
    func_get_all_doc_recp_search_datetime,
    func_get_count_all_doc_recp_v2,
    func_count_get_all_doc_recp_filter_v2,
    func_get_count_all_doc_recp_search,
    func_get_count_all_doc_recp_search_datetime,
    select_tracking_flow,
    func_get_doc_id_ref,
    func_get_group_id_ref,
    FuncGetDocumentAllDateRange,
    func_get_all_doc_recp_filter_v2_haveflow,
    func_get_all_doc_recp_cancel,
    func_get_all_doc_recp_search_cancel,
    func_get_all_doc_recp_search_datetime_cancel,
    select_doc_id,
    func_get_condition_presale,
    find_file_document_transaction,
    func_get_flow_presale_v2,
    document_type_2,
    find_file_attach,
    func_get_all_doc_recp_filter_v2_haveflow_v2,
    FuncGetDocumentAllDateRange_v2
}