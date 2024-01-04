## Sse 使用例子

## NodeJS版本
简单地编写一个http 服务端脚本

### 运行命令
 `node sse-server.js`

### 浏览器

打开 `http://localhost:8080/`



## Java版本

[What is Server-Sent Events (SSE) and how to implement it?](https://medium.com/deliveryherotechhub/what-is-server-sent-events-sse-and-how-to-implement-it-904938bffd73)

[代码仓库](https://github.com/G-khan/server-sent-events?tab=readme-ov-file)

后端使用 `webflux starter`

### 运行命令

`./gradlew bootRun`

### 开始使用

- 可以在多个命令窗口中运行命令进行订阅消息

```bash
curl --location --request GET 'http://localhost:8080/api/v1/live-scores'
```

- 可以在多个命令窗口中运行命令进行发布消息

```bash
curl --location --request POST 'http://localhost:8080/api/v1/live-scores' \
--header 'Content-Type: application/json' \
--data-raw '{
    "homeTeam": "Arsenal",
    "awayTeam": "Tottenham",
    "homeScore": 1,
    "awayScore": 1
}' 
```


### 防止页面echarts 出现内存溢出问题

[https://juejin.cn/post/6933444312827068429](https://juejin.cn/post/6933444312827068429)