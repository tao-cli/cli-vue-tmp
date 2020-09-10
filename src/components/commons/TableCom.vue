<!------------------------
 *@name Vue.js
 *@author Jo.gel
 *@date 2019/3/19 0019
 *@desc 按钮+table+分页
 *@on-selectVal return {name,val} name：唯一值，string；val：值
 *@on-pageChange return {Object} 返回pageData 的对象，用来改变分页
 *@on-btnAction return {type}，唯一值，外部传入，string，用来执行的动作钩子
 -------------------------->
<template>
		<div class="tableRow">
				<!--查询按钮栏-->
				<div class="query-row">
						<div class="select-inline-group w200" v-for="(items,indexS) in querySelectGroup" :key="indexS">
								<!--Input-->
								<div class="query-row-item" v-if="items.type==='input'">
										<div class="row-item" v-if="items.label">{{items.label}}</div>
										<i-input class="row-com pr-10" :placeholder="items.placeholder"
										         v-model="items.value"
										         @on-change="(val)=>$emit('on-inputVal',{type:items.name,val:items.value})"
										></i-input>
								</div>
								<!--select-->
								<div class="query-row-item" v-if="items.type==='select'" >
										<div class="row-item" v-if="items.label">{{items.label}}</div>
										<Select class="row-com pr-10"  v-model="items.value"
										        :filterable="true"
										        :remote="true"
										        :placeholder="items.placeholder"
										        @on-change="(val)=>$emit('on-selectVal',{type:items.name,val:items.value})"
										>
												<!--ID 或者value-->
												<Option :value="item.code" :test="item.code" v-for="(item,index) in items.data" :key="index">{{item.value}}</Option>
										</Select>
								</div>
								<!--date-->
								<div class="query-row-item"  v-if="items.type==='date'">
										<div class="row-item" v-if="items.label">{{items.label}}</div>
										<DatePicker class="row-com" v-model="items.value" type="daterange" :placeholder="items.placeholder" split-panels
										            style="width: 180px" @on-change="(val)=>$emit('on-changeDate',val)"></DatePicker>
								</div>
						</div>
						
						<!--按钮组-->
						<div class="button-inline-group" v-for="(item,index) in queryBtnGroup" :key="item.key">
								<Button class="mr-10" v-if="item.type==='button'"
								        :type="index===0?'primary':'default'"
								        @click="()=>$emit('on-btnQueryAction',item.key)"
								>{{item.title}}
								</Button>
								<a type="download" target="_blank" rel="noopener noreferrer"
								:href="`/user-server/platform/operateLog/export?operatorName=${queryFieldObj.operatorName||''}&operateModule=${queryFieldObj.operateModule||''}&operateType=${queryFieldObj.operateType||''}&beginTime=${queryFieldObj.beginTime||''}&endTime=${queryFieldObj.endTime||''}&token=${token}`" v-if="item.type==='a'"><Button type="primary">{{item.title}}</Button></a>
						</div>
				</div>
				
				<!--增加/编辑/删除的按钮组-->
				<div class="query-row">
						<div class="button-inline-group">
								<Button class="mr-10" v-for="(item,index) in editBtnGroup"
								        :key="index"
								        :type="index===0?'primary':'default'"
								        @click="()=>$emit('on-btnAction',item.type)"
								>{{item.title}}
								</Button>
						</div>
				</div>
				
				<!--table+page-->
				<div class="tablePage">
						<BaseTable
						:col="tableCol"
						:list="tableList"
						:loading="loading"
						:pageData="pageData"
						:noPage="noPage"
						@on-pageChange="(page)=>$emit('on-pageChange',page)"
						@on-pageSize="(size)=>$emit('on-pageSize',size)"
						@on-selectTable="(selection)=>$emit('on-selectTable',selection)"
						></BaseTable>
				</div>
		</div>
</template>
<script>
	import BaseTable from '../base/BaseTable'

	export default {
		name: 'TableCom',
		components: {
			BaseTable
		},
		props: {
			/*********查询按钮栏*********/
			loading:{type:Boolean},
			// type: select 、date 判断需要渲染哪个类型
			queryFieldObj:{
				type: Object
			},
			// 不需要显示pageData
			noPage:{
				type:Boolean,
				default:false
			},
			// name: 判断是哪个select 发生
			querySelectGroup: {
				type: Array,
				default: () => {
					return [];
				}
			},
			//开启select远程搜索
			filterableSelect:{
				type:Boolean,
				default:()=>{
					return false
				}
			},
			remoteSelect:{
				type:Boolean,
				default:()=>{
					return false
				}
			},
			//select下拉组
			queryBtnGroup: {
				type: Array,
				default: () => {
					return [];
				}
			},
			//btn查询组
			/*********查询添加换行栏*********/
			editBtnGroup:{
				type:Array,
				default:()=>{
					return []
				}
			},
			/*********表格栏目*********/
			tableCol:{
				required:true,
				type:Array,
				default:()=>{
					return []
				}
			},
			tableList:{
				required:true,
				type:Array,
				default:()=>{
					return []
				}
			},
			pageData:{
				required:true,
				type:Object,
				default:()=>{
					return {}
				}
			}
		},
		data() {
			return {
				inputValue:'',
				dateValue:'',
				token:localStorage.getItem('token')
			};
		}
	};
</script>
<style lang="scss" scoped>
		.tableRow{
				background: #fff;
				padding: 24px 20px;
		}
		.query-row {
				display: flex;
				min-width: 1000px;
				text-align: left;
				margin-bottom: 10px;
				
				.query-row-item{
						display: flex;
						.row-item{
								width: 100px;
								line-height: 30px;
						}
						&:after{
								display: block;
								content:'';
								clear: both;
						}
				}
		}
		.select-inline-group, .button-inline-group {
				display: inline-block;
		}
</style>
