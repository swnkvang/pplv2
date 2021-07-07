require('../config/lib')
require('../config/global')
const actiondbTransaction = require('../database/actiondb_transaction')
const attachfiles_db = require('../database/attachfiles_db')
const func_savefile = require('../function/func_savefile')
const attachfile_method = require('../method/attachfiles')
const db_doctype = require('../database/db_select')
const transaction_sendmail = require('../database/transaction_sendmail')

async function zip_folder(base64pdf,path_attachfile,document_id,detail_attachfile){
    try {
        // require modules
        const fs = require('fs');
        const archiver = require('archiver');
        let filename_zip = '/' + document_id + '.zip'
        // create a file to stream archive data to.
        const output = fs.createWriteStream('/app' + filename_zip);
        const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
        });

        // listen for all archive data to be written
        // 'close' event is fired only when a file descriptor is involved
        // output.on('close', function() {
        // console.log(archive.pointer() + ' total bytes');
        // console.log('archiver has been finalized and the output file descriptor has closed.');
        // });

        // This event is fired when the data source is drained no matter what was the data source.
        // It is not part of this library but rather from the NodeJS Stream API.
        // @see: https://nodejs.org/api/stream.html#stream_event_end
        output.on('end', function() {
        console.log('Data has been drained');
        });

        // good practice to catch warnings (ie stat failures and other non-blocking errors)
        archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
            // log warning
        } else {
            // throw error
            throw err;
        }
        });

        // good practice to catch this error explicitly
        archive.on('error', function(err) {
        throw err;
        });

        // pipe archive data to the file
        archive.pipe(output);

        // append a file from stream
        // const file1 = path_pdf_main
        // archive.append(fs.createReadStream(file1), { name: 'file1.txt' });

        for (let i=0;i<detail_attachfile.length;i++) {
            const file1 = detail_attachfile[i].path_file
            archive.append(fs.createReadStream(file1), { name: 'attachfile/' + detail_attachfile[i].file_name });
        }

        // append a file from string
        // archive.append('string cheese!', { name: 'file2.txt' });

        // append a file from buffer
        const buffer3 = Buffer.from(base64pdf, 'base64');
        archive.append(buffer3, { name: 'mainpdf/' + document_id + '.pdf' });

        // append a file
        // archive.file('file1.txt', { name: 'file4.txt' });

        // append files from a sub-directory and naming it `new-subdir` within the archive
        // archive.directory(path_attachfile, '/attachfile');

        // append files from a sub-directory, putting its contents at the root of archive
        // archive.directory(path_attachfile, false);

        // append files from a glob pattern
        // archive.glob('file*.txt', {cwd:__dirname});

        // finalize the archive (ie we are done appending files but streams have to finish yet)
        // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
        await archive.finalize();
        return '/app' + filename_zip
    } catch (error) {
        console.log('error',error.message)
    }
}

