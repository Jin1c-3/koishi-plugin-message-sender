# koishi-plugin-message-sender

[![npm](https://img.shields.io/npm/v/koishi-plugin-message-sender?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-message-sender)

提供私聊、群聊广播服务，可以顺便加精、@全体成员等

推荐使用官方插件 `sudo` 、 `echo` 和 `dialogue` 完成本插件的大部分功能

## 发消息

```
echo -c #123456789 -E hello world<at type="all"/>
```

向 `123456789` 发送消息 `hello world` 。加上 `-E` 选项后可以发表情，也可以使用 `<at type="all"/>` 来@全体成员

对于广播，可以使用 `koishi-plugin-dialogue` 来实现：

```
# "^广播消息 ([^]*)" "$(echo -c #123 -E $1)$n$(echo -c #345 -E $1)" -x
```

设置后，只需要使用：

```
广播消息 123
换行
emoji
```

就可以把后面的消息广播。

## 加精

推荐使用 `koishi-plugin-revoke` 插件来实现

首先使用 `dialogue`

```
# 广播加精 "$(sudo -c #123 set-essence -b)$n$(sudo -c #456 set-essence -b)"
```

然后每次 `广播消息` 后再使用 `广播加精` 即可
