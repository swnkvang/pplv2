require('../config/lib')
require('../config/global')

const func_html = require('../function/func_dataTohtml')

async function genhtml_preview(input_data,document_id,doctype,type_view,ref_document){
    try {
        var reshtml = null
        if (document_id == '' || document_id == null || document_id == undefined){
            document_id = doctype + '-'+'xxxxxx'
        }
        if (doctype == 'CS' || doctype == 'CS_TEST' || doctype == 'CS_TEST2') {
            if (type_view == 'INV' || type_view == 'INV_TEST' || type_view == 'INV_TEST2') {
                let inputparam = JSON.parse(JSON.stringify(input_data))
                var ref_qt = ""
                reshtml = await func_html.genHtmlInvoiceOnly(inputparam,document_id,ref_document)
                reshtml = reshtml.replace(/\n/g, "")
            } else {
                let inputparam = JSON.parse(JSON.stringify(input_data))
                var ref_qt = ""
                reshtml = await func_html.genHtmlCs(inputparam,document_id,ref_document)
                reshtml = reshtml.replace(/\n/g, "")
            }
        } else if (doctype == 'QT') {
            let inputparam = JSON.parse(JSON.stringify(input_data))
            reshtml = await func_html.genHtmlQtBiLangV2(inputparam,document_id)
            reshtml = reshtml.replace(/\n/g, "")
        } else if (doctype == 'QT_TEST' || doctype == 'QT_TEST2') {
            let inputparam = JSON.parse(JSON.stringify(input_data))
            reshtml = await func_html.genHtmlQtBiLangV2(inputparam,document_id)
            reshtml = reshtml.replace(/\n/g, "")
        } else {
            let tmperror = {
                msg_thai: 'ไม่สามารถแปลงเป็นไฟล์ .html ได้',
                msg_eng: 'Can not generate to html'
            }
            return [false,null,tmperror]
        }
        return [true,null,reshtml]
    } catch (error) {
        console.log(error)
        return [false,null,error]
    }
    
}

async function genhtml_preview_version2(input_data,document_id,doctype,type_view,ref_document){
    try {
        var reshtml = null
        if (document_id == '' || document_id == null || document_id == undefined){
            document_id = doctype + '-'+'xxxxxx'
        }
        if (doctype == 'CS' || doctype == 'CS_TEST' || doctype == 'CS_TEST2') {
            if (type_view == 'Invoice') {
                let inputparam = JSON.parse(JSON.stringify(input_data))
                var ref_qt = ""
                reshtml = await func_html.genHtmlInvoiceOnly(inputparam,document_id,ref_document)
                reshtml = reshtml.replace(/\n/g, "")
            } else {
                let inputparam = JSON.parse(JSON.stringify(input_data))
                var ref_qt = ""
                reshtml = await func_html.genHtmlCs(inputparam,document_id,ref_document)
                reshtml = reshtml.replace(/\n/g, "")
            }
        } else if (doctype == 'QT') {
            let inputparam = JSON.parse(JSON.stringify(input_data))
            reshtml = await func_html.genHtmlQtBiLangV2(inputparam,document_id)
            reshtml = reshtml.replace(/\n/g, "")
        } else if (doctype == 'QT_TEST' || doctype == 'QT_TEST2') {
            let inputparam = JSON.parse(JSON.stringify(input_data))
            reshtml = await func_html.genHtmlQtBiLangV2(inputparam,document_id)
            reshtml = reshtml.replace(/\n/g, "")
        } else {
            let tmperror = {
                msg_thai: 'ไม่สามารถแปลงเป็นไฟล์ .html ได้',
                msg_eng: 'Can not generate to html'
            }
            return [false,null,tmperror]
        }
        return [true,null,reshtml]
    } catch (error) {
        console.log(error)
        return [false,null,error]
    }
    
}

module.exports = {
    genhtml_preview,
    genhtml_preview_version2
}