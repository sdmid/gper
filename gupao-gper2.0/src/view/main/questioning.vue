<template>
  <div id="questioning">
    <Modal
      v-model="addTag.show"
      title="创建标签"
      @on-ok="createNewTag()">
      <Input v-model="addTag.name" size="large" placeholder="标签名称"></Input>
      <Input v-model="addTag.description" type="textarea" :rows="4" placeholder="请对此标签补充一些描述资料，以供他人参考" style="margin-top: 10px;"></Input>
    </Modal>

    <Row>
      <Col span="12">
        <div v-if="$route.query.toName" class="ask_div">
          正在向 &nbsp;&nbsp;<router-link :to="{path:'personal/dynamic/'+ $route.query.toUserid}">{{$route.query.toName}}</router-link>  &nbsp;&nbsp;提问:
        </div>
        <h1 v-else>提出问题</h1>
      </Col>
      <Col span="12" v-show="them_list_data.length > 0">
        <span class="input-lable">已添加的标签：</span>
        <Tag type="border" closable v-for="val,index in them_list_data" :key="index" @on-close="dele_one_them(index)">{{val.name}}</Tag>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <span class="input-lable">问题类型：</span>
        <Select v-model="questionWords.categoryId" size="large" style="width: 450px;">
          <Option :value="val.id" :key="val.id" v-for="val in tec_list_data" >{{val.name}}</Option>
        </Select>
      </Col>
      <Col span="12">
        <span class="input-lable">选择标签：</span>

        <input v-model="them_word" @input="getThem" @blur="handleInputFocus(false)" @focus="handleInputFocus(true)"
               style="width: 493px;" placeholder="搜索选择标签" type="text" class="choose_them ivu-input ivu-input-large"
               onKeyUp="if(this.value.length>20) this.value=this.value.substr(0,20)" maxlength="20"/>

        <div v-show="them_listshow" class="ivu-select-dropdown" style="min-width: 450px; position: absolute; will-change: top, left; transform-origin: center top 0px; top: 43px; left: 73px;">
          <ul class="ivu-select-not-found" v-show="newThemList.length == 0 && them_word != '' && JSON.stringify(them_word) !== '[]'">
            <li @click="openAddTag(them_word)" style="padding: 7px 16px 8px;font-size: 14px!important;color:#515a6e;cursor: pointer;text-align: left;">
              创建标签 <span style="font-weight: bold;">{{them_word}}</span>
            </li>
          </ul>
          <div class="ivu-select-dropdown-list">
            <div class="ivu-select-item" v-for="val in newThemList" @click.stop="select_them(val.name,val.id)" style="padding:7px 16px 8px;font-size:14px !important;display:block;color:#515a6e;cursor:pointer;"><!---->
              {{val.name}}
            </div>
          </div>
        </div>
      </Col>
    </Row>
    <Row>
      <Col span="24">
          <AutoComplete v-model="questionWords.title" placeholder="请在这里阐述您的问题" size="large" @on-search="handleSearch1">
            <div class="demo-auto-complete-item" >
              <div class="ivu-select-item">
                <span style="color: #57a3f3;">根据标题检索到的相关问答，或许可以直接帮到你</span>
              </div>
              <Option :value="item.title" :key="item.id" v-for="item in similarQuestion">
                <router-link tag="a" target="_blank" :to="{name:'AnswerDetail',params:{id: item.id}}" style="color: #515a6e;">
                  {{ item.title }}
                </router-link>
              </Option>
            </div>
          </AutoComplete>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <span class="input-lable">编辑器：</span>
        <ButtonGroup>
          <Button v-for="editor,index in editorList" :key="editor" @click="toggleEditor(index)" :type="index == editorIndex?'primary':'default'">{{editor}}</Button>
        </ButtonGroup>
      </Col>
    </Row>
    <Row style="z-index: 99;">
      <Col span="24">
        <mavon-editor v-show="editorIndex==1" v-model="mavon_markdownValue" ref=md :ishljs = "true" @imgAdd="$imgAdd" @change="changeData" @save="saveMdStorage"></mavon-editor>
        <questionUeditor v-show="editorIndex==0" :place_hold="mystr" ref="answermod" ></questionUeditor>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <span class="input-lable">悬赏金币：</span>
        <Select v-model="questionWords.price" size="large" style="width: 150px;">
          <Option :value="price" :key="price" v-for="price in price_list" >{{price}}</Option>
        </Select>
      </Col>
      <Col span="12" style="text-align: right;">
        <Input v-model="code_num" size="large" placeholder="请输入下方验证码" style="width: 300px" />
        <span v-show="code_corect==0">错误</span>
        <span v-show="code_corect==1">正确</span>
      </Col>
    </Row>
    <Row>
      <Col span="12" class="hide-col">
        <span class="input-lable">匿名提问：</span>
        <i-switch v-model="hide_or_no" size="large"/>
      </Col>
      <Col span="12" style="text-align: right;padding: 7px 0 0 0;">
        <div class="code_img">
          <img :src="code_img" @click="change_code" class="refushcode" title="看不清，换一张"/>
        </div>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <div v-show="vipSign">
          <span class="input-lable">公开范围：</span>
          <RadioGroup size="large" v-model="questionWords.openArea">
            <Radio label="all" style="font-weight: bold;">对所有人公开</Radio>
            <Radio label="vip" style="font-weight: bold;">对VIP公开</Radio>
          </RadioGroup>
        </div>
      </Col>

      <Col span="12" style="text-align: right">
        <span @click="change_code" class="refushcode">看不清，换一张</span>
      </Col>
    </Row>
    <Row>
      <Col span="24" style="text-align: center">
        <Button style="width: 200px;" type="primary" @click="make_ques_act">发布问题</Button>
      </Col>
    </Row>

  </div>
