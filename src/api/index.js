import request from "./request";



//登录
export const login = (data) => request({
    url:'login',data,
    method:'post'
})

//侧边栏
export const reqMenus = () => request({
    url: "menus",
    method:'get'
})


//获取用户列表
export const reqUserList = (params) => request({
    url: `users`,params,
    method:'get'
})

//修改用户状态
export const reqUserState = (id, mg_state) => request({
    url: `users/${id}/state/${mg_state}`,
    method:'put'
})

//添加用户的请求
//当前这个接口给服务器传递一个默认参数【至少是一个空对象】
//参数传空对象要写个data:params
export const reqAddUser = (params) => request({
    url:'users',
    method: 'post',
    data:params 
})

//根据id修改用户信息
export const requserInfo = (id) => request({
    url: `users/${id}`,
    method:'get'
})

//编辑用户
export const reqeditInfo = (id,params) => request({
    url: `users/${id}`,
    method: 'put',
    data:params
})

//删除用户
export const reqdelUser = (id) => request({
    url: `users/${id}`,
    method:'delete'
}) 

//获取权限列表
export const reqRightsList = () => request({
    url: 'rights/list',
    method:'get'
})

//获取所有角色的列表
export const reqRolesList = () => request({
    url: 'roles',
    method:'get'
})


//删除角色权限
export const reqdelRoles = (role,right) => request({
    url: `roles/${role}/rights/${right}`,
    method:'delete'
})

//获取所有权限的树行结构
export const reqRightTree=() => request({
    url: 'rights/tree',
    method:'get'
})


//分配权限
export const reqAssign = (id,rids) => request.post(`roles/${id}/rights`,{rids})  
    
  

//获取角色列表
export const reqsetRole = () => request.get('roles')
// 添加角色
export const addRole = (obj) => request.post('roles', obj)
// 修改角色
export const editRole = (id, obj) => request.put(`roles/${id}`, obj)
// 删除角色
export const delRole = (id) => request.delete(`roles/${id}`)


//分配角色
export const reqRole=(id,rid)=>request.put(`users/${id}/role`,{rid})

//商品分类
export const reqCateList = (queryinfo) => request.get('categories', { params: queryinfo })

//获取父级分类
export const reqParentCateList = () => request.get('categories', { params: { type: 2 } })

//提交分类
export const reqAddcate = (obj) => request.post('categories', obj)

//获取商品分类列表
export const reqgoodslist = () => request.get('categories')


export const reqcateattr = (id, sel) => request.get(`categories/${id}/attributes`, { params: { sel} })

//添加动态参数或者属性
export const reqAddparams = (cateid, name, sle) => request.post(`categories/${cateid}/attributes`, { attr_name: name, attr_sel: sle })


//根据id查询参数
export const reqprop = (cateid, id, sel) => request.get(`categories/${cateid}/attributes/${id}`, { params: { attr_sel: sel } })

//确定修改
export const reqConfirm =(cateid,id,name,sle) =>request.put(`categories/${cateid}/attributes/${id}`,{attr_name:name,attr_sel: sle })
// 编辑分类
export const editCateGories = (id, name) => request.put(`categories/${id}`, { cat_name: name })
// 删除分类
export const deleteCateGories = (id) => request.delete(`categories/${id}`)


//删除参数
export const reqdelparams = (cateid, attrid) => request.delete(`categories/${cateid}/attributes/${attrid}`)

//添加tag
export const reqAddTag = (cateid, id, name, sel, val) => request.put(`categories/${cateid}/attributes/${id}`, { attr_name: name, attr_sel: sel, attr_vals: val })

//获取商品列表
export const reqGoods = (queryinfo) => request.get(`goods`, { params: queryinfo })


// 添加商品
export const addGood = (obj) => request.post('goods', obj)
//删除商品
export const reqdelgoods = (id) => request.delete(`goods/${id}`)

//订单数据列表
export const getOrdersList = (obj) => request.get('orders', { params: obj })
// 查看物流
export const showKuaidi = () => request.get('/kuaidi/1106975712662')

// 基于时间的数据统计
export const getReports = () => request.get('reports/type/1')
