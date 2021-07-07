require('../config/lib')
require('../config/global')

const file_method = require('../function/func_savefile');
const func_datetime = require('../function/func_datetime')
const transaction_other = require('../database/transaction_otherservice_db')

async function htmltoPDF (json_data,htmltext,paper_size,orientation,tax_id,transaction_id) {
    var now = new Date
    var dtnow = await func_datetime.formatDate(now)
    somepath = '/storage/'+tax_id+'/html_file' + '/' + dtnow
    file_name = "/" + uuid()
    type = 'html'
    save_html = await file_method.createFile(path_local,somepath,file_name,type,htmltext)
    if (save_html[0]){
        let formData = new FormData();
        formData.append('file', fs.createReadStream(save_html[1]));
        formData.append('landscape',orientation);
        formData.append('paper_size',paper_size);
        response_pdf = await Call.callPost_formdata(url_convert_html,formData)
        if (response_pdf.result==='OK'){
            base_string = response_pdf.msg.message.pdfData
            result = await transaction_other.insert_transaction_other_service(json_data,null,url_convert_html,response_pdf.msg,response_pdf.result,response_pdf.time_duration,transaction_id)
            return [true,base_string]
        }else{
            return [false,response_pdf[1]]
        }
    }else{
        console.log(save_html[1])
        return [false,save_html[1]]
    }
}

async function htmltoPDF_v2 (json_data,htmltext,paper_size,orientation,tax_id,transaction_id,url_convert) {
    try {
        var now = new Date
        var dtnow = await func_datetime.formatDate(now)
        somepath = '/storage/'+tax_id+'/html_file' + '/' + dtnow
        file_name = "/" + uuid()
        type = 'html'
        save_html = await file_method.createFile(path_local,somepath,file_name,type,htmltext)
        if (save_html[0]){
            let formData = new FormData();
            formData.append('file', fs.createReadStream(save_html[1]));
            formData.append('landscape',orientation);
            formData.append('paper_size',paper_size);
            response_pdf = await Call.callPost_formdata(url_convert,formData)
            if (response_pdf.result==='OK'){
                base_string = response_pdf.msg.message.pdfData
                result = await transaction_other.insert_transaction_other_service(json_data,null,url_convert,response_pdf.msg,response_pdf.result,response_pdf.time_duration,transaction_id)
                return [true,base_string]
            }else{
                return [false,response_pdf[1]]
            }
        }else{
            console.log(save_html[1])
            return [false,save_html[1]]
        }
    } catch (error) {
        console.log(error)
        return [false,error.message]
    }
}

// async function htmltoPDF_version2 (htmltext,paper_size,orientation,tax_id) {
//     var now = new Date
//     var dtnow = await func_datetime.formatDate(now)
//     somepath = '/storage/'+tax_id+'/html_file' + '/' + dtnow
//     file_name = "/" + uuid()
//     type = 'html'
//     save_html = await file_method.createFile(path_local,somepath,file_name,type,htmltext)
//     if (save_html[0]){
//         var file_in = await fs.readFileSync(save_html[1])
//         // var buffer_filein = file_in.data
//         var response_pdf = await func_pdf.generatePdf_v4(file_in, orientation, paper_size)
//         // let formData = new FormData();
//         // formData.append('file', fs.createReadStream(save_html[1]));
//         // formData.append('landscape',orientation);
//         // formData.append('paper_size',paper_size);
//         // response_pdf = await Call.callPost_formdata(url_convert_html,formData)
//         if (response_pdf[0]){
//             base_string = response_pdf[1]
//             return [true,base_string]
//         }else{
//             return [false,response_pdf[1]]
//         }
        
//     }else{
//         console.log(save_html[1])
//         return [false,save_html[1]]
//     }
// }

module.exports = {
    htmltoPDF,
    htmltoPDF_v2
}