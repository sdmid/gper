// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './store/store.js'
import axios from 'axios'
import Cookies from "js-cookie"
import '../static/iconfont/iconfont.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
import VueLazyLoad from 'vue-lazyload'

Vue.config.productionTip = false;
Vue.use(Vuex);

import iView from 'iview'
import 'iview/dist/styles/iview.css'
Vue.use(iView);

import {post,get,post_aplt} from '../libs/http'

Vue.prototype.$axios = axios;
Vue.prototype.$get = get;
Vue.prototype.$post = post;
Vue.prototype.$appost = post_aplt;
Vue.prototype.$cookie = Cookies;
Vue.prototype.$moment = moment;

import common from './components/common/common.js'

Vue.prototype.$common = common;

Vue.use(VueLazyLoad,{
  listenEvents: ['scroll'],
  error:'/static/img/error.png',
  loading:'/static/img/loading.gif',
  observer: true,
  lazyComponent: true,
  observerOptions: {
    rootMargin: '0px',
    threshold: 0.1
  }
});

Vue.filter('formatDate',function(pro_time){
  if(pro_time !== undefined && pro_time.length == 19){
    return moment(pro_time, "YYYY-MM-DD HH:mm:ss").fromNow();
  }else{
    return pro_time;
  }
});

import hljs from 'highlight.js';
import 'highlight.js/styles/googlecode.css' //样式文件
Vue.directive('highlight',function (el) {
  let blocks = el.querySelectorAll('pre code');
  setTimeout(() =>{
    blocks.forEach((block)=>{
      hljs.highlightBlock(block)
    })
  }, 200);
});

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title;

  //alert(Cookies.get("userId"));

  if(Cookies.get("userId") != undefined){
    next();
  }else{

    axios({method: 'GET',url: 'genera/init'}).then(response=>{
      if(response.data.success){
        Cookies.set("userId","-1",{expires:30});
        var visitorToken = response.data.data.visitorToken;
        Cookies.set('visitorToken',visitorToken,{expires:30});
        axios({method: 'GET',url: 'genera/times',headers: {'Content-Type':'application/json;charset=UTF-8','visitorToken': visitorToken}}).then(response=>{
          var timestamp = response.data.data.timestamp;
          Cookies.set('timestamp',new Date().getTime(),{expires:30});
          Cookies.set('aptimestamp',timestamp,{expires:30});
          next();
        });
      }
    });
  }

});

router.afterEach(() => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