async function sendmail(data_decry,transaction_id,recvier,bcc_email){
   try {
    var connectiondb =  data_decry.db_connect
    var path_sign_mainPdf = null
    var pdf_main = null
    var document_id = null
    var filenamePdfMain = null
    var attachfile_id = null
    var path_attachfile = null
    var detail_attachfile = null
    var str_detail_attachfile = null
    var email_center = null
    var status_sendmail = false
    var text_html_attach =''
    var sender = 'Paperless@V2'
    var result_document = await actiondbTransaction.find_transaction(connectiondb,transaction_id)
    if (result_document[0]) {
        path_sign_mainPdf = result_document[1].path_pdf_sign
        pdf_main = await fs.readFileSync(path_sign_mainPdf,'utf-8')
        document_id = result_document[1].document_id
        filenamePdfMain = document_id + '.pdf'
        attachfile_id = result_document[1].attachfile_id
        var resp_attachfiles = await attachfiles_db.select_attachfile(data_decry,attachfile_id)
        if (resp_attachfiles[0]) {
            path_attachfile = resp_attachfiles[1].path_folder
            var result_get = await attachfile_method.get_attachfiles(data_decry,attachfile_id)
            if (result_get[0]) {
                detail_attachfile = result_get[1].detail
                str_detail_attachfile =  ''
                for(let i=0;i<detail_attachfile.length;i++) {
                    str_detail_attachfile += detail_attachfile[i].file_name + '\n'
                    if (i == 0){
                        text_html_attach += "<p> &nbsp &nbsp &nbsp &nbsp -ไฟล์แนบ : " +detail_attachfile[i].file_name+"<a href='https://ppl.one.th/nodeapi/downloadmail/api/v1/download_link_attach?id_transaction=" +transaction_id+"&file_name=" +detail_attachfile[i].file_name+"&condb_in=" +JSON.stringify(connectiondb)+"'> ดาวโหลดที่ไฟล์ </a><a href='https://ppl.one.th/nodeapi/downloadmail/api/v1/view_link_attach?id_transaction=" +transaction_id+"&file_name=" +detail_attachfile[i].file_name+"&condb_in=" +JSON.stringify(connectiondb)+"'> ดูเอกสาร </a></p>"
                    }
                    else if (i>0){
                        text_html_attach += "\<p> &nbsp &nbsp &nbsp &nbsp -ไฟล์แนบ : " +detail_attachfile[i].file_name+"<a href='https://ppl.one.th/nodeapi/downloadmail/api/v1/download_link_attach?id_transaction=" +transaction_id+"&file_name=" +detail_attachfile[i].file_name+"&condb_in=" +JSON.stringify(connectiondb)+"'> ดาวโหลดที่ไฟล์ </a><a href='https://ppl.one.th/nodeapi/downloadmail/api/v1/view_link_attach?id_transaction=" +transaction_id+"&file_name=" +detail_attachfile[i].file_name+"&condb_in=" +JSON.stringify(connectiondb)+"'> ดูเอกสาร </a></p>"
                    }
                    // return [false,str_detail_attachfile]
                }
            }
        }
    }
    // var path_zip = await zip_folder(pdf_main,path_attachfile,document_id,detail_attachfile)
    var mail_subject = 'แจ้งเตือนนำส่งเอกสารไฟล์หลักและไฟล์แนบ ' + document_id
    var mail_body = "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"></head><body><p><b>" + 'นำส่งเอกสารหลักและไฟล์แนบ' +"</b></p>\
    <p> &nbsp &nbsp เลขที่เอกสาร " + document_id +"</p>\
    <p>&nbsp &nbsp &nbsp" + 'รายการเอกสาร' + "</p>\
    <p> &nbsp &nbsp &nbsp &nbsp -ไฟล์หลัก : " + filenamePdfMain + "<a href='https://ppl.one.th/nodeapi/downloadmail/api/v1/download_link_main?id_transaction=" +transaction_id+"&condb_in=" +JSON.stringify(connectiondb)+"'> ดาวโหลดที่ไฟล์ </a><a href='https://ppl.one.th/nodeapi/downloadmail/api/v1/view_link_main?id_transaction=" +transaction_id+"&condb_in=" +JSON.stringify(connectiondb)+"'> ดูเอกสาร </a></p>\
    " + text_html_attach +"\
    <p><i>© Copyright 2020, Internet Thailand Public Company Limited.</i><br><br>กรุณาอย่าตอบกลับอีเมลนี้</p></body></html>"
    // var bcc_email = ['farrutt.th@inet.co.th']
    const transporter = nodemailer.createTransport({
        host: 'mailtx.inet.co.th',
        port: '25',
    });
    // console.log('main:',"'https://ppl.one.th/nodeapi/downloadmail/api/v1/download_link_main?id_transaction=" +transaction_id+"&condb_in=" +JSON.stringify(connectiondb)+"'> ดาวโหลดที่ไฟล์ </a><a href='https://ppl.one.th/nodeapi/downloadmail/api/v1/view_link_main?id_transaction=" +transaction_id+"&condb_in=" +JSON.stringify(connectiondb)+"'")
    // console.log('view:',"<a href='https://ppl.one.th/nodeapi/downloadmail/api/v1/download_link_attach?id_transaction=" +transaction_id+"&file_name=" +str_detail_attachfile+"&condb_in=" +JSON.stringify(connectiondb)+"'> ดาวโหลดที่ไฟล์ </a><a href='https://ppl.one.th/nodeapi/downloadmail/api/v1/view_link_attach?id_transaction=" +transaction_id+"&file_name=" +str_detail_attachfile+"&condb_in=" +JSON.stringify(connectiondb)+"'")
    // setup email data with unicode symbols
    const mailOptions = {
    from: sender,              // sender
    to: recvier,              // list of receivers
    bcc: bcc_email,
    subject: mail_subject,    // Mail subject
    html: mail_body,
    // attachments: [
    //                 {
    //                     path: path_zip
    //                 }
    //             ]
    };
    // send mail with defined transport object
    var msg_error = null
    await transporter.sendMail(mailOptions, async function (err, info) {
        if(err) {
            status_sendmail = false
            console.log('error msg',err.message)
            msg_error = err.message
            var res_log = await transaction_sendmail.insert_log_sendmail(data_decry, transaction_id, status_sendmail, sender, recvier, mail_subject, mail_body, bcc_email, msg_error)
            return [false,'fail',msg_error]
        }
        else {
            status_sendmail = true
            var res_log = await transaction_sendmail.insert_log_sendmail(data_decry, transaction_id, status_sendmail, sender, recvier, mail_subject, mail_body, bcc_email, msg_error)
            // console.log(info);
            return [true,'success',null]
        }
    });

   } catch (error) {
        console.log('error',error)
        return [false,'fail',error.message]
   }
}

module.exports = {
    sendmail
}