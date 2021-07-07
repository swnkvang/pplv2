require('../config/lib')
require('../config/global')

const router = express.Router();
const middleware = require('../method/middleware')
const attachfile_method = require('../method/attachfiles')

router.get("/download_attachfiles",async function (req,res){
    try {
        var data = req.query
        var file_id = data.file
        var conToken = data.con
        var action = 'downloand'
        const result_dowload = await attachfile_method.view_download_attachfiles_v2(conToken,file_id,action,res)
        if (!result_dowload[0]){
            throw ({
                message: result_dowload[1]
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

router.get("/view_attachfiles",async function (req,res){
    try {
        var data = req.query
        var file_id = data.file
        var conToken = data.con
        var action = 'view'
        const result_view = await attachfile_method.view_download_attachfiles_v2(conToken,file_id,action,res)
        console.log(result_view,'result_view')
        if (!result_view[0]){
            throw ({
                message: result_view[1]
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

router.post('/add_files',upload.any(), async function (req, res) {
    try {
        const files_req = req.files
        var tax_id = req.headers.taxid
        var json_data = req.json_data
        var data_json = req.body
        var attachfile_id = data_json.attachfile_id
        var transaction_id = data_json.transaction_id
        var list_filename = JSON.parse(data_json.file_name)
        const result_attachfile = await attachfile_method.add_attachfiles_v2(json_data,files_req,attachfile_id,tax_id,list_filename,transaction_id)
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