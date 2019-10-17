<template>
    <div id="message">
      <div class="message_wrapper">
        <div class="left_menu">
          <div class="item " :class="{active:'notice'=== active}" @click="handleMenu('notice')">
            <i class="i-icon icon-gper-notifications"></i>
            <span class="text">通知</span>
            <Icon v-if="'notice'=== active" type="ios-arrow-down" class="menu-right"/>
            <Icon v-else type="ios-arrow-forward" class="menu-right"/>
          </div>
          <div class="item" :class="{active:'invent'=== active}" @click="handleMenu('invent')">
            <i class="i-icon icon-gper-yaoqinghaoyou"></i>
            <span class="text">邀请</span>
            <Icon v-if="'invent'=== active" type="ios-arrow-down" class="menu-right"/>
            <Icon v-else type="ios-arrow-forward" class="menu-right"/>
          </div>
          <div class="item" :class="{active:'announcement'=== active}" @click="handleMenu('announcement')">
            <i class="i-icon icon-gper-gonggao" ></i>
            <span class="text">公告</span>
            <Icon v-if="'announcement'=== active" type="ios-arrow-down" class="menu-right"/>
            <Icon v-else type="ios-arrow-forward" class="menu-right"/>
          </div>
        </div>
        <div class="right_content">
          <div class="menu_title">{{activeName}}</div>
          <div class="border"></div>
          <div class="code_box" v-if="showNotification">
            <button @click="update_notification_byUserId">全部标记为已读</button>
          </div>
          <div class="message-box">
            <ul v-if="active == 'notice'" >
              <li v-for="val in noticeList">
                <span class="yd"></span><span class="time">{{val.createdAt | formatDate}}</span>
                <p class="title" :class="val.isRead == 0 ?'unread':''">
                  <span @click="toUserDetail(val.userId)" style="cursor: pointer">{{val.userName}}</span>
                 <span class="action">{{val | getCoinAction}}</span>
                  <span @click="toDetail(val,val.type)" style="cursor: pointer">{{val.subject}}</span>
                </p>
              </li>
            </ul>
            <ul v-if="active == 'invent'">
              <li v-for="val in inventList">
                <span class="yd"></span><span class="time">{{val.createdAt | formatDate}}</span>
                <p class="title" :class="val.isRead == 0 ?'unread':''">
                  <span @click="toUserDetail(val.fromUserId)" style="cursor: pointer">{{val.userName}}</span>
                  <span class="action">  邀请你回答问题</span>
                  <span @click="toAnswersDetail(val.questionId)" style="cursor: pointer">{{val.title.length>40?val.title.slice(0,40)+'...':val.title}}</span>
                </p>
              </li>
            </ul>
            <ul v-if="active == 'announcement'">
              <li v-for="val in announcementList">
                <span class="yd"></span><span class="time">{{val.createdAt | formatDate}}</span>
                <p class="title">
                  <a :href="val.url" target="_blank">{{val.subject}}</a>
                </p>
              </li>
            </ul>
          </div>

          <div class="answers_page" v-if="messageTotal > 0">
            <Page  class="pager" :total="messageTotal" @on-change="get_page_search" />
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import Cookies from "js-cookie"
    export default {
        name: "message",
      data () {
          return {
            active: 'notice',
            activeName: '通知',
            showNotification: false,
            noticeList: [],
            inventList: [],
            announcementList: [],
            messageTotal: 0,
            noticePar:{//通知列表的参数
              pageNum:"1",
              pageSize:"10",
              userId:"",
            },
            inventPar:{//邀请列表的参数
              pageNum:"1",
              pageSize:"10",
              userId:"",
            },
            announcementPar:{//邀请列表的参数
              pageNum:"1",
              pageSize:"10"
            }
          }
      },
      filters:{
        /*通知类型（ adopt_answer 采纳 answer 回答 comment_answer 评论回答 comment_article 评论文章 comment_question 评论问题 comment_bubble 评论冒泡 follow_user 关注用户 reply_comment 评论回复）*/
        getCoinAction(val){
          switch(val.type){
            case 'adopt_answer':
              return '采纳了你的回答';
            case 'answer':
              return '回答了问题';
            case 'comment_answer':
              return '评论了你的回答';
            case 'comment_article':
              return '评论了文章';
            case 'comment_question':
              return '评论了问题';
            case 'comment_bubble':
              return '评论了冒泡';
            case 'follow_user':
              return ' 关注了你';
            case  'reply_comment':
              if(val.referType == 'question'){
                return '回复了问题 '+val.subject+' 中你的评论';
              }else if(val.referType == 'answer'){
                return '回复了回答 '+val.subject+' 中你的评论';
              }else if(val.referType == 'article'){
                return '回复了文章 '+val.subject+' 中你的评论';
              }else if(val.referType == 'bubble'){
                return '回复了冒泡 '+val.subject+' 中你的评论';
              }
          }
        }
      },
      mounted () {
          this.handleMenu(this.active)
      },
      methods: {
        handleMenu (menu) {
          if (menu) {
            this.active = menu;
          }
          if(this.active === 'notice'){
            this.activeName = '通知';
            this.showNotification = true;
            this.noticePar.userId = Cookies.get("userId");
            this.$post('notifications/pageQuery',this.noticePar).then((res) =>{
              this.noticeList = res.data.data.list;
              this.messageTotal = res.data.data.total;
            });
          }
          if(this.active === 'invent'){
            this.activeName = '邀请';
            this.showNotification = false;
            this.noticePar.userId = Cookies.get("userId");
            this.$post('invitation/pageQuery',this.noticePar).then((res) =>{
              this.inventList = res.data.data.list;
              this.messageTotal = res.data.data.total;
            });
          }
          if(this.active === 'announcement'){
            this.activeName = '公告';
            this.showNotification = false;
            this.$post('notice/selectNoticesByPage', this.announcementPar).then((res) =>{
              this.announcementList = res.data.data.list;
              this.messageTotal = res.data.data.total;
            })
          }
        },
        update_notification_byUserId(){//私信 全部标记为已读
          var param = {userId: Cookies.get("userId")};
          console.log(Cookies.get("userId"));
          this.$get('notifications/updateReadByUserId',param).then((res) =>{
            if(res.data.success){
              this.$Message.success('全部标记为已读成功');
              this.$store.dispatch("getNoticeNum");// 未读通知数
            }else{
              this.$Message.error('全部标记为已读失败');
            }
          })
        },
        get_page_search (i) {
          if(this.active === 'notice'){
            this.noticePar.pageNum = i;
            this.handleMenu()
          }
          if(this.active === 'invent'){
            this.inventPar.pageNum = i;
            this.handleMenu()
          }
          if(this.active === 'announcement') {
            this.handleMenu()
          }
        },
        toUserDetail(id){
          this.$router.push("/personal/dynamic/" + id)
        },
        toDetail(item,type){
          if(type == 'comment_answer'){
            var {href} = this.$router.resolve({//评论回答
              path:"/answer/detail/" + item.referId
            });
            window.open(href, '_blank');
          }else if(type == 'adopt_answer' || type == 'answer' || type == 'comment_question' || type == 'comment_question'){//问题
            var {href} = this.$router.resolve({
              path:"/answer/detail/" + item.sourceId
            });
            window.open(href, '_blank');
          }else if(type == 'comment_article'){//文章
            var {href} = this.$router.resolve({
              path:"/articleContent",
              query:{id:item.sourceId}
            });
            window.open(href, '_blank');
          }else if(type == 'comment_bubble'){//冒泡
            var {href} = this.$router.resolve({
              path:"/bubblingDetail",
              query:{id:item.sourceId,userId:item.userId}
            });
            window.open(href, '_blank');
          }else if(type == 'reply_comment'){
            if(item.referType == 'question'){//回复了 问题 subject 中你的评论
              var {href} = this.$router.resolve({
                path:"/answer/detail/" + item.sourceId
              });
              window.open(href, '_blank');
            }else if(item.referType == 'answer'){
              var {href} = this.$router.resolve({
                path:"/answer/detail/" + item.referId
              });
              window.open(href, '_blank');
            }else if(item.referType == 'article'){
              var {href} = this.$router.resolve({
                path:"/articleContent",
                query:{id:item.sourceId}
              });
              window.open(href, '_blank');
            }else if(item.referType == 'bubble'){
              var {href} = this.$router.resolve({
                path:"/bubblingDetail",
                query:{id:item.sourceId,userId:item.userId}
              });
              window.open(href, '_blank');
            }
          }
        },
        toAnswersDetail(id){
          var {href} = this.$router.resolve({
            path:"/answer/detail/" + id
          });
          window.open(href, '_blank');
        },
      }
    }
</script>

<style scoped>
  @import './message.css';
</style>
