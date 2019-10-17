import Vue from 'vue'
import Vuex from 'vuex'
import '../../libs/http.js'
import common from './common.js'
import login from './login.js'
import main from './main.js'
import search from './search.js'
import person from './person.js'
import answers from './answers.js'
import action from './action.js'
import qqinfor from './qqinfor.js'
import bubbling from './bubbling.js'
import article from './article.js'
import home from './home.js'
import shop from './shop.js'

Vue.use(Vuex);

const state={

}

const getters={

}

const mutations={

}

const actions={

}

export default new Vuex.Store({

  modules: {
    common:common,
    login:login,
    main:main,
    search:search,
    person:person,
    answers:answers,
    action:action,
    qqinfor:qqinfor,
    home:home,
    bubbling:bubbling,
    article:article,
    shop:shop
  }

})
