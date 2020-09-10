<template>
    <div>
        <div v-if="showShareInfo" class="select-info-block">
            <div>
                <i  class="icon iconfont iconInfo color-text"  title="更多" ></i>
                <span>当前数据共享</span>
                <span class="select-count">{{ shareDataText }}</span>
                <span v-if="this.shareData"> ，商户各门店间可共享成长值明细</span>
                <span v-else> ，商户门店间不可共享成长值</span>
            </div>
            <span class="action-text" @click="setShare">{{ shareDataBtn }}</span>
        </div>

        <div class="search-container big-block-narrow">
            <div ref="searchBlock" v-if="foldSearch" class="search-block">
                <div>
                    <Button @click="exportExcelDebounce"
                            class="w60"  type="primary" >导出</Button>
                    <div class="search-separate-line"></div>
                    <Select v-model="timeRangeSelect" placeholder="起止时间"
                            @on-change="chooseTimeRange"
                            class="w100 button-gap">
                        <Option v-for="item in timeFilterList"
                                :value="item.value" :key="item.value">
                            {{ item.label }}</Option>
                    </Select>

                    <DatePicker type="daterange" placement="bottom-end"
                                class="component-narrow w280"
                                placeholder="开始时间 → 结束时间"
                                @on-change="handleTimePiker"
                                format="yyyy-MM-dd"
                                :value="[searchData.startTime, searchData.endTime]"
                    ></DatePicker>
                </div>

                <div>
                    <Select v-model="searchType"  placeholder="请选择"
                            @on-change="choosePhoneSerial"
                            class="button-gap"
                            style="width: 80px">
                        <Option value="phone">手机号</Option>
                        <Option value="serial">流水号</Option>
                    </Select>
                    <i-input v-model="tempPhoneSerial" search
                             @on-search="filterList"
                             class="w240 identity-search button-gap"
                             :placeholder="showPlaceholder" >

                        <i  class="icon iconfont iconSearch"  title="更多" slot="suffix"></i>
                    </i-input>

                    <div v-if="advancedFilterStatus"
                         @click="toggleAdvancedFilter"
                         class="fold-block-active"
                    >
                        <span class="filter-container">
                            <i  class="icon iconfont iconFilter"  title="筛选" ></i>
                            <i  class="icon iconfont iconDropdownUnfold"  title="更多"></i>
                        </span>
                    </div>

                    <div v-else @click="toggleAdvancedFilter" class="fold-block-normal">
                        <i  class="icon iconfont iconFilter"  title="筛选" ></i>
                        <i  class="icon iconfont iconTreeFold"  title="更多"></i>
                    </div>
                </div>
            </div>

            <div v-if="advancedFilterStatus" class="advanced-block">
                <div class="filter-row keep-one-line">
                    <span>变更类型：</span>
                    <Cascader class="w240 big-row-narrow" :data="growthAction"
                              placeholder="请选择变更类型"
                              @on-change="selectActions"
                              trigger="hover"></Cascader>

                    <span>所属门店：</span>
                    <Select v-model="searchData.orgIds"  placeholder="请选择所属门店" multiple
                            class="w240 button-gap"
                    >
                        <Option v-for="item in storeList"
                                :value="item.value"
                                :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>

                <div class="last-row">
                    <Button @click="filterList"
                            class="button-gap w60"  type="primary" >筛选</Button>
                    <Button @click="toggleAdvancedFilter"
                            class="button-gap w60" type="default" >取消</Button>
                </div>
            </div>

            <Table :columns="columns"
                   class="level-table middle-block-narrow"
                   :loading="tableLoading"
                   :data="list" ></Table>

            <Page
                    class="pagebox"
                    :total="pageData.count"
                    :current="pageData.page"
                    show-sizer
                    :page-size="pageData.size"
                    show-elevator
                    show-total
                    @on-change="onPageChange"
                    @on-page-size-change="onPageSize"
            />
        </div>



    </div>

</template>

