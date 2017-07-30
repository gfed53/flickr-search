var gulp = require('gulp');

var jshint = require('gulp-jshint');
var babel = require('gulp-babel');
var strip = require('gulp-strip-comments');
var uglify = require('gulp-uglify');
var ngmin = require('gulp-ngmin');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var usemin = require('gulp-usemin');
var del = require('del');
var runSequence = require('run-sequence');

var paths = {
	scripts: 'src/**/*.js',
	styles: './src/styles',
	index: './src/index.html',
	lib: './src/lib/**/*',
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
	return gulp.watch(paths.scripts, ['jshint']);
});

// Build Dist
gulp.task('del', function(){
	return del(paths.dist);
});

gulp.task('copy', function(){
	return gulp.src(paths.lib)
	.pipe(gulp.dest(paths.dist+'lib'));
});

gulp.task('usemin', function(){
	return gulp.src( paths.index )
	.pipe(usemin({
		css: [ minifyCss(), 'concat' ],
		js: [ strip(), babel({presets: ['es2015']}), ngmin(), uglify() ]
	}))
	.pipe(gulp.dest( paths.dist ));
});

// gulp.task('build', ['usemin']);

gulp.task('build', function(){
	runSequence(
		'del',
		'copy',
		'usemin'
		);
});



// Default Task
gulp.task('default', ['jshint', 'watch']);



