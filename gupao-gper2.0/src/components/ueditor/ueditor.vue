<template>
  <div id="editor_wrap" style="padding-bottom: 17px;">
    <div v-bind:id="editor_id" type="text/plain" style="width:846px;height:132px;z-index: 750;"></div>
    <div class="bubbling_submit_box">
      <img @click="insert_them_btn" class="insert_them_btn" src="/static/img/insert_them.png"/>
      <div class="submit_bubb_btn" @click="getContent">冒泡</div>
      <span class="span_num">{{contentLength}}/200</span>
    </div>
  </div>
</template>

<script>
  import "../../../static/js/utf8-jsp/ueditor.config.js"
  import "../../../static/js/utf8-jsp/ueditor.all.js"
  import "../../../static/js/utf8-jsp/lang/zh-cn/zh-cn.js"
  import Cookies from "js-cookie"
  import iView from "iview"
  import Vue from "vue"

  Vue.use(iView)
  export default {
    props:[
      'editor_id'
    ],
    data(){
      return {
        ue:"",
        isHasContent:false,
        contentLength: 0
      }
    },
    methods:{
      insert_them_btn(){//富文本插入话题函数
        this.ue.execCommand('inserthtml','#<span class="divt1" >输入话题</span>#');
        var innerDocu = document.getElementsByTagName("iframe")[0].contentDocument;
        var innerWind = document.getElementsByTagName("iframe")[0].contentWindow;
        setTimeout(function(){
          if(document.selection){
            var range = innerDocu.body.createTextRange();
            range.moveToElementText(innerDocu.getElementsByClassName('divt1')[0]);
            range.select();
          }else if(window.getSelection){
            var range = innerDocu.createRange();
            range.selectNode(innerDocu.getElementsByClassName('divt1')[0]);
            innerWind.getSelection().removeAllRanges();
            innerWind.getSelection().addRange(range);
          }
          innerDocu.getElementsByClassName('divt1')[0].className = "add_them";
        },200)
      },
      getContent(){//发布冒泡
        if(this.handleLoginActive()){
          var str = this.ue.getContent();
          if(!(str.indexOf('<img') > -1)){
            if(!this.isHasContent){
              this.$Message.warning('内容不能为空');
              return
            }
          }
          if(str.trim().length === 0){
            this.$Message.warning('内容不能为空');
            return
          }
          this.$store.state.bubbling.makeBubParam.content = str;
          var conte_text = this.ue.getContentTxt().split("#");
          var had_them = this.$store.state.bubbling.makeBubParam.tagsList || [];
          var temp_them = [];
          if(conte_text.length % 2 == 0){
            for(var i = 0; i < conte_text.length; i += 2){
              var tmobg = {};
              var has_the_them = false;
              had_them.forEach((val)=>{
                if(val.tagName == conte_text[i + 1]){
                  has_the_them = true;
                }
              })
              if(has_the_them == false){
                tmobg.tagName = conte_text[i + 1]
                if(tmobg.tagName.length > 20){
                  this.$Message.warning('话题字数不能超过20');
                  return
                }
                temp_them.push(tmobg)
              }

            }
            temp_them.pop()
          }else{
            for(var i = 0; i < conte_text.length - 1; i += 2){
              var tmobg = {};
              var has_the_them = false;
              had_them.forEach((val)=>{
                if(val.tagName == conte_text[i + 1]){
                  has_the_them = true;
                }
              })
              if(has_the_them == false){
                tmobg.tagName = conte_text[i + 1]
                if(tmobg.tagName.length > 20){
                  this.$Message.warning('话题字数不能超过20');
                  return
                }
                temp_them.push(tmobg)
              }
            }
          }
          var tagstr = '';
          had_them.forEach((val)=>{
            if(val.tagName && str.indexOf(val.tagName) > -1){
              tagstr += val.tagName + '-';
              //this.$store.state.bubbling.makeBubParam.tagsList.push(val)
            }
          });
          temp_them.forEach((val)=>{
            if(val.tagName && str.indexOf(val.tagName) > -1){
              tagstr += val.tagName + '-';
            }
          });

          this.$store.state.bubbling.makeBubParam.tagsJsonStr = tagstr.slice(0,tagstr.length - 1);

          this.$store.state.bubbling.makeBubParam.tagsList = null;

          this.$store.dispatch("makeBUbbing");//冒泡列表

          this.ue.execCommand('cleardoc');
        }
      },
      insertWord(word){//插入已有的话题
        this.ue.execCommand('insertHtml',word);
      },
      success(nodesc){
        this.$Message.success(nodesc);
      },
      error(nodesc){
        this.$Message.error(nodesc);
      },
      warning(nodesc){
        this.$Message.warning(nodesc);
      },
      handleLoginActive(){
        if(this.$cookie.get('isSightseer') == 'true'){
          this.$store.state.login.isSightseer = !this.$store.state.login.isSightseer;
          return false;
        }else if(this.$cookie.get('isActive') != 'true'){
          this.$store.state.login.isActivated = !this.$store.state.login.isActivated;
          return false;
        }else{
          return true;
        }
      }
    },
    computed:{
      addUpdateCommentsParams(){
        return this.$store.state.common.addUpdateCommentsParams
      }
    },
    mounted(){
      //editor
      UE.delEditor(this.editor_id);
      this.ue = UE.getEditor(this.editor_id,{//初始化富文本
        allowSpanTransToP:false,
        toolbars:[['insertimage','emotion']],
        theme:'default'
      });
      this.ue.addListener("selectionchange",()=>{//文本框内容发生改变时
        var str = this.ue.getContentTxt().trim();
        this.contentLength = str.length;
        if(str){
          this.isHasContent = true
        }else{
          this.isHasContent = false
        }
        var str1 = this.ue.getContent();
        if((str1.indexOf('<img') > -1)){
          this.isHasContent = true
        }
      })
    },
    watch:{}
  }
</script>
<style>
  .bubbling_submit_box{padding-bottom:15px !important}
  .bubbling_submit_box .submit_bubb_btn.disable{background-color:#b5b5b5}
  .bubbling_submit_box .submit_bubb_btn{width:91px !important;height:33px !important;line-height:33px !important;font-size:14px !important;border-radius:2px !important;background-color:#2d8cf0 !important}
  /*.edui-editor-iframeholder iframe{height:132px;}*/
  #editor_wrap .span_num {float: right;font-size: 14px;line-height: 33px;margin-right: 10px;}
</style>

