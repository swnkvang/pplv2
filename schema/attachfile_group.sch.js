require('../config/lib')
// require('../config/maria_db')
require('../config/mongo_db')

const attachfile_groupSchema = new Schema({
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
    path_folder:{
        type: String,
        default: "",
        required: true
    },
    summarygroup_id:{
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

const attachfile_groupModel = mongoose.model('attachfile_group', attachfile_groupSchema, 'attachfile_group')

module.exports = attachfile_groupModel