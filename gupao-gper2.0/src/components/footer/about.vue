<template>
  <div class="about">
    <span class="link">关注我们</span>
    <div class="icon-link">
      <a href="javascript:void(0)">
        <img src="/static/img/icon-gper-qq.svg">
      </a>


      <Poptip placement="bottom" style="margin: 0 15px 11px;width: 25px;height: 25px;">
        <a href="javascript:void(0)" style="margin:0;">
          <img src="/static/img/icon-gper-wechat.svg">
        </a>
        <div class="api" slot="content">
          <img src="/static/img/foot-weix.png">
        </div>
      </Poptip>

      <a href="https://weibo.com/gupaoedu" target="_blank">
        <img src="/static/img/icon-gper-weibo.svg">
      </a>
    </div>
    <div class="more-link">
      <a href="https://www.gupaoedu.com/about.html" target="_blank">关于</a>
      <a href="https://www.gupaoedu.com/recruit.html" target="_blank">招聘</a>
      <a href="https://www.gupaoedu.com/about.html?con=shangwuhez" target="_blank">商务合作</a>
      <a href="https://www.gupaoedu.com/index.html" target="_blank">友情链接</a>
      <a href="https://www.gupaoedu.com/index.html" target="_blank">发现更多</a>
    </div>
    <span class="record">Release 20180613 ©2009-2018</span>
    <br>
    <span class="record">沪CIP备16036932号-2</span>
  </div>
</template>
<style scoped>
  .about{display: block;/*width: 100%;*/height:auto;text-align: center;margin: 10px 5px 0 12px;}
  .about .link{font-size:12px;font-weight:400;line-height:20px;margin:11px;cursor: pointer;display: inline-block;}
  .about .icon-link{display: flex;justify-content:center;}
  .about .icon-link a{margin:0 15px 11px;width:25px;height: 25px;}
  .about .icon-link a img{width:25px;height: 25px;}
  .about .more-link{display: flex;justify-content:space-between;}
  .about .more-link a{color:#515a6e;font-size:12px;font-weight:400;line-height:20px;margin-bottom: 6px;}
  .about .more-link a:hover{color:#2d8cf0;}
  .about .record{display: inline-block;font-size:12px;font-weight:400;line-height:20px;margin-bottom: 6px;}
</style>
