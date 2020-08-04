import { User } from '@/api/index';

let UserData = {
    namespaced: true,
    state: {
        profile: {}//账户资料
    },
    mutations: {
        setProfile(state, data) {
            state.profile = data;
        },
        editProfile(state, data) {
            state.profile = data;
        }
    },
    actions: {
        async loadProfile({ commit }) {
            let id = sessionStorage.uid;
            let { data, status } = await User.info({ id });
            if (status) {
                commit('setProfile', data);
            }
        }
    },
}
export default UserData;