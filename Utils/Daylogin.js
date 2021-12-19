const phelper = require('./Page');
const fs = require('fs');
var daylogin = JSON.parse(fs.readFileSync("daylogin.json"));
exports.daylog = function(xuid){
    const td = phelper.getToday();
    if(daylogin[td] == undefined){
        daylogin[td] = {}
    }
    if(daylogin[td][xuid] == undefined){
        daylogin[td][xuid] = 1;
        save()
        return {isfirst:true};
    }
    daylogin[td][xuid]+=1;
    return {isfirst:false,time:daylogin[td][xuid]};
}
function save(){
    fs.writeFileSync('./daylogin.json',JSON.stringify(daylogin,null,"\t"));
}