<!--
 * @Description: 
 * @Author: sam.xutao
 * @Date: 2020-02-20 11:00:58
 * @LastEditTime: 2020-04-03 11:27:04
 * @LastEditors: sam.xutao
 -->
<template>
		<div class="welcome-page">
				<h2 style="text-align: center;line-height: 500px;">
						<Icon type="ios-cafe" size="64"></Icon>
						<span style="font-size: 32px;">欢迎 {{$store.state.username||$store.state.phone}} , MOS会员数字运营平台</span>
				</h2>
		</div>
</template>

<script>
	export default {
		name: "Welcome"
	}
</script>
