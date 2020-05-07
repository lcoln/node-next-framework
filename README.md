# node-framework
### 项目远程目录 /www.upgrade/node-next-framework
### 本地文件夹名称恒为node-next-framework
### 如果工程里无projects目录，请新建projects目录，运行项目则是需要将项目clone进projects目录
#### 实例化后全局默认挂载以下参数
    APP // 框架实例，可以通过APP.get(key)获取全局配置
    Controller // 控制类, extends该控制类可获取session等实例
    Utils // 全局工具函数库
    Sec // 全局加密库
> node项目框架

## Build Setup

``` bash

# 安装依赖
npm install

# 启动项目
node projects/${project}/app.js

# 创建redis主从配置文件
#!/bin/bash
echo "sentinel myid cf1de9ff79255c919b9d2f3bc8afdc2b4b9d0c74
sentinel monitor mymaster 127.0.0.1 6379 2
sentinel down-after-milliseconds mymaster 60000
sentinel config-epoch mymaster 0
# Generated by CONFIG REWRITE
port 26379
dir "/usr/local/etc"
sentinel leader-epoch mymaster 0
sentinel known-slave mymaster 127.0.0.1 6380
sentinel current-epoch 0" > /usr/local/etc/sentinel.conf 

# 连接redis
#!/bin/bash
install redis redis-sentinel
sudo -S nohup redis-sentinel /usr/local/etc/sentinel.conf &
nohup redis-server --port 6379 &
nohup redis-server --port 6380 &
redis-cli -p 6380
> SLAVEOF 127.0.0.1 6379  // master: 6379. slave: 6380

# 连接mysql
install mysql
mysqld
连接不上时查看
1. 数据库服务器3306端口是否放行
2. 去除my.cnf bind-address=127.0.0.1