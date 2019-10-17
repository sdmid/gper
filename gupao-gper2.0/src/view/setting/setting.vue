<template>
  <div id="setting">
    <Layout>
      <Layout>
        <Sider hide-trigger style="width: 194px;min-width: 194px;max-width: 194px;flex: 0 0 194px;margin-right: 6px;">
          <Menu theme="light" :active-name="checkMenu" width="164">
            <MenuItem name="1" :to="{name:'Iinformation',params:{userid:$route.params.userid}}">
              <Icon type="ios-contact" />
              个人资料
              <Icon v-if="checkMenu=='1'" type="ios-arrow-down" style="margin-left: 41px;"/>
              <Icon v-else type="ios-arrow-forward" style="margin-left: 41px;"/>
            </MenuItem>
            <MenuItem name="2" :to="{name:'ResetPassword',params:{userid:$route.params.userid}}">
              <Icon type="md-lock" />
              修改密码
              <Icon v-if="checkMenu=='2'" type="ios-arrow-down" style="margin-left: 41px;"/>
              <Icon v-else type="ios-arrow-forward" style="margin-left: 41px;"/>
            </MenuItem>
            <MenuItem name="3" :to="{name:'Bindphone',params:{userid:$route.params.userid}}">
              <Icon type="md-phone-portrait" />
              更改手机
              <Icon v-if="checkMenu=='3'" type="ios-arrow-down" style="margin-left: 41px;"/>
              <Icon v-else type="ios-arrow-forward" style="margin-left: 41px;"/>
            </MenuItem>
            <MenuItem name="4" :to="{name:'Bindaccount',params:{userid:$route.params.userid}}">
              <Icon type="logo-codepen" />
              账号绑定
              <Icon v-if="checkMenu=='4'" type="ios-arrow-down" style="margin-left: 41px;"/>
              <Icon v-else type="ios-arrow-forward" style="margin-left: 41px;"/>
            </MenuItem>
          </Menu>

        </Sider>
        <Content>
          <router-view ></router-view>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
  export default {
    name:"personal",
    data(){
      return {
        checkMenu:'1',
        users:{
          id:''
        },
        other:{},
        hasOwner:false
      }
    },
    mounted(){
      this.initOtherUser();
      this.setMenuCheck(this.$route.path);
    },
    methods:{
      initOtherUser(){
        this.users.id = this.$route.params.userid;
        if(this.$cookie.get("userId") == this.users.id){
          this.hasOwner = true;
        }else{
          this.hasOwner = false;
        }
        this.$store.dispatch('othergetUserInfo',this.users.id);
      },
      setMenuCheck(path){
        if(path.includes('my_information')){
          this.checkMenu = '1';
        }else if(path.includes('reset_password')){
          this.checkMenu = '2';
        }else if(path.includes('bind_phone')){
          this.checkMenu = '3';
        }else if(path.includes('bind_account')){
          this.checkMenu = '4';
        }else{
          this.menuIndex = '1';
        }
      },
    },
    computed:{
      otherUser(){
        return this.$store.state.person.otheruserInfoData;
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
      '$route'(to, from) {
        this.initOtherUser();
        this.setMenuCheck(to.path);
      }
    }
  }
</script>
<style>
  #setting .ivu-menu{background: #F7F7F7;}
  #setting .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {color:#ffffff;background:#2d8cf0;padding:10px 24px; }
  #setting .ivu-menu-vertical .ivu-menu-item, .ivu-menu-vertical .ivu-menu-submenu-title{padding: 10px 24px;}
  #setting .ivu-menu-vertical.ivu-menu-light:after{content: none;}
</style>
<style scoped>
  #setting {margin: 0 70px;}
  #setting .layout{width:100%;height:100%}
  #setting .ivu-layout{background:none}
  #setting .ivu-layout-sider{background:none;}
  #setting .ivu-layout-content{min-height:800px;width:1280px;margin-left:46px;}
  .user-title{display:inline-block;line-height:28px;font-size:15px;margin-left:10px;font-weight:400;}
  .basic-information{margin:62px 31px 70px 51px;height:85px;display: block;}
  .basic-information .logo{display: block;margin:0 auto;height: 85px;width: 85px;border-radius: 50%;float:left;}
  .basic-information .content{padding-left:27px;height: 85px;display: block;float:left;}
  .basic-information .content .h1{display: block;font-size:20px;font-weight:400;line-height:28px;color:black;}
  .basic-information .content .h2{display: block;height: 20px;width:auto;margin: 6px 0;color:black;}
  .basic-information .content .h2 span{display: block;font-size:14px;font-weight:400;margin-right:15px;line-height:20px;float: left;}
  .basic-information .content .h3{display: block;height: 20px;width:auto;color:black;}
  .basic-information .content .h3 span{display: block;font-size:12px;font-weight:400;margin-right:15px;line-height:20px;float: left;}
  .right-btn{float:right;display: block;height: 85px;margin: 26.5px 0;}
  .right-btn .ivu-btn{display: block;}
  .vip-crown{position:absolute;margin-left:-53px;margin-top:-30px;width:60px;-webkit-transform:rotate(9deg);transform:rotate(9deg);}
</style>
