require('../config/lib')
require('../config/global')

const router = express.Router();
const middleware = require('../method/middleware');
const db_transaction = require('../database/actiondb_transaction')
const transaction_download = require('../database/transactiondownload_db')
const html_to_pdf = require('../method/htmltopdf')
router.use(middleware)

router.post("/dowload_pdf",async function (req, res) {
    try {
        let data = req.body
        var json_data = req.json_data
        if (data.hasOwnProperty('transactionid')) {
            var transaction_id = data.transactionid
            const result_select = await db_transaction.find_transaction(json_data.db_connect,transaction_id)
            var pdf_base = null
            if (result_select[0]){
                var html_text = result_select[1].html
                var html_hash = result_select[1].hash_html
                const genhtmltoPdf = await html_to_pdf.htmltoPDF(json_data,html_text,'A4','false',req.headers.taxid,transaction_id)
                return res.status(200).json({
                    status: true,
                    message: 'success',
                    data: genhtmltoPdf[1]
                })
                // const result_dowload = await transaction_download.select_transactiondownload(json_data,transaction_id)
                // if (result_dowload[0]){
                //     if (result_dowload[1]==="no_data"){
                //         const genhtmltoPdf = await genpdf.generatePdf_v5(html_text,null,false)
                //         if (genhtmltoPdf[0]){
                //             transaction_download.insert_transactiondownload(json_data,transaction_id,html_hash,genhtmltoPdf[1])
                //             return res.status(200).json({
                //                 status: true,
                //                 message: 'success',
                //                 data: genhtmltoPdf[1]
                //             })
                //         }else{
                //             throw ({
                //                 message: genhtmltoPdf[1]
                //             })
                //         }
                //     }else{
                //         hash_trasaction = result_dowload[1].html_hash
                //         if (html_hash===hash_trasaction){
                //             pdf_base = result_dowload[1].pdf_base
                //             return res.status(200).json({
                //                 status: true,
                //                 message: 'success',
                //                 data: pdf_base
                //             })
                //         }else{
                //             const genhtmltoPdf = await genpdf.generatePdf_v5(html_text,null,false)
                //             if (genhtmltoPdf[0]){
                //                 transaction_download.update_transactiondownload(json_data,transaction_id,html_hash,genhtmltoPdf[1])
                //                 return res.status(200).json({
                //                     status: true,
                //                     message: 'success',
                //                     data: genhtmltoPdf[1]
                //                 })
                //             }else{
                //                 throw ({
                //                     message: genhtmltoPdf[1]
                //                 })
                //             }
                //         }
                //     }
                        
                // }else{
                //     throw ({
                //         message: result_dowload[1]
                //     })
                // }
            }else{
                throw ({
                    message: result_select[1]
                })
            }
        }else{
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

router.get("/view_pdf",async function (req, res) {
    try {
        let json_data = req.json_data
        let condb = json_data.db_connect
        let params = req.query
        let id_transaction = params.id_transaction
        var resp = await db_transaction.find_transaction(condb,id_transaction)
        if (resp[0]) {
            let pathpdf = resp[1].path_pdf_sign
            var res_readfile = await fs.readFileSync(pathpdf, 'utf-8')
            tmp = {
                base64: res_readfile
            }
            return res.status(200).json({
                status: true,
                message: null,
                data: tmp
            })
        } else {
            return res.status(400).json({
                status: false,
                message: null,
                data: resp[1]
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