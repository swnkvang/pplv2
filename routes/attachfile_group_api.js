require('../config/lib')
require('../config/global')

const router = express.Router();
const middleware = require('../method/middleware')
const attachfile_method = require('../method/attachfiles')

router.get("/download_attachfilesGroup",async function (req,res){
    try {
        var data = req.query
        const file_id = data.file
        const con_token = data.con
        const action = "downloand"
        const result_dowmload = await attachfile_method.view_download_attachfileGroup(file_id,con_token,action,res)
        if (!result_dowmload[0]){
            throw ({
                message: result_dowmload[1]
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

router.get("/view_attachfilesGroup",async function (req,res){
    try {
        var data = req.query
        const file_id = data.file
        const con_token = data.con
        const action = "view"
        const result_dowmload = await attachfile_method.view_download_attachfileGroup(file_id,con_token,action,res)
        if (!result_dowmload[0]){
            throw ({
                message: result_dowmload[1]
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

router.use(middleware)

router.post('/addfileGroup',upload.any(), async function (req, res) {
    try {
        const files_req = req.files
        if (!(files_req===undefined)&&files_req.length!==0){
            var tax_id = req.headers.taxid
            var json_data = req.json_data
            var data_json = req.body
            var SummaryGroup_id = data_json.SummaryGroup_id
            var list_filename = JSON.parse(data_json.file_name)
            const result_attachfile = await attachfile_method.add_attachfiles_group(json_data,files_req,tax_id,list_filename,SummaryGroup_id)
            if (result_attachfile[0]){
                return res.status(200).json({
                    status: true,
                    message: 'success',
                    data: result_attachfile[1]
                })
            }else{
                return res.status(400).json({
                    status: false,
                    message: result_attachfile[2],
                    data: result_attachfile[1]
                })
            }
        }else{
            var tmperror = {
                msg_thai : 'ไม่พบไฟล์ที่ต้องการแนบ',
                msg_eng : 'Could not find the file you want to attach.'
            }
            return res.status(400).json({
                status: false,
                message: tmperror,
                data: null
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

router.get("/get_attachfileGroup",async function (req,res){
    try {
        var data = req.query
        var attachfile_id = data.attachfile_group
        var json_data = req.json_data
        if (attachfile_id !== ''){
            const result_get = await attachfile_method.get_attachfileGroup(json_data,attachfile_id)
            if (result_get[0]){
                return res.status(200).json({
                    status: true,
                    message: 'success',
                    data: result_get[1]
                })
            }else{
                throw ({
                    message: result_get[1]
                })
            }
        }else{
            return res.status(200).json({
                status: true,
                message: 'success',
                data: []
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