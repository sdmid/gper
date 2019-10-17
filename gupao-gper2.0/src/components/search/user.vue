<template>
  <div id="search_user">
    <div v-if="!data || data.length == 0" class="nomore">
      <Icon custom="icon-gper-nomorecontent" color="#bdbdbd" size="120"/>
      <span>没有查询到相关数据</span>
    </div>
    <div v-for="(item,index) in data" class="search-list">
      <div class="item-content">
        <div class="hot_title" @click="to_user_detail(item.id)">
          {{item.name}}
          <span v-if="item.title"> - {{item.title}}</span>
        </div>
      </div>
      <div class="item-description">
        <p>{{item.description}}</p>
      </div>
    </div>
  </div>
</template>
<script>

  export default{
    props:['data'],
    methods:{
      to_user_detail(id){//跳转到用户详情页
        const {href} = this.$router.resolve({name: 'TAdynamic',params:{userid:id}});
        window.open(href, '_blank');
      }
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
  .item-description p {font-size:13px;line-height:18px;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 3;overflow: hidden;}
</style>
