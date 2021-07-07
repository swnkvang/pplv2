require('../config/lib')
require('../config/global')
const middleware = require('../method/middleware')
const document_func = require('../method/document.func');
const actiondb_transac = require('../database/actiondb_transaction')
const onebox_process = require('../method/onebox_process')
const onebox_func = require('../function/onebox_func')
const trans_find = require('../database/actiondb_transaction')
const func_replace = require('../function/func_replace')

const Update_db = require('../database/db_update');
require('moment/locale/th')
const router = express.Router();
router.use(middleware)

router.post("/update_doc_type", async function (req, res) {
    try{
        let json_data = req.json_data
        let connectiondb = json_data.db_connect

        type_name = 'Quotation'
        keyword = 'QT'
        type =  ''
        detail = ''
        dept_role = {
            dept_name: "",
            dept_id: "",
            role_name: "",
            role_id: ""
        },
        permission_view = [
            {
              "role_name": "Paperless Designer Executive",
              "role_id": "22e20650-11c9-11ea-a9c6-b57df9bb98a9",
              "dept_id": "1caac7d0-4e18-11ea-af90-ff882964fa1e",
              "dept_name": "ส่วนงาน พัฒนาธุรกิจ Business Paperless"
            }
        ]
        prefix = 'YYYYMM'
        digit = 6
        createBy = 'farrutt'
        updateBy = 'farrutt'
        
        result = await document_func.update_doc_type(type_name, keyword, type, detail, dept_role, permission_view, prefix, digit, createBy, updateBy,connectiondb)
        return res.status(200).json({
            result: "OK",
            messageText: 'SUCCESS',
            status_Code: 200
        });
        
    }
    catch (error) {
        console.log('ERRORRR',error.stack)
        return res.status(400).json({
            result: "ER",
            messageText: error.message,
            status_Code: 400
        });
    }
});

router.get("/get_all_document_type", async function (req, res) {
    try{
        let json_data = req.json_data
        let connectiondb = json_data.db_connect
        result = await document_func.get_all_doc_type(connectiondb)
        return res.status(200).json({
            result: "OK",
            messageText: result[1],
            status_Code: 200
        });
        
    }
    catch (error) {
        console.log('ERRORRR',error.stack)
        return res.status(400).json({
            result: "ER",
            messageText: error.message,
            status_Code: 400
        });
    }


});

router.get("/get_document_type", async function (req, res) {
    try{
        let json_data = req.json_data
        let connectiondb = json_data.db_connect
        // var document_type = req.body.document_type

        // console.log('connectiondb:',connectiondb)
        var document_type = req.query.document_type
        result = await document_func.get_doc_type(document_type,connectiondb)
        return res.status(200).json({
            result: "OK",
            messageText: result[1],
            status_Code: 200
        });
        
    }
    catch (error) {
        console.log('ERRORRR',error.stack)
        return res.status(400).json({
            result: "ER",
            messageText: error.message,
            status_Code: 400
        });
    }
    

});

router.post("/update_ref_doc_id", async function (req, res) {
    try{
        let json_data = req.json_data
        let connectiondb = json_data.db_connect
        var body = req.body
        var keyword = body.keyword
        var ref_doc_id = body.ref_doc_id
        var group_id = body.group_id


        result = await document_func.update_doc_type_trans_ref(keyword,ref_doc_id,group_id,connectiondb)
        return res.status(200).json({
            result: "OK",
            messageText: result[1],
            status_Code: 200
        });
        
    }
    catch (error) {
        console.log('ERRORRR',error.stack)
        return res.status(400).json({
            result: "ER",
            messageText: error.message,
            status_Code: 400
        });
    }
});

router.post("/cancel_document", async function (req, res) {
    try{
        let json_data = req.json_data
        let connectiondb = json_data.db_connect
        var body = req.body
        var transaction_id = body.transaction_id
        var user_id = json_data.one_result_data.id
        var result_delete = await document_func.func_cancel_document_v2(transaction_id,user_id,json_data)
        if (result_delete[0] == true){
            return res.status(200).json({
                result: "OK",
                messageText: result_delete[1],
                status_Code: 200
            });
        }
        else{
            return res.status(400).json({
                result: "ER",
                messageText: result_delete[1],
                status_Code: 400
            });
        }
        
    }
    catch (error) {
        return res.status(400).json({
            result: "ER",
            messageText: error.message,
            status_Code: 400
        });
    }
});

