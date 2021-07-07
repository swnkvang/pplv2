require('../config/lib')
require('../config/global')
const middleware = require('../method/middleware')
const router = express.Router();
router.use(middleware)
const db_transaction = require('../database/transaction_db')


router.get("/transaction_all",async function (req, res) {
    try {
        let json_data = req.json_data
        let params = req.query
        const document_type = params.document_type
        const limit = Number(params.lim)
        const offset = Number(params.off)
        const keyword = params.keyword
        var result_document = await db_transaction.find_transaction_all(json_data,document_type,keyword,limit,offset)
        if (result_document[0]) {
            return res.status(200).json({
                status: true,
                message: null,
                data: result_document[1]
            })
        } else {
            return res.status(400).json({
                status: true,
                message: result_document[2],
                data: result_document[1]
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

router.get("/count_transaction",async function (req, res) {
    try {
        let json_data = req.json_data
        let params = req.query
        const document_type = params.document_type
        var result_document = await db_transaction.count_transaction(json_data,document_type)
        if (result_document[0]) {
            return res.status(200).json({
                status: true,
                message: null,
                data: result_document[1]
            })
        } else {
            return res.status(400).json({
                status: true,
                message: result_document[2],
                data: result_document[1]
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