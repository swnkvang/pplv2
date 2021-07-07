require('../config/lib')
require('../config/mongo_db')

const ServiceKeySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    privateKey: {
        type: String,
        required: true
    },
    publicKey: {
        type: String,
        required: true
    }

}, {
    minimize: false,
    timestamps: true
});

const ServiceKeyModel = mongoose.model('service_key', ServiceKeySchema, 'service_key')

module.exports = ServiceKeyModel