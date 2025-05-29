# My Twitter API 接口文档

## 基础信息

- 基础路径: `/api/v1`
- 请求方式: REST
- 数据格式: JSON
- 认证方式: Bearer Token

## 用户相关接口

### 登录

```http
POST /auth/login

Request:
{
  "email": "string",     // 邮箱
  "password": "string",  // 密码
  "remember": boolean    // 是否记住登录状态
}

Response:
{
  "code": 0,
  "data": {
    "token": "string",   // JWT Token
    "userInfo": {
      "id": number,
      "username": "string",
      "email": "string",
      "avatar": "string",
      "bio": "string",
      "location": "string",
      "website": "string",
      "coverImage": "string",
      "joinTime": "string",
      "following": number,
      "followers": number
    }
  }
}
```

### 注册

```http
POST /auth/register

Request:
{
  "username": "string",  // 用户名
  "email": "string",     // 邮箱
  "password": "string",  // 密码
  "confirmPassword": "string"  // 确认密码
}

Response:
{
  "code": 0,
  "data": {
    "token": "string",
    "userInfo": {
      // 同上
    }
  }
}
```

### 获取用户信息

```http
GET /users/{userId}

Response:
{
  "code": 0,
  "data": {
    "id": number,
    "username": "string",
    "avatar": "string",
    "bio": "string",
    "location": "string",
    "website": "string",
    "coverImage": "string",
    "joinTime": "string",
    "following": number,
    "followers": number
  }
}
```

### 更新用户信息

```http
PUT /users/{userId}

Request:
{
  "username": "string",
  "bio": "string",
  "location": "string",
  "website": "string",
  "avatar": File,      // 头像文件
  "coverImage": File   // 封面图片文件
}

Response:
{
  "code": 0,
  "data": {
    // 更新后的用户信息
  }
}
```

### 关注/取消关注用户

```http
POST /users/{userId}/follow

Response:
{
  "code": 0,
  "data": {
    "isFollowing": boolean
  }
}
```

## 帖子相关接口

### 获取帖子详情

```http
GET /posts/{postId}

Response:
{
  "code": 0,
  "data": {
    "id": number,
    "userId": number,
    "username": "string",
    "avatar": "string",
    "content": "string",
    "image": "string",
    "createdAt": "string",
    "comments": number,
    "shares": number,
    "likes": number,
    "isLiked": boolean
  }
}
```

### 获取帖子评论列表

```http
GET /posts/{postId}/comments

Query:
{
  "page": number,      // 页码
  "pageSize": number   // 每页数量
}

Response:
{
  "code": 0,
  "data": {
    "total": number,
    "list": [
      {
        "id": number,
        "userId": number,
        "username": "string",
        "avatar": "string",
        "content": "string",
        "createdAt": "string"
      }
    ]
  }
}
```

### 发表评论

```http
POST /posts/{postId}/comments

Request:
{
  "content": "string"  // 评论内容
}

Response:
{
  "code": 0,
  "data": {
    // 新创建的评论信息
  }
}
```

### 点赞/取消点赞

```http
POST /posts/{postId}/like

Response:
{
  "code": 0,
  "data": {
    "isLiked": boolean,
    "likes": number
  }
}
```

### 转发帖子

```http
POST /posts/{postId}/share

Response:
{
  "code": 0,
  "data": {
    "shares": number
  }
}
```

## 通知相关接口

### 获取通知列表

```http
GET /notifications

Query:
{
  "page": number,      // 页码
  "pageSize": number   // 每页数量
}

Response:
{
  "code": 0,
  "data": {
    "total": number,
    "list": [
      {
        "id": number,
        "type": "string",    // like/share/comment/mention
        "userId": number,
        "username": "string",
        "avatar": "string",
        "content": "string",
        "postId": number,
        "postContent": "string",
        "postImage": "string",
        "createdAt": "string"
      }
    ]
  }
}
```

### 标记通知为已读

```http
PUT /notifications/read

Request:
{
  "ids": number[]     // 通知ID列表，为空则标记所有为已读
}

Response:
{
  "code": 0,
  "data": null
}
```

## 话题相关接口

### 获取热门话题

```http
GET /topics/trending

Response:
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": number,
        "category": "string",
        "title": "string",
        "posts": number
      }
    ]
  }
}
```

### 获取话题详情

```http
GET /topics/{topicId}

Response:
{
  "code": 0,
  "data": {
    "id": number,
    "category": "string",
    "title": "string",
    "posts": number,
    "description": "string"
  }
}
```

### 获取话题下的帖子

```http
GET /topics/{topicId}/posts

Query:
{
  "page": number,
  "pageSize": number
}

Response:
{
  "code": 0,
  "data": {
    "total": number,
    "list": [
      // 帖子列表，格式同帖子详情
    ]
  }
}
```

## 举报相关接口

### 举报内容

```http
POST /reports

Request:
{
  "targetType": "string",  // post/comment/user
  "targetId": number,
  "reason": "string",      // spam/inappropriate/violence/harassment/other
  "description": "string"  // 详细说明（可选）
}

Response:
{
  "code": 0,
  "data": null
}
```

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未登录或token失效 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 通用响应格式

```typescript
interface Response<T> {
  code: number;        // 错误码
  message?: string;    // 错误信息
  data: T;            // 响应数据
}
```

## 注意事项

1. 所有需要认证的接口请在请求头中携带token:
```http
Authorization: Bearer <token>
```

2. 文件上传使用 multipart/form-data 格式

3. 时间格式统一使用 ISO 8601 格式

4. 分页接口默认 pageSize=20

5. 图片上传支持格式: jpg, jpeg, png, gif

6. 图片大小限制: 10MB 