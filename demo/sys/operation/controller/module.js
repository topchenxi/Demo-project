define(['angular'], function(ng) {
    'use strict';
    return ng.module('webapp.Ctrl', [
        'comm',
        'ngFileUpload',
        'ngDialog',
        'ngclipboard',
        'cfec.common',
        'ngc.plugin',
        'ngc.validation',
        'ngc.umeditor'
    ]);
});
