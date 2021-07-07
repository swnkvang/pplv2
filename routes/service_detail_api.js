require('../config/lib')
require('../config/global')

const router = express.Router();
const servicedetail = require('../method/service_data');
const servicedetail_db = require('../database/service_detail');
const middleware = require('../method/middleware')

router.use(middleware)

router.get("/test",async function (req, res) {
    var json_data = req.json_data
    let doc = parser.parseXls2Json('C:/Users/ASUS/Downloads/Service CS Solution , Standard 28042021.xlsx');
    let service_detail = doc[0]
    for (let i =0; i<service_detail.length;i++){
        if (service_detail[i].service_name !=''){
            if (service_detail[i].cost_unit===''){
                service_detail[i].cost_unit = 0
            }
            if (service_detail[i].internal ===''){
                service_detail[i].internal = 0
            }
            if (service_detail[i].external_jv===''){
                service_detail[i].external_jv = 0
            }
            if (service_detail[i].external===''){
                service_detail[i].external = 0
            }
        }
        
    }
    service_detail = service_detail.filter(service => service.service_name != '');
    // console.log(service_detail)
    // console.log(Object.keys(doc[0][1]))
    // len_key = Object.keys(doc[0][1]).length
    // console.log(len_key)
    // for (let i =0; i<doc[0].length;i++){ 
    //     service_list.push(Object.values(doc[0][i]))
    //     // console.log(Object.values(obj))
    // }
    
    const result_insert = await servicedetail.insert_muti_service(json_data,service_detail)
    // console.log(result_insert,'result_insert')
    res.send (service_detail)
        //print the data of the first sheet
    // console.log('EXCELL:',doc[0]);
    // if (result_insert){
    //     res.send (doc[0])
    // }else{
    //     res.send (result_insert[1])
    // }
});

router.post("/add_servicedata",upload.single('file_excel'),async function (req, res) {
    try {
        const files_req = req.file
        var json_data = req.json_data
        const result_insert = await servicedetail.add_servicedata(json_data,files_req)
        if (result_insert[0]){
            return res.status(200).json({
                status: true,
                message: 'success',
                data: null
            })
        }else{
            throw ({
                message: result_insert[1]
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

router.get("/get_servicedata",async function (req, res) {
    try {
        let data = req.query
        var json_data = req.json_data
        const result_select = await servicedetail_db.select_servicedetail(json_data,data)
        if (result_select[0]){
            return res.status(200).json({
                status: true,
                message: 'success',
                data: result_select[1]
            })
        }else{
            throw ({
                message: result_select[1]
            })
        }
        // res.send('OK') 
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