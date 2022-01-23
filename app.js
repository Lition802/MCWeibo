const path = require('path');
const express = require('express');
const url = require('url');
const fs = require('fs');
var bodyParser = require('body-parser');/*post方法*/
var cookieParser = require("cookie-parser");
let app = express();
app.use(bodyParser.json());// 添加json解析
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').__express);
//注意express.static这个中间件是express内置的
app.use(express.static(path.join(__dirname, '/views')));
var sd = require('silly-datetime');
const expressWs = require('express-ws');
const daylogin = require('./Utils/daylogin');
const publishHelper = require("./Utils/publish");
expressWs(app);
const md5 = require("./Utils/MD5")
const IPHelper = require('./Utils/IP');
var cookieHelper = require("./Utils/cookie")
var HTTPPOST = require("./Utils/HTTPPOST");

//a

console.logFile = (str)=>{
    console.debug(str);
    try {
        fs.appendFileSync(`./logs/${sd.format(new Date(),'YYYY-MM-DD')}.txt`, str.toString()+'\n');
      } catch (err) {
        // Handle the error
        console.error(err);
      }
      
}

var ONLINES = new Map();
const public_key = '123bib6';
var private_key = new Map();

global.WEIBO = {};

WEIBO.USERS = require('./Utils/Users');
WEIBO.PAGE = require('./Utils/Page');

app.get('/', (req, res) => {
    IPHelper.check(req.ip.toString());
    console.log(req.ip,req.url);
    var ul = url.parse(req.url, true);
    if (ul.query.page == undefined) {
        res.redirect("./?page=1");
        return;
    }
    var page = isNaN(Number(ul.query.page)) ? 1 : Number(ul.query.page);
    if (page <= 0) {
        res.redirect("./?page=1");
        return;
    }
    if (page > Math.ceil(WEIBO.PAGE.getAll().length / 3)) {
        res.redirect("./?page=1");
        return;
    }
    var pd = WEIBO.PAGE.getPage(page);
    console.log(pd);
    var info = getLatestInfo()
    res.render('main.html',
        {
            post_1: WEIBO.PAGE.generateHTML(pd[0]),
            post_2: WEIBO.PAGE.generateHTML(pd[1]),
            post_3: WEIBO.PAGE.generateHTML(pd[2]),
            title_text: 'MCWeiBo | 主页 | ' + page,
            water_latest_time: info.water_latest_time,
            water_latest_name: info.water_latest_name,
            news_latest_time: info.news_latest_time,
            news_latest_name: info.news_latest_name,
            pervious_page: page - 1,
            next_page:  (page == Math.ceil(WEIBO.PAGE.getAll().length / 3)) ? page :page + 1,
            notice_latest_time: info.notice_latest_time,
            notice_latest_name: info.notice_latest_name
        });
});

app.get('/water', (req, res) => {
    IPHelper.check(req.ip.toString());
    console.log(req.ip,req.url);
    var ul = url.parse(req.url, true);
    if (ul.query.page == undefined) {
        res.redirect("./water?page=1");
        return;
    }
    var page = isNaN(Number(ul.query.page)) ? 1 : Number(ul.query.page);
    if (page <= 0) {
        res.redirect("./water?page=1");
        return;
    }
    var sd = WEIBO.PAGE.getAll_by_Type(0);
    var info = getLatestInfo()
    res.render("water_main.html", {
        post_1: WEIBO.PAGE.generateHTML(sd[page * 3 - 3]),
        post_2: WEIBO.PAGE.generateHTML(sd[page * 3 - 2]),
        post_3: WEIBO.PAGE.generateHTML(sd[page * 3 - 1]),
        title_text: 'MCWeiBo | 灌水闲聊 | ' + page,
        water_latest_time: info.water_latest_time,
        water_latest_name: info.water_latest_name,
        news_latest_time: info.news_latest_time,
        news_latest_name: info.news_latest_name,
        pervious_page: page - 1,
        next_page: (page == Math.ceil(WEIBO.PAGE.getAll_by_Type(0).length / 3)) ? page : page + 1,
        notice_latest_time: info.notice_latest_time,
        notice_latest_name: info.notice_latest_name
    });
});

