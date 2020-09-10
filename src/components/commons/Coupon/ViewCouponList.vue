<!--展示优惠券列表-->
<style lang="scss" scoped>
.coupon-col-box{
  margin-bottom:25px; min-width:320px;
  div.checked{
    border:solid 1px #3D71FF;
  }
}
.header-text{font-size:inherit;font-family:inherit; display:inline-block; min-width:120px; max-width:160px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; float:left;}
.cardtypebox{
  text-align: center;
  i{display: inline-block; width:48px; height:48px;  background-repeat: no-repeat; background-size:100%;border-radius: 50%;}
  // 券一级类别 富基券-FJQ 长益券-CYQ 微信原生券-CYWQ 现金券-CASH 停车券-PARK 兑换券-EXCHANGE
  
  // REDUCTION-满减券,DISCOUNT-折扣券,EXCHANGE-兑换券,CARRIAGE-运费券,REAPACK-红包券
  .cardTypeCYWQ{background-image:url(../../../assets/images/coupon/coupon-weixin.png)}  
  .cardTypeREDUCTION{background-image:url(../../../assets/images/coupon/coupon_subtractMoney.png)}  
  .cardTypeDISCOUNT{background-image:url(../../../assets/images/coupon/coupon_discount.png)}  
  .cardTypeCARRIAGE{background-image:url(../../../assets/images/coupon/coupon_conversion.png)}  
  .cardTypeREAPACK{background-image:url(../../../assets/images/coupon/coupon_redPacket.png)}  
  
  .cardTypeCASH{background-image:url(../../../assets/images/coupon/coupon-xianj.png)}
  .cardTypePARK{background-image:url(../../../assets/images/coupon/coupon-tingc.png)}
  .cardTypeFJQ{background-image:url(../../../assets/images/coupon/coupon-fuji.png)}
  .cardTypeCYQ{background-image:url(../../../assets/images/coupon/coupon-changyi.png)}
  .cardTypeEXCHANGE{background-image:url(../../../assets/images/coupon/coupon-duih.png)}
  
  img{width:100%; border-radius:50%;width:48px; height:48px;}
}
.edit-box{
  float:right;
  .edit-icon{display:inline-block; width:20px; height:20px; margin-right:8px; cursor:pointer;background-repeat:no-repeat; background-size:100%;}
}
.coupon-parag{
    display:flex; line-height: 20px;
    span,label{font-size:10px;}
    .num-box{
      display: inline-block;
      max-width: 46px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: middle;
    }
  }
