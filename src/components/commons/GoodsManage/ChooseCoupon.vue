<!---
选择添加优惠券
-->
<template>
  <div>
    <div class="tips">
      <CouponMarket
        :list="commModal.modalList"
        :total="commModal.total"
        @getCouponList="getCouponList"
        :size="conSize"
        :noCYWX ="true"
      >
        <template #list>
          <div v-if="commModal.total">
            <CouponList
              :couponList="commModal.modalList"
              :spinShow="commModal.spinShow"
              :checkedIds="couponCheckedIds"
              origin="activity"
            >
              <template #editbox="{item}">
                <span>
                  <Radio
                    :value="couponCheckedIds.indexOf(item.couponId)>-1"
                    @on-change="(status)=>couponItemCheck(status,item)"
                    :key="Math.random()"
                    :disabled="item.remainNum<1"
                  ></Radio>
                </span>
              </template>
              <template #editbottom="{item}">
                <i-col :span="24">
                  <Poptip
                    trigger="hover"
                    word-wrap
                    width="380"
                    height="450"
                    :content="item.couponDesc"
                  >
                    <span>使用说明</span>
                    <div slot="content">
                      <ViewCoupon :infor="item" :product="item.business" />
                    </div>
                  </Poptip>
                </i-col>
              </template>
            </CouponList>
          </div>
          <div v-else class="no-data">未找寻到符合条件的优惠券，请调整搜索参数</div>
        </template>
      </CouponMarket>
    </div>
    <div class="btn-box">
      <Button @click="cancelCoupon">取消</Button>
      <Button type="primary" @click="confirmCoupon">确定</Button>
    </div>
  </div>
</template>
<script>
import CouponMarket from "@/components/commons/CouponCom";
import CouponList from "@/components/commons/Coupon/ViewCouponList";
import ViewCoupon from "@/components/commons/Coupon/ViewCouponInfor";
import {mapActions} from 'vuex';

export default {
  name:'choose-coupon',
  components:{
    CouponMarket,ViewCoupon,CouponList
  },
  data(){
    return {
      conSize: 8,
      couponCheckedIds:[],
      curCoupon:null,
      commModal: {
        showModal: false,
        modalName: "",
        modalList: [],
        total: 0,
        groupSearch: {},
        couponSearch: {},
        spinShow: false
      },
    }
  },
  methods:{
    ...mapActions("couponModule", [ "loadCouponList"]),
    //加载优惠券列表
    getCouponList(search) {
      this.commModal.spinShow = true;
      this.loadCouponList(search)
        .then(res => {
          this.commModal.modalList = res.list;
          this.commModal.total = res.count;
          this.commModal.spinShow = false;
        })
        .catch(() => (this.commModal.spinShow = false));
    },
    couponItemCheck(status, coupon) {
      let curIndex = this.couponCheckedIds.indexOf(coupon.couponId);
      this.couponCheckedIds = [];
      if (status) {
        this.couponCheckedIds.push(coupon.couponId);
        this.curCoupon = coupon;
      } else {
        this.couponCheckedIds.splice(curIndex, 1);
      }
    },
    cancelCoupon(){
      this.curCoupon = null;
      this.$emit("cancelCoupon")
    },
    confirmCoupon(){
      if(!this.curCoupon){
        this.$Message.error("请选择优惠券");
      }
      this.$emit("confirmCoupon",this.curCoupon);
      this.curCoupon = null;
    }
  }  
}
</script>