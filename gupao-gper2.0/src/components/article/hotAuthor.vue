<template>
  <div class="hot_author">
    <div class="reward-title">
            <span class="reward-logo">
             <img src="/static/img/icon-gper-hot-question.svg">
            </span>
      <span class="reward-name">热门作者</span>
      <div class="reward-sort">
        <ButtonGroup size="small">
          <Button :type="rewardState === 'month' ? 'primary' : 'default'" @click="changeReward('month')">月</Button>
          <Button :type="rewardState === 'total' ? 'primary' : 'default'" @click="changeReward('total')">总</Button>
        </ButtonGroup>
      </div>
    </div>
    <div class="reward-info">
      <Spin fix v-if="rewardLoading">
        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
        <div>Loading</div>
      </Spin>
      <!--<div v-if="!rewardLoading && rewardList.length === 0" class="reward-nodata">
        <span>没有数据</span>
      </div>-->
      <div class="reward_box" v-for="item,index in rewardList">
        <a href="javascript:void(0)" class="box1" @click="toPersonelPage(item.userId)">
          <Avatar icon="ios-person" class="box-logo" :src="item.avatarUrl"/>
          <img v-if="item.vipSign" class="vip-crown" src="../../../static/img/crown.svg">
        </a>
        <div class="box2">
          <span class="hover_blue" @click="toPersonelPage(item.userId)">{{item.userName}}</span>
          <span class="num">{{item.articles}}篇文章,{{item.supports}}次赞同</span>
        </div>
        <div class="box3">
                <span class="box3-img">
                 <i class="i-icon icon-gper-dianzan"></i>
                </span>
          <span>{{item.supports}}</span>
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
      this.getHOtAuthor();//查询热门作者榜单
    },
    methods: {
      changeReward(state){
        this.rewardState = state;
        this.rewardLoading = true;
        this.getHOtAuthor();
      },
      toPersonelPage(userid){
        this.$router.push({
          name: 'TAdynamic',
          params: {userid: userid}
        });
      },
      getHOtAuthor () {
        let authorParam= {
          orderType:'article',
          timeType: this.rewardState,
          page:1,
          pageSize:6,}
        this.$post('top/pageQuery', authorParam).then((res) =>{
          this.rewardLoading = false;
          if(res.data.success) {
            this.rewardList = res.data.data.list;
          }
        });
      }
    }
  }
</script>
<style scoped>
  .hot_author{display: block; background: rgba(244, 244, 244, 0.5);padding: 15px 17px 0px;margin-bottom: 12px;}
  .hot_author .reward-title{width:100%;height: auto;display: block;}
  .hot_author .reward-logo{width:36px;height:27px;display: inline-block;vertical-align: sub;}
  .hot_author .reward-logo img{width:36px;height:27px;}
  .hot_author .reward-name{font-size:16px;font-weight:bold;line-height:27px;color:#000000;display:inline-block;vertical-align:super;padding-left:8px;font-family:PingFang SC;}
  .hot_author .reward-sort{float:right;width: 60px;}
  .hot_author .reward-info{padding-top: 10px;display: block;width: 100%;position: relative;}
  .hot_author .reward-info .reward-nodata{height:300px;text-align: center;}
  .hot_author .reward-info .reward-nodata span{color:#cccccc;padding: 150px 0;display: block;}
  .hot_author .reward-info .ivu-spin-fix{min-height: 300px;}
  .reward_box{width:100%;height:auto;display:inline-block;border-bottom:1px solid #e8eaec;}
  .reward_box:last-child{border-bottom:none;}
  .reward_box .box1{float: left;display: inline-block;}
  .reward_box .box-logo{width: 38px;height: 38px;border-radius: 38px;line-height: 38px;display: inline-block;margin: 7px 2px;}
  .reward_box .vip-crown{position:absolute;margin-left:14px;margin-top:-60px;width:30px;-webkit-transform:rotate(9deg);transform:rotate(9deg);}
  .reward_box .box2{float: left;margin: 8px 0 10px 12px;display: inline-block;}
  .reward_box .box2 span:first-child{font-size:14px;line-height:19px;font-weight: 500;cursor: pointer;color: rgba(0, 0, 0, 0.78);}
  .reward_box .box2 .hover_blue{overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 133px;}
  .reward_box .box2 .hover_blue:hover{color:#2d8cf0;}
  .reward_box .box2 .num{color: rgba(0, 0, 0, 0.48);}
  .reward_box .box2 span{font-size:12px;font-weight:400;line-height:19px;display: block;}
  .reward_box .box3{float:right;margin:10px 5px;display:inline-block;width:40px;text-align:center;padding-left:10px;}
  .reward_box .box3 .box3-img{height: 19px;display: block;}
  .reward_box .box3 .box3-img .i-icon{font-size: 18px;}
  .reward_box .box3 span{font-size:14px;font-weight:400;line-height:19px;color:#EF6F1C;display: block;}
</style>
