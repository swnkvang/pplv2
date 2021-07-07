require('../config/lib')
require('../config/global')
const Select_db = require('../database/db_select');
const {
    connonsql
} = require('../config/mongo_db')
const SummaryGroupSchema = require('../schema/summaryGroup.sch')
const transaction_Schema = require('../schema/transaction_document')
const flowSchema = require('../schema/flow.sch')
const flowFunc = require('../function/flow.func')
const Flow = require('../method/process_flow');
const logService = require('../database/transaction.service_')

const GetCountSummaryGroup = async (json_data) => {
    try {
        var one_result_data = json_data.one_result_data
        var account_id = one_result_data.id
        var connectiondb = json_data.db_connect
        if (connectiondb != null) {
            await connonsql(connectiondb)
        }
        var GetCountAll = await Promise.all([
            SummaryGroupSchema.count({
                $and: [{
                    "actor.id": account_id
                }]
            }).exec(),
            transaction_Schema.count({
                $or: [{
                    flow: {
                        $elemMatch: {
                            "actor.account_id": account_id
                        }
                    }
                }, {
                    $or: [{
                        flow: {
                            $elemMatch: {
                                action_detail: {
                                    $elemMatch: {
                                        account_id: account_id
                                    }
                                }
                            }
                        }
                    }]
                }]
            }).exec(),
            transaction_Schema.count({
                $and: [{
                    flow: {
                        $elemMatch: {
                            status: "W"
                        }
                    }
                }, {
                    $or: [{
                            "flow": {
                                "$elemMatch": {
                                    "$and": [ 
                                        {
                                            "action_detail" :{"$elemMatch": {"$or":[
                                                {
                                                    "account_id": account_id,
                                                    "status": "Incomplete",
                                                    "status_actiondetail": "W",
                                                    "$or": [
                                                        {
                                                            "status_endtask" : false
                                                        },
                                                        {
                                                            "status_endtask" : undefined
                                                        }
                                                    ]
                                                },
                                                {
                                                    "account_id": account_id,
                                                    "status": "Draft",
                                                    "status_actiondetail": "W",
                                                    "$or": [
                                                        {
                                                            "status_endtask" : false
                                                        },
                                                        {
                                                            "status_endtask" : undefined
                                                        }
                                                    ]
                                                }
                                            ]
                                    }
                                            }
                                        },
                                        {
                                            "status": "W"
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            "flow": {
                                "$elemMatch": {
                                    "$and": [
                                        {
                                            "actor" : {"$elemMatch": {"$or":[
                                                                                  {
                                                                                        "account_id": account_id,
                                                                                        "status": "Incomplete"
                                                                                  },
                                                                                  {
                                                                                        "account_id": account_id,
                                                                                        "status": "Draft"
                                                                                  }
                                                                            ]
                                                                       }    
                                                                }
                                        },
                                        {
                                            "status": "W"
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                },
                {
                    status : "ACTIVE"
                },{
                    "status_document": {$ne:"R"}
                }]

            }).exec(),
            transaction_Schema.count({
                $or: [{
                    $and: [{
                        flow: {
                            $elemMatch: {
                                "action_detail.account_id": account_id
                            }
                        }
                    }]
                }, {
                    $and: [{
                        flow: {
                            $elemMatch: {
                                "actor.account_id": account_id
                            }
                        }
                    }]
                }],
                $and: [{
                    status_document: "N"
                },
                {
                    status : "ACTIVE"
                }]
            }).exec(),
            transaction_Schema.count({
                $or: [{
                    $and: [{
                        flow: {
                            $elemMatch: {
                                "action_detail.account_id": account_id
                            }
                        }
                    }]
                }, {
                    $and: [{
                        flow: {
                            $elemMatch: {
                                "actor.account_id": account_id
                            }
                        }
                    }]
                }],
                $and: [{
                    status_document: "Y"
                },
                {
                    status : "ACTIVE"
                }]
            }).exec(),
            transaction_Schema.count({
                $or: [{
                    $and: [{
                        flow: {
                            $elemMatch: {
                                "action_detail.account_id": account_id
                            }
                        }
                    }]
                }, {
                    $and: [{
                        flow: {
                            $elemMatch: {
                                "actor.account_id": account_id
                            }
                        }
                    }]
                }],
                $and: [{
                    status_document: "R"
                },
                {
                    status : "ACTIVE"
                }]
            }).exec(),
            SummaryGroupSchema.count({
                $and: [{
                    "actor.id": account_id
                }, {
                    "status": "W"
                }]
            }).exec(),
            SummaryGroupSchema.count({
                $and: [{
                    "actor.id": account_id
                }, {
                    "status": "Y"
                }]
            }).exec(),
            transaction_Schema.count({
                $or: [{
                    flow: {
                        $elemMatch: {
                            "actor.account_id": account_id
                        }
                    }
                }, {
                    $or: [{
                        flow: {
                            $elemMatch: {
                                action_detail: {
                                    $elemMatch: {
                                        account_id: account_id
                                    }
                                }
                            }
                        }
                    }]
                }],
                $and: [{
                    status: 'CANCEL'
                }]
            }).exec()
        ]).then(function (counts) {
            // console.log(counts)
            return [true, counts]
        });
        return [true, GetCountAll[1]]
    } catch (error) {
        console.log(error)
        return [false, String(error)]
    }
};


module.exports = {
    GetCountSummaryGroup
}