<template>
  <div class="private">
    <div class="private_wrapper">
      <div class="left_menu">
        <router-link to="/private">
        <div class="item active">
          <i class="ivu-icon i-icon icon-gper-mail"></i>
          <span class="text">私信</span>
          <Icon type="ios-arrow-down" class="menu-right"/>
        </div>
        </router-link>
      </div>
      <div class="right_content">
        <div class="menu_title">发送私信给 <router-link v-if="list.length>0" :to="{path:'/personal/dynamic/' + fromUserId}">  <span class="to_name">{{list[0].toUserName}}</span></router-link></div>
        <div class="border"></div>
        <div class="textContent">
          <textarea rows="6" maxlength="300" v-model="privateContent"
                    @keyup="contentChange"
                    @change ="contentChange"
                    placeholder="请输入私信内容"></textarea>
          <span class="count_num">已输入{{countNum}}/300</span>
        </div>
        <div class="clear btn_wrapper">
          <span class="submit_btn" @click="submitContent">提交</span>
        </div>
        <div class="private_con">
          <div  v-for="(item,i) in list" :key="i" class="private_item">
            <div class="user_info">
              <router-link v-if="item.fromUserId.toString()!==userid"  :to="{path:'/personal/dynamic/' + fromUserId}">
              <Avatar  icon="ios-person" class="user_image" :src="item.toAvatarUrl"/>
                <img v-if="item.vipSign" class="vip-crown" src="../../../static/img/crown.svg">
              </router-link>
              <router-link v-else :to="{path:'/personal/dynamic/' + userid}">
              <Avatar  icon="ios-person" class="user_image" :src="avatar"/>
                <img v-if="userNes.data.vipSign" class="vip-crown" src="../../../static/img/crown.svg">
              </router-link>
              <router-link v-if="item.fromUserId.toString()!==userid"  :to="{path:'/personal/dynamic/' + fromUserId}">
                <span class="userName" >{{item.toUserName}}</span>
              </router-link>
              <router-link  v-else  :to="{path:'/personal/dynamic/' + userid}">
              <span  class="userName"> 我</span>
              </router-link>
              <span class="create_time">{{item.createdAt | formatDate}}</span>
            </div>
            <div class="item_content">{{item.content}}</div>
            <div class="buttonBar">
              <span @click="reply" >  <i class="ivu-icon i-icon icon-gper-mail"></i>回复</span>
              <span  @click="del_private_show = true;del_private_id = item.id;del_private_type = item.fromUserId==userid?'fromDeleted':'toDeleted';">  <i class="ivu-icon i-icon icon-gper-delete_icon"></i>删除</span>
            </div>
          </div>
        </div>
        <div class="answers_page" v-if="total > 0">
          <Page  class="pager" :total="total"  @on-change="get_page_search" />
        </div>
      </div>

    </div>
    <Modal
      v-model="del_private_show"
      title="提示"
      @on-ok="del_private_state"
      @on-cancel="cancel">
      <p>确认删除这条私信信息？</p>
    </Modal>
  </div>
</template>

<script>
  import Cookies from "js-cookie"
  export default {
    name: "privateDetail",
    data() {
      return {
        userid:Cookies.get("userId"),
        avatar: '',
        list: [],
        total: 0,
        fromUserId: this.$route.query.fromUserId, //给谁发送私信
        queryParam: {
          pageNum:"1",
          pageSize:"10",
          id:this.$route.query.id,
        },
        del_private_show: false,
        del_private_id: '',
        del_private_type: '',
        privateContent: '', // 发送私信的内容
        countNum: 0
      }
    },
    mounted () {
      this.getList()
      this.$store.dispatch('getUserInfo');
    },
    methods: {
      getList () {
        this.$post('message/pageQueryDetail',this.queryParam).then((res) =>{
          this.list = res.data.data.list;
          this.total = res.data.data.total;
        });
      },
      get_page_search (i) {
        this.queryParam.pageNum = i;
        this.getList()
      },
      del_private_state(){//删除私信的情况
        var param = {id:this.del_private_id, type: this.del_private_type};
        this.$post('message/deleteMessagesById',param).then((res) =>{
          if(res.data.success){
            this.$Message.success('删除成功');
            this.del_private_show = false;
            this.del_private_id = '';
            this.getList();
          }else{
            this.$Message.error('删除失败');
            this.del_private_show = false;
            this.del_private_id = '';
          }
        })
      },
      cancel(){
        this.del_private_show = false;
      },
      reply () {
        let textarea = document.getElementsByTagName('textarea');
        textarea[0].focus();
      },
      contentChange () {
        this.privateContent = this.privateContent.substring(0, 300);
        this.countNum = this.privateContent.length
      },
      submitContent () {
        if (!this.privateContent.trim()) return
        var param= {
          content: this.privateContent,
          fromUserId: Cookies.get("userId"),
          toUserId: this.$route.query.fromUserId,
        };
        this.$post('message/addMessages',param).then((res) =>{
          if(res.data.success){
            this.privateContent = '';
            this.$Message.success('发送成功');
            this.getList();
          }else{
            this.$Message.error('发送失败');
          }
        });
      }
    },
    computed: {
      userNes(){
        return this.$store.state.login.userResult;
      }
    },
    watch: {
      userNes:{
        handler(curr,old){
          if(curr.success){
            this.avatar = curr.data.avatarUrl;
          }
        },
        deep:true
      },
    }
  }
</script>

<style scoped>
  @import './private.css';
</style>
