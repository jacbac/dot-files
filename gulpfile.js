const gulp = require('gulp');
const gutil = require('gulp-util');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const size = require('gulp-size');
const exec = require('child_process').exec;
const del = require('del');
const changed = require('gulp-changed');
const env = require('gulp-environments');

// Webpack
const webpack = require('webpack')
const webpackStream = require('webpack-stream-fixed');

// BrowserSync
// @todo: good luck!

// Styles
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const reporter = require('postcss-reporter');

// Scripts
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

// Images
const jpegoptim = require('imagemin-jpegoptim');
const pngquant = require('imagemin-pngquant');
const optipng = require('imagemin-optipng');
const svgo = require('imagemin-svgo');

// Metrics
const parker = require('gulp-parker');

// Linters
const eslint = require('gulp-eslint');
const stylelint = require('stylelint');
const doiuse = require('doiuse');
const scss = require('postcss-scss');
const postcssImport = require('postcss-import');
const flexbugs = require('postcss-flexbugs-fixes');

/* ================================================================================================================== */
/* CONFIG HELPER
/* ================================================================================================================== */

const development = env.development;
const production = env.production;

const pkg = require('./package.json');

const path = {
    src: {
        backDir: 'app/Resources/assets/back/',
        frontDir: 'app/Resources/assets/front/',
        webpackDir: 'app/Resources/assets/front/scripts/',
        favicons: 'favicons/**/*.*',
        fonts: 'fonts/**/*.*',
        images: 'images/**/*.{png,jpg,jpeg,gif,svg}',
        scripts: 'scripts/**/*.*',
        scriptsVendors: 'scripts/vendors/**.*',
        scriptsPartials: 'scripts/partials/*.*',
        styles: 'styles/**/*.*'
    },
    dist: {
        backDir: 'web/back/',
        frontDir: 'web/front/',
        favicons: 'favicons/',
        fonts: 'fonts/',
        images: 'images/',
        scripts: 'scripts/',
        styles: 'styles/'
    }
};

const autoprefixerOptions = {
    browsers: [
        'Android >= 4',
        'Chrome >= 30',
        'Firefox >= 30',
        'Explorer >= 9',
        'iOS >= 6',
        'Opera >= 30',
        'Safari >= 8'
    ],
    cascade: false
};

const onError = function(error) {
    notify.onError({
        title:    'Gulp',
        subtitle: 'Failure!',
        message:  'Error: <%= error.message %>',
        // sound:    'Beep'
    })(error);

    this.emit('end');
};

const logEvent = function(event) {
    console.log('Event type: ' + event.type);
    console.log('Event path: ' + event.path);
};

const currentDate = function() {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth()+1; // January is 0!
    const yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0'+dd;
    }

    if (mm < 10) {
        mm = '0'+mm;
    }

    return yyyy +''+ mm +''+ dd;
};

/* ================================================================================================================== */
/* DEFAULT TASKS
/* ================================================================================================================== */

// Static Server + watching scss/js files only in dev env.
gulp.task('default', ['serve']);

gulp.task('serve', ['scripts', 'styles', 'fonts', 'images'], function() {
    if (development() === true) {
        gulp.start('watchers');
    }
});

gulp.task('quick-serve', ['styles:front', 'scripts:front'], function() {
    if (development() === true) {
        gulp.start('watchers');
    }
});


/* ================================================================================================================== */
/* GENERAL ASSETS TASKS
/* ================================================================================================================== */

// STYLES ----------------------------------------------------------------------------------------------------------- //

