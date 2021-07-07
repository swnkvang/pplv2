require('../config/lib')
require('../config/global')
require('../callAPI/axiosAPI')
const sign_method = require('../function/sign.func')
const db_jws_sign = require('../database/db_jws_sign')
const func_hash = require('../function/func_hash')
const actiontransaction = require('../database/actiondb_transaction')


async function jsonsigning(data_decry,transaction_id,step,index,sign_string,base64_from_genhdf){
    try {
        // console.log('jsonsigning')
        var connectiondb = data_decry.db_connect
        let onetoken = data_decry.one_access_token
        let account_id = data_decry.one_result_data.id
        let token_header ='Bearer '+ onetoken
        let username =  data_decry.one_result_data.username
        let sign_position = null
        var pdf_sign = null
        step = step-1
        index = index-1
        var result_data = await sign_method.select_data_sign_pdf(account_id,transaction_id,connectiondb)
        // return [false,result_data]
        if (!(result_data[0] == 200)){
            return [400,result_data[1]]
        }
        else{
            var flow_data = result_data[1].flow[index]
            var status_flow = flow_data.flow
            // var path_sign = result_data[1].path_pdf_sign
            var step_max = String(result_data[1].step_max)
            var document_id = result_data[1].document_id
            if (status_flow == true){
                var action_detail = flow_data.action_detail
                var step_data = action_detail[step]
                sign_position = step_data.sign_position
                sign_position.sign_page = String(sign_position.sign_page)
                sign_position.max_page = 1
                pdf_sign = action_detail[step].pdf_sign
            }
            else{
                var actor_detail = flow_data.actor
                var step_data = actor_detail[step]
                sign_position = step_data.sign_position
                sign_position.sign_page = String(sign_position.sign_page)
                sign_position.max_page = 1
                pdf_sign  = actor_detail[step].pdf_sign
            }
            // console.log('path_sign',path_sign)
            var result_readfile = base64_from_genhdf
            // if (path_sign != null) {
            //     result_readfile = await fs.readFileSync(path_sign, 'utf-8')
            //     if (result_readfile == null) {
            //         let tmperror = {
            //             'msg_thai' : 'เกิดความผิดพลาดในการอ่านไฟล์ .pdf',
            //             'msg_eng' : 'There has been a reading .pdf error.'
            //         }
            //         return[400,null,tmperror]
            //     }
            // } 
            // var data_pdf = {
            //     base64_string : result_readfile,
            //     sign_position : sign_position,
            //     max_Step : step_max,
            //     Step_Num : step,
            //     sign_string : sign_string
            // }
            var result_call_list = await sign_method.credentials_list_v2(data_decry,"", "", "", "", "", token_header,username,transaction_id,step,index)
            if (result_call_list.result == 'ER') {
                return [401,'Unauthorized']
            } else {
                var data_msg = result_call_list.msg
                try {
                    let totalResult_oneAuth = data_msg['totalResult']
                    if (totalResult_oneAuth == 0) {
                        return [401,'One AUth sign profile not found']
                    }
                } catch (error) {
                    return [401,error]
                }
                var credentialId = data_msg['credentials'][0]['credentialId']
                var result_auth = await sign_method.credentials_authorize_v2(data_decry,credentialId, "", "", "", "", "", "", "", token_header,username,transaction_id,step,index)
                // result_auth.url = url_credentials_authorize_v2
                if (result_auth.result == 'ER') {
                    return [401,'Authorize Service error']
                } else {
                    var data_auth = result_auth.msg
                    var sadData = data_auth['sad']
                    var type_certifyLevel = null
                    // console.log(sign_position['sign_page'],sign_position['max_page'])
                    // console.log(step,step_max)
                    if (Number(sign_position['sign_page']) == Number(sign_position['max_page'])) {
                        if (Number(step) == Number(step_max)) {
                            type_certifyLevel = 'CERTIFY'
                        } else {
                            type_certifyLevel = 'NON-CERTIFY'
                        }
                    } else {
                        if (Number(step) == Number(step_max)) {
                            type_certifyLevel = 'CERTIFY'
                        } else {
                            type_certifyLevel = 'NON-CERTIFY'
                        }
                    }
                    type_certifyLevel = 'NON-CERTIFY'
                    var overwriteOriginal = true
                    var visibleSignature = 'Graphics'
                    var visibleSignatureImagePath = sign_string
                    if (pdf_sign == false) {
                        var result_signPdf = await sign_method.signing_json_v1(document_id, sadData, "", "", "", type_certifyLevel, "", overwriteOriginal, visibleSignature, "", "", visibleSignatureImagePath, token_header, sign_position,username,transaction_id,step,index,connectiondb)
                        if (result_signPdf.result != 'OK') {
                            let tmperror = {
                                'msg_thai' : 'พบปัญหาในการลงลายเซ็น',
                                'msg_eng' : 'There was a problem with the signature.'
                            }
                            return [400,result_signPdf.msg,tmperror]
                        } else {
                            return [200,result_signPdf.msg]
                        }
                        
                    } else if (pdf_sign == true) {
                        res_jws = await db_jws_sign.select_jws_sign(connectiondb,transaction_id)
                        if (!(res_jws[0])) {
                            return[400,res_jws[1],'']
                        }
                        let arrlist = []
                        for (let i=0;i<res_jws[1].length;i++) {
                            arrlist.push(res_jws[1][i].jwsdata)
                        }
                        var result_jsonPdfsign = await sign_method.jsonPdfSigning_v1(result_readfile, document_id, sadData, "", "", "", type_certifyLevel, "", overwriteOriginal, visibleSignature, "", "", visibleSignatureImagePath, token_header, sign_position,username,transaction_id,step,index,arrlist,connectiondb)
                        if (result_jsonPdfsign.result == 'OK') {
                            // var pdfData = result_jsonPdfsign.msg.pdfData
                            // var hashpdfsign = await func_hash.sha512(pdfData)
                            // console.log('hashpdfsign',hashpdfsign)
                            // console.log('')
                            // var status_view_pdf = false
                            // if (pdfData != null) {
                            //     try{
                            //         await fs.writeFileSync(result_data[1].path_pdf_sign, pdfData)
                            //         status_view_pdf = true
                            //     }
                            //     catch(err){
                            //         let tmperror = {
                            //             'msg_thai' : 'พบปัญหาในการบันทึก pdf',
                            //             'msg_eng' : 'There was a problem recording pdf.'
                            //         }
                            //         console.log('save pdf error ',err)
                            //         return [false,err,tmperror]
                            //     }
                            //     try {
                            //         await fs.writeFileSync(result_data[1].path_pdfhashsign, hashpdfsign)
                            //     } catch(err) {
                            //         let tmperror = {
                            //             'msg_thai' : 'พบปัญหาในการบันทึก hash pdf',
                            //             'msg_eng' : 'There was a problem recording hash pdf.'
                            //         }
                            //         console.log('save pdf error ',err)
                            //         return [false,err,tmperror]
                            //     }
                            //     // var convertbase64 = (Buffer.from(pdfData,'base64')).length
                            //     // var buf = Buffer.alloc(convertbase64);
                            //     // var pdfSize = Buffer.byteLength(buf);
                            //     // console.log('pdfSize',pdfSize)
                            //     var result_updatetransac = actiontransaction.updatetransactiion_statusviewpdf(connectiondb,transaction_id,status_view_pdf)
                            //     // console.log('result_updatetransac',result_updatetransac)
                            // } else {
                            //     let tmperror = {
                            //         'msg_thai' : 'พบปัญหาในการลงลายเซ็น',
                            //         'msg_eng' : 'There was a problem with the signature.'
                            //     }
                            //     return [400,result_jsonPdfsign.msg,tmperror]
                            // }
                            return [200,result_jsonPdfsign.msg]
                        } else {
                            let tmperror = {
                                'msg_thai' : 'พบปัญหาในการลงลายเซ็น',
                                'msg_eng' : 'There was a problem with the signature.'
                            }
                            return [400,result_jsonPdfsign.msg,tmperror]
                        }
                    }
                   
                }
            }

        }
        
    } 
    catch (error) {
        console.log('error:',error)
        return [400,error]
    }
}

module.exports = {
    jsonsigning
}