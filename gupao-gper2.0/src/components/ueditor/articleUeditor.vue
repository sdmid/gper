<template>
	<div id="answer_editor_wrap">
		<div id="articleEditor"   type="text/plain" style="width:1136px; min-height: 556px;  height: auto !important;z-index: 750;   "></div>
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
			//console.log(str, ' getContent str')
			this.$store.state.article.articleModTemp=str;

		},
    clearDoc () {
      this.ue.execCommand('cleardoc');
    }
	},
	mounted(){
		UE.delEditor("articleEditor");
		this.ue = UE.getEditor('articleEditor', {//初始化富文本
	    	allowSpanTransToP: false,
	    	// toolbars: [['autotypeset', 'bold','insertorderedlist','link','insertimage','insertvideo','removeformat','insertcode','fullscreen']],
	    	toolbars: [['autotypeset', 'bold','insertorderedlist','link','insertimage','removeformat','insertcode','fullscreen']],
	    	theme:'answer'
		});

		// this.ue.addListener("focus",()=>{//文本框获取焦点时清空里面的内容
	 //      this.ue.setContent(this.place_hold)
	 //    });

    this.ue.addListener("blur",()=>{//文本框失去焦点时清空里面的内容
     /* var str=this.ue.getContent()
      this.ue.setContent(str)*/
    });
    this.ue.addListener("selectionchange",()=>{//文本框内容发生改变时
      var str=this.ue.getContentTxt().trim()
      if (str) {
        this.isHasContent = true
      } else {
        this.isHasContent = false
      }
    });
    this.ue.ready(()=>{
      // //console.log(this.place_hold,"ioioo")
      // if(this.place_hold==""){
      //   var str="<p style='color:silver'>1、具有原创性、对他人有启发性且行文排版优雅的文章</p><br>";
      //   str+="<p style='color:silver'>2、与开发相关的技术分享、开发技巧、工具介绍、技术设想、业界评论、职业心得等等</p><br>";
      //   str+="<p style='color:silver'>3、认真或有趣的交流与分享</p><br>";
      //   this.ue.setContent(str);
      // }else{
      //   this.ue.setContent(this.place_hold);
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
.submit_text_sub{ width:140px; height:47px; background:#337ab7; color:#fff;border-radius:5px; border:none; }


/*富文本工具条位置样式等*/
body #edui1_iframeholder{ height: auto;}
</style>
