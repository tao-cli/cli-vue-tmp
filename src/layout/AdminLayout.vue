<style lang="scss">
		.ivu-layout-header {
				padding: 0;
				background: inherit;
				.ivu-menu-horizontal{height: 72px; line-height: 72px;}
		}
		
		.menuItem-left {
				margin-right: 22px;
				
				> i {
						margin-right: 12px;
				}
		}
		
		.menu-icon {
				float: left;
				position: relative;
				z-index: 999;
				font-size: 20px;
				line-height: 72px;
				cursor: pointer;
		}
		
		.rotate-icon {
				&::before {
						transform: rotate(-180deg);
				}
		}
		
		.menu-item {
				overflow-y: auto;
		}
		
		.menu-item span {
				display: inline-block;
				overflow: hidden;
				width: 69px;
				text-overflow: ellipsis;
				white-space: nowrap;
				vertical-align: bottom;
				transition: width 0.2s ease 0.2s;
		}
		
		.menu-item i {
				transform: translateX(0px);
				transition: font-size 0.2s ease, transform 0.2s ease;
				vertical-align: middle;
				font-size: 20px;
		}
		
		.collapsed-menu span {
				width: 0px;
				transition: width 0.2s ease;
		}
		
		.collapsed-menu i {
				transform: translateX(5px);
				transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
				vertical-align: middle;
				font-size: 22px;
		}
		
		.avatar {
				height: 24px;
				width: 24px;
				display: inline-block;
				background: url(../assets/images/avatar.png) no-repeat center;
				background-size: contain;
				vertical-align: middle;
		}
		
		.username {
				font-size: 14px;
				font-family: PingFangSC-Regular;
				font-weight: 400;
				margin: 0 8px;
				color: rgba(103, 103, 143, 1);
		}
		
		.layout {
				border: 1px solid #d7dde4;
				background: #f5f7f9;
				position: relative;
				border-radius: 4px;
				overflow: hidden;
		}
		
		.layout-logo {
				height: 60px;
				width: 208px;
				margin: 0 auto;
				line-height: 60px;
				border-radius: 3px;
				text-align: left;
				color: #fff;
				position: relative;
				font-size: 30px;
				
				&:after {
						content: "";
						background: #e6ebf0;
						position: absolute;
						width: 100%;
						height: 1px;
						display: inline-block;
						bottom: 0;
						left: 0;
				}
		}
		
		.layout-nav {
				// width: 420px;
				margin: 0 20px 0 auto;
				text-align: right;
				
				li {
						text-align: center;
						height: 40px;
						
						a {
								color: #000;
								
								&:hover {
										color: lightskyblue;
								}
						}
				}
				
				.ivu-icon-ios-arrow-forward {
						&::before {
								content: "";
								background: url(../assets/images/down.png) no-repeat center;
								width: 8px;
								height: 8px;
								display: inline-block;
						}
				}
		}
		
		.orgBox {
				float: left;text-indent: 1em;
				position: relative;
				z-index: 990;
				line-height: 72px;
				font-size: 14px;
				font-family: PingFangSC-Regular;
				font-weight: 400;
				color: rgba(103, 103, 143, 1);
		}
		
		.company-select {
				position: relative;
				z-index: 8;
				margin-top: 8px;
				
				li {
						padding: 7px 16px;
						
						&:hover {
								cursor: pointer;
								background: #f3f3f3;
						}
				}
		}
		
		.ul-small {
				position: relative;
				margin-top: 0;
				text-align: center;
				
				&:before {
						position: absolute;
						display: block;
						content: '';
						width: 100%;
						height: 1px;
						background: #e6ebf0;
						left: 0;
						top: 59px;
				}
				
				.small-logo {
						position: relative;
						height: 40px;
						width: 36px;
						margin: 20px 0 10px;
						padding-bottom: 10px;
				}
				
				i {
						color: #67678f;
						font-size: 20px;
				}
				
				.li-small {
						line-height: 48px;
				}
		}
		
		.menu-list {
				display: flex;
				height: 68px;
				width: 264px;
				
				h3 {
						width: 96px;
						line-height: 52px;
						text-align: center;
						background: rgba(68, 68, 79, 1);
						font-size: 14px;
						height: 68px;
						display: flex;
						align-items: center;
						justify-content: center;
						font-family: SFUIDisplay-Light, SFUIDisplay;
						color: rgba(181, 181, 190, 1);
						overflow: hidden;
						white-space: nowrap;
						
						&:hover {
								color: #fff;
								cursor: pointer;
								
								span {
										display: inline-block;
										width: 90%;
										height: 38px;
										line-height: 38px;
										border-top-left-radius: 25px;
										border-bottom-left-radius: 25px;
										margin-left: 6px;
										text-align: left;
										padding-left: 10px;
										background: rgba(105, 105, 116, 1)
								}
						}
						
						span i {
							float: left;font-weight: normal;margin-right: 5px;
						}
						
						letter-spacing: 1px;
				}
				
				h3.isActive {
						color: rgba(255, 141, 10, 1);
						position: relative;
						
						label {
								position: absolute;
								display: inline-block;
								width: 20px;
								height: 20px;
								background: #fff;
								overflow: hidden;
								right: 0;
								
								i {
										display: inline-block;
										width: 30px;
										height: 25px;
										position: absolute;
										border-radius: 40%;
										background: #44444f;
								}
						}
						
						.top-icon {
								top: 0;
								i {
										left: -50%;
										top: -50%;
								}
						}
						
						.bottom-icon {
								bottom: 0;
								
								i {
										left: -50%;
										bottom: -50%;
								}
						}
						
						span {
								display: inline-block;
								width: 91%;
								background: #fff;
								height: 38px;
								line-height: 38px;
								border-top-left-radius: 25px;
								border-bottom-left-radius: 25px;
								margin-left: 8px;
								text-align: left;
								padding-left: 10px;
						}
				}
		}
		
		.menu-sider {
				overflow: hidden;
				overflow-y: auto;
				position: relative;
		}
		
		.menu-title {
				display: flex;
				position: fixed;
				background: #fff;
				width: 256px;
				z-index: 99;
				
				section {
						width: 96px;
						height: 72px;
						text-align: center;
						background: rgba(68, 68, 79, 1);
						padding-top: 16px;
						border-bottom: solid 1px rgba(105, 105, 116, 1);
				}
		}
		
		.aisde-submenu {
				position: fixed;
				left: 104px;
				top: 72px;
				width: 154px;
				background: #fff;
				z-index: 100;
				header {
						font-size: 16px;
						padding-left: 20px;
						margin-top: 20px;
						font-family: SFUIDisplay-Medium, SFUIDisplay;
						font-weight: 600;
						color: rgba(23, 23, 37, 1);
				}
		}
		
		.menu-title, .aisde-submenu {
				h2 {
						margin-left: 20px;
						height: 72px;
						line-height: 72px;
						width: 128px;
						border-bottom: solid 1px rgba(226, 226, 234, 1);
						font-size: 16px;
				}
		}
		
		.aside-bar {
				position: absolute;
				left: 0;
				top: 0;
				height: calc(100vh - 72px);
				width: 96px;
				background: #44444f;
		}
		.rigo-and-qq-browser{
				position: static !important;
		}
