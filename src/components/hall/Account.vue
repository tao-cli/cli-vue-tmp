<!--
@desc 账号信息 {账号信息/更换手机/注销账号}
-->
<template>
		<div class="user-account">
				
				<component :is="currentComponent"
				           :accountObj="accountObj"
				           @whatComponent="whatComponent"></component>
		
		</div>
</template>

<script>
	import Profile from "./components/Profile";
	import CancelAccount from "./components/CancelAccount";
	import ChangePhone from "./components/ChangePhone";
	
	export default {
		name: "Account",
		components: {
			CancelAccount, ChangePhone, Profile
		},
		data() {
			return {
				pageType: 'Profile',
				accountObj: {}
			};
		},
		computed: {
			currentComponent() {
				switch (this.pageType) {
					case "Profile":
						return 'Profile';
					case "CancelAccount":
						return 'CancelAccount';
					case "ChangePhone":
						return "ChangePhone";
					default:
						return 'Profile';
				}
			}
		},
		watch: {
			$route(to) {
				const {type = ""} = to.query || {};
				if (type === 'profile') {
					this.pageType = 'Profile';
				}
			}
		},
		methods: {
			whatComponent(label) {
				this.pageType = label.name;
				this.accountObj = label.accountObj || {};
				this.$router.replace('/hall/account').catch(err=>{err});
			}
		}
	};
</script>

<style lang="scss">
		.mos-item {
				clear: both;
				
				.area-code {
						width: 120px;
						height: 32px;
						float: left;
						border-bottom: 1px solid #E2E2EA;
				}
				
				.phone-input {
						position: relative;
						margin-left: 140px;
				}
				
				.phone-span {
						display: inline-block;
						width: 100%;
						height: 32px;
						border-bottom: 1px solid #E2E2EA;
				}
				
				.change-span {
						cursor: pointer;
						position: absolute;
						right: 0;
						top: 0;
						color: #FF8C08;
						z-index: 1;
				}
		}
</style>
