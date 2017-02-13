
'use strict';  
  
//引入 gulp 和 nodemon livereload 插件  
var gulp       = require('gulp');
var $ = require('gulp-load-plugins')();  
  
// 一些文件的路径  
var paths = {  
    client: [  
    'public/javascripts/**/*.js',  
    'public/stylesheets/**/*.css',     
    ],  
    server: {  
        index: 'app.js'  
    }  
};  
  
// nodemon 的配置  
var nodemonConfig = {  
    script: paths.server.index,
    ext: 'js jade',  
    ignore: [  
        "tmp/**",  
        "public/**",  
        "views/**"  
    ],  
    env: {  
        "NODE_ENV": "development"  
    }  
};  
  
// 使用 nodemone 跑起服务器  
gulp.task('serve', ['livereload'], function() {  
    return $.nodemon(nodemonConfig);  
});  
  
  
// 当客户端被监听的文件改变时，刷新浏览器  
gulp.task('livereload', function() {  
    $.livereload.listen();  
    var server = $.livereload;  
    return gulp.watch(paths.client, function(event) {  
        // server.changed(event.path); 
        server.changed(event.path); 
    });  
});  
  
// develop 任务， 同时开启 serve、livereload 任务  
gulp.task('develop', ['serve', 'livereload']); 


// Task
gulp.task('default', function() {
	// listen for changes
	$.livereload.listen();
	// configure nodemon
	$.nodemon({
		// the script to run the app
		script: 'app.js'
		, ext: 'js jade'
        , env: { 'NODE_ENV': 'development' }
	}).on('restart', function(){
		// when the app has restarted, run livereload.
		gulp.src('app.js')
			.pipe($.livereload());
			//.pipe($.notify('Reloading page, please wait...'));
	})
})