</style>

<template>
		<Layout>
				<Sider ref="sideMenu"
				       hide-trigger
				       collapsible class="menu-sider"
				       :collapsed-width="78"
				       :style="isCollapsed?{background: '#fff',width:'96px',minWidth:'96px',position:'relative'}:
							 		{background: '#fff',width:'264px',minWidth:'264px',boxShadow:'0px 2px 12px 0px rgba(0,0,0,0.04)'}"
				       v-model="isCollapsed">
						<header class="menu-title" :style="{width:isCollapsed?'96px':'256px'}">
								<section>
									<router-link to="/welcome">
										<img v-if="$store.state.storeLogo" style="width: 36px;height: 36px;border-radius:50%;"
										     :src="$store.state.storeLogo" alt="">
										<img v-else src="../assets/images/logo.png" style="width: 36px;height: 36px;border-radius:50%;"/>
									</router-link>
								</section>
								<h2 v-if="!isCollapsed">{{curFullTitle}}</h2>
						</header>
						<div style="margin-top:72px;position:relative" v-show="curMenu.length">
								<aside class="aside-bar"></aside>
								<div v-if="!isCollapsed" style="position:relative">
										<div v-for="(items,indexS) in curMenu" :key="indexS" class="menu-list clearfix">
												<h3 :class=[{isActive:items.actived}] @click="toggleMenu(indexS)">
														<span><i :class="'icon iconfont '+items.icon||''" v-if="items.icon"></i>{{items.meta?items.meta.title:''}}</span>
														<label class="top-icon"><i></i></label>
														<label class="bottom-icon"><i></i></label>
												</h3>
												<div v-if="items.children&&items.children.length&&items.actived" class="aisde-submenu">
														<SelfSubMenu :menuItem="items" @routeMenu="handleSelect" :current="curSelectMenu"
														             v-show="items.meta&&!items.meta.hidden"/>
												</div>
										</div>
								</div>
								<Dropdown placement="right-start" v-for="(items,indexS) in curMenu" :key="items.name"
								          transfer-class-name="rigo-and-qq-browser"
								          class="menu-list clearfix" v-else transfer>
										
										<h3 :class=[{isActive:items.actived}] @click="toggleMenu(indexS)">
												<span><i :class="'icon iconfont '+items.icon||''" v-if="items.icon"></i>{{items.meta?items.meta.title:''}}</span>
												<label class="top-icon"><i></i></label>
												<label class="bottom-icon"><i></i></label>
										</h3>
										<DropdownMenu slot="list" v-if="items.children&&items.children.length">
												<div class="aisde-submenu "
												     style="height:100vh; top:0;box-shadow:rgba(0, 0, 0, 0.04) 0px 2px 12px 0px;left:96px;">
														<h2>{{items.meta['fullTitle']}}</h2>
														<SelfSubMenu :menuItem="items" @routeMenu="handleSelect" :current="curSelectMenu"
														             v-show="items.meta&&!items.meta.hidden"/>
												</div>
										</DropdownMenu>
								</Dropdown>
						</div>
				
				</Sider>
				<Layout>
						<Header>
								<i @click="collapsedSider" :class="rotateIcon" v-if="curSelectMenu!='welcome'"
								   :style="{width:'72px',borderRight:'solid 1px #E6EBF0',borderLeft:'solid 1px #E6EBF0',textAlign:'center'}" size="24"></i>
								<!--切换身份-->
								<Poptip placement="bottom-start" width="280" style="float: left">
										<span class="orgBox span-a"><i class="icon iconfont iconCompany"></i>{{orgName}}</span>
										
										<div class="clear" slot="content">
												
												<i-input v-model="orgNameSearch"
												         @on-click="onSearchOrg"
												         @on-enter="onSearchOrg"
												         placeholder="组织名称检索" search clearable></i-input>
												
												<ul class="company-select">
														<li v-for="item in searchCompanyList"
														    :key="item.value"
														    :value="item.value"
														    @click="onChangeOrg(item)"
														>{{item.label}}
														</li>
												</ul>
										</div>
								</Poptip>
								
								
								<Menu mode="horizontal" theme="light" active-name="1">
										<div class="layout-nav">
												<Dropdown trigger="click" style="margin-left: 20px" @on-click="dropdownClick" transfer>
												 <span>
														
													 <i class="avatar"
													    :style="`background:url(${$store.state.headImg||defaultAvatar})no-repeat center;background-size: cover;`"></i>
													 <a href="javascript:void(0)">
														{{$store.state.username}}
													<Icon type="ios-arrow-down"></Icon>
													</a>
												 </span>
														<DropdownMenu slot="list">
																<DropdownItem name="account">
																		<i class="icon iconfont iconAccount"></i>
																		账号管理
																</DropdownItem>
																<DropdownItem name="switch">
																		<i class="icon iconfont iconChange"></i>
																		切换商户
																</DropdownItem>
																<DropdownItem name="logout">
																		<i class="icon iconfont iconExit"></i>
																		退出登录
																</DropdownItem>
														</DropdownMenu>
												</Dropdown>
										</div>
								</Menu>
						</Header>
						<Content :style="{padding: $route.name!=='dashboard'?'0 24px 24px':'0 0 24px',background:'#F0F4FA'}">
								<Breadcrumb
										:style="'margin: 24px 0 10px;text-align:left;'+($route.name==='dashboard'?'background:#fff;margin:0;padding:24px':'')">
										<BreadcrumbItem
														v-for="(item, index) in matchBreadcrumb"
														:key="Math.random()+index"
														:to="!index?'':item.path">{{item.meta&&item.meta.title}}
										</BreadcrumbItem>
								</Breadcrumb>
								<Content
												:style="{padding: '0', minHeight: '280px', background: '#F0F4FA',width:'100%',height:$route.name.includes('report')?'100%':'auto'}"
												class="content-body admin-layout">
										<h2 class="h2" v-show="$route.name!=='people-detail'&&!$route.meta.h2">
												{{$route.meta&&$route.meta.title}}</h2>
										<router-view></router-view>
										<!--版权信息-->
										<Copyright color="#2e79a9"></Copyright>
								</Content>
						</Content>
				</Layout>
				<Modal
								v-model="isLogout"
								title="退出登录"
								@on-ok="logout"
								:mask-closable="false">
						<p>确定退出登录？</p>
				</Modal>
		</Layout>
