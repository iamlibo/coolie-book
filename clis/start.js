/**
 * 启动文件
 * @author ydr.me
 * @create 2014-12-02 22:59
 */


'use strict';


var fs = require('fs');
var path = require('path');
var childProcess = require('child_process');

var pkg = require('../package.json');
var configs = require('../configs.js');

var NPM_REGISTRY = 'http://registry.npm.taobao.org';
var ROOT = path.join(__dirname, '../');
var COLOR_MAP = {
    danger: [31, 39],
    success: [32, 39],
    warning: [33, 39]
};


/**
 * 打印 danger 消息
 * @param msg
 * @returns {*}
 */
var logDanger = function (msg) {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('\x1b[' + COLOR_MAP.danger[0] + 'm');
    args.push('\x1b[' + COLOR_MAP.danger[1] + 'm');

    return console.log.apply(console, args);
};


/**
 * 打印 success 消息
 * @param msg
 * @returns {*}
 */
var logSuccess = function (msg) {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('\x1b[' + COLOR_MAP.success[0] + 'm');
    args.push('\x1b[' + COLOR_MAP.success[1] + 'm');

    return console.log.apply(console, args);
};


/**
 * 打印 warning 消息
 * @param msg
 * @returns {*}
 */
var logWarning = function (msg) {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('\x1b[' + COLOR_MAP.warning[0] + 'm');
    args.push('\x1b[' + COLOR_MAP.warning[1] + 'm');

    return console.log.apply(console, args);
};


/**
 * 打印普通消息
 * @returns {*}
 */
var logNormal = function () {
    return console.log.apply(configs, arguments);
};


/**
 * 执行系统命令
 * @param cmds {Array|String} 命令数组
 * @param [callback] {Function} 执行完毕回调
 */
var exec = function (cmds, callback) {
    cmds = typeof(cmds) === 'string' ? [cmds] : cmds;
    var command = cmds.join(' && ');
    logNormal(command);

    var point = 1;
    process.stdout.write('.');
    var interval = setInterval(function () {
        process.stdout.cursorTo(point);
        process.stdout.write('.');
        point++;
    }, 1000);

    childProcess.exec(command, function (err, stdout, stderr) {
        clearInterval(interval);
        process.stdout.clearLine();
        process.stdout.write('\n');

        if (err) {
            logDanger(err.message);
            return process.exit(1);
        }

        if (stderr) {
            logDanger(stderr);
            return process.exit(1);
        }

        logSuccess(stdout);

        if (typeof callback === 'function') {
            callback();
        }
    });
};


/**
 * 输出当前时间字符串
 * @returns {string}
 */
var now = function () {
    var d = new Date();
    var fix = function (n) {
        return (n < 10 ? '0' : '') + n;
    };

    return ''.concat(
        '[',
        fix(d.getFullYear()),
        '-',
        fix(d.getMonth() + 1),
        '-',
        fix(d.getDate()),
        ' ',
        fix(d.getHours()),
        ':',
        fix(d.getMinutes()),
        ':',
        fix(d.getSeconds()),
        '.',
        fix(d.getMilliseconds()),
        ']'
    );
};


// 更新代码
var gitPull = function (callback) {
    logNormal('1/3');
    exec([
        'cd ' + ROOT,
        'git branch',
        'git pull -f'
    ], function () {
        logSuccess(now(), 'git pull success');
        callback();
    });
};


// 更新代码
var installNodeModules = function (callback) {
    logNormal('2/3');
    exec('npm install --registry=' + NPM_REGISTRY, function () {
        logSuccess(now(), 'install node modules success');
        callback();
    });
};


// 本地启动
var startLocal = function (callback) {
    var supervisor = require('supervisor');
    var args = [];

    args.push(__filename);
    args.push('-w');
    args.push('./webserver/,./bookroot/');
    args.push('-e');
    args.push('js,md');
    args.push('app.js');

    supervisor.run(args);
    callback();
};


// pm2 启动
var startPM2 = function (callback) {
    exec([
        'pm2 start pm2.json',
        'pm2 show ' + pkg.name
    ], callback);
};


// 启动
var start = function () {
    logNormal('3/3');
    if (configs.env === 'local') {
        startLocal(function () {
            logSuccess(now(), 'listen changing success');
        });
    } else {
        startPM2(function () {
            logSuccess(now(), 'pm2 start success');
        });
    }
};


var banner = function () {
    var list = [];
    var padding = 4;
    list.push('nodejs version     │ ' + process.versions.node);
    list.push('nodejs environment │ ' + configs.env);
    list.push('nodejs project     │ ' + pkg.name + '@' + pkg.version);
    list.push('project home       │ ' + ROOT);
    var maxLength = 0;
    list.forEach(function (item) {
        if (item.length > maxLength) {
            maxLength = item.length;
        }
    });

    maxLength += padding;

    var fixed = function (str, maxLength, padding) {
        return str + new Array(maxLength - str.length).join(padding);
    };

    var theadLeft = '┌─────────────────────┬';
    var tfootLeft = '└─────────────────────┴';
    var thead = fixed(theadLeft, maxLength + padding - 1, '─') + '┐';
    var tfoot = fixed(tfootLeft, maxLength + padding - 1, '─') + '┘';

    logWarning(thead);
    list.forEach(function (item) {
        logWarning('│  ' + fixed(item, maxLength, ' ') + '│');
    });
    logWarning(tfoot);
};


banner();

// 更新代码安装模块并启动
gitPull(function () {
    installNodeModules(function () {
        start();
    });
});
