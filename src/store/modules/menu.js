let Menu = {
    namespaced:true,
    state: {
        isCollapse: false,//侧边栏菜单
    },
    mutations: {
        clickIcon(state) {
            state.isCollapse = !state.isCollapse;
        },
    }
}
export default Menu;