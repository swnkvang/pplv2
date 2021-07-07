require('../config/lib')
require('../config/global')

const router = express.Router();
const middleware = require('../method/middleware')
const attachfile_method = require('../method/attachfiles')

// var upload = multer();
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
        const result_attachfile = await attachfile_method.add_attachfiles(json_data,files_req,attachfile_id,tax_id,list_filename,transaction_id)
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

router.get("/view_download_attachfiles",async function (req,res){
    try {
        var data = req.query
        var file_id = data.file
        var json_data = req.json_data
        const result_view = await attachfile_method.view_download_attachfiles(json_data,file_id)
        if (result_view[0]){
            return res.status(200).json({
                status: true,
                message: "success",
                data: result_view[1]
            })
        }else{
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

router.get("/delete_attachfiles",async function (req,res){
    try {
        var data = req.query
        var file_id = data.file
        var json_data = req.json_data
        const result_del = await attachfile_method.delete_attachfiles(json_data,file_id)
        if (result_del[0]){
            return res.status(200).json({
                status: true,
                message: 'success',
                data: null
            })
        }else{
            throw ({
                message: result_del[2]
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

router.get("/get_attachfiles",async function (req,res){
    try {
        var data = req.query
        var attachfile_id = data.attachfile_id
        var json_data = req.json_data
        if (attachfile_id !== ''){
            const result_get = await attachfile_method.get_attachfiles(json_data,attachfile_id)
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

router.post("/delete_all_file",async function (req,res){
    try {
        var data_body = req.body
        var path_folder = data_body.path
        if (data_body.hasOwnProperty('path')){
            attachfile_method.delete_all_file(path_folder)
            return res.status(200).json({
                status: true,
                message: 'success',
                data: null
            })
        }else{
            throw ({
                message: 'parameter incorect'
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