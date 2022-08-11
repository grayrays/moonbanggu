const path = require('path'); 
const gulp = require('gulp');
const dartSass = require('dart-sass'); //node-sass 속도 이슈로 변경
const scss = require('gulp-sass')(require('sass'));
const Fiber = require('fibers'); // dart-sass, gulp-sass와 세트 plugin
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer'); //브라우저 버전 설정
const postCss = require('gulp-postcss'); //브라우저에 맞게 css 컴파일
const removeEmptyLines = require('gulp-remove-empty-lines'); //빈줄 제거
const nodemon = require('gulp-nodemon'); //코드 변경할 때 로컬 서버 자동 재시작
const browserSync = require('browser-sync'); //브라우저 자동 동기화
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const del = require('del');
const include = require('gulp-html-tag-include');
const dependents = require('gulp-dependents'); //gulp-cached와 함께 사용. incremental builds
const cached = require('gulp-cached'); //변경된 파일만 통과
const plumber  = require('gulp-plumber'); //error handler
const apfBrwsowsers = [
  'ie > 0', 'chrome > 0', 'firefox > 0'  // 브라우저의 모든 버전 적용
  //'last 2 versions'                    // 최신 브라우저 기준 하위 2개의 버전까지 적용
];

// 소스 파일 경로
const PATH = {
	HTML: './workspace',
	IMAGES: './workspace/**/statics/images',
	STYLE: './workspace/**/statics/css',
	SCRIPT: './workspace/**/statics/js',
	FONTS: './workspace/fonts'
},
DEST_PATH = {
	HTML: './dist',
	IMAGES: './dist/**/statics/images' ,
	STYLE: './dist/**/statics/css',
	SCRIPT: './dist/**/statics/js',
	FONTS: './dist/fonts'
};

const onErrorHandler = (error) => console.log(error);

gulp.task('scss:compile', () => {
	return new Promise(resolve => {
		var scssOptions = {
      scss: {
        outputStyle: 'compressed', //nested(default), expanded, compact, compressed
        indentType: 'space', //space, tab
        indentWidth: 2,
        precision: 8,
        sourceComments: true,
        compiler: dartSass,
        fiber: Fiber
      },
      postcss: [autoprefixer({
        overrideBrowserslist: apfBrwsowsers,
      })]
		};
		gulp.src(
			[PATH.STYLE + '/*.scss', PATH.STYLE + '/*.css'],
			{since: gulp.lastRun('scss:compile')}
		)
		.pipe(plumber({errorHandler:onErrorHandler}))
		.pipe(dependents())
		.pipe(sourcemaps.init())
		.pipe(scss(scssOptions.scss).on('error', scss.logError))
		.pipe(postCss(scssOptions.postcss))
		.pipe(sourcemaps.write())
		.pipe(removeEmptyLines({removeComments: true}))
		.pipe(gulp.dest(DEST_PATH.HTML))
		.pipe(browserSync.reload({stream: true}));
		resolve();
	});
});

