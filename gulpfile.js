/* eslint-disable no-var */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable prefer-template */

var gulp          = require('gulp');
var gutil         = require('gulp-util');
var notifier      = require('node-notifier');
var browserSync   = require('browser-sync');
var webpack       = require('webpack');
var eslint        = require('gulp-eslint');
var filter        = require('gulp-filter');
var rename        = require('gulp-rename');
var shell         = require('gulp-shell');
var runSequence   = require('run-sequence');
var assign        = require('lodash.assign');

var sharedWebpackConfig = {
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /dist|public|node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react', 'stage-2']
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  watch: false
};

var libWebpackConfig = assign({}, sharedWebpackConfig, {
  entry: './src/index.js',
  output: {
    path: './lib',
    filename: 'react-brickwork.js',
    library: 'reactBrickwork',
    libraryTarget: 'umd'
  },
  externals: {
    'react': 'react',
    'react-dom': 'react-dom',
    'react-addons-transition-group': 'react-addons-transition-group',
    'react-motion': 'react-motion',
    'enquire.js': 'enquire.js',
    'lodash.isequal': 'lodash.isequal',
    'lodash.partition': 'lodash.partition'
  }
});

var demoWebpackConfig = assign({}, sharedWebpackConfig, {
  entry: './demo/src/main.js',
  output: {
    path: './demo/public',
    filename: 'demo.js'
  }
});

// var devCompiler = webpack([
//   assign({}, libWebpackConfig, { devtool: 'inline-source-map' }),
//   assign({}, demoWebpackConfig, { devtool: 'inline-source-map' })
// ]);

var devCompiler = webpack([libWebpackConfig, demoWebpackConfig]);

gulp.task('webpack', function(done) {
  var firstTime = true;

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

    if (jsonStats.assets[0].name === 'demo.js') {
      browserSync.reload();

      if (firstTime) {
        firstTime = false;
        done();
      }
    }
  });
});

gulp.task('browser-sync', ['webpack', 'demo-html-css'], function() {
  browserSync({
    notify: false,
    server: {
      baseDir: 'demo/public'
    }
  });
});

gulp.task('demo-html-css', function() {
  var sliderCssFilter = filter('node_modules/rc-slider/assets/index.css',
                               { restore: true });

  return gulp.src(['demo/src/*.@(html|css)',
    'node_modules/rc-slider/assets/index.css'])
    .pipe(sliderCssFilter)
    .pipe(rename('rc-slider.css'))
    .pipe(sliderCssFilter.restore)
    .pipe(gulp.dest('demo/public'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('watch', function() {
  gulp.watch('src/js/**/*', function(e) {
    gutil.log(gutil.colors.magenta(
      e.path.substring(e.path.lastIndexOf('/') + 1)) + ' ' +
      gutil.colors.cyan(e.type + '...'));
  });

  gulp.watch('demo/src/*.@(html|css)', ['demo-html-css']);
});

gulp.task('gh-pages-start', shell.task([
  'git stash',
  'git checkout gh-pages'
]));

gulp.task('gh-pages-middle', function() {
  return gulp.src('./demo/public/**/*')
    .pipe(gulp.dest('./'));
});

gulp.task('gh-pages-end', shell.task([
  'git add index.html demo.js *.css',
  'git commit --amend --no-edit',
  'git push origin gh-pages --force',
  'git checkout master',
  'git stash apply'
]));

gulp.task('gh-pages', function(done) {
  runSequence('gh-pages-start', 'gh-pages-middle', 'gh-pages-end', done);
});

gulp.task('lint', function() {
  return gulp.src(['src/**/*.js*(x)', 'demo/src/**/*.js*(x)'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('default', ['browser-sync', 'watch']);
