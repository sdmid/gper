import Vue from "vue"

export default {
  /**
   * 清空cookie
   */
  clearCookies(){
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if(keys){
      for(var i = keys.length; i--;){
        Vue.prototype.$cookie.remove(keys[i]);
      }
    }
  },
  /**
   * 验证图片是否存在
   * @param pathImg
   * @returns {boolean}
   */
  isHasImg(pathImg){
    var ImgObj = new Image();
    ImgObj.src = pathImg;
    if(ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)){
      return true;
    }else{
      return false;
    }
  },
  /**
   * 验证手机号码
   * @param str
   * @returns {boolean}
   */
  isPhoneNum(str) {
    var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    if (!myreg.test(str)) {
      return false;
    } else {
      return true;
    }
  },
  /**
   * 验证用户名是否存在非法字符
   * @param str
   * @returns {boolean}
   */
  validateUserName(str){
    var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
      regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im,
      regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
    if(regEn.test(str) || regCn.test(str) || regStr.test(str)) {
      return false;
    }else{
      return true;
    }
  },
  /**
   * 验证邮箱是否合法
   * @param str
   * @returns {boolean}
   */
  validateEmail(str){
    let re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
    if (re.test(str)) {
      return true;
    } else {
      return false;
    }
  }

}
