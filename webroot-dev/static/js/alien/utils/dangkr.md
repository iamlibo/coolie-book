# 荡客 APP 与前端的数据交互指南

# 概述
本说明仅简要的阐述 API 接口的规范。
- 方法名称：方法按照以下功能分为 11 类，二级方法用点号隔开，如获取当前用户为：`user.get`
- 方法参数：大部分 API 都有参数，参数类型都为 JSON
- 方法回调：每个方法都必须回调出来，其中分享的回调最好是分享成功后再回调

**response**
```
{
    // 状态 code，等同于 rest API 状态值
    code: 200,
    message: "消息",
    result: "结果"
}
```


# 功能点
* 1、数据 `data`
* 2、导航栏 `navigation`
* 3、分享 `share`
* 4、地理位置 `geolocation`
* 5、页面位置 `location`
* 6、用户 `user`
* 7、媒体 `media`
* 8、设备 `device`
* 9、对话框 `dialog`
* 10、底部交互 `bottom`
* 11、被动交互
* 12、协议链接



# 1、数据
## 1.1、发送数据
```
data.send

{
    data: 实际数据
}
```
有以下类型数据：
```
// 喜欢了该活动
type: "love"

// 绑定了手机
type: 'bindPhone',
phone: '12312341234'

// 活动信息
"type": "activity",
"activityId": "7472937",
"title": "【单身狂欢】你过来，我有个恋爱想跟你谈一下",
"cover": "活动封面""batchIndex": 0,
activityId: 456,
"activity": {
    title: '活动标题',
    // 活动封面
    cover: '...',
    // 开始地址
    startAddress: '浙江省 嘉兴市 1111111111',
    // 目的地
    destination: '浙江省 嘉兴市 1111111111',
    // 领队ID
    captainId: 2096,
    // 领队昵称
    captainNickname: '行者无疆',
    // 领队头像
    captainAvatar: '...',
    // 活动类型
    types: ['垂钓']
    // 活动亮点
    spot: '。。。',
    // 活动价格
    amount: 100,
    // 定金价格
    prepaymentAmount: 0,
    applyConfig: {
        needEmergencyContact: false
        needGender: true
        needIdentification: false
        needMobile: true
        needNickname: true
        needRealName: false
    }
},
"batchList": [
    {
        "id": 8474361,
        "activityId": 7472937,
        "beginTime": 1447171200000,
        "endTime": 1447343999999,
        "deadline": 1446998399999,
        "paymentCategory": 0,
        "amount": 280,
        "prepaymentAmount": 0,
        "appliedPeoples": 16,
        "maxPeoples": 0,
        "remainingPeoples": null,
        "clubId": 1005,
        "state": 1,
        "waitPayOrder": false
    }
],
"startAddressList": [{
     countryName: '中国',
     provinceName: '浙江省',
     cityName: '杭州市',
     address: '地址'
 }],
"destinationAddress": {
    countryName: '中国',
    provinceName: '浙江省',
    cityName: '杭州市',
    address: '地址'
}
```


# 2、导航栏
## 2.0、导航图标类型
- 返回图标：`back`
- 分享图标：`share`
- 完成图标：`done`
- 举报图标：`report`


## 2.1、显示按钮
```
navigation.show
[{
    type: "share",
    data: {
        title: "分享的标题",
        desc: "分享的描述",
        link: "分享的链接",
        img: "分享的图片",
        type: "activity"、"article",【可选】
        id: 活动ID、文章ID【可选】
    }
}, {
    type: "report",
    data: {
        id: 活动ID、文章ID,
        type: "activity"、"article"
    }
}]
```



# 3、分享
## 3.1、打开分享窗口
```
share.open

data: {
     title: "分享的标题",
     desc: "分享的描述",
     link: "分享的链接",
     img: "分享的图片",
     type: "activity"、"article",【可选】
     id: 活动ID、文章ID【可选】
}
```


# 4、地理位置
## 4.1、获取当前地理、行政位置【1.7实现】
```
geolocation.get
=>
{
    longitude: "经度",
    latitude: "纬度",
    city: "城市"
}
```

