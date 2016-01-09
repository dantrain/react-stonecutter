/* eslint-disable no-var */

var gulp          = require('gulp');
var gutil         = require('gulp-util');
var browserSync   = require('browser-sync');
var webpack       = require('webpack');
var _             = require('lodash');

var webpackConfig = {
  entry: './src/js/main.js',
  output: {
    path: './public',
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
  watch: false
};

var devCompiler = webpack(_.assign({}, webpackConfig, {
  devtool: 'inline-source-map'
}));

gulp.task('webpack', function(done) {
  devCompiler.run(function(err, stats) {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
      colors: true
    }));
    browserSync.reload();
    done();
  });
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
