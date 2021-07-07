require('../config/lib')
require('../config/mongo_db')

const SummaryGroupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    actor: {
        type: Object,
        required: true
    },
    array_transaction_id: {
        type: Array,
        require: true
    },
    color: {
        type: String,
        require: true
    },
    document_type: {
        type: String,
        require: true
    },
    array_document_id: {
        type: Array,
        require: true
    },
    signature: {
        type: String,
        default: ""
    },
    process_id: {
        type: String,
        default: ""
    },
    StatusUpdateGroup: {
        type: Boolean,
        default: true
    },
    attachfile_group: {
        type: String,
        default: ""
    }
}, {
    minimize: false,
    timestamps: true
});

const summaryGroupModel = mongoose.model('summaryGroup', SummaryGroupSchema, 'summaryGroup')

module.exports = summaryGroupModel