import Vue from 'vue'
import Router from 'vue-router'
import header from '@/components/header/header'
Vue.component('GperHeader',header);
import footer from '@/components/footer/footer'
Vue.component('GperFooter',footer);
Vue.use(Router);

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      redirect: '/index/newest'
    },
    {
      path: '/home',
      redirect: '/index/newest'
    },
    {
      path: '/login',
      component: resolve => require(['../view/account/login.vue'], resolve),
      meta: { title: 'Gper社区-用户登录' },
    },
    {
      path: '/login2tel',
      component: resolve => require(['../view/account/loginForTel.vue'], resolve),
      meta: { title: 'Gper社区-手机登录' },
    },
    {
      path: '/qqcallback',
      name:'qqcallback',
      component: resolve => require(['../view/account/loginForQQ.vue'], resolve),
      meta: { title: 'Gper社区-QQ登录账号关联' },
    },
    {
      path: '/register',
      component: resolve => require(['../view/account/register.vue'], resolve),
      meta: { title: 'Gper社区-新用户注册' },
    },
    {
      path: '/register_success',
      component: resolve => require(['../view/account/register_success.vue'], resolve),
      meta: { title: 'Gper社区-注册成功' },
    },
    {
      path: '/reset_password',
      component: resolve => require(['../view/account/reset_password.vue'], resolve),
      meta: { title: 'Gper社区-重置密码' },
    },
    {
      path: '/reset_password_success',
      component: resolve => require(['../view/account/reset_success.vue'], resolve),
      meta: { title: 'Gper社区-重置密码成功' },
    },
    {
      path: '/reset_tips',
      component: resolve => require(['../view/account/reset_success1.vue'], resolve),
      meta: { title: 'Gper社区-重置密码成功' },
    },
    {
      path: '/auth/forgetPassword/:accessToken',
      component: resolve => require(['../view/account/reset_password2.vue'], resolve),
      meta: { title: 'Gper社区-设置新密码' },
    },
    {
      path: '/user_agreement',
      component: resolve => require(['../view/account/userAgreement.vue'], resolve),
      meta: { title: 'Gper社区-用户协议和隐私条款' },
    },
    {
      path: '/editarticlemd',
      component: resolve => require(['../view/article/edit_article_md.vue'], resolve),
      meta: { title: '发表文章-markdown' }
    },
    {
      path: '/',
      component: resolve => require(['../components/home/home.vue'], resolve),
      meta: { title: 'Gper社区' },
      children:[
        {
          path: '/index/:category',
          component: resolve => require(['../view/main/index.vue'], resolve),
          meta: { title: 'GPer生态圈IT技术人技术分享交流学习高端论坛社区_咕泡学院' }
        },
        {
          path: '/index/:category/:channel',
          component: resolve => require(['../view/main/index.vue'], resolve),
          meta: { title: 'GPer生态圈IT技术人技术分享交流学习高端论坛社区_咕泡学院' }
        },
        {
          path:'/answer/detail/:id',
          name:'AnswerDetail',
          meta:{title:'问答详情'},
          component: resolve => require(['../view/main/detail.vue'], resolve),
        },
        {
          path:'/questioning',
          name:'Questioning',
          meta:{title:'我要提问'},
          component: resolve => require(['../view/main/questioning.vue'], resolve),
        },
        {
          path: '/article',
          name:'article',
          component: resolve => require(['../view/article/article.vue'], resolve),
          meta: { title: 'GPer生态圈IT技术文章技术资料分享交流平台_咕泡学院' }
        },
        {
          path: '/article/:category',
          name:'article',
          component: resolve => require(['../view/article/article.vue'], resolve),
          meta: { title: 'GPer生态圈IT技术文章技术资料分享交流平台_咕泡学院' }
        },
        {
          path: '/articleContent',
          name: 'articleContent',
          component: resolve => require(['../view/article/articleContent.vue'], resolve),
          meta: { title: '文章详情' }
        },
        {
          path: '/editarticle',
          component: resolve => require(['../view/article/editarticle.vue'], resolve),
          meta: { title: '发表文章' }
        },
        {
          path: '/bubbling',
          component: resolve => require(['../view/bubbling/bubbling.vue'], resolve),
          meta: { title: '冒泡广场_GPer生态圈' }
        },
        {
          path: '/bubblingDetail',
          component: resolve => require(['../view/bubbling/bubblingDetail.vue'], resolve),
          meta: { title: '冒泡详情' }
        },
        {
          path: '/shop',
          name: 'shop',
          component: resolve => require(['../view/shop/shop.vue'], resolve),
          meta: { title: '金币兑换商城_GPer生态圈' }
        },
        {
          path: '/good/detail',
          name: 'goodDetail',
          component: resolve => require(['../view/shop/goodDetail.vue'], resolve),
          meta: { title: '金币兑换商城' }
        },
        {
          path: '/tags',
          component: resolve => require(['../view/tag/tags.vue'], resolve),
          meta: { title: '问答标签' }
        },
        {
          path: '/tags/detail/:tagid',
          name:'tagDetail',
          component: resolve => require(['../view/tag/tagDetail.vue'], resolve),
          meta: { title: '问答标签详情' }
        },
        {
          path:'/personal',
          name:'personal',
          meta:{title:'个人主页'},
          component: resolve => require(['../view/personal/homePage.vue'], resolve),
          children:[
            {
              path:'dynamic/:userid',
              name:'TAdynamic',
              meta:{
                title:'我的动态'
              },
              component: resolve => require(['../view/personal/dynamic.vue'], resolve),
            },
            {
              path:'answer/:userid',
              name:'TAanswer',
              meta:{
                title:'我的回答'
              },
              component: resolve => require(['../view/personal/TAanswer.vue'], resolve),
            },
            {
              path:'question/:userid',
              name:'TAquestion',
              meta:{
                title:'我的提问'
              },
              component: resolve => require(['../view/personal/TAquiz.vue'], resolve),
            },
            {
              path:'article/:userid',
              name:'TAarticle',
              meta:{
                title:'我的文章'
              },
              component: resolve => require(['../view/personal/TAarticle.vue'], resolve),
            },
            {
              path:'gold/:userid',
              name:'TAgold',
              meta:{
                title:'我的金币'
              },
              component: resolve => require(['../view/personal/TAgold.vue'], resolve),
            },
            {
              path:'experience/:userid',
              name:'TAexperience',
              meta:{
                title:'我的经验'
              },
              component: resolve => require(['../view/personal/TAexperience.vue'], resolve),
            },
            {
              path:'fans/:userid',
              name:'TAfans',
              meta:{
                title:'我的关注'
              },
              component: resolve => require(['../view/personal/TAfans.vue'], resolve),
            },
            {
              path:'favorites/:userid',
              name:'TAfavorites',
              meta:{
                title:'我的收藏'
              },
              component: resolve => require(['../view/personal/TAfavorites.vue'], resolve),
            },
            {
              path:'redeem/:userid',
              name:'TAredeem',
              meta:{
                title:'我的兑换'
              },
              component: resolve => require(['../view/personal/TAredeem.vue'], resolve),
            },
            {
              path:'audit/:userid',
              name:'TAaudit',
              meta:{
                title:'众审中心'
              },
              component: resolve => require(['../view/personal/TAaudit.vue'], resolve),
            },
          ]
        },
        {
          path:'/setting',
          name:'Setting',
          meta:{title:'账号设置'},
          component: resolve => require(['../view/setting/setting.vue'], resolve),
          children:[
            {
              path:'my_information',
              name:'Iinformation',
              meta:{
                title:'个人资料'
              },
              component: resolve => require(['../view/setting/iInformation.vue'], resolve),
            },
            {
              path:'reset_password',
              name:'ResetPassword',
              meta:{
                title:'修改密码'
              },
              component: resolve => require(['../view/setting/resetKey.vue'], resolve),
            },
            {
              path:'bind_phone',
              name:'Bindphone',
              meta:{
                title:'更改手机'
              },
              component: resolve => require(['../view/setting/bindPhone.vue'], resolve),
            },
            {
              path:'bind_account',
              name:'Bindaccount',
              meta:{
                title:'账号绑定'
              },
              component: resolve => require(['../view/setting/bindAccount.vue'], resolve),
            }
          ]
        },
        {
          name:'search',
          path: '/search',
          component: resolve => require(['../view/search/search.vue'], resolve),
          meta: { title: '搜索' }
        },
        {
          name:'message',
          path: '/message',
          component: resolve => require(['../view/message/message.vue'], resolve),
          meta: { title: '消息' }
        },
        {
          name:'private',
          path: '/private',
          component: resolve => require(['../view/message/private.vue'], resolve),
          meta: { title: '全部私信' }
        },
        {
          name:'privateDetail',
          path: '/private/detail',
          component: resolve => require(['../view/message/privateDetail.vue'], resolve),
          meta: { title: '私信详情' }
        }
      ]
    },
    {
      path: "*",
      redirect: "/index/newest"
    }
  ]
})
