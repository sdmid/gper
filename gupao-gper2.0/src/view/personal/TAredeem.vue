<template>
  <div class="person-nav">
    <div class="person-title">
      {{hasOwner?'我的':'TA的'}}兑换
    </div>
    <div class="dotted-line"></div>
    <div class="person-content">
      <div class="time-item" v-for="(item,index) in redeemInfoData">
        <div class="time-left">
          <div style="display: inline-block; vertical-align: middle">
            <img  style="width: 20px" src="/static/img/icon-gper-gold.svg"/>
          </div>
          <span>{{item.coins}}</span>
        </div>
        <div class="time-right ">
          <span class="hot_title">
            <em class="hov_underline" :class="item.status === 1?'yichuli':'weichuli'">
              {{item.status | getStatus}}
            </em>
            兑换 ·
            <router-link class='hover_blue' :to="{path:'/good/detail',query:{id:item.goodsId}}">
							  {{item.goodsName}} ·
            </router-link>
            {{item.createdAt | formatDate}}
          </span>
        </div>
      </div>
      <div class="answers_page" v-show="redeemInfoData_total > 0" >
        <Page :total="redeemInfoData_total" @on-change="to_page" />
      </div>
    </div>
  </div>
</template>
<script>
export default{
	data(){
		return {
        hasOwner:false,
        params:{
          userid:''
        },
        page_num:1,
        del_private_show:false,
        del_private_id:''
		  }
	},
  filters:{
    getStatus(val){
      switch(val){
        case 0:
          return '未处理';
        case 1:
          return '兑换成功';
        case 4:
          return '兑换失败';
      }
    }
  },
	mounted(){
    this.params.userid = this.$route.params.userid;
    if(this.$cookie.get("userId") == this.params.userid){
      this.hasOwner = true;
    }
		this.load_page();
	},
	computed:{
    redeemInfoData(){
			return this.$store.state.person.redeemInfoData;
		},
    redeemInfoData_total(){
      return this.$store.state.person.redeemInfoData_total;
    }
	},
	methods:{
    load_page(){
      this.$store.state.person.redeemQueryParmas.userId = this.params.userid;
      this.$store.state.person.redeemQueryParmas.page = this.page_num;
      this.$store.dispatch('redeemUserInfo');
    },
    to_page(i){
      this.page_num = i;
      this.$store.state.person.redeemQueryParmas.page = i;
      this.$store.dispatch('redeemUserInfo');
    },
	}
}

</script>
<style>
  .person-title .ivu-menu-horizontal {height: 37px;line-height: 37px;}
</style>
<style scoped>
  .person-title{margin-top:4px;font-size:20px;font-weight:400;height:37px;font-family:PingFang SC;color:#000000;border-bottom:1px dotted #e8e8e8;}
  .dotted-line{height: 1px;margin-top:1px;border-bottom:1px dotted #e8e8e8;}
  .person-content{min-height: 300px;margin:21px 0;width:100%;}
  .time-item{padding: 5px 0 5px;border-bottom: 1px dotted #e8e8e8;display: block;width: 100%; overflow: hidden}
  .answers_page{padding:20px;text-align: center;}
  .time-left{width:50px;height:auto;padding:1px 5px;border-radius:50px;float:left;display:inline-block;margin:7px;color:#2d8cf0;}
  .time-left span{font-size:10px;font-weight:400;display:inline-block;text-align:center}
  .time-right{float:left;display:inline-block;width:800px;height:22px;margin:7px 14px;}
  .time-right span{font-size:12px;line-height:23px;font-weight:400;display:inline-block}
  .time-right .link{color:#515a6e}
  .time-right .link:hover{color:#2d8cf0}
  .time-right .hot_title{font-size:14px;line-height: 22px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .hover_blue{color:#515a6e;}
  .hover_blue:hover{color:#2d8cf0;}
  .hov_underline{display:inline-block;font-size:14px;line-height:18px;padding:3px 8px 2px 8px;margin-right:8px;border-radius:3px;}
  .weichuli{background:#efefef;}
  .yichuli{background: #1890ff17;color: #1890FF;}
</style>

