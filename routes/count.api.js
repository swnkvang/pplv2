require('../config/lib')
require('../config/global')
const middleware = require('../method/middleware')
const summaryGroupFunc = require('../function/summaryGroup.func')
const flowFunc = require('../function/flow.func')
const Flow = require('../method/process_flow');
const logService = require('../database/transaction.service_')
const countFunc = require('../function/count.func')
const router = express.Router();


router.use(middleware)
router.get("/GetCountDocument", async function (req, res) {
    try {
        var json_data = req.json_data
        var GetCountInfo = await countFunc.GetCountSummaryGroup(json_data)
        return res.status(200).json({
            status: true,
            data: {
                summaryGroupCount_all: GetCountInfo[1][0],
                summaryGroupCount_y: GetCountInfo[1][7],
                summaryGroupCount_w: GetCountInfo[1][6],
                document_all: GetCountInfo[1][1],
                document_status_w: GetCountInfo[1][2],
                document_status_n: GetCountInfo[1][3],
                document_status_y: GetCountInfo[1][4],
                document_status_r: GetCountInfo[1][5],
                document_cancel: GetCountInfo[1][8],
            },
            message: "Get Count Success"
        }).end()
    } catch (error) {
        return res.status(400).json({
            status: false,
            data: null,
            message: String(error)
        }).end()
    }
});


module.exports = router