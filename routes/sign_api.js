require('../config/lib')
require('../config/global')
require('../config/mongo_db')

const sign_method = require('../function/sign.func');
const transactionlog = require('../method/transaction_log_func')
const middleware = require('../method/middleware')
const sign_process = require('../method/sign_process')
const func_pdf = require('../function/func_pdf')

const router = express.Router();
router.use(middleware)

router.post('/OneAuth/Sign', async function (req, res) {
    let body = req.body
    var json_data = req.json_data
    var one_access_token = json_data.one_access_token
    var username = json_data.one_result_data.username
    var token_header ='Bearer '+ one_access_token
    var url = req.protocol + '://' + req.get('host') + req.originalUrl;
    res_arraylist = []
    type_certifyLevel = ''
    // list_result_listService = []
    try {
        if (!body.hasOwnProperty('base64_string') || !body.hasOwnProperty('max_Step') || !body.hasOwnProperty('Step_Num') || !body.hasOwnProperty('sign_position') || !body.hasOwnProperty('sign_string')) {
            return res.status(400).json({
                result: "ER",
                messageText: 'parameter incorrect',
                status_Code: 400
            });
        }
        base64_pdf_String = body.base64_string
        max_Step = body.max_Step
        Step_Num = body.Step_Num
        sign_position = body.sign_position
        sign_string = body.sign_string
        if (!('sign_llx' in sign_position) || !('sign_lly' in sign_position) || !('sign_urx' in sign_position) || !('sign_ury' in sign_position) || !('sign_page' in sign_position) || !('max_page' in sign_position)) {
            return res.status(400).json({
                result: "ER",
                messageText: 'parameter incorrect',
                status_Code: 400
            });
        }

        result_call_list = await sign_method.credentials_list_v2(json_data,"", "", "", "", "", token_header,username)
        result_call_list.url = url_credentials_list_v2
        // console.log('result_call_list:',result_call_list)
        if (result_call_list.result == 'ER') {
            return res.status(400).json({
                result: "ER",
                messageText: 'Unauthorized',
                status_Code: 401
            });
        } else {
            data_msg = result_call_list.msg
            try {
                totalResult_oneAuth = data_msg['totalResult']
                if (totalResult_oneAuth == 0) {
                    return res.status(401).json({
                        result: "ER",
                        messageText: 'One AUth sign profile not found',
                        status_Code: 401
                    });
                }
            } catch (error) {
                console.log(error)
                return res.status(400).json({
                    result: "ER",
                    messageText: error,
                    status_Code: 400
                });
            }
            res_arraylist.push({
                'result_listService': result_call_list
            })
            credentialId = data_msg['credentials'][0]['credentialId']
            result_auth = await sign_method.credentials_authorize_v2(json_data,credentialId, "", "", "", "", "", "", "", token_header,username)
            result_auth.url = url_credentials_authorize_v2
            // console.log('result_auth:',result_auth)
            if (result_auth.result == 'ER') {
                return res.status(401).json({
                    result: "ER",
                    messageText: 'Authorize Service error',
                    status_Code: 401
                });
            } else {
                data_auth = result_auth.msg
                res_arraylist.push({
                    'result_authorizeService': result_auth
                })
                sadData = data_auth['sad']
                if (Number(sign_position['sign_page']) == Number(sign_position['max_page'])) {
                    if (Number(['Step_Num']) == Number(max_Step)) {
                        type_certifyLevel = 'CERTIFY'
                    } else {
                        type_certifyLevel = 'NON-CERTIFY'
                    }
                } else {
                    if (Number(Step_Num) == Number(max_Step)) {
                        type_certifyLevel = 'CERTIFY'
                    } else {
                        type_certifyLevel = 'NON-CERTIFY'
                    }
                }
                result_signPdf = await sign_method.signing_pdfSigning_v3(json_data,base64_pdf_String, sadData, "", "", "", type_certifyLevel, "", "", "", "", "", "", token_header, sign_position, sign_string,username)
                result_signPdf.url = url_pdfSigning_Sign_v3
                // console.log('result_signPdf:',result_signPdf)
                if (result_signPdf.result == 'ER') {
                    return res.status(400).json({
                        result: "ER",
                        messageText: 'signPdf Service error',
                        status_Code: 400
                    });
                } else {
                    data_sign = result_signPdf.msg
                    res_arraylist.push({
                        'result_signPdfService': result_signPdf
                    })
                    return res.status(200).json({
                        result: "OK",
                        messageText: res_arraylist,
                        status_Code: 200,
                        messageService: type_certifyLevel,
                        messageER: null
                    });
                }
            }

        }

    } catch (error) {
        console.log('error:',error)
        return res.status(400).json({
            result: "ER",
            messageText: error.message,
            status_Code: 400
        });
    }
    // finally {
        // console.log('result_listService',result_listService)
        // status_log = res.statusCode
        // result_insert_log = await transactionlog.insert_transaction_sign(request,url,username,result_call_list,status_log,connectiondb)
    // }

})