gulp.task('styles', ['styles:front', 'styles:back']);

    gulp.task('styles:front', function() {
        const postcssProcessors = [
            postcssImport,
            flexbugs,
            reporter({ clearAllMessages: true })
        ];

        return gulp.src(path.src.frontDir + path.src.styles)
            .pipe(plumber({ errorHandler: onError }))
            .pipe(development(size({ title: "[FRONT] CSS: Before optimize" })))
            .pipe(sass({ precision: 10 })) // min precision for bootstrap sass (https://github.com/twbs/bootstrap-sass#sass-number-precision)
            .pipe(autoprefixer(autoprefixerOptions))
            .pipe(postcss(postcssProcessors))
            .pipe(cssnano())
            .pipe(rename({ extname: '.min.css'}))
            .pipe(development(size({ title: "[FRONT] CSS: After optimize" })))
            .pipe(gulp.dest(path.dist.frontDir + path.dist.styles));
    });

    gulp.task('styles:back', function() {
        const postcssProcessors = [
            postcssImport,
            flexbugs,
            reporter({ clearAllMessages: true })
        ];

        return gulp.src(path.src.backDir + path.src.styles)
            .pipe(plumber({ errorHandler: onError }))
            .pipe(development(size({ title: "[BACK] CSS: Before optimize" })))
            .pipe(sass({ precision: 10 })) // min precision for bootstrap sass (https://github.com/twbs/bootstrap-sass#sass-number-precision)
            .pipe(autoprefixer(autoprefixerOptions))
            .pipe(postcss(postcssProcessors))
            .pipe(cssnano())
            .pipe(rename({ extname: '.min.css'}))
            .pipe(development(size({ title: "[BACK] CSS: After optimize" })))
            .pipe(gulp.dest(path.dist.backDir + path.dist.styles));
    });


// SCRIPTS ---------------------------------------------------------------------------------------------------------- //

gulp.task('scripts', ['scripts:front', 'scripts:back']);
gulp.task('scripts:front', ['scripts:front:webpack', 'scripts:front:vendors']);
gulp.task('scripts:back', ['scripts:back:partials', 'scripts:back:vendors']);

    gulp.task('scripts:front:webpack', function() {
        if (development() === true) {
            gulp.src('src/entry.js')
                .pipe(plumber({ errorHandler: onError }))
                // .pipe(named())
                .pipe(webpackStream(require('./webpack.dev.config.js'), webpack))
                .pipe(gulp.dest(path.dist.frontDir + path.dist.scripts));
        }

        if (production() === true) {
            gulp.src('src/entry.js')
                .pipe(plumber({ errorHandler: onError }))
                // .pipe(named())
                .pipe(webpackStream(require('./webpack.prod.config.js'), webpack))
                .pipe(gulp.dest(path.dist.frontDir + path.dist.scripts));
        }
    });

    gulp.task('scripts:front:vendors', function() {
        return gulp.src(path.src.frontDir + path.src.scriptsVendors)
            .pipe(plumber({ errorHandler: onError }))
            .pipe(development(size({ title: "[FRONT] JS Vendors: Before optimize" })))
            .pipe(uglify({
                mangle: true,
                preserveComments: false
            }))
            .pipe(rename({ extname: '.min.js' }))
            .pipe(development(size({ title: "[FRONT] JS Vendors: After optimize" })))
            .pipe(gulp.dest(path.dist.frontDir + path.dist.scripts));
    });

    gulp.task('scripts:back:partials', function() {
        return gulp.src(path.src.backDir + path.src.scriptsPartials)
            .pipe(plumber({ errorHandler: onError }))
            .pipe(concat('main.js'))
            .pipe(development(size({ title: "[BACK] JS Partials: Before optimize" })))
            .pipe(production(uglify({
                mangle: true,
                preserveComments: false
            })))
            .pipe(rename({ extname: '.min.js' }))
            .pipe(development(size({ title: "[BACK] JS Partials: After optimize" })))
            .pipe(gulp.dest(path.dist.backDir + path.dist.scripts));
    });

    gulp.task('scripts:back:vendors', function() {
        return gulp.src(path.src.backDir + path.src.scriptsVendors)
            .pipe(plumber({ errorHandler: onError }))
            .pipe(development(size({ title: "[BACK] JS Vendors: Before optimize" })))
            .pipe(uglify({
                mangle: true,
                preserveComments: false
            }))
            .pipe(rename({ extname: '.min.js' }))
            .pipe(development(size({ title: "[BACK] JS Vendors: After optimize" })))
            .pipe(gulp.dest(path.dist.backDir + path.dist.scripts));
    });


// IMAGES ----------------------------------------------------------------------------------------------------------- //

