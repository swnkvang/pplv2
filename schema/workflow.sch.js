require('../config/lib')
require('../config/mongo_db')

const work_flowSchema = new Schema({
    name: String,
    list_document_type: Array,
    status: String,
    permission: Array,
    user_create: Object,
    pdfbase64: String,
    version: String,
    code: String,
    detail:Array,
    status_group: Boolean,
    status_refesh_key : Boolean
},
{
    timestamps : true
}
);

const workflowModel = mongoose.model('workflow_document', work_flowSchema, 'work_flow')

module.exports = workflowModel