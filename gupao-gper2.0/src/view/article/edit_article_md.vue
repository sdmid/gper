<template>
  <div id="editarticlemd">
    <Modal
      v-model="addTag.show"
      title="创建标签"
      :mask="false"
      draggable
      @on-ok="createNewTag()">
      <Input v-model="addTag.name" size="large" placeholder="标签名称"></Input>
      <Input v-model="addTag.description" type="textarea" :rows="4" placeholder="请对此标签补充一些描述资料，以供他人参考" style="margin-top: 10px;"></Input>
    </Modal>

    <Modal v-model="submitNext.show" title="发布文章" footer-hide width="610" class-name="edit_articel_markdown">

      <Form :label-width="80">
        <FormItem label="文章摘要">
          <Input placeholder="请输入文章摘要" v-model="articleWords.summary" size="large" on-keyup="if(this.value.length>250) this.value=this.value.substr(0,250)" :maxlength="250"/>
        </FormItem>

        <FormItem label="文章分类">
          <Select v-model="articleWords.categoryId" size="large" style="width: 450px;">
            <Option :value="val.id" :key="val.id" v-for="val in tec_list_data" >{{val.name}}</Option>
          </Select>
        </FormItem>

        <FormItem v-show="them_list_data.length > 0">
          <div style="margin-left: -80px;">
            <span style="font-size: 14px;">已添加标签:</span>
            <Tag type="border" closable v-for="val,index in them_list_data" :key="index" @on-close="dele_one_them(index)">{{val.name}}</Tag>
          </div>
        </FormItem>

        <FormItem label="选择标签">
          <input v-model="them_word" @input="getThem" @blur="handleInputFocus(false)" @focus="handleInputFocus(true)"
                 style="width: 493px;" placeholder="搜索选择标签" type="text" class="choose_them ivu-input ivu-input-large"
                 onKeyUp="if(this.value.length>20) this.value=this.value.substr(0,20)" maxlength="20"/>

          <div v-show="them_listshow" class="ivu-select-dropdown" style="min-width: 450px; position: absolute; will-change: top, left; transform-origin: center top 0px; top: 43px; left: 0px;">
            <ul class="ivu-select-not-found" v-show="them_list.length == 0 && them_word != '' && JSON.stringify(them_word) !== '[]'">
              <li @click="openAddTag(them_word)" style="padding: 7px 16px 8px;font-size: 14px!important;color:#515a6e;cursor: pointer;text-align: left;">
                创建标签 <span style="font-weight: bold;">{{them_word}}</span>
              </li>
            </ul>
            <div class="ivu-select-dropdown-list">
              <div class="ivu-select-item" v-for="val in them_list" @click.stop="select_them(val.name,val.id)" style="padding:7px 16px 8px;font-size:14px !important;display:block;color:#515a6e;cursor:pointer;">
                {{val.name}}
              </div>
            </div>
          </div>
        </FormItem>
        <FormItem label="文章类型">
          <RadioGroup v-model="articleWords.articleType" size="large">
            <Radio :label="item.value" :key="item.value" v-for="item in articleTypes" style="font-weight: bold;">{{item.name}}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem v-show="vipSign" label="公开范围">
          <RadioGroup size="large" v-model="articleWords.openArea">
            <Radio label="all" style="font-weight: bold;">对所有人公开</Radio>
            <Radio label="vip" style="font-weight: bold;">对VIP公开</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="验证码" class="imageCode">
          <Input size="large" v-model="code_num" placeholder="请输入图片验证码" required style="width: 250px;">
            <span slot="append" style="height: 32px;width: 92px;display: block;">
              <img :src="code_img" title="看不清，换一张" style="height: 32px;cursor: pointer;" @click="change_code">
            </span>
          </Input>
        </FormItem>

        <FormItem style="text-align: right;">
          <Button @click="submitNext.show = false">取消</Button>
          <Button type="primary" @click="make_article_act">提交</Button>
        </FormItem>
      </Form>
    </Modal>

    <Row>

      <Col span="2">
        <router-link to="/article">
          <Button size="large" icon="ios-arrow-back" style="margin-left:5px">返回</Button>
        </router-link>
      </Col>
      <Col span="19">
        <Input v-model="articleWords.title" placeholder="请输入文章标题" size="large" on-keyup="if(this.value.length>100) this.value=this.value.substr(0,100)" :maxlength="100" style="width: 82vw"/>
      </Col>
      <Col span="3" style="text-align: right">
        <Button size="large" type="primary" @click="submitNext.show = true;">发表文章</Button>

        <Dropdown placement="bottom-end" trigger="click" @on-click="handleDropClick">
          <a href="javascript:void(0)">
            <Avatar icon="ios-person" size="large" class="logo" :src="userLogo"/>
            <img v-if="isVip" class="vip-crown" src="../../../static/img/crown.svg">
          </a>
          <DropdownMenu slot="list" >
            <DropdownItem name="myhome">
              <div>我的主页</div>
            </DropdownItem>
            <DropdownItem name="setting">
              <div>账号设置</div>
            </DropdownItem>
            <DropdownItem divided name="exit">
              <div>退出</div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Col>
    </Row>
    <Row style="z-index: 99;">
      <Col span="24">
        <mavon-editor v-show="editorIndex==1" v-model="mavon_markdownValue" ref=md :ishljs = "true" @imgAdd="$imgAdd" @change="changeData" @save="saveMdStorage"></mavon-editor>
      </Col>
    </Row>

  </div>
