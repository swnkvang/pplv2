require('../config/lib')
const sign_method = require('../function/sign.func');
const transactionlog = require('../method/transaction_log_func')
const middleware = require('../method/middleware')

async function OneAuth_Sign(body,transaction_id,step,index,onetoken,data_decry){
    var one_access_token = onetoken
    var username = data_decry.one_result_data.username
    var token_header ='Bearer '+ one_access_token
    var step_sign = step+1
    var index_sign = index+1
    res_arraylist = []
    type_certifyLevel = ''
    try {
        if (!('base64_string' in body) || !('max_Step' in body) || !('Step_Num' in body) || !('sign_position' in body) || !('sign_string' in body)) {
            return [400,'parameter incorrect']
        }
        
        base64_pdf_String = body.base64_string
        max_Step = body.max_Step
        Step_Num = body.Step_Num
        sign_position = body.sign_position
        sign_string = body.sign_string
        if (!('sign_llx' in sign_position) || !('sign_lly' in sign_position) || !('sign_urx' in sign_position) || !('sign_ury' in sign_position) || !('sign_page' in sign_position) || !('max_page' in sign_position)) {
            return [400,'parameter incorrect']
        }
        result_call_list = await sign_method.credentials_list_v2(data_decry,"", "", "", "", "", token_header,username,transaction_id,step_sign,index_sign)
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
                // return res.status(400).json({
                //     result: "ER",
                //     messageText: error,
                //     status_Code: 400
                // });
                return [401,error]
            }
            // res_arraylist.push({
            //     'result_listService': result_call_list
            // })
            credentialId = data_msg['credentials'][0]['credentialId']
            result_auth = await sign_method.credentials_authorize_v2(data_decry,credentialId, "", "", "", "", "", "", "", token_header,username,transaction_id,step_sign,index_sign)
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
                // res_arraylist.push({
                //     'result_authorizeService': result_auth
                // })
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
                result_signPdf = await sign_method.signing_pdfSigning_v3(data_decry,base64_pdf_String, sadData, "", "", "", "", "", "", "", "", "", "", token_header, sign_position, sign_string,username,transaction_id,step_sign,index_sign)
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
                //    var data_return = {
                //     res_arraylist : res_arraylist,
                //     type_certifyLevel : type_certifyLevel
                //    }
                var data_return = {
                    result_data : result_signPdf.msg,
                    // result_data : res_arraylist,
                    type_certifyLevel : type_certifyLevel
                   }
                return [200,data_return]
                    
                    
                }
            }

        }

    } catch (error) {
        console.log('error:',error)
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

async function OneAuth_Sign_nonCA(body,transaction_id,step,index,onetoken,data_decry){
    var one_access_token = onetoken
    var username = data_decry.one_result_data.username
    var token_header ='Bearer '+ one_access_token
    var step_sign = step+1
    var index_sign = index+1
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

        result_signPdf = await sign_method.getSign_createNote(data_decry,base64_pdf_String, step_sign, sign_position, sign_string, "", "", "", token_header,username,transaction_id,step_sign,index_sign)

        result_signPdf.url = url_CaList
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
        //    var data_return = {
        //     res_arraylist : res_arraylist,
        //     type_certifyLevel : type_certifyLevel
        //    }
        var data_return = {
            // result_data : result_signPdf.msg,
            result_data : res_arraylist,
            type_certifyLevel : type_certifyLevel
            }
        return [200,data_return]
            
            
        }
         

    } catch (error) {
        console.log('error:',error)
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

async function sign_pdf(transaction_id,step,index,sign_string,data_decry){
    try {
        // let connectiondb = json_data.db_connect
        var connectiondb = data_decry.db_connect
        let onetoken = data_decry.one_access_token
        let account_id = data_decry.one_result_data.id
        // let account_id = json_data.one_result_data.id
        step = step-1
        index = index-1
        var result_data = await sign_method.select_data_sign_pdf(account_id,transaction_id,connectiondb)
        // const result_data = await pool.exec(sign_method.select_data_sign_pdf, [account_id,transaction_id,connectiondb]) 

        if (!(result_data[0] == 200)){
            return [200,result_data[1]]
        }
        else{
            // return [200,result_data[1]]
            var flow_data = result_data[1].flow[index]
            var status_flow = flow_data.flow
            // console.log('status_flow:',status_flow)
            var path_sign = result_data[1].path_pdf_sign
            var step_max = String(result_data[1].step_max)
            if (status_flow == true){
                var action_detail = flow_data.action_detail
                var step_data = action_detail[step]
                var sign_position = step_data.sign_position
                sign_position.sign_page = String(sign_position.sign_page)
                sign_position.max_page = 1
            }
            else{
                var actor_detail = flow_data.actor
                var step_data = actor_detail[step]
                var sign_position = step_data.sign_position
                
                sign_position.sign_page = String(sign_position.sign_page)
                sign_position.max_page = 1
            }
            
            // console.log('path_sign:',path_sign)
            result_readfile = await fs.readFileSync(path_sign, 'utf-8')
            
            var data_pdf = {
                base64_string : result_readfile,
                sign_position : sign_position,
                max_Step : step_max,
                Step_Num : step,
                sign_string : sign_string
            }
            result_sign = await OneAuth_Sign(data_pdf,transaction_id,step,index,onetoken,data_decry)
            // return res.status(200).json({
            //     result: "OK",
            //     messageText: result_sign[1],
            //     status_Code: 200
            // });
            return [200,result_sign[1]]
        }
        
    } 
    catch (error) {
        console.log('error:',error)
        // return res.status(400).json({
        //     status: false,
        //     message: error.message,
        //     data: null
        // })
        return [400,error]
    }
}

async function sign_pdf_nonCA(transaction_id,step,index,sign_string,data_decry){
    try {
        // let connectiondb = json_data.db_connect
        var connectiondb = data_decry.db_connect
        let onetoken = data_decry.one_access_token
        let account_id = data_decry.one_result_data.id
        // let account_id = json_data.one_result_data.id
        step = step-1
        index = index-1
        var result_data = await sign_method.select_data_sign_pdf(account_id,transaction_id,connectiondb)
        // console.log('result_data:',result_data)
        // const result_data = await pool.exec(sign_method.select_data_sign_pdf, [account_id,transaction_id,connectiondb]) 

        if (!(result_data[0] == 200)){
            return [200,result_data[1]]
        }
        else{
            // return [200,result_data[1]]
            var flow_data = result_data[1].flow[index]
            var status_flow = flow_data.flow
            // console.log('status_flow:',status_flow)
            var path_sign = result_data[1].path_pdf_sign
            var step_max = String(result_data[1].step_max)
            if (status_flow == true){
                var action_detail = flow_data.action_detail
                var step_data = action_detail[step]
                var sign_position = step_data.sign_position
                sign_position.sign_page = String(sign_position.sign_page)
                sign_position.max_page = 1
            }
            else{
                var actor_detail = flow_data.actor
                var step_data = actor_detail[step]
                var sign_position = step_data.sign_position
                
                sign_position.sign_page = String(sign_position.sign_page)
                sign_position.max_page = 1
            }
            result_readfile = await fs.readFileSync(path_sign, 'utf-8')
            var data_pdf = {
                base64_string : result_readfile,
                sign_position : sign_position,
                max_Step : step_max,
                Step_Num : step,
                sign_string : sign_string
            }
            result_sign = await OneAuth_Sign_nonCA(data_pdf,transaction_id,step,index,onetoken,data_decry)
            // return res.status(200).json({
            //     result: "OK",
            //     messageText: result_sign[1],
            //     status_Code: 200
            // });
            return [200,result_sign[1]]
        }
        
    } 
    catch (error) {
        console.log('error:',error)
        // return res.status(400).json({
        //     status: false,
        //     message: error.message,
        //     data: null
        // })
        return [400,error]
    }
}

module.exports = {
    OneAuth_Sign,
    sign_pdf,
    OneAuth_Sign_nonCA,
    sign_pdf_nonCA
}