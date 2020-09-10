// 会员中心菜单
module.exports = {
    path: 'member', //会员中心
    name: 'member',
    meta: {
        title: '会员', fullTitle: '会员中心',
        icon: 'iconhuiyuanzhongxin'
    },
    component: () => import('../layout/ComponentsLayout'),
    children: [
        {
            path: 'manage', //会员字段设置
            name: 'member-manage',
            meta: {
                title: '会员管理',
            },
            redirect: '/member/manage/query',
            component: () => import('../layout/ComponentsLayout'),
            children: [
                {
                    path: 'query',
                    name: 'member-manage-query',
                    meta: {
                        title: '会员查询',
                    },
                    component: () => import('../components/member/query/QueryMember'),
                },
                {
                    path: 'details',
                    name: 'member-manage-details',
                    meta: {
                        title: '会员详情',
                        h2: true,
                        hidden: true,
                    },
                    component: () => import('../components/member/query/memberDetail/MemberDetail'),
                },
                {
                    path: 'field', //会员字段设置
                    name: 'member-manage-field',
                    meta: {
                        title: '字段设置',
                    },
                    component: () => import('../components/member/fontSetting/FontSetting')
                },
            ]
        },


        {
            path: 'level', //会员字段设置
            name: 'member-level',
            meta: {
                title: '会员等级',
                h2: true,
            },
            redirect: '/member/level/settingLevel',
            component: () => import('../layout/ComponentsLayout'),
            children: [
                {
                    path: 'settingLevel',
                    name: 'member-level-settingLevel',
                    meta: {
                        title: '等级设置',
                        h2: true,
                    },
                    component: () => import('../components/member/level/SettingLevel'),
                },
                {
                    path: 'editLevel',
                    name: 'member-level-editLevel',
                    meta: {
                        title: '等级编辑',
                        h2: true,
                        hidden: true,
                    },
                    component: () => import('../components/member/level/editLevel/EditLevel'),
                },
                {
                    path: 'editGrowth',
                    name: 'member-level-editGrowth',
                    meta: {
                        title: '成长值设置',
                        h2: true,
                        hidden: true,
                    },
                    component: () => import('../components/member/level/growthSetting/GrowthSetting'),
                },
                {
                    path: 'growthDetail', //会员字段设置
                    name: 'member-level-growthDetail',
                    meta: {
                        title: '成长值明细',
                    },
                    component: () => import('../components/member/growthDetail/GrowthDetail'),
                },
            ]
        },

    ]
}