require('../config/lib')
require('../config/global')
const logService = require('../database/transaction.service_')

const ConnectSftp = async (document_id, transaction_id, json_data, pathSftp, path_pdf_sign, pathAttach, FileNamePdf, GetDataJsonPath, FileNameJson) => {
    var arrResult = []
    const config = JsonSftp
    var one_result_data = json_data.one_result_data.id
    var db_connect = json_data.db_connect
    // console.log(DataBase64PdfSign)
    resultService = "1"
    let sftp = new Client;
    try {
        var PdfOrgFile = pathSftp + "/" + FileNamePdf
        await sftp.connect(config)
        try {
            await sftp.mkdir(pathSftp, true);
            arrResult.push({
                status: true,
                action: "mkdir success",
                user: one_result_data
            })
        } catch (error) {
            console.log(error)
            arrResult.push({
                status: false,
                action: error,
                user: one_result_data
            })
        }
        if (GetDataJsonPath) {
            try {
                await sftp.fastPut(GetDataJsonPath, pathSftp + "/" + FileNameJson);
                arrResult.push({
                    status: true,
                    action: "JsonData fastPut success",
                    user: one_result_data
                })
            } catch (error) {
                console.log(error)
                arrResult.push({
                    status: false,
                    action: error,
                    user: one_result_data
                })
            }
        }
        if (path_pdf_sign) {
            try {
                await sftp.fastPut(path_pdf_sign, PdfOrgFile);
                arrResult.push({
                    status: true,
                    action: "PdfSign fastPut success",
                    user: one_result_data
                })
            } catch (error) {
                console.log(error)
                arrResult.push({
                    status: false,
                    action: error,
                    user: one_result_data
                })
            }
        }
        if (pathAttach) {
            try {
                await sftp.uploadDir(pathAttach, pathSftp)
                arrResult.push({
                    status: true,
                    action: "Attachment uploadDir success",
                    user: one_result_data
                })
            } catch (error) {
                console.log(error)
                arrResult.push({
                    status: false,
                    action: error,
                    user: one_result_data
                })
            }
        }
        for (let i = 0; i < arrResult.length; i++) {
            const arrResult_element = arrResult[i];
            var status = arrResult_element.status
            if (status == false) {
                resultService = "0"
            }
        }
        arrResult = JSON.stringify(arrResult)
        logService.SaveLogServcie(db_connect, "SFTP", resultService, arrResult, document_id, transaction_id)
        return [true, arrResult]
    } catch (error) {
        console.log(error)
        resultService = "0"
        arrResult.push({
            status: false,
            action: String(error),
            user: one_result_data
        })
        arrResult = JSON.stringify(arrResult)
        logService.SaveLogServcie(db_connect, "SFTP", resultService, arrResult, document_id, transaction_id)
        return [false, error.message]
    } finally {
        sftp.end();
    }
};

module.exports = {
    ConnectSftp
}