<template>
		<div id="wangeditor" :style="styles">
				<div ref="editorElem" style="text-align:left"  ></div>
		</div>
</template>
<script>
	import E from 'wangeditor';
	
	export default {
		name: 'editorElem',
		data() {
			return {
				editor: null
			};
		},
		props: ['catchData', 'content', 'menus', 'styles', 'uploadImgServer', 'uploadFileName','placeholder'],    // 接收父组件的方法
		watch: {
			content(newval, oval) {
				// 避免光标换行, 初始化内容时执行，之后均不执行
				!oval && this.editor.txt.html(newval);
			}
		},
		mounted() {
			this.editor = new E(this.$refs.editorElem);
			
			let t = this;
			this.editor.customConfig.zIndex = 100
			// 关闭粘贴样式的过滤
			this.editor.customConfig.pasteFilterStyle = false;
			this.editor.customConfig.onchange = (html) => {
				this.catchData(html);  // 把这个html通过catchData的方法传入父组件
			};
			this.editor.customConfig.uploadImgServer = this.$upload || '你的上传图片的接口';
			this.editor.customConfig.uploadFileName = this.uploadFileName || 'file';
			
			// 编辑器菜单建议带操作的按钮放在第二排，不然会有 z-index 层级覆盖问题
			
			this.editor.customConfig.menus = this.menus || [          // 菜单配置
				'head',  // 标题
				'bold',  // 粗体
				'fontSize',  // 字号
				'fontName',  // 字体
				'italic',  // 斜体
				'underline',  // 下划线
				'strikeThrough',  // 删除线
				'foreColor',  // 文字颜色
				'backColor',  // 背景颜色
				'link',  // 插入链接
				'list',  // 列表
				'justify',  // 对齐方式
				'quote',  // 引用
				'emoticon',  // 表情
				'image',  // 插入图片
				'table',  // 表格
				'code',  // 插入代码
				'undo',  // 撤销
				'redo'  // 重复
			];
			// 下面是最重要的的方法
			this.editor.customConfig.uploadImgHooks = {
				// before: function (xhr, editor, files) {
				//             // 图片上传之前触发
				//             // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
				
				//             // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
				//             // return {
				//             //     prevent: true,
				//             //     msg: '放弃上传'
				//             // }
				// },
				success: function (result) {
					// xhr, editor, result
					// 图片上传并返回结果，图片插入成功之后触发
					// xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
					t.$emit('uploadSuccess', result.response||result.responseText);
				},
				// fail: function (xhr, editor, result) {
				//             // 图片上传并返回结果，但图片插入错误时触发
				//             // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
				// },
				// error: function (xhr, editor) {
				//             // 图片上传出错时触发
				//             // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
				// },
				// timeout: function (xhr, editor) {
				//             // 图片上传超时时触发
				//             // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
				// },
				
				// 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
				// （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
				customInsert: function (insertImg, result) {
					// 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
					// insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
					
					// 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
					// let url = Object.values(result.data);      // result.data就是服务器返回的图片名字和链接
					// JSON.stringify(url);    // 在这里转成JSON格式
					const imageURL = result.data || '';
					insertImg(imageURL);
					
					// result 必须是一个 JSON 格式字符串！！！否则报错
				}
			};
			
			this.editor.create();     // 创建富文本实例
			this.editor.txt.html(this.content);
			if (!this.content||!this.content.toString().trim()) {
				this.editor.txt.html(this.placeholder||'请编辑内容');
			}
		}
	};
</script>
<style lang="scss">
	// $placeholder: '请输入内容';
	// // #wangeditor .w-e-text{border:solid 1px #f00;}
	// #wangeditor .w-e-text:blank::before{
	// 	content: $placeholder;
	// }	
	
	// #wangeditor .w-e-text:focus::before{
	// 	content: '';
	// }
</style>
<style lang="scss" rel="stylesheet/scss">
		#wangeditor {
				width: 50rem; background:#fff; 
		}
		
		.w-e-toolbar {
				flex-wrap: wrap;
		}
		
		.w-e-text-container {
			padding-top:5px;
			height: 180px !important;
		}
</style>
