'use strict';
var GulpConfig = (function () {
    function gulpConfig() {
        this.tsOutputPath    = 'generated/';
        this.nodeModulesPath = 'commonjs/';
        this.allJavaScript   = ['**/*.js'];
        this.sourceTsFiles   = ['@(src|test)/**/*.ts'];
        this.allTypeScript   = this.sourceTsFiles.concat(['typings/**/*.ts']);
    }
    return gulpConfig;
})();
module.exports = GulpConfig;
