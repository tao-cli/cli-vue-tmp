/***********************
 * @desc 路由方法
 * @name JS
 * @author Jo.gel
 * @date 2019/5/24 0024
 ***********************/
import {axios_get} from "../utils/axios";
import store from '../store/index';
import {deepCopy} from "../utils/tools";
import routes from './backRouter';
export const matchMenu = function (tree, itype, obj) {
	tree && tree.forEach((item) => {
		if (item.type === itype) {
			obj[item.value] = item.id;
		}
		if (item.children && item.type === itype) {
			matchMenu(item.children, itype, obj);
		}
	});
	return obj;
};


export const matchTree = function (tree, obj, flag) {
	const result = [];
	const ids = Object.keys(obj || {}) || [];
	flag++;
	tree && tree.forEach((item) => {
		// 如果有子节点，递归
		if (item.children) {
			item.children = matchTree(item.children, obj, flag);
		}
		if (flag < 1 || ids.includes(item.name)) {
			item.meta.id = obj[item.name];
			result.push(item);
		}
	});
	return result;
};
//分割前端实际路由
export const getRouter = (local) => {
	// local
	sessionStorage.clear();
	const token = localStorage.getItem('token');
	if (!token) {
		location.href = '/login.html';
	}
	return axios_get('/user-server/auth/user/powers')
		.then(res => {
			if (res && res.code === 10000) {
				let iMenu = matchMenu(res.data, 'MENU', {}); //返回 {路由名:id}
				let copyData = Object.create(null);
				
				copyData = deepCopy(routes, copyData);
				const allRoutes = [copyData[0]];
				let iRouter = matchTree(allRoutes, iMenu, -1);//真实路由
				sessionStorage.setItem("operTree", JSON.stringify(iMenu));
				sessionStorage.setItem("roleTree", JSON.stringify(res.data));//powers
				if (local) {
					sessionStorage.removeItem('roleTree');
				}
				store.dispatch('setModuleId', iMenu);//设置模块
				store.dispatch('switchCompany', res.data);//menu
				store.dispatch('setRealRouter', iRouter);//切换子公司时候，将值给store
				return Promise.resolve(iRouter);
			}
		});
};
