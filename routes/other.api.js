require('../config/lib')
require('../config/global')

const router = express.Router();
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
const serviceMethod = require('../method/service')
const {
    connonsql
} = require('../config/mongo_db')

router.use(middleware)
router.post("/GenerateKey", async function (req, res) {
    try {
        let json_data = req.json_data
        let connectiondb = json_data.db_connect
        let body = req.body
        let serviceName = body.serviceName
        var pair = keypair();
        var PrivateKey = String(pair.private)
        var PublicKey = String(pair.public)
        var JsonData = {
            name: serviceName,
            privateKey: PrivateKey,
            publicKey: PublicKey
        }
        if (connectiondb != null) {
            await connonsql(connectiondb)
        }
        const DataService = new ServiceKeySchema(JsonData);
        await DataService.save(function (err) {
            if (err) console.log(err)
        });

        return res.send({
            status: true,
            message: "GenerateKey Success",
            data: {
                private: PrivateKey,
                public: PublicKey
            }
        })
    } catch (error) {
        console.log(error)
        return res.send({
            status: false,
            message: "GenerateKey Fail",
            data: null
        })
    }
});

router.post("/BiCalHtml", async function (req, res) {
    try {
        let json_data = req.json_data
        let dataJson = req.body
        let flow_id = dataJson.flow_id
        let jsonDetail = dataJson.jsonDetail
        let document_type = dataJson.document_type
        let input = dataJson.input
        let actor_update = dataJson.actor_update
        let connectiondb = json_data.db_connect
        let hederbiz = req.headers.taxid
        let sign_info = dataJson.sign_info
        let body = req.body
        let TransactionId = body.transaction_id
        if (connectiondb != null) {
            await connonsql(connectiondb)
        }
        if (!TransactionId) {
            return res.status(400).send({
                status: false,
                message: "transaction_id Parameter Incorrect",
                data: null
            })
        }
        let GetService = await ServiceKeySchema.findOne({
            name: "Bi"
        });
        if (!GetService) {
            return res.status(400).send({
                status: false,
                message: null,
                data: null
            })
        }
        var ResDataBi = await otherMethod.GetDocumentDataBi(TransactionId, connectiondb)
        if (ResDataBi[0]) {
            var DataResBiData = ResDataBi[1]
            var PrivateKey = GetService.privateKey
            var jwt = require('jwt-simple');
            var GetDataHtml = await calbiMethod.htmlCalData(DataResBiData)
            var inJWTJson = {
                sub: "pplv2",
                data: DataResBiData,
                iat: Math.floor(Date.now() / 1000) - 30
            }
            var token = jwt.encode(inJWTJson, PrivateKey, false, 'HS256');
            return res.status(200).send({
                status: true,
                message: "Get Data Success",
                data: {
                    html: GetDataHtml[1],
                    json: GetDataHtml[2]
                }
            })
        }
        return res.status(400).send({
            status: false,
            message: "Get Data Fail",
            data: null
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            status: false,
            message: null,
            data: null
        })
    }
});

router.post("/Decoding", async function (req, res) {
    try {
        let json_data = req.json_data
        let connectiondb = json_data.db_connect
        let body = req.body
        let data = body.data
        var decoded = jwt.decode(data, false, 'HS256');
        return res.send({
            status: true,
            message: "DecodingKey Success",
            data: decoded
        })
    } catch (error) {
        console.log(error)
        return res.send({
            status: false,
            message: "GenerateKey Fail",
            data: null
        })
    }
});

router.post("/GetDataService", async function (req, res) {
    try {
        let json_data = req.json_data
        let dataJson = req.body
        let flow_id = dataJson.flow_id
        let jsonDetail = dataJson.jsonDetail
        let document_type = dataJson.document_type
        let input = dataJson.input
        let actor_update = dataJson.actor_update
        let connectiondb = json_data.db_connect
        let hederbiz = req.headers.taxid
        let sign_info = dataJson.sign_info
        let body = req.body
        let TransactionId = body.transaction_id
        if (connectiondb != null) {
            await connonsql(connectiondb)
        }
        if (!TransactionId) {
            return res.status(400).send({
                status: false,
                message: "transaction_id Parameter Incorrect",
                data: null
            })
        }
        let GetService = await ServiceKeySchema.findOne({
            name: "Bi"
        });
        if (!GetService) {
            return res.status(400).send({
                status: false,
                message: null,
                data: null
            })
        }
        var ResDataBi = await otherMethod.GetDocumentDataBi(TransactionId, connectiondb)
        if (ResDataBi[0]) {
            var DataResBiData = ResDataBi[1]
            var PrivateKey = GetService.privateKey
            var jwt = require('jwt-simple');
            var JWT_AUTH = require('simple-jwt-auth')
            // var GetDataHtml = await calbiMethod.htmlCalData(DataResBiData)
            var inJWTJson = {
                iss: "https://ppl.one.th",
                sub: "pplv2",
                data: DataResBiData,
                iat: Math.floor(Date.now() / 1000) - 30,
                aud: "simple-jwt-auth"
            }
            // console.log(PrivateKey)
            // const tokenAuth = JWT_AUTH.createSecureDistributedAuthToken({
            //     headerClaims: {
            //         alg: 'RS256',
            //         kid: '4.some_directory',
            //         typ: 'JWT'
            //     },
            //     claims: inJWTJson,
            //     PrivateKey, // rsa pem format private key string
            // });

            var token = jwt.encode(inJWTJson, PrivateKey, false, 'HS256');
            return res.status(200).send({
                status: true,
                message: "Get Data Success",
                data: DataResBiData
            })
        }
        return res.status(400).send({
            status: false,
            message: "Get Data Fail",
            data: null
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            status: false,
            message: "Get Data Fail",
            data: null
        })
    }
});

router.post("/General", async function (req, res) {
    try {
        let json_data = req.json_data
        var db_connect = json_data.db_connect
        let body = req.body
        let transaction = body.transaction_id
        var tax_id = req.headers.taxid
        var GetServiceRes = await serviceMethod.SendDocumentService(transaction, tax_id, db_connect, json_data)
        return res.status(200).json({
            status: true,
            message: null,
            data: GetServiceRes
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: String(error),
            data: null
        })
    }
});

router.post("/WebhookService", async function (req, res) {
    try {
        let json_data = req.json_data
        var db_connect = json_data.db_connect
        let body = req.body
        let webhook = body.webhook
        var transaction_id = body.transaction_id
        var GetTokenData = await otherMethod.GetServiceWebhookData(transaction_id, webhook, db_connect, json_data)
        if (GetTokenData[0]) {
            var TokenData = GetTokenData[1]
            return res.status(200).json({
                status: true,
                message: "",
                data: TokenData

            }).end()
        }

    } catch (error) {

    }
});

module.exports = router