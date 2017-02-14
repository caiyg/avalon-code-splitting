/**
 * Created by WangMing on 15/12/9.
 */
var gulp=require('gulp');
var webpack = require('webpack');
var del=require('del');
var minifycss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var webpackconfig = require('./webpack.config');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');
var gulpif = require('gulp-if');
var po2json = require('gulp-po2json');
var gettext = require("gulp-gettext-parser");
/**
 *  清理生产目录文件
 */
gulp.task('clean', function(cb) {
  del(['./dist/*.js','./dist/*.css','./dist/*.map']).then(paths => {
    console.log('删除文件和文件夹成功\n', paths.join('\n'));
    cb();
  });
});

/**
 *  执行webpack打包
 */
gulp.task('webpack',['clean'], function(cb) {
  webpack(webpackconfig, cb)
});

/**
 *  压缩css文件
 */
gulp.task('style',function() {
  gulp.src('./dist/style.css')
    .pipe(rename({suffix:'.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist'));
});

/**
 *  压缩js文件
 */
gulp.task('script',function(){
  gulp.src('./dist/*.js')
    .pipe(rename({suffix:'.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['webpack'], function() {
  gulp.start('style','script')
});



 
gulp.task('po2json', function () {
    return gulp.src(['src/translations/**/*.po'])
        .pipe(po2json({ format: 'jed1.x', pretty:true,stringify: true })) //format: 'jed1.x',
        .pipe(gulp.dest('src/translations/'));
});

gulp.task('tr',function(){
  runSequence("gettext", "po2json");
});

 
gulp.task("gettext", function() {
    return gulp.src("src/**/*.js")
        .pipe(gettext())
        .pipe(rename("en.po"))
        .pipe(gulp.dest("src/translations/"));
});




gulp.task('images',function(){
   return gulp.src('./src/images/**/*')
        .pipe(changed('./assets/images'))
        .pipe(gulp.dest('./assets/images'));
});


var sprity = require('sprity');
gulp.task('sprites',function(){
    runSequence('sprity','images');
})
gulp.task('sprity', function(){
    return sprity.src({
                    src:'./src/assets/css/images/sprites/*.png',
                  name: 'sprites',
                  style: 'sprites.less',
                  prefix: 'ico',
                  margin: 3,
                  // 'dimension': [{
                  //     ratio: 1, dpi: 72
                  //   }, {
                  //     ratio: 2, dpi: 192
                  //   }],
                  cssPath: '../images',
                  processor: 'less'
                })
                 .pipe(gulpif('*.png',gulp.dest('./src/assets/css/images/'), gulp.dest('./src/assets/css/yeast/')))
})
// generate less with base64 encoded images
gulp.task('base64', function () {
return gulp.src('./src/assets/css/images/sprites/*.png')
 .pipe(sprite({
   base64: true,
   style: 'sprites_base64.less',
   prefix: 'ico',
   processor: 'less'
 }))
 .pipe(gulp.dest('./src/assets/css/yeast/'));
});