async function OneAuth_Sign(body,json_data){
    var one_access_token = json_data.one_access_token
    var username = json_data.one_result_data.username
    var token_header ='Bearer '+ one_access_token
    // var url = req.protocol + '://' + req.get('host') + req.originalUrl;
    res_arraylist = []
    type_certifyLevel = ''
    // list_result_listService = []
    try {
        // if (!body.hasOwnProperty('base64_string') || !body.hasOwnProperty('max_Step') || !body.hasOwnProperty('Step_Num') || !body.hasOwnProperty('sign_position') || !body.hasOwnProperty('sign_string')) {
        if (!('base64_string' in body) || !('max_Step' in body) || !('Step_Num' in body) || !('sign_position' in body) || !('sign_string' in body)) {
            // return res.status(400).json({
            //     result: "ER",
            //     messageText: 'parameter incorrect',
            //     status_Code: 400
            // });
            return [400,'parameter incorrect']
        }
        
        base64_pdf_String = body.base64_string
        max_Step = body.max_Step
        Step_Num = body.Step_Num
        sign_position = body.sign_position
        sign_string = body.sign_string
        if (!('sign_llx' in sign_position) || !('sign_lly' in sign_position) || !('sign_urx' in sign_position) || !('sign_ury' in sign_position) || !('sign_page' in sign_position) || !('max_page' in sign_position)) {
            // return res.status(400).json({
            //     result: "ER",
            //     messageText: 'parameter incorrect',
            //     status_Code: 400
            // });
            return [400,'parameter incorrect']
        }

        result_call_list = await sign_method.credentials_list_v2(json_data,"", "", "", "", "", token_header,username)
        result_call_list.url = url_credentials_list_v2
        // console.log('result_call_list:',result_call_list)
        if (result_call_list.result == 'ER') {
            // return res.status(400).json({
            //     result: "ER",
            //     messageText: 'Unauthorized',
            //     status_Code: 401
            // });
            return [401,'Unauthorized']
        } else {
            data_msg = result_call_list.msg
            try {
                totalResult_oneAuth = data_msg['totalResult']
                if (totalResult_oneAuth == 0) {
                    // return res.status(401).json({
                    //     result: "ER",
                    //     messageText: 'One AUth sign profile not found',
                    //     status_Code: 401
                    // });
                    return [401,'One AUth sign profile not found']
                }
            } catch (error) {
                console.log(error)
                // return res.status(400).json({
                //     result: "ER",
                //     messageText: error,
                //     status_Code: 400
                // });
                return [401,error]
            }
            res_arraylist.push({
                'result_listService': result_call_list
            })
            credentialId = data_msg['credentials'][0]['credentialId']
            result_auth = await sign_method.credentials_authorize_v2(json_data,credentialId, "", "", "", "", "", "", "", token_header,username)
            result_auth.url = url_credentials_authorize_v2
            // console.log('result_auth:',result_auth)
            if (result_auth.result == 'ER') {
                // return res.status(401).json({
                //     result: "ER",
                //     messageText: 'Authorize Service error',
                //     status_Code: 401
                // });
                return [401,'Authorize Service error']
            } else {
                data_auth = result_auth.msg
                res_arraylist.push({
                    'result_authorizeService': result_auth
                })
                sadData = data_auth['sad']
                if (Number(sign_position['sign_page']) == Number(sign_position['max_page'])) {
                    if (Number(['Step_Num']) == Number(max_Step)) {
                        type_certifyLevel = 'CERTIFY'
                    } else {
                        type_certifyLevel = 'NON-CERTIFY'
                    }
                } else {
                    if (Number(Step_Num) == Number(max_Step)) {
                        type_certifyLevel = 'CERTIFY'
                    } else {
                        type_certifyLevel = 'NON-CERTIFY'
                    }
                }
                result_signPdf = await sign_method.signing_pdfSigning_v3(json_data,base64_pdf_String, sadData, "", "", "", type_certifyLevel, "", "", "", "", "", "", token_header, sign_position, sign_string,username)
                result_signPdf.url = url_pdfSigning_Sign_v3
                // console.log('result_signPdf:',result_signPdf)
                if (result_signPdf.result == 'ER') {
                    // return res.status(400).json({
                    //     result: "ER",
                    //     messageText: 'signPdf Service error',
                    //     status_Code: 400
                    // });
                    return [400,'signPdf Service error']
                } else {
                    data_sign = result_signPdf.msg
                    res_arraylist.push({
                        'result_signPdfService': result_signPdf
                    })
                    // return res.status(200).json({
                    //     result: "OK",
                    //     messageText: res_arraylist,
                    //     status_Code: 200,
                    //     messageService: type_certifyLevel,
                    //     messageER: null
                    // });
                   var data_return = {
                    res_arraylist : res_arraylist,
                    type_certifyLevel : type_certifyLevel
                   }
                   return [200,data_return]
                    
                    
                }
            }

        }

    } catch (error) {
        console.log(error)
        // return res.status(400).json({
        //     result: "ER",
        //     messageText: error.message,
        //     status_Code: 400
        // });
        return [400,error.message]
    }
    // finally {
        // console.log('result_listService',result_listService)
        // status_log = res.statusCode
        // result_insert_log = await transactionlog.insert_transaction_sign(request,url,username,result_call_list,status_log,connectiondb)
    // }

}

