/***********************
 * @desc 商户路由
 * @name JS
 * @author Jo.gel
 * @date 2020/3/9 0009
 ***********************/

export default [
	{
		path: '/tenant',
		name: 'tenant',
		redirect: '/tenant/list',
		component: () => import('../layout/HallLayout'),
		meta: {
			title: "商户管理"
		},
		children: [
			{
				path: "list",
				name: "tenant-list",
				component: () => import('../components/tenant/TenantList'),
				meta: {
					title: '选择商户'
				}
			},
			{
				path: "create",
				name: "tenant-create",
				component: () => import('../components/tenant/TenantEdit'),
				meta: {
					title: '创建商户'
				}
			},
			{
				path: "detail",
				name: "tenant-detail",
				component: () => import('../components/tenant/TenantDetail'),
				meta: {
					title: '商户详情'
				}
			}
		]
	}
];
