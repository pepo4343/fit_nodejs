export default {
    db:{
        hostname:"mongo",
        dbname:"fit"
    },
    mqtt:{
        ip:"203.146.251.194",
        defaultUri:"fit/",
        watersystem:{
            workingtimeTopic:"watersystem/workingtime",
            scheduleTopic:"watersystem/schedule",
            statusTopic:"watersystem/status",
        }
    }
}