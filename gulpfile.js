/// <binding BeforeBuild='default1' />
var gulp = require('gulp');
var browserify = require("gulp-browserify");
var concat = require('gulp-concat');

var gutil = require('gulp-util');
var browserSync = require('browser-sync');
//var through = require('through2');
//var assign = require('object-assign');

var pegjs = require('pegjs');
var ts = require("gulp-typescript");

var pegjsfunc = function (opts) {
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        } 

        if (file.isStream()) {
            cb(new gutil.PluginError('gulp-pegjs', 'Streaming not supported'));
            return;
        }

        // always generate source code of parser
        var options = assign({ output: 'source' }, opts);

        var filePath = file.path;


        try {
            file.contents = new Buffer(pegjs.generate(file.contents.toString(), options));
            file.path = gutil.replaceExtension(file.path, '.js');
            this.push(file);
        } catch (err) {
            this.emit('error', new gutil.PluginError('gulp-pegjs', err, { fileName: filePath }));
        }
        cb();
    });
};

var appProj = ts.createProject("jApps/tsconfig.json", {  });
var jMusicScoreProj = ts.createProject("jMusicScore/tsconfig.json", { outFile: "jMusicScore/jMusicScore.js" });
var noteEditorProj = ts.createProject("noteEditor/tsconfig.json", { outFile: "noteEditor/noteEditor.js" });
var ckProj = ts.createProject("CKEditorPlugin/tsconfig.json", { outFile: "CKEditorPlugin/app.js" });
var txProj = ts.createProject("TextMusicEditor/tsconfig.json", { outFile: "TextMusicEditor/app.js" });
var tinyProj = ts.createProject("TinyMCEPlugin/tsconfig.json", { outFile: "TinyMCEPlugin/app.js" });

gulp.task('jApps_ts', function () {
    return appProj.src()
        .pipe(appProj())
        .pipe(gulp.dest("test"))
        .pipe(browserify())
        .pipe(concat('jApps.js'))
        .pipe(gulp.dest("dist/jApps"));
});

gulp.task('jMusicScore_ts', function () {
    return jMusicScoreProj.src()
        .pipe(jMusicScoreProj())
        .pipe(gulp.dest("dist/jMusicScore"));
});

gulp.task('noteEditor_ts', function () {
    return noteEditorProj.src()
        .pipe(noteEditorProj())
        .pipe(gulp.dest("dist/noteEditor"));
});

gulp.task('textmusic_ts', function () {
    return txProj.src()
        .pipe(txProj())
        .pipe(gulp.dest("dist/TextMusicEditor"));
});

gulp.task('CKEditorPlugin_ts', function () {
    return ckProj.src()//["CKEditorPlugin/*.ts", "CKEditorPlugin/node_modules/jmusicscore/*.d.ts", "CKEditorPlugin/scripts/typings/**"+"/*.d.ts"]
        .pipe(ckProj())
        .pipe(gulp.dest("dist/CKEditorPlugin"));
});

gulp.task('TinyMCEPlugin_ts', function () {
    return tinyProj.src()//["TinyMCEPlugin/*.ts", "TinyMCEPlugin/node_modules/jmusicscore/*.d.ts", "TinyMCEPlugin/scripts/typings/**"+"/.d.ts"]
        .pipe(tinyProj())
        .pipe(gulp.dest("dist/TinyMCEPlugin"));
});

gulp.task('css', function () {
    return gulp.src(['**/*.css'])
        .pipe(gulp.dest('dist'));
});


gulp.task('html', function () {
    return gulp.src(['*'+'/*.htm', '*'+'/*.html'])
        .pipe(gulp.dest('dist'));
});




gulp.task('peg', function () {
    // place code for your default task here 
    return gulp.src(['*'+'/*.pegjs'])
        //.pipe(pegjsfunc({ output: "source", trace: true, exportVar: "pegjs", format: "umd" }))
        .pipe(gulp.dest('dist'));
});

gulp.task('textmusic', ['peg', 'textmusic_ts']);

gulp.task('all', ['jApps_ts', 'jMusicScore_ts', 'textmusic', 'noteEditor_ts','CKEditorPlugin_ts','TinyMCEPlugin_ts', 'html', 'css']);



gulp.task("watch", ["all"], function () {

    browserSync.init({
        server: "."
    });

    gulp.watch([ "source/**/**.ts", "test/**/*.ts"], ["all"]);
    gulp.watch("dist/*.js").on('change', browserSync.reload); 
});