router.post("/test_api",upload.any(), async function (req, res) {
    try{
        let json_data = req.json_data
        let account_id_ppl = json_data.one_result_data.id
        let biz_name = json_data.biz_user_select[0].getbiz.first_name_th
        let connectiondb = json_data.db_connect
        // console.log('connectiondb:',JSON.stringify(connectiondb))

        let access_token = json_data.one_access_token
        let account_id = '167e6aa5cbd243a4b7ea5efe2f431d09'
        // let folder_id = '9ffce997a7be2efaecd87f5c7935e2dd' //paperless
        // let folder_id = '7ee10c0f204d4731e206e35e1d80aad7' //inet
        let folder_id = '57072c01e2bee0a0c31e4e41773c50ac' //Test_dartz
        // let parent_folder_id = '9ffce997a7be2efaecd87f5c7935e2dd' //paperless
        let parent_folder_id = '7ee10c0f204d4731e206e35e1d80aad7' //inet
        let folder_name = 'Test_dartz'

        let folder_set_per = '61042ee3d62c1c318f2d67edcf8c26c1'
        let business_id_to_setting = '03'
        let account_id_to_setting = []
        let department_id_to_setting = []
        let transaction_id = '6092396a572fe800131bbff2'
        const files_req = req.files
        // var result_onebox = await onebox_func.get_account_byuserid(access_token,connectiondb)
        // var result_onebox = await onebox_func.get_mainfolder_byaccountid(account_id,account_id_ppl,connectiondb)
        // var result_onebox = await onebox_func.get_subfolder_onebox(account_id,'f039e06062ef7843f4e071af05afc776')
        // var result_onebox = await onebox_func.create_folder_onebox(account_id,parent_folder_id,folder_name)
        // var result_onebox = await onebox_func.create_folder_with_permission(account_id,folder_name,'03',[],[],parent_folder_id)
        // var result_onebox = await onebox_func.setting_folder_permission(account_id,folder_set_per,business_id_to_setting,account_id_to_setting,department_id_to_setting)
        // var result_onebox = await onebox_process.process_savefile_base64_onebox_test(transaction_id,account_id,folder_id,connectiondb)
        // var result_onebox = await onebox_func.savefile_onebox(account_id,folder_id,files_req[0],account_id_ppl,connectiondb)

        // var result_onebox = await onebox_process.process_savefile_onebox_test('6087b5af1fd941001a15fe93',account_id,folder_id,account_id_ppl,connectiondb)

        // ของจริงงงงงง
        // var result_onebox = await onebox_process.process_savefile_base64_onebox(transaction_id,access_token,account_id_ppl,connectiondb)
        // var result_onebox = await onebox_process.process_savefile_base64_onebox_biz(transaction_id,access_token,biz_name,account_id_ppl,connectiondb)
        // const [a, e] = await Promise.all([onebox_process.process_savefile_base64_onebox('6091fb34dca2eb001b3f319a',access_token,account_id_ppl,connectiondb), onebox_process.process_savefile_base64_onebox_biz('6091fb34dca2eb001b3f319a',access_token,biz_name,account_id_ppl,connectiondb)]);
        // var result_onebox = await onebox_process.process_savefile_base64_onebox_all(transaction_id,access_token,biz_name,account_id_ppl,connectiondb)
        // var result_onebox = await onebox_process.process_save_attachfile_base64_onebox('6091fb34dca2eb001b3f319a',access_token,account_id_ppl,connectiondb)
        // var result_onebox = await onebox_process.process_save_attachfile_base64_onebox_biz('6091fb34dca2eb001b3f319a',access_token,biz_name,account_id_ppl,connectiondb)
        // const [b, c] = await Promise.all([onebox_process.process_save_attachfile_base64_onebox('6091fb34dca2eb001b3f319a',access_token,account_id_ppl,connectiondb), onebox_process.process_save_attachfile_base64_onebox_biz('6091fb34dca2eb001b3f319a',access_token,biz_name,account_id_ppl,connectiondb)]);

        // var result_replace = await func_replace.replace_characters("ASX abc's   test#s สวัสดีอิยิ์ /*-+    ")
        // console.log('result_replace:',result_replace)

        // res.download('/app/storage/0107544000094/attachfile/2021-05-05/46dd74e4-1811-4bef-b7ae-b447e25da387/' + '86a463bb-8cef-47ef-9710-e035a9f4fe73.pdf', (err) => {
        //     if (err) {
        //       res.status(500).send({
        //         message: "Could not download the file. " + err,
        //       });
        //     }
        //   });

        // return res.status(200).json({
        //     result: "OK",
        //     messageText: 'success',
        //     status_Code: 200
        // });


        // if (result_onebox[0] == true){
        //     return res.status(200).json({
        //         result: "OK",
        //         messageText: result_onebox[1],
        //         status_Code: 200
        //     });
        // }
        // else{
        //     return res.status(400).json({
        //         result: "ER",
        //         messageText: result_onebox[1],
        //         status_Code: 400
        //     });
        // }
    }
    catch (error) {
        console.log('error:',error)
        return res.status(400).json({
            result: "ER",
            messageText: error.message,
            status_Code: 400
        });
    }
});

