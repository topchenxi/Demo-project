define(['../controller/module'], function(ng) {
    // 百分比
    ng.filter('percentFilter', function() {
        return function(num) {
            if (num == null) {
                return '0%';
            } else {
                return parseInt(num * 1000 / 10) + '%';
            }
        }
    });
    // 近半年二次回复率
    ng.filter('halfYearTwoRateFilter', function() {
        return function(num) {
            if (num == null || num == -1) {
                return '此段时间没有商机';
            } else {
                return parseInt(num * 1000 / 10) + '%';
            }
        }
    });
    // 采购商二次回复率
    ng.filter('buyerReversionRateFilter', function() {
        return function(num) {
            if (num == null || num == -1) {
                return '此段时间供应商没回复';
            } else {
                return parseInt(num * 1000 / 10) + '%';
            }
        }
    });
    // 与会届数
    ng.filter("showCfecTimes", function() {
        return function(timeArray) {
            return timeArray && timeArray.length ? '共' + timeArray.length + '次' + '(最近' + timeArray[timeArray.length - 1] + '届)' : '';
        };
    });
    // 买家审核状态
    ng.filter('checkBuyerStatus', function() {
        return function(status) {
            switch (status) {
                case 2:
                    return '待审核';
                case 3:
                    return '审核通过';
                case -1:
                    return '审核不通过';
                default:
                    return "";
            }
        }
    });
    // 询盘类型
    ng.filter('inquiryTypeFilter', function() {
        return function(inquiryType) {
            switch (inquiryType) {
                case 5:
                    return '公司询盘';
                case 1:
                    return '产品询盘';
            }
        }
    });
    // 国外短信发送状态
    ng.filter('smsStatus', function() {
        return function(status) {
            switch (status) {
                case 0:
                    return '发送中';
                case 1:
                    return '已发送';
                case -1:
                    return '发送失败';
                default:
                    return '';
            }
        }
    });
})