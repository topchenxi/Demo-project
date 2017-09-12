// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill";
import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./router/router";
import store from "./store";
import axios from "axios";
import VueAxios from "vue-axios";
import App from "@/App";
import FastClick from "fastclick";



// GA统计
import VueAnalytics from 'vue-analytics';

import "common/js/global";
import "common/js/rem";
import "common/stylus/index.styl";

// 按需引入部分组件
import { Swipe, SwipeItem } from "mint-ui";
import { InfiniteScroll } from "mint-ui";
import { Popup } from "mint-ui";
import { Picker } from "mint-ui";
import { Switch } from "mint-ui";
import { Field } from 'mint-ui';
import { Button } from 'mint-ui';
import { Navbar, TabItem } from 'mint-ui';
import { Cell } from 'mint-ui';

// 滚动插件
import VueAwesomeSwiper from 'vue-awesome-swiper';
import VueScroller from 'vue-scroller';
require('../static/css/swiper-3.4.2.min.css');


window.addEventListener(
    "load",
    function() {
        FastClick.attach(document.body);
    },
    false
);

Vue.component(Picker.name, Picker); //  第一个参数取组件名称
Vue.component(Switch.name, Switch);
Vue.component(Popup.name, Popup);
Vue.component(Field.name, Field);
Vue.component(Button.name, Button);
Vue.use(InfiniteScroll);
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(Navbar.name, Navbar);
Vue.component(TabItem.name, TabItem);
Vue.component(Cell.name, Cell);
Vue.use(VueRouter);
Vue.use(VueAxios, axios);
Vue.use(VueAwesomeSwiper);
Vue.use(VueScroller);

axios.defaults.baseURL = "/app_center1";
// axios.defaults.baseURL = "/app_center";
axios.defaults.timeout = 20000;

/* eslint-disable no-new */
const router = new VueRouter({
    routes
});

// GA统计
Vue.use(VueAnalytics, {
    id: 'UA-65077502-1',
    router
})

// title指令
Vue.directive('docTitle', {

    update: function(el, binding) {
        let titleStr = el.dataset.doctitle;
        if (titleStr != '' && titleStr != undefined && titleStr != null) {
            let maxLen = 22;
            if (titleStr.length > maxLen) {
                titleStr = titleStr.substring(0, maxLen) + '...';
            }
        } else {
            titleStr = 'e-cantonfair';
        }
        document.title = titleStr;
    }
})

/* eslint-disable no-new */
new Vue({
    el: "#app",
    router,
    store,
    template: "<App/>",
    components: { App }
});