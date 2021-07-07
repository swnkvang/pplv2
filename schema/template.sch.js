require('../config/lib')
require('../config/mongo_db')

const template_Schema = new Schema({
    template_name :{ type: String, required: true},
    template_data :{ type: Array, default: [], required: true},
    status:{ type: String, default: "ACTIVE"},
    document_type:{ type: String, required: true},
    account_id:{ type: String, required: true}
},{
    minimize: false,
    timestamps: true
});

const templateModel = mongoose.model('template_input', template_Schema, 'template_input')

module.exports = {templateModel}