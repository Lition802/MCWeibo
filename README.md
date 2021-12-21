# 简介

MCWeibo是一个在线的微博平台，后端基于Nodejs搭建

可以通过HTTP请求来发布、获取文章


# api


|HTTP状态码|含义|
|:-:|:-:|
|200|接口正常|
|404|请求的资源未找到|
|401|请求进行身份认证|
|416|请求的范围无效|


## 发布文章

```
[POST] /api/publish/
```

POST数据示例
``` json
{
    "key":"{key}",
    "title":"文章标题",
    "subtitle":"文章副标题",
    "author":"作者",
    "text":"正文"
}
```

## 通过页码获取页面内容

```
[GET] /api/page/?page={page}&key={key}
```



## 获取所有文章

```
[GET] /api/page/all?key={key}
```

## 评论贴子

```
[POST] /api/reply
```

POST数据示例
``` json
{
	"key":"{key}",
	"text":"评论内容",
	"id":"贴子id",
	"name":"评论玩家昵称"
}
```

## 登录

```
[POST] /api/login
```

不登录也可以直接发帖或者评论，没有校验

客户端需要登录只是限制一下不注册的人发帖和评论

ps:每日登陆有经验奖励

POST数据示例
``` json
{
	"key":"{key}",
	"xuid":"玩家xuid",
	"pwd":"登录密码"
}
```

## 注册

```
[POST] /api/reg
```

POST数据示例
``` json
{
	"key":"{key}",
	"name":"玩家昵称",
	"pwd":"密码MD5值",
	"xuid":"玩家xuid"
}

```

## 根据id删除文章

```
[GET] /api/del/essay?key={key}&id={id}
```
注意不可逆

## 根据id删除评论

```
[GET] /api/del/reply?key={key}&essayid={id}&replyid={id2}
```
注意不可逆

## 通过id获取具体文章

```
[GET] /api/essay/?id={id}&key={key}
```

## 通过用户名获取用户信息

```
[GET] /api/user/?key={key}&user={name}
```

