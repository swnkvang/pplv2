require('../config/lib')
require('../config/global')
const {
    connonsql
} = require('../config/mongo_db')
const flow_Schema = require('../schema/flow.sch')
const transaction_Schema = require('../schema/transaction_document')
const JsonFn = require('../function/func_json')
const ServiceKeySchema = require('../schema/serviceKey.sch')
const db_transaction = require('../database/actiondb_transaction')
const transac_group = require('../database/transaction_group')
const SecertKeyMd = require("../method/secret.key")
const WebHookMd = require("../method/webhook")
const DocumentTypeDB = require('../database/document.type')

var urlparse = require('url');

const GetDocumentDataBi = async (arrTransactionId, connectiondb) => {
    try {
        var TempArrDataBi = []
        if (connectiondb != null) {
            await connonsql(connectiondb)
        }
        for (let i = 0; i < arrTransactionId.length; i++) {
            const element = arrTransactionId[i];
            arrTransactionId[i] = mongoose.Types.ObjectId(element)
        }
        var GetDocumentData = await transaction_Schema.find({
            _id: {
                $in: arrTransactionId
            }
        }, {
            html: 0,
            pdfSize: 0,
            hash_html: 0,
            __v: 0,
            groupid: 0,
            path: 0,
            path_pdf_original: 0,
            path_pdf_sign: 0,
            path_hash_original: 0,
            path_pdfhashsign: 0,
            id_flow_tmp: 0,
            "flow.actor.sign_base64": 0,
            "flow.action_detail.sign_base64": 0
        });
        if (GetDocumentData.length == arrTransactionId.length) {
            for (let i = 0; i < GetDocumentData.length; i++) {
                const GetDocumentData_element = GetDocumentData[i];
                var DataDocument = GetDocumentData_element._doc
                TempArrDataBi.push(DataDocument)
            }
            return [true, TempArrDataBi]
        } else {
            return [false, "GetDocumentData.length != arrTransactionId.length"]
        }
    } catch (error) {
        console.log(error)
        return [false, error.message]
    }
};

const GetDocumentArrayTransaction = async (arrTransactionId, connectiondb) => {
    try {
        var TempArrDataBi = []
        if (connectiondb != null) {
            await connonsql(connectiondb)
        }
        for (let i = 0; i < arrTransactionId.length; i++) {
            const element = arrTransactionId[i];
            arrTransactionId[i] = mongoose.Types.ObjectId(element)
        }
        var GetDocumentData = await transaction_Schema.find({
            $and: [{
                _id: {
                    $in: arrTransactionId
                },
                status_document: "Y",
                status: "ACTIVE"
            }]
        }, {
            html: 0,
            pdfSize: 0,
            hash_html: 0,
            __v: 0,
        });
        for (let i = 0; i < GetDocumentData.length; i++) {
            const GetDocumentData_element = GetDocumentData[i];
            var DataDocument = GetDocumentData_element._doc
            TempArrDataBi.push(DataDocument)
        }
        return [true, TempArrDataBi]
    } catch (error) {
        console.log(error)
        return [false, error.message]
    }
};

const GetServiceWebhookData = async (transaction_id, webhook, connectiondb, json_data) => {
    try {
        var ArrTransactionId = []
        var DataArray = []
        if (connectiondb != null) {
            await connonsql(connectiondb)
        }
        var GetData = await db_transaction.find_transaction(connectiondb, transaction_id)
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
                    }
                }
            }
        }
        if (ArrTransactionId.length > 0) {
            var DataDocumentArray = await GetDocumentDataBi(ArrTransactionId, connectiondb)
            if (DataDocumentArray[0]) {
                var GetDocumentList = DataDocumentArray[1]
                for (let i = 0; i < GetDocumentList.length; i++) {
                    var TempArrTensactionId = []
                    var TempArrDocumentId = []
                    const GetDocumentList_element = GetDocumentList[i];
                    var transactionId = String(GetDocumentList_element._id)
                    var document_id = String(GetDocumentList_element.document_id)
                    var doctype = String(GetDocumentList_element.doctype)
                    var GetDataDocTypeRes = await DocumentTypeDB.GetDetailDocTypeFromKeyword(doctype, connectiondb)
                    if (GetDataDocTypeRes[2]) {
                        var DataTypeDoc = GetDataDocTypeRes[1]._doc
                        var webhook = DataTypeDoc.webhook.path
                    }
                    var JsonTransactionId = {
                        transaction_id: TempArrTensactionId
                    }
                    var JsonDocumentId = {
                        document_id: TempArrDocumentId
                    }
                    var Array_webhook = String(webhook).split("|")
                    for (let i = 0; i < Array_webhook.length; i++) {
                        const UrlWebhook = Array_webhook[i];
                        var url_parts = urlparse.parse(UrlWebhook, true)
                        var query = url_parts.query;
                        TempArrTensactionId.push(transactionId)
                        TempArrDocumentId.push(document_id)
                        if ('cid' in query) {
                            var cid = query.cid
                            let GetService = await ServiceKeySchema.findOne({
                                name: cid
                            });
                            if (GetService) {
                                var DataServiceKey = GetService._doc
                                var subid = String(DataServiceKey._id)
                                var PublicKey = DataServiceKey.publicKey
                                var PrivateKey = DataServiceKey.privateKey
                                var GetTokenData = await SecertKeyMd.GenerateTokenDataForService(GetDocumentList_element, subid, PrivateKey)
                                if (GetTokenData[0]) {
                                    var DataGetToken = GetTokenData[1]
                                    var ResData = {
                                        document_id: document_id,
                                        token_data: DataGetToken,
                                        url: UrlWebhook
                                    }
                                    DataArray.push(ResData)
                                    var PayloadWebhook = {
                                        status: true,
                                        data: DataGetToken
                                    }
                                    await WebHookMd.calServiceWebhook(connectiondb, UrlWebhook, PayloadWebhook, JsonDocumentId, JsonTransactionId)
                                }
                            }
                        }
                    }
                }

            }
        }
        return [true, DataArray]
    } catch (error) {
        console.log(error)
        return [false]
    }
}

module.exports = {
    GetDocumentDataBi,
    GetDocumentArrayTransaction,
    GetServiceWebhookData
}