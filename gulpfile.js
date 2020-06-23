const gulp = require('gulp');
gulp.tasks = require('@biotope/build');
var replace = require('gulp-string-replace');
var packageJSON = require('./package.json');
var version = packageJSON.version;
require('dotenv').config();

gulp.task('add-versioning', function () {
	return gulp
		.src(['./dist/**/*.html'])
		.pipe(replace('.html"', `.html?${version}"`, { searchValue: 'string' }))
		.pipe(replace('.js"', `.js?${version}"`, { searchValue: 'string' }))
		.pipe(replace('.css"', `.css?${version}"`, { searchValue: 'string' }))
		.pipe(gulp.dest('./dist'));
});
