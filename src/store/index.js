/*
 * @Description: vuex store
 * @Author: sam.xutao
 * @Date: 2020-02-20 11:00:58
 * @LastEditTime: 2020-04-02 12:41:15
 * @LastEditors: sam.xutao
 */
import Vue from 'vue';
import Vuex from 'vuex';
import menu from './module/menu';
import hallMenuList from "./module/hall-menu";
import couponModule from "./module/coupon";
import platformModule from './module/platform';
import commModule from './module/comm';
import {axios_get} from "../utils/axios";

Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        username: localStorage.getItem('name') || '',
        phone: localStorage.getItem('phone') || '',
        headImg: localStorage.getItem('headImg') || '',
        storeLogo: localStorage.getItem('storeLogo'),
        companyList: [],
        areaCity: {},		// 城市数据原信息
    },
    getters: {
        // 级联城市信息
        cascadeCitys: state => {
            let arr = [], iArea = {
                'provinceList': state.areaCity['provinceList'] || {},
                'cityList': state.areaCity['cityList'] || {},
                'countyList': state.areaCity['countyList'] || {},
            };
            for (let item in iArea) {
                // 省份，过滤了海外地区
                if (item.includes('province')) {
                    Object.keys(iArea[item]).forEach((key) => {
                        key.substr(0, 1) != 9 && arr.push({value: iArea[item][key], code: key, label: iArea[item][key], children: []})
                    })
                }
                // 封装城市信息
                if (item.includes('city')) {
                    arr.map(province => {
                        Object.keys(iArea[item]).forEach((key) => {
                            if (province.code.substr(0, 2) === key.substr(0, 2)) {
                                province.children.push({value: iArea[item][key], code: key, label: iArea[item][key], children: []})
                            }
                        })
                    })
                }
                // 封装乡镇信息
                if (item.includes('county')) {
                    arr.map(province => {
                        province.children.map(city => {
                            Object.keys(iArea[item]).forEach((key) => {
                                if (city.code.substr(0, 4) === key.substr(0, 4)) {
                                    city.children.push({ value: iArea[item][key], code: key, label: iArea[item][key]})
                                }
                            })
                        })
                    })
                }
            }

            return arr;
        },
    },
    mutations: {
        //用户姓名
        SET_USERNAME(state, data) {
            state.username = data;
        },
        SET_PHONE(state, data) {
            state.phone = data;
        },
        SET_AVATAR(state, data) {
            state.headImg = data;
        },
        SET_STORE_LOGO(state, data) {
            state.storeLogo = data;
        },
        SET_COMPANY_LIST(state, data) {
            state.companyList = data;
        },
        // 获取城市数据信息
        LOAD_AREACIT_INFO(state, data) {
            state.areaCity = data;
        }
    },
    actions: {
        setUsername({commit}) {
            commit("SET_USERNAME", localStorage.getItem('name'));
        },
        setPhone({commit}) {
            commit("SET_PHONE", localStorage.getItem('phone'));
        },
        setAvatar({commit}) {
            commit("SET_AVATAR", localStorage.getItem('headImg'));
        },
        setStoreLogo({commit}) {
            commit("SET_STORE_LOGO", localStorage.getItem('storeLogo'));
        },
        getCompanyList({commit}) {
            axios_get('/user-server/auth/get/org/list')
                .then(res => {
                    if (res && res.code === 10000) {
                        commit('SET_COMPANY_LIST', (res.data || []).map(item => {
                            return {
                                label: item.orgName,
                                value: item.orgId
                            };
                        }));
                    }
                });
        },
        // 获取城市数据信息，isInter18是否返回国际数据 1 或 -1
        async getAreaCityInfor({commit}, isInter18) {
            const {data} = await axios_get('/support-server/api/support/area/getAll', {isContainForeign: isInter18 ? 1 : -1});
            if (data) {
                commit('LOAD_AREACIT_INFO', data)
            }
        }
    },
    modules: {
        menu, hallMenuList, platformModule, commModule, couponModule
    }
});
