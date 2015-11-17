学习新东西，往往都是从 Hello World 开始的，coolie 也是这样，一起来看看吧。


# 准备
先准备以下目录
```
demo
├── dev
│   ├── index.html
│   └── index.js
└── pro
    └── 空
```
如上，`demo`目录里，留了两个文件夹`dev`和`pro`：

- `dev`：开发环境根目录
- `pro`：生产环境根目录


# 下载模块加载器
先下载模块加载器来保证我们的模块可以正常运行。切换到 dev 目录，使用命令
```
coolie install coolie
```
来下载模块加载器，下载完成后，`coolie.js`和`coolie.min.js`会保存在`dev`根目录下。

```
demo
├── dev
│   ├── coolie.js
│   ├── coolie.min.js
│   ├── index.html
│   └── index.js
└── pro
    └── 空
```



# html 文件
将`index.html`文件内容填写如下：

```
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>index.html</title>
</head>
<body>

<!--注意：-->
<!--1. 这里的 script 标签多了 coolie 属性-->
<!--2. 引用了 coolie.min.js-->
<!--3. 增加了 data-config 属性-->
<!--4. 增加了 data-main 属性-->
<script coolie src="./coolie.min.js"
        data-config="./coolie-config.js"
        data-main="index.js"></script>

</body>
</html>
```

1. `coolie`属性：表明该 script 是 coolie cli（前端开发构建工具） 的管辖范围
2. `coolie.min.js`：前端模块加载器
3. `data-config`属性：前端模块加载器配置文件
4. `data-main`属性：模块入口文件地址，相对于`data-config.js`里的`base`属性，后文说的


# js 文件

## coolie-config.js
`coolie-config.js`是`coolie.js`（模块加载器）的配置文件，不必担心，配置非常的简单。

使用`coolie init -j`生成`coolie-config.js`，修改`base`项：
```
/**
 * ======================================================
 * coolie.js 配置文件 `coolie-config.js`
 * 使用 `coolie.init -j` 生成 `coolie-config.js` 文件模板
 * 前端模块加载器配置文件
 * @link http://coolie.ydr.me/begin/coolie-config.js/
 * @author ydr.me
 * ======================================================
 */

coolie.config({
    // 入口模块基准路径，相对于当前文件
    base: './'
}).use();
```

- `base`地址相对于模块加载器（即：coolie.js 的文件 URL 地址）
- `use`表示启动入口文件。

## index.js
```
define(function () {
    alert('hello world');
});
```

# coolie.config.js
使用 coolie init -c 生成，并修改为：
```
/**
 * ======================================================
 * coolie cli 配置文件 `coolie.config.js`
 * 使用 `coolie.init -c` 生成 `coolie.config.js` 文件模板
 * 当前配置文件所在的目录为构建的根目录
 * @link http://coolie.ydr.me/begin/coolie.config.js/
 * @author ydr.me
 * =======================================================
 */

'use strict';

module.exports = function (coolie) {
    // coolie 配置
    coolie.config({
        // 是否在构建之前清空目标目录
        clean: true,

        // js 构建
        js: {
            // 入口模块
            main: [
                './index.js'
            ],
            // coolie-config.js 路径
            'coolie-config.js': './coolie-config.js',
            // js 文件保存目录
            dest: './',
            // 分块配置
            chunk: []
        },

        // html 构建
        html: {
            // html 文件
            src: [
                './index.html'
            ],
            // 是否压缩
            minify: true
        },

        // css 构建
        css: {
            // css 文件保存目录
            dest: './',
            // css 压缩配置
            minify: {
                compatibility: 'ie7'
            }
        },

        // 资源
        resource: {
            // 资源保存目录
            dest: './',
            // 是否压缩
            minify: true
        },

        // 原样复制文件
        copy: [],

        // 目标配置
        dest: {
            // 目标目录
            dirname: '../pro/',
            // 目标根域
            host: '',
            // 版本号长度
            versionLength: 32
        }
    });

    // 使用 coolie 中间件
    // coolie.use(require('coolie-*'));

    // 自定义 coolie 中间件
    //coolie.use(function (options) {
    //    // do sth.
    //    return options;
    //});
};
```

