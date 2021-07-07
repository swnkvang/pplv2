require('../config/lib')
require('../config/mongo_db')

const transactiongroup_Schema = new Schema({
    detail:{
        type: Array,
        default: [],
        required: true
    },
    list_transaction:{
        type: Array,
        default: [],
        required: true
    },
    step_now: {
        type: Number,
        default: 1,
        required: true
    },
    step_max: {
        type: Number,
        required: true
    },
    status:{
        type: String,
        default: "N",
        required: true
    },
    id_workflow:{
        type: String,
        default: "",
        required: true
    }
}, {
    minimize: false,
    timestamps: true
});

const transactiongroupModel = mongoose.model('transaction_group', transactiongroup_Schema, 'transaction_group')

module.exports = {transactiongroupModel}