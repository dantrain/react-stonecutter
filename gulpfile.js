/* eslint-disable no-var */

var gulp          = require('gulp');
var gutil         = require('gulp-util');
var notifier      = require('node-notifier');
var browserSync   = require('browser-sync');
var webpack       = require('webpack');
var assign        = require('lodash.assign');

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

var devCompiler = webpack(assign({}, webpackConfig, {
  devtool: 'inline-source-map'
}));

gulp.task('webpack', function() {
  devCompiler.watch({
    aggregateTimeout: 100
  }, function(err, stats) {
    if (err) {
      notifier.notify({ title: 'Webpack Error', message: err });
      throw new gutil.PluginError('webpack', err);
    }

    var jsonStats = stats.toJson();

    if (jsonStats.errors.length > 0) {
      notifier.notify({ title: 'Webpack Error', message: jsonStats.errors[0] });
    } else if (jsonStats.warnings.length > 0) {
      notifier.notify({ title: 'Webpack Warning', message: jsonStats.warnings[0] });
    }

    gutil.log(gutil.colors.cyan('[webpack]'), stats.toString({
      chunks: false,
      version: false,
      colors: true
    }));
    browserSync.reload();
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
  gulp.watch('src/js/**/*', function(e) {
    gutil.log(gutil.colors.magenta(
      e.path.substring(e.path.lastIndexOf('/') + 1)) + ' ' +
      gutil.colors.cyan(e.type + '...'));
  });
});

gulp.task('default', ['browser-sync', 'watch']);
