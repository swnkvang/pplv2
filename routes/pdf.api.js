require('../config/lib')
require('../config/global')
const router = express.Router();
const org = require('../method/orgchart_process')
const middleware = require('../method/middleware')
const get_data = require('../method/get_data_process')
const otherMethod = require('../method/other.process')
const calbiMethod = require('../function/func_htmldata')
const pdfMethod = require('../function/pdf.func')
const ServiceKeySchema = require('../schema/serviceKey.sch')
const savefile = require('../function/func_savefile')
const {
    connonsql
} = require('../config/mongo_db')


router.post("/GetPdfDetail", async function (req, res) {
    try {
        let body = req.body
        let PdfData = body.PdfData
        var pdfDetail = await pdfMethod.getDetailPdf(PdfData)
        return res.status(200).json({
            status: pdfDetail[0],
            message: null,
            data: pdfDetail[1]
        })
    } catch (error) {
        console.log(error)
    }

})

router.post("/createPdftext", async function (req, res) {
    try {
        let body = req.body
        const PdfData = body.pdf_data
        const path_pdf = body.path_pdf
        const text_name = body.text_name
        await savefile.createDir("/app/storage/0107544000094/pdf/2021-06-23/f92ed051-c9d4-4f64-8b35-e1ed97bbce77/sign")
        fs.writeFile(path_pdf+text_name, PdfData, function (err) {
            if (err) console.log(err)
        });
        return res.status(200).json({
            status: true,
            message: "success",
            data: null
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: true,
            message: error.message,
            data: null
        })
    }

})

module.exports = router