<script>
    import _ from 'lodash';
    import { log, createRangeTime } from "@/utils/tools";
    import {growthDetailCol} from "./growthDetailCol";
    import { growthAction } from "./growthAction";

    export default {
        name: "GrowthDetail",
        props: {  },
        data() {
            return {
                timeOption:{
                    disabledDate (date) {
                        // 禁用过去的时间
                        return date && date.valueOf() > Date.now() - 86400000;
                    }
                },
                showCardList: true,
                foldSearch: true,

                orgId: '',
                orgName: '',
                tempPhoneSerial: '',
                searchType: 'phone',

                searchData: {
                    startTime: '',
                    endTime: '',
                    // 类型 1:成长值 2:积分
                    type: 1,
                    orgIds: [],

                    isAdd: '',
                    changeReason: '',
                    phone: '',
                    serialNumber: '',
                },
                pageData: {
                    page: 1,
                    size: 10,
                    count: 0,
                },

                growthAction: growthAction,

                list: [],
                selectList: [],

                storeList: [
                    {
                        value: '',
                        label: '',
                    },
                ],

                currentActionMember: '',
                currentStatusType: '',
                accountStatusPop: false,
                frozenAction: '1',

                memberPop: false,
                memberForm: {
                    phone: '',
                    memberName: '',
                    sex: '',
                    birthday: '',
                },
                memberModalValidate: {
                    phone: [
                        {
                            required: true,
                            message: "请输入手机号",
                            trigger: 'blur',

                            type: 'string'
                        },
                        {
                            len: 11,
                            trigger: 'blur',
                            message: "手机号为 11 位",
                        }
                    ],
                },

                actionListStatus: false,
                memberActions: [
                    // {
                    //     value: 'point',
                    //     label: '积分调整',
                    // },
                    // {
                    //     value: 'growth',
                    //     label: '成长值调整',
                    // },
                    // {
                    //     value: 'level',
                    //     label: '等级调整',
                    // },
                    {
                        value: 'cancel',
                        label: '账户注销',
                    },
                    {
                        value: 'status',
                        label: '账户状态调整',
                    },
                    {
                        value: 'logout',
                        label: '账户登出',
                    },
                ],

                selectParentIndex: '',
                batchActionType: '',
                subAction: [
                    {
                        value: 'select',
                        label: '对选中的人调整',
                    },
                    // {
                    //     value: 'filter',
                    //     label: '对筛选的人调整',
                    // },
                ],

                memberIds: [],
                clearAll: false,

                // 高级筛选
                advancedFilterStatus: false,
                genderListFilter: [{
                    label: '全部',
                    value: '',
                    selected: true,
                    isAll: false,
                }, {
                    label: '男',
                    value: 'M',
                    selected: false,
                    isAll: false,
                }, {
                    label: '女',
                    value: 'F',
                    selected: false,
                    isAll: false,
                },  {
                    label: '不详',
                    value: 'N',
                    selected: false,
                    isAll: false,
                }, ],
                displaySelectedGender: '',

                memberLevelList: [],
                memberLevelFilter: [],
                displaySelectedLevel: '',

                accountStatusList: [{
                    label: '账号冻结',
                    value: 'accountFrozen',
                    selected: false,
                    isAll: false,
                }, {
                    label: '等级冻结',
                    value: 'levelFrozen',
                    selected: false,
                    isAll: false,
                },  {
                    label: '已注销',
                    value: 'logout',
                    selected: false,
                    isAll: false,
                }, ],
                displayAccountStatus: '',
                displayRegisterChannel: '',

                columns: growthDetailCol.call(this),
                tableLoading: false,
                growthFilterFlag: false,
                timeRangeSelect: 'oneMonth',

                growthFilter: [
                    {
                        id: '',
                        name: '全部',
                    },
                    {
                        id: '1',
                        name: '增加',
                    },
                    {
                        id: '-1',
                        name: '减少',
                    },
                ],

                timeFilterList: [
                    {
                        value: 'custom',
                        label: '自定义'
                    },
                    {
                        value: 'oneWeek',
                        label: '近 1 周'
                    },
                    {
                        value: 'oneMonth',
                        label: '近 1 月'
                    },
                    {
                        value: 'threeMonth',
                        label: '近 3 月'
                    },
                    {
                        value: 'halfYear',
                        label: '近半年'
                    },
                    {
                        value: 'oneYear',
                        label: '近 1 年'
                    },
                ],

                shareData: false,
                // 只能商户能看，门店不能看
                showShareInfo: false,
            }
        },
        computed: {
            shareDataText() {
                let text = this.shareData ? '已开启' : '已关闭'
                return text
            },
            shareDataBtn() {
                let text = this.shareData ? '关闭' : '打开'
                return text
            },
            showPlaceholder() {
                let message = '请选择左侧的搜索类型'
                if (this.searchType === 'phone') {
                    message = '会员手机号检索'
                } else if(this.searchType === 'serial') {
                    message = '会员流水号检索'
                }
                return message
            }
        },
        created() {
            this.initData()
            this.setSearchCondition()
            this.isTopOrg()
        },
        mounted() {
            this.getList()
            this.getStoreList()
            this.getShareSetting()
        },
        methods: {
            initData() {
                let orgId = localStorage.orgId || 'AABBCCDDEEFFGGHH66'
                let orgName = localStorage.orgName

                this.orgName = orgName
                this.orgId = orgId
            },
            setSearchCondition() {
                let { serial, phone } = this.$route.query
                if (serial !== undefined) {
                    this.searchData.serialNumber = serial
                    this.searchType = 'serial'
                    this.tempPhoneSerial = serial
                } else if (phone !== undefined) {
                    this.searchData.phone = phone
                    this.searchType = 'phone'
                    this.tempPhoneSerial = phone
                } else {
                    this.chooseTimeRange('oneMonth')
                }
            },
            toggleAdvancedFilter() {
                let currentStatus = this.advancedFilterStatus
                this.advancedFilterStatus = !currentStatus
            },
            formatData() {
                let { page, size} = this.pageData
                let data = {
                    page,
                    size,
                    ...this.searchData
                }
                if (this.searchType === 'phone') {
                    data.phone =  this.tempPhoneSerial
                } else {
                    data.serialNumber =  this.tempPhoneSerial
                }

                return data
            },
            getList() {
                let server = '/points-server'
                let url = server + '/api/score/detail/list'
                let data = this.formatData()
                this.list = []

                this.tableLoading = true
                this.$ajaxPost(url, data)
                    .then(res => {
                        if (res && res.code === 10000) {
                            let resData = res.data
                            this.list = resData.list || [];
                            log('list', this.list)
                            this.pageData.count = resData.total || 0;
                        }
                        this.tableLoading = false
                    })
                    .catch(err => {
                        log(err);
                    });
            },
            getShareSetting() {
                let server = '/points-server'
                let url = server + '/api/growth/share/setting/get'
                let data = {
                    orgId: this.orgId
                }

                this.$ajaxGet(url, data)
                    .then(res => {
                        if (res && res.code === 10000) {
                            let resData = res.data
                            this.shareData = resData.shareData || false
                        }
                    })
                    .catch(err => {
                        log(err);
                    });
            },
            isTopOrg() {
                let server = '/user-server'
                let url = server + '/internal/organization/isRoot'
                let data = {
                    orgId: this.orgId
                }

                this.$ajaxGet(url, data)
                    .then(res => {
                        if (res && res.code === 10000) {
                            let resData = res.data
                            this.showShareInfo = resData || false
                        }
                    })
                    .catch(err => {
                        log(err);
                    });
            },
            createStoreList(resData) {
                let tempList = []
                let mainStore = {
                    value: this.orgId,
                    label: this.orgName,
                }
                tempList.push(mainStore)

                resData.forEach((item) => {
                    let cell = {
                        value: item.orgId,
                        label: item.name,
                    }
                    tempList.push(cell)
                })
                this.storeList = tempList
            },
            getStoreList() {
                let server = '/user-server'
                let url = server + '/internal/organization/getSubStoreInfoList'
                let data = { orgId: this.orgId }

                this.$ajaxGet(url, data)
                    .then(res => {
                        if (res && res.code === 10000) {
                            let resData = res.data
                            this.createStoreList(resData)

                            log('in getStoreList resData', resData)
                        }
                    })
                    .catch(err => {
                        log(err);
                    });
            },
            onPageChange(page) {
                this.memberIds = []
                this.selectList = []
                this.pageData.page = page
                this.$nextTick(() => {
                    this.getList();
                });
            },
            onPageSize(size) {
                this.pageData.size = size;
                this.getList();
            },
            handleTimePiker(val){
                let startDate = val[0]
                let endDate = val[1]
                if (startDate) {
                    startDate = startDate + " 00:00:00"
                    endDate = endDate + " 23:59:59"
                }

                Object.assign( this.searchData, {
                    startTime: startDate,
                    endTime: endDate,
                })
                this.pageData.page = 1
                this.getList()
            },
            filterList() {
                this.pageData.page = 1
                this.getList()
            },
            // 根据选择时间间隔，设置 DatePicker
            chooseTimeRange(val) {
                let pack = createRangeTime(val)
                let [startTime, endTime] = pack
                if (val === 'custom') {
                    startTime = ''
                    endTime = ''
                }

                Object.assign(this.searchData, {
                    startTime,
                    endTime,
                })
            },
            choosePhoneSerial(val) {
                let phone = ''
                let serialNumber = ''
                if (val === 'phone') {
                    phone = val
                } else {
                    serialNumber = val
                }

                this.tempPhoneSerial = ''
                Object.assign(this.searchData, {
                    phone,
                    serialNumber,
                })
            },
            selectActions(value) {
                let emptyValue = value.length === 0
                if (emptyValue) {
                    value = ['', '']
                }
                let [parentType, subType] = value

                Object.assign(this.searchData, {
                    isAdd: parentType,
                    changeReason: subType,
                })
            },
            onExportThrottle: _.debounce( function () {
                let a = document.getElementById('downloadTable')
                a.click()
            }, 1000),
            exportExcelDebounce: _.debounce( function () {
                let url
                let baseUrl = '/points-server/api/score/detail/export'
                let data = this.formatData()
                let { startTime, endTime, type, orgIds, isAdd, phone, serialNumber } = data

                let a = `${baseUrl}?startTime=${ startTime }&endTime=${ endTime }`
                let b = `&type=${type}&orgIds=${orgIds}&orgId=${ this.orgId }&isAdd=${isAdd}&phone=${phone}&serialNumber=${serialNumber}`
                url = a + b

                log('url', url)
                window.open(url)
            }, 1000),
            setShare() {
                let server = '/points-server'
                let url = server + '/api/growth/share/setting'
                let data = {
                    orgId: this.orgId,
                    isShareData: !this.shareData,
                }

                this.$ajaxPost(url, data)
                    .then(res => {
                        if (res && res.code === 10000) {
                            this.$Message.success(res.message)
                            this.getShareSetting()
                        }
                    })
                    .catch(err => {
                        log(err);
                    });
            }
        }
    }
