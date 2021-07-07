require('../config/lib')
require('../config/mongo_db')

const document_tranSchema = new Schema({
    status: String,
    tracking_id: String,
    document_id: String,
    doctype: String,
    doctype_name: String,
    id_flow_tmp: String,
    flow: Array,
    path: String,
    path_pdf_original: String,
    path_pdf_sign: String,
    path_hash_original : String,
    path_pdfhashsign: String,
    pdfSize: String,
    step_now: String,
    step_max: String,
    sender_account: String,
    sender_detail: Object,
    input_data: Array,
    status_document: String,
    html: String,
    hash_html: String,
    subject: String,
    body: String,
    attachfile_id: String,
    groupid: String,
    taxid: String,
    color: String,
    flow_name_tmp: String,
    ref_document: String,
    status_view_pdf: Boolean,
    type_of_team: String,
    type_of_flow: String,
    id_workflow: String,
    status_summary_group: {
        type: Boolean,
        default: false
    },
    attachfile_summarygroup: {
        type: String,
        default: ''
    }
},
{
    timestamps : true
}
);

const documentModel = mongoose.model('transaction_document', document_tranSchema, 'transaction_document')

module.exports = documentModel