app.get('/news', (req, res) => {
    IPHelper.check(req.ip.toString());
    console.log(req.ip,req.url);
    var ul = url.parse(req.url, true);
    if (ul.query.page == undefined) {
        res.redirect("./news?page=1");
        return;
    }
    var page = isNaN(Number(ul.query.page)) ? 1 : Number(ul.query.page);
    if (page <= 0) {
        res.redirect("./news?page=1");
        return;
    }
    var sd = WEIBO.PAGE.getAll_by_Type(1);
    var info = getLatestInfo()
    res.render("news_main.html", {
        post_1: WEIBO.PAGE.generateHTML(sd[page * 3 - 3]),
        post_2: WEIBO.PAGE.generateHTML(sd[page * 3 - 2]),
        post_3: WEIBO.PAGE.generateHTML(sd[page * 3 - 1]),
        title_text: 'MCWeiBo | 新闻资讯 | ' + page,
        water_latest_time: info.water_latest_time,
        water_latest_name: info.water_latest_name,
        news_latest_time: info.news_latest_time,
        news_latest_name: info.news_latest_name,
        pervious_page: page - 1,
        next_page: (page == Math.ceil(WEIBO.PAGE.getAll_by_Type(1).length / 3)) ? page : page + 1,
        notice_latest_time: info.notice_latest_time,
        notice_latest_name: info.notice_latest_name
    });
});


function getUserImage(xuid){
    var avatar = 'steve';
    try{
        
        fs.statSync("./views/images/users/"+WEIBO.USERS.XUID2NAME(xuid)+".jpg");
        avatar = WEIBO.USERS.XUID2NAME(xuid);
    }catch{
    }
    return avatar;
}


function getLatestInfo() {
    return {
        notice_latest_time: WEIBO.PAGE.getLastestTime(2),
        notice_latest_name: getUserImage(WEIBO.PAGE.getLatest(2).xuid),
        water_latest_time: WEIBO.PAGE.getLastestTime(0),
        water_latest_name: getUserImage(WEIBO.PAGE.getLatest(0).xuid),
        news_latest_time: WEIBO.PAGE.getLastestTime(1),
        news_latest_name: getUserImage(WEIBO.PAGE.getLatest(1).xuid)
    }
}

app.get('/notice', (req, res) => {
    IPHelper.check(req.ip.toString());
    console.log(req.ip,req.url);
    var ul = url.parse(req.url, true);
    if (ul.query.page == undefined) {
        res.redirect("./notice?page=1");
        return;
    }
    var page = isNaN(Number(ul.query.page)) ? 1 : Number(ul.query.page);
    if (page <= 0) {
        res.redirect("./notice?page=1");
        return;
    }
    var sd = WEIBO.PAGE.getAll_by_Type(2);
    var info = getLatestInfo()
    res.render("notice_main.html", {
        post_1: WEIBO.PAGE.generateHTML(sd[page * 3 - 3]),
        post_2: WEIBO.PAGE.generateHTML(sd[page * 3 - 2]),
        post_3: WEIBO.PAGE.generateHTML(sd[page * 3 - 1]),
        title_text: 'MCWeiBo | 微博公告 | ' + page,
        water_latest_time: info.water_latest_time,
        water_latest_name: info.water_latest_name,
        news_latest_time: info.news_latest_time,
        news_latest_name: info.news_latest_name,
        pervious_page: page - 1,
        next_page: (page == Math.ceil(WEIBO.PAGE.getAll_by_Type(2).length / 3)) ? page : page + 1,
        notice_latest_time: info.notice_latest_time,
        notice_latest_name: info.notice_latest_name
    });
});

app.get('/single', (req, res) => {
    IPHelper.check(req.ip.toString());
    console.log(req.ip,req.url);
    var ul = url.parse(req.url, true);
    var tmp = WEIBO.PAGE.getEssay(ul.query.id);
    var t = '';
    var avatar = "steve";
    try{
        fs.statSync("./views/images/users/"+WEIBO.USERS.XUID2NAME(tmp.xuid)+".jpg");
        avatar = WEIBO.USERS.XUID2NAME(tmp.xuid);
    }catch{

    }
    tmp.reply.forEach(e => {
        try {

            t += `<li>${WEIBO.USERS.XUID2NAME(e.xuid)}：${e.text.replace(/\xA7[0-9A-FK-OR]/ig, '')}</li>`//<p>${e.time}</p>`
            //t+=`<p>${e.author}<i>      ${e.time}</i></p><p>${e.text}</p>`

        } catch { }
    });
    res.render('single.html', {
        title: tmp.title.replaceAll('§g','💰').replace(/\xA7[0-9A-FK-OR]/ig, ''),
        sub_title: tmp.sub_title.replaceAll('§g','💰').replace(/\xA7[0-9A-FK-OR]/ig, ''),
        datetime: tmp.datetime,
        author: WEIBO.USERS.XUID2NAME(tmp.xuid),
        text: tmp.text.replaceAll('§g','💰').replace(/\xA7[0-9A-FK-OR]/ig, ''),
        reply_count: tmp.reply.length,
        reply: t,
        avatar,
        id:tmp.id
    });
});