router.post("/data_sign_pdf",async function (req, res) {
    try {
        let data = req.body
        let transaction_id = data.transaction_id 
        let step = (data.step)
        let index = (data.index)
        let sign_string = data.sign_string
        var json_data = req.json_data
        let connectiondb = json_data.db_connect
        // resulttt = await sign_process.sign_pdf(transaction_id,step,index,sign_string,json_data)
        resulttt = await sign_process.sign_pdf_nonCA(transaction_id,step,index,sign_string,json_data)

        return res.status(200).json({
            result: "OK",
            messageText: resulttt[1],
            status_Code: 200
        });
    } 
    catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: error.message,
            data: null
        })
    }
});

router.get("/get_string_sign",async function (req, res) {
    try {
        var account_id = req.query.account_id
        var json_data = req.json_data
        var connectiondb = json_data.db_connect
        result_select = await sign_method.select_string_sign(account_id,connectiondb)
        // result_pdf = await func_pdf.generatePdf_v5('C:/Users/Faradartz/Postman/files/test.html')
        // console.log('result_pdf:',result_pdf)
        
        if (result_select[0]==200){
            return res.status(200).json({
                result: true,
                message: result_select[1],
                status_Code: 200
            });
            //  status: true,
            //     message: 'success',
            //     data: resp[1]
        }
        else{
            return res.status(400).json({
                result: "OK",
                messageText: result_select[1],
                status_Code: 200
            });
        }
        
    } 
    catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: error.message,
            data: null
        })
    }
});

router.post("/insert_string_sign",async function (req, res) {
    try {
        let json_data = req.json_data
        let dataJson = req.body
        var account_id = dataJson.account_id
        var sign_info =  dataJson.sign_info
        var result_select = await sign_method.insert_string_sign(account_id,sign_info,json_data)
        if (result_select[0]==200){
            return res.status(200).json({
                result: "OK",
                messageText: result_select[1],
                status_Code: 200
            });
        }
        else{
            return res.status(400).json({
                result: "OK",
                messageText: result_select[1],
                status_Code: 200
            });
        }
    } 
    catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: error.message,
            data: null
        })
    }
});



module.exports = router;