require('../config/lib')
require('../config/mongo_db')

const document_ref_tranSchema = new Schema({
    document_id: String,
    doctype: String,
    doctype_ref: String,
    doc_id_ref: String,
    last_ref: Number
},
{
    timestamps : true
}
);

const document_refModel = mongoose.model('transaction_ref_document', document_ref_tranSchema, 'transaction_ref_document')

module.exports = document_refModel