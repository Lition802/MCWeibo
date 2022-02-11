
const fs = require('fs');
var sd = require('silly-datetime');

var pagedata = JSON.parse(fs.readFileSync("Data/page.json",'utf-8'));

var IDSwithTIME = JSON.parse(fs.readFileSync("Dataids_time.json"));

function guid() {
    return 'xxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

exports.getToday = function(){
    return sd.format(new Date(),'yyyy-MM-dd');
}

function save(){
    fs.writeFileSync('./Data/Page.json',JSON.stringify(pagedata,null,"\t"));
    fs.writeFileSync('./Dataids_time.json',JSON.stringify(IDSwithTIME,null,"\t"));
}

function remove(arr,dt){
    arr.splice(arr.indexOf(dt),1);
}

function generateHTML(id){
    var tmp = pagedata[id];
    if(tmp==undefined){
        return "";
    }
    if(tmp.id=="null"){
        return "";
    }
    var name = WEIBO.USERS.XUID2NAME(tmp.xuid);
    var avatar = "steve";
    try{
        fs.statSync("./views/images/users/"+name+".jpg");
        avatar = name;
    }catch{

    }
    var t = "";
    if(tmp.text.length > 200){
        t = tmp.text.substring(0,200) + '...';
    }else{
        t = tmp.text;
    }
    return `<article class="post">
    <header>
        <div class="title">
            <h2><a href="/single?id=${id}">${tmp.title.replaceAll('§g','💰').replace(/\xA7[0-9A-FK-OR]/ig, '')}</a></h2>
            <p>${tmp.sub_title.replaceAll('§g','💰').replace(/\xA7[0-9A-FK-OR]/ig, '')}</p>
        </div>
        <div class="meta">
            <time class="published" datetime="${tmp.datetime}">${tmp.datetime}</time>
            <a href="#" class="author"><span class="name">${name}</span><img src="images/users/${avatar}.jpg" alt="" /></a>
        </div>
    </header>
    <p>${t.replaceAll('§g','💰').replace(/\xA7[0-9A-FK-OR]/ig, '')}</p>
    <footer>
        <ul class="actions">
            <li><a href="/single?id=${id}" class="button large">查看更多</a></li>
        </ul>
        <ul class="stats">
            <li><a href="#" class="icon solid fa-comment">${tmp.reply.length}</a></li>
        </ul>
    </footer>
</article>`
}

function getPage(page){
    var ii = Math.ceil(IDSwithTIME.length /3);
    console.log(ii);
    if(page > ii){
        return ['null','null','null']
    }
    return [IDSwithTIME[page*3-3],IDSwithTIME[page*3-2],IDSwithTIME[page*3-1]];
}

function getEssayCount(xuid){
    var ii = 0;
    for(var i in pagedata){
        if(pagedata[i].xuid==xuid)
        ii++
    }
    return ii;
}

function getLatest(type){
    for(var i in IDSwithTIME){
        try{
            if(pagedata[IDSwithTIME[i]].type==type){
                return pagedata[IDSwithTIME[i]];
            }
        }catch{}
    }
    return pagedata['null'];
}

function getLastestTime(type){
    var le = getLatest(type);
    if(le ==undefined){
        return '无'
    }else{
        if(le.reply.length > 0){
            return le.reply[le.reply.length-1].datetime;
        }else{
            return le.datetime;
        }
    }
}

function addEssay(title,sub_title,text,type,xuid){
    var tmpid = guid();
    pagedata[tmpid] = {
        datetime : sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        title,
        sub_title,
        text,
        xuid,
        reply : [],
        look : 1,
        id:tmpid,
        type
    }
    IDSwithTIME.reverse();
    IDSwithTIME.push(tmpid);
    IDSwithTIME.reverse();
    save();
    return tmpid;
}

function getEssay(id){
    return (pagedata[id]==undefined)?pagedata["null"]:pagedata[id];
}

function addReply(id,xuid,text){
    if(pagedata[id]==undefined)return false;
    var ids = guid()
    pagedata[id].reply.push({
        xuid,
        text,
        id:ids,
        datetime : sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
    });
    flushID(id);
    return true;
}

function flushID(id){
    remove(IDSwithTIME,id);
    IDSwithTIME.reverse();
    IDSwithTIME.push(id);
    IDSwithTIME.reverse();
    save();
}

function getAll(){
    return Object.keys(pagedata);
}

function getAll_by_Type(type){
    var li = [];
    IDSwithTIME.forEach(element => {
        if(getEssay(element).type == type)li.push(element);
    });
    return li;
}

function delEssay(id){
    remove(IDSwithTIME,id);
    delete pagedata[id];
    save();
}

function delReply(ess_id,rep_id){
    var rt = false;
    getEssay(ess_id).reply.forEach(s=>{
        if(s.id==rep_id){
            remove(getEssay(ess_id).reply,s);
            save();
            rt = true;
        }
    })
    return rt;
}

function getEssayByUser(xuid){
    var rt = [];
    for(var i in pagedata){
        if(pagedata[i].xuid == xuid)
        rt.push(i)
    }
    return rt;
}

module.exports = {
    getEssay,
    getEssayByUser,
    generateHTML,
    getPage,
    addEssay,
    addReply,
    getLatest,
    getLastestTime,
    getAll,
    getAll_by_Type,
    guid,
    delEssay,
    delReply,
    getEssayCount
}