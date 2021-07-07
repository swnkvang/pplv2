require('../config/lib')
require('../configs/mongo_db')

const profile_userSchema = new Schema({
    account_id :String,
    username :String,
    citizen_data :String,
    email_citizen :Array,
    business_default :Object,
    one_token :String,
    sign :String,
    sign_hash :String,
    create_time :{
        type: Date,
        default: Date.now
    },
    update_time :{
        type: Date,
        default: Date.now
    },

});

const profileModel = mongoose.model('profile', profile_userSchema)

module.exports = profileModel