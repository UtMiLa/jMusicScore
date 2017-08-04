/// <binding BeforeBuild='default1' />
var gulp = require('gulp');
//var pegjs = require("gulp-pegjs");

var gutil = require('gulp-util');
var through = require('through2');
var assign = require('object-assign');

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

var appProj = ts.createProject("jApps/tsconfig.json", { outFile: "jApps/jApps.js" });
var jsMusicScoreProj = ts.createProject("jsMusicScore/tsconfig.json", { outFile: "jsMusicScore/jsMusicScore.js" });
var noteEditorProj = ts.createProject("noteEditor/tsconfig.json", { outFile: "noteEditor/noteEditor.js" });
var ckProj = ts.createProject("CKEditorPlugin/tsconfig.json", { outFile: "CKEditorPlugin/app.js" });
var txProj = ts.createProject("TextMusicEditor/tsconfig.json", { outFile: "TextMusicEditor/app.js" });
var tinyProj = ts.createProject("TinyMCEPlugin/tsconfig.json", { outFile: "TinyMCEPlugin/app.js" });

gulp.task('jApps_ts', function () {
    return gulp.src(["jApps/*.ts", "jApps/scripts/typings/**/*.d.ts"])
        .pipe(appProj())
        .pipe(gulp.dest("dist/jApps"));
});

gulp.task('jsMusicScore_ts', function () {
    return gulp.src(["TextMusicEditor/*.ts", "jsMusicScore/scripts/typings/**/*.d.ts"])
        .pipe(jsMusicScoreProj())
        .pipe(gulp.dest("dist/jsMusicScore"));
});

gulp.task('noteEditor_ts', function () {
    return gulp.src(["noteEditor/*.ts", "noteEditor/node_modules/jmusicscore/*.d.ts", "noteEditor/scripts/typings/**/*.d.ts"])
        .pipe(noteEditorProj())
        .pipe(gulp.dest("dist/noteEditor"));
});

gulp.task('textmusic_ts', function () {
    return gulp.src(["TextMusicEditor/app.ts", "TextMusicEditor/node_modules/jmusicscore/*.d.ts", "TextMusicEditor/scripts/typings/**/*.d.ts"])
        .pipe(txProj())
        .pipe(gulp.dest("dist/TextMusicEditor"));
});

gulp.task('CKEditorPlugin_ts', function () {
    return gulp.src(["CKEditorPlugin/*.ts", "CKEditorPlugin/node_modules/jmusicscore/*.d.ts", "CKEditorPlugin/scripts/typings/**/*.d.ts"])
        .pipe(ckProj())
        .pipe(gulp.dest("dist/CKEditorPlugin"));
});

gulp.task('TinyMCEPlugin_ts', function () {
    return gulp.src(["TinyMCEPlugin/*.ts", "TinyMCEPlugin/node_modules/jmusicscore/*.d.ts", "TinyMCEPlugin/scripts/typings/**/*.d.ts"])
        .pipe(tinyProj())
        .pipe(gulp.dest("dist/TinyMCEPlugin"));
});


gulp.task('peg', function () {
    // place code for your default task here 
    return gulp.src(['*/*.pegjs'])
        .pipe(pegjsfunc({ output: "source", trace: true, exportVar: "pegjs", format: "umd" }))
        .pipe(gulp.dest('dist'));
});

gulp.task('textmusic', ['peg', 'textmusic_ts']);

