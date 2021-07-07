require('../config/lib')
require('../config/global')
const router = express.Router();
const middleware = require('../method/middleware')
const condition_method = require('../database/coditionmethod');

router.use(middleware)



router.post("/get_tmp_flow",async function (req, res) {
    try {
        let data = req.body
        if (data.hasOwnProperty('document_type') && data.hasOwnProperty('type_of_team') &&  data.hasOwnProperty('type_of_flow')){
            let json_data = req.json_data
            let document_type = data.document_type
            let type_of_team = data.type_of_team
            let type_of_flow = data.type_of_flow
            let resp = await condition_method.find_template_v2(json_data.db_connect,document_type,type_of_team,type_of_flow)
            if (resp[0]){
                return res.status(200).json({
                    status: true,
                    message: 'success',
                    data: resp[1]
                })
            }else {
                return res.status(400).json({
                    status: false,
                    message: resp[2],
                    data: resp[1]
                })
            }
        }else {
            return res.status(400).json({
                status: false,
                message: null,
                data: 'parameter incorrect'
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