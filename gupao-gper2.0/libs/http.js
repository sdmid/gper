import Vue from 'vue';
import axios from 'axios';
import {Notice, Message} from 'iview';
import Cookies from 'js-cookie';
import lodash from "lodash";
import iView from 'iview';
import qs from 'qs';

// 10秒超时时间
axios.defaults.timeout = 10000;

// axios.defaults.baseURL = 'http://gper.s1.natapp.cc/gperapi/';
// axios.defaults.baseURL = 'http://192.168.8.26:19001';
axios.defaults.baseURL = 'http://192.168.8.122:19001';
//axios.defaults.baseURL = 'http://192.168.8.39:19001';
//axios.defaults.baseURL = 'http://rap2api.taobao.org/app/mock/26810/';

// 不携带cookie
axios.defaults.withCredentials = false;
axios.defaults.headers = {'Content-Type':'application/json;charset=UTF-8'};

var ones = true;

axios.interceptors.response.use(function(response){
  iView.LoadingBar.start();
  if(response.data.errCode == '600' || response.data.errCode == '610' || response.data.errCode == '620'){
    setTimeout(function(){
      if(ones){
        Notice.error({title:response.data.message});
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
          for (var i =  keys.length; i--;){
            Cookies.remove(keys[i]);
          }
        }
        window.location.reload();
        ones = false;
      }
    },500);
  }else if(response.data.errCode == '611'){//token过期重新获取token并刷新
    setTimeout(function(){
      if(ones){
        axios({method:"GET",url:"auth/refresh?refreshToken="+Cookies.get("refreshToken")}).then(res => {
          if(res.data.success){
            Cookies.set("userId", res.data.data.userId,{expires:30});
            var accToken = res.data.data.accessToken;
            Cookies.set('accessToken', accToken,{expires:30});
            Cookies.set('refreshToken', res.data.data.refreshToken,{expires:30});

            axios({method: 'GET',url: 'genera/times',headers: {'Content-Type':'application/json;charset=UTF-8','accessToken': accToken}}).then(response=>{
              var timestamp = response.data.data.timestamp;
              Cookies.set('timestamp',new Date().getTime(),{expires:30});
              Cookies.set('aptimestamp',timestamp,{expires:30});
              window.location.reload();
            });
          }else{//refreshToken获取失败，清空cookie
            var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
            if (keys) {
              for (var i = keys.length; i--;){
                Cookies.remove(keys[i]);
              }
            }
            window.location.reload();
          }
        }).catch(err => {});
        ones = false;
      }
    },500);
  }else if(response.data.errCode == '612'){//非法签名，清空cookie
    setTimeout(function(){
      if(ones){
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
          for (var i = keys.length; i--;){
            Cookies.remove(keys[i]);
          }
        }
        //Cookies.remove('aptimestamp');
        window.location.reload();
        ones = false;
      }
    },1500);

  }else if(response.data.errCode == '613'){//时间戳过期重新获取token并刷新
    setTimeout(function(){
      if(ones){
        Cookies.remove('aptimestamp');
        getTimestamp().then((timestamp) => {
          window.location.reload();
        }).catch(err => {});
        ones = false;
      }
    },500);
  }else if(response.data.errCode == '622'){//任何接口返回数据收到该错误码后不做任何处理
    throw SyntaxError();
    console.log('SyntaxError');
  }
  return response;
},function(err){
  return Promise.reject(err)
});

axios.interceptors.response.use(function(response){
  iView.LoadingBar.finish();
  return response
},function(err){
  return Promise.reject(err)
});

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function get(url,params={}){
  return new Promise((resolve,reject) => {
    params.rand = uuid();
    let deep = lodash.cloneDeep(params);
    getTimestamp().then((timestamp) => {//获取时间戳回调
      let timestamp1 = timestamp;
      var accessToken = getToken();
      var appKey = '';
      var appSecret = '';
      for(var key in deep){//解析要加密的参数
        if(isEmptyObject(deep[key])){
          if(key != 'appKey' && key != 'appSecret' && key != 'timestamp'){
            appKey += key + '-';
            appSecret += key + deep[key];
          }
        }else{
          delete params[key];
        }
      }
      strToBinary(appKey.slice(0,appKey.length-1)).then((mds) =>{//加密回调
        params.appKey = mds;
        strToBinary(timestamp1 + appSecret + accessToken).then((mds2) =>{//加密回调
          params.appSecret = mds2;
          params.timestamp = timestamp1;
          //console.log(getCustomHeader());
          axios({
            method: 'GET',
            url: url,
            params:params,
            headers: getCustomHeader(),
          }).then(response=>{
            resolve(response);
          }).catch(err=>{
            reject(err);
          })
        });
      });
    });
  });
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url,data = {}){
  return new Promise((resolve,reject) => {
    data.rand = uuid();
    let deep = lodash.cloneDeep(data);
    getTimestamp().then((timestamp) => {
      let timestamp2 = timestamp;
      var accessToken = getToken();
      var appKey = '';
      var appSecret = '';
      for(var key in deep){
        if(isEmptyObject(deep[key])){
          if(key != 'appKey' && key != 'appSecret' && key != 'timestamp'){
            appKey += key + '-';
            appSecret += key + deep[key];
          }
        }else{
          delete data[key];
        }
      }
      strToBinary(appKey.slice(0,appKey.length-1)).then((mds) =>{
        data.appKey = mds;
        strToBinary(timestamp2 + appSecret + accessToken).then((mds2) =>{
          data.appSecret = mds2;
          data.timestamp = timestamp2;
          axios({
            method: 'POST',
            url: url,
            params:data,
            headers: getCustomHeader(),
          }).then(response=>{
            resolve(response);
          }).catch(err=>{
            reject(err);
          })
        });
      });
    });
  });
}

