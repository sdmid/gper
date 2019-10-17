<template>
    <div class="private">
      <div class="private_wrapper">
        <div class="left_menu">
          <div class="item active">
            <i class="ivu-icon i-icon icon-gper-mail"></i>
            <span class="text">私信</span>
            <Icon type="ios-arrow-down" class="menu-right"/>
          </div>
        </div>
        <div class="right_content">
          <div class="menu_title">全部私信</div>
          <div class="border"></div>
          <div class="code_box">
            <button @click="update_message_byUserId">全部标记为已读</button>
          </div>
          <div class="private_con">
            <div  v-for="(item,i) in list" :key="i" class="private_item">
              <div class="user_info">
                <router-link  :to="{path:'/personal/dynamic/' + item.fromUserId}">
                <Avatar icon="ios-person" class="user_image" :src="item.fromAvatarUrl"/>
                  <img v-if="item.vipSign" class="vip-crown" src="../../../static/img/crown.svg">
                </router-link>
                <router-link  :to="{path:'/personal/dynamic/' + item.fromUserId}">
                <span class="userName">{{item.fromUserName}}</span>
                </router-link>
                <span class="create_time">{{item.createdAt | formatDate}}</span>
              </div>
              <div class="item_content">{{item.content}}</div>
              <div class="buttonBar">
                <span class="detail" @click="toPrivateDetail(item.id,item.fromUserId)">查看详情</span>
                <!--<span @click="toPrivateDetail(item.id,item.fromUserId)"> <i class="ivu-icon i-icon icon-gper-mail"></i>回复</span>-->
                <span  @click="del_private_show = true;del_private_id = item.fromUserId;">  <i class="ivu-icon i-icon icon-gper-delete_icon"></i>删除</span>
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
        name: "private",
      data() {
          return {
            list: [],
            total: 0,
            queryParam: {
              pageNum:"1",
              pageSize:"10",
              userId:"",
            },
            del_private_show: false,
            del_private_id: ''
          }
      },
      mounted () {
          this.getList()
      },
      methods: {
        getList () {
          this.queryParam.userId = Cookies.get("userId");
          this.$post('message/pageQuery',this.queryParam).then((res) =>{
            this.list = res.data.data.list;
            this.total = res.data.data.total;
          });
        },
        get_page_search (i) {
            this.queryParam.pageNum = i;
            this.getList()
        },
        del_private_state(){//删除私信的情况
          var param = {fromUserId:this.del_private_id, userId: Cookies.get("userId")};
          this.$post('message/deleteMessagesByUserId',param).then((res) =>{
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
        update_message_byUserId(){//私信 全部标记为已读
          var param = {userId: Cookies.get("userId")};
          this.$get('message/updateReadByUserId',param).then((res) =>{
            if(res.data.success){
              this.$Message.success('全部标记为已读成功');
              this.$store.dispatch("getPrivateMesNum");// 未读通知数
            }else{
              this.$Message.error('全部标记为已读失败');
            }
          })
        },
        cancel(){
          this.del_private_show = false;
        },
        toPrivateDetail (id, fromUserId) {
          this.$router.push({
            path:'/private/detail',
            query:{
              id:id,
              fromUserId: fromUserId
            }
          });
        }
      }
    }
</script>

<style scoped>
  @import './private.css';
</style>
