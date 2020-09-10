/*
 * @Description: 通用 reducer
 * @Author: sam.xutao
 * @Date: 2020-03-18 17:47:43
 * @LastEditTime: 2020-04-01 17:27:54
 * @LastEditors: sam.xutao
 */

import {axios_post,axios_get} from "@/utils/axios";
export default {
  namespaced: true,
  actions:{
    //根据搜索条件返回优惠券列表信息
    loadCouponList({state},search){
      const url = '/coupon-server/api/coupon/market/pageList';
      let iSearch = JSON.parse(JSON.stringify({...search,orgId:localStorage.orgId}||state.couponSearch));
      // this.commModal.spinShow = true;
      // iSearch.couponOrigin = !iSearch.couponOrigin?null:iSearch.couponOrigin;
      return axios_post(url,iSearch).then(res=>{
        if(res&&res.code===10000){
          return Promise.resolve(res.data);
        }else{
          return Promise.reject({})
        }
      }).catch(()=>Promise.reject({}));
    },
    // 拉取全部商品品牌列表
    async loadAllBrands({state}){
      console.log(state);
      return await axios_get('/goods-server/api/goods/brand/all')
    },
    async getCouponDetail({state},id){
      console.log(state);
      return await axios_post('/coupon-server/api/coupon/contact/getCouponDetail',{couponId:id});
    },
    // 拉取父子级商品分类列表
    async loadGoodsTypeList({state},search){
      console.log(state)
      return await axios_get('/goods-server/api/goods/category/list',search);
    },
  }
}