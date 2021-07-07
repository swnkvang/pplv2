require('../config/lib')
require('../config/global')
require('../callAPI/axiosAPI')
const transaction_Schema = require('../schema/transaction_document')
const sign_method = require('../function/sign.func')
const {
    connonsql
} = require('../config/mongo_db')
const {
    querySql
} = require("../config/maria_db")

const removeItemAll = (arr, value) => {
    var i = 0;
    if (arr != []) {
        while (i < arr.length) {
            if (arr[i] === value) {
                arr.splice(i, 1);
            } else {
                ++i;
            }
        }
        return arr;

    }
}

const flowCalJsonUpdate = async (connectiondb, ArrTransaction, data_citizen, tax_id, statusControl) => {
    try {
        var SignInfo = null
        var arrResJson = []
        var UserId = data_citizen.id
        var Signature = await sign_method.select_string_sign(UserId, connectiondb)
        if (Signature[0] == 200) {
            SignInfo = Signature[1].p_sign
        }
        var ArrResult = []
        if (connectiondb != null) {
            await connonsql(connectiondb)
        }
        var Data = await transaction_Schema.find({
            _id: {
                $in: ArrTransaction
            }
        })
        if (Data.length == 0) {
            return [false, "Not Found"]
        }
        for (let i = 0; i < Data.length; i++) {
            const Dataelement = Data[i];
            var DataDoc = Dataelement._doc
            var transactionId = DataDoc._id
            var input_data = DataDoc.input_data
            var DataFlow = DataDoc.flow
            for (let j = 0; j < DataFlow.length; j++) {
                const DataFlowelement = DataFlow[j];
                var action = DataFlowelement.action
                var status = DataFlowelement.status
                var indexStep = DataFlowelement.index
                if ((action == 'e-sign' || action == "approve") && status == 'W') {
                    var action_detail = DataFlowelement.action_detail
                    var actor = DataFlowelement.actor
                    if (action_detail.length > 0) {
                        for (let g = 0; g < action_detail.length; g++) {
                            // console.log('ch',DataFlowelement.stepnow_actiondetail,action_detail[g].step)
                            if (DataFlowelement.stepnow_actiondetail == action_detail[g].step) {
                                const action_detail_element = action_detail[g];
                                var account_id = action_detail_element.account_id
                                var FlowStatus = action_detail_element.status
                                if (UserId == account_id && FlowStatus == 'Incomplete') {
                                    var JsonDetail = {
                                        transaction_id: transactionId,
                                        json_update: [{
                                            index: indexStep,
                                            status: statusControl
                                        }],
                                        input_info: input_data,
                                        sign_info: SignInfo,
                                        attachfile_id: null
                                    }
                                    arrResJson.push(JsonDetail)
                                }
                            }
                        }
                    } else {
                        var JsonDetail = {
                            transaction_id: transactionId,
                            json_update: [{
                                index: indexStep,
                                status: statusControl
                            }],
                            input_info: input_data,
                            sign_info: SignInfo,
                            attachfile_id: null
                        }
                        arrResJson.push(JsonDetail)
                    }

                }
            }
            ArrResult.push(DataFlow)
        }
        return [true, arrResJson]
    } catch (error) {
        console.log(error)
        return [false, error]
    }
}


module.exports = {
    flowCalJsonUpdate,
    removeItemAll
}