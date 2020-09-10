<!--
 * @Description: 选择商城商品，分步
 * @Author: sam.xutao
 * @Date: 2020-03-26 09:50:05
 * @LastEditTime: 2020-04-13 13:31:48
 * @LastEditors: sam.xutao
 -->
<template>
  <div>
    <section v-if="isNext">
      <Row>
        <i-col span="6"> <h3>选择规格</h3></i-col>
        <i-col span="4" offset="10" style="text-align:right;"><a @click="resetGoods">重选商品</a></i-col>
      </Row>
      <PowerTable :propertyList="infor.specs" :skus="infor.skus" :maxHeight="300" @on-selectTable="selectChange" :notSpan="true"
        :titleCols="titleCol" style="margin-top:10px;" :multipleCol="{type:'selection',width:40,align:'center'}" 
        :selected="selectSpecs.map(item=>item.skuId)" />
      <footer style="text-align:right;margin-top:10px">
        <Button @click="cancelGoods" class="mr-10">取消</Button>
        <Button type="primary" :disabled="!selectSpecs.length" @click="confirmGoods">提交</Button>
      </footer>
    </section>
    <section v-else>
      <Row style="margin-bottom:24px;">
        <i-col span="12">
          <Select style="width:140px;" placeholder="请选择商品品牌" class="mr-10" v-model="search.goodsBrandId" @on-change="changeSearch" clearable transfer>
            <Option v-for="item in allBrandList" :key="item.id" :value="item.id">
              {{ item.name }}
            </Option>
          </Select>
          <Cascader :data="goodsTypeList" v-model="search.goodsCategoryId" @on-change="changeSearch" transfer
            style="width:140px;display:inline-block" :load-data="loadTypeData" change-on-select
            placeholder="请选择商品分类" class="mr-10"></Cascader>
        </i-col>
        <i-col span="6" offset="6">
          <Input type="text"  search  placeholder="请输入商品名称 / ID" v-model="search.search" @on-change="changeSearch" />
        </i-col>
      </Row>
      <Table
        highlight-row :loading="loading"
        ref="currentRowTable"
        :columns="cols"
        :data="list"
        @on-row-click="handleSelect"
        no-data-text="暂无数据"
      ></Table>
      <Page
        :total="total"
        :current="search.page"
        :page-size="search.pageSize"
        show-elevator
        show-sizer
        size="small"
        show-total :page-size-opts=[5,10,20,30,40]
        @on-change="onPageChange"
        @on-page-size-change="onPageSize"
        style="margin:10px;text-align:right"
      />
      <footer style="text-align:right;margin-top:24px; border-top:solid 1px #E6EBF0;padding-top:20px;">
        <Button  @click="cancelGoods" class="mr-10">取消</Button>
        <Button type="primary" :disabled="$_.isEmpty(curGoods)" @click="nextStep">下一步</Button>
      </footer>
    </section>
  </div>
