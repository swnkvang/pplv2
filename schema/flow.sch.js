require('../config/lib')
// require('../config/maria_db')
// require('../config/mongo_db')

const flow_Schema = new Schema({
    flow_name: String,
    flow_data: {
        type: Object,
        required: true
    },
    actor_of_flow : Array,
    status: {
        type: String,
        required: true,
        default: 'ACTIVE'
    },
    doctype : String,
    type_of_team : String,
    type_of_flow: String
}, {
    minimize: false,
    timestamps: true 
});

const flowModel = mongoose.model('flow', flow_Schema, 'flow')

module.exports = flowModel