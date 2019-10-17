<template>
  <div class="hot_tags">
    <div class="hot-tags-title">
      <span class="hot-logo">
        <img src="/static/img/icon-gper-hot-question.svg">
      </span>
      <span class="hot-name">热门标签</span>
    </div>
    <div class="hot-info">
        <div class="hot_item" v-for="item in hotDataList">
          <span @click="toTagDetail(item.id)">{{item.name}}</span>
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
      this.getHotTags();//查询热门标签
    },
    methods: {
      getHotTags(){
        this.$post('tag/pageQueryByHotTags').then((res) =>{
          if(res.data.success){
            this.hotDataList = res.data.data.list;
          }
        })
      },
      toTagDetail(tagid){
        this.$router.push({name:'tagDetail',params:{tagid:tagid}});
      }
    }
  }
</script>
<style scoped>
  .hot_tags{display: block; margin-bottom: 12px; background: rgba(244, 244, 244, 0.5);padding: 15px 17px 13px;}
  .hot_tags .hot-tags-title{width:100%;height: auto;display: block; margin-bottom: 13px;}
  .hot-tags-title .hot-logo{width:36px;height: 27px;display: inline-block;vertical-align: sub;}
  .hot-tags-title .hot-logo img{width:36px;height:27px;}
  .hot-tags-title .hot-name{font-size:16px;font-weight:bold;line-height:27px;color:#000000;display:inline-block;vertical-align:super;padding-left:8px;font-family:PingFang SC;}
  .hot-info .hot_item {display:inline-block;background:rgba(255,255,255,0.9);color:rgba(0,0,0,0.65);padding:0 4px;font-size:12px;line-height:22px;margin:0 8px 10px 0;cursor:pointer;}
  .hot-info .hot_item:hover{color:#2d8cf0;}
</style>
