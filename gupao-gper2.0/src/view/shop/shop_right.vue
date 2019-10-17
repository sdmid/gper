<template>
    <div id="shop-right">
      <div class="user-message"  v-if="!hasVisitorToken">
        <div class="user-name">{{userData.name}}</div>
        <div class="user-grade">
          <Icon custom="i-icon icon-gper-mygold" color="#ffffff" size="19"/>
          <span>金币{{userData.userData.coins}}</span>
          <router-link  :to="{path:'/personal/redeem/' + userData.id}">
          <span class="my_change_history_link">兑换记录</span>
          </router-link>
        </div>
      </div>

      <div class="people_change_state">
          <div class="title">兑换动态</div>
        <div>
          <div class="state-item" v-for="(item,i) in peopleChangeState" :key="i">
            <span class="user-name" @click="toUserDetail(item)">{{item.userName}}</span>
            <span>兑换了{{item.goodsName}}</span>
            <span class="create-time">-{{item.createdAt | formatDate}}</span>
          </div>
        </div>
      </div>

      <div class="usual_question">
        <div class="title">常见问题</div>
        <Collapse v-model="value" class="question-item">
          <Panel :name="i+''" v-for="(item,i) in question" :key="i">
              {{item.title}}
            <p slot="content">{{item.content}}</p>
          </Panel>
        </Collapse>
      </div>

    </div>
</template>

<script>
  import Cookies from "js-cookie"
    export default {
        name: "shopRight",
      data() {
          return {
            userData: {
              name: '',
              id: '',
              userData: {
                coins: ''
              }
            },
            peopleChangeState: [],
            value: '0',
            question:[
              {
                ques1:true,
                title:"1.什么是金币？",
                content:"金币是GPer生态圈的基础货币值，是用户在GPer生态圈帮助他人得到的奖励，可以通过提问、回答问题等多种途径获得，可在积分商城消费。"
              },
              {
                ques1:false,
                title:"2.怎么赚取金币？",
                content:"可通过回答问题等多种途径获得。"
              },
              {
                ques1:false,
                title:"3.提交信息需要注意什么？",
                content:"填写真实有效的邮寄地址、邮编、收件人、联系电话和email地址，并保持电话畅通，这样能准确地签收商品。请妥善保护自己的账号和密码，以免泄露个人信息。"
              },
              {
                ques1:false,
                title:"4.兑换成功后多久能收到？",
                content:"兑换成功后，知识商城的工作人员将在15日内将您的商品寄出，快递到达时间视情况而定，一般在1-2周之内。"
              },
              {
                ques1:false,
                title:"5.邮寄费用由谁承担？",
                content:"实物邮费自理。"
              },
            ],
            hasVisitorToken:Cookies.get('visitorToken')?true:false,
          }
      },
      mounted () {
        this.$store.dispatch('getUserInfo');
        this.getChangeState()
      },
      methods: {
          getChangeState () {
            let peopleStateParams = {	page:"1", pageSize:"10"}
            this.$post('exchange/pageQuery', peopleStateParams).then((res) =>{
              this.peopleChangeState = res.data.data.list;
            });
          },
        toUserDetail(item) {
          this.$router.push("/personal/dynamic/" + item.userId)
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
              this.userData = curr.data;
            }
          },
          deep:true
        },
      }
    }
</script>

<style scoped>
  .user-message{height:101px;background: url("../../../static/img/home-user-bg.png") no-repeat center center;background-size: 100% 100%;}

  .user-message .user-name{float: left;padding-top:16px;padding-left:26px;font-size:16px;color:#ffffff;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
  .user-message .user-grade{padding-left:26px;padding-top:17px;height:56px;width:100%;float:left;display:inline-block;}
  .user-message .user-grade span{display: inline-block;font-size: 10px;font-weight:400;line-height:16px;color: #ffffff;}
  .my_change_history_link {float: right ;    padding: 4px; cursor: pointer;margin-right: 20px;border: 1px solid #fff;border-radius: 4px;}
  .people_change_state,.usual_question {margin-top: 15px;background: #f9f9f9;padding: 10px;}
  #shop-right .title {font-size: 16px;color: #313131;margin-bottom: 10px;}
  .people_change_state .state-item {font-size: 14px; margin-bottom: 8px;}
  .people_change_state .state-item .user-name {color: #63A5F2; cursor: pointer; margin-right: 5px}
  .people_change_state .state-item .create-time {color: #c6c6c6; margin-left: 5px}
  .usual_question {margin-bottom: 15px}
  .usual_question .question-item {font-size: 14px}
</style>
