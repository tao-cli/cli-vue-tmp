<!--
@desc 大厅路由
-->
<style>
		@import "../assets/font/iconfont.css";
</style>
<style lang="scss" scoped>
		html,
		body,
		* {
				font-size: 14px;
		}

		html,
		body {
				width: 100%;
				height: 100%;
				overflow: hidden;
				scroll-behavior: smooth;
		}


		ul li {
				margin: 0;
				list-style-type: none;
		}

		#hall {
				height: 100%;
		}

		.hall-layout .ivu-layout-header {
				padding: 0;
				background: #fff;
				border-bottom: 1px solid #e6ebf0;
		}

		.hall-layout {
				height: 100%;
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
				line-height: 60px;
				cursor: pointer;
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
				width: 0;
				transition: width 0.2s ease;
		}

		.collapsed-menu i {
				transform: translateX(5px);
				transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
				vertical-align: middle;
				font-size: 22px;
		}

		.avatar-hall {
				height: 24px;
				width: 24px;
				display: inline-block;
				vertical-align: middle;
		}

		.avatar-bg {
				background: url(../assets/images/default-avatar.png) no-repeat center;
				background-size: contain;
		}

		.username {
				font-size: 14px;
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
				height: 64px;
				margin: 0 auto;
				line-height: 64px;
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
								background: url('../assets/images/down.png') no-repeat center;
								width: 8px;
								height: 8px;
								display: inline-block;
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

		/*remove border*/
		.is-businesses:after {
				display: none !important;
		}

		.businesses-body {
				padding-right: 258px !important;
		}


		/*button radio*/
		.tenant-body button {
				border-radius: 24px;
		}

</style>
<template>
		<div id="hall">
				<Layout class="hall-layout">
						<Sider
										v-show="!isBusinesses"
										ref="sideMenu"
										hide-trigger
										collapsible
										:collapsed-width="78"
										:style="isCollapsed?{background: '#fff'}:{background: '#fff',width:'258px',flex:'0 0 258px',maxWidth:'258px'}"
										v-model="isCollapsed">
								<Menu v-if="!isCollapsed" theme="light" ref="menu" width="256" style="height:100%;"
								      :active-name="activeName" :open-names="openNames" accordion @on-select="handleSelect"
								      :class="menuitemClasses">
										<div class="layout-logo" :style="isCollapsed?{width:'auto','text-align':'center'}:{}">
												<img src="../assets/images/logo-client.png" alt="logo" width="208" height="58">
										</div>
										<div v-show="hallMenuList.length" class="menu-list"
										     v-for="(items,indexS) in hallMenuList"
										     :key="indexS">
												<!--一级菜单，有child-->
												<Submenu :name="items.name" v-if="items.children&&items.children.length" style="width: 100%;">
														<template slot="title">
																<Icon :type="items.icon||'ios-navigate'"></Icon>
																{{!isCollapsed?items.meta&&items.meta.title:''}}
														</template>
														<!-- 可设置hidden隐藏菜单-->
														<MenuItem
																		:name="item.name"
																		v-for="(item,index) in items.children"
																		:key="index"
																		v-show="item.meta&&!item.meta.hidden">
																{{item.meta&&item.meta.title}}
														</MenuItem>
												</Submenu>

												<!--一级菜单，无child-->
												<MenuItem v-else :name="items.name" class="menuItem-left">
														<i :class="'icon iconfont '+items.icon||''" v-if="items.icon"></i>
														<Icon type="ios-navigate" v-else></Icon>
														{{!isCollapsed?items.meta&&items.meta.title:''}}
												</MenuItem>
										</div>
										<div>
										</div>
								</Menu>
						</Sider>
						<Layout>
								<Header>
										<Menu mode="horizontal" theme="light" active-name="1">
												<div class="layout-nav">

														<!--选择商户-->
														<router-link v-show="$route.name!=='tenant-list'" to="/tenant/list">选择商户</router-link>
														<div v-if="isBusinesses" class="layout-logo" style="float: left">
																<img src="../assets/images/logo-client.png" alt="logo" width="208" height="58">
														</div>

														<Dropdown trigger="click" style="margin-left: 20px" @on-click="dropdownClick" transfer>
														 <span>
																 <img v-if="headImg" class="avatar-hall" :src="headImg" alt="">
																 <i v-else class="avatar-hall avatar-bg"></i>
															 <a href="javascript:void(0)">
																{{$store.state.username||$store.state.phone}}
																	<Icon type="ios-arrow-down"></Icon>
															 </a>
														 </span>

																<DropdownMenu slot="list">
																		<DropdownItem name="changePassword">
																				<i class="mr-5 icon iconfont iconAccount"></i>账号管理
																		</DropdownItem>
																		<DropdownItem name="logout">
																				<i class="mr-5 icon iconfont iconExit"></i>退出登录
																		</DropdownItem>
																</DropdownMenu>
														</Dropdown>
												</div>
										</Menu>
								</Header>
								<Content
												style="padding: 24px; background: #fff;width:100%;"
												:class="'content-body '+isBusinesses?'tenant-body':''">
										<router-view></router-view>
										<!--版权信息-->
										<Copyright color="#2e79a9"></Copyright>

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
		</div>


</template>
<script>
	import {mapGetters,mapState } from "vuex";
	import Copyright from './Copyright';

	export default {
		name: "HallLayout",
		components: {
			Copyright
		},
		data() {
			return {
				updatePasswordStatus: false,
				isCollapsed: false,
				isLogout: false,
			};
		},
		computed: {
			...mapState(["headImg"]),
			...mapGetters(["hallMenuList"]),
			isBusinesses() {
				return this.$route.name.includes('tenant');
			},
			hallMenuList() {
				const list = this.$store.getters.hallMenuList.length && this.$store.getters.hallMenuList ? this.$store.getters.hallMenuList : [];
				return list;
			},
			rotateIcon() {
				return [
					"menu-icon",
					this.isCollapsed ? "icon iconfont iconFold" : "icon iconfont iconUnfold"
				];
			},
			menuitemClasses() {
				return ["menu-item", this.isCollapsed ? "collapsed-menu" : (this.isBusinesses ? 'is-tenant' : '')];
			},
			//异步数据无法触发改变化
			openNames() {
				const name = this.$route.name;
				if (name === "hall") {
					return ["account"];
				}
				return [(name || '').replace(/-.*$/g, "")] || ["platform"];
			},
			activeName() {
				if (this.$route.name === "hall") {
					return "hall-account";
				}
				return this.$route.name || "hall-account";
			}
		},
		watch: {
			$route() {
				this.$nextTick(() => {
					if (this.$refs["menu"]) {
						this.$refs["menu"].updateOpened();
					}
				});
			}
		},
		created() {

		},
		mounted() {
		},
		methods: {
			dropdownClick(name) {
				switch (name) {
					case 'changePassword':
						this.$router.push('/hall/account?type=profile');
						break;
					case 'logout':
						this.isLogout = !this.isLogout;
						break;
				}
			},
			collapsedSider() {
				this.$refs.sideMenu.toggleCollapse();
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
				this.$nextTick(() => {
					this.$router.push({name});
				});
			},
			//小菜单drop
			smallDropdown(name) {
				this.$nextTick(() => {
					this.$router.push({name});
				});
			}
		}
	};
</script>
<style lang="scss">
		@import "src/assets/scss/loginHall";

		.h2 {
				margin-bottom: 28px;
				font-weight: 600;
				text-align: left;
				color: rgba(62, 69, 82, 1);
				font-size: 24px;
		}

		.tenant-body {
				background: #FCF9FC !important;
		}
</style>
