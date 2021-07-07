require('../config/lib')
require('../config/global')

const Update_db = require('../database/db_update');
const Select_db = require('../database/db_select');
const {
    connonsql
} = require('../config/mongo_db')
const transaction_Schema = require('../schema/transaction_document')
const chatMethod = require('../method/chat')

const ActionStepText = async (action) => {
    try {
        if (action == "input") {
            return "กรอกข้อมูล"
        } else if (action == "input_sign") {
            return "กรอกข้อมูลและอนุมัติ"
        } else if (action == "generate") {
            return "Generate"
        } else if (action == "approve") {
            return "อนุมัติ"
        } else if (action == "e-sign") {
            return "ลงลายมือชื่ออิเล็กทรอนิกส์"
        } else if (action == "sign") {
            return "ลงลายมือชื่อ"
        }
    } catch (error) {

    }
};

const StatusNodeText = async (status, action) => {
    try {
        if (status == "Y" && action == "input") {
            return "กรอกข้อมูลเรียบร้อย"
        } else if (status == "Y" && action == "approve") {
            return "อนุมัติ"
        } else if (status == "Complete") {
            return "อนุมัติ"
        } else if (status == "Incomplete") {
            return "รอดำเนินการ"
        } else if (status == "I") {
            return "รอดำเนินการ"
        } else if (status == "W" && action == "approve") {
            return "รออนุมัติ"
        } else if (status == "W" && action == "input") {
            return "รอกรอกข้อมูล"
        } else if (status == "W") {
            return "รออนุมัติ"
        } else if (status == "R") {
            return "ปฏิเสธ"
        }
    } catch (error) {

    }
}

const SendNotication = async (transaction_id, connectiondb) => {
    try {
        if (connectiondb != null) {
            await connonsql(connectiondb)
        }
        var DataDocument = await transaction_Schema.find({
            _id: {
                $in: transaction_id
            }
        })
        if (DataDocument.length >= 1) {
            for (let i = 0; i < DataDocument.length; i++) {
                var txtSendChat = ""
                const DataDocument_element = DataDocument[i];
                var Data_doc = DataDocument_element._doc
                var transaction_id = Data_doc._id
                var sender_detail = DataDocument_element.sender_detail
                // console.log(sender_detail)
                var sender_first_name_th = sender_detail.first_name_th
                var sender_last_name_th = sender_detail.last_name_th
                var thai_email = sender_detail.thai_email
                var document_id = Data_doc.document_id
                var tracking_id = Data_doc.tracking_id
                txtSendChat += "PPLv2.แจ้งเตือน Paperless\nเลขที่เอกสาร " + document_id + "\nTracking " + tracking_id + "\n\n"
                var FlowData = Data_doc.flow
                var StatusNoti = false
                for (let j = 0; j < FlowData.length; j++) {
                    const FlowDataelement = FlowData[j];
                    // console.log(FlowDataelement)
                    var CountSendChat = 1
                    var statusNode = FlowDataelement.status
                    var statusFlow = FlowDataelement.flow
                    var actorThis = FlowDataelement.actor
                    var indexStep = FlowDataelement.index
                    var actionStep = FlowDataelement.action
                    var action_detail = FlowDataelement.action_detail
                    var TextAction = await ActionStepText(actionStep)
                    var TextStatus = await StatusNodeText(statusNode, actionStep)
                    txtSendChat += "ลำดับ " + String(indexStep) + " " + String(TextAction)
                    if (statusFlow) {
                        if (action_detail.length >= 1) {
                            for (let u = 0; u < action_detail.length; u++) {
                                const action_detailelement = action_detail[u];
                                var first_name_th = action_detailelement.first_name_th
                                var last_name_th = action_detailelement.last_name_th
                                var StepNum = action_detailelement.step
                                var status = action_detailelement.status
                                var thai_email = action_detailelement.thai_email
                                var TextStatus = await StatusNodeText(status, actionStep)
                                txtSendChat += "\nลำดับ" + "ที่ " + String(indexStep) + "-" + String(StepNum) + "\n-" + first_name_th + " " + last_name_th + "" + "\nสถานะ : " + TextStatus
                                if (status == "Incomplete") {
                                    if (!StatusNoti) {
                                        var titlesendchat = document_id
                                        var textsendchat = "PPLv2." + document_id + "\nโดย " + sender_first_name_th + " " + sender_last_name_th
                                        // console.log(CountSendChat, action_detailelement)
                                        if (CountSendChat < [action_detailelement].length || CountSendChat == [action_detailelement].length) {
                                            if (CountSendChat == [action_detailelement].length) {
                                                StatusNoti = true
                                            }
                                            // console.log(CountSendChat, action_detailelement)
                                            await chatMethod.SendApproveInput(textsendchat, titlesendchat, actionStep, transaction_id, null, thai_email, tokenBotChat, idBotChat)
                                            CountSendChat = CountSendChat + 1
                                        } else {
                                            StatusNoti = true
                                        }
                                    }
                                }
                            }
                        } else {
                            txtSendChat += "\n-รอข้อมูลบ้างส่วนเพื่อดำเนินการสร้างลำดับ"
                        }
                    } else {
                        for (let y = 0; y < actorThis.length; y++) {
                            const actorThiselement = actorThis[y];
                            var first_name_th = actorThiselement.first_name_th
                            var last_name_th = actorThiselement.last_name_th
                            var statusActor = actorThiselement.status
                            var thai_email = actorThiselement.thai_email
                            if (statusNode == "Y") {
                                if (statusActor == "Complete") {
                                    var TextStatus = await StatusNodeText(statusActor, actionStep)
                                    txtSendChat += "" + "\n-" + first_name_th + " " + last_name_th + ""
                                    // console.log(statusActor)
                                }
                            } else {
                                var TextStatus = await StatusNodeText(statusActor, actionStep)
                                txtSendChat += "" + "\n-" + first_name_th + " " + last_name_th + ""
                                if (!StatusNoti) {
                                    var titlesendchat = document_id
                                    var textsendchat = "PPLv2." + document_id + "\nโดย " + sender_first_name_th + " " + sender_last_name_th
                                    // console.log(CountSendChat, actorThis)
                                    if (CountSendChat < actorThis.length || CountSendChat == actorThis.length) {
                                        if (CountSendChat == actorThis.length) {
                                            StatusNoti = true
                                        }
                                        await chatMethod.SendApproveInput(textsendchat, titlesendchat, actionStep, transaction_id, null, thai_email, tokenBotChat, idBotChat)
                                        CountSendChat = CountSendChat + 1
                                    } else {
                                        StatusNoti = true
                                    }
                                }
                            }
                        }
                        // console.log("")
                        txtSendChat += "\nสถานะ : " + TextStatus
                    }
                    txtSendChat += "\n\n"
                }
                // console.log(txtSendChat)
                await chatMethod.SendOnechatMessage(txtSendChat, thai_email, tokenBotChat, idBotChat, null)
            }
            // 
        }
        return [true]
    } catch (error) {
        return [false]
    }
};

module.exports = {
    SendNotication
}