var $ = require('gulp-load-plugins')({ lazy: true });
// var _ = require('lodash');
var fs = require('fs');
var gulp = require('gulp');
var LessPluginCleanCSS = require('less-plugin-clean-css');
var merge = require('merge-stream');
var path = require('path');
var pngquant = require('imagemin-pngquant');
var spawn = require('child_process').spawn;
var del = require('del');
var config = require('./gulp.config')();
var templateCache = require('gulp-angular-templatecache');

var colors = $.util.colors;
var env = process.env.NODE_ENV || 'production';

gulp.task('build', ['watch'], function() {
	log('Building...');

	var msg = {
        title: 'Gulp Build',
        subtitle: 'Deployed to the build folder',
        message: 'You. are. awesome.'
    };

    log(msg);
    notify(msg);
});

gulp.task('vet', function() {
    log('Analyzing source with JSHint');

    return gulp
        .src(config.alljs)
        .pipe($.print())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', { verbose: true }))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('clean-copy', function(done) {
    clean('./dist/*.html', done);
});
gulp.task('copy', ['clean-copy'], function() {
	log('Copying files...');

	return gulp
		.src(['./src/app/index.html'])
		.pipe(gulp.dest('./dist/'));
});

gulp.task('bower', function() {
	return $.bower()
		.pipe(gulp.dest('./dist/lib/'));
});

gulp.task('clean-concat', function(done) {
    clean('./dist/public/app.js', done);
});
gulp.task('concat', ['clean-concat', 'templatecache'], function() {
	log('Concatinating files...');

	return gulp
		.src(config.jsOrder)
		// .pipe($.ngAnnotate())
		// .pipe($.uglify({
		// 	mangle: false
		// }))
		.pipe($.concat('app.js'))
		.pipe(gulp.dest('./dist/public'));
});

gulp.task('clean-images', function(done) {
    clean('./dist/assets/images', done);
});
gulp.task('images',['clean-images'], function() {
	log('Copying images...');

	return gulp
		.src('./src/assets/images/**.**')
		.pipe(gulp.dest('./dist/assets/images'));
});

gulp.task('clean-templatecache', function(done) {
    clean('./tmp/templates.js', done);
});
gulp.task('templatecache', ['clean-templatecache'], function() {
    log('Creating $templateCache...');

    return gulp
        .src([
        	'./src/app/**/*.tpl.html',
			'./src/components/**/*.tpl.html'
        ])
    	.pipe($.minifyHtml({ conditional: true, spare: true }))
        .pipe(templateCache('templates.js', { module: 'app.core' }))
        .pipe(gulp.dest('./tmp/'));
});

gulp.task('clean-less', function(done) {
    clean('./dist/public/*.css', done);
});
gulp.task('less', function() {
	log('Compiling less...');

	var main = gulp
		.src('./assets/less/main.less')
		.pipe($.less())
		.pipe($.autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('./dist/public'));

	var reset = gulp
		.src('./src/less/reset.less')
		.pipe($.less())
		.pipe($.autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('./dist/public'));

	return merge(main, reset);
});

gulp.task('watch', ['vet', 'all'], function() {
	gulp.watch('./gulpfile.js', ['reload']);

	gulp.watch([
		'./src/*.js',
		'./src/**/*.js',
		'./src/**/**.js',
		'./src/**/**/**/*.js'
	], ['concat'])
		.on('change', changeEvent);

	gulp.watch([
		'./assets/*.less',
		'./assets/**/*.less'
	], ['less'])
		.on('change', changeEvent);

	gulp.watch(['./src/app/index.html'], ['copy'])
		.on('change', changeEvent);

	gulp.watch([
		'./**/**/*.tpl.html',
		'./**/**/**/*.tpl.html'
	], ['templatecache', 'concat'])
		.on('change', changeEvent);
});

/**
 * Log a message or series of messages using chalk's green color.
 * Can pass in a string, object or array.
 */
function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.green(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.green(msg));
    }
}

/**
 * Show OS level notification using node-notifier
 */
function notify(options) {
    var notifier = require('node-notifier');
    var notifyOptions = {
        sound: 'Bottle',
        conseventImage: path.join(__dirname, 'gulp.png'),
        time: 5000,
        icon: path.join(__dirname, 'gulp.png')
    };
    // _.assign(notifyOptions, options);
    // notifier.notify(notifyOptions);
}

/**
 * When files change, log it
 * @param  {Object} event - event that fired
 */
function changeEvent(event) {
    // var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
    // log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

/**
 * Delete all files in a given path
 * @param  {Array}   path - array of paths to delete
 * @param  {Function} done - callback when complete
 */
function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done);
}

gulp.task('reload', ['bower', 'copy', 'images', 'concat', 'less']);
gulp.task('all', ['bower', 'copy', 'images', 'concat', 'less']);
gulp.task('default', ['build']);
