var gulp = require('gulp');
var peg = require("pegjs");

gulp.task('default', function () {
    // place code for your default task here 
    var parser = peg.generate("start = ('a' / 'b')+");
});