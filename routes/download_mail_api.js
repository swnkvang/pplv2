require('../config/lib')
require('../config/global')
const router = express.Router();
const { response } = require('express');
const db_transaction = require('../database/actiondb_transaction')
const attachfiledb = require('../database/attachfiles_db')

router.get("/download_link_main",async function (req, res) {
    try {
        // let condb = {
        //     "t":"0107544000094",
        //     "d":[
        //         {"sql":{"db":"0107544000094","ip":"10.0.1.11","us":"inet_tools","ps":"fu.0fh;pot","po":"3306"},"nosql":{"db":"0107544000094","ip":"10.0.1.13","us":"user_inet","ps":"wd]c8jwso8nv.d]h","po":"27017"}},{"sql":{"db":"0107544000094","ip":"10.0.1.12","us":"inet_tools","ps":"fu.0fh;pot","po":"3306"}}
        //     ],
        //     "s":[{}]
        // }
        let params = req.query
        let id_transaction = params.id_transaction
        let condb = JSON.parse(params.condb_in)
        // console.log('condb:',(condb))
        var resp = await db_transaction.find_transaction(condb,id_transaction)
        if (resp[0]) {
            let pathpdf = resp[1].path_pdf_sign
            let doc_id = resp[1].document_id
            let path = resp[1].path
            var res_readfile = await fs.readFileSync(pathpdf, 'utf-8')

            // console.log('path:',path)
            var res_write = await fs.writeFileSync(path + '/' +doc_id +".pdf", res_readfile, 'base64');
            let path_download = path + '/' +doc_id +".pdf"

            res.download(path_download, (err) => {
                if (err) {
                  res.status(500).send({
                    message: "Could not download the file. " + err,
                  });
                }
                else{
                    fs.unlink(path_download, function(err) {
                        if (err) {
                          throw err
                        } else {
                        //   console.log("Successfully deleted the file.")
                        }
                      })
                }
              });
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

router.get("/download_link_attach",async function (req, res) {
    try {
        var path_file = null
        var file_name_new = null
        // let condb = {
        //     "t":"0107544000094",
        //     "d":[
        //         {"sql":{"db":"0107544000094","ip":"10.0.1.11","us":"inet_tools","ps":"fu.0fh;pot","po":"3306"},"nosql":{"db":"0107544000094","ip":"10.0.1.13","us":"user_inet","ps":"wd]c8jwso8nv.d]h","po":"27017"}},{"sql":{"db":"0107544000094","ip":"10.0.1.12","us":"inet_tools","ps":"fu.0fh;pot","po":"3306"}}
        //     ],
        //     "s":[{}]
        // }
        let params = req.query
        let id_transaction = params.id_transaction
        let condb = JSON.parse(params.condb_in)
        let file_name = params.file_name
        var resp = await attachfiledb.select_attachfile_transactionid(condb,id_transaction)

        if (resp[0]) {
            let path_folder = resp[1].path_folder
            let detail = resp[1].detail
            for(let i=0 ; i<detail.length ; i++){
                if (detail[i].file_name == file_name){
                    path_file = detail[i].path_file
                    file_name_new = detail[i].file_name_new
                }
            }
            res.download(path_file, (err) => {
                if (err) {
                  res.status(500).send({
                    message: "Could not download the file. " + err,
                  });
                }
              });
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


router.get("/view_link_main",async function (req, res) {
    try {
        // let condb = {
        //     "t":"0107544000094",
        //     "d":[
        //         {"sql":{"db":"0107544000094","ip":"10.0.1.11","us":"inet_tools","ps":"fu.0fh;pot","po":"3306"},"nosql":{"db":"0107544000094","ip":"10.0.1.13","us":"user_inet","ps":"wd]c8jwso8nv.d]h","po":"27017"}},{"sql":{"db":"0107544000094","ip":"10.0.1.12","us":"inet_tools","ps":"fu.0fh;pot","po":"3306"}}
        //     ],
        //     "s":[{}]
        // }
        let params = req.query
        let id_transaction = params.id_transaction
        let condb = JSON.parse(params.condb_in)
        var resp = await db_transaction.find_transaction(condb,id_transaction)
        if (resp[0]) {
            let pathpdf = resp[1].path_pdf_sign
            let doc_id = resp[1].document_id
            let path = resp[1].path
            var res_readfile = await fs.readFileSync(pathpdf, 'utf-8')

            console.log('path:',path)
            var res_write = await fs.writeFileSync(path + '/' +doc_id +".pdf", res_readfile, 'base64');
            let path_download = path + '/' +doc_id +".pdf"
            // return res.status(200).json({
            //     status: true,
            //     message: null,
            //     data: tmp
            // })

            if (fs.existsSync(path_download)) {
                res.contentType("application/pdf");
                fs.createReadStream(path_download).pipe(res)
            } else {
                res.status(500)
                console.log('File not found')
                res.send('File not found')
            }

            // res.download(path_download, (err) => {
            //     if (err) {
            //       res.status(500).send({
            //         message: "Could not download the file. " + err,
            //       });
            //     }
            //     else{
            //         fs.unlink(path_download, function(err) {
            //             if (err) {
            //               throw err
            //             } else {
            //             //   console.log("Successfully deleted the file.")
            //             }
            //           })
            //     }
            //   });
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


router.get("/view_link_attach",async function (req, res) {
    try {
        var path_file = null
        var file_name_new = null
        // let condb = {
        //     "t":"0107544000094",
        //     "d":[
        //         {"sql":{"db":"0107544000094","ip":"10.0.1.11","us":"inet_tools","ps":"fu.0fh;pot","po":"3306"},"nosql":{"db":"0107544000094","ip":"10.0.1.13","us":"user_inet","ps":"wd]c8jwso8nv.d]h","po":"27017"}},{"sql":{"db":"0107544000094","ip":"10.0.1.12","us":"inet_tools","ps":"fu.0fh;pot","po":"3306"}}
        //     ],
        //     "s":[{}]
        // }
        let params = req.query
        let id_transaction = params.id_transaction
        let condb = JSON.parse(params.condb_in)
        let file_name = params.file_name
        var resp = await attachfiledb.select_attachfile_transactionid(condb,id_transaction)

        if (resp[0]) {
            let path_folder = resp[1].path_folder
            let detail = resp[1].detail
            for(let i=0 ; i<detail.length ; i++){
                if (detail[i].file_name == file_name){
                    path_file = detail[i].path_file
                    file_name_new = detail[i].file_name_new
                }
            }
            if (fs.existsSync(path_file)) {
                res.contentType("application/pdf");
                fs.createReadStream(path_file).pipe(res)
            } else {
                res.status(500)
                console.log('File not found')
                res.send('File not found')
            }
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