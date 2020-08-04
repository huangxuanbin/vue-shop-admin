import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import Menu from './modules/menu';
import UserData from './modules/user';
// 当store初始化后调用
const save = (store) => {
    // 使用本地state替换初始化state
    if (localStorage.localState) {
        // 获取本地state
        let localState = JSON.parse(localStorage.localState);
        // 使用本地的state替换初始化state
        store.replaceState(localState);
    }
    // 每次mutation后调用,储存最新的state
    store.subscribe((mutation, state) => {
        localStorage.localState = JSON.stringify(state);
    })
}

Vue.use(Vuex)
export default new Vuex.Store({
    modules: {
        Menu,
        UserData
    },
    plugins: [save],
})
