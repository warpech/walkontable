/**
 * This file is used to build Walkontable from `src/*`
 *
 * Installation:
 * 1. Install Grunt (`npm install -g grunt`)
 *
 * Build:
 * Execute `grunt` from root directory of this directory (where grunt.js is)
 * To execute automatically after each change, execute `grunt --force default watch`
 *
 * Result:
 * building Walkontable will create files:
 *  - dist/walkontable.js
 *
 * See https://github.com/cowboy/grunt for more information about Grunt
 */
module.exports = function (grunt) {
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/**\n' +
        ' * <%= pkg.name %> <%= pkg.version %>\n' +
        ' * \n' +
        ' * Date: <%= (new Date()).toString() %>\n' +
        '*/'
    },
    concat: {
      full_js: {
        src: [
          '<banner>',
          'src/*',
          'src/3rdparty/*'
        ],
        dest: 'dist/walkontable.js'
      }
    },
    watch: {
      files: ['src/*', 'src/3rdparty/*'],
      tasks: 'concat'
    }
  });

  // Default task.
  grunt.registerTask('default', 'concat');
};