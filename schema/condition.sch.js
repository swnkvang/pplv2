require('../config/lib')
require('../config/maria_db')
require('../config/mongo_db')


const condition_Schema = new Schema({
    detail: {
        type: Array,
        default: [],
        required: true
    },
    type:{
        type: String,
        default: "",
        required: true
    },
    key_compare: {
        type: Array,
        default: [],
        required: false
    },
    document_type:{
        type: String,
        default: "",
        required: false
    },
}, {
    minimize: false,
    timestamps: true
});

const conditionModel = mongoose.model('condition', condition_Schema, 'condition')
module.exports = conditionModel