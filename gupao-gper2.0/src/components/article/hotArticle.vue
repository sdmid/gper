<template>
  <div class="hot-article">
    <div class="hot-article-title">
            <span class="hot-logo">
              <img src="/static/img/icon-gper-hot-question.svg">
            </span>
      <span class="hot-name">热门文章</span>
      <!--<a href="javascript:void(0);" class="hot-more">
        更多<Icon type="ios-arrow-forward" size="11"/>
      </a>-->
    </div>
    <div class="hot-info">
      <div class="article-box" v-for="(item,index) in articalsList" :key="index">
        <div class="article-info">
          <div class="article_user_img">
            <a href="javascript:void(0)" class="box1" @click="toPersonelPage(item.userId)">
              <Avatar icon="ios-person" class="box-logo" :src="item.avatarUrl"/>
              <img v-if="item.vipSign" class="vip-crown" src="../../../static/img/crown.svg">
            </a>
          </div>
          <div class="article-title" @click="toArticleDetail(item.id)">
            <div class="text" style="-webkit-box-orient: vertical;">{{item.title}}</div>
          </div>
        </div>
        <div class="article-total">
          <Icon type="md-eye" size="12" class="icon"/><span>{{item.views}}</span>
          <Icon custom="icon-gper-message" size="12" class="icon"/><span> {{item.comments}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        articalsList: []
      }
    },
    mounted(){
      this.getHotArticle();//查询热门文章
    },
    methods: {
      getHotArticle(){
        let 	articParams={
            orderType:'hot',
            pageNum:'1',
            pageSize:'6',
          };
        this.$post('article/selectArticlesByPage', articParams).then((res) =>{
          if (res.data.success) {
            this.articalsList = res.data.data.list;
          }
        });
      },
      toPersonelPage(userid){
        this.$router.push({
          name: 'TAdynamic',
          params: {userid: userid}
        });
      },
      toArticleDetail (id) {
        this.$router.push({
          path:"/articleContent",
          query:{id:id}
        });
      },
    }
  }
</script>
<style scoped>
  .hot-article{display: block;background: rgba(244, 244, 244, 0.5);padding: 15px 17px 0;margin-bottom: 12px;}
  .hot-article .hot-article-title{width:100%;height: auto;display: block;}
  .hot-article-title .hot-logo{width:36px;height: 27px;display: inline-block;vertical-align: sub;}
  .hot-article-title .hot-logo img{width:36px;height:27px;}
  .hot-article-title .hot-name{font-size:16px;font-weight:bold;line-height:27px;color:#000000;display:inline-block;vertical-align:super;padding-left:8px;font-family:PingFang SC;}
  .hot-article-title .hot-more{float:right;font-size:12px;font-weight:400;line-height:27px;width: 40px;}
  .hot-article .hot-info{margin-top: -7px;display: block;width: 100%;position: relative;}
  .hot-article .hot-info .article-box{width:100%;height:78px;border-bottom:1px solid rgba(112,112,112,0.1);padding:22px 0 6px 5px;}
  .hot-article .hot-info .article-box:last-child{border-bottom:none;}
  .article-info {display: flex;align-items: flex-start;}
  .article_user_img{position:relative}
  .article_user_img .vip-crown{position:absolute;margin-left:12px;margin-top:-53px;width:30px;transform:rotate(9deg);}
  .article_user_img .box-logo{width: 38px;height: 38px;border-radius: 38px;line-height: 38px;display: inline-block;}
  .article-box .article-title{margin-left:10px;flex:1;height: 32px;cursor:pointer;color:rgba(0,0,0,0.78); overflow: hidden}
  .article-box .article-title .text{font-size:14px;font-family:Helvetica Neue;font-weight:500;line-height:15px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;
    /* autoprefixer: off */
    -webkit-box-orient:vertical;
    /* autoprefixer: on */
    -webkit-line-clamp:2;}
  .article-box .article-title:hover{color:#1890FF}
  .article-total{margin-bottom:6px;height:12px;text-align:right;font-size:12px;display:block;font-family:PingFang SC;font-weight:400;line-height:12px;color:rgba(0,0,0,0.48);}
  .article-total .icon{margin-top: -2px;}
  .article-total span{display:inline-block;margin-right:13px;margin-left:3px;}
  .article-total span:last-child{margin-right:0}
</style>
