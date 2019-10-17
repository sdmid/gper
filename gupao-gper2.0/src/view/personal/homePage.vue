<template>
  <div id="personal">
    <Layout>
      <Header>
        <div class="basic-information">
          <div class="logo">
            <Avatar icon="ios-person" size="large" class="logo" :src="other.avatarUrl +'?time'+ new Date().getTime()"/>
            <img v-if="other.vipSign" class="vip-crown" src="../../../static/img/crown.svg">
          </div>
          <div class="content">
            <span class="h1">
              {{other.name}}
              <span class="user-title" v-if="other && other.title">- {{other.title}}</span>
            </span>
            <div class="h2">
              <span v-if="other.userData && other.userData.creditsTitle">{{other.userData.creditsTitle}}</span>
              <span v-if="other && other.provinceCity">{{other.provinceCity}}</span>
              <span v-if="other.userData && other.userData.coins">金币：{{other.userData.coins}}</span>
              <span v-if="other.userData && other.userData.supports">获得问答认同：{{other.userData.supports}}</span>
              <span v-if="other.userData && other.userData.adoptions">被采纳：{{other.userData.adoptions}}</span>
              <span v-if="other.userData && other.userData.views">访客：{{other.userData.views}}</span>
            </div>
            <div class="h3">
              <span>入驻时间：{{other.createdAt}}</span>
            </div>
          </div>
          <div class="right-btn">
            <Button v-show="hasOwner" class="set" size="large" type="primary" @click="goSetting">
              <Icon custom="icon-gper-bianji1" size="19" color="#ffffff" class="icon"></Icon>编辑个人资料</Button>
            <div v-if="!hasOwner">
              <i-button class="btn" v-show="attenDetalRes.data" @click="cancelatten" type="primary">已关注</i-button>
              <i-button class="btn border" v-show="!attenDetalRes.data" @click="attenact">关注</i-button>

              <i-button class="btn" type="primary"  @click="toMakeAnswer">向他求助</i-button>
              <i-button class="btn border" @click="show_private_mes" >发私信</i-button>
            </div>
          </div>
        </div>
      </Header>
      <Layout>
        <Sider hide-trigger style="width: 194px;min-width: 194px;max-width: 194px;flex: 0 0 194px;margin-right: 6px;">
          <Menu theme="light" width="200" :active-name="itemName" @on-select="selectMenuItem">
            <MenuItem name="TAdynamic">
              <Icon type="ios-happy" />
              动态
              <Icon v-if="itemName==='TAdynamic'" type="ios-arrow-down" class="menu-right"/>
              <Icon v-else type="ios-arrow-forward" class="menu-right"/>
            </MenuItem>
            <MenuItem name="TAanswer">
              <Icon type="ios-chatbubbles" />
              回答
              <Icon v-if="itemName=='TAanswer'" type="ios-arrow-down" class="menu-right"/>
              <Icon v-else type="ios-arrow-forward" class="menu-right"/>
            </MenuItem>
            <MenuItem name="TAquestion">
              <Icon type="md-chatbubbles" />
              提问
              <Icon v-if="itemName=='TAquestion'" type="ios-arrow-down" class="menu-right"/>
              <Icon v-else type="ios-arrow-forward" class="menu-right"/>
            </MenuItem>
            <MenuItem name="TAarticle">
              <Icon type="md-clipboard" />
              文章
              <Icon v-if="itemName=='TAarticle'" type="ios-arrow-down" class="menu-right"/>
              <Icon v-else type="ios-arrow-forward" class="menu-right"/>
            </MenuItem>
            <Divider/>
            <MenuItem name="TAgold">
              <Icon type="logo-usd" />
              金币
              <Icon v-if="itemName=='TAgold'" type="ios-arrow-down" class="menu-right"/>
              <Icon v-else type="ios-arrow-forward" class="menu-right"/>
            </MenuItem>
            <MenuItem name="TAexperience">
              <Icon type="logo-vimeo" />
              经验
              <Icon v-if="itemName=='TAexperience'" type="ios-arrow-down" class="menu-right"/>
              <Icon v-else type="ios-arrow-forward" class="menu-right"/>
            </MenuItem>
            <MenuItem v-show="hasOwner" name="TAfavorites">
              <Icon type="ios-star" />
              收藏
              <Icon v-if="itemName=='TAfavorites'" type="ios-arrow-down" class="menu-right"/>
              <Icon v-else type="ios-arrow-forward" class="menu-right"/>
            </MenuItem>
            <MenuItem name="TAfans">
              <Icon type="ios-heart" />
              粉丝
              <Icon v-if="itemName=='TAfans'" type="ios-arrow-down" class="menu-right"/>
              <Icon v-else type="ios-arrow-forward" class="menu-right"/>
            </MenuItem>
            <MenuItem v-show="hasOwner" name="TAredeem">
              <Icon type="md-git-compare" />
              兑换
              <Icon v-if="itemName=='TAredeem'" type="ios-arrow-down" class="menu-right"/>
              <Icon v-else type="ios-arrow-forward" class="menu-right"/>
            </MenuItem>
            <Divider/>
            <MenuItem v-show="hasOwner && user.data.vipSign" name="TAaudit">
              <Icon type="md-hand" />
              众审中心
              <Icon v-if="itemName=='TAaudit'" type="ios-arrow-down" class="menu-right"/>
              <Icon v-else type="ios-arrow-forward" class="menu-right"/>
            </MenuItem>
          </Menu>
        </Sider>
        <Content>
          <router-view ></router-view>
        </Content>
      </Layout>
    </Layout>
    <modal v-model="modal_private" width="560">
      <p slot="header">
        <span style="font-weight: 400">发送私信</span>
      </p>
      <div >
        <p style="font-weight: bold;">发送给：<span style="font-weight: 400">{{other.name}}</span></p>
        <p style="font-weight: bold;">内容：</p>
        <Input v-model="privateMessage" type="textarea" :rows="4"/>
      </div>
      <div slot="footer">
        <Button @click="modal_private = false">取消</Button>
        <Button type="primary" @click="send_private_mes">发送</Button>
      </div>
    </modal>
  </div>
