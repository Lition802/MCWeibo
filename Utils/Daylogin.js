const fs = require('fs');
var daylogin = JSON.parse(fs.readFileSync("Data/daylogin.json"));
var sd = require('silly-datetime');
exports.daylog = function(xuid){
    const td = sd.format(new Date(),'YYYY-MM-DD');
    if(daylogin[td] == undefined){
        daylogin[td] = {}
    }
    if(daylogin[td][xuid] == undefined){
        daylogin[td][xuid] = 1;
        save()
        return {isfirst:true};
    }
    daylogin[td][xuid]+=1;
    save();
    return {isfirst:false,time:daylogin[td][xuid]};
}
function save(){
    fs.writeFileSync('Data/daylogin.json',JSON.stringify(daylogin,null,"\t"));
}