# 统一说明

## 接口返回数据格式

格式：

| field   | description                                      |
| ------- | ------------------------------------------------ |
| ecode   | 返回码等于 0 代表成功,不等于 0 代表失败          |
| data    | 返回码等于 0 才有 data 返回，并且 data 为对象{}  |
| message | 返回码不等于 0 才有 message 返回，可以直接 toast |

成功示例：

```json
{
  "ecode": 0,
  "data": {}
}
```

失败示例：

```json
{
  "ecode": 101,
  "message": "无效token"
}
```

## msg&code

错误码可由全局定义的`API_MSGS`生成

### General msg&code

| ecode | message    |
| ----- | ---------- |
| -101  | 无效 token |
| -102  | 用户被封禁 |

## token

当接口要求登录用户时，需要携带 token，可以在三个位置携带 token 信息

相关字段：

| field         | Position    | desc                                |
| ------------- | ----------- | ----------------------------------- |
| authorization | HTTP_Header | 头部授权字段， 形如 "ZSToken token" |
| token         | query       | body                                | token |

## 接口

线上地址：

测试地址：

文档地址：
