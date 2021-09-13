const { src, dest, task, series, watch } = require('gulp');
const rm = require('gulp-rm');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

sass.compiler = require('node-sass');

task('clean', () => {
	return src('dist/**/*', { read: false })
		.pipe(rm())
});

task('copy:fonts', () => {
	return src('src/fonts/*.*').pipe(dest('dist/fonts'));
})

task('copy:images', () => {
	return src('src/images/**/*.*').pipe(dest('dist/images'));
})

task('copy:html', () => {
	return src('src/*.html')
		.pipe(dest('dist'))
		.pipe(reload({ stream: true }))
});

task('styles', () => {
	return src('src/styles/style.sass')
		.pipe(sourcemaps.init())
		.pipe(concat('style.sass'))
		.pipe(sassGlob())
		.pipe(sass().on('erros', sass.logError))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 2 versions'],
			cascade: false
		}))
		.pipe(cleanCss())
		.pipe(sourcemaps.write())
		.pipe(dest('dist/styles'))
		.pipe(reload({ stream: true }))
});

task('server', () => {
	browserSync.init({
		server: {
			baseDir: "./dist"
		},
		open: false
	});
});

task('scripts', () => {
	return src('src/scripts/*.js')
		.pipe(sourcemaps.init())
		.pipe(concat('main.js'))
		.pipe(
			babel({
				presets: ['@babel/env']
			})
		)
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(dest('dist/scripts'))
		.pipe(reload({ stream: true }))
});

watch('./src/styles/**/*.sass', series('styles'));
watch('./src/*.html', series('copy:html'));
watch('./src/*.js', series('scripts'));

task('default', series('clean', 'copy:html', 'copy:fonts', 'copy:images', 'styles', 'scripts', 'server'));