</template>

<script>
  import questionUeditor from "@/components/ueditor/questionUeditor";
  import lodash from "lodash";
  import { mavonEditor } from 'mavon-editor';
  import 'mavon-editor/dist/css/index.css';
  import axios from 'axios';

  export default {
    name: "questioning",
    components:{
      questionUeditor,
      mavonEditor
    },
    data () {
      return {
        similarQuestion: [],
        searchParams:{word:"",page:1,pageSize:10},

        mystr:"",//富文本的文字，为空时插件里判断 不添加保留placeholder
        them_word:[],
        them_list_data:[],//选择的和自己写的主题的暂存数组
        them_listshow:false,//话题下拉是否是显示的
        themListarr:[],
        hide_or_no:false,
        price_list:[0,5,10,20,30,50,100],
        questionWords:{//提问的内容参数
          userId:'',       //必填
          title:'',		//必填
          description:'',
          price:5,
          categoryId:'',
          type:'add',
          hide:0,
          captcha:'',
          tagsList:[],
          openArea:'all'
        },
        code_corect:4,//0 错误  1真确
        code_num:'',
        editorList:['HTML编辑器','Markdown'],
        editorIndex:0,
        mavon_markdownValue:'',
        mavon_htmlValue:'',
        updateCount:-1,
        addTag:{
          show:false,
          name:'',
          description:''
        }
      }
    },
    beforeRouteLeave (to, from, next) {//离开当前页监听事件
      if(this.updateCount > 1){ //更新次数大于1 说明用户修改过当前页数据 因为获取详情时会更新一次
        if(from.path.includes('questioning')){
          this.$Modal.confirm({
            title:'提示',
            content:'您还未保存页面内容，确定需要离开本页面吗?',
            okText:'确定',
            cancelText:'取消',
            onOk:()=>{next();}
          });
        }else{next();}
      }else{next();}
    },
    updated:function () {
      this.updateCount = this.updateCount + 1;
    },
    mounted () {
      this.$store.state.action.tec_type_param.type = 'questions';
      this.$store.dispatch('getTecList');
      this.$store.dispatch('get_code');
      /*document.body.addEventListener('click', this.close_them_list, false);*/

      var quseid=this.$route.query.id;
      if(quseid!=undefined){
        this.$store.dispatch('selectQuestionsById',quseid);//查询问题
      }else{
        if(this.$store.state.answers.answerMkdmTemp!=''){//读取草稿文本
          this.editorIndex = 1;
          this.mavon_markdownValue = this.$store.state.answers.answerMkdmTemp;
          //this.$store.state.answers.answerHtmlTemp;
          this.mystr = this.$store.state.answers.answerHtmlTemp;
        }
      }
      if(this.$route.query.title){
        this.questionWords.title=this.$route.query.title
      }
      setTimeout(()=>{this.updateCount = 0},500);
    },
    methods: {
      openAddTag(name){
        this.addTag.show = true;
        this.addTag.name = name;
        this.addTag.description = '';
      },
      createNewTag(){
        this.addTag.show = false;
        if(this.handleLoginActive()){
          this.$post('tag/addTags', {name:this.addTag.name,description:this.addTag.description}).then((res) =>{
            if(res.data.success){
              this.$Message.success('创建标签成功');
              this.select_them(this.addTag.name);
            }
          });
        }
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
      },
      handleInputFocus(type){
        setTimeout(()=>{
          this.them_listshow = type;
        },500);
      },
      handleSearch1 (value) {
        this.searchParams.word = value;
        this.searchSimilarQuestion().then((response) => {
          if(response.data.success){
            this.similarQuestion = response.data.data.list;
          }
        });
      },
      searchSimilarQuestion(){//模糊查询问题
        return new Promise((resolve,reject) => {
          this.$post('search/questions', this.searchParams).then((response) =>{
            resolve(response);
          }).catch((err) =>{
            reject(err);
          });
        });
      },
      changeData(value, render) {
        this.mavon_htmlValue = render;
      },
      saveMdStorage(value, render){//保存草稿
        this.$store.state.answers.answerMkdmTemp = value;
        this.$store.state.answers.answerHtmlTemp = render;
        this.$Message.success('已保存草稿');
      },
      $imgAdd(pos, $file){// 绑定@imgAdd event
        // 第一步.将图片上传到服务器.
        var formdata = new FormData();
        formdata.append('editormd-image-file', $file);
        axios({
          url: 'img/editorUpload',
          method: 'POST',
          data: formdata,
          headers: this.getCustomHeader(),
        }).then((data) => {
          // 第二步.将返回的url替换到文本原位置![...](./0) -> ![...](url)
          /**
           * $vm 指为mavonEditor实例，可以通过如下两种方式获取
           * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
           * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
           */
          this.$refs.md.$img2Url(pos, data.data.url);
        })
      },
      getCustomHeader(){
        var accessToken = this.$cookie.get('accessToken');
        var visitorToken = this.$cookie.get('visitorToken');
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
      },
      toggleEditor(index){
        this.editorIndex = index;
        if(index == 0){
          this.mystr = this.mavon_htmlValue;
        }else{
          this.$refs.answermod.getContent();
          if(this.$store.state.answers.answerModTemp != '<p>写上一两句话吧</p>'){
            this.mavon_markdownValue = this.$store.state.answers.answerModTemp;
          }
        }
      },
      dele_one_them(i){//删除某一个话题
        this.them_list_data.splice(i,1);
      },
      getThem(){
        this.them_listshow = true;
        this.$store.state.action.them_search_par.name = this.them_word;
        this.$store.dispatch("getThem");
      },
      close_them_list(){
        var obj={};
        obj.name = this.them_word.trim();
        for(var i in this.them_list_data){
          if(this.them_list_data[i].name == this.them_word){
            this.them_listshow=false;
            return ;
          }
        }
        if(obj.name!=""){
          this.them_list_data.push(obj);
        }
        this.them_word="";
        setTimeout(()=>{
          this.them_listshow=false;
        },200)
      },
      select_them(word,id){
        for(var i in this.them_list_data){
          if(this.them_list_data[i].name == word){
            this.them_listshow = false;
            return ;
          }
        }
        var obj={};
        obj.id=id;
        obj.name=word;
        this.them_list_data.push(obj);
        this.them_word='';
        this.them_listshow=false;
      },
      make_ques_act(){
        //console.log(this.them_word);
        if(this.questionWords.title==""){
          this.$Message.error("标题不能为空");
          return
        }
        if(!this.code_num){
          this.$Message.error("验证码不能为空");
          return
        }
        var topersonid=this.$route.query.toUserid;
        if(topersonid!=undefined){//来自向他提问  的按钮 操作
          this.questionWords.toUserId=topersonid;
        }
        this.questionWords.userId=this.$cookie.get("userId");
        if(this.$route.query.id){
          this.questionWords.id= this.$route.query.id
        }
        if(this.editorIndex == 0){
          this.$refs.answermod.getContent();
          this.questionWords.editorType = 'ueditor';
        }else if(this.editorIndex == 1){
          this.$store.state.answers.answerModTemp = this.mavon_htmlValue;
          this.questionWords.mddescription = this.mavon_markdownValue;
          this.questionWords.editorType = 'markdown';
        }
        this.questionWords.description=this.$store.state.answers.answerModTemp;

        var str = '';
        for(var i in this.them_list_data){
          str += this.stripscript(this.them_list_data[i].name) + "-";
        }

        this.questionWords.tagsJsonStr = str.slice(0,str.length-1);
        this.questionWords.captcha = this.code_num;
        this.questionWords.captchaKey = this.captchakey;
        this.$store.dispatch("mack_quest",this.questionWords);
      },
      stripscript(s) {
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？-]");
        var rs = "";
        for (var i = 0; i < s.length; i++) {
          rs = rs + s.substr(i, 1).replace(pattern, '');
        }
        return rs;
      },
      check_code(){//检查验证码
        var obj={};
        obj.captchaKey=this.code_img.captchaKey;
        obj.captcha=this.code_num;
        this.$store.dispatch("check_code",obj);
      },
      change_code(){//获取验证码
        this.$store.dispatch('get_code')
      },
    },

    computed:{
      detailList(){ //问题 详情
        //console.log(this.$store.state.answers.detailList,'oppopop')
        return this.$store.state.answers.detailList
      },
      tec_list_data(){
        return this.$store.state.action.tec_list
      },
      // them_list(){
      // 	if(this.$store.state.action.them_list.length>0){
      // 		this.them_listshow=true
      // 	}else{
      // 		this.them_listshow=false;
      // 	}
      // 	return this.$store.state.action.them_list
      // },
      newThemList(){
        var newThemList=[];
        this.$store.state.action.them_list.map(item=>{
          if(item.name.search(this.them_word) != -1 && this.them_word != ''){
            newThemList.push(item);
          }
        });
        return newThemList;
        //return this.$store.state.action.them_list;
      },
      code_img(){
        //return this.$store.state.action.code_res
        var base64 = this.$store.state.action.code_res;
        return 'data:image/png;base64,' + btoa(
          new Uint8Array(base64).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
      },
      captchakey(){
        return this.$store.state.action.captchakey;
      },
      check_code_res(){
        return this.$store.state.action.checke_coderes
      },
      quesresd(){
        return this.$store.state.action.questres
      },
      vipSign () {// 判断当前登录用户是不是vip用户
        if (this.$store.state.login.userResult.data) {
          return this.$store.state.login.userResult.data.vipSign;
        }
        return false
      }
    },
    watch:{
      detailList:{//问题详情
        handler(curr,old){
          var temp=lodash.cloneDeep(curr);
          this.questionWords.title=temp.title;
          this.mystr=temp.description;
          this.questionWords.price=temp.price;
          this.questionWords.categoryId=temp.categoryId;//
          this.questionWords.type="update";
          this.questionWords.hide=temp.hide+"";
          this.questionWords.openArea=temp.openArea;
          if(temp.hide=="1"){
            this.hide_or_no=true;
          }else{
            this.hide_or_no=false;
          }
          if(temp.tagsList){
            this.them_list_data=temp.tagsList;
          }
          if(temp.editorType == 'markdown'){
            this.editorIndex = 1;
            this.mavon_markdownValue = temp.mddescription;
          }
        },
        deep:true
      },
      hide_or_no:{
        handler(curr,old){
          if(curr){
            this.questionWords.hide=1
          }else{
            this.questionWords.hide=0
          }
        }
      },
      check_code_res:{
        handler(curr,old){
          if(curr.success){
            this.code_corect=1;
          }else{
            this.code_corect=0;
          }

        },
        deep:true
      },
      quesresd:{
        handler(curr){
          if(curr.success){
            this.$refs.answermod.clearDoc();
            this.$Message.success(curr.message);
            this.updateCount = 0;
            this.$router.push({name:'AnswerDetail',params:{id: curr.data}});
          }else{
            this.$Message.error(curr.message);
            if(curr.errCode == '700'){
              this.$store.dispatch('get_code');
            }
          }
        },
        deep:true
      }
    }
  }
