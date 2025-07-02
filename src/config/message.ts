//const ReportModel = require("../api/resources/notification/report.model");

import { UUID } from "crypto"

exports.createMessage = async (title: string, message: string, user: UUID) => {
    try {
        // let report = new ReportModel();

        // if (!title) return false;
        // if (!message) return false;
        // if (!user) return false;

        // report.title = title;
        // report.message = message;
        // report.user = user;

        // report.save((err, docs)=>{
        //     if (!err){
        //         return true;
        //     }
        //     else{
        //         return false;
        //     }
        // });
    } catch (err) {
        return false
    }
}