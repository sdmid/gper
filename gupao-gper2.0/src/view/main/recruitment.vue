<template>
  <div id="recruitment">
    &nbsp;
    <div class="content-wrapper">
      <div  class="item-cont" v-for="(item,index) in articleList" :key="index">
        <div class="left_con">
          <div class="div">
            <span class="article_title" @click="toArticleDetail(item.id)" :style="item.logo ? {'max-width':'410px'} : {'max-width':'706px'}">{{item.title}}</span>
            <span v-if="item.istop" class="article-label article-top">置顶</span>
            <span class="article-label article-type" v-if="item.articleType">{{item.articleType | getArticleType}}</span>
            <Tooltip v-if="item.openArea === 'vip'" placement="top-start" content="VIP内容仅对VIP开放">
              <span class="article-label top_vip">VIP</span>
            </Tooltip>
          </div>
          <div class="article_description">{{item.summary}}</div>
          <div class="clear info-wrapper">
            <div class="left-info">
                    <span @click ="toUserDetail(item.userId)" style="cursor: pointer">
                    <Avatar icon="ios-person" class="user-logo" :src="item.avatarUrl"/>
                    <img v-if="item.vipSign" class="vip-crown" src="../../../static/img/crown.svg">
                  </span>
              <span class="inline user-name" @click ="toUserDetail(item.userId)">{{item.userName}}</span>
              <span class="inline">{{item.createdAt|formatDate}}</span>
            </div>
            <div class="right-info">
              <i class="i-icon icon-gper-yueduliang inline1"></i>
              <span class="right-inline">{{item.views}}阅读</span>
              <i class="i-icon icon-gper-answer inline"></i>
              <span class="right-inline">{{item.comments}}条评论</span>
            </div>
          </div>
        </div>
        <div class="right_con" v-if="item.logo" @click="toArticleDetail(item.id)">
          <img  v-lazy="item.logo" :key="item.logo" />
        </div>
      </div>
    </div>
    <Page v-if="articleList && articleList.length > 0" :total="articleTotal"  :pageSize="aticleParams.pageSize" @on-change="handleArticle" />
  </div>
</template>
<script>
  export default{
    data(){
      return {
        articleList:[],
        articleTotal:0,
        aticleParams: {
          pageNum:'1',
          pageSize:20,
          orderType: 'new',
          categoryId: '15'
        },
      }
    },
    filters:{
      getArticleType(type){
        switch(type){
          case 'origina':
            return '原创';
          case 'repost':
            return '转载';
          case 'translated':
            return '翻译';
        }
      }
    },
    mounted(){
      this.getArticleList();
    },
    methods:{
      getArticleList(){
        this.$post('article/selectArticlesByPage', this.aticleParams).then((res) =>{
          this.articleList = res.data.data.list;
          this.articleTotal = res.data.data.total;
          this.$nextTick(()=> {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
          });
        });
      },
      handleArticle (i) {
        this.aticleParams.pageNum = i;
        this.getArticleList();
      },
      toUserDetail (id) {
        this.$router.push("/personal/dynamic/" + id)
      },
      toArticleDetail (id) {
        this.$router.push({path:"/articleContent",query:{id:id}});
      },
    },
    computed:{
    },
    watch:{

    }
  }

