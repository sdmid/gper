<template>
	<div id="editor_wrap">
		<div  v-bind:id="editor_id" type="text/plain" style="width:807px;height:132px;z-index: 750;"></div>
		<div class="bubbling_submit_box">
			<img @click="insert_them_btn"  class="insert_them_btn" src="/static/img/insert_them.png"/>
			<div class="submit_bubb_btn" :class="isHasContent? '' : 'disable'"  @click="dispatchComment">评论</div>
      <span class="span_num">{{contentLength}}/200</span>
		</div>

	</div>
</template>

<script>
import "../../../static/js/utf8-jsp/ueditor.config.js"
import "../../../static/js/utf8-jsp/ueditor.all.js"
import "../../../static/js/utf8-jsp/lang/zh-cn/zh-cn.js"
import Cookies from "js-cookie"
import iView  from "iview"
import Vue from "vue"
import qs from 'qs'
Vue.use(iView)
export default{
	props:[
		'editor_id'
	],
	data(){
		return {
			ue:"",
			addUpdateCommentsParams:{
				userId:'',
				content:'',
				sourceId:'',
				sourceType:'',
				type:''
			},
      isHasContent: false,
      contentLength: 0
		}
	},
	methods:{
		insert_them_btn(){//富文本插入话题函数
			this.ue.execCommand('inserthtml', '#<span class="divt1" >输入话题</span>#');
			var innerDocu=document.getElementsByTagName("iframe")[0].contentDocument;
			var innerWind=document.getElementsByTagName("iframe")[0].contentWindow;
			setTimeout(function(){
				if (document.selection) {
				    var range = innerDocu.body.createTextRange();
				    range.moveToElementText(innerDocu.getElementsByClassName('divt1')[0]);
				    range.select();
				  } else if (window.getSelection) {
				    var range = innerDocu.createRange();
				    range.selectNode(innerDocu.getElementsByClassName('divt1')[0]);
				    innerWind.getSelection().removeAllRanges();
				    innerWind.getSelection().addRange(range);
				  }
				  innerDocu.getElementsByClassName('divt1')[0].className="add_them";
			},200)
		},

		dispatchComment(){//发布评论
		  if(this.handleLoginActive()){
			var str = this.ue.getContent();
			if(!(str.indexOf('<img') > -1)){
			  if(!this.isHasContent) return;
			}
			if(str.trim().length === 0) return;
			this.addUpdateCommentsParams.userId = Cookies.get('userId');
			this.addUpdateCommentsParams.sourceType = 'App\\Models\\Bubble';
			this.addUpdateCommentsParams.type = 'add';
			this.addUpdateCommentsParams.sourceId = this.$route.query.id;
			this.addUpdateCommentsParams.content = this.ue.getContent();
			//var formData = qs.stringify(this.addUpdateCommentsParams);
			this.$appost('comment/addUpdateComments',this.addUpdateCommentsParams).then((res)=>{
			  this.$emit('getAddUpdateComments',this.ue.getContent());
			  this.ue.setContent('');
			});
		  }
		},
		insertWord(word){//插入已有的话题
			this.ue.execCommand('insertHtml', word);
		},
		success (nodesc) {
      this.$Message.success(nodesc);
		},
		error (nodesc) {
      this.$Message.error(nodesc);
		},
		warning (nodesc) {
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

	},
	mounted(){
		//editor
		UE.delEditor(this.editor_id);
		this.ue = UE.getEditor(this.editor_id, {//初始化富文本
	    	allowSpanTransToP: false,
	    	toolbars: [['insertimage', 'emotion']],
	    	theme:'default'
		});
    this.ue.addListener("selectionchange",()=>{//文本框内容发生改变时
      var str=this.ue.getContentTxt().trim();
      this.contentLength = str.length;
      if (str) {
        this.isHasContent = true
      } else {
        this.isHasContent = false
      }
      var str1=this.ue.getContent();
      if ((str1.indexOf('<img') > -1)) {
        this.isHasContent = true
      }
    })
	},
	watch:{

	}
}

</script>

<style scoped>
  .bubbling_submit_box{padding-bottom:15px !important}
  .bubbling_submit_box .submit_bubb_btn.disable{background-color:#b5b5b5}
  .bubbling_submit_box .submit_bubb_btn{width:91px !important;height:33px !important;line-height:33px !important;font-size:14px !important;border-radius:2px !important;background-color:#2d8cf0 !important}
  #editor_wrap .span_num {float: right;font-size: 14px;line-height: 33px;margin-right: 10px;}
  /*.bubbling_submit_box{padding-bottom: 0px !important;}
  !*.edui-editor-iframeholder iframe{height:132px;}*!
  .bubbling_submit_box .submit_bubb_btn.disable {background-color: #b5b5b5;}
  .bubbling_submit_box .submit_bubb_btn{width:91px !important;height:33px !important;line-height:33px !important;font-size:14px !important;border-radius:2px !important}*/
</style>

