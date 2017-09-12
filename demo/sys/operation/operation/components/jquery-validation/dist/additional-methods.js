/*!
 * jQuery Validation Plugin v1.13.1
 *
 * http://jqueryvalidation.org/
 *
 * Copyright (c) 2014 Jörn Zaefferer
 * Released under the MIT license
 */
(function(factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery", "validation"], factory);
    } else {
        factory(jQuery);
    }
}(function($) {

    (function() {

        function stripHtml(value) {
            // remove html tags and space chars
            return value.replace(/<.[^<>]*?>/g, " ").replace(/&nbsp;|&#160;/gi, " ")
                // remove punctuation
                .replace(/[.(),;:!?%#$'\"_+=\/\-“”’]*/g, "");
        }

        $.validator.addMethod("maxWords", function(value, element, params) {
            return this.optional(element) || stripHtml(value).match(/\b\w+\b/g).length <= params;
        }, $.validator.format("Please enter {0} words or less."));

        $.validator.addMethod("minWords", function(value, element, params) {
            return this.optional(element) || stripHtml(value).match(/\b\w+\b/g).length >= params;
        }, $.validator.format("Please enter at least {0} words."));

        $.validator.addMethod("rangeWords", function(value, element, params) {
            var valueStripped = stripHtml(value),
                regex = /\b\w+\b/g;
            return this.optional(element) || valueStripped.match(regex).length >= params[0] && valueStripped.match(regex).length <= params[1];
        }, $.validator.format("Please enter between {0} and {1} words."));

    }());

    // Accept a value from a file input based on a required mimetype
    $.validator.addMethod("accept", function(value, element, param) {
        // Split mime on commas in case we have multiple types we can accept
        var typeParam = typeof param === "string" ? param.replace(/\s/g, "").replace(/,/g, "|") : "image/*",
            optionalValue = this.optional(element),
            i, file;

        // Element is optional
        if (optionalValue) {
            return optionalValue;
        }

        if ($(element).attr("type") === "file") {
            // If we are using a wildcard, make it regex friendly
            typeParam = typeParam.replace(/\*/g, ".*");

            // Check if the element has a FileList before checking each file
            if (element.files && element.files.length) {
                for (i = 0; i < element.files.length; i++) {
                    file = element.files[i];

                    // Grab the mimetype from the loaded file, verify it matches
                    if (!file.type.match(new RegExp(".?(" + typeParam + ")$", "i"))) {
                        return false;
                    }
                }
            }
        }

        // Either return true because we've validated each file, or because the
        // browser does not support element.files and the FileList feature
        return true;
    }, $.validator.format("Please enter a value with a valid mimetype."));

    $.validator.addMethod("alphanumeric", function(value, element) {
        return this.optional(element) || /^\w+$/i.test(value);
    }, "Letters, numbers, and underscores only please");

    /**
     * BIC is the business identifier code (ISO 9362). This BIC check is not a guarantee for authenticity.
     *
     * BIC pattern: BBBBCCLLbbb (8 or 11 characters long; bbb is optional)
     *
     * BIC definition in detail:
     * - First 4 characters - bank code (only letters)
     * - Next 2 characters - ISO 3166-1 alpha-2 country code (only letters)
     * - Next 2 characters - location code (letters and digits)
     *   a. shall not start with '0' or '1'
     *   b. second character must be a letter ('O' is not allowed) or one of the following digits ('0' for test (therefore not allowed), '1' for passive participant and '2' for active participant)
     * - Last 3 characters - branch code, optional (shall not start with 'X' except in case of 'XXX' for primary office) (letters and digits)
     */
    $.validator.addMethod("bic", function(value, element) {
        return this.optional(element) || /^([A-Z]{6}[A-Z2-9][A-NP-Z1-2])(X{3}|[A-WY-Z0-9][A-Z0-9]{2})?$/.test(value);
    }, "Please specify a valid BIC code");

    /**
     * Validates currencies with any given symbols by @jameslouiz
     * Symbols can be optional or required. Symbols required by default
     *
     * Usage examples:
     *  currency: ["£", false] - Use false for soft currency validation
     *  currency: ["$", false]
     *  currency: ["RM", false] - also works with text based symbols such as "RM" - Malaysia Ringgit etc
     *
     *  <input class="currencyInput" name="currencyInput">
     *
     * Soft symbol checking
     *  currencyInput: {
     *     currency: ["$", false]
     *  }
     *
     * Strict symbol checking (default)
     *  currencyInput: {
     *     currency: "$"
     *     //OR
     *     currency: ["$", true]
     *  }
     *
     * Multiple Symbols
     *  currencyInput: {
     *     currency: "$,£,¢"
     *  }
     */
    $.validator.addMethod("currency", function(value, element, param) {
        var isParamString = typeof param === "string",
            symbol = isParamString ? param : param[0],
            soft = isParamString ? true : param[1],
            regex;

        symbol = symbol.replace(/,/g, "");
        symbol = soft ? symbol + "]" : symbol + "]?";
        regex = "^[" + symbol + "([1-9]{1}[0-9]{0,2}(\\,[0-9]{3})*(\\.[0-9]{0,2})?|[1-9]{1}[0-9]{0,}(\\.[0-9]{0,2})?|0(\\.[0-9]{0,2})?|(\\.[0-9]{1,2})?)$";
        regex = new RegExp(regex);
        return this.optional(element) || regex.test(value);

    }, "Please specify a valid currency");

    $.validator.addMethod("dateFA", function(value, element) {
        return this.optional(element) || /^[1-4]\d{3}\/((0?[1-6]\/((3[0-1])|([1-2][0-9])|(0?[1-9])))|((1[0-2]|(0?[7-9]))\/(30|([1-2][0-9])|(0?[1-9]))))$/.test(value);
    }, "Please enter a correct date");

    /**
     * Return true, if the value is a valid date, also making this formal check dd/mm/yyyy.
     *
     * @example $.validator.methods.date("01/01/1900")
     * @result true
     *
     * @example $.validator.methods.date("01/13/1990")
     * @result false
     *
     * @example $.validator.methods.date("01.01.1900")
     * @result false
     *
     * @example <input name="pippo" class="{dateITA:true}" />
     * @desc Declares an optional input element whose value must be a valid date.
     *
     * @name $.validator.methods.dateITA
     * @type Boolean
     * @cat Plugins/Validate/Methods
     */
    $.validator.addMethod("dateITA", function(value, element) {
        var check = false,
            re = /^\d{1,2}\/\d{1,2}\/\d{4}$/,
            adata, gg, mm, aaaa, xdata;
        if (re.test(value)) {
            adata = value.split("/");
            gg = parseInt(adata[0], 10);
            mm = parseInt(adata[1], 10);
            aaaa = parseInt(adata[2], 10);
            xdata = new Date(aaaa, mm - 1, gg, 12, 0, 0, 0);
            if ((xdata.getUTCFullYear() === aaaa) && (xdata.getUTCMonth() === mm - 1) && (xdata.getUTCDate() === gg)) {
                check = true;
            } else {
                check = false;
            }
        } else {
            check = false;
        }
        return this.optional(element) || check;
    }, "Please enter a correct date");

    $.validator.addMethod("dateNL", function(value, element) {
        return this.optional(element) || /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test(value);
    }, "Please enter a correct date");

    // Older "accept" file extension method. Old docs: http://docs.jquery.com/Plugins/Validation/Methods/accept
    $.validator.addMethod("extension", function(value, element, param) {
        param = typeof param === "string" ? param.replace(/,/g, "|") : "png|jpe?g|gif";
        return this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i"));
    }, $.validator.format("Please enter a value with a valid extension."));


    $.validator.addMethod("integer", function(value, element) {
        return this.optional(element) || /^-?\d+$/.test(value);
    }, "A positive or negative non-decimal number please");

    $.validator.addMethod("ipv4", function(value, element) {
        return this.optional(element) || /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(value);
    }, "Please enter a valid IP v4 address.");

    $.validator.addMethod("ipv6", function(value, element) {
        return this.optional(element) || /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i.test(value);
    }, "Please enter a valid IP v6 address.");

    $.validator.addMethod("lettersonly", function(value, element) {
        return this.optional(element) || /^[a-z]+$/i.test(value);
    }, "Letters only please");

    $.validator.addMethod("letterswithbasicpunc", function(value, element) {
        return this.optional(element) || /^[a-z\-.,()'"\s]+$/i.test(value);
    }, "Letters or punctuation only please");


    /*
     * The Número de Identificación Fiscal ( NIF ) is the way tax identification used in Spain for individuals
     */
    $.validator.addMethod("nifES", function(value) {
        "use strict";

        value = value.toUpperCase();

        // Basic format test
        if (!value.match("((^[A-Z]{1}[0-9]{7}[A-Z0-9]{1}$|^[T]{1}[A-Z0-9]{8}$)|^[0-9]{8}[A-Z]{1}$)")) {
            return false;
        }

        // Test NIF
        if (/^[0-9]{8}[A-Z]{1}$/.test(value)) {
            return ("TRWAGMYFPDXBNJZSQVHLCKE".charAt(value.substring(8, 0) % 23) === value.charAt(8));
        }
        // Test specials NIF (starts with K, L or M)
        if (/^[KLM]{1}/.test(value)) {
            return (value[8] === String.fromCharCode(64));
        }

        return false;

    }, "Please specify a valid NIF number.");

    $.validator.addMethod("nowhitespace", function(value, element) {
        return this.optional(element) || /^\S+$/i.test(value);
    }, "No white space please");

    /**
     * Return true if the field value matches the given format RegExp
     *
     * @example $.validator.methods.pattern("AR1004",element,/^AR\d{4}$/)
     * @result true
     *
     * @example $.validator.methods.pattern("BR1004",element,/^AR\d{4}$/)
     * @result false
     *
     * @name $.validator.methods.pattern
     * @type Boolean
     * @cat Plugins/Validate/Methods
     */
    $.validator.addMethod("pattern", function(value, element, param) {
        if (this.optional(element)) {
            return true;
        }
        if (typeof param === "string") {
            param = new RegExp("^(?:" + param + ")$");
        }
        return param.test(value);
    }, "Invalid format.");


    /**
     * Matches a valid Canadian Postal Code
     *
     * @example jQuery.validator.methods.postalCodeCA( "H0H 0H0", element )
     * @result true
     *
     * @example jQuery.validator.methods.postalCodeCA( "H0H0H0", element )
     * @result false
     *
     * @name jQuery.validator.methods.postalCodeCA
     * @type Boolean
     * @cat Plugins/Validate/Methods
     */
    $.validator.addMethod("postalCodeCA", function(value, element) {
        return this.optional(element) || /^[ABCEGHJKLMNPRSTVXY]\d[A-Z] \d[A-Z]\d$/.test(value);
    }, "Please specify a valid postal code");

    /*
     * Valida CEPs do brasileiros:
     *
     * Formatos aceitos:
     * 99999-999
     * 99.999-999
     * 99999999
     */
    $.validator.addMethod("postalcodeBR", function(cep_value, element) {
        return this.optional(element) || /^\d{2}.\d{3}-\d{3}?$|^\d{5}-?\d{3}?$/.test(cep_value);
    }, "Informe um CEP válido.");

    /* Matches Italian postcode (CAP) */
    $.validator.addMethod("postalcodeIT", function(value, element) {
        return this.optional(element) || /^\d{5}$/.test(value);
    }, "Please specify a valid postal code");

    $.validator.addMethod("postalcodeNL", function(value, element) {
        return this.optional(element) || /^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/.test(value);
    }, "Please specify a valid postal code");

    // Matches UK postcode. Does not match to UK Channel Islands that have their own postcodes (non standard UK)
    $.validator.addMethod("postcodeUK", function(value, element) {
        return this.optional(element) || /^((([A-PR-UWYZ][0-9])|([A-PR-UWYZ][0-9][0-9])|([A-PR-UWYZ][A-HK-Y][0-9])|([A-PR-UWYZ][A-HK-Y][0-9][0-9])|([A-PR-UWYZ][0-9][A-HJKSTUW])|([A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRVWXY]))\s?([0-9][ABD-HJLNP-UW-Z]{2})|(GIR)\s?(0AA))$/i.test(value);
    }, "Please specify a valid UK postcode");

    /*
     * Lets you say "at least X inputs that match selector Y must be filled."
     *
     * The end result is that neither of these inputs:
     *
     *  <input class="productinfo" name="partnumber">
     *  <input class="productinfo" name="description">
     *
     *  ...will validate unless at least one of them is filled.
     *
     * partnumber:  {require_from_group: [1,".productinfo"]},
     * description: {require_from_group: [1,".productinfo"]}
     *
     * options[0]: number of fields that must be filled in the group
     * options[1]: CSS selector that defines the group of conditionally required fields
     */
    $.validator.addMethod("require_from_group", function(value, element, options) {
        var $fields = $(options[1], element.form),
            $fieldsFirst = $fields.eq(0),
            validator = $fieldsFirst.data("valid_req_grp") ? $fieldsFirst.data("valid_req_grp") : $.extend({}, this),
            isValid = $fields.filter(function() {
                return validator.elementValue(this);
            }).length >= options[0];

        // Store the cloned validator for future validation
        $fieldsFirst.data("valid_req_grp", validator);

        // If element isn't being validated, run each require_from_group field's validation rules
        if (!$(element).data("being_validated")) {
            $fields.data("being_validated", true);
            $fields.each(function() {
                validator.element(this);
            });
            $fields.data("being_validated", false);
        }
        return isValid;
    }, $.validator.format("Please fill at least {0} of these fields."));

    /*
     * Lets you say "either at least X inputs that match selector Y must be filled,
     * OR they must all be skipped (left blank)."
     *
     * The end result, is that none of these inputs:
     *
     *  <input class="productinfo" name="partnumber">
     *  <input class="productinfo" name="description">
     *  <input class="productinfo" name="color">
     *
     *  ...will validate unless either at least two of them are filled,
     *  OR none of them are.
     *
     * partnumber:  {skip_or_fill_minimum: [2,".productinfo"]},
     * description: {skip_or_fill_minimum: [2,".productinfo"]},
     * color:       {skip_or_fill_minimum: [2,".productinfo"]}
     *
     * options[0]: number of fields that must be filled in the group
     * options[1]: CSS selector that defines the group of conditionally required fields
     *
     */
    $.validator.addMethod("skip_or_fill_minimum", function(value, element, options) {
        var $fields = $(options[1], element.form),
            $fieldsFirst = $fields.eq(0),
            validator = $fieldsFirst.data("valid_skip") ? $fieldsFirst.data("valid_skip") : $.extend({}, this),
            numberFilled = $fields.filter(function() {
                return validator.elementValue(this);
            }).length,
            isValid = numberFilled === 0 || numberFilled >= options[0];

        // Store the cloned validator for future validation
        $fieldsFirst.data("valid_skip", validator);

        // If element isn't being validated, run each skip_or_fill_minimum field's validation rules
        if (!$(element).data("being_validated")) {
            $fields.data("being_validated", true);
            $fields.each(function() {
                validator.element(this);
            });
            $fields.data("being_validated", false);
        }
        return isValid;
    }, $.validator.format("Please either skip these fields or fill at least {0} of them."));



    // TODO check if value starts with <, otherwise don't try stripping anything
    $.validator.addMethod("strippedminlength", function(value, element, param) {
        return $(value).text().length >= param;
    }, $.validator.format("Please enter at least {0} characters"));

    $.validator.addMethod("time", function(value, element) {
        return this.optional(element) || /^([01]\d|2[0-3])(:[0-5]\d){1,2}$/.test(value);
    }, "Please enter a valid time, between 00:00 and 23:59");

    $.validator.addMethod("time12h", function(value, element) {
        return this.optional(element) || /^((0?[1-9]|1[012])(:[0-5]\d){1,2}(\ ?[AP]M))$/i.test(value);
    }, "Please enter a valid time in 12-hour am/pm format");

    // same as url, but TLD is optional
    $.validator.addMethod("url2", function(value, element) {
        return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
    }, $.validator.messages.url);


    $.validator.addMethod("zipcodeUS", function(value, element) {
        return this.optional(element) || /^\d{5}(-\d{4})?$/.test(value);
    }, "The specified US ZIP Code is invalid");

    $.validator.addMethod("ziprange", function(value, element) {
        return this.optional(element) || /^90[2-5]\d\{2\}-\d{4}$/.test(value);
    }, "Your ZIP-code must be in the range 902xx-xxxx to 905xx-xxxx");

    /**============**/
    // 针对umeditor的长度校验 -只考虑文字长,图片不计
    $.validator.addMethod("um_minlength", function(value, element, params) {
        var rs = true;
        var len = $("<p></p>").html(value).text().length;
        if (len < params) {
            rs = false;
        }
        return rs;
    }, $.validator.format("Please enter at least {0} words."));
    // 针对umeditor的长度校验 -只考虑文字长,图片不计
    $.validator.addMethod("um_maxlength", function(value, element, params) {
        var rs = true;
        var len = $("<p></p>").html(value).text().length;
        if (len > params) {
            rs = false;
        }
        return rs;
    }, $.validator.format("Please enter {0} words or less."));

    // 针对umeditor不能有外部链接
    $.validator.addMethod("no_extlink", function(value, element, params) {
        var has = false;
        var content = value;
        var links = $("<p></p>").html(content).find('a');

        var _host = window.location.hostname.split('.');
        var _domain = _host[_host.length - 2] + '.' + _host[_host.length - 1];
        for (var i = 0; i < links.length; i++) {
            var href = links.eq(i).attr('href');
            if (href != null && href.indexOf("javascript:") && href.indexOf(_domain) < 0) {
                has = true;
                break;
            }
        }
        return !has;
    }, "Please do not include external link");

    //数字英文及符号[包含空格]
    $.validator.addMethod("um_symbolEn", function(value, element) {
        var reg = /^[\w\s`~!@#$%^&*()_+\-=[\]{}\\|;':"/,\.\?]*$/g;
        // 正则的\s 好像匹配不到 &nbsp; 转成的空格
        value = value.replace(/(&nbsp;)+/g, '');
        var ie8 = /(msie\s|trident.*rv:)([8.]+)/.test(navigator.userAgent.toLowerCase());
        var cont = String($("<p></p>").html(value).text());
        if (ie8) {
            cont = cont.substring(0, cont.length - 1);
        }

        return this.optional(element) || reg.test(cont);
    }, '请输入除"<>"外的英文字符');
    /**====]]========**/

    //数字英文及符号[包含空格]
    $.validator.addMethod("symbolEn", function(value, element) {
        var tel = /^[\w\s`~!@#$%^&*()_+\-=[\]{}\\|;':"/,.?]*$/ig;
        return this.optional(element) || (tel.test(value));
    }, '请输入除"<>"外的英文字符');

    $.validator.addMethod('enStirng', function(value, element) {
         return this.optional(element) || /^[a-zA-Z0-9-_\s]+$/.test(value);
    }, 'Please use numbers, letters (a-zA-Z), dash (-) and underscore (_)');

    $.validator.addMethod('enCode', function(value, element) {
        var reg = /^[^\u4e00-\u9fa5]*$/g;
        return reg.test(value);
    }, 'Only English letters, Arabic numbers are accepted. ');

    $.validator.addMethod("En3", function(value, element) {
        var tel = /[\u4e00-\u9fa5]/;
        return !tel.test(value);
    }, "Please enter the English.");

    $.validator.addMethod('enNumberCode', function(value, element) {
        var reg = /^[a-zA-Z0-9]+$/g;
        return this.optional(element) || reg.test(value);
    }, 'Only English letters, Arabic numbers are accepted. ');

}));