/**
 * 封装post请求 传参序列化
 * 使用application / x-www-form-urlencoded格式
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post_aplt(url,data = {}){
  return new Promise((resolve,reject) => {
    data.rand = uuid();
    let deep = lodash.cloneDeep(data);
    getTimestamp().then((timestamp) => {
      let timestamp3 = timestamp;
      var accessToken = getToken();
      var appKey = '';
      var appSecret = '';
      for(var key in deep){
        if(isEmptyObject(deep[key])){
          if(key != 'appKey' && key != 'appSecret' && key != 'timestamp'){
            appKey += key + '-';
            appSecret += key + deep[key];
          }
        }else{
          delete data[key];
        }
      }

      strToBinary(appKey.slice(0,appKey.length-1)).then((mds) =>{
        data.appKey = mds;
        strToBinary(timestamp3 + appSecret + accessToken).then((mds2) =>{
          data.appSecret = mds2;
          data.timestamp = timestamp3;
          var formData = qs.stringify(data);
          axios.post(url, formData,
            {headers:{"Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8','accessToken': accessToken}}
          ).then((response) => {
            resolve(response);
          }).catch(err=>{
            reject(err);
          });
        });
      });
    });
  });
}

function strToBinary(str){
  return new Promise((resolve) =>{
    var result = [];
    var list = str.split("");
    var key = 0x7C;
    for(var i = 0; i < list.length; i++){
      var item = list[i];
      var binaryByte = item.charCodeAt();
      binaryByte ^= key;
      var binaryStr = binaryByte.toString(16);
      result.push(binaryStr);
    }
    resolve(result.join("g"));
  });
}

function getTimestamp(){
  var timestamp = 0;
  var localstamp = Cookies.get('timestamp');
  var aptimestamp = Cookies.get('aptimestamp');
  var now = new Date().getTime();
  if(aptimestamp && (now - localstamp) / 1000 < 280){
    return new Promise((resolve,reject) => {
      resolve(aptimestamp);
    });
  }else{
    return new Promise((resolve,reject) => {
      axios({method: 'GET',url: 'genera/times',headers: getCustomHeader()}).then(response=>{
        timestamp = response.data.data.timestamp;
        Cookies.set('timestamp',new Date().getTime(),{expires:30});
        Cookies.set('aptimestamp',timestamp,{expires:30});
        resolve(timestamp);
      }).catch(err=>{
        reject(err);
      });
    });
  }
}

function isEmptyObject(str){
  if(typeof str === 'string'){
    if(str.length > 0){
      return true;
    }else{
      return false;
    }
  }else if(typeof str === 'number'){
    return true;
  }else if(typeof str === 'Object'){
    if(str.length > 0){
      return true;
    }else{
      return false;
    }
  }else if(typeof str === 'null'){
    return false;
  }else if(typeof str === 'undefined'){
    return false;
  }
}

/**
 *  处理head中的token传参格式
 * @returns {string}
 */
function getCustomHeader(){
  var accessToken = Cookies.get('accessToken');
  var visitorToken = Cookies.get('visitorToken');
  //console.log('accessToken===='+accessToken);
  //console.log('visitorToken===='+visitorToken);
  if(accessToken){
    return {
      'Content-Type':'application/json;charset=UTF-8',
      'accessToken': accessToken
    };
  }else if(visitorToken){
    return {
      'Content-Type':'application/json;charset=UTF-8',
      'visitorToken': visitorToken
    };
  }
}

function getToken(){
  var accessToken = Cookies.get('accessToken');
  var visitorToken = Cookies.get('visitorToken');
  if(accessToken){
    return accessToken;
  }else if(visitorToken){
    return visitorToken;
  }
}

function uuid() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}
