require('../config/lib')
require('../config/mongo_db')

const profile_userSchema = new Schema({
    account_id: String,
    username: String,
    citizen_data: Object,
    email_citizen: Array,
    email_one:Object,
    business_default: Object,
    one_token: String,
    refresh_token:String,
    sign: String,
    createAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    },

});

const profileModel = mongoose.model('profile', profile_userSchema, 'profile_user')

module.exports = profileModel