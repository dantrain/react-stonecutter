/* eslint-disable no-var */

var gulp          = require('gulp');
var browserSync   = require('browser-sync');
var webpack       = require('webpack');
var webpackStream = require('webpack-stream');

var webpackConfig = {
  entry: './src/js/main.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [
        {
          test: /\.jsx?$/,
          exclude: /dist|public|node_modules/,
          loader: 'babel',
          query: {
            presets: ['es2015', 'react', 'stage-2']
          }
        },
        {
          test: /\.json$/,
          loader: 'json'
        }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  watch: false,
  devtool: 'inline-source-map'
};

gulp.task('webpack', function() {
  return gulp.src('src/js/main.js')
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest('public'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('browser-sync', ['webpack'], function() {
  browserSync({
    notify: false,
    server: {
      baseDir: 'public'
    }
  });
});

gulp.task('watch', function() {
  gulp.watch('src/js/**/*', ['webpack']);
});

gulp.task('default', ['browser-sync', 'watch']);
