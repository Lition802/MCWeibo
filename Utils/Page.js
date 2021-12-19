const fs = require('fs');

var pagedata = JSON.parse(fs.readFileSync("page.json"));


Date.prototype.Format = function (fmt) { // author: meizz
    var o = {
      "M+": this.getMonth() + 1, // 月份
      "d+": this.getDate(), // 日
      "h+": this.getHours(), // 小时
      "m+": this.getMinutes(), // 分
      "s+": this.getSeconds(), // 秒
      "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
      "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
}

function guid() {
    return 'xxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

exports.addPage=function (title,subtitle,text,author){
    var id = guid();
    if(pagedata[id]==undefined){
        pagedata[id]={
            time: new Date().Format("yyyy-MM-dd hh:mm:ss"),
            author,
            title,
            subtitle,
            text,
            id,
            reply:[]
        };
    }
    fs.writeFileSync('./page.json',JSON.stringify(pagedata,null,"\t"));
}

exports.getAllID = function(){
    var ids = [];
    for(i in pagedata){
        if(pagedata[i].id != 'null')
            ids.push(i);
    }
    return ids;
}

var pure = {
    title:"空位",
    subtitle:"",
    text:"这里是文章空位，您可以发微博来占领这个空位",
    time:"",
    author:"佚名",
    id:"null",
    reply:[]
}

exports.pure = pure;

exports.getEssay = function (id){
    if(id == undefined) return pure;
    if(pagedata[id] == undefined) return pure;
    var p = pagedata[id];
    return p;
}

exports.getToday = function(){
    return new Date().Format('yyyy-MM-dd');
}

exports.addReply = function(id,name,text){
    pagedata[id].reply.push({ time: new Date().Format("yyyy-MM-dd hh:mm:ss"),author:name,text,id:guid()});
    fs.writeFileSync('./page.json',JSON.stringify(pagedata,null,"\t"));
}

exports.delReply = function(essayid,replyid){
    for(var i in pagedata[essayid].reply){
        if(pagedata[essayid].reply[i].id == replyid)
            pagedata[essayid].reply.splice(i,1);
    }
    fs.writeFileSync('./page.json',JSON.stringify(pagedata,null,"\t"));
}

exports.delPage = function(id){
    delete pagedata[id];
    fs.writeFileSync('./page.json',JSON.stringify(pagedata,null,"\t"));
}

exports.getReply = function(i){
    /*
    <h3>Text</h3><br><p>This is <b>bold</b> and this is <strong>strong</strong>. This is <i>italic</i> and this is <em>emphasized</em>.
    */

   var t = '<hr>';
   try{
    pagedata[i].reply.forEach(e => {
        t+=`<h5>${e.author}：${e.text}</h5>`//<p>${e.time}</p>`
        //t+=`<p>${e.author}<i>      ${e.time}</i></p><p>${e.text}</p>`
    });
   }catch{}

   return t;
}