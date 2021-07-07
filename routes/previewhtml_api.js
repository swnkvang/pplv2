require('../config/lib')
require('../config/global')


const router = express.Router();
const middleware = require('../method/middleware')
const genhtml_preview = require('../method/preview_html')
const convertpdf = require('../method/convertpdf')
const actiondb_transaction = require('../database/actiondb_transaction')
const html_to_pdf = require('../method/htmltopdf')


router.use(middleware)

router.post("/generate_preview_html", async function (req, res) {
    try {
        let data_body = req.body
        if (data_body.hasOwnProperty('input') && data_body.hasOwnProperty('document_id') && data_body.hasOwnProperty('doctype')) {
            const input = data_body.input
            const document_id = data_body.document_id
            const doctype = data_body.doctype
            // const nodeHtmlToImage = require('node-html-to-image');
            const res_preview = await genhtml_preview.genhtml_preview(input, document_id, doctype)
            if (res_preview[0]) {
                // const image = await nodeHtmlToImage({
                //     encoding: "base64",
                //     html: res_preview[2]
                // });
                return res.status(200).json({
                    status: true,
                    message: null,
                    data: res_preview[2]
                })
            } else {
                throw ({
                    message: res_preview[1]
                })
            }
        } else {
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

})

router.post("/GetImageHtml", async function (req, res) {
    try {
        let data_body = req.body
        if (data_body.hasOwnProperty('input') && data_body.hasOwnProperty('document_id') && data_body.hasOwnProperty('doctype')) {
            const input = data_body.input
            const document_id = data_body.document_id
            const doctype = data_body.doctype
            const type_view = data_body.type_view
            const ref_document = data_body.ref_document
            const nodeHtmlToImage = require('node-html-to-image');
            const res_preview = await genhtml_preview.genhtml_preview(input, document_id, doctype, type_view, ref_document)
            if (res_preview[0]) {
                const image = await nodeHtmlToImage({
                    puppeteerArgs: {
                        // executablePath:"/usr/bin/google-chrome",
                        executablePath: "/app/node_modules/chromium/lib/chromium/chrome-linux/chrome",
                        defaultViewport: {
                            width: 1190,
                            height: 1666
                        },
                        headless: true,
                        args: [
                            "--no-sandbox"
                        ]
                    },
                    encoding: "base64",
                    html: res_preview[2]
                });
                return res.status(200).json({
                    status: true,
                    message: null,
                    data: image
                })
            } else {
                throw ({
                    message: res_preview[1]
                })
            }
        } else {
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

})

router.post("/GetImageHtml_v2", async function (req, res) {
    try {
        let data_body = req.body
        var json_data = req.json_data
        if (data_body.hasOwnProperty('input') && data_body.hasOwnProperty('document_id') && data_body.hasOwnProperty('doctype')) {
            const input = data_body.input
            const document_id = data_body.document_id
            const doctype = data_body.doctype
            const type_view = data_body.type_view
            const ref_document = data_body.ref_document
            // const nodeHtmlToImage = require('node-html-to-image');
            const res_preview = await genhtml_preview.genhtml_preview(input, document_id, doctype, type_view, ref_document)
            if (res_preview[0]) {
                const genhtmltoPdf = await html_to_pdf.htmltoPDF_v2(json_data,res_preview[2],'A4','false',req.headers.taxid,document_id,url_convert_html_pdf)
                if (genhtmltoPdf[0]){
                    return res.status(200).json({
                        status: true,
                        message: null,
                        data: genhtmltoPdf[1]
                    })
                }else{
                    throw ({
                        message: genhtmltoPdf[1]
                    })
                }
            } else {
                throw ({
                    message: res_preview[1]
                })
            }
        } else {
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

})

router.post("/previewImageHtml", async function (req, res) {
    try {
        let json_data = req.json_data
        let data_body = req.body
        if (data_body.hasOwnProperty('transaction_id')) {
            const transaction_id = data_body.transaction_id
            let connectiondb = json_data.db_connect
            let result_transaction = await actiondb_transaction.find_transaction(connectiondb,transaction_id)
            if (result_transaction[0]) {
                let doctype = result_transaction[1].doctype
                let ref_document = result_transaction[1].ref_document
                let document_id = result_transaction[1].document_id
                let input = result_transaction[1].input_data
                let step_now = result_transaction[1].step_now
                let flow = result_transaction[1].flow
                let type_view = flow[step_now-1].sequence_type
                const nodeHtmlToImage = require('node-html-to-image');
                const res_preview = await genhtml_preview.genhtml_preview_version2(input, document_id, doctype, type_view, ref_document)
                if (res_preview[0]) {
                    const image = await nodeHtmlToImage({
                        puppeteerArgs: {
                            // executablePath:"/usr/bin/google-chrome",
                            executablePath: "/app/node_modules/chromium/lib/chromium/chrome-linux/chrome",
                            defaultViewport: {
                                width: 1190,
                                height: 1666
                            },
                            headless: true,
                            args: [
                                "--no-sandbox"
                            ]
                        },
                        encoding: "base64",
                        html: res_preview[2]
                    });
                    return res.status(200).json({
                        status: true,
                        message: null,
                        data: image
                    })
                } else {
                    throw ({
                        message: res_preview[1]
                    })
                }
            }
            
        } else {
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

})

// router.post("/GetImageHtml2", async function (req, res) {
//     try {
//         let data_body = req.body
//         if (data_body.hasOwnProperty('input') && data_body.hasOwnProperty('document_id') && data_body.hasOwnProperty('doctype')) {
//             const input = data_body.input
//             const document_id = data_body.document_id
//             const doctype = data_body.doctype
//             const type_view = data_body.type_view
//             const ref_document = data_body.ref_document
//             // const nodeHtmlToImage = require('node-html-to-image');
//             const res_preview = await genhtml_preview.genhtml_preview(input, document_id, doctype, type_view, ref_document)
//             if (res_preview[0]) {
//                 try {
//                     const puppeteer = require('puppeteer');
//                     const browser = await puppeteer.launch({
//                         executablePath: "/app/node_modules/chromium/lib/chromium/chrome-linux/chrome"
//                     });
//                     console.log(browser)
//                     // puppeteer.executablePath = "/app/node_modules/chromium/lib/chromium/chrome-linux/chrome"
//                     const page = await browser.newPage();
//                     await page.setViewport({
//                         height: 1666,
//                         width: 1190
//                     });

//                     // await page.goto(path_sign);
//                     await page.setContent(res_preview[2])

//                     // if your HTML is in memory (as a string), you load it like this:
//                     // page.setContent(htmlString);

//                     const imageBuffer = await page.screenshot({});

//                     await browser.close();

//                     // await fs.writeFileSync('rendered.png', imageBuffer);

//                     // convert to base64 string if you want to:
//                     var base_img = imageBuffer.toString('base64')
//                     // console.log(imageBuffer.toString('base64'));
//                     return res.status(200).json({
//                         status: true,
//                         message: null,
//                         data: base_img
//                     })
//                 } catch (error) {
//                     throw ({
//                         message: error.message
//                     })
//                 }
//                 // const image = await nodeHtmlToImage({
//                 //     puppeteerArgs: {
//                 //         // executablePath:"/usr/bin/google-chrome",
//                 //         executablePath: "/app/node_modules/chromium/lib/chromium/chrome-linux/chrome",
//                 //         defaultViewport: {
//                 //             width: 800,
//                 //             height: 600
//                 //         },
//                 //         headless: true,
//                 //         args: [
//                 //             "--no-sandbox"
//                 //         ]
//                 //     },
//                 //     encoding: "base64",
//                 //     html: res_preview[2]
//                 // });
//                 // return res.status(200).json({
//                 //     status: true,
//                 //     message: null,
//                 //     data: image
//                 // })
//             } else {
//                 throw ({
//                     message: res_preview[1]
//                 })
//             }
//         } else {
//             throw ({
//                 message: 'parameter incorrect'
//             })
//         }
//     } catch (error) {
//         console.log(error)
//         return res.status(400).json({
//             status: false,
//             message: error.message,
//             data: null
//         })
//     }

// })

router.post("/GetPDFHtml", async function (req, res) {
    try {
        let data_body = req.body
        if (data_body.hasOwnProperty('html')) {
            var file_in = data_body.html
            var GetDataPdf = await convertpdf.GenPdfV1(file_in)
            return res.status(200).json(GetDataPdf)
        } else {
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

})





module.exports = router