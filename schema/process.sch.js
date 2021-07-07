require('../config/lib')
require('../config/mongo_db')

const processSchema = new Schema({
    summary_group_id: String,
    data: {
        type: Array,
    },
    actor: {
        type: Object
    },
    status: {
        type: String,
        default:"O"
    }
}, {
    minimize: false,
    timestamps: true
});

const ProcessModel = mongoose.model('process_request', processSchema, 'process_request')

module.exports = ProcessModel