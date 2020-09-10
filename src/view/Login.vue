<!--
@desc 登录 / 注册 / 忘记密码
-->
<template>
		<div class="login">
				<Timeout v-if="isTimeout"></Timeout>
				<div v-else class="login-wrap">
						<div class="login-header">
								<img style="width: 106px;height: 24px;" src="../assets/images/login/login-header.png" alt="">
						</div>
						<div class="login-body clear">
								<div class="left-banner">
										<div class="login-banner"></div>
								</div>
								
								<div class="right-form">
										<h2>{{actionsHeaderMap[actionsType]}}</h2>
										<div class="login-type" v-if="actionsType==='login'">
												<span :class="!loginType?'is-active':'is-normal'">密码登录</span>
												<i-switch v-model="loginType" @on-change="switchLoginType"
												          true-color="#FFF7EA"
												          style="border: 1px solid #FFDDB5"
												          false-color="#FFF7EA">
												
												</i-switch>
												<span :class="loginType?'is-active':'is-normal'">验证码登录</span>
										</div>
										
										<Form class="form-body" ref="loginForm" :model="userData" :rules="loginRule">
												<!--手机账号-->
												<FormItem prop="phone" style="margin-top: 38px;">
														<div class="left-phoneArea phone-icon">
																
																<Dropdown @on-click="onClickArea">
																		
																		<span class="phone-prefix">
																				{{userData.areaCode}}
																		</span>
																		<Icon type="ios-arrow-down"></Icon>
																		<DropdownMenu slot="list">
																				<DropdownItem v-for="item in countryAreaList" :key="item.prefix"
																				              :name="item.prefix">{{item.name+' '+item.prefix}}
																				</DropdownItem>
																		</DropdownMenu>
																</Dropdown>
														
														</div>
														<i-input @keyup.enter.native="login" type="text" :maxlength="11"
														         class="phone-input"
														         v-model="userData.phone" placeholder="注册时填写的手机号">
														</i-input>
												</FormItem>
												
												<!--验证码-->
												<FormItem v-if="actionsType!=='login'||loginType"
												          style="margin-bottom: 10px;margin-top: 38px;"
												          prop="messageCode">
														<div class="valid-input">
																<i-input @keyup.enter.native="login"
																         class=""
																         type="text" :maxlength="6" v-model="userData.messageCode"
																         placeholder="填写短信验证码">
																</i-input>
																<span class="send-valid is-active"
																      :disabled="isSending"
																      @click="onSendValid">{{countDownSecond===60?'发送验证码':(countDownSecond+'s')}}</span>
														</div>
												</FormItem>
												
												<!--密码-->
												<FormItem v-if="!loginType||actionsType==='forget'||actionsType==='register'"
												          style="margin-bottom: 10px; margin-top: 38px;"
												          prop="password">
														<div class="password-input">
																<i-input v-if="!isShowPassword['1']" @keyup.enter.native="login"
																         type="password" :maxlength="16"
																         v-model="userData.password"
																         :placeholder="actionsType==='login'?'请输入密码':'设置密码，8-16位字符，包含字母和数字'">
																</i-input>
																<i-input v-else @keyup.enter.native="login"
																         :maxlength="16"
																         v-model="userData.password"
																         :placeholder="actionsType==='login'?'请输入密码':'设置密码，8-16位字符，包含字母和数字'">
																</i-input>
																<span v-if="!isShowPassword['1']" class="show-password" @click="showPassword(1)"></span>
																<span v-else class="close-password" @click="showPassword(1)"></span>
														</div>
												
												</FormItem>
												
												<!--确认密码--->
												<FormItem v-if="actionsType!=='login'" style="margin-bottom: 10px;margin-top: 38px;"
												          prop="confirmPassword">
														<div class="password-input">
																<i-input v-if="!isShowPassword['2']" @keyup.enter.native="login"
																         type="password" :maxlength="16"
																         v-model="userData.confirmPassword"
																         placeholder="请再次输入新密码">
																</i-input>
																<i-input v-else @keyup.enter.native="login"
																         :maxlength="16"
																         v-model="userData.confirmPassword"
																         placeholder="请再次输入新密码">
																</i-input>
																<span v-if="!isShowPassword['2']" class="show-password" @click="showPassword(2)"></span>
																<span v-else class="close-password" @click="showPassword(2)"></span>
														</div>
												
												</FormItem>
												
												<p style="text-align:right" v-show="actionsType==='login'">
														<span class="forget-password" @click="onForgetPassword">忘记密码?</span>
												</p>
												
												<div style="text-align: left;margin-top: 38px;" v-if="actionsType==='register'">
														<Checkbox v-model="userData.isCheckBox">
																已阅读并同意 <a href="javascript:alert('稍后呈现')"><span class="is-active">《用户使用协议》</span></a>
														</Checkbox>
												</div>
												<div class="login-button">
														<Button @keyup.enter.native="login" id="loginBtn"
														        class="btn-login"
														        :loading="loading"
														        :disabled="isAgree"
														        type="primary" long @click="login">{{actionsLoginMap[actionsType]}}
														</Button>
														
														<!--														v-if="actionsType!=='register'"-->
														<span class="is-active pointer"
														      @click="onRegisterOrBackLogin">
																{{actionsFooterMap[actionsType]}}
														</span>
												</div>
										</Form>
								
								</div>
						
						</div>
				</div>
				<Copyright></Copyright>
		</div>