.cardCont{
  color:#9AA8B8; text-align:left;min-height:242px;
  border-radius:4px;
  .carddescbox{max-height: 180px; }
  h3{font-size:16px;
    font-family:PingFangSC-Medium;
    font-weight:700;margin-bottom:12px;
    color:rgba(62,69,82,1)}
  .amout{font-size:24px;
  font-family:SFUIDisplay-Semibold;
  font-weight:600;max-width: 80%;  text-overflow: ellipsis;
  overflow: hidden; white-space: nowrap; display: inline-block;
  color:rgba(62,69,82,1);}
  .time-box{
    font-size:10px;
    font-family:SFUIDisplay-Regular;
    font-weight:400; line-height: 20px;
    color:rgba(103,103,143,1);
  span{font-size:10px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(154,168,184,1);}
  }
  .card-bottom{
    // margin-bottom: -24px;
    width: 100%; line-height: 48px;min-height:48px;
    background: #F7F9FA;
    font-size: 14px; text-align: center;
    font-family: PingFangSC-Regular;
    font-weight: 400; color: #67678f;
    position:absolute; bottom:0;
    span{cursor:pointer; &:hover{color:#2d8cf0}}
  }
  .row-body{margin:16px 16px 0 16px; flex:1;}
}
</style>
<style lang="scss">
  .cardCont .ivu-card-body{padding:0;display: flex;
    flex-direction: column;
    min-height: 260px;}
</style>

<template>
  <Row :gutter="24">
    <i-col  :sm="12" :md="12" :lg="8" :xl="8" :xxl="6" v-for="(item, index) in couponList" :key="index" class="coupon-col-box">
      <Card :class="('cardCont'+(checkedIds.indexOf(item.couponId)>-1&&!noBorder?' checked':''))+ (origin&&item.remainNum<1?' disabled-selected':' ')"  
        @click.native="clickBody(item.couponId,item)">
        <Row class="row-body">
          <!-- 徽章标识 -->
          <slot name="badge" :item="item"></slot>
          <i-col span="4" class="cardtypebox">          
            <i :class="'cardType'+item.couponType" v-if="!item.couponPicUrl"></i>
            <img v-else :src="item.couponPicUrl||$defaultImg" />
          </i-col>
          <i-col span="18" offset="1" class="carddescbox">
            <h3 class="clearfix">
              <span class="header-text" :style="{maxWidth:hasTopText?'150px':'180px'}" :title="item.couponName">{{item.couponName}}</span>
              <!-- 名字后面跟着是否置顶描述 -->
              <slot name="toptext" :item="item"></slot>
              <!-- 自定义右上角操作 -->
              <span class="edit-box"><slot name="editbox" :item="item"></slot></span>
            </h3>
            <p>优惠内容</p>
            <p style="display:flex; align-items:center;">
              <!-- {{item.platformRuleDetail.useThresholdType==1}} -->
              <span>{{showContent(item)}}</span>
              <!-- <span v-if="item.platformRuleDetail.useThresholdType==1">无使用门槛，减{{item.platformRuleDetail.couponAmount}}</span>
              <span v-else>满{{item.platformRuleDetail.useThresholdAmount}}减{{item.platformRuleDetail.couponAmount}}</span> -->
              <!-- <span class="amout" :title="item.couponType=='EXCHANGE'?item['couponContent']:''">
                {{item.couponType=='PARK'?item.amountType==1?'减免':'免停':item.couponType=='EXCHANGE'?(item?item.couponContent:''):''}}
                {{item.couponAmount||item.maxOfferAmount}}
                {{item.couponType=='PARK'?amountTypeObj[item.amountType]:''}}
              </span>
              <label v-if="item.couponType!='PARK'&&item.couponType!='EXCHANGE'">&nbsp;{{amountTypeObj[item.amountType]}}</label> -->
              
            </p>

            <slot name="inforList" :item="item">
              <p class="coupon-parag">
                <span style="flex:1">ID：<label style="color:#67678f">{{item.couponId}}</label></span>
                <!-- <span >来源：<label style="color:#67678f;">{{item.orgName}}</label></span> -->
                <!--||item.couponNum-->
              </p>
              <p class="coupon-parag">
                <span style="flex:1">使用范围：
                  <label style="color:#67678f;margin-right:5px">{{
                    item.applyScopeType?item.applyScopeType==1?'全品类':'部分品类':'-'
                    }}
                  </label>
                </span>                  
                <span >库存：
                  <label style="color:#67678f" class="num-box" v-if="item.couponNumType!==2" :title="(item.remainNum||0)+'/'+(item.couponNum||0)">{{item.remainNum||0}}/{{item.couponNum||0}}</label> 
                  <label style="color:#67678f" v-else> 不限量 </label>
                </span>
              </p>
              <p class="time-box">
                <span>有效日期：</span>
                {{item.useTimeType==4?'不限时间':item.useTimeType==1?
                    item.startTime&&item.endTime?
                      $format(item.startTime*1,'YYYY-MM-DD')+' ~ '+$format(item.endTime*1,'YYYY-MM-DD')
                      :""
                    :item.useTimeType==2?"领取当日起 "+item.useDays+' 天可用'
                    :"领取次日起 "+item.useDays+' 天可用'}}
              </p>
              <p class="time-box" v-if="item.writeoffSecret">
                <span>核销码：</span> {{item.writeoffSecret||'-'}}
              </p>
            </slot>
            
          </i-col>
        </Row>
        <!--state 为5或6代表已过期，不展示-->
        <Row class="card-bottom" v-if="item.couponState!=6&&item.couponState!=5">
          <slot name="editbottom"  :item="item"></slot>
        </Row>
      </Card>
    </i-col>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </Row>
</template>
<script>

import utilsFunc from '@/components/coupon/utils';
export default {
  props:{
    couponList:{type:Array,required:true},
    spinShow:{type:Boolean,required:true},
    origin:{type:String}, //  指代使用源头 定义了该字段可以处理优惠券可选状态
    checkedIds:{type:Array},  // 已选择节点
    noBorder:{type:Boolean},    // 关闭选中蓝色边框
    hasTopText:{type:Boolean},    // 判定是否要显示置顶标识，用以限定优惠券名称长度
  },
  data:function(){
    return {
      amountTypeObj:{1:'元',2:'小时',3:'分钟'}
    }
  },
	methods:{
    showContent(item){
      if(item){
        return utilsFunc.computedPerferentialContent(item.couponType, 
        item.useThresholdType, 
        item.useThresholdAmount, 
        item.couponAmount, 
        item.couponContent)
      }else{
        return '';
      }
    },
		clickBody(id,item){
      if(item.remainNum<1){
        this.$Message.warning('优惠券库存已不足!');
        return false
      }
			if(this.checkedIds.includes(id)){
				this.$emit('modalItemCheck',false,id)
			}else {
				this.$emit('modalItemCheck',true,id)
			}
		}
	}
}
</script>
