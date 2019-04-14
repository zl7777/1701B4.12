const gulp = require('gulp');
const minifyScript = require('gulp-uglify');
const minifyCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const server = require('gulp-webserver');
// const connectServer = require('gulp-connect');
// const proxy = require('http-proxy-middleware');
const minifyImage = require('gulp-imagemin');
const jsbabel = require('gulp-babel');
const concat = require('gulp-concat');
const sass = require('gulp-sass');




//创建一个任务 .语法规则
//gulp-task('taskname',callback(回调函数))
//压缩js
// gulp.task('script', () => {
//     console.log('this is script');
//     gulp.src(['./src/js/*.js'])

//         .pipe(gulp.dest('build/js'))
// })


//开启服务
gulp.task('webserver', () => {
        return gulp.src('.')
            .pipe(server({
                port: 8686,
                livereload: true,
                open: true
            }))
    })
    //打包时候的命令

gulp.task('jsbabel', () => {
    console.log('this is jsbabel');
    return gulp.src('./src/js/*.js')
        .pipe(jsbabel({ //转译es6-es5
            presets: 'es2015'
        }))
        .pipe(minifyScript()) //压缩
        .pipe(concat('main.js')) //合并
        .pipe(gulp.dest('build/js'))
})

//压缩css 
gulp.task('css', () => {
    console.log('this is css');
    return gulp.src(['./src/css/*.css'])
        .pipe(minifyCss())
        .pipe(gulp.dest('build/css'))
})

//开发时候的命令
//编译sass
gulp.task('sass', () => {
    console.log('this is scss');
    return gulp.src('./src/css/sass/*.scss')
        .pipe(sass()) //编译sass
        .pipe(gulp.dest('build/css'))
})

//修改文件名
gulp.task('renameFile', () => {
    console.log('this is renameFile');
    return gulp.src('./index.html') //获取目录
        .pipe(rename('main.html')) //修改文件名字main 拓展名
        .pipe(gulp.dest('build')) //输出到build文件夹下
})


//压缩图片
gulp.task('image', () => {
    console.log('this is image');
    return gulp.src('./src/image/*.png')
        .pipe(minifyImage())
        .pipe(gulp.dest('build/image'))
})






// 文件监听变更
gulp.task('watch', () => {
    return gulp.watch('./src/css/sass/*.scss', gulp.series('sass', () => {
        gulp.series('webserver')
    }))
})


//开发---编译监听
gulp.task('dev', gulp.series('sass', 'webserver', 'watch'))

//打包----上线,压缩
gulp.task('build', gulp.parallel('jsbabel', 'sass'))