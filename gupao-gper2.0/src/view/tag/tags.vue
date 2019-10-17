<template>
  <div id="tags">
    <Row :gutter="24">
      <Col span="24">
        <div class="tag-title">
          <span class="title">问答标签</span>
        </div>
        <div class="dotted-line"></div>
        <div class="dotted-line"></div>
        <div class="tag-content">
          <div class="tag-item" v-for="item,index in tagList">
            <div class="tag-item-header">{{item.name}}：</div>
            <div class="tag-item-body">
              <div class="nodata" v-if="!item.tagsList">没有数据</div>
              <span v-for="tags,i in item.tagsList" @click="toTagDetail(tags.id)">{{tags.name}}</span>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  </div>
</template>
<script>
  export default {
    name: "tags",
    data(){
      return {
        tagList:[]
      }
    },
    mounted(){
      this.getTags();
    },
    methods:{
      getTags(){
        this.$post('category/pageQueryByTags', {pageNum:1,pageSize:20,type:'questions'}).then((res) =>{
          if(res.data.success){
            this.tagList = res.data.data.list;
          }
        });
      },
      toTagDetail(tagid){
        this.$router.push({name:'tagDetail',params:{tagid:tagid}});
      }
    }
  }
</script>
<style scoped>
  #tags{padding:0 72px}
  .tag-title{margin-bottom:14px;height:auto;width:100%;display:block}
  .tag-title .title{display:inline-block;font-size:24px;font-weight:400;line-height:33px;color:#000000}
  .dotted-line{height:1px;margin-top:1px;border-bottom:1px dotted #e8e8e8}
  .tag-content{padding-top:16px;display:flex;justify-content:flex-start;flex-wrap:wrap;margin-right:-61px}
  .tag-item{margin-bottom:32px;width:238px;min-height:138px;margin-right:61px}
  .tag-item-header{padding:7px 1px;font-size:14px;font-weight:400;line-height:20px;color:#000000d9;border-bottom:1px dotted #70707026}
  .tag-item-body{display:flex;flex-wrap:wrap;justify-content:flex-start;align-items:baseline;margin-top:13px;margin-right:-10px}
  .tag-item-body span{font-size:12px;line-height:17px;padding:3px 8px 2px 8px;margin-right:10px;margin-bottom:8px;background:#f4f4f4;border-radius:3px;min-width:65px;text-align:center;cursor:pointer}
  .tag-item-body span:hover{color:#2d8cf0}
  .nodata{color:#c5c5c5;margin:34px 95px}
</style>
