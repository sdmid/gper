<template>
  <div id="header">
    <Menu mode="horizontal" theme="light" :active-name="menuActive">
      <div class="layout-logo">
        <img src="../../../static/img/GPer2.png">
      </div>
      <div class="layout-nav">
        <MenuItem name="home" width="200" to="/index">
          首页
        </MenuItem>
        <MenuItem name="article" to="/article">
          文章
        </MenuItem>
        <MenuItem name="bubbling" to="/bubbling">
          冒泡
        </MenuItem>
        <MenuItem name="shop" to="/shop">
          商城
        </MenuItem>
      </div>
      <div class="layout-search">
        <Input v-model="searchValue" size="large" placeholder="搜索问题或关键字" search @on-search="handleSearch">
          <Select v-model="searchType" size="large" slot="prepend" style="width: 80px">
            <Option :value="item.value" :key="item.value" v-for="item,index in searchTypes">{{item.name}}</Option>
          </Select>
        </Input>
      </div>

      <div class="layout-message" v-if="!isSightseer">
        <Button type="primary" size="large" @click="toQuestion" style="padding: 7.64px 17px 7px;line-height: 20px;">我要提问</Button>

        <div style="float: right;">
          <div class="avatar-badge">
            <Badge :count="privateNum">
              <router-link to="/private">
                <!--<Icon type="ios-mail-outline" color="black" size="26"></Icon>-->
                <Icon custom="i-icon icon-gper-mail" color="black" size="19"/>
            </router-link>
            </Badge>
          </div>

          <div class="avatar-badge">
            <Badge :count="noticeNum">
              <router-link to="/message">
                <!--<Icon type="ios-notifications-outline" color="black" size="26"></Icon>-->
                <Icon custom="i-icon icon-gper-notifications" color="black" size="19"/>
              </router-link>
            </Badge>
          </div>

          <Dropdown trigger="click" @on-click="handleDropClick">
            <a href="javascript:void(0)">
              <Avatar icon="ios-person" size="large" class="logo" :src="userLogo"/>
              <img v-if="isVip" class="vip-crown" src="../../../static/img/crown.svg">
            </a>
            <DropdownMenu slot="list" >
              <DropdownItem name="myhome">
                <div>我的主页</div>
                <!--@click="toPersonPage"-->
              </DropdownItem>
              <DropdownItem name="setting">
                <div>账号设置</div>
                <!--@click="toSetting"-->
              </DropdownItem>
              <DropdownItem divided name="exit">
                <div>退出</div>
                <!--@click="handleExit"-->
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      <div class="layout-message" v-if="isSightseer">
        <Button type="primary" size="large" @click="toQuestion" style="padding: 7.64px 17px 7px;line-height: 20px;">我要提问</Button>
        <div style="float: right;">
          <Button size="large" @click="toLogin" style="padding: 8px 17px 7px 17px;line-height: 20px;">立即登录</Button>
          <Button type="primary" size="large" @click="toRegister" style="padding: 8px 17px 7px 17px;line-height: 20px;">免费注册</Button>
        </div>
      </div>
    </Menu>

    <Modal v-model="showLogin" footer-hide>
      <p style="font-size: 14px;">您还没有登录，点击<a href="javascript:void(0);" @click="toLogin">此处</a>登录</p>
    </Modal>

    <Modal v-model="showActive">
      <p slot="header">
        <span style="font-size: 16px;">请激活账号</span>
      </p>
      <div style="font-size: 14px;">
        <p>为了正常使用查看文章、评论、关注等功能，请根据提示激活您的账号</p>
        <p>激活邮件已经发送至<span style="font-weight: bold;">{{email}}</span>，请注意查收（注意检查回收站、垃圾箱中是否有激活邮件）</p>
        <p>如果仍未收到，请尝试<a href="javascript:void(0);" @click="userSendEmail">重新发送激活邮件</a></p>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" @click="showActive = false">关闭</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
  import axios from 'axios';
  import lodash from "lodash";

  export default {
    data(){
      return {
        menuActive:'',
        searchValue:'',
        searchType:'answer',
        searchTypes:[{
          name:'问答',
          value:'answer'
        },{
          name:'文章',
          value:'articles'
        },/*{
          name:'标签',
          value:'tags'
        },*/{
          name:'用户',
          value:'users'
        }],
        userLogo:'',
        email:'',
        isSightseer:true,//是否游客
        isActive:false,//是否激活
        isVip:false,//是否VIP
        noticeNum:0,//是否有未读消息
        privateNum:0,
        active_status:true,

        showLogin:false,
        showActive:false
      }
    },
    mounted(){
      this.setHearMenuActiveName(this.$route.path);
      var userId = this.$cookie.get("userId");
      if(userId != undefined){
        this.$store.dispatch('getUserInfo');//查询用户信息
        this.$store.dispatch("getNoticeNum");// 未读通知数
        this.$store.dispatch('getPrivateMesNum');//未读私信数
      }else{
        this.visitorLogin();
      }
    },
    methods: {
      setHearMenuActiveName(path){//设置菜单选中
        if(path.includes('index')){
          this.menuActive = 'home';
        }else if(path.includes('answer/detail')){
          this.menuActive = 'home';
        }else if(path.includes('article')){
          this.menuActive = 'article';
        }else if(path.includes('bubbling')){
          this.menuActive = 'bubbling';
        }else if(path.includes('shop')|| path.includes('good/detail')){
          this.menuActive = 'shop';
        }else{
          this.menuActive = 'other';
        }
      },
      handleExit(){//退出
        this.$get('users/logout', {userId:this.$cookie.get('userId')}).then((res) =>{
          if (res.data.success) {
            this.$common.clearCookies();
            this.$Message.success(res.data.message);
            var _this = this;
            setTimeout(function(){
              _this.$router.push({path:'/login'});
            },1000);
          } else {
            this.$Message.error(res.data.message);
          }
        });
      },
      visitorLogin(){//游客登录
        this.$common.clearCookies();
        axios({method: 'GET',url: 'genera/init'}).then(response=>{
          if(response.data.success){
            this.$cookie.set("userId","-1",{expires:30});
            var visitorToken = response.data.data.visitorToken;
            this.$cookie.set('visitorToken',visitorToken,{expires:30});
            axios({method: 'GET',url: 'genera/times',headers: {'Content-Type':'application/json;charset=UTF-8','visitorToken': visitorToken}}).then(response=>{
              var timestamp = response.data.data.timestamp;
              this.$cookie.set('timestamp',new Date().getTime(),{expires:30});
              this.$cookie.set('aptimestamp',timestamp,{expires:30});
              setTimeout(function(){
							  //window.location.reload();
						  },500);
            });

          }
        }).catch(err=>{});
      },
      handleSearch(){
        this.$router.push({
          path:'/search',
          query:{
            type:this.searchType,
            value:this.searchValue
          }
        });
        //this.searchType = 'all';
        this.searchValue = '';
      },
      toLogin(){
        this.$common.clearCookies();
        this.$cookie.set("login_back_href", this.getUrlRelativePath(),{expires:30});
        this.$router.push({path:'/login'});
      },
      getUrlRelativePath(){
        var url = document.location.toString();
        var arrUrl = url.split("//");
        var start = arrUrl[1].indexOf("/");
        var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符
        return relUrl;
      },
      toRegister(){
        this.$common.clearCookies();
        this.$router.push({path:'/register'});
      },
      toQuestion(){
        if(this.handleLoginActive()){
          this.$router.push({path:'/questioning'});
        }
      },
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
      userSendEmail(){
        this.$post('auth/userSendEmail', {email:this.email}).then((res) =>{
          if(res.data.success){
            this.$store.state.login.hasLoginActive = false;
            this.active_status = false;
            this.$Message.success('重新发送激活邮件成功，请前往邮箱中点击激活');
          }else{
            this.$Message.error(res.data.message);
          }
        });
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
      handleSightseer(){
        if(this.$cookie.get('isSightseer') == 'true'){
          if(this.$route.path.indexOf('set') != -1){
            this.$router.push({path:'/index'});
          }
        }
      }
    },
    computed:{
      user(){
        return this.$store.state.login.userResult;
      },
      notice(){
        return this.$store.state.login.noticeResult;
      },
      private(){
        return this.$store.state.login.privateResult;
      },
      hasSightseer(){
        return this.$store.state.login.isSightseer;
      },
      hasActivated(){
        return this.$store.state.login.isActivated;
      }
    },
    watch:{
      '$route' (to, from) {
        this.setHearMenuActiveName(to.path);
        this.$store.dispatch('getUserInfo');
        this.$store.dispatch("getNoticeNum");
        this.$store.dispatch('getPrivateMesNum');
        this.handleSightseer();
      },
      user:{
        handler(cur,old){
          if(cur.success){
            this.email = cur.data.email;
            this.isActive = cur.data.status == 1 ? true : cur.data.status == 0 ? false : null;
            if(!this.isActive && cur.data.id != -1){
              this.$store.state.login.isActivated = !this.$store.state.login.isActivated;
            }
            this.userLogo = cur.data.avatarUrl + '?time' + new Date().getTime();
            this.isSightseer = cur.data.status == -1 ? true : false;
            this.isVip = cur.data.vipSign;
            this.$cookie.set('isSightseer',this.isSightseer,{expires:30});
            this.$cookie.set('isActive',this.isActive,{expires:30});
            this.handleSightseer();
          }else{
            //this.$Message.error(cur.message);
          }
        },
        deep:true
      },
      notice:{
        handler(cur,old){
          if(cur.success){
            this.noticeNum = cur.data;
          }else{
            this.noticeNum = 0;
          }
        },
        deep:true
      },
      private:{
        handler(cur,old){
          if(cur.success){
            this.privateNum = cur.data;
          }else{
            this.privateNum = 0;
          }
        },
        deep:true
      },
      hasSightseer:{
        handler(){
          if(this.isSightseer){
            this.showLogin = true;
          }
        },
        deep:true
      },
      hasActivated:{
        handler(){
          if(!this.isActive){
            this.showActive = true;
          }
        },
        deep:true
      },
    }
  }
</script>
<style>
  #header .ivu-menu-horizontal.ivu-menu-light:after{background:none;}
  #header{width:1280px;height:80px;margin:0 auto;position:relative;}
  #header .ivu-menu-light{background:none;}
  #header .ivu-menu-horizontal{height:78px;line-height:78px;margin: 0 72px;}
  #header .layout-logo{position:relative;top:14px;width:53px;height:53px;border-radius:53px;float:left;/*height: 80px;*/}
  #header .layout-nav{width:345px;height:100%;float:left;margin-left:20px;}
  #header .ivu-menu-item{font-size:16px;font-family: Helvetica Neue;color: #000000d9;margin: 0 22px;padding:0 5px;font-weight:400;}
  #header .ivu-menu-item.ivu-menu-item-selected{font-weight: bold;}
  #header .layout-search{width:331px;height:100%;float:left;margin-left:47px}
  #header .layout-search .ivu-input-wrapper{margin:20px 0}
  #header .layout-search input::-webkit-input-placeholder{font-size:14px;font-family:Helvetica Neue;font-weight:400;line-height:16px;color:rgba(24,144,255,1)}
  #header .layout-search input:-moz-placeholder{font-size:14px;font-family:Helvetica Neue;font-weight:400;line-height:16px;color:rgba(24,144,255,1)}
  #header .layout-search input:-ms-input-placeholder{font-size:14px;font-family:Helvetica Neue;font-weight:400;line-height:16px;color:rgba(24,144,255,1)}
  #header .ivu-input-group .ivu-input{height:38px !important;}
  #header .layout-message{float:left;width:327px;height:100%;margin-left:13px;}
  #header .avatar-badge{height:40px;width:40px;margin:0 5px;text-align:center;position:relative;display:inline-block}
  #header .logo{margin:0 10px;width: 35px;height: 35px;line-height: 35px;display: inline-block;}
  #header .vip-crown{position:absolute;margin-left:21px;margin-top:-70px;width:30px;-webkit-transform:rotate(9deg);transform:rotate(9deg);}
  #header .ivu-badge-count{top: 19px !important;right: 0px !important;}
  #header .ivu-badge-dot{top:24px !important;right:-5px !important;}
</style>
