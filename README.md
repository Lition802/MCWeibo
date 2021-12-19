# 简介

MCWeibo是一个在线的微博平台，后端基于Nodejs搭建

可以通过HTTP请求来发布、获取文章


# api

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
[GET] /api/del?key={key}&id={id}
```
注意不可逆

## 通过id获取具体文章

```
[GET] /api/essay/?id={id}&key={key}
```



|HTTP状态码|含义|
|:-:|:-:|
|200|接口正常|
|404|请求的资源未找到|
|401|请求进行身份认证|
|416|请求的范围无效|
