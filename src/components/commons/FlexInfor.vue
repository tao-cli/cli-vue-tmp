<!--
 * @Description: 
 * @Author: sam.xutao
 * @Date: 2020-02-24 10:50:27
 * @LastEditTime: 2020-04-27 17:36:36
 * @LastEditors: sam.xutao
 -->
<!------------------------
 *@name flex-infor
 *@desc 通用组件，左右结构，左边图片，右边描述信息，默认有姓名和id
 *
 *@props name   名称信息  必传
 *@props id     编码信息 必传
 *@props imgW     自定义图片宽度  非必传 默认为50
 *@props imgH    自定义图片高度 非必传 默认为50
 *
 *@slot more-info 可以添加更多信息
 *
 *@author Sam
 *@date 2020/02/20
 -->
<style lang="scss" scoped>
  .flexbox-infor{
    display: flex;
    img{margin-right: 8px;}
    >section{
      display: flex; flex-direction: column; justify-content: space-between;
    }
  }
</style>
<template>
  <div class="flexbox-infor">
    <ViewModalPic v-if="isViewPic" :src="url" :width="imgW||40" :height="imgH||40" />
    <img :src="url" :width="imgW||40" :height="imgH||40"  v-else />
    <section>
      <slot name="base-info">
        <p :style="nameStyle">{{name}}</p>
        <p style="color:#9aa8b8">{{nameLabel}}{{noSemi?'':':'}}{{id}}</p>
      </slot>
      <slot name="more-info" ></slot>
    </section>
  </div>
</template>
<script>
import ViewModalPic from '@/components/commons/ViewPicModal'
export default {
  name:'flex-infor',
  components:{ViewModalPic},
  props:{
    url:{type:String},
    name:{type:String},
    id:{type:[String,Number]},
    imgW:{type:Number},
    imgH:{type:Number},
    nameStyle:{type:Object},
    nameLabel:{type:String,default:'id'},   // 货号或id前缀描述
    isViewPic:Boolean,    //是否查看大图
    noSemi:Boolean,    //是否显示冒号
  }
}
</script>