</template>

<script>
	import md5 from 'js-md5';
	import Copyright from '../layout/Copyright';
	import LoginHallMixins from "../mixins/mixinsLoginHall";
	import {isPassword} from "../utils/tools";
	import Timeout from "./Timeout";
	
	export default {
		name: "Login",
		mixins: [LoginHallMixins],
		components: {
			Copyright, Timeout
		},
		data() {
			const checkPw = (rule, value, callback) => {
				// 如果是注册
				if (this.actionsType !== 'login') {
					if (!value) {
						callback(new Error("请输入密码8-16位密码"));
					} else {
						if (!isPassword(value)) {
							callback(new Error("需包含数字和字母，8-16位"));
						}
						callback();
					}
				} else callback();
			};
			const checkPwConfirm = (rule, val, callback) => {
				if (this.actionsType !== 'login') {
					if (!val) {
						callback(new Error("再次确认密码"));
					} else {
						if (!isPassword(val)) {
							callback(new Error("需包含数字和字母，8-16位"));
						} else {
							if (val !== this.userData.password) {
								callback(new Error("两次密码不一致"));
							}
							callback();
						}
					}
				} else callback();
			};
			return {
				loading: false,
				loginType: false,
				isSending: false,
				isShowPassword: {
					'1': false,
					'2': false
				},
				actionsType: 'login',// login、forget、register
				actionsHeaderMap: {
					login: '登录您的账号',
					forget: '忘记密码',
					register: '注册您的账号',
				},
				actionsLoginMap: {
					login: '登 录',
					forget: '重设密码',
					register: '注 册',
				},
				actionsFooterMap: {
					login: '免费注册',
					forget: '返回登录',
					register: '立即登录',
				},
				userData: {
					areaCode: "+86",
					phone: '',
					password: '',
					confirmPassword: '',
					messageCode: '',
					isCheckBox: true
				},
				loginRule: {
					phone: [
						{required: true, message: '账号不能为空', trigger: 'blur'},
						{len: 11, message: '手机号格式不对', trigger: 'blue'}
					],
					password: [
						{required: true, message: '请输入密码', trigger: 'blur'},
						{required: true, validator: checkPw, trigger: "blur"}
					],
					confirmPassword: [
						{required: true, message: '请再次确认密码', trigger: 'blur'},
						{required: true, validator: checkPwConfirm, trigger: "blur"}
					],
					messageCode: [
						{required: true, message: '请输入验证码', trigger: 'blur'},
						{len: 6, message: '验证码为6位', trigger: 'change'}
					]
				}
			};
		},
		computed: {
			isAgree() {
				return this.actionsType === 'register' && !this.userData.isCheckBox;
			},
			isTimeout() {
				return this.$route.query.type || "";
			}
		},
		mounted() {
			localStorage.clear();
			sessionStorage.clear();
			document.querySelector('#loginBtn') && document.querySelector('#loginBtn').focus();
		},
		methods: {
			onSendValid() {
				if (this.countDownSecond < 60) {
					return;
				}
				if (!/^1[3|4|5|6|7|8|9|]\d{9}$/.test(this.userData.phone)) {
					this.$Message.warning('手机号格式不正确');
					return;
				}
				if (this.actionsType === 'login' || this.actionsType === 'forget') this.loginSendValid();// 登录时候校验
				if (this.actionsType === 'register') this.registerSendValid();// 注册、忘记密码
				
			},
			/**
			 * @desc 登录时候获取的验证码
			 * @flag 1
			 * @flag 2
			 * */
			loginSendValid() {
				const {phone, areaCode} = this.userData;
				this.isSending = true;
				this.$ajaxGet('/user-server/auth/getMessageCode', {
					phone, areaCode
				})
					.then(res => {
						if (res && res.code === 10000) {
							this.isSending = false;
							if (res.data.flag === 1) {
								this.$Message.warning('账号未注册，请先注册');
							}
							if (res.data.flag === 2) {
								this.$Message.success('已发送验证码，请注意查收');
								this.countDownTimer();
							}
						}
					});
			},
			/**
			 * @desc 注册时候获取的验证码
			 * @flag 3
			 * @flag 4
			 * */
			registerSendValid() {
				const {phone, areaCode} = this.userData;
				this.isSending = true;
				this.$ajaxGet('/user-server/auth/getMessageCodeWithCheck', {
					phone, areaCode
				})
					.then(res => {
						if (res && res.code === 10000) {
							this.isSending = false;
							if (res.data.flag === 4) {
								this.$Message.warning('账号已注册，请直接登录');
								this.initLogin();
							}
							if (res.data.flag === 3) {
								this.$Message.success('已发送验证码，请注意查收');
								this.countDownTimer();
							}
						}
					});
			},
			onClickArea(name) {
				this.userData.areaCode = name;
			},
			showPassword(val) {
				this.isShowPassword[val] = !this.isShowPassword[val];
			},
			switchLoginType() {
				this.$refs['loginForm'].resetFields();
				this.loading = false;
			},
			onForgetPassword() {
				this.actionsType = 'forget';
				this.loginType = false;
			},
			onRegisterOrBackLogin() {
				this.switchLoginType();
				this.isShowPassword = this.$options.data().isShowPassword;
				this.countDownSecond = 60;
				clearInterval(this.timer);
				switch (this.actionsType) {
					case "login":
						this.actionsType = 'register';
						this.loginType = false;
						this.userData.messageCode = "";
						break;
					case 'forget':
						this.userData.confirmPassword = '';
						this.actionsType = 'login';
						break;
					case 'register':
						this.userData = this.$options.data().userData;
						this.actionsType = "login";
						break;
				}
			},
			login() {
				this.$refs['loginForm'].validate((valid) => {
					if (valid) {
						switch (this.actionsType) {
							case "login":
								this.goLogin();
								break;
							case 'forget':
								this.goForgetPassword();
								break;
							case 'register':
								this.goRegister();
								break;
						}
					}
				});
			},
			// 注册
			goRegister() {
				const {phone, messageCode, password, areaCode} = this.userData;
				this.loading = true;
				this.$ajaxPost('/user-server/auth/register', {
					phone, messageCode, password: md5(password), areaCode
				})
					.then(res => {
						this.loading = false;
						if (res && res.code === 10000) {
							this.$Message.success(res.message);
							localStorage.setItem('token', res.data.token || "");
							localStorage.setItem('name', res.data.userInfo.name || "");
							localStorage.setItem('userId', res.data.userInfo.id || "");
							localStorage.setItem('headImg', res.data.userInfo.headImg || "");
							localStorage.setItem('phone', res.data.userInfo.phone || "");
							this.$nextTick(async () => {
								location.href = '/tenant/list';
							});
						}
					});
			},
			initLogin() {
				this.isShowPassword = this.$options.data().isShowPassword;
				this.userData = this.$options.data().userData;
				this.countDownSecond = 60;
				this.loginType = false;
				this.actionsType = 'login';
				localStorage.clear();
				this.switchLoginType();
				clearInterval(this.timer);
			},
			// 忘记密码,重置成功，返回登录页面
			goForgetPassword() {
				// 两个密码不匹配===
				this.loading = true;
				const {phone, messageCode, password, areaCode, confirmPassword} = this.userData;
				if (password !== confirmPassword) {
					this.$Message.error("确认密码不一致");
					return;
				}
				this.$ajaxPost('/user-server/auth/resetPassword', {
					phone,
					messageCode,
					password: md5(password),
					areaCode
				})
					.then(res => {
						if (res && res.code === 10000) {
							this.$Message.success(res.message);
							this.initLogin();
						} else {
							if (this.actionsType === 'login') {
								this.actionsType = 'register';
							}
							this.userData.messageCode = '';
							this.loading = false;
						}
					});
			},
			// 登录
			goLogin() {
				this.loading = true;
				const authObj = {
					phone: this.userData.phone,
				};
				if (this.loginType) {
					authObj.passwordOrMessageCode = this.userData.messageCode;
				} else {
					authObj.passwordOrMessageCode = md5(this.userData.password);
				}
				
				this.$ajaxPost('/user-server/auth/login', authObj)
					.then(async res => {
						this.loading = false;
						if (res && res.code === 10000) {
							localStorage.setItem('token', res.data.token || "");
							localStorage.setItem('name', res.data.userInfo.name || "");
							localStorage.setItem('realUserId', res.data.userInfo.id || "");
							localStorage.setItem('userId', res.data.userInfo.id || "");
							localStorage.setItem('headImg', res.data.userInfo.headImg || "");
							localStorage.setItem('phone', res.data.userInfo.phone || "");
							
							await this.$nextTick(async () => {
								location.href = '/tenant/list';
							});
						} else {
							this.userData.messageCode = "";
						}
					});
			}
		}
	};
