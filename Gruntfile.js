/**
 * This file is used to build Walkontable from `src/*`
 *
 * Installation:
 * 1. Install Grunt CLI (`npm install -g grunt-cli`)
 * 1. Install Grunt 0.4.0 and other dependencies (`npm install`)
 *
 * Build:
 * Execute `grunt` from root directory of this directory (where Gruntfile.js is)
 * To execute automatically after each change, execute `grunt --force default watch`
 *
 * Result:
 * building Walkontable will create files:
 *  - dist/walkontable.js
 *
 * See http://gruntjs.com/getting-started for more information about Grunt
 */
module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        banner: '/**\n' +
          ' * <%= pkg.name %> <%= pkg.version %>\n' +
          ' * \n' +
          ' * Date: <%= (new Date()).toString() %>\n' +
          '*/\n\n'
      },
      full_js: {
        src: [
          'src/*.js',
          'src/3rdparty/*.js'
        ],
        dest: 'dist/walkontable.js'
      }
    },
    jasmine: { //simply run tests by `grunt test`
      src: [
        'test/jasmine/lib/jquery.min.js',
        'src/*.js',
        'src/3rdparty/*.js',
        'test/jasmine/SpecHelper.js'
      ],
      options: {
        specs: [
          'test/jasmine/spec/*.js'
        ],
        styles: [
          'css/walkontable.css'
        ]
      }
    },
    watch: {
      files: ['src/*.js', 'src/3rdparty/*.js'],
      tasks: ['concat']
    }
  });

  // Default task.
  grunt.registerTask('default', ['concat']);
  grunt.registerTask('test', ['concat', 'jasmine']);

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
};