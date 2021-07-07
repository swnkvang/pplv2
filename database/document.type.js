require('../config/lib')
const documentTypeSch = require('../schema/document_type.sch');
const {
    connonsql
} = require('../config/mongo_db')

const GetDetailDocTypeFromKeyword = async (keyword, connectiondb) => {
    try {
        var webhook_status = false
        var sftp_status = false
        await connonsql(connectiondb)
        var DataDocType = await documentTypeSch.findOne({
            keyword: keyword
        })
        if (DataDocType) {
            var DataDocType_Get = DataDocType._doc
            sftp_status = DataDocType_Get.sftp.status
            webhook_status = DataDocType_Get.webhook.status
            return [sftp_status, DataDocType, webhook_status]
        } else {
            return [false, null]
        }
    } catch (error) {
        return [false, error.message]
    }
};

module.exports = {
    GetDetailDocTypeFromKeyword
}