<!--
 * @Description: 多层级菜单渲染
 * @Author: sam.xutao
 * @Date: 2020-03-04 19:07:38
 * @LastEditTime: 2020-04-09 17:35:05
 * @LastEditors: sam.xutao
 * @params menuItem Object 传入的菜单项，可能包含子级菜单
 * @params current String 当前选中菜单 name 名，用于匹配选中叶子项
 * @Function routeMenu function  点击叶子项触发的方法，回带选中的叶子菜单 name
 -->
<template>
  <div>
    <section v-if="hasChild" class="self-submenu">
      <ul v-for="(item,index) in curItems.children" :key="index" v-show="item.meta&&!item.meta.hidden">
        <!-- 根据是否有子级节点判定是否为叶子节点，叶子节点才能点击操作 -->
        <li :leaf="!item.children" :class="[{isSelected:current==item.name}]">
          <h4 @click="item.children?toggleParent(item):clickMenu(item)" :title="item.meta['title']">
            {{item.meta['title']}}
            <i :class="['iconfont' ,{'iconUp':item.meta.toggle},{'iconDown':!item.meta.toggle}]" v-if="item.children"></i>
          </h4>
          <!-- 选中的菜单浮标 -->
          <i class="iconfont iconMos" v-if="!item.children"></i>
          <!-- <img src="../../assets/images/menu-icon.png" alt="图标" width="24" height="24" v-if="!item.children"> -->
        </li>
        <!-- 如果有子级元素，则递归渲染组件 -->
        <transition name="slide-fade" >
          <self-menu :menuItem="item" v-if="item.children&&item.meta.toggle"
            @routeMenu="clickMenu" :current="current" :class="[{'isHide':!item.meta.toggle}]" ></self-menu>
        </transition>
      </ul>
    </section>
  </div>
</template>
<script>
export default {
  name:"selfMenu",
  props:['menuItem','current'],
  computed:{
    hasChild(){
      return this.menuItem.children && this.menuItem.children.length;
    },
  },
  data(){
    return {
      curItems:[]
    }
  },
  mounted(){
    this.curItems = this.menuItem;
  },
  methods:{
    clickMenu(menu){
      this.$emit('routeMenu',menu.name||menu)
    },
    toggleParent(item){
      let iChilds = this.curItems.children.slice();
      iChilds = iChilds.map(citem=>{
        if(item.name===citem.name){
          citem.meta['toggle'] = !citem.meta['toggle']
        }
        return citem;
      })
      this.curItems.children = iChilds;
    }
  }
}
</script>
<style lang="scss">
  .slide-fade-enter-active {
    transition: all .3s linear;
  }
  .slide-fade-leave-active {
    transition: all .3s linear; //cubic-bezier(1.0, 0.5, 0.8, 1.0)
  }
  .slide-fade-enter, .slide-fade-leave-to{
    transform: translateY(10px);
    opacity: 0;
  }
  .aisde-submenu>div>section>ul{
    border-bottom: solid 1px #E2E2EA;
  }
  .self-submenu{
    margin:5px 12px; 
    max-height: 86vh;overflow: hidden; overflow-y: auto;
    &::-webkit-scrollbar{width:2px;}
    >ul{
      // border-bottom:1px solid rgba(226, 226, 234, 1);
      transition: all 2s;
      // border-image:url('../assets/images/thin-border.png') 30 30 repeat;
    }
    ul>li h4{
      font-size:14px; font-weight: normal;
      font-family:SFUIDisplay-Light,SFUIDisplay;
      color:rgba(68, 68, 79, 1);float: left;
      width: 85%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      >i{
        float: right;
      }
    }
    ul li{
      padding-left:8px;
      margin:4px 0;
      height: 48px; line-height: 48px; max-width: 100%; overflow: hidden;cursor: pointer;
    }
    ul li.isSelected{
      background:rgba(255,246,236,1);
      border-radius:8px;position: relative;
      i{ position: absolute; right:8px;top:0;color:#FF8C08;}
      h4{
        font-size:14px;
        font-family:SFUIDisplay-Light,SFUIDisplay;
        color:rgba(255,140,8,1);
      }
    }
    li[leaf=true]:not(.isSelected){
      &:hover{background:rgba(250, 250, 251, 1); border-radius: 8px;}
    }
  }
</style>