- `js.src`：入口文件，即 index.js
- `html.src`：需要构建的 HTML，即 index.html
- `dest.dirname`：构建的目标目录，即上层的 dest 目录

# 构建
目前，源代码什么都是没有被构建的，我们来尝试构建一下看看。
```
➜ coolie build

╔══════════════════════════════════════════════════════╗
║   coolie@1.0.2                                       ║
║   The front-end development builder.                 ║
╚══════════════════════════════════════════════════════╝


                 1/6 >> parse coolie config
       coolie config >> /demo/dev/coolie.config.js
         src dirname >> /demo/dev
        dest dirname >> /demo/pro/

                 2/6 >> copy files
          copy files >> no files are copied

                 3/6 >> build main module
                   √ >> /index.js

                 4/6 >> override coolie-config.js
                   √ >> base: "./"
                   √ >> async: "async/"
                   √ >> chunk: "chunk/"
                   √ >> version: "{}"
                   √ >> callbacks: 0
                   √ >> ../pro/79f9ed3283181085347bfea15ac65773.js

                 5/6 >> build html
                   √ >> /coolie.min.js
                   √ >> /index.html

                 6/6 >> generate a resource relationship map
                   √ >> ../pro/coolie-map.json

       build success >> past 325ms
```

我们来看看构建之后的目录结构：
```
demo
├── dev
│   ├── coolie-config.js
│   ├── coolie.config.js
│   ├── coolie.js
│   ├── coolie.min.js
│   ├── index.html
│   └── index.js
└── pro
    ├── 4f60ff2579e7b55f2e1ca87ba2221fde.js
    ├── 79f9ed3283181085347bfea15ac65773.js
    ├── 8c17fee661f27cd74a8ac8b785593c3d.js
    ├── coolie-map.json
    └── index.html
```

# html
*为了阅读，已经折行处理了。*
```
<!DOCTYPE html>
<html>
<head> 
<meta charset="UTF-8"> 
<title>index.html</title>
</head>
<body> 

<script src="/8c17fee661f27cd74a8ac8b785593c3d.js"  
data-config="~/79f9ed3283181085347bfea15ac65773.js" 
data-main="4f60ff2579e7b55f2e1ca87ba2221fde.js" ></script> 

</body></html>
<!--coolie@1.0.2-->
```

- 在文件末尾打上构建工具的版本和的构建时间。
- `script`上的`coolie`属性也被去掉了。
- `data-config`属性也被重写了。
- `data-main`属性也被重写了。

# js
## coolie-config.js
构建之后的前端模块加载器配置文件为`79f9ed3283181085347bfea15ac65773.js`。

*为了便于阅读，已经折行处理了。*
```
/*coolie@1.0.2*/
coolie.config({
    base:"./",
    async:"async/",
    chunk:"chunk/",
    debug:!1,
    cache:!0,
    version:{}
}).use();
```

- 在文件开头，打上构建工具的版本和的构建时间。
- 增加了`debug`参数，值为 false（[详细参考点这里](/begin/coolie-config-js.md)）。
- 增加了`version`属性，当前为空，主要记录 chunk、async 模块的版本号。

## index.js
新的`index.js`重命名为`4f60ff2579e7b55f2e1ca87ba2221fde.js`。

*为了阅读，已经折行处理了。*
```
/*coolie@1.0.2*/
define("0",[],function(){alert("hello world")});
```

- 在文件开头，打上构建工具的版本和的构建时间。
- 代码进行了压缩，并且加上了模块的 ID 为 “0”。


# coolie-map.json
`coolie-map.json`是新生成的文件。
```
{
  "/index.html": {
    "main": [
      {
        "src": "/index.js",
        "dest": "../pro/4f60ff2579e7b55f2e1ca87ba2221fde.js",
        "deps": []
      }
    ],
    "async": [],
    "js": [],
    "css": []
  }
}
```
这个文件，按照构建的 HTML 文件分开，分别标识了每个 HTML 文件里引用的入口 JS 文件，依赖的 JS 模块和引用的 CSS 文件。

因为构建之后，静态资源路径都替换为了绝对路径，所有的绝对路径，都相对于构建的根目录。

另，可以启动一个静态的 HTTP 服务器（sts:<https://www.npmjs.com/package/sts>）来浏览。



