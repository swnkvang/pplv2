require('../config/lib')
require('../config/mongo_db')

const doc_type_transSchema = new Schema({
    type_name : String,
    keyword : String,
    type : String,
    last_digit : Number
},
{
    timestamps : true
});

const doc_type_transModel = mongoose.model('doc_type_transaction', doc_type_transSchema,'doc_type_transaction')

module.exports = doc_type_transModel