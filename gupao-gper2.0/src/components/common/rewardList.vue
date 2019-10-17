<template>
  <div class="answer_reward">
    <div class="reward-title">
      <span class="reward-logo">
        <img src="/static/img/icon-gper-price-list.svg">
      </span>
      <span class="reward-name">悬赏榜单</span>
      <div class="reward-sort">
        <ButtonGroup size="small">
          <Button style="width: 33px;" :type="rewardState == 'month' ? 'primary' : 'default'" @click="changeReward('month')">月</Button>
          <Button style="width: 31px;" :type="rewardState == 'total' ? 'primary' : 'default'" @click="changeReward('total')">总</Button>
        </ButtonGroup>
      </div>
    </div>
    <div class="reward-info">
      <Spin fix v-if="rewardLoading">
        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
        <div>Loading</div>
      </Spin>
      <!--<div v-if="!rewardLoading && rewardList.length == 0" class="reward-nodata">
        <span>没有数据</span>
      </div>-->
      <div class="reward_box" v-for="item,index in rewardList">
        <a href="javascript:void(0)" class="box1" @click="toPersonelPage(item.userId)">
          <Avatar icon="ios-person" class="box-logo" :src="item.avatarUrl"/>
          <img v-if="item.vipSign" class="vip-crown" src="../../../static/img/crown.svg">
        </a>
        <div class="box2">
          <span class="hover_blue" @click="toPersonelPage(item.userId)">{{item.userName}}</span>
          <span>{{item.coins}}金币,被采纳{{item.adoptions}}次</span>
        </div>
        <div class="box3">
                <span class="box3-img">
                  <img src="../../../static/img/icon-gper-gold.svg"/>
                </span>
          <span>{{item.coins}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        rewardState:'month',
        rewardList:[],
        rewardLoading:false
      }
    },
    mounted(){
      this.getTopList();//查询悬赏榜单
    },
    methods: {
      changeReward(state){
        this.rewardState = state;
        this.rewardLoading = true;
        this.getTopList();
      },
      getTopList(){
        this.$store.state.common.topListParams.orderType = 'reward';
        this.$store.state.common.topListParams.timeType = this.rewardState;
        this.$store.dispatch("getTopList");
      },
      toPersonelPage(userid){
        this.$router.push({
          name: 'TAdynamic',
          params: {userid: userid}
        });
      },
    },
    computed:{
      topList(){
        return this.$store.state.common.topListResult;
      }
    },
    watch:{
      topList:{
        handler(cur,old){
          this.rewardLoading = false;
          if(cur.success){
            this.rewardList = cur.data.list;
          }
        },
        deep:true
      },
    }
  }
</script>
<style scoped>
  .answer_reward{display: block;background: rgba(244, 244, 244, 0.5);padding: 13px 17px 6px 14px;margin-bottom: 14px;}
  .answer_reward .reward-title{width:100%;height: auto;display: block;}
  .answer_reward .reward-logo{width:27px;height: 27px;display: inline-block;vertical-align: sub;}
  .answer_reward .reward-logo img{width:27px;height:27px;}
  .answer_reward .reward-name{font-size:16px;font-weight:bold;line-height:27px;color:#000000;display: inline-block;vertical-align: super;padding-left: 8px;font-family: PingFang SC;}
  .answer_reward .reward-sort{float:right;width: 74px;}
  .answer_reward .reward-info{padding-top: 15px;display: block;width: 100%;position: relative;}
  .answer_reward .reward-info .reward-nodata{height:300px;text-align: center;}
  .answer_reward .reward-info .reward-nodata span{color:#cccccc;padding: 150px 0;display: block;}
  .answer_reward .reward-info .ivu-spin-fix{min-height: 300px;}
  .reward_box{width:100%;height:auto;display:inline-block;border-bottom:1px solid rgba(112,112,112,0.1);}
  .reward_box:last-child{border-bottom:none;}
  .reward_box .box1{float: left;display: inline-block;}
  .reward_box .box-logo{width: 38px;height: 38px;border-radius: 38px;line-height: 38px;display: inline-block;margin: 10px 5px;}
  .reward_box .vip-crown{position:absolute;margin-left:17px;margin-top:-63px;width:30px;transform:rotate(9deg);}
  .reward_box .box2{float: left;margin: 10px 5px;display: inline-block;}
  .reward_box .box2 span:first-child{font-size:14px;line-height:19px;font-weight: 500;cursor: pointer;color: rgba(0, 0, 0, 0.78);overflow: hidden;text-overflow: ellipsis;white-space: nowrap;max-width: 120px;}
  .reward_box .box2 .hover_blue:hover{color:#2d8cf0;}
  .reward_box .box2 span{font-size:12px;font-weight:400;line-height:19px;display: block;color: rgba(0, 0, 0, 0.48);}
  .reward_box .box3{float:right;margin:10px 5px;display:inline-block;width:50px;text-align:center;border-left:1px solid rgba(112,112,112,0.1);padding-left:10px;}
  .reward_box .box3 .box3-img{height: 19px;display: block;}
  .reward_box .box3 .box3-img img{width: 19px;height: 19px;}
  .reward_box .box3 span{font-size:14px;font-weight:400;line-height:19px;display: block;color: rgba(249, 171, 16, 0.81);font-family: Helvetica Neue;}
</style>
