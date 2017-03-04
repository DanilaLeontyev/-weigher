"use-strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var csso = require("gulp-csso");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var size = require("gulp-size");
var server = require("browser-sync");
var clean = require("gulp-clean");
var mqpacker = require("css-mqpacker");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var svgmin = require("gulp-svgmin");
var svgstore = require("gulp-svgstore");
var run = require("gulp-sequence");
var del = require("del");
var uglifyjs = require("gulp-uglifyjs");

var path = {
	build: {
		html: 'build/',
		js: 'build/js/',
		style: 'build/style/',
		img: 'build/img/',
		fonts: 'build/fonts/'
  },
  src: {
		html: 'src/*.html',
		js: 'src/js/main.js',
		style: 'src/style/main.scss',
		img: 'src/img/**/*.{png,jpg,gif}',
		fonts: 'src/fonts/**/*.*',
		svgIcons: 'src/img/svg-icons/*.svg'
  },
  watch: {
		html: 'src/**/*.html',
		js: 'src/js/**/*.js',
		style: 'src/style/**/*.scss',
		img: 'src/img/**/*.{png,jpg,gif}',
		fonts: 'src/fonts/**/*.*',
		svgIcons: 'src/img/svg-icons/*.svg'
  },
	clean: './build'
};


/*
	Default task
*/


gulp.task("default", function(fn) {
	run("clean", "build", "watch", fn);
});



/*
	Build task
*/


gulp.task("build", function(fn) { //run для последовательного выполнения, иначе асинхронное
	run(
		"html:build",
		"js:build",
		"style:build",
		"fonts:build",
		"image:build",
		"svgIcons:build",
		fn);
});


/*
	Html task
*/


gulp.task("html:build", function() {
	gulp.src(path.src.html)
	.pipe(plumber())
	.pipe(gulp.dest(path.build.html))
	.pipe(server.reload({stream: true}));
});


/*
	Style task
*/


gulp.task("style:build", function() {
  gulp.src(path.src.style)
  .pipe(plumber())
	.pipe(sass())
	.pipe(postcss([
		autoprefixer({browsers: [
			"last 3 version",
			"last 2 Chrome version",
			"last 2 Opera version",
			"last 2 Firefox version",
			"last 2 Edge version"
		]}),
		mqpacker({
			sort: true
		})
	]))
	.pipe(gulp.dest(path.build.style))
	.pipe(csso())
	.pipe(rename("main.min.css"))
	.pipe(gulp.dest(path.build.style))
	.pipe(server.reload({stream: true}));
});


/*
	JS task
*/


gulp.task("js:build", function() {
	gulp.src(path.src.js)
	.pipe(plumber())
	.pipe(uglifyjs())
	.pipe(gulp.dest(path.build.js))
	.pipe(server.reload({stream: true}));
});


/*
	JS task
*/


gulp.task("fonts:build", function() {
	gulp.src(path.src.fonts)
	.pipe(gulp.dest(path.build.fonts));
});


/*
	Image task
*/


gulp.task("image:build", function() {
	gulp.src(path.src.img)
	.pipe(imagemin([
		imagemin.optipng({optimizationLever: 3}),
		imagemin.jpegtran({proggressive: true})
	]))

	.pipe(gulp.dest(path.build.img));
});


/*
	Icons-svg task
*/


gulp.task("svgIcons:build", function() {
	gulp.src(path.src.svgIcons)
	.pipe(svgmin())
	.pipe(svgstore({
		inlineSvg: true
	}))
	.pipe(rename("icons.svg"))
	.pipe(gulp.dest(path.build.img))
        .pipe(gulp.dest('src/img'));
});


/*
	Clear task
*/

gulp.task("clean", function(){
	return del(path.clean);
});


/*
	Watch task
*/


gulp.task("watch", function() {
	server.init({
		server: "build"
	});

	gulp.watch(path.watch.style, ["style:build"]);
	gulp.watch(path.watch.html, ["html:build"]);
	gulp.watch(path.watch.img, ["image:build"]);
	gulp.watch(path.watch.js, ["js:build"]);
	gulp.watch(path.watch.svgIcons, ["svgIcons:build"]);
});




