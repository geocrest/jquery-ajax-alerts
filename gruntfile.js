module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-nuget');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
  	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		requirejs: {
			compile: {
				options: {
					baseUrl: "src/js",
					name: "ajax-alerts",
					out: "dist/js/ajax-alerts.min.js",
					optimize: "uglify2",
					preserveLicenseComments: true,
					paths: {
						'jquery': 'empty:'
					}
				}
			}
		},

		cssmin: {
	      single: {
	        files: {
	          'dist/css/ajax-alerts.min.css': ['src/css/ajax-alerts.css']
	        }
	      }
	    }, 
	    jsdoc: {
	      dist: {
	        src: ['./src/js/ajax-alerts.js', './readme.md'],
	        options: {
	          destination: './docs',
	          configure: './jsdoc.conf.json',
	          template: './node_modules/ink-docstrap/template'
	        }
	      }
	    }, 
	    clean: {
	      docs: ['docs']
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
  	grunt.registerTask('build', ['requirejs', 'cssmin']);
	grunt.registerTask('default', ['requirejs', 'cssmin', 'clean:docs', 'jsdoc', 'nugetpack']);
}