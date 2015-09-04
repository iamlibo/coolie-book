帮你领进门，学习完 hello world，就算是入门结束了，下面开始。

# 准备
先准备以下目录
```
. demo
|-- dev 开发环境
|   |-- coolie.json
|   |-- coolie.min-1.1.1.js
|   |-- coolie-config.js
|   |-- index.html
|   `-- index.js
`-- pro 生成环境
    `-- 空
```

# 下载模块加载器
切换到 dev 目录：
```
coolie pull
```

# html
先写个页面`index.html`
```
<!DOCTYPE html>
<html>
<head lang="zh-cn">
    <meta charset="UTF-8">
    <title>index.html</title>
</head>
<body>

<!--注意：-->
<!--1. 这里的 script 标签多了 coolie 属性-->
<!--2. 引用了 coolie.min.js-->
<!--3. 增加了 data-config 属性-->
<!--4. 增加了 data-main 属性-->
<script coolie src="./coolie.min-1.1.1.js"
        data-config="./coolie-config.js"
        data-main="index.js"></script>

</body>
</html>
```

1. `coolie`属性：表明该 script 是 coolie.cli（前端开发构建工具） 的管辖范围
2. `coolie.min.js`：前端模块加载器
3. `data-config`属性：前端模块加载器配置文件
4. `data-main`属性：模块入口文件地址，相对于`data-config.js`里的`base`属性，后文说的


# js
接上文，至少需要新建两个文件。

## coolie-config.js
很简单
```
coolie.config({
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

# coolie.json
```
{
  "js": {
    "main": [
      "./index.js"
    ],
    "coolie-config.js": "./coolie-config.js",
    "dest": "./",
    "chunk": []
  },
  "css": {
    "dest": "./static/css/",
    "minify": {
      "compatibility": "ie7"
    }
  },
  "html": {
    "src": [
      "./index.html"
    ],
    "minify": true
  },
  "resource": {
    "dest": "./static/res/"
  },
  "copy": [],
  "dest": {
    "dirname": "../pro/",
    "host": "",
    "versionLength": 32
  }
}
```

- `js.src`：入口文件，即 index.js
- `html.src`：需要构建的 HTML，即 index.html
- `dest.dirname`：构建的目标目录，即上层的 dest 目录

# 构建
目前，源代码什么都是没有被构建的，我们来尝试构建一下看看。
```
➜ coolie build

╔═════════════════════════════════════════╗
║   coolie@0.22.8                         ║
║   The front-end development builder.    ║
╚═════════════════════════════════════════╝


                 1/5 => copy files

                 2/5 => build main
                  √  => /index.js
                  ×  => unchunk modules

                 3/5 => overwrite config
                  √  => base: "./"
                  √  => version: "{
                          "index.js": "4f60ff2579e7b55f2e1ca87ba2221fde"
                        }"
                  √  => callbacks: 0
                  √  => /../pro/coolie-config.0e49540baa0842bd9b2a250a6fb643ed.js

                 4/5 => build html css
                  √  => /../pro/ba1c8824da1cb2b0d3f7e94f2aea8b8d.js
                  √  => /index.html

                 5/5 => generator relationship map
                  √  => /../pro/relationship-map.json

       build success => copy 1 file(s),
                        build 1 main file(s),
                        build 0 js file(s),
                        build 1 html file(s),
                        build 0 css file(s),
                        past 98 ms
```

我们来看看构建之后的目录结构：
```
. demo
|-- dev 开发环境
|   |-- coolie.json
|   |-- coolie.min-1.11.js
|   |-- coolie-config.js
|   |-- index.html
|   `-- index.js
`-- pro 生成环境
    |-- ba1c8824da1cb2b0d3f7e94f2aea8b8d.js
    |-- coolie-config.0e49540baa0842bd9b2a250a6fb643ed.js
    |-- index.4f60ff2579e7b55f2e1ca87ba2221fde.js
    |-- index.html
    `-- relationship-map.json
```

# html
*为了阅读，已经折行处理了。*
```
<!DOCTYPE html>
<html>
<head lang="zh-cn"> 
<meta charset="UTF-8"> 
<title>index.html</title>
</head>
<body>

<script src="/ba1c8824da1cb2b0d3f7e94f2aea8b8d.js" 
data-config="./coolie-config.0e49540baa0842bd9b2a250a6fb643ed.js" 
data-main="index.js"></script>

</body></html>
<!--coolie@0.22.8-->
```

- 在文件末尾打上构建工具的版本和的构建时间。
- `script`上的`coolie`属性也被去掉了。
- `data-config`属性也被重写了。

# js
## coolie-config.js
构建之后的前端模块加载器配置文件为`coolie-config.0e49540baa0842bd9b2a250a6fb643ed.js`。

*为了便于阅读，已经折行处理了。*
```
/*coolie@0.22.8*/
coolie.config({
    base:"./",
    debug:!1,
    cache:!0,
    version:{
        "index.js":"4f60ff2579e7b55f2e1ca87ba2221fde"
    }
}).use();
```

- 在文件开头，打上构建工具的版本和的构建时间。
- 增加了`debug`参数，值为 false（[详细参考点这里](./coolie-config-js.md)）。
- 增加了`version`属性，值为`index.js`的版本（[详细参考点这里](./coolie-config-js.md)）。

## index.js
新的`index.js`重命名为`index.4f60ff2579e7b55f2e1ca87ba2221fde.js`。

*为了阅读，已经折行处理了。*
```
/*coolie@0.22.8*/
define("0",[],function(){alert("hello world")});
```

- 在文件开头，打上构建工具的版本和的构建时间。
- 代码进行了压缩，并且加上了模块的 ID 为 “0”。


# relationship-map.json
`relationship-map.json`是新生成的文件。
```
{
    "index.html": {
        "css": {},
        "main": "index.js",
        "deps": []
    }
}
```
这个文件，按照构建的 HTML 文件分开，分别标识了每个 HTML 文件里引用的入口 JS 文件，依赖的 JS 模块和引用的 CSS 文件。

因为构建之后，静态资源路径都替换为了绝对路径，所有的绝对路径，都相对于构建的根目录。

另，也可以启动一个静态的 HTTP 服务器（sts:<https://www.npmjs.com/package/sts>）来浏览。



