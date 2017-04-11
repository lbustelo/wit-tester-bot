var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var nodemonOptions = {
  script: 'robot.js',
  ext: 'js yaml',
  env: {
    'NODE_ENV': 'development'
  }
};

gulp.task('dev', function() {
  nodemon(nodemonOptions);
});
