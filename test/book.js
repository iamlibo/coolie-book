/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-09-02 17:41
 */


'use strict';

var book = require('../webserver/utils/').book;
var path = require('ydr-utils').path;
var bookroot = path.join(__dirname, '../bookroot/');

book.getFiles(bookroot);

