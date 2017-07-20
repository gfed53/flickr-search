var gulp = require('gulp');

var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var ngmin = require('gulp-ngmin');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var usemin = require('gulp-usemin');
var del = require('del');

var paths = {
	scripts: 'src/**/*.js',
	styles: './src/styles',
	index: './src/index.html',
	dist: './dist/'
};

// JavaScript linting
gulp.task('jshint', function(){
	return gulp.src(paths.scripts)
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});

// Watch
gulp.task('watch', function(){
	gulp.watch(paths.scripts, ['jshint']);
});

// Build Dist
gulp.task('del', function(){
	del(paths.dist);
});

gulp.task('usemin', [ 'del' ], function(){
	gulp.src( paths.index )
	.pipe(usemin({
		css: [ minifyCss(), 'concat' ],
		js: [ ngmin(), uglify() ]
	}))
	.pipe(gulp.dest( paths.dist ));
});

gulp.task('build', ['usemin']);

// Default Task
gulp.task('default', ['jshint', 'watch']);



