require('../config/lib')
require('../config/global')
const middleware = require('../method/middleware')
const router = express.Router();
router.use(middleware)
const { response } = require('express');

const Flow = require('../method/process_flow');
const db_flow = require('../database/actiondb_flow')
const db_transaction = require('../database/actiondb_transaction')
const func_document = require('../function/func_docuement')
const func_smtp = require('../function/func_smtp')
const db_doctype = require('../database/db_select')
const html = require('../function/func_dataTohtml')


router.post("/to_transaction",async function (req, res) {
    try {
        let json_data = req.json_data
        let dataJson = req.body
        let flow_id = dataJson.flow_id
        let jsonDetail = dataJson.jsonDetail
        let document_type = dataJson.document_type
        let input = dataJson.input
        let actor_update = dataJson.actor_update
        let connectiondb = json_data.db_connect
        let hederbiz = req.headers.taxid
        let sign_info = dataJson.sign_info
        let token = req.headers.authorization
        // let attachfile_id = dataJson.attachfile_id
        let subject = dataJson.subject
        let body = dataJson.body
        let id_workflow = dataJson.id_workflow
        let group_id = dataJson.group_id
        if (group_id === undefined) {
            group_id = ''
        }
        // console.log('json_data',json_data)
        var res_flow = await db_flow.find_flow(connectiondb,flow_id)
        if (res_flow[0]) {
            var resp = await Flow.flow_to_transaction_version4(json_data,res_flow[1],jsonDetail,input,document_type,flow_id,actor_update,hederbiz,sign_info,subject,body,id_workflow,group_id,token)
            if (resp[0]) {
                return res.status(200).json({
                    status: true,
                    message: 'success',
                    data: resp[1]
                })
            } else {
                return res.status(400).json({
                    status: false,
                    message: resp[2],
                    data: resp[1]
                })
            }
           
        } else {
            throw ({
                message: res_flow[1]
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: error.message,
            data: null
        })
    }
    
});

router.post("/update_transaction",async function (req, res) {
    try {
        let json_data = req.json_data
        let dataJson = req.body
        let transaction_id = dataJson.transaction_id
        let json_update = dataJson.json_update
        let input_info = dataJson.input_info
        let sign_info = dataJson.sign_info
        // let attachfile_id = dataJson.attachfile_id
        // let jsonDetail = dataJson.jsonDetail
        let hederbiz = req.headers.taxid
        let token = req.headers.authorization
        // var resp = await Flow.update_flow_transaction(json_data,transaction_id,json_update,input_info,hederbiz,sign_info)
        var resp = await Flow.update_flow_transaction_version2(json_data,transaction_id,json_update,input_info,hederbiz,sign_info,token)
        if (resp[0]) {
            return res.status(200).json({
                status: true,
                message: 'success',
                data: resp[1]
            })
        } else {
            return res.status(400).json({
                status: false,
                message: resp[2],
                data: resp[1]
            })
        }
        
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: error.message,
            data: null
        })
    }
    
});

router.post("/reverse_transaction",async function (req, res) {
    try {
        let json_data = req.json_data
        let dataJson = req.body
        let transaction_id = dataJson.transaction_id
        let index_reverse = dataJson.index_reverse
        let hederbiz = req.headers.taxid
        var resp = await Flow.reverse_transaction(json_data,hederbiz,transaction_id)
        if (resp[0]) {
            return res.status(200).json({
                status: true,
                message: 'success',
                data: resp[1]
            })
        } else {
            return res.status(400).json({
                status: false,
                message: resp[2],
                data: resp[1]
            })
        }
        
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: error.message,
            data: null
        })
    }
    
});

router.post("/skip_reverse",async function (req, res) {
    try {
        let json_data = req.json_data
        let dataJson = req.body
        let transaction_id = dataJson.transaction_id
        let index_reverse = dataJson.index_reverse
        let hederbiz = req.headers.taxid
        var resp = await Flow.reverse_transaction_skipstep(json_data,hederbiz,transaction_id,index_reverse)
        if (resp[0]) {
            return res.status(200).json({
                status: true,
                message: 'success',
                data: resp[1]
            })
        } else {
            return res.status(400).json({
                status: false,
                message: resp[2],
                data: resp[1]
            })
        }
        
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: error.message,
            data: null
        })
    }
    
});

router.post("/test_sendmail",async function (req, res) {
    try {
        let json_data = req.json_data
        let dataJson = req.body
        let transaction_id = dataJson.transaction_id
        let doctype = dataJson.doctype
        var result_doctype = await db_doctype.document_type_2(json_data.db_connect,doctype)
        if (result_doctype[0]) {
            // SEND MAIL
            if (result_doctype[1].sendmail.status == true) {
                let email_center = result_doctype[1].sendmail.mail
                let recvier = email_center
                let bcc_mail = result_doctype[1].sendmail.bcc_mail
                var resp = await func_smtp.sendmail(json_data,transaction_id,recvier,bcc_mail)
                return res.status(200).json({
                    status: true,
                    message: 'success',
                    data: null
                })                
               
            } 
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: error.message,
            data: null
        })
    }
    
});

router.post("/test_genhtml",async function (req, res) {
    try {
        let json_data = req.json_data
        let dataJson = req.body
        let input = dataJson.input
        document_id = ''
        let result = await html.genHtmlQtBiLang(input,document_id)
        reshtml = result.replace(/\n/g, "")

        return res.status(200).json({
            status: true,
            message: 'success',
            data: reshtml
        })   
       
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: error.message,
            data: null
        })
    }
    
});



module.exports = router