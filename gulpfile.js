const gulp = require('gulp');
const minifyScript = require('gulp-uglify');
const minifyCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const server = require('gulp-webserver');
const connectServer = require('gulp-connect');
const proxy = require('http-proxy-middleware');
const minifyImage = require('gulp-image');


//创建一个任务 .语法规则
//gulp-task('taskname',callback(回调函数))
//压缩js
gulp.task('script', () => {
    console.log('this is script');
    gulp.src(['./src/js/*.js'])
        .pipe(minifyScript())
        .pipe(gulp.dest('build/js'))
})


//压缩css
gulp.task('css', () => {
    console.log('this is css');
    gulp.src(['./src/css/*.css'])
        .pipe(minifyCss())
        .pipe(gulp.dest('build/css'))
})

//修改文件名
gulp.task('renameFile', () => {
    console.log('this is renameFile');
    gulp.src('./index.html') //获取目录
        .pipe(rename('main.html')) //修改文件名字main 拓展名
        .pipe(gulp.dest('build')) //输出到build文件夹下
})


//压缩图片
gulp.task('image', () => {
    console.log('this is image');
    gulp.src('./src/image/*.png')
        .pipe(minifyImage())
        .pipe(gulp.dest('build/image'))
})


//开启服务
gulp.task('webserver', () => {
    gulp.src('.')
        .pipe(server({
            port: 3000,
            middleware: (req, res) => {
                if (req.url === '/api') {
                    const result = JSON.stringify([1, 2, 3, 4, 5, 6])
                    res.end(result)
                }
            }
        }))
})

// 8080的代理会访问3000下的

//通过同源策略
gulp.task('serverClient', () => {
    connectServer.server({
        name: 'connect server',
        root: ['.'], //默认项目的根路径  可以是数组或者字符串
        port: 8080, //服务端口        跨域
        livereload: true,
        fallback: './index.html', //默认打开的文件
        middleware: (app) => { //定义接口的方法的回调
            return [
                //代里服务器proxy
                proxy('/api', {
                    target: 'http://localhost:3000',
                    changeOrigin: true
                })
            ]
        }
    })
})

// 文件监听
gulp.task('default', ['webserver', 'serverClient', 'css', 'script', 'renameFile', 'image'], () => {
    //监听文件改变，自动编译
    gulp.watch('./css/*.css', ['css']);
});