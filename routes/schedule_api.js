require('../config/lib')
require('../config/global')
const schedule_func = require('../method/schedule_redis')

const router = express.Router();

router.post("/schedule_redis",async function (req, res) {
    try {
        result_sche = schedule_func.schedule_delete_redis()
        return res.status(200).json({
            status: true,
            message: 'success',
            data: null
        })
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: error.message,
            data: null
        })
    }
});

module.exports = router;