</template>
<script>
  export default {
    name:"personal",
    data(){
      return {
        itemName:'TAdynamic',
        users:{
          id:''
        },
        other:{},
        hasOwner:false,
        modal_private:false,
        privateMessage:'',
        attenParam:{//关注参数
          userId:"",
          sourceId:"",
          sourceType:"",
        }
      }
    },
    mounted(){
      this.initOtherUser();
      this.setMenuCheck(this.$route.path);
      this.check_atten_state()
    },
    methods:{
      initOtherUser(){
        this.users.id = this.$route.params.userid;
        if(this.$cookie.get("userId") === this.users.id){
          this.hasOwner = true;
        }else{
          this.hasOwner = false;
        }
        this.$store.dispatch('othergetUserInfo',this.users.id);
      },
      setMenuCheck(path){
        if(path.includes('dynamic')){
          this.itemName = "TAdynamic";
        }else if(path.includes('answer')){
          this.itemName = "TAanswer";
        }else if(path.includes('question')){
          this.itemName = "TAquestion";
        }else if(path.includes('article')){
          this.itemName = "TAarticle";
        }else if(path.includes('fans')){
          this.itemName = "TAfans";
        }else if(path.includes('favorites')){
          this.itemName = "TAfavorites";
        }else if(path.includes('gold')){
          this.itemName = "TAgold";
        }else if(path.includes('experience')){
          this.itemName = "TAexperience";
        }else if(path.includes('redeem')){
          this.itemName = "TAredeem";
        }else if(path.includes('audit')){
          this.itemName = "TAaudit";
        }else{
          this.itemName = "TAdynamic";
        }
      },
      check_atten_state(){//查看关注的情况
        this.$store.state.action.attenDetal.userId = this.$cookie.get("userId");
        this.$store.state.action.attenDetal.sourceId = this.$route.params.userid;
        this.$store.state.action.attenDetal.sourceType="App\\Models\\User";
        this.$store.dispatch('attenDetail')
      },
      cancelatten(){//取消关注
        if(this.handleLoginActive()){
          this.attenParam.userId = this.$cookie.get("userId");
          this.attenParam.sourceId = this.$route.params.userid;
          this.attenParam.sourceType = "App\\Models\\User";

          this.$post('attention/cancelAttentions',this.attenParam).then((res)=>{
          });
          setTimeout(()=>{
            this.check_atten_state()
          },50)
        }
      },
      attenact(){//添加关注
        if(this.handleLoginActive()){
          this.attenParam.userId=this.$cookie.get("userId");
          this.attenParam.sourceId=this.$route.params.userid;
          this.attenParam.sourceType="App\\Models\\User";
          this.$post('attention/addAttentions', this.attenParam).then((res) =>{
          });
          setTimeout(()=>{
            this.check_atten_state()
          },50)
        }
      },
      toMakeAnswer(){
        if(this.handleLoginActive()){
          this.$router.push({
            path:'/questioning',
            query:{
              toUserid:this.other.userData.userId,
              toName: this.other.name
            }
          })
        }
      },
      show_private_mes(){
        if(this.handleLoginActive()){
          this.modal_private = true;
        }
      },
      send_private_mes(){//发私信动作
        this.$store.state.action.private_mes_pa.content=this.privateMessage;
        this.$store.state.action.private_mes_pa.fromUserId=this.$cookie.get("userId");
        this.$store.state.action.private_mes_pa.toUserId=this.$route.params.userid;
        this.$store.dispatch("sendPrivatMes");
      },
      goSetting(){
        this.$router.push({name: 'Iinformation'});
      },
      selectMenuItem(name){
        this.itemName = name;
        this.$router.push({name:name,params:{userid:this.$route.params.userid}});
      },
      handleLoginActive(){
        if(this.$cookie.get('isSightseer') === 'true'){
          this.$store.state.login.isSightseer = !this.$store.state.login.isSightseer;
          return false;
        }else if(this.$cookie.get('isActive') !== 'true'){
          this.$store.state.login.isActivated = !this.$store.state.login.isActivated;
          return false;
        }else{
          return true;
        }
      },
    },
    computed:{
      otherUser(){
        return this.$store.state.person.otheruserInfoData;
      },
      user(){
        return this.$store.state.login.userResult;
      },
      attenDetalRes(){
        return this.$store.state.action.attenDetalRes
      },
      private_res(){//发送私信的结果
        return this.$store.state.action.private_res;
      }
    },
    watch: {
      otherUser:{
        handler(cur,old){
          if(cur.success){
            this.other = cur.data;
            document.title = cur.data.name +'的主页 - GPer生态圈';
          }
        },
        deep:true
      },
      private_res:{
        handler(curr,old){
          if(curr.success){
            this.$Message.success(curr.message);
            this.modal_private = false;
            this.privateMessage = '';
          }else{
            this.$Message.error(curr.message);
            this.modal_private = false;
            this.privateMessage = '';
          }
        },
        deep:true
      },
      '$route'(to, from) {
        this.initOtherUser();
        this.setMenuCheck(to.path);
      }
    }
  }
