require('../config/lib')
require('../config/global')
const router = express.Router();
const cvmData = require('../method/cvm_data');
const serviceData = require('../database/service_db');
const Trans_doc = require('../schema/transaction_document')
const document_func = require('../method/document.func');
const {
    querySql
} = require("../config/maria_db")
const {
    connonsql
} = require('../config/mongo_db');
const {
    transactiongroupModel
} = require('../schema/transaction_group.sch');

router.post("/GetDocument", async function (req, res) {
    try {
        var data_json = req.body
        var tax_id = data_json.tax_id
        var token_service = data_json.token
        var dtm_start = data_json.dtm_start
        var dtm_end = data_json.dtm_end
        var document_type = data_json.document_type
        if (!dtm_start && !dtm_end) {
            return res.status(400).json({
                status: false,
                message: "dtm_start && dtm_end not found",
                data: null
            })
        }
        let login_data = await sodium_ppl.login_service(token_service, tax_id)
        var type_data = ''
        if (login_data[0]) {
            const json_data = login_data[1].db_data
            var arrResult = []
            query = await document_func.GetDocumentService_v2(dtm_start, dtm_end, document_type, json_data)
            if (query[0]) {
                return res.status(200).json({
                    status: true,
                    message: "Get Data Success",
                    data: query[1]
                })
            } else {
                return res.status(400).json({
                    status: false,
                    message: "Get Data Success && Data Not Found",
                    data: arrResult
                })
            }
        } else {
            throw ({
                message: login_data[1]
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: error.message,
            data: null
        })
    }
});

router.post("/GetReportSftp", async function (req, res) {
    try {
        var data_json = req.body
        var tax_id = data_json.tax_id
        var token_service = data_json.token
        var dtm_start = data_json.dtm_start
        var dtm_end = data_json.dtm_end
        var document_type = data_json.document_type
        let login_data = await sodium_ppl.login_service(token_service, tax_id)
        var type_data = ''
        var arrTempdocument_success = []
        var Query = null
        if (login_data[0]) {
            const json_data = login_data[1].db_data
            // console.log(json_data)
            await connonsql(json_data)

            if (!dtm_start && !dtm_end) {
                var today = new Date();
                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                dateTime = date + ' ' + time;
                var today = dateTime
                var date = today.split(' ')[0]
                dtm_start = date + ' ' + '00:00:00'
                dtm_end = date + ' ' + '23:59:59'
            } else {
                dtm_start = dtm_start + ' ' + '00:00:00'
                dtm_end = dtm_end + ' ' + '23:59:59'
            }
            console.log(dtm_start, dtm_end)
            if (!document_type) {
                document_type = "CS"
            }
            if (!tax_id) {
                tax_id = "0107544000094"
            }
            console.log(document_type, tax_id, dtm_start, dtm_end)
            var Data = await transactiongroupModel.find({
                $and: [{
                    detail: {
                        $elemMatch: {
                            document_type: document_type
                        }
                    }
                }, {
                    status: "Y"
                }, {
                    updatedAt: {
                        $gte: dtm_start,
                        $lte: dtm_end
                    }
                }]
            })
            for (let i = 0; i < Data.length; i++) {
                const Data_element = Data[i];
                var detailDocinGroup = Data_element.detail
                var list_transactionDocinGroup = Data_element.list_transaction
                for (let j = 0; j < detailDocinGroup.length; j++) {
                    const detailDocinGroupelement = detailDocinGroup[j];
                    var document_success = detailDocinGroupelement.document_success
                    for (let y = 0; y < list_transactionDocinGroup.length; y++) {
                        const list_transactionDocinGroupelement = list_transactionDocinGroup[y];
                        var transaction_idsccuess = list_transactionDocinGroupelement.transaction_id
                        if (document_success == list_transactionDocinGroupelement.document_id) {
                            arrTempdocument_success.push(transaction_idsccuess)
                        }
                    }
                }
                console.log(arrTempdocument_success)
            }
            var sql = {}
            if (arrTempdocument_success.length == 0) {
                throw ({
                    message: "Data Not Found"
                })
            }
            var queryData = [arrTempdocument_success];
            let sqlinsertdoc = {
                sql: `
                        SELECT
                            *
                        FROM
                        tb_transaction_service
                        WHERE
                            other_service = 'SFTP'
                            AND transaction_id in ?`,
                values: [queryData]
            }
            Query = await querySql(json_data, sqlinsertdoc)
            return res.status(200).json({
                status: true,
                message: "Get Data Success",
                data: Query
            })
        } else {
            throw ({
                message: login_data[1]
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: error.message,
            data: null
        })
    }
});

module.exports = router