app.get('/about', (req, res) => {
    IPHelper.check(req.ip.toString());
    var gs = WEIBO.PAGE.getAll_by_Type(0).length;
    var zxun = WEIBO.PAGE.getAll_by_Type(1).length;
    var gg = WEIBO.PAGE.getAll_by_Type(2).length;
    var users = `<h2>发帖统计</h2><div class="table-wrapper">
    <table class="alt">
        <thead>
            <tr>
                <th>板块</th>
                <th>描述</th>
                <th>发帖</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>灌水闲聊</td>
                <td>玩家分享新鲜事</td>
                <td>${gs}</td>
            </tr>
            <tr>
                <td>新闻资讯</td>
                <td>获取有关minecarft的最新资讯</td>
                <td>${zxun}</td>
            </tr>
            <tr>
                <td>微博公告</td>
                <td>微博事项公告处</td>
                <td>${gg}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="2"></td>
                <td>${gs + zxun + gg}</td>
            </tr>
        </tfoot>
    </table>
</div>
<h2>用户统计</h2><div class="table-wrapper">
    <table class="alt">
        <thead>
            <tr>
                <th>用户类型</th>
                <th>描述</th>
                <th>数量</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>在线用户</td>
                <td>正在线上的玩家</td>
                <td>${ONLINES.size}</td>
            </tr>
            <tr>
                <td>总注册用户</td>
                <td>注册过账号的用户</td>
                <td>${WEIBO.USERS.getCount()}</td>
            </tr>
    </table>
</div>`;
    res.render('single.html', {
        title: '论坛统计',
        sub_title: '论坛统计数据',
        datetime: sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        author: 'MCWeiBo',
        text: users,
        reply_count: 0,
        reply: '',
        avatar : 'MCWeiBo',
        id:""
    });
});

app.get('/login', (req, res) => {
    IPHelper.check(req.ip.toString());
    if(cookieHelper.cookieExist(req.cookies.user_id)){
        res.redirect("/me");
        return;
    }
    res.render('login.html', {});
});

app.post('/login', (req, res) => {
    IPHelper.check(req.ip.toString());
    console.log(req.body);
    var body = req.body;
    if(body.asAdmin != "on"){
        var xuid = WEIBO.USERS.getXUID(body.xuid);
        if(WEIBO.USERS.pwd_right(xuid,md5.MD5( body.password))){
            if(cookieHelper.getCookie(xuid)==undefined){
                var id = WEIBO.PAGE.guid()
                cookieHelper.setCookie(xuid,id,false)
                res.cookie("user_id",id,{maxAge:24*60*60*1000});
            }
           if(req.cookies.user_id == undefined)res.cookie("user_id",cookieHelper.getCookie(xuid),{maxAge:24*60*60*1000});
            res.redirect("/me");
            return;
        }else{
            res.render("message.html",{message:"账号或密码错误",back_url:"/login"})
            return;
        }
    }
    if(WEIBO.USERS.exsits(body.xuid)){
        if(WEIBO.USERS.key_exist(body.password)){
            res.redirect(`/admin?public_key=${public_key}&admin_key=${body.password}`);
        }else{
            res.render('message.html',{message:'密码不正确！',back_url:'/login'});
        }
    }else{
        res.render('message.html',{message:'用户不存在！',back_url:'/login'});
    }
});

app.get("/api/info", (req, res) => {
    res.json(getLatestInfo());
})

