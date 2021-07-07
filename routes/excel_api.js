require('../config/lib')
require('../config/global')
const middleware = require('../method/middleware')
const router = express.Router();
router.use(middleware)
const { response } = require('express');
const document_func = require('../method/document.func');
const savefile = require('../function/func_savefile')
const actiontransaction = require('../database/actiondb_transaction');
// const Flow = require('../method/process_flow');
// const db_flow = require('../database/actiondb_flow')
// const db_transaction = require('../database/actiondb_transaction')
// const func_document = require('../function/func_docuement')

router.post("/my_document",async function (req, res) {
    try {
        let json_data = req.json_data
        let account_id = json_data.one_result_data.id
        let connectiondb = json_data.db_connect
        let dataJson = req.body
        let limit = dataJson.limit
        let offset = dataJson.offset
        // let datetime_start = dataJson.datetime_start
        // let datetime_end = dataJson.datetime_end
        // let document_type = dataJson.document_type
        // let status_document = dataJson.status_document
        let res_data = null 
        result = await actiontransaction.find_all_document(connectiondb)
        // result_select_tt = await Select_db.func_get_all_doc_recp_filter_v2(account_id, status, keyword, doc_type, limit, offset)
        if (result[0]) {
            res_data =  result[1]
            for(let i=0;i<res_data.length;i++){
                if (res_data[i].status == 'CANCEL') {
                    res_data[i].status_translate = 'ยกเลิกโดยผู้ส่ง'
                }
                else if (res_data[i].status_document == 'Y') {
                    res_data[i].status_translate = 'อนุมัติเเล้ว'
                } else if (res_data[i].status_document == 'N') {
                    res_data[i].status_translate = 'กำลังดำเนินการ'
                } else if (res_data[i].status_document == 'R') {
                    res_data[i].status_translate = 'ปฏิเสธอนุมัติ'
                }
                res_data[i].name_sender = res_data[i].sender_detail.first_name_th + ' ' + res_data[i].sender_detail.last_name_th
            }
        } else {
            return res.status(400).json({
                status: false,
                message: 'get_all_doc_recipient fail',
                data: result[1]
            })
        }
        // return res.status(200).json({
        //     status: true,
        //     message: 'success',
        //     data: result
        // })
        var workbook = new ExcelJS.Workbook();
        var sheetName = 'My Sheet';
        var sheet = workbook.addWorksheet(sheetName);
        sheet.properties.defaultColWidth = 20;
        sheet.properties.defaultRowHeight = 25;
        // sheet.mergeCells('B1:D1');
        // sheet.getCell('B1').value = 'รายงานสรุปรายละเอียดการดำเนินการเอกสาร paperless';
        // sheet.getCell('B1').alignment = { horizontal:'center'} ;
        sheet.getCell('B40').note = 'Hello, ExcelJS!';

        sheet.columns = [
                            {key: "doctype_name", header: "ประเภทเอกสาร"},
                            {key: "flow_name_tmp", header: "ประเภท Cost Sheet"},
                            {key:"tracking_id", header:"เลขที่ติดตามเอกสาร"},
                            {key: "document_id", header: "เลขที่เอกสาร"},
                            {key: "subject", header: "หัวข้อเอกสาร"},
                            {key: "body", header: "รายละเอียดเอกสาร"},
                            {key: "status_translate", header: "สถานะเอกสาร"},
                            {key: "step_now", header: "ลำดับปัจจุบัน"},
                            {key: "step_max", header: "ลำดับทั้งหมด"},
                            {key: "name_sender", header: "ผู้ส่งเอกสาร"}
                        ];
        const font_header = { name: 'Arial', size: 12, bold: true };
        const align_header = { vertical: 'middle', horizontal: 'center'};

        // ตั้งค่า font
        sheet.getCell('A1').font  = font_header
        sheet.getCell('B1').font = font_header
        sheet.getCell('C1').font = font_header
        sheet.getCell('D1').font = font_header
        sheet.getCell('E1').font = font_header
        sheet.getCell('F1').font = font_header
        sheet.getCell('G1').font = font_header
        sheet.getCell('H1').font = font_header
        sheet.getCell('I1').font = font_header
        sheet.getCell('J1').font = font_header
        // ตั้งค่า ตำเเหน่ง
        sheet.getCell('A1').alignment = align_header
        sheet.getCell('B1').alignment = align_header
        sheet.getCell('C1').alignment = align_header
        sheet.getCell('D1').alignment = align_header
        sheet.getCell('E1').alignment = align_header
        sheet.getCell('F1').alignment = align_header
        sheet.getCell('G1').alignment = align_header
        sheet.getCell('H1').alignment = align_header
        sheet.getCell('I1').alignment = align_header
        sheet.getCell('J1').alignment = align_header

        for(i in res_data){
            let row = sheet.addRow(res_data[i]);
           
        }

        // sheet.columns.forEach(column => {
        //     column.width = column.header.length < 12 ? 12 : column.header.length
        //   })
        
       
        
        var datetime = timemoment().format('YYYY-MM-DD')
        console.log('datetime',datetime)
        let filename = 'report' + datetime + '_' + uuid() + '.xlsx'
        let path_save_xlxs = '/app/storage/0107544000094/excel_report/' + datetime + '/' 
        try {
            await savefile.createDir(path_save_xlxs)
        } catch (err) {
            console.error(err)
        }
        let path_excel = path_save_xlxs + filename
        workbook.xlsx.writeFile(path_excel).then(() => {
            // callback(null);
        });
        return res.status(200).json({
            status: true,
            message: 'success',
            data: null
        })
       
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