## 4.2、调用本地地图【未实现】
```
geolocation.map

{
    longitude: "经度",
    latitude: "纬度",
    altitude: "高度",
    // 地图缩放级别，1~28，默认最大
    scale: 28
}

或

{
    address: "详细地址"
}
```


# 5、页面位置
## 5.1、跳转
- 俱乐部主页
    - type: "club"
    - id: 123（俱乐部 ID）
- 个人主页
    - type: "user"
    - id: 123（个人 ID）
- 活动想去列表
    - type: "loveList"
    - id: 123（活动 ID）
- 报名人列表页
    - type: "applyList"
    - id: 123（活动批次 ID）
- 报名结果页
    - type: "applyResult"
    - orderCode: "123"

```
location.redirect

{
    type: "",
    // 其他参数
    ...
}
```


## 5.2、关闭当前页面【未实现】
```
// 关闭当前页面，清空历史记录，跳转到 APP 主页
location.close
```


## 5.3、web 全屏页
模拟的全屏效果，此时返回按钮是无效的
```
location.fullscreen

{
    active: true/false
}
```


## 5.3、web 页浏览完整【AOS专有】
设置为 true 时，表示页面的终点，安卓手机点击物理键返回时将返回开始页面，对 iPhone 无效
```
location.finished
```




# 6、用户
## 6.1、获取当前用户
```
user.get
=>
// 已登录
{
    userId: "用户ID",
    userEmail: "用户邮箱",
    nickname: "昵称",
    avatar: "头像",
    phone: "用户手机"
    city: "所在城市",
    dkToken: "加密后的必要信息，用于前端与后端的用户验证"
}

// 未登录
{
    userId: 0
}
```

## 6.2、用户登录、注册操作
```
user.login

=>
{
    userId: "用户ID",
    userEmail: "用户邮箱",
    nickname: "昵称",
    avatar: "头像",
    phone: "用户手机",
    city: "所在城市",
    dkToken: "加密后的必要信息，用于前端与后端的用户验证"
}
```

## 6.3、用户注销
```
user.logout

=>
{}
```


# 7、媒体
## 7.1、输入文字
```
media.input

=>
{
    placeholder: "输入框占位字符",
    // 输入框内插入 @某某某：，如果用户删除到冒号，
    // 则应在下一次立即删除全部字符，参考微信的 @ 功能
    // 二次 @ 则需要删除上一次 @ 人，但不能删除内容
    atText: "@某某某：",
    // 并且该@对应的父级 ID 为 1，如果用户删除 @ 之后，返回应该是 0
    atParent: 1,
    // 默认为“text”
    // 输入类型，为“text/tel/number/email/date/time/datetime”之一，
    type: "text",
    // 最大长度，默认为-1，即不限制
    maxLength: -1
}

=>
{
    value: "用户输入的文本",
    atParent: 1
}
```


## 7.2、图片查看器
```
media.picture

{
    list: ["图片1的链接", "图片2的链接"],
    // 默认展示的图片索引，默认0
    active: 0
}
```


## 7.3、上传图片【1.7实现】
```
media.upload
<=
{
    // 是否压缩原图，默认压缩
    minify: true
}

上传过程中，显示 loading，结束后隐藏 loading，上传失败显示错误消息
IOS 直接回调
AOS 发送 media.upload 事件

=>
{
    url: "http://img......"
}
```

## 7.4、复制文本【未实现】
```
media.copy

{
    type: "text",
    content: "待复制的文本"
}
```


