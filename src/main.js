import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
Vue.use(ElementUI);
Vue.use(ElementUI,{
    size:'mini'
})




import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table',TreeTable)

import 'element-ui/lib/theme-chalk/index.css';
import router from './router/index'
import './assets/less/index.less'
import store from './store'

import '@/assets/css/global.css'
import '@/assets/font/iconfont.css'

import *as API from '@/api'
Vue.config.productionTip = false

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

//全局过滤器 参数1:过滤器名字
Vue.filter('dateFormat', function (originVal) {
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')
    
    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
    render: h => h(App),
    router,
    store,
    beforeCreate(){
        Vue.prototype.$bus = this	//安装全局事件总线
        Vue.prototype.$API = API
	}
}).$mount('#app')