</script>

<style lang="scss">
		@import "src/assets/scss/loginHall";
		
		.login-type {
				.ivu-switch:after {
						background: #FF8C08;
				}
		}

</style>
<style lang="scss" scoped>
		.login {
				background: #fcf9fc;
				width: 100%;
				height: 100vh;
				
				button {
						border-radius: 24px;
				}
		}
		
		.login-header {
				height: 72px;
				line-height: 72px;
				padding-left: 24px;
				background: #fff;
				border-bottom: 1px solid #ddd;
		}
		
		.login-wrap {
				background: #fcf9fc;
				border-radius: 4px;
				width: 100%;
				margin: 0 auto;
		}
		
		.login-body {
				width: 1124px;
				height: 665px;
				margin: 90px auto 0;
				background: #fff;
				border-top-right-radius: 20px;
				border-bottom-right-radius: 20px;
				
				.left-banner {
						width: 40%;
						height: 100%;
						float: left;
						text-align: right;
						
						.login-banner {
								float: right;
								width: 456px;
								height: 665px;
								background: url("../assets/images/login/login-banner.png");
						}
				}
				
				.right-form {
						float: left;
						height: 100%;
						width: 60%;
						text-align: center;
						
						h2 {
								margin: 56px 0 24px;
						}
						
						.login-type {
								margin-bottom: 40px;
								
								span {
										margin: 0 10px;
								}
								
								.is-normal {
										color: #B5B5BE;
								}
						}
						
						.form-body {
								width: 340px;
								margin: 0 auto;
						}
				}
		}
		
		.login-button {
				margin-top: 80px;
		}
		
		.btn-login {
				margin-top: 20px;
				margin-bottom: 20px;
				line-height: 48px;
				height: 48px;
		}
		
		.phone-input {
				float: right;
				width: 200px;
		}
		
		.forget-password {
				cursor: pointer;
		}
		
		.phone-icon {
				&:before {
						display: inline-block;
						position: absolute;
						content: "";
						background: url("../assets/images/login/icon-phone.png");
						width: 24px;
						height: 24px;
						left: 3px;
						top: 6px;
						z-index: 1;
				}
		}
		
		.password-input {
				
				&:before {
						display: inline-block;
						position: absolute;
						content: "";
						background: url("../assets/images/login/icon-password.png");
						width: 24px;
						height: 24px;
						left: 3px;
						top: 6px;
						z-index: 1;
				}
				
				.show-password {
						background: url("../assets/images/login/icon-eye-close.png");
				}
				
				.close-password {
						background: url("../assets/images/login/icon-eye.png");
				}
				
				.show-password, .close-password {
						display: inline-block;
						position: absolute;
						content: "";
						width: 24px;
						height: 24px;
						right: 3px;
						top: 6px;
						z-index: 1;
				}
				
		}
		
		
		.valid-input {
				.send-valid {
						cursor: pointer;
						display: inline-block;
						position: absolute;
						content: "";
						height: 24px;
						line-height: 24px;
						right: 3px;
						top: 6px;
						z-index: 1;
				}
				
				&:before {
						display: inline-block;
						position: absolute;
						content: "";
						background: url("../assets/images/login/icon-valid.png");
						width: 24px;
						height: 24px;
						left: 3px;
						top: 6px;
						z-index: 1;
				}
		}

</style>