</script>
<style>
  #personal .ivu-layout-sider .ivu-menu{background: #F7F7F7;}
  #personal .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {color:#ffffff;background:#2d8cf0;padding:10px 24px; }
  #personal .ivu-menu-vertical .ivu-menu-item, .ivu-menu-vertical .ivu-menu-submenu-title{padding: 10px 24px;}
  #personal .ivu-menu-vertical.ivu-menu-light:after{content: none;}
</style>
<style scoped>
  #personal{margin: 0 72px;}
  #personal .layout{width:100%;height:100%}
  #personal .ivu-layout{background:none}
  #personal .ivu-layout-header{width:100%;padding:0;height:217px;line-height:217px;background-color: #c4e2ff;
    background:url("../../../static/img/personal-title-bg.png") no-repeat center center;background-size: 100% 100%;}
  #personal .ivu-layout-sider{background:none;margin-top: 29px;}
  #personal .ivu-layout-content{min-height:800px;width:1280px;margin:29px 0 0 15px;margin-left: 41px;}
  .user-title{display:inline-block;line-height:28px;font-size:15px;margin-left:10px;font-weight:400;}
  .basic-information{margin:62px 31px 70px 51px;height:85px;display: block;}
  .basic-information .logo{display: block;margin:0 auto;height: 85px;width: 85px;border-radius: 50%;float:left;}
  .basic-information .content{padding-left:27px;height: 85px;display: block;float:left;}
  .basic-information .content .h1{display: block;font-size:20px;font-weight:400;line-height:28px;color:black;}
  .basic-information .content .h2{display: block;height: 20px;width:auto;margin: 6px 0;color:black;}
  .basic-information .content .h2 span{display: block;font-size:14px;font-weight:400;margin-right:15px;line-height:20px;float: left;}
  .basic-information .content .h3{display: block;height: 20px;width:auto;color:black;}
  .basic-information .content .h3 span{display: block;font-size:12px;font-weight:400;margin-right:15px;line-height:20px;float: left;}
  .right-btn{float:right;display: block;margin: 34px 0; line-height: normal;}
  .right-btn .set{display: block;color: #ffffff;width:143px;height:32px;border-radius:3px;line-height:20px;padding: 6px 15px 6px 12px;}
  .right-btn .set .icon{padding-bottom: 5px;padding-right: 13px;border: none;}
  .vip-crown{position:absolute;margin-left:-53px;margin-top:-30px;width:60px;-webkit-transform:rotate(9deg);transform:rotate(9deg);}

  .menu-right{float: right;padding-top: 4px;}
  .right-btn .btn {margin-right: 5px;}
  .right-btn .btn.border {border: 1px solid #2b85e4; color: #2b85e4;}
</style>
