<template>
  <div id="search">
    <Row>
      <Col span="18" style="padding-right: 12px;">
        <Input long search enter-button="搜索" placeholder="请输入关键字" v-model="searchKeyword" @on-search="handleSearch"/>
        <div class="menu">
          <Menu mode="horizontal" theme="light" :active-name="searchType" @on-select="selectModel">
            <MenuItem :name="item.value" :key="item.value" v-for="item,index in types">
              {{item.name}}
            </MenuItem>
          </Menu>
        </div>
        <div class="search-content">
          <answer v-if="searchType == 'answer'" :data="se_answer_res"></answer>
          <artic v-if="searchType == 'articles'" :data="se_artic_res"></artic>
          <div v-if="searchType == 'tags'">
            <div class="nomore">
              <Icon custom="icon-gper-nomorecontent" color="#bdbdbd" size="120"/>
              <span>没有查询到相关数据</span>
            </div>
          </div>
          <user v-if="searchType == 'users'" :data="se_user_res"></user>
        </div>
        <div class="paging-controls" v-if="search_total > 0">
          <Page :total="search_total" prev-text="上一页" next-text="下一页" @on-change="get_page_search" />
        </div>
      </Col>
      <Col span="6" style="padding-left: 12px;">
        <hotQA></hotQA>
        <about></about>
      </Col>
    </Row>
  </div>
</template>
<script>
  import hotQA from '@/components/common/hotQuestion&Answer';
  import about from '@/components/footer/about';
  import answer from '@/components/search/answer';
  import artic from '@/components/search/artic';
  import user from '@/components/search/user';

  export default {
    name: 'search',
    components:{
      hotQA,
      about,
      answer,
      artic,
      user
    },
    data(){
      return {
        searchType:'',
        searchKeyword:'',
        types:[{
          name:'问答',
          value:'answer'
        },{
          name:'文章',
          value:'articles'
        },/*{
          name:'标签',
          value:'tags'
        },*/{
          name:'用户',
          value:'users'
        }],

      }
    },
    mounted(){
      this.initSearch();
    },
    methods: {
      handleSearch(){
        this.handleNav();
      },
      initSearch(){
        var type = this.$route.query.type;
        this.searchType = type;
        var value = this.$route.query.value;
        this.searchWord = value;

        var query = this.$route.query;
        if(query.type){
          this.searchType = query.type;
        }else{
          this.searchType = 'answer';
        }

        if(query.value){
          this.searchKeyword = query.value.trim();
          this.handleNav();
        }else{
          this.se_answer_pa.word = '';
          this.se_artic_pa.word = '';
          this.se_user_pa.word = '';
          this.$store.state.search.se_answer_res = [];
          this.$store.state.search.se_artic_res = [];
          this.$store.state.search.se_user_res = [];
          this.$store.state.search.search_total = 0;
        }
      },
      handleNav(){//搜索分类切换
        if(this.searchType == 'answer'){
          this.se_answer_pa.word = this.searchKeyword.trim();
          this.$store.state.search.se_answer_res = [];
          this.$store.dispatch('se_answer');
        }
        if(this.searchType == 'articles'){
          this.se_artic_pa.word = this.searchKeyword.trim();
          this.$store.state.search.se_artic_res = [];
          this.$store.dispatch('se_artic');
        }
        if(this.searchType == 'tags'){
          this.$store.state.search.search_total = 0;
        }
        if(this.searchType == 'users'){
          this.se_user_pa.word = this.searchKeyword.trim();
          this.$store.state.search.se_user_res = [];
          this.$store.dispatch('se_user');
        }
      },
      get_page_search(i){//搜索的分页
        if(this.searchType == 'answer'){
          this.se_answer_pa.page = i;
          this.$store.dispatch('se_answer');
        }
        if(this.searchType == 'articles'){
          this.se_artic_pa.page = i;
          this.$store.dispatch('se_artic');
        }
        if(this.searchType == 'users') {
          this.se_user_pa.page = i;
          this.$store.dispatch('se_user');
        }
      },
      selectModel(model){
        this.searchType = model;
        this.handleNav();
      },

    },
    computed:{
      se_answer_pa(){
        return this.$store.state.search.se_answer_pa;
      },
      se_artic_pa(){
        return this.$store.state.search.se_artic_pa;
      },
      se_user_pa(){
        return this.$store.state.search.se_user_pa;
      },
      se_answer_res(){
        return this.$store.state.search.se_answer_res;
      },
      se_artic_res(){
        return this.$store.state.search.se_artic_res;
      },
      se_user_res(){
        return this.$store.state.search.se_user_res;
      },
      search_total(){
        return this.$store.state.search.search_total;
      }
    },
    watch:{
      '$route' (to, from) {
        this.initSearch();
      }
    }
  }
</script>
<style>
  #search{margin: 0 72px;}
  #search .menu{margin-top: 5px;}
  #search .menu .ivu-menu{z-index: 0;}
  #search .menu .ivu-menu-horizontal {height: 56px;line-height: 56px;}
  .paging-controls{padding:40px;text-align: center;}
  .nomore{margin:25px;text-align: center;font-size: 14px;color: #bdbdbd;}
  .nomore span{padding:40px;display: block;}
</style>
