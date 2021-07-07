require('../config/lib')
require('../config/mongo_db')

const permission_Schema = new Schema({
    doc_type : String,
    permission_type : String,
    role_id_list : Array,
    dept_id_list : Array
},
{
    timestamps : true
});

const permission_Model = mongoose.model('permission', permission_Schema,'permission')

module.exports = permission_Model