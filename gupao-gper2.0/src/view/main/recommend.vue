<template>
  <div id="recomment">
    <div v-for="item in selectReAByPageData.list" class="article_list">
      <div class="article_content clearfix">

        <p class="article_content_main  atic_img">
          <a :href="item.url">
            <img :src="item.logo" v-show="item.logo!=undefined" onerror="this.onerror='';this.style.display='none'" alt="">
          </a>
        </p>

        <div class="atic_riight">
          <a :href="item.url">
            <p class="article_class">{{item.subject}}</p>
          </a>

          <div class="article_time">
            <router-link :to="{name: 'TAdynamic',params: {userid: item.userId}}">
							<span>
                <Avatar icon="ios-person" size="small" class="user-logo" :src="item.avatarUrl"/>
							</span>
              <span class="hov_underline">{{item.userName}}</span>
            </router-link >
            <span>{{item.createdAt|formatDate}}</span>
          </div>
        </div>
      </div>

    </div>
    <div v-if="selectReAByPageData.list && selectReAByPageData.list.length < recomtotal" class="show_more" @click="load_more" >点击加载更多</div>
    <div v-else class="hide_more" >没有更多数据了</div>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        pageNum:1
      }
    },
    mounted(){
      this.$store.dispatch('selectRecommendationsByPage');
    },
    methods:{
      load_more(){
        this.pageNum++;
        this.$store.state.home.selectReAByPageParams.pageNum=this.pageNum;
        this.$store.dispatch('selectRecommendationsByPage');
      }
    },
    computed:{
      selectReAByPageData(){
        return this.$store.state.home.selectReAByPageData;
      },
      recomtotal(){
        return this.$store.state.home.selectReAByPageData.recomtotal;
      }
    },
    watch:{

    }
  }

</script>
<style scoped>
  .show_more{padding:5px 14px;background-color:#fff;border-radius:15px;font-size:12px;line-height:1.42858;width:160px;margin:70px auto;text-align:center;border:1px solid #337ab7;color:#337ab7;cursor:pointer;}
  .hide_more{    padding:5px 14px;background-color:#fff;border-radius:15px;font-size:12px;line-height:1.42858;width:160px;margin:70px auto;text-align:center;border:1px solid #ccc;color:#337ab7;cursor:pointer;}
  .atic_img{float:left}
  .atic_img img{width:100%;height:100%}
  .atic_ctt{min-height:20px}
  .atic_riight{float:left;}
  .atic_img{max-width:100px;max-height:60px}
  .article_list{width:100%;padding:23px 0 12px 0;border-bottom:1px solid #e8e8e8;}
  .article_class{margin-bottom:7px;font-size:16px;color:#337ab7;line-height: 22px;}
  .article_content_main{float: left;padding-right:13px;}
  .article_content_main img{width:100%;height:100%}
  .article_time span{display:inline-block;font:12px/18px '微软雅黑';color: #515a6e;}
  .article_time a span:nth-of-type(1) img{width:18px;height:18px;/*margin:4px 10px 4px 0;*/border-radius:50%;vertical-align:text-bottom}
  .article_time span:nth-of-type(3),.article_time span:nth-of-type(4){color:#bfbfbf}
  .article_time span:nth-of-type(3){margin:0 30px}
  .article_content{display: inline-block;}
</style>
