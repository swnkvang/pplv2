require('../config/lib')
require('../config/global')
const middleware = require('../method/middleware')
const summaryGroupFunc = require('../function/summaryGroup.func')
const flowFunc = require('../function/flow.func')
const Flow = require('../method/process_flow');
const logService = require('../database/transaction.service_')
const countFunc = require('../function/count.func')
const syncData = require('../method/cron.job')
const router = express.Router();


router.get("/CronJob/syncOneid", async function (req, res) {
    try {
        syncData.SyncOneid_v2()
        return res.status(200).json({
            status: true,
            data: null,
            message: "SyncDataProcess"
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