gulp.task('html', () => {
	return new Promise(resolve => {
		gulp.src([
			PATH.HTML + '/*.html',
			PATH.HTML + '/**/html',
			PATH.HTML + '/**/html/**'
		])
		.pipe(plumber({errorHandler:onErrorHandler}))
		.pipe(include())
		.pipe(cached('html'))
		.pipe(dependents())
		.pipe(browserSync.reload({stream: true}))
		.pipe(gulp.dest([DEST_PATH.HTML]));
		resolve();
	});
});
gulp.task('script:build', () => {
	return new Promise(resolve => {
		gulp.src(PATH.SCRIPT + '/*.js')
			.pipe(plumber({errorHandler:onErrorHandler}))
			.pipe(gulp.dest(DEST_PATH.HTML))
      .pipe(uglify({
        mangle: true
      }))
			.pipe(gulp.dest(DEST_PATH.HTML))
			.pipe(browserSync.reload({stream: true}));
		resolve();
	})
});
gulp.task('images', () => {
	return new Promise(resolve => {
		gulp.src([PATH.IMAGES + '/*.*', PATH.IMAGES + '/**/*.*'])
		.pipe(imagemin([
			imagemin.gifsicle({interlaced: false}),
			imagemin.mozjpeg({progressive: true}),
			imagemin.optipng({optimizationLevel: 5}),
			imagemin.svgo({
				plugins: [
					{removeViewBox: true},
					{cleanupIDs: false}
				]
			})
		]))
		.pipe(browserSync.reload({stream: true}))
		.pipe(gulp.dest(DEST_PATH.HTML));
		resolve();
	});
});
gulp.task('fonts', () => {
	return new Promise(resolve => {
		gulp.src(PATH.FONTS + '/*.*')
			.pipe(gulp.dest(DEST_PATH.FONTS));
			resolve();
	});
});
gulp.task('guide', () => {
	return new Promise(resolve => {
		gulp.src(PATH.HTML + '/guide/*.*')
			.pipe(gulp.dest(DEST_PATH.HTML + '/guide'));
			resolve();
	});
});
gulp.task( 'nodemon:start', () => {
	return new Promise(resolve => {
		nodemon({
      script: 'app.js',
      watch: 'app'
		});
		resolve();
	});
});

gulp.task('watch', () => {
	return new Promise(resolve => {
    const html_watcher = gulp.watch([
			PATH.HTML + '/*.html',
			PATH.HTML + '/**/html/*.html',
			PATH.HTML + '/**/html/**/*.html',
			PATH.HTML + '/**/include/*.html'
		], gulp.series(['html']));
    const scss_watcher = gulp.watch([
			PATH.STYLE + "/*.css",
			PATH.STYLE + "/*.scss"
		], gulp.series(['scss:compile']));
		file_management(html_watcher, PATH.HTML, DEST_PATH.HTML);
    file_management(scss_watcher, PATH.STYLE, DEST_PATH.STYLE); 
		gulp.watch(PATH.FONTS, gulp.series(['fonts']));
		gulp.watch([PATH.IMAGES + '/*.*', PATH.IMAGES + '/**/*.*'], gulp.series(['images']));
		gulp.watch(PATH.SCRIPT + "/*.js", gulp.series(['script:build']));
		gulp.watch(PATH.HTML + "/guide/*.*", gulp.series(['guide']));
		resolve();
	});
});

const file_management = (watcher_target, src_path, dist_path) => {
  watcher_target.on('unlink', (filepath) => {
    const filePathFromSrc = path.relative(path.resolve(src_path), filepath);
    const extension_type = filePathFromSrc.split('.')[filePathFromSrc.split('.').length - 1];
    // scss 삭제 (min파일까지 생성했을 때)
    if (extension_type === 'scss'){
      const destFilePath_css = path.resolve(dist_path, filePathFromSrc).replace('scss','css');
      del.sync(destFilePath_css);
      const destFilePath_minCss = path.resolve(dist_path, filePathFromSrc).replace('scss','min.css');
      del.sync(destFilePath_minCss);
		}
    // scss 외 파일 삭제
    else {
      const destFilePath = path.resolve(dist_path, filePathFromSrc);
      del.sync(destFilePath);
    }
  });
}

gulp.task('clean', () => {
  return new Promise(resolve => {
    del.sync(DEST_PATH.HTML, {force:true});
    resolve();
  });
});

gulp.task('browserSync', () => {
	return new Promise( resolve => {
		browserSync.init( null, {
			proxy: 'http://localhost:3000',
			port: 3001
		});
		resolve();
	});
});

gulp.task('start',
  gulp.series([
    'clean',
		'fonts',
    'html',
    'scss:compile',
    'script:build',
		'images',
		'guide',
    'nodemon:start',
    'browserSync',
    'watch'
  ])
);