gulp.task('images', ['images:images', 'images:favicons']);
gulp.task('images:favicons', ['images:favicons:front', 'images:favicons:back']);

    gulp.task('images:images', function() {
        return gulp.src(path.src.frontDir + path.src.images)
            // only files that has changed will pass through here
            .pipe(changed(path.dist.frontDir + path.dist.images))
            .pipe(development(size({ title: "[FRONT] IMG: Before optimize" })))
            .pipe(plumber({ errorHandler: onError }))
            .pipe(pngquant({
                quality: '75-90',
                speed: 3
            })())
            .pipe(optipng({ optimizationLevel: 3 })())
            .pipe(jpegoptim({ max: 90 })())
            .pipe(svgo()())
            .pipe(development(size({ title: "[FRONT] IMG: After optimize" })))
            .pipe(gulp.dest(path.dist.frontDir + path.dist.images));
    });

    gulp.task('images:favicons:front', function() {
        return gulp.src(path.src.frontDir + path.src.favicons)
            .pipe(plumber({ errorHandler: onError }))
            .pipe(gulp.dest(path.dist.frontDir + path.dist.favicons));
    });

    gulp.task('images:favicons:back', function() {
        return gulp.src(path.src.backDir + path.src.favicons)
            .pipe(plumber({ errorHandler: onError }))
            .pipe(gulp.dest(path.dist.backDir + path.dist.favicons));
    });


// FONTS ------------------------------------------------------------------------------------------------------------ //

gulp.task('fonts', ['fonts:front', 'fonts:back']);

    gulp.task('fonts:front', function() {
        return gulp.src(path.src.frontDir + path.src.fonts)
            .pipe(plumber({ errorHandler: onError }))
            .pipe(gulp.dest(path.dist.frontDir + path.dist.fonts));
    });

    gulp.task('fonts:back', function() {
        return gulp.src(path.src.backDir + path.src.fonts)
            .pipe(plumber({ errorHandler: onError }))
            .pipe(gulp.dest(path.dist.backDir + path.dist.fonts));
    });


/* ================================================================================================================== */
/* METRICS TASKS
/* ================================================================================================================== */

gulp.task('metrics', ['metrics:styles', 'metrics:php']);

    gulp.task('metrics:styles', function() {
        return gulp.src('app/Resources/assets/front/styles/partials/**/*.*')
            .pipe(parker({
                file: 'doc/metrics/CssMetrics/'+currentDate()+'.md'
            }));
    });

    gulp.task('metrics:php', function(cb) {
        exec('phpmetrics --report-html=doc/metrics/PhpMetrics/'+currentDate()+'.html src/', function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            cb(err);
        });
    });


/* ================================================================================================================== */
/* LINTER TASKS
/* ================================================================================================================== */

gulp.task('lint', ['lint:js', 'lint:sass']);

    gulp.task('lint:js', function() {
        return gulp.src([path.src.webpackDir + 'partials/**/*.js', '!node_modules/**'])
            .pipe(eslint('./.eslintrc.json'))
            .pipe(eslint.format())
            .pipe(eslint.failAfterError());
    });

    gulp.task('lint:sass', function() {
        return gulp.src(path.src.frontDir + 'styles/partials/**/*.*')
            .pipe(postcss([
                    stylelint({ configFile: './.stylelintrc.json' }),
                    doiuse({
                        browsers: autoprefixerOptions.browsers,
                        ignore: [], // an optional array of features to ignore
                        ignoreFiles: [], // an optional array of file globs to match against original source file path, to ignore
                        onFeatureUsage: function (usageInfo) {
                            console.log(usageInfo.message);
                        }
                    }),
                    reporter({ clearAllMessages: true })
                ],
                {
                    syntax: scss
                }
            ));
    });


/* ================================================================================================================== */
/* WATCHER TASKS
/* ================================================================================================================== */

gulp.task('watchers', function() {
    // FRONT
    gulp.watch(path.src.frontDir + path.src.styles, ['styles'])
        .on('change', function (event) {
            logEvent(event);
        });

    // -- Scripts App
    // gulp.watch([path.src.webpackDir + 'app.js', path.src.webpackDir + 'vendor.js'], ['scripts:front:webpack'])
    //     .on('change', function (event) {
    //         logEvent(event);
    //     });

    // -- Scripts Vendors
    gulp.watch(path.src.frontDir + path.src.scriptsVendors, ['scripts:front:vendors'])
        .on('change', function (event) {
            logEvent(event);
        });

    // BACK
    gulp.watch(path.src.backDir + path.src.styles, ['styles:back'])
        .on('change', function (event) {
            logEvent(event);
        });

    gulp.watch(path.src.backDir + path.src.scripts, ['scripts:back'])
        .on('change', function (event) {
            logEvent(event);
        });
});

// create a task that ensures the `js` task is complete before reloading browsers
// gulp.task('js-watch', ['js'], function (done) {
//     browserSync.reload();
//     done();
// });
