require('../config/lib')
require('../config/global')

const router = express.Router();
const middleware = require('../method/middleware')
const noticationFunc = require('../function/notication.func')

router.use(middleware)
router.post("/SendNotication", async function (req, res) {
    try {
        let json_data = req.json_data
        let body = req.body
        let transaction_id = body.transaction_id
        let connectiondb = json_data.db_connect
        await noticationFunc.SendNotication(transaction_id, connectiondb)
        return res.status(200).send({
            status: true,
            message: "",
            data: null
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            status: false,
            message: "",
            data: null
        })
    }
});

module.exports = router