app.get('/api/page', (req, res) => {
    IPHelper.check(req.ip.toString());
    console.log(req.ip,req.url);
    var ul = url.parse(req.url, true);
    if (ul.query.key != public_key) {
        res.json({ code: 401 });
        return;
    }
    var page = isNaN(Number(ul.query.page)) ? 1 : Number(ul.query.page);
    var type = isNaN(Number(ul.query.type)) ? 0 : Number(ul.query.type);
    var sd = WEIBO.PAGE.getAll_by_Type(type);
    var data = [sd[(page * 3) - 3], sd[(page * 3) - 2], sd[(page * 3) - 1]];
    var essays = [];
    for (var i in data) {
        var main = WEIBO.PAGE.getEssay(data[i]);
        if (main.id != "null") {
            var dt = {};
            dt.title = main.title;
            dt.sub_title = main.sub_title;
            dt.author = WEIBO.USERS.XUID2NAME(main.xuid);
            dt.reply = main.reply.length;
            dt.id = data[i];
            essays.push(dt);
        } else {
            essays.push(null);
        }
    }
    res.json({ code: 200, essays });
});

app.get('/api/single', (req, res) => {
    IPHelper.check(req.ip.toString());
    console.log(req.ip,req.url);
    var ul = url.parse(req.url, true);
    if (ul.query.key != public_key) {
        res.json({ code: 401 });
        return;
    }
    var id = ul.query.id == undefined ? 'null' : ul.query.id;
    var main = WEIBO.PAGE.getEssay(id);
    var ply = [];
    main.reply.forEach(s=>{
        ply.push({text:s.text,author:WEIBO.USERS.XUID2NAME(s.xuid),datetime:s.datetime});
    });
    res.json({
        code: 200, single: {
            title: main.title.replaceAll('§g','💰').replace(/\xA7[0-9A-FK-OR]/ig, ''),
            sub_title: main.sub_title.replaceAll('§g','💰').replace(/\xA7[0-9A-FK-OR]/ig, ''),
            author: WEIBO.USERS.XUID2NAME(main.xuid),
            datetime: main.datetime,
            text: main.text.replaceAll('§g','💰').replace(/\xA7[0-9A-FK-OR]/ig, ''),
            reply: ply
        }
    });
});

app.ws('/online', (ws, req) => {
    ws.on('message', (msg) => {
        console.log(msg);
    });
    ws.on('close', (e) => {
        ONLINES.delete(ul.query.xuid);
        private_key.delete(ul.query.xuid);
        console.log(ul.query.xuid + '断开连接，私匙已注销');
    });
    console.log(req.ip,req.url);
    var ul = url.parse(req.url, true);
    if (WEIBO.USERS.exsits(req.query.xuid) == false) {
        ws.send(JSON.stringify({code:404,msg:"用户无效"}));
        console.log(ul.query.xuid + '不是用户');
        ws.close();
        return;
    }
    if (private_key.has(ul.query.xuid) == false) {
        console.log(ul.query.xuid + '未获取私匙');
        ws.send(JSON.stringify({code:415,msg:"令牌无效"}));
        ws.close();
        return;
    }
    if (private_key.get(ul.query.xuid).key != ul.query.key) {
        console.log(private_key.get(ul.query.xuid))
        ws.send(JSON.stringify({code:415,msg:"令牌错误"}));
        console.log(ul.query.xuid+'密匙不正确');
        ws.close();
        return;
    }
    if (ONLINES.has(ul.query.xuid)) {
        ws.send(JSON.stringify({code:416,msg:"不可重复激活"}));
        console.log(ul.query.xuid+'重复激活');
        ws.close();
        return;
    }
    ws.send(JSON.stringify({code:200,type:"connect_success",msg:"私匙激活成功"}))
    private_key.set(ul.query.xuid, { can_use: true, key: ul.query.key });
    console.log(`${ul.query.xuid}私匙已激活`);
    ONLINES.set(ul.query.xuid, ws);
    
});

function NewEssay(id,title){
    HTTPPOST.postdata({target:859179182,text:"新微博提示:"+title});
    var j =JSON.stringify( {
        code:200,
        type : "new_essay",
        id,
        title,
        datetime: sd.format(new Date(),"YYYY-MM-DD-HH-mm-ss")
    });
    ONLINES.forEach((v,k)=>{
        v.send(j);
    });
}