</template>
<script>
import TableFlexInfo from '../FlexInfor'
import PowerTable from '@/components/commons/PowerTable/PowerfulTable'    // 维度表格
import {mapActions} from 'vuex'
export default {
  name:"choose-mallgoods",
  components:{PowerTable},
  props:{
    present:Object,
    selectSkus:Array
  },
  data(){
    return {
      cols:[
         {
          title: "状态",
          align: "center", width:'80px',
          render: (h, params) => {
            let curId = this.curGoods?this.curGoods['id']:'';
            let parId = params.row['id'];
            return h(
              "Radio",
              {
                props: {
                  value:curId === parId
                },
              },
              ""
            );
          }
        },
        {title:'商品信息',key:'info',render:(h,params)=>{
          return h(TableFlexInfo,{
            props:{
              name:params.row.name,
              id:params.row.id,
              url:params.row.imgUrl||this.$defaultImg
            }
          })
        }},
        {title:'商品分类',key:'goodsCategoryText'},
        {title:'商品品牌',key:'goodsBrandText'},
        {title:'创建时间',key:"time",render:(h,params)=>{
          return <p>{this.$format(params.row.createTime,"YYYY-MM-DD HH:mm:ss")}</p>
        }},
      ],
      list:[],loading:false,
      titleCol: [
        {key:'skuCode',type:'number',title:'SKU编码'},
        {key:'roughWeight',type:'number',title:'毛重'},
        {key:'purchasePrice',type:'number',title:'采购价'},
      ],
      isNext:false,
      search:{
        page:1,pageSize:5,search:'',
        goodsBrandId:'',goodsCategoryId:[]
      },
      infor:{
        specs:[],skus:[]
      },
      total:0,
      allBrandList:[],goodsTypeList:[],
      curGoods:this.present,
      selectSpecs:this.selectSkus||[],
    }
  },
  mounted(){
    this.loadGoodsList();  // 拉取商品列表
    this.getAllBrands();  // 拉取所有品牌列表
    this.getCategory();
  },
  methods:{
    ...mapActions("commModule", [ "loadAllBrands","loadGoodsTypeList"]),
    resetGoods(){
      this.isNext = false;
    },
    selectChange(selections){
      console.log('selections',selections)
      this.selectSpecs = selections.map(item=>{
        item = {...item,skuId:item.skuId}
        return item;
      });
    },
    nextStep(){
      this.isNext = true;
      this.loadGoodsSpecies();
    },
     //点击礼品取消
    cancelGoods() {
      this.curGoods = null;
      this.$emit("cancelGoods")
    },
    // 确认添加商品
    confirmGoods(){
      if(!this.selectSpecs.length){
        this.$Message.error("请选择要添加的规格!");
        return false;
      }else{
        this.$emit("confirmGoods",this.curGoods,this.selectSpecs)
        this.curGoods = null
      }            
    },
    // 拉取全部商品品牌列表
    async getAllBrands(){
      const {data} = await this.loadAllBrands();
      if(data){
        this.allBrandList = data||[];
      }
    },
    // 根据商品id查询商品规格信息
    async loadGoodsSpecies(){
      const {data} = await this.$ajaxGet('/goods-server/api/goods/getSkuSpecList',{spuId:this.curGoods.id});
      if(data){
        this.infor.specs = data.specs || [];
        this.infor.skus = data.skus || [];
      }
    },
    async loadTypeData(item,cb){
      item.loading = true;
      const {data=[]} = await  this.loadGoodsTypeList({id:item.value})
      // const data = await this.loadGoodsTypeList({orgId:localStorage.orgId,parent:item.value})
      if(data){
        item.children =  data.map(item=>{
          let iObj = {label:item.name,value:item.id};
          if(item.isSub){
            iObj = {...iObj,children:[],loading:false}
          }
          return iObj
        });
        item.loading = false;
        cb();
      }
    },
    // 选择礼品添加项
    handleSelect(currentRow) {
      this.curGoods = currentRow;
    },
    // 拉取父子级商品分类列表
    async getCategory(){
      const {data=[]} =  await this.loadGoodsTypeList()
      if(data){
        this.goodsTypeList = data.map(item=>{
          let iObj = {label:item.name,value:item.id}
          // isSub 判定是否有子级
          if(item.isSub){
            iObj = {...iObj,children:[],loading:false}
          }
          return iObj
        });
      }
    },
    changeSearch(keys,item){
      if(item){
        this.search.goodsCategoryId = keys||[]
      }
      this.search.page = 1; this.search.size = 10;
      this.loadGoodsList();
    },
    // 页数改变重新搜索
    onPageChange(page){
      this.search.page = page;
      this.loadGoodsList();
    },
    // 页码改变重新搜索
    onPageSize(size){
      this.search.pageSize = size;
      this.loadGoodsList();
    },
    // 拉取商品列表
    async loadGoodsList(){
      this.loading = true;
      let iCategory = this.search.goodsCategoryId;
      const {data} = await this.$ajaxGet("/goods-server/api/goods/list",{...this.search,goodsCategoryId:iCategory[iCategory.length-1]});
      this.loading = false;
      if(data){
        this.list = data.list || [];
        this.total = data.count;
      }
    }
  }
}
</script>