module.exports = {
	pages: {
		index: {
			// page 的入口
			entry: 'src/main.js',
			template: 'public/index.html',
			title: '管理 - 解百集团',
		},
		login: {
			entry: 'src/login.js',
			title: '登录 - 解百集团',
		}
	},
	css: {
		loaderOptions: { // 向 CSS 相关的 loader 传递选项
			less: {
				javascriptEnabled: true
			}
		}
	},
	productionSourceMap: false,
	devServer: {
		// 开发环境
		// proxy: 'http://61.174.255.142:8080',
		// 测试环境
		// proxy: 'http://61.174.255.137:8081',
		// 预发布
		proxy: 'http://premos.data4truth.com:8081/',

		// proxy: {
		// 	'/user-server': {
		// 		target: 'http://61.174.255.142:8080',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/user-server': '/user-server'
		// 			// '^/user-server': '/user-server'
		// 		}
		// 	},
		// 	'/activity-server': {
		// 		// target: 'http://192.168.1.92:32238',
		// 		// target: 'http://183.131.202.154',
		// 		target: 'http://61.174.254.105:8080',
		// 		// target: 'http://183.131.202.13:8006',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/activity-server': '/activity-server'
		// 		}
		// 	},
		// 	'/distribution-server': { //分销管理
		// 		// target: 'http://183.131.202.154:8006',
		// 		// target: 'http://192.168.1.78:8067',
		// 		// target: 'http://192.168.1.92:23526',
		// 		target:'http://61.174.254.105:8080',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/distribution-server': '/distribution-server'
		// 		},
		// 	},
		// 	'setting-server': {
		// 		// target: 'http://183.131.202.13:8006',
		// 		target: 'http://61.174.254.105:8080',
		// 		// target: 'http://183.131.202.13:8006',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/setting-server': '/setting-server'
		// 		}
		// 	},
		// 	'etl-server': {
		// 		// target: 'http://183.131.202.13:8006',
		// 		target: 'http://61.174.254.105:8080',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/etl-server': '/etl-server'
		// 		}
		// 	},
		// 	'/coupon-server': {
		// 		// target: 'http://183.131.202.154:8006/',
		// 		// target: 'http://183.131.202.13:8006',
		// 		target: 'http://61.174.254.105:8080',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/coupon-server': '/coupon-server'
		// 		}
		// 	},
		// 	'/label-server': {
		// 		// target: 'http://192.168.1.149:23522',
		// 		// target: 'http://183.131.202.13:8006',
		// 		target: 'http://61.174.254.105:8080',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/label-server': '/label-server'
		// 			// '^/label-server': '/'
		// 		}
		// 	},
		// 	'/mall-server': {
		// 		// target: 'http://192.168.1.77:23524',
		// 		// target: 'http://183.131.202.154:8006',
		// 		// target: 'http://183.131.202.13:8006',
		// 		target: 'http://61.174.254.105:8080',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/mall-server': '/mall-server'
		// 		}
		// 	},
		// 	// '/api/report': {
		// 	// 	target: 'http://192.168.1.127:23518',
		// 	// 	// target: 'http://61.174.254.62:8006',
		// 	// 	changeOrigin: true,
		// 	// 	pathRewrite: {
		// 	// 		'^/api/report': '/api/report'
		// 	// 	}
		// 	// },
		// 	'/mall/goods': {
		// 		// target: 'http://192.168.1.77:23524',
		// 		target: 'http://61.174.254.105:8080',
		// 		// target: 'http://183.131.202.13:8006',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/mall/goods': '/mall/goods'
		// 		}
		// 	},
		//
		// 	// 上面是 本地测试
		// 	'/crm-server': {
		// 		target: 'http://61.174.254.105:8080',
		// 		// target: 'http://61.174.254.105:30366',
		// 		// target: 'http://183.131.202.13:8006',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/crm-server': '/crm-server'
		// 			// '^/crm-server/': '/'
		// 		}
		// 	},
		//
		// 	'/message-server': {
		// 		// target: 'http://192.168.1.77:23533',
		// 		// target: 'http://183.131.202.13:8006',
		// 		target: 'http://61.174.254.105:8080',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/message-server': '/message-server'
		// 		}
		// 	},
		//
		// 	'/marketing-server': {
		// 		// target: 'http://192.168.1.77:23525',
		// 		// target: 'http://183.131.202.13:8006',
		// 		target: 'http://61.174.254.105:8080',
		// 		// target: 'http://192.168.1.172:23523',
		// 		// target: 'http://61.174.254.22:23525',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			// '^/marketing-server': '/'
		// 			'^/marketing-server': '/marketing-server'
		// 		}
		// 	},
		// 	// '/activity-server':{
		// 	// 	target: 'http://61.174.254.62:8006',
		// 	// 	// target: 'http://192.168.1.172:23523',
		// 	// 	// target: 'http://61.174.254.22:23525',
		// 	// 	changeOrigin: true,
		// 	// 	pathRewrite: {
		// 	// 		// '^/marketing-server': '/'
		// 	// 		'^/marketing-server': '/marketing-server'
		// 	// 	}
		// 	// },
		//
		// 	// '/api/marketing/': {
		// 	// 	target: 'http://192.168.1.196:23525',
		// 	// 	changeOrigin: true,
		// 	// 	pathRewrite: {
		// 	// 		'^/api': '/api'
		// 	// 	}
		// 	// },
		//
		//
		// 	'/api/marketing/': {
		// 		target: 'http://192.168.1.196:23525',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/api': '/api'
		// 		}
		// 	},
		// 	'/medical-server': { //资料管理
		// 		// target: 'http://183.131.202.13:8081',
		// 		target: 'http://61.174.254.105:8080',
		// 		// target: 'http://192.168.1.92:23526',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/medical-server': '/medical-server'
		// 		}
		// 	},
		// 	'/prepaidcard-server': { //储值卡
		// 		// target: 'http://183.131.202.13:8081',
		// 		target: 'http://61.174.254.105:8080',
		// 		// target: 'http://192.168.1.104:23529',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/prepaidcard-server': '/prepaidcard-server'
		// 		}
		// 	},
		//
		//
		// 	'/order-server': { //订单管理
		// 		// target: 'http://183.131.202.13:8006',
		// 		target: 'http://61.174.254.105:8080',
		// 		// target: 'http://183.131.202.13:8081',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/order-server': '/order-server'
		// 		}
		// 	},
		//
		// 	'/message-server/': {
		// 		// target: 'http://183.131.202.13:23533/',
		// 		// target: 'http://183.131.202.13:8081',
		// 		target: 'http://61.174.254.105:8080',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/message-server': '/message-server'
		// 		}
		// 	},
		//
		//
		// 	// 审批中心
		// 	'/approve-server': {
		// 		// target: 'http://183.131.202.13:8006/',
		// 		target: 'http://61.174.254.105:8080',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/approve-server': '/approve-server'
		// 		}
		// 	},
		// 	'/marketApi': {
		// 		target: 'http://61.174.254.22:23525',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/marketApi': '/marketApi'
		// 		}
		// 	},
		//
		// 	'/report-server': {
		// 		// target: 'http://183.131.202.13:8006',
		// 		target: 'http://61.174.254.105:8080',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/report-server': '/report-server'
		// 		}
		// 	},
		// 	'/webchatmall-server': {
		// 		// target: 'http://183.131.202.13:8006',
		// 		// target: 'http://61.174.254.105:8080',
		// 		target: 'http://61.174.254.62:8006',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/webchatmall-server': '/webchatmall-server'
		// 		}
		// 	},
		// 	//发票模块
		// 	'/bill-server': {
		// 		// target: 'http://192.168.1.149:23537',
		// 		// target:'http://183.131.202.13:8006',
		// 		target: 'http://61.174.254.105:8080',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/bill-server': '/bill-server'
		// 			// '^/bill-server': '/'
		// 		}
		// 	},
		// 	// 客服模块
		// 	'/customer-server': {
		// 		// target: 'http://192.168.1.149:23537',
		// 		// target:'http://183.131.202.13:8006',
		// 		target: 'http://61.174.254.105:8080',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/customer-server': '/customer-server'
		// 			// '^/bill-server': '/'
		// 		}
		// 	},
		// 	// 文件上传地址
		// 	'/file-server': {
		// 		// target: 'http://183.131.202.13:8006/',
		// 		target: 'http://61.174.254.105:8080',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/file-server': '/file-server'
		// 		}
		// 	},
		// 	// 停车模块
		// 	'/park-server': {
		// 		// target: 'http://183.131.202.154:8006/',
		// 		target: 'http://61.174.254.105:8080',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/park-server': '/park-server'
		// 		}
		// 	},
		//
		// 	// 开发者平台模块
		// 	'/integration-server': {
		// 		// target: 'http://183.131.202.154:8006/',
		// 		target: 'http://61.174.254.105:8080',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/integration-server': '/integration-server'
		// 			// '^/integration-server': '/'
		// 		}
		// 	},
		// 	// 会员服务
		// 	'/member-server': {
		// 		target: 'http://61.174.255.142:8080',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/member-server': '/member-server'
		// 		}
		// 	},
		// 	'/grade-server': {
		// 		target: 'http://61.174.255.142:8080',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/grade-server': '/grade-server'
		// 		}
		// 	},
		// 	'/points-server': {
		// 		target: 'http://61.174.255.142:8080',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/points-server': '/points-server'
		// 		}
		// 	},
		// 	// 后端吴汕的本地服务器
		// 	'/shan-server': {
		// 		target: 'http://192.168.1.39:8080',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/shan-server': '/'
		// 		}
		// 	},
		// 	// 李进的本地 easy mock
		// 	'/front-server': {
		// 		target: 'http://61.174.254.2:7300/mock/5e746c6879758c3a8256543f',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/front-server': '/'
		// 		}
		// 	},
		//
		// }
	}
};