app.post('/api/login', (req, res) => {
    IPHelper.check(req.ip.toString());
    console.log(req.ip,req.url);
    var body = req.body;
    if (body.public_key != public_key) {
        res.json({ code: 401 ,msg:'身份需要验证'});
        return;
    }
    if (WEIBO.USERS.pwd_right(body.xuid, body.pwd)) {
        var pk = WEIBO.PAGE.guid();
        private_key.set(body.xuid, { can_use: false, key: pk });
        var dg = daylogin.daylog(body.xuid);
        if (dg.isfirst) {
            WEIBO.USERS.addxp(body.xuid, 5);
        }
        res.json({ code: 200, private_key: pk, xp: WEIBO.USERS.getxp(body.xuid), loginT: dg.time == undefined ? 1 : dg.time });
        IPHelper.bind(body.xuid,req.ip);
        console.log(`${body.xuid}登入，私匙:${pk}`);
    } else {
        res.json({ code: 504,msg:"密码不正确" });
    }
});

app.post('/api/reg', (req, res) => {
    IPHelper.check(req.ip.toString());
    var body = req.body;
    console.log(req.ip,req.url);
    if (body.public_key != public_key) {
        res.json({ code: 401 ,msg:'身份需要验证'});
        return;
    }
    var ret = {};
    if (WEIBO.USERS.exsits(req.body.xuid)) {
        ret.code = 507;
        ret.msg = '用户已注册'
    } else {
        WEIBO.USERS.add(req.body.xuid, req.body.name, req.body.pwd);
        ret.code = 200;
    }
    res.json(ret);
});

app.post('/api/publish', (req, res) => {
    IPHelper.check(req.ip.toString());
    var body = req.body;
    var ul = url.parse(req.url,true);
    console.log(body);
    if(WEIBO.USERS.key_exist(ul.query.admin_key)){
        if(body.type=="0"){
            res.render("message.html",{message:"请选择分区",back_url:"/admin?public_key="+public_key+"&admin_key="+ul.query.admin_key});
            return;
        }
        var id =WEIBO.PAGE.addEssay(body.title,body.sub_title,body.text,isNaN(Number(body.type))?0:Number(body.type)-1,WEIBO.USERS.getXUID(WEIBO.USERS.admin_key2name(ul.query.admin_key)))
        NewEssay(id,body.title);
        res.redirect("/single?id="+id);
        return;
    }
    if (body.public_key != public_key) {
        res.json({ code: 401 ,msg:'身份需要验证'});
        return;
    }
    if (private_key.has(body.xuid) == false) {
        res.json({ code: 415,msg:'无效令牌' });
        return;
    }
    if (private_key.get(body.xuid).can_use == false) {
        res.json({ code: 410,msg:'令牌需要激活' });
        return;
    }
    if (private_key.get(body.xuid).key != body.private_key) {
        res.json({ code: 433,msg:'令牌错误' });
        return;
    }
    if(publishHelper.publish(body.xuid)==false){
        res.json({ code: 436,msg:'发帖频繁' });
        return;
    }
    var tmpid = WEIBO.PAGE.addEssay(body.title, body.sub_title, body.text.replaceAll('\\n', '<br>'), body.type, body.xuid);
    NewEssay(tmpid,body.title);
    res.json({ code: 200,id:tmpid });
});


app.post('/api/reply', (req, res) => {
    IPHelper.check(req.ip.toString());
    var body = req.body;
    console.log(body);
    if (private_key.has(body.xuid) == false) {
        res.json({ code: 415,msg:'无效令牌' });
        return;
    }
    if (private_key.get(body.xuid).can_use == false) {
        res.json({ code: 410,msg:'令牌需要激活' });
        return;
    }
    if (body.public_key != public_key) {
        res.json({ code: 401 ,msg:'身份需要验证'});
        return;
    }
    if (private_key.get(body.xuid).key != body.private_key) {
        console.log(private_key.get(body.xuid));
        res.json({ code: 433,msg:'令牌错误' });
        return;
    }
    if(body.text==''){
        console.log(private_key.get(body.xuid));
        res.json({ code: 467,msg:'无效回复' });
        return;
    }
    var tmp = WEIBO.PAGE.getEssay(body.essay_id);
    if(ONLINES.has(tmp.xuid)){
        ONLINES.get(tmp.xuid).send(JSON.stringify({code:200,type:"new_reply",id:body.essay_id,title:tmp.title}));
    }
    HTTPPOST.postdata({target:859179182,text:`${WEIBO.USERS.XUID2NAME(body.xuid)}回复了帖子《${WEIBO.PAGE.getEssay(body.essay_id).title}》：${body.text}`});
    WEIBO.PAGE.addReply(body.essay_id, body.xuid, body.text);
    res.json({ code: 200 });
});

