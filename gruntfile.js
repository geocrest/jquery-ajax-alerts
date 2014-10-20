module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-nuget');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
  	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		requirejs: {
			compile: {
				options: {
					baseUrl: "src/js",
					name: "ajax-utility",
					out: "src/js/ajax-utility.min.js",
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
	          'src/css/ajax-utility.min.css': ['src/css/ajax-utility.css']
	        }
	      }
	    },
		nugetpack: {
			dist: {
				src: 'geocrest.web.ajaxutility.nuspec',
				dest: 'build/',
				options: {
					version: '<%= pkg.version %>'
				}
			}
		}
	});
	grunt.registerTask('pack', ['nugetpack']);
	grunt.registerTask('default', ['requirejs', 'cssmin']);
}