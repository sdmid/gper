<template>
  <div id="shop">
    <Row :gutter="24">
      <Col span="18">
        <div class="title">全部商品</div>
        <Divider style="margin: 12px 0;"/>
        <div>
          <div class="good-item" v-for="(item,index) in goodList" :key="index" :class="getItemClass(index)">
            <img   @click="toGoodDetail(item)" class="good-image" v-lazy="item.logoUrl" :key="item.logoUrl" alt="item.description"/>
            <div class="good-info">
              <div class="good-name">{{item.name}}</div>
              <div class="clear">
                <div class="left-wrapper"><span class="inline right-middle">剩余{{item.remnants}}个</span><span class="inline">已兑换{{item.changedNum}}个</span></div>
                <div class="right-wrapper"><img class="icon-image inline" src="/static/img/icon-gper-gold.svg"/><span  class="inline right-middle">{{item.coins}}</span><i class="icon-gper-vip inline"></i><span  class="inline">{{item.vipCoins}}</span></div>
              </div>
              <div style="text-align: center"><span class="detail-btn" @click="toGoodDetail(item)">查看详情</span></div>
            </div>
          </div>
        </div>
        <Page :total="total" :pageSize="9" :current="goodListParams.page" @on-change="to_good_page" />
      </Col>
      <Col span="6">
        <shop-right></shop-right>
        <about></about>
      </Col>
    </Row>
  </div>
</template>
<script>
  import shopRight from '@/view/shop/shop_right.vue';
  import about from '@/components/footer/about';
  export default {
    name: 'index',
    components:{
      shopRight,
      about
    },
    data () {
      return {
        goodListParams: {
          page:1,
          pageSize:"9"
        },
        goodList: [],
        total: 0
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (from.name === 'goodDetail') {
          vm.goodListParams.page = vm.$store.state.shop.pageNum;
        }
        vm.getGoodList()
      })
    },
    methods: {
      getGoodList () {
       this.$post('goods/pageQuery', this.goodListParams).then((res) =>{
          this.goodList = res.data.data.list;
          this.total = res.data.data.total;
          this.$nextTick(()=> {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
          })
        });
      },
      to_good_page (i) {
        this.$store.dispatch("updatePageNum",i);
        this.goodListParams.page = i;
        this.getGoodList()
      },
      getItemClass (index) {
        if ((index + 1)%3 !== 0)  {
          return 'hasDistance'
        }
        return ''
      },
      toGoodDetail (item) {
        /*this.$router.push({
          path:'/good/detail',
          query:{
            id:item.id
          }
        });*/

        const {href} = this.$router.resolve({
          path:'/good/detail',
          query:{
            id:item.id
          }
        });
        window.open(href, '_blank');
      }
    }
  }
</script>
<style scoped>
  #shop {padding: 0 72px;}
  #shop .title {color: #313131; font-size: 16px;font-weight: bold;color: #000000;}
  #shop .good-item {width: 268px; display: inline-block; vertical-align:top;margin-bottom: 20px;  border:1px solid #DDE2E7;}
  #shop .good-item:hover {border:1px solid #459BF8;}
  #shop .good-item.hasDistance {margin-right: 18px}
  #shop .good-item .good-image{width: 266px; height: 200px; display: block; cursor: pointer}
  .good-info {height: 105px; border-top:1px solid #DDE2E7; padding: 0 14px}
  .good-item .good-name {line-height: 33px; font-size: 14px;font-weight: bold;color: #000000;border-bottom:1px solid #DDE2E7}
  .icon-image {width: 19px; height: 19px; margin-right: 3px; }
  .clear:after{content: ' ';display: block;clear: both;}
  .clear {line-height: 34px}
  .good-info .left-wrapper {float:left; }
  .good-info .right-wrapper {float:right;color: #F9AB10}
  .detail-btn {padding: 5px 20px; background: #459BF8;color: #fff; cursor: pointer;display: inline-block}
  .inline {display: inline-block; vertical-align: middle}
  .right-middle {margin-right: 8px}
  .ivu-page{text-align: center;padding-top: 20px;}
</style>