</template>

<script>
  import articleUeditor from "@/components/ueditor/articleUeditor";
  import lodash from "lodash";
  import { mavonEditor } from 'mavon-editor';
  import 'mavon-editor/dist/css/index.css';
  import axios from 'axios';

  export default {
    name: "editarticle",
    components:{
      articleUeditor,
      mavonEditor
    },
    data () {
      return {
        mystr:"",//富文本的文字，为空时插件里判断 不添加保留placeholder
        them_word:'',
        them_list_data:[],//选择的和自己写的主题的暂存数组
        them_listshow:false,//话题下拉是否是显示的
        themListarr:[],
        hide_or_no:false,
        price_list:[5,10,20,30],
        articleWords:{//提问的内容参数
          userId:'',       //必填
          title:'',		//必填
          content:'',//必填 内容
          //summary:'',
          categoryId:'',
          type:'add',
          openArea: 'all',
          articleType:'origina',
        },
        articleTypes:[
          {name:'原创',value:'origina'},
          {name:'转载',value:'repost'},
          {name:'翻译',value:'translated'}
        ],
        code_corect:4,//0 错误  1真确
        code_num:'',
        editorList:['HTML编辑器','Markdown'],
        editorIndex:1,
        mavon_markdownValue:'',
        mavon_htmlValue:'',
        addTag:{
          show:false,
          name:'',
          description:''
        },
        updateCount:0,
        userLogo:'',
        isVip:false,
        submitNext:{
          show:false
        }
      }
    },
    beforeRouteLeave (to, from, next) {//离开当前页监听事件
      if(this.updateCount > 1){ //更新次数大于1 说明用户修改过当前页数据 因为获取详情时会更新一次
        if(from.path.includes('editarticle')){
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
      this.$store.dispatch('getUserInfo');
      this.$store.state.action.tec_type_param.type = 'articles';
      this.$store.dispatch('getTecList');
      this.$store.dispatch('get_code');
      /*document.body.addEventListener('click', this.close_them_list, false)*/
      var quseid=this.$route.query.id;
      if(quseid!=undefined){
        this.$store.dispatch('selectArticlesById',quseid);//查询文章
      }else{
        if(this.$store.state.article.articleMkdmTemp!=''){//读取草稿文本
          this.editorIndex = 1;
          this.mavon_markdownValue = this.$store.state.article.articleMkdmTemp;
          this.mystr = this.$store.state.article.articleHtmlTemp;
        }
      }
      setTimeout(()=>{this.updateCount = 0},500);
    },
    methods: {
      handleDropClick(name){
        if(name == 'myhome'){
          var userid = this.$cookie.get("userId");
          this.$router.push({
            name: 'TAdynamic',
            params: {userid: userid}
          });
        }
        if(name == 'setting'){
          this.$router.push({name: 'Iinformation'});
        }
        if(name == 'exit'){
          this.handleExit();
        }
      },
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
      changeData(value, render) {
        this.mavon_htmlValue = render;
      },
      saveMdStorage(value, render){//保存草稿
        this.$store.state.article.articleMkdmTemp = value;
        this.$store.state.article.articleHtmlTemp = render;
        this.$Message.success({title: '提示',desc: '已保存草稿'});
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
          this.$refs.articlemod.getContent();
          if(this.$store.state.article.articleModTemp != '<p>写上一两句话吧</p>'){
            this.mavon_markdownValue = this.$store.state.article.articleModTemp;
          }
        }
      },
      predefault(){

      },
      dele_one_them(i){//删除某一个标签
        this.them_list_data.splice(i,1);
      },
      getThem(){
        this.them_listshow = true;
        this.$store.state.action.them_search_par.name = this.them_word;
        this.$store.dispatch("getThem");
      },
      close_them_list(){
        var obj = {};
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
            this.them_listshow=false;
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
      make_article_act(){
        if(this.articleWords.title==''){
          this.$Message.warning("标题不能为空");
          return;
        }
        if(!this.code_num){
          this.$Message.warning("验证码不能为空");
          return;
        }
        var topersonid=this.$route.query.toUserid;
        //来自向他提问  的按钮 操作
        if(topersonid!=undefined){
          this.articleWords.toUserId=topersonid;
        }
        var articleid=this.$route.query.id;
        if(articleid!=undefined){
          this.articleWords.id=articleid;
        }
        this.articleWords.userId=this.$cookie.get("userId");

        var str = '';
        for(var i in this.them_list_data){
          str += this.stripscript(this.them_list_data[i].name) + "-";
        }
        this.articleWords.tagsJsonStr = str.slice(0,str.length-1);
        if(this.editorIndex == 0){
          this.$refs.articlemod.getContent();
          this.articleWords.editorType = 'ueditor';
        }else if(this.editorIndex == 1){
          this.$store.state.article.articleModTemp = this.mavon_htmlValue;
          this.articleWords.mdcontent = this.mavon_markdownValue;
          this.articleWords.editorType = 'markdown';
        }
        this.articleWords.content = this.$store.state.article.articleModTemp;
        this.articleWords.captcha = this.code_num;
        this.articleWords.captchaKey = this.captchakey;
        if(this.articleWords.content.indexOf('src')>-1){
          var arr = this.getimgsrc(this.articleWords.content);
          if(arr.length>0){
            if(this.isHasImg(arr[0])){
              this.articleWords.logo = arr[0];
            }
          }
        }
        this.$store.dispatch("edit_article",this.articleWords);
      },
      isHasImg(pathImg){
        var ImgObj = new Image();
        ImgObj.src = pathImg;
        if(ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)){
          return true;
        } else {
          return false;
        }
      },
      getimgsrc(htmlstr) {
        var reg = /<img.+?src=('|")?([^'"]+)('|")?(?:\s+|>)/gim;
        var arr = [];
        var tem ;
        while (tem = reg.exec(htmlstr)) {
          arr.push(tem[2]);
        }
        return arr;
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
        return this.$store.state.action.detailList
      },
      tec_list_data(){
        return this.$store.state.action.tec_list
      },
      them_list(){
        /*if(this.$store.state.action.them_list.length>0){
          this.them_listshow=true
        }else{
          this.them_listshow=false;
        }
        return this.$store.state.action.them_list*/

        var themList=[];
        this.$store.state.action.them_list.map(item=>{
          if(item.name.search(this.them_word) != -1 && this.them_word != ''){
            themList.push(item);
          }
        });
        return themList;
      },
      code_img(){
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
      },
      user(){
        return this.$store.state.login.userResult;
      },
    },
    watch:{
      detailList:{//文章详情
        handler(curr,old){
          var temp = lodash.cloneDeep(curr);
          this.articleWords.title=temp.title;
          this.mystr=temp.description;
          this.articleWords.price=temp.price;
          this.articleWords.categoryId=temp.categoryId;
          this.articleWords.type="update";
          this.articleWords.hide=temp.hide+"";
          this.articleWords.content = temp.content;
          this.articleWords.summary = temp.summary;
          this.articleWords.articleType = temp.articleType;
          this.mystr = temp.content;
          this.articleWords.openArea = temp.openArea;
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
            this.mavon_markdownValue = temp.mdcontent;
          }
          this.updateCount = 0;
        },
        deep:true
      },
      hide_or_no:{
        handler(curr,old){
          if(curr){
            this.articleWords.hide=1
          }else{
            this.articleWords.hide=0
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
        handler(curr,old){
          if(curr.success){
            this.$Message.success(curr.message);
            this.updateCount = 0;
            this.$router.push({path:"/articleContent",query:{id:curr.data}});
          }else{
            this.$Message.error(curr.message);
            if(curr.errCode == '700'){
              this.$store.dispatch('get_code');
            }
          }
        },
        deep:true
      },
      user:{
        handler(cur,old){
          if(cur.success){
            this.userLogo = cur.data.avatarUrl + '?time' + new Date().getTime();
            this.isVip = cur.data.vipSign;
          }else{
            this.$Message.error(cur.message);
          }
        },
        deep:true
      },
    }
  }
</script>
<style>
  #editarticlemd input::-webkit-input-placeholder{color:#2c3e50;font-size:16px}
  #editarticlemd input:-moz-placeholder{color:#2c3e50;font-size:16px}
  #editarticlemd input::-moz-placeholder{color:#2c3e50;font-size:16px}
  #editarticlemd input:-ms-input-placeholder{color:#2c3e50;font-size:16px}
  #editarticlemd input{font-size: 16px;}
  .edit_articel_markdown .ivu-form .ivu-form-item-label{font-size: 14px;}
  .edit_articel_markdown .ivu-form-item {margin-bottom: 10px;}
  .edit_articel_markdown .imageCode .ivu-input-group-append{padding:0 !important;}
  #editarticlemd .v-right-item button:last-child{color: #2d8cf0 !important;}
</style>
<style scoped>
  #editarticlemd h1{font-size:24px;font-weight:400;line-height:33px;color: #000000;}
  .ivu-col{padding:7px 0;}
  .input-lable{font-size:14px;font-family:PingFang SC;font-weight:400;line-height:32px;display: inline-block;}
  .markdown-body{width:99vw;height:90vh;border-left:1px solid #fff;background-color:white;position:relative;overflow:visible;}
  .markdown-body *{list-style: decimal;}
  .tag-nodate-tips{    width:inherit;height:30px;overflow:auto;margin:5px 0;padding:5px 0;background-color:#fff;box-sizing:border-box;border-radius:4px;box-shadow:0 1px 6px rgba(0,0,0,.2);position:absolute;z-index:900;min-width:450px;position:absolute;will-change:top,left;transform-origin:center top 0px;top:40px;left:73px;}
  .tag-nodate-tips span{    margin:0;line-height:normal;padding:7px 16px;clear:both;color:#57a3f3;font-size:12px!important;white-space:nowrap;list-style:none;cursor:pointer;transition:background .2s ease-in-out;}
  .refushcode{cursor: pointer;}
  .refushcode:hover{color:#2d8cf0;}

  #editarticlemd .logo{margin:0 10px;width: 35px;height: 35px;line-height: 35px;display: inline-block;}
  #editarticlemd .vip-crown{position:absolute;margin-left:21px;margin-top:-50px;width:30px;-webkit-transform:rotate(9deg);transform:rotate(9deg);}
</style>
