var gulp = require('gulp');
var scss = require('gulp-sass');
var removeEmptyLines = require('gulp-remove-empty-lines');
var nodemon = require('gulp-nodemon');
//var browserSync = require('browser-sync');
var imagemin = require('gulp-imagemin');
var del = require('del');
var include = require('gulp-html-tag-include');

// 소스 파일 경로
var PATH = {
	HTML: './workspace',
	IMAGES: './workspace/**/statics/images',
	STYLE: './workspace/**/statics/css',
	SCRIPT: './workspace/**/statics/js',
	FONTS: './workspace/fonts'
};
var DEST_PATH = {
	HTML: './preview',
	IMAGES: './preview/**/statics/images' ,
	STYLE: './preview/**/statics/css',
	SCRIPT: './preview/**/statics/js',
	FONTS: './preview/fonts'
};
var PROJECT_PATH = './moonbanggu';
// 산출물 경로

function logError (error) {
	console.log(error)
}
gulp.task( 'scss:compile', () => {
	return new Promise( resolve => {
		var scssOptions = {
			outputStyle: "compact",  // nested, expanded, compact, compressed
			indentType: "space", // space, tab
			linefeed : 'cr',
			indentWidth: 4,
			precision: 5,
			sourceComments: false // 코멘트 제거 여부
		};
		gulp.src([
			PATH.STYLE + '/*.scss',
			PATH.STYLE + '/*.css'
		])
		.pipe(scss(scssOptions).on('error', scss.logError))
		.pipe(removeEmptyLines({ removeComments: true }))
		.pipe( gulp.dest( DEST_PATH.HTML ) )
		//.pipe( browserSync.reload({stream: true}) );
		resolve();
	});
});

gulp.task( 'html', () => {
	return new Promise( resolve => {
		gulp.src([
			PATH.HTML + '/*.html',
			PATH.HTML + '/**/html',
			PATH.HTML + '/**/html/**'
		])
		.pipe( include() )
		.on('error',logError)
		//.pipe( browserSync.reload({stream: true}) )
		.pipe( gulp.dest([DEST_PATH.HTML]) );
		resolve();
	});
});
gulp.task( 'script:build', () => {
	return new Promise( resolve => {
		gulp.src( PATH.SCRIPT + '/*.js' )
			.pipe( gulp.dest(DEST_PATH.HTML) )
			//.pipe( browserSync.reload({stream: true}) );
		resolve();
	})
});
gulp.task( 'images', () => {
	return new Promise( resolve => {
		gulp.src([ PATH.IMAGES + '/*.*', PATH.IMAGES + '/**/*.*' ])
		.pipe( imagemin() )
		.pipe( gulp.dest(DEST_PATH.HTML));

		resolve();
	});
});
gulp.task( 'fonts', () => {
	return new Promise( resolve => {
		gulp.src(PATH.FONTS + '/*.*')
			.pipe( gulp.dest(DEST_PATH.FONTS) );
			resolve();
	});
});
gulp.task( 'guide', () => {
	return new Promise( resolve => {
		gulp.src(PATH.HTML + '/guide/*.*')
			.pipe( gulp.dest(DEST_PATH.HTML + '/guide') )
			//.pipe( browserSync.reload({stream: true}) );
			resolve();
	});
});
gulp.task( 'nodemon:start', () => {
	return new Promise( resolve => {
		nodemon({
			//script: 'app.js' ,
			watch: DEST_PATH.HTML
		});

		resolve();
	});
});
gulp.task('clean', function(){
	return del(DEST_PATH.HTML);
});
gulp.task('watch', () => {
	return new Promise( resolve => {
		gulp.watch([PATH.HTML + '/*.html', PATH.HTML + '/**/html/*.*', PATH.HTML + '/**/html/**', PATH.HTML + '/**/include/*.html'], gulp.series(['html']));
		gulp.watch(PATH.FONTS, gulp.series(['fonts']));
		gulp.watch([PATH.IMAGES + '/*.*', PATH.IMAGES + '/**/*.*'], gulp.series(['images']));
		gulp.watch([PATH.STYLE + "/*.css", PATH.STYLE + "/*.scss"], gulp.series(['scss:compile']));
		gulp.watch(PATH.SCRIPT + "/*.js", gulp.series(['script:build']));
		gulp.watch(PATH.HTML + "/guide/*.*", gulp.series(['guide']));

		resolve();
	});
});
/*
gulp.task('browserSync', () => {
	return new Promise( resolve => {
		browserSync.init( null, {
			proxy: 'http://localhost:3005',
			port: 3006
		});
		resolve();
	});
});
*/
gulp.task('build:clean', function(){
	return del([
		PROJECT_PATH + '/**',
		!PROJECT_PATH + '/.git'
	]);
});
gulp.task('build:copy', () => {
	return new Promise( resolve => {
		gulp.src([
			DEST_PATH.HTML + '/index.html',
			DEST_PATH.HTML + '/**/guide/*.*',
			DEST_PATH.HTML + '/**',
			DEST_PATH.HTML + '/**/statics/**',
			'!./preview/**/statics/css/*.*',
			'./preview/**/statics/css/layout-mo.css',
			'./preview/**/statics/css/layout-pc.css',
		])
		.pipe( gulp.dest([PROJECT_PATH]) )
		resolve();
	});
});

var allSeries =  gulp.series([
	'clean',
	'fonts',
	'html',
	'scss:compile',
	'script:build',
	'images',
	'guide',
	'nodemon:start',
	'watch'
]);

var allSeries2 =  gulp.series([
	'build:clean',
	'build:copy'
]);

gulp.task('start', allSeries);
gulp.task('build', allSeries2);