</script>
<style>
  #questioning .v-right-item button:last-child{color: #2d8cf0 !important;}
</style>
<style scoped>
  #questioning {margin: 0 72px;}
  #questioning h1{font-size:24px;font-weight:400;line-height:33px;color: #000000;}
  .ivu-col{padding:7px 0;}
  .hide-col { margin-top: 7px; padding: 7px 0 0 0;}
  .input-lable{font-size:14px;font-family:PingFang SC;font-weight:400;line-height:32px;display: inline-block;}
  .markdown-body{width:1136px;height:601px;border-left:1px solid #fff;background-color:white;position:relative;overflow:visible;}
  .markdown-body *{list-style: decimal;}
  .tag-nodate-tips{    width:inherit;height:30px;overflow:auto;margin:5px 0;padding:5px 0;background-color:#fff;box-sizing:border-box;border-radius:4px;box-shadow:0 1px 6px rgba(0,0,0,.2);position:absolute;z-index:900;min-width:450px;position:absolute;will-change:top,left;transform-origin:center top 0px;top:40px;left:73px;}
  .tag-nodate-tips span{    margin:0;line-height:normal;padding:7px 16px;clear:both;color:#57a3f3;font-size:12px!important;white-space:nowrap;list-style:none;cursor:pointer;transition:background .2s ease-in-out;}
  .refushcode{cursor: pointer;}
  .refushcode:hover{color:#2d8cf0;}
  .ask_div {font-size: 14px}
</style>
