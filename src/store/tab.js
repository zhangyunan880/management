export default {
    state: {
        isCollapse: false,
      
    },
    mutations: {
        CollapseMenu(state) {
            state.isCollapse = !state.isCollapse
        },


    
    }
}