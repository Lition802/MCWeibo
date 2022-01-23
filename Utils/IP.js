const fs = require('fs');
var ipdata = JSON.parse(fs.readFileSync("Data/ip.json"));
var Useripdata = JSON.parse(fs.readFileSync("Data/Userip.json"));
var sd = require('silly-datetime');

exports.check=(ip)=>{
    ip = ip.replace('::ffff:','');
    if(ip=='127.0.0.1')return;
    var dtime = sd.format(new Date(),'YYYY-MM-DD');
    if(ipdata[dtime]==undefined) ipdata[dtime]= {};
    if(ipdata[dtime][ip]==undefined) ipdata[dtime][ip]=0;
    ipdata[dtime][ip]+=1;
    save();
};

exports.today = ()=>{
    var dtime = sd.format(new Date(),'YYYY-MM-DD');
    return ipdata[dtime];
}

exports.bind = (xuid,ip) =>{
    ip = ip.replace('::ffff:','');
    if(ip=='127.0.0.1')return;
    if(Useripdata[xuid] == undefined) Useripdata[xuid] = [];
    if(Useripdata[xuid].indexOf(ip)==-1)Useripdata[xuid].push(ip);
    save()
}

function save(){
    fs.writeFileSync('Data/ip.json',JSON.stringify(ipdata,null,"\t"));
    fs.writeFileSync('Data/Userip.json',JSON.stringify(Useripdata,null,"\t"));
}