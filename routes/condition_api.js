require('../config/lib')
require('../config/global')

const router = express.Router();
const { response } = require('express');

const Condition = require('../method/conditon');

router.post("/node",async function (req, res) {
    let dataJson = req.body
    conditionID = '5ff3eb06d2fd9d3d209e60b7'
    Selected_taxid = '0107544000094'
    token = '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'
    resp = await Condition.ch_condition_node(conditionID,Selected_taxid,token)
    res.send(resp)
});


// router.get("/test_base64",async function (req, res) {

//     try{
//         let path__file = 'D:/test_file/ts_dump.pdf'
//         let new_path = 'D:/test_file/save/ts_dump.pdf'
//         var result_r = await fs.readFileSync(path__file, {encoding: 'base64'})
//         var result_w = await fs.writeFileSync(new_path, result_r, 'base64')
//         // var base_str = result_r.toString('base64')
//         // let json_data = req.json_data
//         // let connectiondb = json_data.db_connect
//         // var body = req.body
//         // var transaction_id = body.transaction_id
//         // var user_id = json_data.one_result_data.id
        
//         // if (result[0] == true){
//             return res.status(200).json({
//                 result: "OK",
//                 messageText: result_r,
//                 status_Code: 200
//             });
//         // }
//         // else{
//         //     return res.status(400).json({
//         //         result: "ER",
//         //         messageText: result_r,
//         //         status_Code: 400
//         //     });
        
        
//     }
//     catch (error) {
//         return res.status(400).json({
//             result: "ER",
//             messageText: error.message,
//             status_Code: 400
//         });
//     }

    
// });


module.exports = router