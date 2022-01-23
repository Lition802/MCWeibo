
const fs = require('fs');
var sd = require('silly-datetime');

var getTime = function(){
    return sd.format(new Date(),"YYYY-MM-DD-HH")
}

var publishdata = JSON.parse(fs.readFileSync("Data/publish.json",'utf-8'));

exports.publish =function(xuid){
    if(publishdata[getTime()]==undefined)
    publishdata[getTime()] = []
    if(publishdata[getTime()].indexOf(xuid)==-1){
        publishdata[getTime()].push(xuid);
        save()
        return true;
    }else{
        return false;
    }
}


function save(){
    fs.writeFileSync('./Data/publish.json',JSON.stringify(publishdata,null,"\t"));
}