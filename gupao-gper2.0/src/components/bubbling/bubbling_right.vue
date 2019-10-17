<template>
<div class="right_warp_box">
			<div class="right_hot_bubbling_box">
        <div class="hot-tags-title">
      <span class="hot-logo">
        <img src="/static/img/icon-gper-hot-question.svg">
      </span>
          <span class="hot-name">热门冒泡</span>
        </div>
				<ul>
					<li class="one_judge" v-for="val,i in hot_bubbing">
            <img v-if="val.vipSign" class="vip_logo"  src="/static/img/crown.svg"/>
						<div class="judge_top">
							<router-link :to="{path:'personal/dynamic/' + val.userId}">
								<div class="head_box">
									<img v-lazy="val.avatarUrl" :key="val.avatarUrl" onerror=" this.onerror='';this.src='/static/img/photo.jpg'"/>
								</div>
							</router-link>
							<router-link :to="{path:'personal/dynamic/'+ val.userId}">
								<div class="judger_name_box"  >
									<span>{{val.userName}}</span>
								</div>
							</router-link>

							<div class="publish_time">{{val.createdAt | formatDate}}</div>
						</div>
            <a href="javascript:;" @click="toBubblingDetail(val.id)">
							<div  class="judge_content" v-html="val.content"   >

							</div>
						</a>
						<div class="judge_bottom_box">
						  <span @click="toBubblingDetail(val.id)">
                <Icon custom="icon-gper-answer"/>{{val.comments > 0 ? val.comments + '条':''}}评论
              </span>
              <span :style="val.hasSupport ? {color:'#2d8cf0'} : {}" @click="support_bub(val)">
                <Icon custom="icon-gper-dianzan1"/>{{val.supports > 0 ? val.supports+'个' : ''}}赞
              </span>
						</div>
					</li>
				</ul>
			</div>
		</div>
</template>

<script>
import Cookies from "js-cookie"
	export default{
		data(){
			return {

			}
		},
		mounted(){
      this.$store.state.bubbling.hotBubblingParam.orderType='hot';
			this.$store.dispatch('axGetHotBub');//热门冒泡
		},
		methods:{
      toBubblingDetail(id){
        if(this.handleLoginActive()){
          this.$router.push({
            path:"/bubblingDetail",
            query:{id:id}
          });
        }
      },
			support_bub(val){//点赞冒泡
        if(this.handleLoginActive()){
          this.$store.state.action.supportParam.userId = this.$cookie.get("userId");
          this.$store.state.action.supportParam.supportableId = val.id;
          this.$store.state.action.supportParam.supportableType = "App\\Models\\Bubble";
          this.$post('support/addSupports',  this.$store.state.action.supportParam).then((res) =>{
           if(res.data.data) {
             val.supports = val.supports + 1;
             val.hasSupport = true
           }
          });
        }
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
			hot_bubbing(){//热门冒泡
				var temp_arr=this.$store.state.bubbling.hotBubbling;
				return temp_arr;
			},
		}

	}


</script>

<style scoped>
.right_warp_box {padding: 15px}
.hot_tags .hot-tags-title{width:100%;height: auto;display: block;}
.hot-tags-title .hot-logo{width:36px;height: 27px;display: inline-block;vertical-align: sub;}
.hot-tags-title .hot-logo img{width:36px;height:27px;}
.hot-tags-title .hot-name{font-size:16px;font-weight:bold;line-height:27px;color:#000000;display:inline-block;vertical-align:super;padding-left:8px;font-family:PingFang SC;}

.judge_top .head_box{  float: left;  overflow: hidden;  padding-right:15px ;}
.head_box img{ width: 30px; height: 30px;border-radius: 17px;}
.right_hot_bubbling_box .one_judge  .vip_logo { position: absolute; left: 6px;top: -8px;border-radius: unset;width: 28px; height:auto;}
.one_judge .publish_time{ font-size:12px ; color: #b5b5b5;line-height:16px ; width:778px ;}
.judge_content{ width: 100%; overflow: hidden; height: auto; color: #212121; font-size:15px ;padding: 14px 0 14px;line-height: 20px;}
.judge_content:hover {color:#2d8cf0;}
.judge_bottom_box{ padding: 3px 0 11px; overflow: hidden; font-size: 12px; line-height:16px ;}
.judge_bottom_box .judge_nums{ float: left; margin-right: 22px; color:#b5b5b5 ;}
.judge_bottom_box .check_details{ float: left; color: #b5b5b5;}
.judge_bottom_box .report_img{ float: right; margin-right: 7px;}
.judge_bottom_box .repport_action{ float: right; cursor: pointer;}
.right_warp_box{ overflow: hidden;}
.hot_talks > li{ line-height:20px ; cursor: pointer; font-size:15px ; color: #2d8cf0; padding:5px 0 5px ; }
.right_hot_bubbling_box .judger_name_box{max-width: 214px; overflow: hidden; color: #515a6e}
.right_hot_bubbling_box .judger_name_box:hover{color:#2d8cf0;}
.right_hot_bubbling_box .publish_time{ width:156px ;}
.right_hot_bubbling_box .one_judge{ border: none; padding: 6px 0 25px; position: relative;}
.judge_bottom_box span{cursor: pointer;margin: 3px 10px 3px 0px;font-size:12px;font-weight:400;line-height:17px;height:17px;display: inline-block;}
.judge_bottom_box span:hover{color:#2d8cf0;}
.judge_bottom_box span i{padding-right: 5px;padding-bottom: 5px;}
</style>