app.get('/docs',(req,res)=>{
    res.render('docs.html',{});
});

app.get("/api/del/single",(req,res)=>{
    IPHelper.check(req.ip.toString());
    console.log(req.url)
    var ul = url.parse(req.url, true);
    if (ul.query.public_key != public_key) {
        res.json({ code: 401 ,msg:'身份需要验证'});
        return;
    }
    if(WEIBO.USERS.key_exist(ul.query.admin_key) == false){
        res.json({code:369,msg:"admin_key无效"})
    }
    var tmp = WEIBO.PAGE.getEssay(ul.query.id);
    HTTPPOST.postdata({target:859179182,text:`管理员${WEIBO.USERS.admin_key2name(ul.query.admin_key)}删除了帖子：${tmp.title}(${tmp.id})`})
    var success = WEIBO.PAGE.delEssay(ul.query.id);
    if(ul.query.type=="html"){
        res.render("message.html",{message:"删除成功",back_url:`/admin?public_key=${ul.query.public_key}&admin_key=${ul.query.admin_key}`})
    }else{
        res.json({code:200,success});
    }

});

app.get("/api/del/reply",(req,res)=>{
    IPHelper.check(req.ip.toString());
    console.log(req.url)
    var ul = url.parse(req.url, true);
    if (ul.query.public_key != public_key) {
        res.json({ code: 401 ,msg:'身份需要验证'});
        return;
    }
    if(WEIBO.USERS.key_exist(ul.query.admin_key) == false){
        res.json({code:369,msg:"admin_key无效"})
    }
    var success = WEIBO.PAGE.delReply(ul.query.essay_id,ul.query.reply_id);
    res.json({code:200,success});
});

app.get('/admin',(req,res)=>{
    IPHelper.check(req.ip.toString());
    var ul = url.parse(req.url,true);
    if(ul.query.public_key != public_key){
        res.render('message.html',{message:'公匙不正确！',back_url:'/login'});
    }
    if(WEIBO.USERS.key_exist(ul.query.admin_key)){
        var water_pages = '';
        var news_pages = ''
        var notices_pages = '';
        var waters = WEIBO.PAGE.getAll_by_Type(0);
        for(var i in waters){
            var tmp = WEIBO.PAGE.getEssay(waters[i]);
            water_pages += `<tr>
            <td><a href='/single?id=${tmp.id}'>${tmp.title.replaceAll('§g','💰').replace(/\xA7[0-9A-FK-OR]/ig, '')}</a></td>
            <td>${WEIBO.USERS.XUID2NAME(tmp.xuid)}</td>
            <td>
               <a href="/api/del/single?type=html&public_key=${ul.query.public_key}&id=${tmp.id}&admin_key=${ul.query.admin_key}">删除</a>
            </td>
        </tr>`
        }
        var news = WEIBO.PAGE.getAll_by_Type(1);
        for(var i in news){
            var tmp = WEIBO.PAGE.getEssay(news[i]);
            news_pages += `<tr>
            <td><a href='/single?id=${tmp.id}'>${tmp.title.replaceAll('§g','💰').replace(/\xA7[0-9A-FK-OR]/ig, '')}</a></td>
            <td>${WEIBO.USERS.XUID2NAME(tmp.xuid)}</td>
            <td>
               <a href="/api/del/single?type=html&public_key=${ul.query.public_key}&id=${tmp.id}&admin_key=${ul.query.admin_key}">删除</a>
            </td>
        </tr>`
        }
        var notices = WEIBO.PAGE.getAll_by_Type(2);
        for(var i in notices){
            var tmp = WEIBO.PAGE.getEssay(notices[i]);
            notices_pages += `<tr>
            <td><a href='/single?id=${tmp.id}'>${tmp.title.replaceAll('§g','💰').replace(/\xA7[0-9A-FK-OR]/ig, '')}</a></td>
            <td>${WEIBO.USERS.XUID2NAME(tmp.xuid)}</td>
            <td>
               <a href="/api/del/single?type=html&public_key=${ul.query.public_key}&id=${tmp.id}&admin_key=${ul.query.admin_key}">删除</a>
            </td>
        </tr>`
        }
        var onlines = '';
        ONLINES.forEach((v,k)=>{
            onlines+=`<article class="mini-post">
            <header>
                <h3>${WEIBO.USERS.XUID2NAME(k)}</h3>
                <p>发帖量：${WEIBO.PAGE.getEssayCount(k)}</p>
                <a href="#" class="author"><img src="images/users/${getUserImage(k)}.jpg" alt="" /></a>
            </header>
        </article>`
        });
        var ips = '';
        var ipss = IPHelper.today();
        for(var i in ipss){
            ips+= `<tr>
            <td>${i}</td>
            <td>${ipss[i]}</td>
        </tr>`
        }
        res.render('admin.html',{ips,admin_key:ul.query.admin_key,name:WEIBO.USERS.admin_key2name(ul.query.admin_key),onlines,water_pages,news_pages,notices_pages});
    }else{
        res.render('message.html',{message:'密码不正确！',back_url:'/login'});
    }
});

