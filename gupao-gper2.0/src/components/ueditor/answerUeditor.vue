<template>
	<div id="answer_editor_wrap">
		<div id="answerEditor" type="text/plain" style="width:100%; height: 220px !important;z-index: 750;"></div>
	</div>
</template>

<script>
import "../../../static/js/utf8-jsp/ueditor.config.js"
import "../../../static/js/utf8-jsp/ueditor.all.js"
import "../../../static/js/utf8-jsp/lang/zh-cn/zh-cn.js"

export default{
	props:[
		"place_hold"
	],
	data(){
		return {
			ue:"",
      isHasContent: false
		}
	},
	methods:{
	  setContent(html){
	    var _this = this;
      this.ue.execCommand('cleardoc');
      setTimeout(function(){
        _this.ue.execCommand('inserthtml', html);
      },200);
    },
		insert_them_btn(){//富文本插入话题函数
			this.ue.execCommand('inserthtml', '#<span class="divt1" >输入话题</span>#');
			var innerDocu=document.getElementById("ueditor_0").contentDocument;
			var innerWind=document.getElementById("ueditor_0").contentWindow;
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
				  innerDocu.getElementsByClassName('divt1')[0].className="";
			},200)
		},
		getContent(){
			var str=this.ue.getContent();
			this.$store.state.answers.answerModTemp=str;
      return true
		},
    clearDoc () {
      this.ue.execCommand('cleardoc');
    }
	},
	mounted(){
		UE.delEditor("answerEditor");
		this.ue = UE.getEditor('answerEditor', {//初始化富文本
	    	allowSpanTransToP: false,
	    	toolbars: [['autotypeset', 'bold','insertorderedlist','link','insertimage','removeformat','insertcode','fullscreen']],
//	    	toolbars: [['autotypeset', 'bold','insertorderedlist','link','insertimage','insertvideo','removeformat','insertcode','fullscreen']],
	    	theme:'answer'
		});
		// this.ue.addListener("focus",()=>{//文本框获取焦点时清空里面的内容
		// 	var str=this.ue.getContent();
		// 	this.ue.setContent(this.place_hold)
		// });
    this.ue.addListener("selectionchange",()=>{//文本框内容发生改变时
      var str=this.ue.getContentTxt().trim()
      if (str) {
       this.$emit('getHasContent', true)
      } else {
        this.$emit('getHasContent', false)
      }
      var str1=this.ue.getContent();
      if ((str1.indexOf('<img') > -1)) {
        this.$emit('getHasContent', true)
      }
    });
		this.ue.ready(()=>{
			// if(this.place_hold==""){
			// 	var str=`<p style='color:silver'>1、描述您的问题</p><br>`;
			// 	 str+="<p style='color:silver'>2、贴上相关代码</p><br>";
			// 	str+="<p style='color:silver'>3、贴上报错信息</p><br>";
			// 	str+="<p style='color:silver'>4、贴上相关截图</p><br>";
			// 	str+="<p style='color:silver'>5、已经尝试过哪些方法仍然没解决（附上相关链接）</p><br>";
			// 	this.ue.setContent(str);
			// }else{
			// 	this.ue.setContent(this.place_hold);
			// }


		});





	},
	computed:{
	},
	watch:{
		place_hold:{
			handler(cur,old){
				this.ue.ready(()=>{
					this.ue.setContent(cur);
				});
			},
			deep:true
		}
	}
}
</script>

<style >
	/*富文本工具条位置样式等*/
.edui-default .edui-editor-toolbarbox{
}
.edui-default .edui-editor-toolbarbox,.edui-default .edui-editor-toolbarboxouter{
	background: none !important; box-shadow: none  !important; border: none !important;

}
.edui-state-hover .edui-button-wrap,.edui-splitbutton-body{ background-color: #fff !important; border-color:#fff !important; width: 99%; }
.edui-wordpastepop{ left: -9999999px !important; position: fixed !important;  }
#edui1_message_holder{left: -9999999px !important; position: fixed !important;}

/*冒泡底部的自己写的元素的样式*/



.submit_text{ width:100%; margin:28px 0 70px 0; height:47px; line-height: 47px;}
/*.submit_text_sub{ width:140px; height:47px; background:#337ab7; color:#fff;border-radius:5px; border:none; }*/


/*富文本工具条位置样式等*/
body #edui1_iframeholder{ height: auto;}
</style>
