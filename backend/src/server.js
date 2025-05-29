const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your-secret-key';

// 中间件
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// 文件上传配置
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// 内存数据存储
const db = {
  users: [
    {
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      password: '123456',
      avatar: null,
      bio: '测试用户',
      location: '中国',
      website: 'http://example.com',
      coverImage: null,
      joinTime: new Date(),
      following: [],
      followers: []
    }
  ],
  posts: [
    {
      id: 1,
      content: '这是一条测试帖子',
      image: null,
      authorId: 1,
      createdAt: new Date(),
      likes: [],
      comments: []
    }
  ],
  topics: [
    {
      id: 1,
      title: '测试话题',
      category: '测试',
      description: '这是一个测试话题',
      posts: [1]
    }
  ]
};

// 认证中间件
const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: '未提供token' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: '无效的token' });
  }
};

// 用户认证路由
app.post('/api/v1/auth/register', (req, res) => {
  const { email, username, password } = req.body;
  
  // 检查用户是否存在
  if (db.users.find(u => u.email === email || u.username === username)) {
    return res.status(400).json({ message: '用户已存在' });
  }

  const user = {
    id: db.users.length + 1,
    email,
    username,
    password,
    avatar: null,
    bio: '',
    location: '',
    website: '',
    coverImage: null,
    joinTime: new Date(),
    following: [],
    followers: []
  };

  db.users.push(user);

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

  res.status(201).json({
    code: 201,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    }
  });
});

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: '邮箱或密码错误' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

  res.json({
    code: 200,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    }
  });
});

// 用户相关路由
app.get('/api/v1/users/:id', (req, res) => {
  const user = db.users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: '用户不存在' });
  }

  res.json({
    code: 200,
    data: {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
      website: user.website,
      coverImage: user.coverImage,
      joinTime: user.joinTime,
      _count: {
        following: user.following.length,
        followers: user.followers.length,
        posts: db.posts.filter(p => p.authorId === user.id).length
      }
    }
  });
});

// 帖子相关路由
app.get('/api/v1/posts', (req, res) => {
  const posts = db.posts.map(post => ({
    ...post,
    author: db.users.find(u => u.id === post.authorId),
    _count: {
      comments: post.comments.length,
      likes: post.likes.length
    }
  }));

  res.json({
    code: 200,
    data: posts
  });
});

app.post('/api/v1/posts', auth, upload.single('image'), (req, res) => {
  const { content } = req.body;
  const image = req.file?.filename;
  const userId = req.user.id;

  const post = {
    id: db.posts.length + 1,
    content,
    image,
    authorId: userId,
    createdAt: new Date(),
    likes: [],
    comments: []
  };

  db.posts.push(post);

  res.status(201).json({
    code: 201,
    data: {
      ...post,
      author: db.users.find(u => u.id === userId)
    }
  });
});

// 点赞功能
app.post('/api/v1/posts/:id/like', auth, (req, res) => {
  const postId = parseInt(req.params.id);
  const userId = req.user.id;
  const post = db.posts.find(p => p.id === postId);

  if (!post) {
    return res.status(404).json({ message: '帖子不存在' });
  }

  const likeIndex = post.likes.indexOf(userId);
  if (likeIndex > -1) {
    post.likes.splice(likeIndex, 1);
  } else {
    post.likes.push(userId);
  }

  res.json({
    code: 200,
    data: {
      liked: likeIndex === -1
    }
  });
});

// 评论功能
app.post('/api/v1/posts/:id/comment', auth, (req, res) => {
  const postId = parseInt(req.params.id);
  const { content } = req.body;
  const userId = req.user.id;
  const post = db.posts.find(p => p.id === postId);

  if (!post) {
    return res.status(404).json({ message: '帖子不存在' });
  }

  const comment = {
    id: post.comments.length + 1,
    content,
    authorId: userId,
    createdAt: new Date()
  };

  post.comments.push(comment);

  res.status(201).json({
    code: 201,
    data: {
      ...comment,
      author: db.users.find(u => u.id === userId)
    }
  });
});

// 关注功能
app.post('/api/v1/users/:id/follow', auth, (req, res) => {
  const targetId = parseInt(req.params.id);
  const userId = req.user.id;

  if (userId === targetId) {
    return res.status(400).json({ message: '不能关注自己' });
  }

  const user = db.users.find(u => u.id === userId);
  const targetUser = db.users.find(u => u.id === targetId);

  if (!targetUser) {
    return res.status(404).json({ message: '用户不存在' });
  }

  const followingIndex = user.following.indexOf(targetId);
  if (followingIndex > -1) {
    user.following.splice(followingIndex, 1);
    targetUser.followers.splice(targetUser.followers.indexOf(userId), 1);
  } else {
    user.following.push(targetId);
    targetUser.followers.push(userId);
  }

  res.json({
    code: 200,
    data: {
      following: followingIndex === -1
    }
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 