</template>
<script>
	import {mapActions, mapGetters, mapState} from "vuex";
	import SelfSubMenu from './SubMenu';
	import Copyright from './Copyright';
	import defaultAvatar from '../assets/images/default-avatar.png'
	export default {
		name: "AdminLayout",
		components: {
			Copyright, SelfSubMenu
		},
		data() {
			return {
				defaultAvatar,
				updatePasswordStatus: false,
				isCollapsed: false,
				isLogout: false,
				orgName: localStorage.orgName || "",
				orgNameSearch: "",
				orgId: localStorage.orgId || "",
				matchBreadcrumb: [],
				curMenu: [],
				searchCompanyList: [],
				curSelectMenu: localStorage.curMenu
			};
		},
		computed: {
			...mapState({
				moduleObj: state => state.menu.moduleObj,
				companyList: state => state.companyList || []
			}),
			...mapGetters(["menuList"]),
			menuList() {
				const list = this.$store.getters.menuList.length && this.$store.getters.menuList[0].children ? this.$store.getters.menuList[0].children : [];
				return list;
			},
			rotateIcon() {
				return [
					"menu-icon",
					this.isCollapsed ? "icon iconfont iconUnfold" : "icon iconfont iconFold"
				];
			},
			menuitemClasses() {
				return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
			},
			//异步数据无法触发改变化
			openNames() {
				const name = this.$route.name;
				if (name === "admin") {
					return ["platform"];
				}
				return [name.replace(/-.*$/g, "")] || ["platform"];
			},
			activeName() {
				if (this.$route.name === "admin") {
					return "platform-department";
				}
				return this.$route.name || "platform-department";
			},
			// 获取档期一级菜单名称全称
			curFullTitle() {
				let iMenu = this.curMenu.filter(item => item.actived);
				return iMenu.length ? iMenu[0].meta['fullTitle'] : '';
			},
		},
		watch: {
			$route(to,from) {
				// 如果是从欢迎页进入到其他业务页，展开菜单栏
				let toName = to.name,fromName = from.name;
				// 如果目标路由为 welcome 页，且当前 collapse 是展开的，则进行操作
				if(toName=='welcome'){
					!this.$refs.sideMenu.value&&this.$refs.sideMenu.toggleCollapse();
					// 清除选中菜单
					this.curSelectMenu = toName;
					this.toggleMenu(-1);	
				}
				if(fromName=='welcome'&&toName){
					this.$refs.sideMenu.toggleCollapse();
				}
				this.matchBreadcrumb = this.$route.matched;
				this.$nextTick(() => {
					if (this.$refs["menu"]) {
						this.$refs["menu"].updateOpened();
					}
					localStorage.setItem('pageId', to.meta.id || '');
				});
			},
			companyList(val) {
				this.searchCompanyList = val;
			}
		},
		created() {
			this.getCompanyList();
			this.getRoleTree();
			this.matchBreadcrumb = this.$route.matched;
		},
		mounted() {
			this.$store.dispatch("initRole");
			this.$store.dispatch("setAvatar");
			this.$store.dispatch("setStoreLogo");
			this.curSelectMenu = this.$route.name;
			localStorage.setItem('curMenu', this.$route.name);
			if(this.$route.name === 'welcome'){
				this.isCollapsed = true;
			}
			this.initCurMenu();  // 根据角色构建当前菜单
		},
		methods: {
			...mapActions(['getCompanyList']),
			// 初建 菜单信息
			initCurMenu() {
				let list = this.$store.getters.menuList.length && this.$store.getters.menuList[0].children ? this.$store.getters.menuList[0].children : [];
				list = list.map((item, index) => {
					item.actived = this.curSelectMenu ? this.curSelectMenu.split('-')[0].includes(item.name) : !index;
					return item;
				});
				this.curMenu = list;
			},
			// 点击一级菜单按钮切换
			toggleMenu(index) {
				let iList = this.curMenu.slice();
				iList = iList.map((mitem, mindex) => {
					mitem.actived = index === mindex;
					return mitem;
				});
				this.curMenu = iList;
			},
			dropdownClick(name) {
				switch (name) {
					case 'account':
						this.$router.push('/hall/account');
						break;
					case 'switch':
						this.$router.push('/tenant/list');
						break;
					case 'logout':
						this.isLogout = !this.isLogout;
						break;
				}
			},
			onSearchOrg(event) {
				const {value} = event.target;
				this.searchCompanyList = this.companyList.filter(item => {
					return item.label.includes(value);
				});
			},
			//切换身份
			onChangeOrg(ob) {
				this.orgName = ob.label;
				this.$nextTick(() => {
					this.fakeLogin(ob); // fakerLogin
				});
			},
			fakeLogin(item) {
				this.$ajaxGet("/user-server/auth/switchOrg", {
					orgId: item.value || this.orgId
				})
					.then(res => {
						if (res && res.code === 10000) {
							this.$Message.success("已切换到：" + res.data.userInfo.orgName);
							localStorage.setItem("token", res.data.token);
							localStorage.setItem("level", res.data.level);// 通过level=2 判断是否是小中台的用户
							localStorage.setItem('originOrgId', res.data.originOrgId || '');
							localStorage.setItem("userId", res.data.userInfo.id);
							localStorage.setItem("name", res.data.userInfo.name || "");
							localStorage.setItem("roleId", res.data.userInfo.roleId || "");
							localStorage.setItem("orgId", res.data.userInfo.orgId || "");
							localStorage.setItem("orgName", res.data.userInfo.orgName || "");
							localStorage.setItem("roleName", res.data.userInfo.roleName || "");
							localStorage.setItem("departmentId", res.data.userInfo.departmentId || "");
							localStorage.setItem("departmentName", res.data.userInfo.departmentName || "");
							localStorage.setItem('isSubStore',res.data.isSubStore||false); // 是否为门店
							localStorage.setItem('isChain',res.data.isChain||false);				// 是否为连锁店
							localStorage.setItem('isPersonal',res.data.isPersonal||false);				// 是否为个体
							return res.data.userInfo || {};
						}
					})
					.then(async data => {
						this.$store.dispatch('setUsername');
						if (data && JSON.stringify(data) !== "{}") {
							this.getCompanyList();
							location.href = '/welcome';
						}
					});
			},
			collapsedSider() {
				this.$refs.sideMenu.toggleCollapse();
			},
			...mapActions(["getRoleTree"]),
			handleReset(name) {
				this.$refs[name].resetFields();
				this.updatePasswordStatus = !this.updatePasswordStatus;
			},
			logout() {
				const token = localStorage.getItem("token");
				this.$ajaxGet("/user-server/auth/logout", {token})
					.then(res => {
						if (res && res.code === 10000) {
							this.$Notice.success({
								title: "退出成功！"
							});
							localStorage.clear();
							sessionStorage.clear();
							location.href = "/login.html";
						}
					})
					.catch(err => {
						console.info(err);
					});
			},
			handleSelect(name) {
				localStorage.setItem('menuId', this.moduleObj[name] || '');
				// 点击叶子节点更新最新选中菜单
				this.curSelectMenu = name;
				let parentMenu = name&&name.split('-').length?name.split("-")[0]:'';
				let iList = this.curMenu.slice();
				iList = iList.map(mitem => {
					
					mitem.actived = mitem.name === parentMenu;
					return mitem;
				});
				this.curMenu = iList;
				this.$nextTick(() => {
					this.$router.push({name});
				});
			},
			//小菜单drop
			smallDropdown(name) {
				localStorage.setItem('menuId', this.moduleObj[name] || '');
				this.$nextTick(() => {
					this.$router.push({name});
				});
			}
		}
	};
</script>

