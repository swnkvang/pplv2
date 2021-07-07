require('../config/lib')
require('../config/global')
const find_log = require('../function/func_logger')
const middleware = require('../method/middleware')
const schedule_func = require('../method/schedule_redis')


const router = express.Router();
router.use(middleware)


router.post("/search_logger_main",async function (req, res) {
    try {
        let body = req.body
        let tax_id = req.headers.taxid
        var keyword = body.keyword
        var folder = body.folder
        var date_str = body.date_str
        var time_str = body.time_str
        // console.log('date_str:',date_str)
        // console.log('time_str:',time_str)
        if (date_str == null || date_str == '' ){
            date_str = timemoment().format('YYYY-MM-DD')
            // time_str = (timemoment().format('HH'))+'.00'+ '-' +(timemoment().format('HH'))+'.59'
        }
        if (time_str == null || time_str == ''){
            time_str = (timemoment().format('HH'))+'.00'+ '-' +(timemoment().format('HH'))+'.59'
        }
        var get_log = await find_log.find_data_logger_at_now(keyword,folder,tax_id,date_str,time_str)
        // var get_log = await find_log.find_data_logger_at_now_v2(keyword,folder,tax_id,date_str,time_str)
        return res.status(200).json({
            result: "OK",
            messageText: get_log[1],
            status_Code: 200
        });
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

router.post("/search_logger_main_like",async function (req, res) {
    try {
        let body = req.body
        let tax_id = req.headers.taxid
        var keyword = body.keyword
        var folder = body.folder
        var date_str = body.date_str
        var time_str = body.time_str
        // console.log('date_str:',date_str)
        // console.log('time_str:',time_str)
        if (date_str == null || date_str == '' ){
            date_str = timemoment().format('YYYY-MM-DD')
            // time_str = (timemoment().format('HH'))+'.00'+ '-' +(timemoment().format('HH'))+'.59'
        }
        if (time_str == null || time_str == ''){
            time_str = (timemoment().format('HH'))+'.00'+ '-' +(timemoment().format('HH'))+'.59'
        }
        // var get_log = await find_log.find_data_logger_at_now(keyword,folder,tax_id,date_str,time_str)
        var get_log = await find_log.find_data_logger_at_now_like(keyword,folder,tax_id,date_str,time_str)
        return res.status(200).json({
            result: "OK",
            messageText: get_log[1],
            status_Code: 200
        });
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

router.post("/search_logger_all",async function (req, res) {
    try {
        let body = req.body
        let tax_id = req.headers.taxid
        var folder = body.folder
        var date_str = body.date_str
        var time_str = body.time_str
        // console.log('date_str:',date_str)
        // console.log('time_str:',time_str)
        if (date_str == null || date_str == '' ){
            date_str = timemoment().format('YYYY-MM-DD')
            // time_str = (timemoment().format('HH'))+'.00'+ '-' +(timemoment().format('HH'))+'.59'
        }
        if (time_str == null || time_str == ''){
            time_str = (timemoment().format('HH'))+'.00'+ '-' +(timemoment().format('HH'))+'.59'
        }
        var get_log = await find_log.find_data_logger_all(tax_id,folder,date_str,time_str)
        return res.status(200).json({
            result: "OK",
            messageText: get_log[1],
            status_Code: 200
        });
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

// router.post("/search_logger_main",async function (req, res) {
//     try {
//         let body = req.body
//         let tax_id = req.headers.taxid
//         var keyword = body.keyword

//         // "id" : "9679b84d-9ed7-44f8-9569-7557d48858e6",
//         // "url" : "/orgchart/api/v1/get_orgchart/sale?account_id=1567120770",
//         // "datetime" : "2021-03-10T15:07:59",
//         // "account_id" : "1567120770"
//         let date_str = timemoment().format('YYYY-MM-DD')
//         let time_str = (timemoment().format('HH'))+'.00'+ '-' +(timemoment().format('HH'))+'.59'

//         console.log('date_str:',date_str)
//         console.log('time_str:',time_str)

//         var get_log = await find_log.find_data_logger(keyword,tax_id)
//         return res.status(200).json({
//             result: "OK",
//             messageText: get_log[1],
//             status_Code: 200
//         });
//     } 
//     catch (error) {
//         console.log(error)
//         return res.status(400).json({
//             status: false,
//             message: error.message,
//             data: null
//         })
//     }
// });

module.exports = router;