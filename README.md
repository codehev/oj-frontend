# NexGenOJ-前端

> **GitHub 项目地址**
>
> [前端](https://github.com/codehev/oj-frontend) | [后端](https://github.com/codehev/oj-backend) | [后端（微服务版）](https://github.com/codehev/oj-backend-microservice) | [代码沙箱](https://github.com/codehev/oj-code-sandbox)

## 项目介绍

此项目是基于 Vue 3 + Spring Boot + Spring Cloud 微服务 + Docker 的**编程题目在线评测系统** （简称 OJ）。

在系统前台，管理员可以创建、管理题目；用户可以自由搜索题目、阅读题目、编写并提交代码。

在系统后端，能够根据管理员设定的题目测试用例在 **代码沙箱** 中对代码进行编译、运行、判断输出是否正确。

其中，代码沙箱可以作为独立服务，提供给其他开发者使用。

项目截图待补充：

## 项目业务流

![17c059bc-ed9c-462b-bb01-35a6285f43ce](image/README/17c059bc-ed9c-462b-bb01-35a6285f43ce-1729605368404-1.png)

## 技术选型

**前端**

- Vue 3
- Vue-CLI 脚手架
- Vuex 状态管理
- Arco Design 组件库
- 前端工程化：ESLint + Prettier + TypeScript
- ⭐️ 手写前端项目模板（通用布局、权限管理、状态管理、菜单生成）
- ⭐️ Markdown 富文本编辑器
- ⭐️ Monaco Editor 代码编辑器
- ⭐️ OpenAPI 前端代码生成

**后端**

- ⭐️ Java Spring Cloud + Spring Cloud Alibaba 微服务
  - Nacos 注册中心
  - OpenFeign 客户端调用
  - GateWay 网关
  - 聚合接口文档
- Spring Boot
- Java 进程控制
- ⭐️ Java 安全管理器
- ⭐️ Docker 代码沙箱实现
- ⭐️ 虚拟机 + 远程开发
- MySQL 数据库
- MyBatis-Plus 及 MyBatis X 自动生成
- Redis 分布式 Session
- ⭐️ RabbitMQ 消息队列
- ⭐️ 多种设计模式
- 策略模式
  - 工厂模式
  - 代理模式
  - 模板方法模式
- 其他：部分并发编程、JVM 小知识
