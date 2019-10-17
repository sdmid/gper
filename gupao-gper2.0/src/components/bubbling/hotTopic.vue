<template>
  <div class="hot_tags">
    <div class="hot-tags-title">
      <span class="hot-logo">
        <img src="/static/img/icon-gper-hot-question.svg">
      </span>
      <span class="hot-name">热门话题</span>
    </div>
    <div class="hot-info">
      <div class="hot_item" v-for="item in brife_hot">
        <span @click="getBubthe(item.name)">#{{item.name}}#</span>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        hotDataList: []
      }
    },
    mounted(){
      this.$store.dispatch("brifeHot");
    },
    methods: {
      getBubthe(thm_word){
        this.$router.push({path:"/bubbling",query:{them_word:thm_word}});
      }
    },
    computed:{
      brife_hot(){
        return this.$store.state.bubbling.brifeHots;
      }
    },
    '$route' (to, from) {
      this.$store.dispatch('brifeHot');
    }
  }
</script>
<style scoped>
  .hot_tags{display: block; margin-bottom: 12px;padding: 15px 18px 12px 13px;background: rgba(244, 244, 244, 0.5);}
  .hot_tags .hot-tags-title{width:100%;height: auto;display: block;}
  .hot-tags-title .hot-logo{width:36px;height: 27px;display: inline-block;vertical-align: sub;}
  .hot-tags-title .hot-logo img{width:36px;height:27px;}
  .hot-tags-title .hot-name{font-size:16px;font-weight:bold;line-height:27px;color:#000000;display:inline-block;vertical-align:super;padding-left:8px;font-family:PingFang SC;}
  .hot-info .hot_item {display: block; padding: 9px 18px 8px 13px;border-bottom:1px solid #7070701a; }
  .hot-info .hot_item:last-child{border-bottom:none;}
  .hot-info .hot_item span{font-size: 14px;cursor: pointer;color: rgba(0,0,0,0.85);}
  .hot-info .hot_item span:hover{color:#2d8cf0;}
</style>