</script>
<style scoped>
  /*.dotted-line{height:1px;margin-top:1px;border-bottom:1px dotted #e8e8e8}
  .header-label{font-size:12px;font-weight:400;line-height:22px;display:flex;position:relative}
  .category{height:36px;overflow:hidden}
  .category:hover{overflow:unset}
  .content-wrapper{margin-top:-8px}
  .header-tags{float:right;display:flex;width:765px;flex-wrap:wrap;justify-content:flex-start;align-items:baseline}
  .atical_menus_box_enter{height:auto;overflow:hidden;position:absolute;background-color:#fff;box-shadow:0px 0px 8px 2px rgba(28,31,33,.1);z-index:99}
  .header-tag-item{font-size:12px;line-height:17px;padding:3px 9px 2px 10px;margin-right:11px;margin-bottom:10px;background:rgba(244,244,244,1);color:rgba(0,0,0,0.65);border-radius:3px;cursor:pointer}
  .header-tag-item:hover,.header-tag-item.active{color:#fff;background:#459BF8}
  .header-sorts{border:1px solid #1890FF;border-radius:3px}
  .header-sort-item{padding:0 8px;cursor:pointer;display:inline-block}
  .header-sort-item.select{color:#fff;background:#459BF8}
  .report_article{background:#1890FF;color:#fff;padding:10px 0;text-align:center;margin-bottom:13px;cursor:pointer;font-size:14px}
  .ivu-page{text-align:center;padding-top:20px}
  .content-wrapper .item-cont{display:flex;border-bottom:1px dotted rgba(112, 112, 112, 0.15);padding:20px 0 8px 0;}
  .content-wrapper .item-cont .left_con{flex:1;position:relative;}
  .content-wrapper .item-cont .left_con .div{display: block;height: 22px;}
  .clear:after{content:' ';display:block;clear:both;}
  .content-wrapper .item-cont .left_con .info-wrapper{position:absolute;width:100%;bottom:0}
  .content-wrapper .item-cont .left_con .left-info{float:left;position:relative}
  .content-wrapper .item-cont .left_con .left-info .user-logo{width:28px;height:28px;line-height:28px;display:inline-block}
  .content-wrapper .item-cont .left_con .left-info .vip-crown{position:absolute;margin-left:-22px;margin-top:-10px;width:20px;transform:rotate(9deg);}
  .content-wrapper .item-cont .left_con .right-info{float: right;height: 28px;}
  .content-wrapper .item-cont .left_con .right-info .inline1{display: inline-block;margin-top: -3px;}
  .content-wrapper .item-cont .left_con .article_title{display: inline-block;font-size:16px;color:rgba(0, 0, 0, 0.85);cursor:pointer;font-weight:bold;font-family:PingFang SC;line-height:22px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .content-wrapper .item-cont .left_con .article_title:hover{color:#1890FF}
  .content-wrapper .item-cont .left_con .user-name{cursor:pointer}
  .content-wrapper .item-cont .left_con .user-name:hover{color:#1890FF}
  .article_description{margin-bottom:44px;font-size:14px;margin-top:8px;color:rgba(0,0,0,0.65);font-family:PingFang SC;font-weight:400;line-height:20px;    overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;}
  .content-wrapper .item-cont .right_con{margin-left:40px}
  .content-wrapper .item-cont .right_con img{width:257px;height:131px;}
  .right-info i{vertical-align: text-top;}
  .info-wrapper .inline{display:inline-block;margin-left:10px}
  .icon-gper-yueduliang{font-size:22px}
  .right-inline{display: inline-block;line-height: 28px;vertical-align: top;}
  .content-wrapper .item-cont .left_con .left-info .user-logo{width:28px;height:28px;line-height:28px;display:inline-block}
  .article-top{font-size:12px;line-height:17px;padding:3px 8px 2px 8px;background:#bd8cbb;color:#fff;float:right;}
  .top_vip{font-size:12px;line-height:17px;padding:3px 8px 2px 8px;background:#d72a47;border-radius:3px;color:#fff;float:right;margin-right:10px;text-align:center;cursor: pointer;}
  .article-type{font-size:12px;line-height:17px;padding:3px 8px 2px 8px;background:#459BF8;color:#fff;border-radius:3px;float:right;margin-right: 10px;}
*/
  .dotted-line{height:1px;margin-top:1px;border-bottom:1px dotted #e8e8e8}
  .header-label{font-size:12px;font-weight:400;line-height:22px;display:flex;position:relative}
  .category{height:36px;overflow:hidden}
  .category:hover{overflow:unset}
  .content-wrapper{margin-top:-8px}
  .header-tags{float:right;display:flex;width:765px;flex-wrap:wrap;justify-content:flex-start;align-items:baseline}
  .atical_menus_box_enter{height:auto;overflow:hidden;position:absolute;background-color:#fff;box-shadow:0px 0px 8px 2px rgba(28,31,33,.1);z-index:99}
  .header-tag-item{font-size:12px;line-height:17px;padding:3px 9px 2px 10px;margin-right:11px;margin-bottom:11px;background:rgba(244,244,244,1);color:rgba(0,0,0,0.65);border-radius:3px;cursor:pointer}
  .header-tag-item:hover,.header-tag-item.active{color:#fff;background:#459BF8}
  .header-sorts{border:1px solid #1890FF;border-radius:3px}
  .header-sort-item{padding:0 8px;cursor:pointer;display:inline-block}
  .header-sort-item.select{color:#fff;background:#459BF8}
  .report_article{background:#1890FF;color:#fff;padding:10px 0;text-align:center;margin-bottom:13px;cursor:pointer;font-size:14px}
  .ivu-page{text-align:center;padding-top:20px}
  .content-wrapper .item-cont{display:flex;border-bottom:1px dotted rgba(112, 112, 112, 0.15);padding:20px 0 8px 0;}
  .content-wrapper .item-cont .left_con{flex:1;position:relative;}
  .content-wrapper .item-cont .left_con .div{display: block;height: 22px;}
  .clear:after{content:' ';display:block;clear:both;}
  .content-wrapper .item-cont .left_con .info-wrapper{width:100%;bottom:0}
  .content-wrapper .item-cont .left_con .left-info{float:left;position:relative}
  .content-wrapper .item-cont .left_con .left-info .user-logo{width:28px;height:28px;line-height:28px;display:inline-block}
  .content-wrapper .item-cont .left_con .left-info .vip-crown{position:absolute;margin-left:-22px;margin-top:-10px;width:20px;transform:rotate(9deg);}
  .content-wrapper .item-cont .left_con .right-info{float: right;height: 28px;}
  .content-wrapper .item-cont .left_con .right-info .inline1{display: inline-block;margin-top: -5px;}
  .content-wrapper .item-cont .left_con .article_title{display: inline-block;font-size:16px;color:rgba(0, 0, 0, 0.85);cursor:pointer;font-weight:bold;font-family:PingFang SC;line-height:20px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;vertical-align: text-bottom;}
  .content-wrapper .item-cont .left_con .article_title:hover{color:#1890FF}
  .content-wrapper .item-cont .left_con .user-name{cursor:pointer}
  .content-wrapper .item-cont .left_con .user-name:hover{color:#1890FF}
  .article_description{margin-bottom:20px;font-size:14px;margin-top:16px;color:rgba(0,0,0,0.65);font-family:PingFang SC;font-weight:400;line-height:20px;    overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;}
  .content-wrapper .item-cont .right_con{margin-left:40px;margin-top: 13px;}
  .content-wrapper .item-cont .right_con img{width:150px;height:98px;border-radius: 3px;}
  .right-info i{vertical-align: text-top;}
  .info-wrapper .inline{display:inline-block;margin-left:10px}
  .icon-gper-yueduliang{font-size:22px}
  .right-inline{display: inline-block;line-height: 28px;vertical-align: top;}
  .content-wrapper .item-cont .left_con .left-info .user-logo{width:20px;height:20px;line-height:20px;display:inline-block;}
  .article-top{background:#bd8cbb;color:#fff;}
  .top_vip{background:#d72a47;color:#fff;text-align:center;cursor: pointer;}
  .article-type{background:#459BF8;color:#fff;}
  .article-label{font-size:12px;line-height:17px;padding:3px 8px 2px 8px;border-radius:3px;vertical-align: text-bottom;margin-right: 5px;}
</style>
