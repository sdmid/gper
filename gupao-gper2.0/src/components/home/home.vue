<template>
  <div class="layout">
    <Layout>
      <Header>
        <GperHeader></GperHeader>
      </Header>
      <Content>
        <router-view/>
      </Content>
      <Footer>
        <GperFooter></GperFooter>
      </Footer>
    </Layout>
  </div>
</template>
<script>
  export default {

  }
</script>
<style scoped>
  .layout{
    width: 100%;
    height: 100%;
  }
  .ivu-layout{
    background:none;
  }
  .ivu-layout-header{
    padding: 0;
    height: 78px;
    z-index: 840;
    line-height: 78px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    background: #F7F7F7;
  }
  .ivu-layout-content {
    min-height: 800px;
    width: 1280px;
    margin: 18px auto 0;
  }
  .layout-footer-center{
    text-align: center;
  }
  .ivu-layout-footer{background:none;}
</style>