app.get("/me",(req,res)=>{
    IPHelper.check(req.ip.toString());
    if(req.cookies.user_id == undefined){res.redirect("/login");return}
    console.log(req.cookies.user_id);
    if(cookieHelper.cookieExist(req.cookies.user_id)==false){
        res.render("message.html",{message:"登陆信息失效，请重新登陆",back_url:"/login"})
        return;
    }
    var xuid = cookieHelper.getUser(req.cookies.user_id);
    var essays = WEIBO.PAGE.getEssayByUser(xuid);
    var main = "";
    essays.forEach(s=>{
        var tmp = WEIBO.PAGE.getEssay(s);
        main+= `<tr>
        <td><a href='/single?id=${tmp.id}'>${tmp.title.replaceAll('§g','💰').replace(/\xA7[0-9A-FK-OR]/ig, '')}</a></td>
        <td>${tmp.datetime}</td>
    </tr>`
    })
    res.render("me.html",{
        name:WEIBO.USERS.XUID2NAME(xuid),
        main
    })
});

app.post("/loginout",(req,res)=>{
    cookieHelper.removeCookie(req.cookies.user_id);
    res.cookie("user_id",null);

    res.redirect("/login");
});

app.post("/client/reply",(req,res)=>{
    IPHelper.check(req.ip.toString());
    console.log(req.url)
    var body = req.body;
    if(req.cookies.user_id==undefined){res.redirect("/login");return;};
    var xuid = cookieHelper.getUser(req.cookies.user_id);
    if(xuid==undefined){res.redirect("/login");return;};
    var ul = url.parse(req.url,true);
    var singleid = ul.query.id;
    if(singleid==undefined){res.redirect("/");return;}
    if(req.body.text==""){
        res.render("message.html",{message:"不合格评论！",back_url:"/single?="+singleid})
        return;
    }
    HTTPPOST.postdata({target:859179182,text:`${WEIBO.USERS.XUID2NAME(xuid)}回复了帖子《${WEIBO.PAGE.getEssay(singleid).title}》：${body.text}`});
    WEIBO.PAGE.addReply(singleid,xuid,req.body.text);
    res.redirect("/single?id="+singleid);
})


app.post("/client/publish",(req,res)=>{
    IPHelper.check(req.ip.toString());
    console.log(req.url)
    var body=req.body;
    if(req.cookies.user_id==undefined){res.redirect("/login");return;};
    var xuid = cookieHelper.getUser(req.cookies.user_id);
    if(xuid==undefined){res.redirect("/login");return;};
    if(body.type=="0"){
        res.render("message.html",{message:"请选择分区",back_url:"/me"});
        return;
    }
    if(publishHelper.publish(xuid)==false){
        res.render("message.html",{message:"发帖频繁！请等待下一小时",back_url:"/me"})
        return;
    }
    if(body.title==""||body.sub_title==""||body.text==""){
        res.render("mezsage.html",{message:"内容违规",back_url:"/me"})
        return;
    }
    var id =WEIBO.PAGE.addEssay(body.title,body.sub_title,body.text.replaceAll("\r\n","<br>"),isNaN(Number(body.type))?0:Number(body.type)-1,xuid);
    NewEssay(id,body.title);
    res.redirect("/single?id="+id);
})

app.get("*",(req,res)=>{
    res.render("message.html",{message:"呀，页面不存在!",back_url:"/"});

})



app.listen(3391);
