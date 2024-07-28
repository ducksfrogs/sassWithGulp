const autoprefixer = require('autoprefixer');
const babel = require('gulp-babel');
const cssdeclaretionsorter = require('css-declaration-sorter');
const cssnano = require('cssnano');
const gulp = require('gulp');
// const sass = require('sass');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');
// const connect = require('gulp-connect');

const browsersync = require('browser-sync');

const paths = {
    'htmls': {
        'base': 'src/',
        'src': 'src/index.html',
        'dest': 'dist',
        'watch': 'src/*.html',
    },
    'styles': {
        'base': 'src/styles',
        'src': 'src/styles/main.scss',
        'dest': 'dist/styles',
        'watch': 'src/styles/**/*scss',
   },
   'scripts': {
    'base': 'src/scripts',
    'src': 'src/scripts/**/*.js',
    'dest': 'dist/scripts/',
    'watch': 'src/scripts/**/*.js',
   },
};

const server = function() {

    browsersync.create();
    browsersync.init({
        server: {
            baseDir: "./dist"
        }
    });
};

const htmls = function() {
    return gulp.src(
        paths.htmls.src,{
            'base': paths.htmls.base,
        }).pipe(
            gulp.dest(paths.htmls.dest)
        );
};

 const styles = function() {
    const plugins = [
        autoprefixer(),
        cssdeclaretionsorter(),
        cssnano(),
    ];

    return gulp.src(
        paths.styles.src,
        {
            'base': paths.styles.base,
        }
    ).pipe(sass().on(
        'error',
        sass.logError
    )).pipe(postcss(plugins))
    .pipe(rename({
        'basename': 'styles',
        'suffix': '.min',
    })).pipe(gulp.dest(paths.styles.dest));
};

const scripts = function() {
    return gulp.src(
        paths.scripts.src,{
            'base': paths.scripts.base,
        }
    ).
        pipe(babel()).
        pipe(uglify()).
        pipe(rename({
            'suffix': '.min',
        })).
        pipe(gulp.dest(paths.scripts.dest));
};


const watch = function() {
    gulp.watch(
        paths.htmls.watch,
        htmls
    );
    gulp.watch(
        paths.scripts.watch,
        scripts
    );
    gulp.watch(
        paths.styles.watch,
        styles
    );
};

const build = gulp.parallel(
    styles,
    scripts,
    htmls,
    gulp.series(watch),
    server,
);



exports.default = build;