require('../config/lib')
require('../config/global')

const org = require('../method/orgchart_process')
const middleware = require('../method/middleware')
const get_data = require('../method/get_data_process')
const otherMethod = require('../method/other.process')
const calbiMethod = require('../function/func_htmldata')
const FileFunc = require('../function/func_savefile')
const ServiceKeySchema = require('../schema/serviceKey.sch')
const db_transaction = require('../database/actiondb_transaction')
const transac_group = require('../database/transaction_group')
const DocumentTypeDB = require('../database/document.type')
const attachfiles_db = require('../database/attachfiles_db')
const sftpMethod = require('../method/sftp')

const replaceKeywordInPathSftp = async (path, tax_id, doc_id) => {
    path = String(path).replace(/{{taxid}}/g, tax_id)
    path = String(path).replace(/{{docid}}/g, doc_id)
    return path
};

const SendDocumentService = async (transaction, tax_id, db_connect, json_data) => {
    try {
        var ArrResult = []
        var ArrTransactionId = []
        var ResSendFileSftp = null
        for (let i = 0; i < transaction.length; i++) {
            const transaction_element = transaction[i];
            var GetData = await db_transaction.find_transaction(db_connect, transaction_element)
            if (GetData[0]) {
                var DataDocument = GetData[1]._doc
                var groupid = DataDocument.groupid
                if (groupid != "") {
                    var ResDataGroupDetail = await transac_group.select_transactiongroup(json_data, groupid)
                    if (ResDataGroupDetail[0]) {
                        var DataGroupDetail = ResDataGroupDetail[1]._doc
                        var status = DataGroupDetail.status
                        var list_transaction = DataGroupDetail.list_transaction
                        if (status == 'Y') {
                            for (let j = 0; j < list_transaction.length; j++) {
                                const list_transaction_element = list_transaction[j];
                                var transaction_id_array = list_transaction_element.transaction_id
                                ArrTransactionId.push(transaction_id_array)
                            }
                            if (ArrTransactionId.length > 0) {
                                var DataDocumentArray = await otherMethod.GetDocumentArrayTransaction(ArrTransactionId, db_connect)
                                if (DataDocumentArray[0]) {
                                    var GetDocumentList = DataDocumentArray[1]
                                    var output = []
                                    for (let k = 0; k < GetDocumentList.length; k++) {
                                        const GetDocumentList_element = GetDocumentList[k];
                                        var doctype = GetDocumentList_element.doctype
                                        var document_id = GetDocumentList_element.document_id
                                        var path_pdf_sign = GetDocumentList_element.path_pdf_sign
                                        var transaction_id = String(GetDocumentList_element._id)
                                        var FileNamePdf = document_id + ".pdf"
                                        var TempFilename = uuid()
                                        var TempFileJsonData = uuid()
                                        var PathFolderAtt = null
                                        var attachfile_id = ""
                                        var GetDataDocTypeRes = await DocumentTypeDB.GetDetailDocTypeFromKeyword(doctype, db_connect)
                                        // console.log(GetDocumentList_element)
                                        if (!GetDataDocTypeRes[0]) {
                                            return res.status(200).json({
                                                status: false,
                                                message: "Sftp False",
                                                data: null
                                            })
                                        }
                                        var PathSftp = GetDataDocTypeRes[1]._doc.sftp.path
                                        PathSftp = await replaceKeywordInPathSftp(PathSftp, tax_id, document_id)
                                        // console.log(PathSftp)
                                        attachfile_id = GetDocumentList_element.attachfile_id
                                        // console.log(attachfile_id)
                                        if (attachfile_id != "") {
                                            var GetAttachFileData = await attachfiles_db.select_attachfile(json_data, attachfile_id)
                                            if (GetAttachFileData[0]) {
                                                var DataResGetAttachFileData = GetAttachFileData[1]._doc
                                                PathFolderAtt = DataResGetAttachFileData.path_folder
                                            }
                                        }
                                        var Base64File = await FileFunc.readFile(path_pdf_sign)
                                        var PathJsonData = await FileFunc.createFile(path_local + "/temp/" + tax_id + "/jsondata/", "", String(TempFileJsonData), "json", JSON.stringify(GetDocumentList_element))
                                        if (PathJsonData[0]) {
                                            var GetDataJsonPath = PathJsonData[1]
                                        }
                                        if (Base64File[0] === 200) {
                                            var DataBase64PdfSign = Base64File[1]
                                            var ResCreate = await FileFunc.createFileBase64(path_local + "/temp/" + tax_id + "/pdf/", String(TempFilename), "pdf", DataBase64PdfSign)
                                            path_pdf_sign = ResCreate[0]
                                        }
                                        // console.log(transaction_id)
                                        var ResSendFileSftp = await sftpMethod.ConnectSftp(document_id, transaction_id, json_data, PathSftp, path_pdf_sign, PathFolderAtt, FileNamePdf, GetDataJsonPath, String(TempFileJsonData) + ".json")
                                        await FileFunc.RemoveFileInDir(path_pdf_sign)
                                        await FileFunc.RemoveFileInDir(GetDataJsonPath)
                                    }

                                }
                            }
                        }
                    }
                }
            }
        }
        if (ResSendFileSftp == null) {
            return [false, ResSendFileSftp]
        }
        return [true, ResSendFileSftp]
    } catch (error) {
        console.log(error)
        return [false, String(error)]
    }
};

module.exports = {
    SendDocumentService
}