router.get("/get_document_recipient/:type", async function (req, res) {
    try{
        // var header = req.headers.authorization
        // var token = header.split(' ')[1]
        // var type = req.query.type
        let json_data = req.json_data
        let connectiondb = json_data.db_connect
        var type = req.params.type
        // console.log('connectiondb:',json_data)
        

            // var account_id = '12559994504'
            var account_id = json_data.one_result_data.id
            // console.log('account_id',account_id)
            // console.log('account_id:',account_id)
            
            if (type == 'recipient'){
                var limit = Number(req.query.limit)
                var offset = Number(req.query.offset)
                // var body = req.body
                // var limit = body.limit
                // var offset = body.offset
                // console.log('body:',body)
                // console.log('limit:',limit)
                // console.log('offset:',offset)
                result = await document_func.get_all_doc_recipient(account_id,connectiondb,limit,offset)
                return res.status(200).json({
                    status: true,
                    message: 'success',
                    data: result[1]
                });
            }
            else if (type == 'recipient_filter'){
                // var body = req.body
                // var limit = body.limit
                // var offset = body.offset
                // var status = body.status
                // var doc_type = body.doc_type
                // var keyword = body.keyword
                
                var status = req.query.status
                var doc_type = req.query.doc_type
                var keyword = req.query.keyword
                var limit = Number(req.query.limit)
                var offset = Number(req.query.offset)
                result = await document_func.get_all_doc_recipient_filter(account_id,status,keyword,doc_type,limit,offset,connectiondb)
                return res.status(200).json({
                    status: true,
                    message: 'success',
                    data: result[1]
                });
            }
            else if (type == 'recipient_cancel'){
                // var body = req.body
                // var limit = body.limit
                // var offset = body.offset
                // var status = body.status
                // var doc_type = body.doc_type
                // var keyword = body.keyword
                
                var limit = Number(req.query.limit)
                var offset = Number(req.query.offset)
                result = await document_func.get_all_doc_recipient_cancel(account_id, limit, offset, connectiondb)
                return res.status(200).json({
                    status: true,
                    message: 'success',
                    data: result[1]
                });
            }
            else if (type == 'recipient_search'){
                // var body = req.body
                // var limit = body.limit
                // var offset = body.offset
                // var keyword = body.keyword
                // var doc_type = body.doc_type
                
                // var status = body.status
                var status = req.query.status
                var doc_type = req.query.doc_type
                var keyword = req.query.keyword
                var limit = Number(req.query.limit)
                var offset = Number(req.query.offset)

                // console.log('doc_type:',doc_type)
                // console.log('keyword:',keyword)
                result = await document_func.get_all_doc_recipient_search(account_id,keyword,doc_type,status,limit,offset,connectiondb)
                return res.status(200).json({
                    status: true,
                    message: 'success',
                    data: result[1]
                });
            }
            else if (type == 'recipient_search_cancel'){
                // var body = req.body
                // var limit = body.limit
                // var offset = body.offset
                // var keyword = body.keyword
                // var doc_type = body.doc_type
                
                // var status = body.status
                var status = req.query.status
                var doc_type = req.query.doc_type
                var keyword = req.query.keyword
                var limit = Number(req.query.limit)
                var offset = Number(req.query.offset)

                // console.log('doc_type:',doc_type)
                // console.log('keyword:',keyword)
                result = await document_func.get_all_doc_recipient_search_cancel(account_id,keyword,doc_type,status,limit,offset,connectiondb)
                return res.status(200).json({
                    status: true,
                    message: 'success',
                    data: result[1]
                });
            }
            else if (type == 'recipient_search_date'){
                // var body = req.body
                // var limit = body.limit
                // var offset = body.offset
                // var keyword = body.keyword
                // var doc_type = body.doc_type
                // var datetime = body.datetime

                var datetime = req.query.datetime
                var doc_type = req.query.doc_type
                var keyword = req.query.keyword
                var status = req.query.status
                var limit = Number(req.query.limit)
                var offset = Number(req.query.offset)
                // var status = body.status
                result = await document_func.get_all_doc_recipient_search_datetime(account_id,datetime,keyword,doc_type,status,limit,offset,connectiondb)
                return res.status(200).json({
                    status: true,
                    message: 'success',
                    data: result[1]
                });
            }
            else if (type == 'recipient_search_date_cancel'){
                // var body = req.body
                // var limit = body.limit
                // var offset = body.offset
                // var keyword = body.keyword
                // var doc_type = body.doc_type
                // var datetime = body.datetime

                var datetime = req.query.datetime
                var doc_type = req.query.doc_type
                var keyword = req.query.keyword
                var status = req.query.status
                var limit = Number(req.query.limit)
                var offset = Number(req.query.offset)
                // var status = body.status
                result = await document_func.get_all_doc_recipient_search_datetime_cancel(account_id,datetime,keyword,doc_type,status,limit,offset,connectiondb)
                return res.status(200).json({
                    status: true,
                    message: 'success',
                    data: result[1]
                });
            }
    }
    catch (error) {
        console.log('ERRORRR',error.stack)
        return res.status(400).json({
            result: "ER",
            messageText: error.message,
            status_Code: 400
        });
    }
});

