require('../config/lib')
require('../config/global')
require('../callAPI/axiosAPI')

const SendOnechatMessage = async (message, one_id, token_bot, bot_chat_id, custom_notification) => {
    try {
        // console.log(token_bot)
        // var token_bot = "Bearer " + token_bot
        if (custom_notification == null) {
            custom_notification = "Paperless Notification"
        }
        var messageJson = {
            to: one_id,
            bot_id: bot_chat_id,
            type: "text",
            message: message,
            custom_notification: custom_notification
        }
        // console.log("Send Message Sender to : ", one_id)
        var url_SendMessage = url_onechat + '/api/v1/push_message'
        var resSendMessage = await Call.callPost_v2(url_SendMessage, token_bot, messageJson)
        // console.log(resSendMessage)
    } catch (error) {
        console.log(error)
    }
};


const SendApproveInput = async (textsendchat, titlesendchat, action, hash_transactionid, custom_notification, one_id, token_bot, bot_chat_id) => {
    try {
        if (custom_notification == null) {
            custom_notification = "พบรายการเอกสารเข้ามาใหม่!"
        }
        var urlDoc = web_ppl + 'onechat/task?action=' + action + '&id=' + hash_transactionid + '&access='
        var urlViewPdf = web_ppl + '?sumpage=' + hash_transactionid
        var sign = "true"
        var body = {
            bot_id: bot_chat_id,
            to: one_id,
            custom_notification: custom_notification,
            official_template_info: {
                type: "official_template",
                detail: textsendchat,
                title: titlesendchat,
                image: "https://www.img.in.th/images/83ca9b38ee2d7d129f1826f75ea05e4f.png",
                onclick_img: {
                    sign: "true",
                    type: "webview",
                    size: "full",
                    url: urlViewPdf
                },
                choice: [{
                    label: "Approve",
                    bio_authen: "true",
                    type: "webview",
                    url: urlDoc,
                    size: "full",
                    color: "#000000",
                    sign: sign
                }, {
                    label: "Reject",
                    bio_authen: "true",
                    type: "webview",
                    url: urlDoc,
                    size: "full",
                    color: "#000000",
                    sign: sign
                }]
            },
            task_info: {
                priority: "1",
                title: "",
                task_message: "0",
                detail: "",
                time_start: "",
                time_end: "",
                assign: [],
                sign_info: {
                    type: "webview",
                    size: "full",
                    label: "Test",
                    url: "",
                    sign: sign
                }
            }
        }
        // console.log(body)
        // console.log("Send Message Approve to : ", one_id)
        var url_SendMessage = url_onechat + '/api/v1/paperless_send_approve'
        var resSendMessage = await Call.callPost_v2(url_SendMessage, token_bot, body)
        console.log('resSendMessage',resSendMessage)
        // var url_PushMessage = GLOBAL_VALUE.URL_ONECHAT + '/api/v1/paperless_send_approve'
        // var resPushMessage = await axiosMethod.post_v2(url_PushMessage, messageJson, token_bot)
        // console.log(resSendMessage)
    } catch (error) {
        console.log(error)

    } 
};

module.exports = {
    SendOnechatMessage,
    SendApproveInput
}