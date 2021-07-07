require('../config/lib')
require('../config/mongo_db')

// const detaildropdown_Schema = new Schema({
//     document_type:{
//         type: String,
//         default: "",
//         required: true
//     },
//     detail: {
//         type: Array,
//         default: [],
//         required: true
//     }
// }, {
//     minimize: false,
//     timestamps: true
// });
// const detaildropdownModel = mongoose.model('detail_dropdown', detaildropdown_Schema, 'detail_dropdown')
const detaildropdown_Schema = new Schema({
    document_type:{
        type: String,
        default: "",
        required: true
    },
    detail: {
        type: Array,
        default: [],
        required: true
    },
    type_of_team:{
        type:String,
        default: null
    },
    type_of_flow:{
        type:String,
        default: null
    }
}, {
    minimize: false,
    timestamps: true
});
const detaildropdownModel = mongoose.model('detail_dropdown', detaildropdown_Schema, 'detail_dropdown')

module.exports = {detaildropdownModel}