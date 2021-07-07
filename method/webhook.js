require('../config/lib')
require('../config/global')
const logService = require('../database/transaction.service_')

const calServiceWebhook = async (connectiondb, url, payload, JsonDocumentId, ArrTransactionId) => {
    try {
        // console.log(payload)
        let res = await axios.post(url, payload)
            .then(function (response) {
                logService.SaveLogServcieWebhook(connectiondb, "WEBHOOK", "1", null, JSON.stringify(JsonDocumentId), JSON.stringify(ArrTransactionId), JSON.stringify(payload), JSON.stringify(response.data), url)
                return [200, response]
            })
            .catch(function (error) {
                console.log(error)
                console.log(error.response)
                console.log(url)
                var ResDataJson = {
                    data: error.response.data,
                    status: error.response.status
                }
                console.log(ResDataJson)
                logService.SaveLogServcieWebhook(connectiondb, "WEBHOOK", "0", null, JSON.stringify(JsonDocumentId), JSON.stringify(ArrTransactionId), JSON.stringify(payload), JSON.stringify(ResDataJson), url)
                return [400, error]
            });
        return [true]
    } catch (error) {
        console.log(error)
        return [false, error.message]
    }
}

module.exports = {
    calServiceWebhook
}