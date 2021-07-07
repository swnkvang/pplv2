require('../config/lib')
require('../config/mongo_db')

const socket_Schema = new Schema({
    token: {
        type: String,
        required: true
    },
    tax_id: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Online"
    },
    account_id: {
        type: String,
        required: true
    },
    room_id: {
        type: String,
        required: true,
        index: true
    }
}, {
    minimize: false,
    timestamps: true
});

const socketModel = mongoose.model('socketio', socket_Schema, 'socketio')

module.exports = socketModel