## 7.5、聊天
```
media.chat

{
    // 对方的用户 ID
    userId: 123,
    // 对方的昵称
    nickname: '昵称',
    // 对方的头像
    avatar: 'http://...',
    // 活动 ID，可选
    activityId: 456,
    // 活动信息
    activity: {
        activityId: 456,
        title: '活动标题',
        // 活动封面
        cover: '...',
        // 开始地址
        startAddress: '浙江省 嘉兴市 1111111111',
        // 目的地
        destination: '浙江省 嘉兴市 1111111111',
        // 领队ID
        captainId: 2096,
        // 领队昵称
        captainNickname: '行者无疆',
        // 领队头像
        captainAvatar: '...',
        // 活动类型
        types: ['垂钓']
        // 活动亮点
        spot: '。。。',
        // 活动价格
        amount: 100,
        // 定金价格
        prepaymentAmount: 0,
        applyConfig: {
           needEmergencyContact: false
           needGender: true
           needIdentification: false
           needMobile: true
           needNickname: true
           needRealName: false
        }
    },
    // 当前批次信息
    batch: {
        // 批次ID
        id: 123,
        beginTime: 1443110400000,
        endTime: 1443455999999,
        deadTime: 1443455999999,
        // 支付类型:1=在线全额，2=在线预付，0=线下支付
        paymentCategory: 0,
        // 价格
        amount: 0,
        // 预支付价格
        prepaymentAmount: 0,
        appliedPeoples: 0,
        maxPeoples: 10.
        remainingPeoples: 9,
        clubdId: 1021,
        state: 4,
        waitPayOrder: false
    }
}
```


# 8、设备
## 8.1、获取设备所连接的网络环境【未实现】
```
device.network
=>
{
    // 网络类型，2G、3G、4G、5G、wifi
    type: "2G",
    // 运营商
    operator: "中国移动"
}
```

## 8.2、获取设备系统信息【未实现】
```
device.system
=>
{
    os: {
        name: "ios",
        version: "8.1.1"
    },
    dangkr: {
        version: "1.0.0",
        id: "APP ID"
    },
    webview: {
        name: "webkit",
        version: "311.222.11"
    }
}
```



# 9、对话框
## 9.1、打开加载框
```
dialog.loading.open

data：
{
    // 是否为模态
    modal: true,
    // 文本，默认为“加载中”
    text: "加载中"
}
```

## 9.2、打开加载框
```
dialog.loading.close
```


## 9.3、打开提示框
```
dialog.tips.open

{
    // 是否为模态
    modal: false,
    // 文本，默认为“提示”
    text: "提示",
    // 延迟消失时间，单位为秒，默认为 3
    timeout: 3
}
```




# 10、底部
## 10.1、打开报名框
```
bottom.apply

{
    // 是否允许报名
    active: true,
    // 是否隐藏
    hidden: false
}
```

## 10.2、打开输入框
```
bottom.input

{
    // 是否隐藏
    hidden: false
}
```



# 11、被动交互
## 11.1、关注俱乐部
```
club.follow

{
    type: 1(已经关注)
}
```


## 11.2 点击报名
```
bottom.apply
```


## 11.3 点击咨询
```
bottom.respond
```


## 11.4、点击返回事件
__只在当前通知了 location.fullscreen 的时候回调__
```
location.back
```

## 11.5 点击了分享
```
share.click

=> 
{
    type: "qq"
}

type值：
{
    wxtimeline: "朋友圈",
    wxsession: "微信好友",
    sms: "短信",
    sina: "新浪微博",
    qq: "QQ 好友",
    qzone: "QQ 空间"
}
```

## 11.6 输入框提交
```
input.submit

=> 
{
    value: "输入框的值",
    atParent: "AT 的父级，由 media.input 传入"
}
```


# 12 协议链接
```
dangkr://
```

## 12.1 活动详情页
```
dangkr://activity/?id=123
```

## 12.2 个人主页
```
dangkr://user/?id=123
```

## 12.3 俱乐部主页
```
dangkr://club/?id=123
```

## 12.4 文章详情页
```
dangkr://article/?id=123
```


# ua
ua 字符串格式为：
```
// AOS: 原有 UA + 附加 UA
// IOS: 附加 UA
```
附加 UA 格式为为（为了显示，做折行处理）
```
"systemName/{系统名称，如 ios、aos}; systemVersion/{系统版本，如 9.1、5.1} deviceVersion/{设备版本}，
如 iPhone 5s，xiaomi 4s}; dangkr/{荡客版本}/{网络类型}; deviceId/{设备ID}"
```