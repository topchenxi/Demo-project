'use strict';
module.exports = function(grunt) {
    //加载grunt插件
    require('load-grunt-tasks')(grunt);
    //在cmd显示任务执行时间
    require('time-grunt')(grunt);
    //配置工程路径
    var appConfig = {
        app: 'static/cfec/dev',
        dist: 'dist',
        version: '0.0.0',
        html: 'html',
        static: 'static'
    };
    grunt.initConfig({
        cfec: appConfig,
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' + ' * Bootstrap v<%= pkg.version %> (<%= pkg.homepage %>)\n' + ' * Copyright 2015-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' + ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' + ' */\n',
        less: {
            compileCore: {
                options: {
                    strictMath: true,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: '<%= pkg.name %>.css.map',
                    sourceMapFilename: 'static/global/css/<%= pkg.name %>.css.map'
                },
                files: {
                    'static/global/css/<%= pkg.name %>.css': '<%= cfec.app %>/view/less/cfec.less'
                }
            },
            component: {
                files: [{
                    expand: true,
                    cwd: '<%= cfec.app %>/view/less/component',
                    src: '*.less',
                    dest: '<%= cfec.app %>/view/css/component',
                    ext: '.css'
                }]
            },
            cms: {
                files: [{
                    expand: true,
                    cwd: 'static/cms/less',
                    src: ['*.less', '**/*.less'],
                    dest: 'static/cms/css',
                    ext: '.css'
                }]
            },
            ec: {
                files: [{
                    expand: true,
                    cwd: 'static/ec/less',
                    src: ['*.less', '**/*.less'],
                    dest: 'static/ec/css',
                    ext: '.css'
                }]
            },
            msg: {
                files: [{
                    expand: true,
                    cwd: 'static/msg/less',
                    src: ['*.less', '**/*.less'],
                    dest: 'static/msg/css',
                    ext: '.css'
                }]
            },
            seller: {
                files: [{
                    expand: true,
                    cwd: 'static/seller/less',
                    src: ['*.less', '**/*.less'],
                    dest: 'static/seller/css',
                    ext: '.css'
                }],

            },
            home: {
                files: [{
                    expand: true,
                    cwd: 'static/home/less',
                    src: ['*.less', '**/*.less'],
                    dest: 'static/home/css',
                    ext: '.css'
                }],

            },
            procurement: {
                files: [{
                    expand: true,
                    cwd: 'static/procurement/less',
                    src: '*.less',
                    dest: 'static/procurement/css',
                    ext: '.css'
                }]
            },
            edm: {
                files: [{
                    expand: true,
                    cwd: 'static/seller/less',
                    src: 'edm.less',
                    dest: 'static/seller/css',
                    ext: '.css'
                }]
            },
            wap: {
                files: [{
                    expand: true,
                    cwd: 'static/wap/less',
                    src: ['*.less', '**/*.less'],
                    dest: 'static/wap/css',
                    ext: '.css'
                }]
            }
        },
        jshint: {
            options: {
                'asi': true,
                'eqeqeq': false,
                'eqnull': true,
                'laxbreak': true
            },
            files: ['static/**/*.js', '!static/cfec/**/*.js', '!static/**/*.min.js']
                // assets: {
                //   //src: ['static/**/*.js', '!static/cfec/components_module/**/*.min.js', '!static/**/*.min.js']
                //   src: 
                // }
        },
        //js压缩
        uglify: {
            //核心js
            options: {
                compress: {
                    drop_console: true // <-
                }
            },
            core: {
                options: {
                    mangle: false, //不混淆变量名
                    banner: '/*! 合并requirejs与配置文件*/\n'
                },
                files: {
                    'static/global/js/require-config.min.js': ['static/cfec/components_module/requirejs/require.js', 'static/cfec/dev/components/require-config.js', 'static/cfec/dev/components/json/json2.js']
                }
            }
        },
        //grunt/grunt-contrib-connect 启动一个静态web服务器
        //git: https://github.com/gruntjs/grunt-contrib-connect
        connect: {
            options: {
                port: 9002,
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function(connect) {
                        return [
                            connect.static('.tmp'),
                            connect().use('/components_module', connect.static('./components_module')),
                            connect().use('/dev_assets/static', connect.static('./dev_assets/static')),
                            connect.static(appConfig.app)
                        ]
                    }
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= cfec.app %>'
                }
            }
        },
        //图片压缩
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= cfec.app%>/static/images',
                    src: '**/*.{png,jpg,gif,jpeg}',
                    dest: '<%= cfec.dist%>/static/images'
                }]
            }
        },
        rev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 8
            },
            cssjs: {
                files: [{
                    src: ['static/**/*.{js,css}']
                }],
            }
        },
        cachebuster: {
            build: {
                options: {
                    // banner: '<%= meta.custom_banner %>',
                    format: 'text',
                    // basedir: 'src/assets/'
                    length: 8
                },
                src: ['static/**/*.{js,css}'],
                dest: 'static/filemd5.text'
            },
            buildphp: {
                options: {
                    // banner: '<%= meta.custom_banner %>',
                    format: 'php',
                    // basedir: 'src/assets/'
                    length: 8
                },
                src: ['static/**/*.{js,css}'],
                dest: 'static/filemd5.php'
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= cfec.app%>/static',
                    src: '**/*.svg',
                    dest: '<%= cfec.dist%>/static'
                }]
            }
        },
        //markdown 文档转为html
        md2html: {
            //web组件
            multiple_files: {
                files: [{
                    expand: true,
                    cwd: 'dev/components',
                    src: '*/*.md',
                    dest: 'docs/view/component',
                    ext: '.html'
                }]
            },
            //css blog
            docs: {
                files: [{
                    expand: true,
                    cwd: 'docs/md',
                    src: '*/*.md',
                    dest: 'docs/view/',
                    ext: '.html'
                }]
            },
            ss: {
                files: [{
                    expand: true,
                    cwd: 'docs/md',
                    src: '*.md',
                    dest: 'docs/view/',
                    ext: '.html'
                }]
            }
        },
        //
        watch: {
            client: {
                files: ['*.html', 'css/*.css'],
                options: {
                    livereload: true
                }
            },
            less: {
                files: ['<%= cfec.app %>/view/less/**/*.less', '<%= cfec.app %>/view/less/*.less'],
                tasks: 'less:compileCore'
            },
            sellerless: {
                files: ['<%= cfec.html %>/sellerCentral/assets/less/*.less', '<%= cfec.html %>/sellerCentral/assets/less/*.less', ],
                tasks: 'less:sellerCentral'
            },

            ec: {
                files: ['<%= cfec.static %>/ec/less/*.less', '<%= cfec.static %>/ec/less/*.less', ],
                tasks: 'less:ec'
            },
            seller: {
                files: ['<%= cfec.static %>/seller/less/*.less', '<%= cfec.static %>/seller/less/**/*.less', ],
                tasks: 'less:seller'
            },
            msg: {
                files: ['<%= cfec.static %>/msg/less/*.less', '<%= cfec.static %>/msg/less/**/*.less', ],
                tasks: 'less:msg'
            },
            home: {
                files: ['<%= cfec.static %>/home/less/*.less', '<%= cfec.static %>/home/less/**/*.less', ],
                tasks: 'less:home'
            },
            pro: {
                files: ['<%= cfec.static %>/procurement/less/*.less', '<%= cfec.static %>/procurement/less/*.less', ],
                tasks: 'less:procurement'
            },
            cms: {
                files: ['<%= cfec.static %>/cms/less/*.less', '<%= cfec.static %>/cms/less/*.less', ],
                tasks: 'less:cms'
            },

            edmless: {
                files: ['<%= cfec.static %>/seller/less/edm.less'],
                tasks: 'less:edm'
            }
        }
    });
    /**
     * 提供3个自定义任务
     * server - 本地开发
     *  - less编译， 文件监听， 自动刷新， 启动本地服务器
     *
     * build -上线部署
     *  - 请求合并，压缩，校验，加md5戳，发布到指定目录
     *
     * test - 测试代码
     */
    grunt.registerTask('server', 'compile then start a connect web server', function(target) {});
    grunt.registerTask('build', [])
    grunt.registerTask('test', [])
}