</script>

<style lang="scss"  scoped>

    .row-narrow {
        margin-top: 20px;
    }


    .search-container {
        padding: 24px;
        background:rgba(255,255,255,1);
        box-shadow:0px 2px 12px 0px rgba(0,0,0,0.04);
        border-radius:16px;
    }

    .search-block {
        display: flex;
        justify-content: space-between;
    }

    .action-block {
        position: relative;
        display: inline-block;


        .iconfont {
            font-size: 24px;
            vertical-align: middle;
        }
    }

    .mark-btn {
        display: inline-block;
        vertical-align: middle;
        background: white;
        border-radius: 4px;

        border: 1px solid #dcdee2;
        height: 32px;
        line-height: 32px;
        padding: 0 4px 0 16px;
        cursor: pointer;

        &:hover {
            border:1px solid #FF8C08;
            color: #FF8C08;
        }
        &:hover > .iconTreeFold {
            cursor: pointer;
            color: #FF8C08;
        }
    }

    .search-separate-line {
        display: inline-block;
        height: 20px;
        border-right: 1px solid rgba(226,226,234,1);
        margin: -6px 8px;
    }

    .button-gap {
        margin-right: 8px;
    }

    .action-text {
        cursor: pointer;
        color: #FF8C08;
    }

    .search-label {
        display: inline-block;
        width: 70px;
        text-align: right;
    }

    .filter-btn {
        display: flex;
        justify-content: flex-end;
    }

    .identity-search {
        position: relative;
        z-index: 4;
        .iconSearch {
            color: #BBB8BB;
            font-size: 24px;
        }
    }

    .fold-block-normal {
        display: inline-block;
        cursor: pointer;
        line-height: 32px;
        width: 56px;
        height: 32px;

        text-align: center;
        vertical-align: middle;

        background:rgba(250,250,251,1);
        border-radius:8px;
        border:1px solid rgba(226,226,234,1);

        .iconfont {
            vertical-align: middle;

            color: #929496;
        }
    }

    .fold-block-active {
        display: inline-block;
        z-index: 2;
        position: relative;
        cursor: pointer;
        background: #FCF9FC;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border: 1px solid #e2e2ea;
        border-bottom: none;
        width: 56px;
        height: 41px;
        margin-bottom: -22px;
        padding-bottom: 10px;

        .iconfont {
            vertical-align: middle;
            color: #FF8C08;
        }

        &:before {
            position: absolute;
            bottom: 0px;
            content: '';
            display: inline-block;
            width: 20px;
            left: -20px;
            background: white;
            height: 22px;
            border-right: 1px solid #e2e2ea;
            border-bottom: 1px solid #e2e2ea;
            border-bottom-right-radius: 12px 12px;
            z-index: 2;
        }
        &:after {
            position: absolute;
            bottom: 0;
            content: '';
            display: inline-block;
            width: 20px;
            left: -10px;
            background: #FCF9FC;
            height: 20px;
            /*border-radius:         10px;*/
            z-index: 1;
        }
    }


    .filter-container {
        display: inline-block;
        position: absolute;
        line-height: 32px;
        vertical-align: middle;
        padding: 7px 4px;
        top: -8px;
    }


    .advanced-block {
        margin-top: 8px;
        border-radius:8px;
        border-top-right-radius: unset;
        border:1px solid rgba(226,226,234,1);
        background: #FCF9FC;
        padding: 0 24px;
    }

    .filter-row {
        padding: 20px 0;
        border-bottom: dashed 1px #E2E2EA;
    }

    .last-row {
        margin: 20px 0;
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }

    .keep-one-line {
        display: flex;
        line-height: 32px;
    }

    .big-row-narrow {
        margin-right: 40px;
    }

    .displayFilterList {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        background: #FCF9FC;

        border-radius:8px;

        border:1px solid rgba(226,226,234,1);
        padding: 20px 24px;
    }

    .displayListEach {
        display: inline-block;
        background:rgba(255,255,255,1);
        border-radius:11px;
        border:1px solid rgba(226,226,234,1);

        padding-left: 12px;
        line-height: 24px;
        /*height: 26px;*/

        & > span {
            vertical-align: middle;
            font-size:12px;
            font-weight:300;
            color: #979497;
            line-height:24px;
        }

        .iconfont {
            cursor: pointer;
            color: #979497;
            vertical-align: middle;
        }
    }

    .reset-btn {
        display: inline-block;
        font-size:14px;
        font-family:SFUIDisplay-Light,SFUIDisplay;
        color:rgba(255,140,8,1);
        line-height:26px;
    }

    .action-list {
        display: flex;
        position: absolute;
        z-index: 2;
        width:296px;
        left: 176px;

        top: 50px;
        background:rgba(255,255,255,1);
        box-shadow:0px 0px 8px 0px rgba(181,181,190,0.24);
        border-radius:8px;
    }

    .parent-action-container {
        width:148px;
        border-right: 1px solid rgba(226,226,234,1);
    }

    .parent-action {
        cursor: pointer;
        font-size:14px;
        font-weight:300;
        color:rgba(68,68,79,1);

        line-height:24px;
        padding: 6px 6px 6px 16px;
        display: flex;
        justify-content: space-between;

        &:hover {
            background:rgba(250,250,251,1);
        }
    }

    .select-parent-action {
        color: rgba(255,141,10,1);
        background:rgba(255,246,236,1);
    }

    .sub-action {
        width: 148px;
        padding: 6px 16px;
        cursor: pointer;

        &:hover {
            background:rgba(250,250,251,1);
        }
    }

    .not-select-member {
        color:rgba(213,213,220,1);
    }

    .more-action {
        display: inline-block;
        vertical-align: middle;
        background: white;
        border-radius: 4px;

        border: 1px solid #dcdee2;
        height: 32px;
        line-height: 32px;
        padding: 0 4px 0 16px;
        cursor: pointer;

        &:hover {
            border:1px solid #FF8C08;
            color: #FF8C08;
        }
        &:hover > .iconTreeFold {
            cursor: pointer;
            color: #FF8C08;
        }
    }

    .action-background {
        position: fixed;
        overflow: auto;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
        background: rgba(79, 48, 14, 0.01);
    }

    .card-container {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;

        & > div {
            margin-right: 2.5%;
        }
    }

    .big-block-narrow {
        margin-top: 24px;
    }

    .middle-block-narrow {
        margin-top: 20px;
    }

    .input-separator {
        padding: 0 12px;
    }

    .frozen-desc {
        font-size:12px;
        font-weight:300;
        color:rgba(146,146,157,1);
        line-height:22px;
        word-break: break-all
    }

    .select-info-block {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        background:rgba(255,246,236,1);

        border-radius:4px;
        border:1px solid rgba(255,140,8,1);

        padding: 12px 16px;
        color:rgba(23,23,37,1);
        line-height:24px;
        vertical-align: middle;

        .iconInfo {
            vertical-align: middle;
            margin-right: 4px;
        }
    }

    .color-text {
        color:rgba(255,140,8,1);
    }
    .select-count {
        color:rgba(255,140,8,1);
        padding: 4px;
    }
</style>
