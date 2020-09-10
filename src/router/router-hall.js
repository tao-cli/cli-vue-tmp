/***********************
 * @desc 大厅路由
 * @name JS
 * @author Jo.gel
 * @date 2020/3/2 0002
 ***********************/
export default [
	{
		path: '/hall',
		name: "hall",
		redirect: '/hall/welcome',
		component: () => import('../layout/HallLayout'),
		meta: {
			title: '账号管理',
			icon: 'md-people'
		},
		children: [
			{
				path: 'welcome',
				name: 'hall-welcome',
				component: () => import('../view/Welcome'),
				meta: {
					title: '欢迎页面',
					hidden: true,
					h2: true
				}
			},
			{
				path: 'account',
				name: 'hall-account',
				meta: {
					title: '账号信息',
					h2: true
				},
				component: () => import('../components/hall/Account')
			},
			{
				path: 'password',
				name: 'hall-password',
				meta: {
					title: '修改密码'
				},
				component: () => import('../components/hall/Password')
			}
		]
	}
];
