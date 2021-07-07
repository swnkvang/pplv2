require('../config/lib')
require('../config/mongo_db')

const doc_typeSchema = new Schema({
    type_name: String,
    keyword: String,
    type: String,
    detail: String,
    dept_role: Object,
    prefix: String,
    digit: Number,
    createBy: String,
    updateBy: String,
    sftp: {
        type: Object,
        default: {
            status: false,
            path: ""
        }
    },
    webhook: {
        type: Object,
        default: {
            status: false,
            path: ""
        }
    },
    sendmail: { 
        type: Object,
        default: {
            status: false,
            path: ""
        }
    },
    onebox: {
        type: Object,
        default: {
            status: false
        }
    }

}, {
    minimize: false,
    timestamps: true
});

const document_typeModel = mongoose.model('document_type', doc_typeSchema, 'document_type')

module.exports = document_typeModel