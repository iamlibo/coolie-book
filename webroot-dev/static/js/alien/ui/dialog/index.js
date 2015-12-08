/*!
 * 对话框
 * @author ydr.me
 * @create 2015-01-11 16:53
 */


define(function (require, exports, module) {
    /**
     * @module ui/dialog/
     * @requires ui/mask/
     * @requires ui/window/
     * @requires utils/dato
     * @requires utils/typeis
     * @requires core/dom/selector
     * @requires core/dom/attribute
     * @requires core/dom/modification
     * @requires core/dom/animation
     * @requires core/event/drag
     * @requires libs/template
     * @requires libs/emitter
     * @requires ui/
     */
    'use strict';

    var Mask = require('../mask/');
    var Window = require('../window/');
    var dato = require('../../utils/dato.js');
    var typeis = require('../../utils/typeis.js');
    var allocation = require('../../utils/allocation.js');
    var controller = require('../../utils/controller.js');
    var selector = require('../../core/dom/selector.js');
    var attribute = require('../../core/dom/attribute.js');
    var modification = require('../../core/dom/modification.js');
    var animation = require('../../core/dom/animation.js');
    var event = require('../../core/event/drag.js');
    require('../../core/event/touch.js');
    var Template = require('../../libs/template.js');
    var Emitter = require('../../libs/emitter.js');
    var template = require('./template.html', 'html');
    var style = require('./style.css', 'css');
    var tpl = new Template(template);
    var ui = require('../');
    var $body = document.body;
    var win = window;
    var alienIndex = 0;
    var alienClass = 'alien-ui-dialog';
    var defaults = {
        width: 600,
        height: 'auto',
        left: 'center',
        top: 'center',
        title: '无标题对话框',
        template: '',
        addClass: '',
        duration: 234,
        easing: {
            open: 'ease-out-back',
            resize: 'ease-out-back',
            close: 'ease-in-back'
        },
        canDrag: true,
        modal: true,
        hideClose: false,
        // 远程地址
        remote: null,
        // iframe 高度
        remoteHeight: 400,
        // 默认自动分配
        zIndex: null
    };
    var Dialog = ui.create({
        constructor: function ($content, options) {
            var the = this;
            var args = allocation.args(arguments);

            // new Dailog(null, options);
            // new Dailog(options);
            // new Dailog();
            if (args.length === 0 || typeis.null(args[0]) || typeis.object(args[0])) {
                options = args[args.length - 1];
                $content = null;
            }

            options = the._options = dato.extend(true, {}, defaults, options);

            if (!$content) {
                $content = modification.create('div', {
                    id: alienClass + '-content-' + alienIndex
                });
                modification.insert($content, $body);
            }

            the._$content = selector.query($content)[0];
            the.destroyed = false;
            the.className = 'dialog';

            if (options.modal) {
                the._mask = new Mask(win, {
                    addClass: alienClass + '-bg ' + options.addClass,
                    zIndex: options.zIndex
                });
                the._$mask = the._mask.getNode();
            }

            the._window = new Window(null, {
                parentNode: options.modal ? the._$mask : $body,
                width: options.width,
                height: options.height,
                left: options.left,
                top: options.top,
                duration: options.duration,
                easing: options.easing,
                zIndex: options.zIndex
            });
            the._id = alienIndex++;
            the._$window = the._window.getNode();
            the._initNode();
            the._initEvent();

            if (options.template) {
                the._$content.innerHTML = options.template;
            }

            the._isReady = false;
            return the;
        },


        /**
         * 初始化节点
         * @private
         */
        _initNode: function () {
            var the = this;
            var options = the._options;
            var html = tpl.render({
                id: the._id,
                windowId: the._$window.id,
                title: options.title,
                canDrag: options.canDrag,
                hideClose: options.hideClose
            });
            var node = modification.parse(html)[0];
            var nodes = selector.query('.j-flag', node);
            var $pos = modification.create('#comment', alienClass + '-' + the._id);

            the._$dialog = node;
            the._$header = nodes[0];
            the._$title = nodes[1];
            the._$close = nodes[2];
            the._$body = nodes[3];

            modification.insert(the._$dialog, the._$window);
            modification.insert($pos, the._$content, 'afterend');
            the._$pos = $pos;
            modification.insert(the._$content, the._$body);
        },


        /**
         * 获得对话框节点
         * @returns {*|node}
         */
        getNode: function () {
            return this._$dialog;
        },


        /**
         * 初始化事件
         * @private
         */
        _initEvent: function () {
            var the = this;

            if (the._mask) {
                // esc
                the._mask.on('esc', function () {
                    /**
                     * 按 ESC 之后
                     * @event esc
                     */
                    if (the.emit('esc') !== false && the._isReady) {
                        the.shake();
                    }
                });

                // 单击背景
                the._mask.on('hit', function () {
                    /**
                     * 单击背景之后
                     * @event hitbg
                     */
                    if (the.emit('hitbg') !== false && the._isReady) {
                        the.shake();
                    }
                });
            }

            // 对话框打开
            the._window.on('open', function () {
                the._isReady = true;
            }).on('close', function () {
                the._isReady = false;
            });

            // 点击关闭
            event.on(the._$close, 'click', function () {
                the.close();
            });

            // window 对象事件传递到 dialog
            Emitter.pipe(the._window, the);
        },


        /**
         * 设置对话框标题
         * @param title {String} 对话框标题
         */
        setTitle: function (title) {
            var the = this;

            the._$title.innerHTML = title;

            return the;
        },


        /**
         * 设置对话框内容
         * @param html {String} 对话框内容
         */
        setContent: function (html) {
            var the = this;

            the._$body.innerHTML = html;
            the.resize();

            return the;
        },


        /**
         * 对话框添加远程地址，并重新定位
         * @param url {String} 远程地址
         * @returns {Dialog}
         */
        setRemote: function (url) {
            var the = this;

            if (url === the._lastRemote) {
                return the;
            }

            var options = the._options;
            var $iframe = modification.create('iframe', {
                src: url,
                'class': alienClass + '-iframe',
                style: {
                    height: options.remoteHeight
                }
            });

            the._lastRemote = url;
            the._$body.innerHTML = '';
            $iframe.onload = function () {
                $iframe.onload = null;
                options.remote = null;
                the.resize();
            };
            $iframe.onerror = function () {
                $iframe.onerror = null;
                the.resize();
            };
            modification.insert($iframe, the._$body);

            return the;
        },


        /**
         * 晃动对话框以示提醒
         */
        shake: function () {
            var the = this;

            the._window.shake();

            return the;
        },


        /**
         * 打开 dialog
         * @param [callback] {Function} 回调
         */
        open: function (callback) {
            var the = this;
            var options = the._options;

            if (the._mask) {
                the._mask.open();
            }

            if (options.remote) {
                the.setRemote(options.remote);
            }

            the._window.open(callback);

            return the;
        },


        /**
         * 改变 dialog 尺寸及位置
         * @param [size] {Object} 尺寸
         * @param [callback] {Function} 回调
         */
        resize: function (size, callback) {
            var the = this;

            the._window.resize(size, callback);

            return the;
        },


        /**
         * 改变 dialog 位置
         * @param [callback] {Function} 回调
         */
        position: function (callback) {
            var the = this;

            the._window.position(callback);

            return the;
        },


        /**
         * 关闭 dialog
         * @param [callback] {Function} 回调
         */
        close: function (callback) {
            var the = this;

            the._window.close(function () {
                if (the._mask) {
                    the._mask.close();
                }

                if (typeis.function(callback)) {
                    callback();
                }
            });

            return the;
        },


        /**
         * 销毁实例
         */
        destroy: function (callback) {
            var the = this;

            if (the.destroyed) {
                return;
            }

            the.destroyed = true;
            the._window.destroy(function () {
                modification.insert(the._$content, the._$pos, 'afterend');
                modification.remove(the._$pos);
                event.un(the._$close, 'click');
                event.un(the._$mask, 'click');
                modification.remove(the._$dialog);
                the._mask.destroy();

                if (typeis.function(callback)) {
                    callback();
                }
            });
        }
    });

    Dialog.defaults = defaults;
    module.exports = Dialog;
    ui.importStyle(style);
});