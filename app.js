var path = require('path');
var fs = require( 'fs' );
var koa = require('koa');
var app =new koa();
var logger = require('koa-logger');
var bodyparser = require('koa-bodyparser');
var staticCache  = require('koa-static-cache');

const convert = require('koa-convert');
const static = require('koa-static');

var flash = require('koa-flash');
var gzip = require('koa-gzip');
var scheme = require('koa-scheme');

var session = require('koa-generic-session');
var redisStore = require('koa-redis');

var router = require('koa-frouter');
var routerCache = require('koa-router-cache');
var MemoryCache = routerCache.MemoryCache;


var render = require('co-ejs');

app.use(convert(static(
  path.join( __dirname,  './assets')
)));


app.keys = ['keys', 'keykeys'];
app.use(session({
  store: redisStore({})
}));
app.use(flash());


app.use(scheme(path.join(__dirname, './config/default.scheme')));
app.use(routerCache(app, {
        'GET /': {
            key: 'cache:index',
            expire: 10 * 1000,
            get: MemoryCache.get,
            set: MemoryCache.set,
            destroy: MemoryCache.destroy,
            passthrough: function* passthrough(_cache) {
                // 游客
                if (!this.session || !this.session.user) {
                    if (_cache == null) {
                        return {
                            shouldCache: true,
                            shouldPass: true
                        };
                    }
                    this.type = 'text/html; charset=utf-8';
                    this.set('content-encoding', 'gzip');
                    this.body = _cache;
                    return {
                        shouldCache: true,
                        shouldPass: false
                    };
                }
                // 已登录用户
                return {
                    shouldCache: false,
                    shouldPass: true
                };
            }
        }
    	}
        ));
app.use(gzip());




app.use(logger());

app.use(bodyparser());

app.use(router(app, {
  root: './routes'
}));

app.use(render(app, {
  root: path.join(__dirname, 'src'),
  layout: false,
  viewExt: 'ejs',
  cache: false,
  debug: false
}));

app.listen(3000);
