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
router.post("/ConsentSubmit", async function (req, res) {
    try {
        var json_data = req.json_data
        let Data = req.body
        console.log(json_data)
        return res.status(200).json({
            status: true,
            data: null,
            message: "Consent Success"
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