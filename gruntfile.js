module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);
	var dist = 'dist';
	var VERSION_REGEXP = /\bv(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)(?:-[\da-z\-]+(?:\.[\da-z\-]+)*)?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?\b/i;
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.description %>\n *\n' +
		' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
		' * Copyright 2013-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
		' * Licensed under <%= pkg.license %>\n' +
		' */\n',
		usebanner: {
		    dist: {
		      	options: {
			        position: 'top',
			        banner: '<%= banner %>'
			    },
			    files: {
			        src: [ dist + '/js/*.js', dist + '/css/*.css' ]
			    }
		    }
		},
		bump: {
			options: {
				files: [ 'bower.json', 'package.json', 'src/js/<%=pkg.name%>.js' ],
				updateConfigs: [ 'pkg' ],
				commit: false,
				createTag: false,
				tagName: '%VERSION%',
				tagMessage: '%VERSION%',
				push: false,
				globalReplace: true
			}
		},
		uglify: {
			dist: {
				options: {
					// banner: '<%= banner %>'
				},
				src: 'src/js/<%= pkg.name %>.js',
				dest: dist + '/js/<%= pkg.name %>.min.js'
			}
		},
		replace: {
			dist: {
			    src: [ dist + '/js/*.js'],
			    dest: dist + '/js/',
			    replacements: [{
			      from: '?define',
			      to: '? define' // dojo loader has issue without space. requirejs works fine
			    }]
			},
			src: {
				src: [ 'src/js/<%=pkg.name%>.js'],
				dest: [ 'src/js/<%=pkg.name%>.js'],
				replacements: [{
					from: VERSION_REGEXP,
					to: 'v<%=pkg.version%>'
				}]
			}
		},
		copy: {
			dist: {
				files: [
					{
							expand: true,
							cwd: './src', 
							src: ['css/*', 'js/*'],
							dest: 'dist/'
					}
				]
			}
		},
		cssmin: {
	      single: {
	        files: {
	          'dist/css/<%= pkg.name %>.min.css': ['src/css/<%= pkg.name%>.css']
	        }
	      }
	    }, 
		jsdoc: {
			dist: {
				src: ['./src/js/<%= pkg.name%>.js', './readme.md'],
				options: {
					destination: './docs',
					configure: './jsdoc.conf.json',
					template: './node_modules/ink-docstrap/template'
				}
			}
		}, 
		clean: {
			docs: ['docs'],
			dist: ['dist']
		},
		nugetpack: {
			dist: {
				src: 'geocrest.web.ajaxalerts.nuspec',
				dest: 'build/',
				options: {
					version: '<%= pkg.version %>'
				}
			}
		}
	});
	grunt.registerTask('pack', ['nugetpack']);
 	grunt.registerTask('doc', ['clean:docs', 'jsdoc']);
  grunt.registerTask('build', ['clean:dist', 'uglify', 'replace', 'cssmin', 'copy', 'usebanner']);
	grunt.registerTask('default', ['clean:dist', 'uglify', 'replace', 'cssmin', 'copy', 'usebanner', 'clean:docs', 'jsdoc', 'nugetpack']);
}