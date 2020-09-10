/***********************
 * @name JS
 * @author Jo.gel
 * @date 2020/3/11 0011
 ***********************/
import {axios_get} from "../../utils/axios";

export default {
	state: {
		orgTreeList: [],
		powerBlankTree: []
	},
	mutations: {
		POWERS_TREE_LIST(state, data) {
			state.powerBlankTree = data;
		}
	},
	actions: {
		// 获取新增空白权限树
		getBlankPowersTree({commit}, obj) {
			let ob = {};
			if (obj.type === 'platform-department') ob['parentId'] = obj.id;
			axios_get(obj.url, ob)
				.then(res => {
					if (res && res.code === 10000) {
						commit('POWERS_TREE_LIST', res.data || []);
					}
				})
		},
		/* 操作、请求类*/
		// 获取详情时查询checked的tree结果，
		getRedisplayRoleTree({commit}, roleId) {
			commit('POWERS_TREE_LIST',  [])
			axios_get('/user-server/platform/role/update/powers', {roleId})
				.then(res => {
					if (res && res.code === 10000) {
						commit('POWERS_TREE_LIST', res.data || []);
					}
				})
		},
	}
};
