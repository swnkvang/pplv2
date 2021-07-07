require('../config/lib')
// require('../config/maria_db')
require('../config/mongo_db')

const attachfile_Schema = new Schema({
    folder_name:{
        type: String,
        default: "",
        required: true
    },
    detail: {
        type: Array,
        default: [],
        required: true
    },
    limit_storage:{
        type: Number,
        default: 52428800,
        required: true
    },
    storage_use:{
        type: Number,
        default: 0,
        required: true
    },
    path_folder:{
        type: String,
        default: "",
        required: true
    },
    transaction_id:{
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

const attachfileModel = mongoose.model('attachfile', attachfile_Schema, 'attachfile')

module.exports = {attachfileModel}