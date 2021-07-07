require('../config/lib')
require('../config/global')
const {
    connonsql
} = require('../config/mongo_db')
const middlewareSocket = require('../method/middleware.socket')
const socketioSch = require('../schema/socket.sch')


const CreateRoomSocketio = async (room_id, token, tax_id) => {
    try {
        var room = room_id
        var data_json = await middlewareSocket.EncToken(token, tax_id)
        if (data_json[0]) {
            var DataCitizen = data_json[1]
            var one_result_data = DataCitizen.one_result_data
            var user_id = one_result_data.id
            var connectiondb = DataCitizen.db_connect
            await connonsql(connectiondb)
            var dataAdd = {
                token: token,
                tax_id: tax_id,
                account_id: user_id,
                room_id: room
            }
            const socket = new socketioSch(dataAdd);
            await socket.save();
        }
        return [true, room]
    } catch (error) {
        console.log(error)
        return [false, error.message]
    }
};

const FindRoomSocketio = async (room_id) => {
    try {
        var GetDataRoom = await socketioSch.findOne({
            room_id: room_id
        });
        return [true, GetDataRoom]
    } catch (error) {
        console.log(error)
        return [false, error.message]
    }
};

module.exports = {
    CreateRoomSocketio,
    FindRoomSocketio
}