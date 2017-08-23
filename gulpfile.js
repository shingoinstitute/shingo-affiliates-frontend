'use strict';
const gulp = require('gulp');
const gulp_tslint = require('gulp-tslint');

gulp.task('tslint', () => {
  gulp.src(['src/**/*.ts'])
    .pipe(gulp_tslint({
      formatter: "prose"
    }))
    .pipe(gulp_tslint.report({
      emitError: false
    }));
});

gulp.task('default', ["tslint"]);