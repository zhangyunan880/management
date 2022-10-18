import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);


const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}


const router = new VueRouter({
    routes: [
    
        {
            path: '/',
            redirect: '/login'
        },
    
        {
        
            path: '/login',
            component: () => import('@/views/login')
        },
    
    
    
        {
            path: '/',
            name: 'main',
            // redirect:'users',
            component: () => import('../views/Main.vue'),
            children: [
                {

                    path: 'users',
                    name: '用户列表',
                    component: () => import('../views/user'),
                    
                },
               
                {
                    path: 'rights',
                    name: '权限列表',
                    component: () => import('../views/Rights')
                },
                {
                    path: '/roles',
                    name: '角色列表',
                    component: () => import('../views/Roles')
                },
                {
                    path: 'categories',
                    name: '商品分裂',
                    component:()=>import('../views/goods/Cate')
                },
                {
                    path: 'params',
                    name: '分类参数',
                    component:()=>import("@/views/goods/params")
                    
                },
                {
                    path: 'goods',
                    name: '商品列表',
                    component: () => import('@/views/goods/goods'),
                   
                },
                {
                    path: 'goods/add',
                    name: '添加分类',
                    component:()=>import('@/views/goods/children/add')
                },
                {
                    path: 'orders',
                    name: '订单列表',
                    component:()=>import('@/views/order/orders')
                },
                {
                    path: 'reports',
                    name: '数据报表',
                    component:()=>import('@/views/reports/reports')
                }

                ]
                }
                          





            ]


        
    
  
});


router.beforeEach((to,from ,next) => {
     //to 将要访问的路径
    //from 代表从哪个路由跳转而来
    //next 是一个函数 表示放行
    if (to.path === '/login') return next()
    
    //获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr)   return   next('/login')

    next()
})
    




export default router