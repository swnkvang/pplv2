require('../config/lib')
require('../config/global')

const router = express.Router();
const middleware = require('../method/middleware')
const transactiongroup_db = require('../database/transaction_group')

router.use(middleware)

router.get("/get_groupdetail",async function (req, res) {
    try {
        let data = req.query
        var json_data = req.json_data
        if (data.hasOwnProperty('group_id')){
            const group_id = data.group_id
            resp = await transactiongroup_db.select_transactiongroup(json_data,group_id)
            if (resp[0]){
                return res.status(200).json({
                    status: true,
                    message: null,
                    data: resp[1]
                })
            }else {
                throw ({
                    message: resp[1]
                })
            }
        }else {
            throw ({
                message: 'parameter incorrect'
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