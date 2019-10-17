<template>
  <div id="search_answer">
    <div v-if="!data || data.length == 0" class="nomore">
      <Icon custom="icon-gper-nomorecontent" color="#bdbdbd" size="120"/>
      <span>没有查询到相关数据</span>
    </div>
    <div v-if="item.title" class="search-list" v-for="item,index in data">
      <div class="item-content">
        <span class="resolved" v-if="item.status == 2">已解决</span>
        <span class="unsolved" v-if="item.status == 1">待解决</span>
        <div class="hot_title" v-html="entityToString(item.title)" @click="toDetail(item.id)"></div>
      </div>
      <div class="item-description" @click="toDetail(item.id)">
        <div v-html="entityToString(item.description)"></div>
      </div>
    </div>
  </div>
</template>
<script>

  export default{
    props:['data'],
    data() {
      return {
        result: [],
      }
    },
    methods:{
      toDetail(id){
        const {href} = this.$router.resolve({name:'AnswerDetail',params:{id:id}});
        window.open(href, '_blank')
      },
      entityToString(entity){
        var div = document.createElement('div');
        div.innerHTML=entity;
        var text = div.innerText||div.textContent;
        text = this.replaceAll(text,this.se_answer_pa,'<span style="color:red">'+this.se_answer_pa+'</span>');
        if(text.length>200){
          text = text.substring(0,200)+'...';
        }
        return text;
      },
      replaceAll(text,FindText, RepText) {
        var regExp = new RegExp(FindText, "gi");
        return text.replace(regExp, RepText);
      }
    },
    computed: {
      se_answer_pa() {
        return this.$store.state.search.se_answer_pa.word;
      },
    }
  }
</script>
<style scoped>
  .search-list{width:100%; padding:14px; border-bottom:1px solid #efefef;}
  .item-content{width:100%;height:24px;margin-bottom: 5px;}
  .resolved{font-size:12px;line-height:18px;padding:3px 8px 2px 8px;background:#efefef;color:#51C41A;border-radius:3px;display:inline-block;float:left;}
  .unsolved{font-size:12px;line-height:18px;padding:3px 8px 2px 8px;background:#efefef;border-radius:3px;display:inline-block;float:left;}
  .hot_title{float:left;padding-left:10px;max-width: 800px;font-size:15px;line-height:23px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;cursor: pointer;}
  .hot_title:hover{color:#2d8cf0;}
</style>