router.get("/get_count_document_recipient/:type", async function (req, res) {
    try{
        // var header = req.headers.authorization
        // var token = header.split(' ')[1]
        // var type = req.query.type
        let json_data = req.json_data
        let connectiondb = json_data.db_connect
        var type = req.params.type
        // console.log('connectiondb:',connectiondb.d)

            // var account_id = '12559994504'
            var account_id = json_data.one_result_data.id
            // console.log('account_id:',account_id)
            
            if (type == 'recipient'){
                result = await document_func.get_count_all_doc_recipient(account_id,connectiondb)
                return res.status(200).json({
                    status: true,
                    message: 'success',
                    data: result[1]
                });
            }
            else if (type == 'recipient_filter'){
                
                var status = req.query.status
                var doc_type = req.query.doc_type
                var keyword = req.query.keyword

                result = await document_func.get_count_all_doc_recipient_filter(account_id,status,keyword,doc_type,connectiondb)
                return res.status(200).json({
                    status: true,
                    message: 'success',
                    data: result[1]
                });
            }
            else if (type == 'recipient_search'){
                var status = req.query.status
                var doc_type = req.query.doc_type
                var keyword = req.query.keyword

                result = await document_func.get_count_all_doc_recipient_search(account_id,keyword,doc_type,status,connectiondb)
                return res.status(200).json({
                    status: true,
                    message: 'success',
                    data: result[1]
                });
            }
            else if (type == 'recipient_search_date'){

                var datetime = req.query.datetime
                var doc_type = req.query.doc_type
                var keyword = req.query.keyword
                var status = req.query.status
                // var status = body.status
                result = await document_func.get_count_all_doc_recipient_search_datetime(account_id,datetime,status,connectiondb)
                return res.status(200).json({
                    status: true,
                    message: 'success',
                    data: result[1]
                });
            }
    }
    catch (error) {
        console.log('ERRORRR',error.stack)
        return res.status(400).json({
            result: "ER",
            messageText: error.message,
            status_Code: 400
        });
    }
});

router.post("/tracking", async function (req, res) {
    try{
        let json_data = req.json_data
        let connectiondb = json_data.db_connect        
        var tracking_id = req.body.tracking_id

        result = await document_func.tracking_flow_document(tracking_id,connectiondb)
        return res.status(200).json({
            result: "OK",
            messageText: result[1],
            status_Code: 200
        });
        
    }
    catch (error) {
        console.log('ERRORRR',error.stack)
        return res.status(400).json({
            result: "ER",
            messageText: error.message,
            status_Code: 400
        });
    }
    

});

router.get("/find_tracking", async function (req, res) {
    try{
        var params = req.query
        let connectiondb = req.json_data.db_connect        
        var transaction_id = params.transaction_id

        result = await actiondb_transac.findflow_in_transaction(connectiondb,transaction_id)
        if (result[0]) {
            return res.status(200).json({
                status: true,
                message: 'success',
                data: result[1]
            })
        } else {
            return res.status(400).json({
                status: false,
                message: resp[2],
                data: result[1]
            })
        }
    }
    catch (error) {
        console.log('ERRORRR',error.stack)
        return res.status(400).json({
            status: false,
            message: error.message,
            data: null
        })
    }
    

});

router.get("/follow_documents", async function (req, res) {
    try{
        var params = req.query
        let connectiondb = req.json_data.db_connect        
        var doc_no = params.doc_no
        let result = await actiondb_transac.find_document_bytracking(connectiondb,doc_no)
        if (result[0]) {
            return res.status(200).json({
                status: true,
                message: 'success',
                data: result[1]
            })
        } else {
            return res.status(400).json({
                status: false,
                message: result[2],
                data: result[1]
            })
        }
    }
    catch (error) {
        console.log('ERRORRR',error.stack)
        return res.status(400).json({
            status: false,
            message: error.message,
            data: null
        })
    }
    

});

module.exports = router