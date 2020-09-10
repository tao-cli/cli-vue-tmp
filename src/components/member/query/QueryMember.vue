<template>
    <div>
        <div class="search-container">
            <div ref="searchBlock" v-if="foldSearch" class="search-block">
                <div>
                    <div class="action-block">
                        <Button @click="openMemberPop" class="button-gap w90"  type="primary" >新增会员</Button>
                        <span @click="markMember" class="button-gap mark-btn">
                            <span>打标签</span>
                            <i  class="icon iconfont iconTreeFold"  title="更多" ></i>
                        </span>
                        <span class="more-action" @click="showActionList" >
                            <span>更多</span>
                            <i  class="icon iconfont iconTreeFold"  title="更多" ></i>
                        </span>

                        <div v-if="actionListStatus" class="action-list">
                            <ul class="parent-action-container">
                                <li v-for="(item, index) in memberActions"
                                    :class="{ 'select-parent-action': selectParentIndex === index }"
                                    @click="chooseSubAction(item, index)"
                                    :value="item.value" :key="index"
                                    class="parent-action">{{ item.label }}<i class="icon iconfont iconRight"  title="向右" ></i></li>
                            </ul>
                            <ul class="sub-action-container">
                                <li v-for="(item, index) in subAction"
                                    class="sub-action" :class="{ 'not-select-member': selectParentIndex === '' }"
                                    @click="operateSelectedMember(item.value)"
                                    :key="index">
                                    <span>{{ item.label }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div @click="showActionList" class="action-background" v-if="actionListStatus">
                    </div>

                    <div class="search-separate-line"></div>

                    <DatePicker type="daterange" placement="bottom-end"
                                class="component-narrow w260"
                                placeholder="开始时间 → 结束时间"
                                @on-change="handleTimePiker"
                                format="yyyy-MM-dd"
                                :value="[searchData.createTimeStart, searchData.createTimeEnd]"
                    ></DatePicker>
                </div>

                <div>
                    <i-input v-model="searchData.content" search
                             @on-search="searchList"
                             class="w240 identity-search button-gap"
                             placeholder="姓名/昵称/手机号/身份证/ID" >
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


                <!--                <div class="filter-btn">-->
                <!--                    <Button @click="filterList" class="button-gap w60" size="large" type="primary" >筛选</Button>-->
                <!--                    <Button @click="initSearch" class="button-gap w60" size="large" type="default" >重置</Button>-->

                <!--                </div>-->

            </div>

            <div v-if="advancedFilterStatus" class="advanced-block">
                <div class="filter-row">
                    <FilterTag :list="genderListFilter"
                               :filterName="'性别'"
                               @updateTag="updateGenderFilter" />
                </div>
                <div class="filter-row">
                    <span>成长值区间：</span>
                    <Input v-model="searchData.growthLimitStart"
                           class="w110"
                           placeholder="最低成长值" />
                    <span  class="input-separator">~</span>
                    <Input v-model="searchData.growthLimitEnd"
                           class="w110"
                           placeholder="最高成长值" />
                </div>

                <div v-if="memberLevelList.length !== 0" class="filter-row">
                    <FilterTag :list="memberLevelFilter"
                               :filterName="'会员等级'"
                               @updateTag="updateMemberFilter" />
                </div>
                <div class="filter-row">
                    <FilterTag :list="accountStatusList"
                               :filterName="'异常状态'"
                               @updateTag="updateAccountFilter" />
                    <FilterTag :list="registerChannelList"
                               :filterName="'注册渠道'"
                               @updateTag="updateRegisterChannel" />
                </div>

                <div class="last-row">
                    <Button @click="filterList"
                            class="button-gap w60"  type="primary" >筛选</Button>
                    <Button @click="toggleAdvancedFilter"
                            class="button-gap w60" type="default" >取消</Button>
                </div>
            </div>

            <div v-if="advancedFilterStatus" class="displayFilterList">
                <div v-if="displaySelectedGender.length > 0" class="displayListEach">
                    <span>性别：</span>
                    <span>{{ displaySelectedGender }}</span>
                    <i  class="icon iconfont iconClose"  title="删除"
                        @click="initGenderFilter"></i>
                </div>

                <div v-if="displaySelectedLevel.length > 0" class="displayListEach">
                    <span>会员等级：</span>
                    <span>{{ displaySelectedLevel }}</span>
                    <i  class="icon iconfont iconClose"  title="删除"
                        @click="initMemberLevelFilter"></i>
                </div>

                <div v-if="displayAccountStatus.length > 0" class="displayListEach">
                    <span>账号状态：</span>
                    <span>{{ displayAccountStatus }}</span>
                    <i  class="icon iconfont iconClose"  title="删除"
                        @click="initAccountFilter"></i>
                </div>

                <div v-if="displayRegisterChannel.length > 0" class="displayListEach">
                    <span>注册渠道：</span>
                    <span>{{ displayRegisterChannel }}</span>
                    <i  class="icon iconfont iconClose"  title="删除"
                        @click="initRegisterChannel"></i>
                </div>


                <div @click="initSearch"
                        class="reset-btn action-text"  >重置筛选项</div>
            </div>
        </div>

        <div v-if="countSelectMember !== 0" class="select-info-block">
            <div>
                <i  class="icon iconfont iconInfo color-text"  title="更多" ></i>
                <span>当前已选择</span>
                <span class="select-count">{{ countSelectMember }}</span>
                <span>项</span>
            </div>
            <span class="action-text" @click="clearSelect">清空</span>
        </div>

        <div class="card-container">
            <MemberCard class="big-block-narrow" :key="item.id"
                        v-for="(item) in list"
                        :unselectOutside="isUnselectOutside(item.id)"
                        :clearAll="clearAll"
                        :levelStatus="levelEnable"
                        @updateStatus="cellStatusChange"
                        @select-card="selectMember"
                        @unselect-card="unselectMember"
                        @action-cell="changeMemberInfo"
                        :memberInfo="item" />
        </div>

        <Page
                class="pagebox"
                :total="pageData.count"
                :current="pageData.page"
                :page-size="pageData.size"
                show-elevator
                show-total
                @on-change="onPageChange"
                @on-page-size-change="onPageSize"
        />

        <Modal
                v-model="accountStatusPop"
                title="账户状态调整"
                width="456"
                @on-ok="changeAccountStatus"
                @on-cancel="cancelAccountStatus">
            <div class="content">
                <Form :label-width="90">
                    <FormItem label="状态调整：">
                        <RadioGroup v-model="frozenAction">
                            <Radio label="1">冻结账户</Radio>
                            <Radio label="2">解冻账户</Radio>
                        </RadioGroup>
                        <div class="frozen-desc">账户冻结后，会员将无法登录公众号和小程序；解冻后恢复正常。</div>
                    </FormItem>
                </Form>
            </div>
        </Modal>

        <Modal
                v-model="memberPop"
                title="新增会员"
                width="456"
                @on-ok="addMember"
                @on-cancel="cancelAddMember">
            <div class="content">
                <Form ref="memberInfo"  :label-width="90" :model="memberForm"
                      :rules="memberModalValidate">
                    <FormItem label="手机号：" prop="phone">
                        <Input class="w280" placeholder="请输入会员手机号"
                               :maxlength="11"
                               v-model="memberForm.phone"  />
                    </FormItem>
                    <FormItem label="姓名：" prop="memberName">
                        <Input class="w280" placeholder="请输入会员姓名"
                               :maxlength="10"
                               v-model="memberForm.memberName"  />
                    </FormItem>
                    <FormItem label="性别：" prop="sex">
                        <Select v-model="memberForm.sex" placeholder="请选择性别"
                                class="w280">
                            <Option v-for="item in simpleGenderList"
                                    :value="item.value" :key="item.value">
                                {{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="出生日期：" prop="birthday">
                        <DatePicker type="date"  :value="memberForm.birthday"
                                    :options="timeOption"
                                    @on-change="handleTimePicker"
                                    format="yyyy-MM-dd"
                                    placeholder="请选择出生日期" class="w280"></DatePicker>
                    </FormItem>
                </Form>
            </div>
        </Modal>

        <Modal
                v-model="levelPop" footer-hide
                title="等级调整"
                width="456"
        >
            <div class="content">
                <Form ref="changeLevel"  :label-width="100" :model="levelForm"
                      :rules="levelModalValidate">
                    <FormItem label="等级变更：" prop="isChangeGrade">
                        <RadioGroup v-model="levelForm.isChangeGrade">
                            <Radio label="1">
                                <span>是</span>
                            </Radio>
                            <Radio label="2">
                                <span>否</span>
                            </Radio>
                        </RadioGroup>

                        <div v-if="levelForm.isChangeGrade === '1'">
                            <span class="button-gap">等级变更至</span>
                            <Select v-model="levelForm.levelId" placeholder="请选择等级"
                                    class="w120">
                                <Option v-for="item in memberLevelFilter"
                                        :value="item.value" :key="item.value">
                                    {{ item.label }}</Option>
                            </Select>
                        </div>
                        <div v-if="levelForm.isChangeGrade === '1'"
                             class="form-remind">若操作等级变更，该用户的成长值将更新为所选等级的门槛分值</div>
                    </FormItem>
                    <FormItem label="等级冻结：" prop="isFrozenLevel">
                        <RadioGroup v-model="levelForm.isFrozenLevel">
                            <Radio label="1">
                                <span>是</span>
                            </Radio>
                            <Radio label="0">
                                <span>否</span>
                            </Radio>
                        </RadioGroup>
                        <div class="form-remind">冻结后，该用户将永久保留当前等级</div>
                    </FormItem>
                    <FormItem label="备注：" prop="remark">
                        <Input v-model="levelForm.remark" type="textarea"
                               maxlength="100" show-word-limit
                               :rows="4"
                               placeholder="请填写备注" />
                    </FormItem>
                </Form>

                <div class="view-footer huge-block-narrow">
                    <Button @click="cancelAdjustLevel" class="text-narrow">取消</Button>
                    <Button @click="adjustLevel" type="primary" >确定</Button>
                </div>
            </div>
        </Modal>

        <Modal
                v-model="growthPop"
                title="成长值调整"
                width="456"
                footer-hide
        >
            <div class="content">
                <Form ref="changeLevel"  :label-width="100" :model="growthForm"
                      :rules="growthModalValidate">
                    <FormItem label="成长值：" prop="scoreValue">
                        <i-input v-model="growthForm.scoreValue"
                                 @on-keyup="allowInt('scoreValue')"
                                 placeholder="0">
                            <Select v-model="growthForm.isAdd" slot="prepend" style="width: 80px">
                                <Option value="1">增加</Option>
                                <Option value="-1">减少</Option>
                            </Select>
                        </i-input>
                    </FormItem>

                    <FormItem label="备注：" prop="remark">
                        <Input v-model="growthForm.remark" type="textarea"
                               maxlength="100" show-word-limit
                               :rows="4"
                               placeholder="请填写备注，不超过 100 字" />
                    </FormItem>
                </Form>

                <div class="view-footer huge-block-narrow">
                    <Button @click="cancelAdjustGrowth" class="text-narrow">取消</Button>
                    <Button @click="adjustGrowth" type="primary" >确定</Button>
                </div>
            </div>
        </Modal>

        <Modal
                v-model="pointPop"
                title="积分调整"
                width="456"
                footer-hide
        >
            <div class="content">
                <Form ref="changeLevel"  :label-width="100" :model="pointForm"
                      :rules="pointModalValidate">
                    <FormItem label="积分：" prop="scoreValue">
                        <i-input v-model="pointForm.scoreValue"
                                 @on-keyup="allowInt('scoreValue')"
                                 placeholder="0">
                            <Select v-model="pointForm.isAdd" slot="prepend" style="width: 80px">
                                <Option value="1">增加</Option>
                                <Option value="-1">减少</Option>
                            </Select>
                        </i-input>
                    </FormItem>

                    <FormItem label="备注：" prop="remark">
                        <Input v-model="pointForm.remark" type="textarea"
                               maxlength="100" show-word-limit
                               :rows="4"
                               placeholder="请填写备注，不超过 100 字" />
                    </FormItem>
                </Form>

                <div class="view-footer huge-block-narrow">
                    <Button @click="cancelAdjustPoint" class="text-narrow">取消</Button>
                    <Button @click="adjustPoint" type="primary" >确定</Button>
                </div>
            </div>
        </Modal>

    </div>
</template>

<script>
    import MemberCard from "./MemberCard";
    import FilterTag from "./FilterTag";
    import { log, formatNumber } from "@/utils/tools";

    export default {
        name: "QueryMember",
        props: {  },
        components: { MemberCard, FilterTag},
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
                searchData: {
                    createTimeStart: '',
                    createTimeEnd: '',
                    content: '',

                    scoreLimitStart: '',
                    scoreLimitEnd: '',
                    growthLimitStart: '',
                    growthLimitEnd: '',

                    levelIds: [],
                    registrationSource: [],
                    sex: '',
                    orgId: '',

                    status: '',
                    isFrozen: '',
                    isFrozenLevel: '',
                },
                pageData: {
                    page: 1,
                    size: 8,
                    count: 0,
                },

                list: [],
                selectList: [],
                genderList: [
                    {
                        value: '',
                        label: '全部'
                    },
                    {
                        value: 'M',
                        label: '男',
                    },
                    {
                        value: 'F',
                        label: '女',
                    },
                    {
                        value: 'N',
                        label: '未知',
                    },
                ],

                abnormalStatus: [],
                abnormalList: [
                    {
                        value: 'cancel',
                        label: '账户注销',
                    },
                    {
                        value: 'frozen',
                        label: '账户冻结',
                    },
                    {
                        value: 'level',
                        label: '等级冻结',
                    },
                ],

                registerList: [
                    {
                        value: '1',
                        label: '公众号注册'
                    },
                    {
                        value: '2',
                        label: '小程序注册'
                    },
                    {
                        value: '3',
                        label: '运营注册'
                    },
                    {
                        value: '4',
                        label: '人工导入'
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
                simpleGenderList: [
                    {
                        value: 'M',
                        label: '男',
                    },
                    {
                        value: 'F',
                        label: '女',
                    },
                    {
                        value: 'N',
                        label: '未知',
                    },
                ],

                actionListStatus: false,
                memberActions: [
                    {
                        value: 'point',
                        label: '积分调整',
                    },
                    {
                        value: 'growth',
                        label: '成长值调整',
                    },
                    {
                        value: 'level',
                        label: '等级调整',
                    },
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
                singleMember: '',
                // 选择卡片的类型： all 所有 single 操作当前卡片
                selectType: 'all',
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

                registerChannelList: [{
                    label: '全部',
                    value: '',
                    selected: true,
                    isAll: false,
                }, {
                    label: '公众号',
                    value: 1,
                    selected: false,
                    isAll: false,
                }, {
                    label: '小程序',
                    value: 2,
                    selected: false,
                    isAll: false,
                }, {
                    label: '运营',
                    value: 3,
                    selected: false,
                    isAll: false,
                },  {
                    label: '人工导入',
                    value: 4,
                    selected: false,
                    isAll: false,
                }, ],
                displayRegisterChannel: '',

                // 等级调整弹窗
                levelPop: false,
                levelForm: {
                    orgId: '',
                    isChangeGrade: '2',
                    levelId: '',
                    isFrozenLevel: '0',
                    remark: '',
                    memberIds: [],
                },
                tempChangeLevel: '',
                // 等级模式是否启用
                levelEnable: false,


                levelModalValidate: {
                    isChangeGrade: [
                        {
                            required: true,
                            message: "请选择是否变更等级",
                            trigger: 'blur',
                            type: 'string'
                        }
                    ],
                    isFrozenLevel: [
                        {
                            required: true,
                            message: "请选择是否冻结等级",
                            trigger: 'blur',
                            type: 'string'
                        }
                    ],
                    remark: [
                        {
                            required: true,
                            message: "请填写备注",
                            trigger: 'blur',
                            type: 'string'
                        }
                    ],
                },

                growthPop: false,
                growthForm: {
                    memberIds: '',
                    isAdd: '1',
                    scoreValue: '',
                    remark: '',
                },

                growthModalValidate: {
                    scoreValue: [
                        {
                            required: true,
                            message: "请选择填写成长值",
                            trigger: 'blur',
                            type: 'string'
                        }
                    ],
                    remark: [
                        {
                            required: true,
                            message: "请填写备注",
                            trigger: 'blur',
                            type: 'string'
                        }
                    ],
                },

                pointPop: false,
                pointForm: {
                    memberIds: '',
                    isAdd: '1',
                    scoreValue: '',
                    remark: '',
                },

                pointModalValidate: {
                    scoreValue: [
                        {
                            required: true,
                            message: "请选择填写积分",
                            trigger: 'blur',
                            type: 'string'
                        }
                    ],
                    remark: [
                        {
                            required: true,
                            message: "请填写备注",
                            trigger: 'blur',
                            type: 'string'
                        }
                    ],
                },
            }
        },
        computed: {
            countSelectMember() {
                return this.memberIds.length
            }
        },
        created() {
            this.initData()
            this.getLevelStatus()
            this.getMemberLevel()
            this.getList()
        },
        watch: {

        },
        mounted() {
            // this.adjustCardDisplay()
        },
        methods: {
            adjustCardDisplay() {
                let containerWidth = this.$refs.searchBlock.offsetWidth
                let base = Math.floor(containerWidth / 340)
                this.pageData.size = 2 * base

                this.getList()
            },
            initData() {
                let orgId = localStorage.orgId || 'AABBCCDDEEFFGGHH66'
                this.searchData.orgId = orgId
            },
            expandBlock(status) {
                this.foldSearch = status
            },
            createSelectedFilter(list) {
                let tempList = []
                let result = ''
                if (list.length > 0) {

                    list.forEach((item) => {
                        if( item.selected && (item.value !== '') ) {
                            tempList.push(item.value)
                        }
                    })
                    result = tempList.length > 0 ? tempList : ''
                }

                return result
            },
            isSelectTag(list, type) {
                let flag = this.$_.find(list, {
                    value: type,
                    selected: true,
                })

                return flag !== undefined
            },
            formatData() {
                let { page, size} = this.pageData
                let data = {
                    page,
                    size,
                    ...this.searchData
                }
                data.levelIds = this.createSelectedFilter(this.memberLevelFilter)
                data.sex = this.createSelectedFilter(this.genderListFilter)
                data.registrationSource = this.createSelectedFilter(this.registerChannelList)

                let frozenAccount = this.isSelectTag(this.accountStatusList, 'accountFrozen')
                if (frozenAccount) {
                    data.isFrozen = 1
                }

                let logoutAccount = this.isSelectTag(this.accountStatusList, 'logout')
                if (logoutAccount) {
                    data.status = 2
                }

                let levelFrozen = this.isSelectTag(this.accountStatusList, 'levelFrozen')
                if (levelFrozen) {
                    data.isFrozenLevel = 1
                }

                return data
            },
            searchList() {
                this.pageData.page = 1
                this.getList()
            },
            getList() {
                let server = '/member-server'
                let url = server + '/member/info/list'
                let data = this.formatData()
                // this.list = []
                this.$ajaxPost(url, data)
                    .then(res => {
                        if (res && res.code === 10000) {
                            let resData = res.data
                            this.list = resData.list || [];
                            this.pageData.count = resData.total || 0;
                        }
                        this.loading = false
                    })
                    .catch(err => {
                        log(err);
                    });
            },
            selectMember(member) {
                this.selectType = 'all'
                let current = this.selectList
                current.push(member)
                this.selectList = this.$_.uniqBy(current, 'id')
                this.updateMemberIds()
            },
            updateMemberIds() {
                let list = []
                this.selectList.forEach((item) => {
                    list.push(item.id)
                })
                this.memberIds = list
            },
            unselectMember(member) {
                let id = member.id
                let list = this.selectList
                this.$_.remove(list, (item) => {
                    return item.id === id
                })
                this.selectList = list
                this.updateMemberIds()
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
                    createTimeStart: startDate,
                    createTimeEnd: endDate,
                })
                this.getList()
            },
            changeMemberInfo(type, memberInfo) {
                this.currentActionMember = memberInfo
                this.selectType = 'single'
                this.singleMember = [ memberInfo.id ]
                // this.memberIds.push(memberInfo.id)

                let handlers = {
                    accountStatus: this.openAccountStatusPop,
                    cancel: this.openCancelPop,
                    logout: this.openLogoutPop,
                    detail: this.openDetailPage,
                }
                let fn = handlers[type]
                if (fn) {
                    fn()
                }
            },
            openDetailPage() {
                this.jumpMemberDetail()
            },
            openAccountStatusPop() {
                this.currentStatusType = 3
                this.accountStatusPop = true
            },
            openLogoutPop() {
                this.$Modal.confirm({
                    title: '账户登出',
                    content: '<p>账户登出将使所选用户在手机端重新登录，您是否确认账户登出？</p>',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        this.currentStatusType = 2
                        this.sendAccountRequest()
                    }
                });
            },
            openCancelPop() {
                this.$Modal.confirm({
                    title: '账户注销',
                    content: '<p>注销后账户将永久删除，用户无法再次登录，您是否确认注销？</p>',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        this.currentStatusType = 1
                        this.sendAccountRequest()
                    }
                });
            },
            sendAccountRequest() {
                let server = '/member-server'
                let url = server + '/member/info/status'
                let frozen = this.frozenAction === '1'

                if (this.currentStatusType !== 3) {
                    frozen = ''
                }

                let data = {
                    memberIds: this.memberIds,
                    statusType: this.currentStatusType,
                    is_frozen: frozen,
                }
                if (this.selectType === 'single') {
                    data.memberIds = this.singleMember
                }


                this.$ajaxPost(url, data)
                    .then(res => {
                        this.cancelAccountStatus()
                        if (res && res.code === 10000) {
                            this.$Message.success(res.message)
                            this.getList()
                        }
                    })
                    .catch(err => {
                        log(err);
                    });
            },
            changeAccountStatus() {
                this.sendAccountRequest()
            },
            cancelAccountStatus() {
                this.currentActionMember = ''
                this.currentStatusType = ''

                this.frozenAction = '1'
                this.initActionList()
            },
            initActionList() {
                this.actionListStatus = false
                this.selectParentIndex = ''
                this.batchActionType = ''

                if (this.memberIds.length > 0) {
                    this.clearSelect()
                }
            },
            addMember() {
                let server = '/member-server'
                let url = server + '/member/info/add'

                let data = {
                    orgId: this.searchData.orgId,
                    ...this.memberForm,
                }

                this.$ajaxPost(url, data)
                    .then(res => {
                        this.initMemberForm()
                        if (res && res.code === 10000) {
                            this.$Message.success(res.message)
                            this.getList()
                        }
                    })
                    .catch(err => {
                        log(err);
                    });
            },
            initMemberForm() {
                this.memberForm = {
                    phone: '',
                    memberName: '',
                    sex: '',
                    birthday: '',
                }
            },
            cancelAddMember() {
                this.initMemberForm()
            },
            openMemberPop() {
                this.memberPop = true
            },
            handleTimePicker(val) {
                this.memberForm.birthday = val
            },
            markMember() {
                this.$Message.info('功能暂未开放')
            },
            chooseSubAction(item, index) {
                this.batchActionType = item.value
                this.selectParentIndex = index

                // 关闭等级模式时不显示弹窗
                let isLevelItem = item.value === 'level'
                if (isLevelItem && !this.levelEnable) {
                    this.$Message.error('等级模式已停用，不能调整等级')
                }
            },
            createOptionalUser() {
                let tempList = []
                this.list.forEach((item) => {
                    if (item.status !== 2) {
                        tempList.push(item.id)
                    }
                })

                this.memberIds = tempList
            },
            operateSelectedMember(type) {
                if (type === 'filter') {
                    this.createOptionalUser()
                } else {
                    let notSelectUser = this.memberIds.length === 0
                    if (notSelectUser) {
                        this.$Message.error('请选择用户')
                        this.initActionList()
                        return
                    }
                }

                let handlers = {
                    point: () => {
                        this.openPointPop()
                    },
                    growth: () => {
                        this.openGrowthPop()
                    },
                    cancel: () => {
                        this.currentStatusType = 1
                        this.openCancelPop()
                    },
                    status: () => {
                        this.currentStatusType = 3
                        this.openAccountStatusPop()
                    },
                    logout: () => {
                        this.currentStatusType = 2
                        this.openLogoutPop()
                    },
                    level: () => {
                        if(this.levelEnable) {
                            this.openLevelPop()
                        }
                    }
                }

                let fn = handlers[this.batchActionType]
                fn()
            },
            showActionList() {
                let isOpen = this.actionListStatus
                if (isOpen) {
                    this.selectParentIndex = ''
                    this.batchActionType = ''
                }
                this.actionListStatus = !this.actionListStatus
            },
            isUnselectOutside(currentId) {
                if (this.memberIds.length > 0) {
                    if(this.memberIds.includes(currentId) && this.clearAll) {
                        return true
                    }
                }
                return false
            },
            // 清空已选中
            clearSelect() {
                this.clearAll = true
            },
            cellStatusChange(memberInfo) {
                this.unselectMember(memberInfo)
                if (this.memberIds.length === 0) {
                    this.clearAll = false
                }

            },
            initSearch() {
                let orgId = this.searchData.orgId
                this.searchData = {
                    createTimeStart: '',
                    createTimeEnd: '',
                    content: '',

                    scoreLimitStart: '',
                    scoreLimitEnd: '',
                    growthLimitStart: '',
                    growthLimitEnd: '',

                    levelIds: [],
                    registrationSource: [],
                    sex: '',
                    orgId: orgId,

                    status: '',
                    isFrozen: '',
                    isFrozenLevel: '',
                }

                this.pageData = {
                    page: 1,
                    size: 8,
                    count: 0,
                }

                this.abnormalStatus = ''
                this.initGenderFilter()
                this.initMemberLevelFilter()
                this.initAccountFilter()
                this.initRegisterChannel()

                this.getList()
            },
            filterList() {
                this.pageData.page = 1
                this.getList()
            },
            closeDetailPage() {
                this.showCardList = true
            },
            updateGenderFilter(updateList) {
                this.genderListFilter = updateList
                let previewList = this.createPreviewText(updateList)
                this.displaySelectedGender = previewList.join('；')
            },
            createPreviewText(updateList) {
                let tempList = []
                updateList.forEach((item) => {
                    if (item.selected && item.value !== '') {
                        tempList.push(item.label)
                    }
                })
                return tempList
            },
            updateMemberFilter(updateList) {
                this.memberLevelFilter = updateList
                let previewList = this.createPreviewText(updateList)
                this.displaySelectedLevel = previewList.join('；')
            },
            createLevelName(levelId) {
                return `${levelId.slice(0, 2).toUpperCase()} ${levelId.slice(2)}`
            },
            createLevelFilter() {
                let tempList = []
                this.memberLevelList.forEach((item) => {
                    let { levelId } = item

                    let formatName = this.createLevelName(levelId)
                    let formatItem = {
                        label: formatName,
                        value: levelId,
                        selected: false,
                        isAll: false,
                    }
                    tempList.push(formatItem)
                })

                this.memberLevelFilter = tempList
            },
            getMemberLevel() {
                let server = '/grade-server'
                let url = server + '/api/level/list'
                let data = {
                    orgId:  this.searchData.orgId
                }
                this.list = []
                this.$ajaxGet(url, data)
                    .then(res => {
                        if (res && res.code === 10000) {
                            let resData = res.data
                            this.memberLevelList = resData || [];
                            this.createLevelFilter()
                        }
                    })
                    .catch(err => {
                        log(err);
                    });
            },
            getLevelStatus() {
                let server = '/grade-server'
                let url = server + '/api/grade/isEnable'
                let data = {
                    orgId:  this.searchData.orgId
                }
                this.list = []
                this.$ajaxGet(url, data)
                    .then(res => {
                        if (res && res.code === 10000) {
                            let resData = res.data
                            // 1停用 2启用
                            this.levelEnable = resData === 2
                        }
                    })
                    .catch(err => {
                        log(err);
                    });
            },
            updateAccountFilter(updateList) {
                this.accountStatusList = updateList
                let previewList = this.createPreviewText(updateList)
                this.displayAccountStatus = previewList.join('；')
            },
            updateRegisterChannel(updateList) {
                this.registerChannelList = updateList
                let previewList = this.createPreviewText(updateList)
                this.displayRegisterChannel = previewList.join('；')
            },
            toggleAdvancedFilter() {
                let currentStatus = this.advancedFilterStatus
                this.advancedFilterStatus = !currentStatus
            },
            initSelectFilter(list) {
                let tempList = this.$_.clone(list)
                tempList.map((item) => {
                    if (item.value === '') {
                        item.selected = true
                        item.isAll = true
                    } else {
                        item.selected = false
                    }
                })
                return tempList
            },
            initGenderFilter() {
                let list = this.initSelectFilter(this.genderListFilter)
                this.genderListFilter = list
                this.displaySelectedGender = ''
            },
            initMemberLevelFilter() {
                let list = this.initSelectFilter(this.memberLevelFilter)
                this.memberLevelFilter = list
                this.displaySelectedLevel = ''
            },
            initAccountFilter() {
                let list = this.initSelectFilter(this.accountStatusList)
                this.accountStatusList = list
                this.displayAccountStatus = ''
            },
            initRegisterChannel() {
                let list = this.initSelectFilter(this.registerChannelList)
                this.registerChannelList = list
                this.displayRegisterChannel = ''
            },
            openLevelPop() {
                this.levelPop = true
            },
            closeLevelPop() {
                this.levelPop = false
            },
            validateLevelForm() {
                let { isChangeGrade, isFrozenLevel, remark, levelId} = this.levelForm

                if (isChangeGrade === ''){
                    this.$Message.error('操作失败，您还未选择等级变更！')
                    return true
                }

                if ((levelId === '') && (isChangeGrade === '1')) {
                    this.$Message.error('操作失败，您还未选择变更等级！')
                    return true
                }

                if (isFrozenLevel === '') {
                    this.$Message.error('操作失败，您还未选择等级冻结！')
                    return true
                }

                if (remark === '') {
                    this.$Message.error('操作失败，您还未填写备注！')
                    return true
                }

                return false
            },
            adjustLevel() {
                let server = '/member-server'
                let url = server + '/member/info/grade/edit'

                let notPass = this.validateLevelForm()
                if (notPass) {
                    return
                }

                this.closeLevelPop()
                let data = {
                    ...this.levelForm,
                    orgId: this.searchData.orgId,
                    memberIds: this.memberIds
                }
                let { isChangeGrade, isFrozenLevel} = this.levelForm
                data.isChangeGrade = isChangeGrade === '1'
                data.isFrozenLevel = isFrozenLevel === '1'

                this.$ajaxPost(url, data)
                    .then(res => {
                        this.initLevelForm()
                        this.initActionList()
                        if (res && res.code === 10000) {
                            this.$Message.success(res.message)
                            this.getList()
                        }
                    })
                    .catch(err => {
                        log(err);
                    });
            },
            cancelAdjustLevel() {
                this.initLevelForm()
                this.closeLevelPop()
            },
            initLevelForm() {
                this.levelForm = {
                    isChangeGrade: '2',
                    level: '',
                    isFrozenLevel: '0',
                    remark: '',
                }
            },
            jumpMemberDetail() {
                let memberId = this.currentActionMember.id
                this.$router.push({
                    path:"/member/manage/details",
                    query: {
                        id : memberId ,
                    }})
            },
            initialGrowthForm() {
                this.growthForm = {
                    memberIds: '',
                    isAdd: '1',
                    scoreValue: '',
                    remark: '',
                }
            },
            validateGrowth() {
                let { scoreValue, remark} = this.growthForm

                if (scoreValue === '') {
                    this.$Message.error('操作失败，您还未填写成长值！')
                    return true
                }

                if (remark === '') {
                    this.$Message.error('操作失败，您还未填写备注！')
                    return true
                }

                return false
            },
            adjustGrowth() {
                let server = '/member-server'
                let url = server + '/member/info/growth/edit'

                let data = {
                    ...this.growthForm,
                    orgId: this.searchData.orgId,
                    memberIds: this.memberIds
                }


                let notPass = this.validateGrowth()
                if (notPass) {
                    return
                }

                this.growthPop = false
                this.$ajaxPost(url, data)
                    .then(res => {
                        this.initialGrowthForm()
                        this.initActionList()
                        if (res && res.code === 10000) {
                            this.$Message.success(res.message)
                            this.getList()
                        }
                    })
                    .catch(err => {
                        log(err);
                    });
            },

            cancelAdjustGrowth() {
                this.growthPop = false
                this.initialGrowthForm()
            },
            allowInt(key) {
                let currentValue = this.growthForm[key]
                let temp
                if (currentValue.length === 1) {
                    temp = currentValue.replace(/[^1-9]/g, '')
                } else {
                    temp = currentValue.replace(/\D/g, '')
                }

                let big = Number(temp) >= Math.pow(10, 7)
                if (big) {
                    temp = Math.pow(10, 7) - 1
                }

                this.growthForm[key] = formatNumber(String(temp), 0)
            },
            openGrowthPop() {
                this.growthPop = true
            },
            openPointPop() {
                this.pointPop = true
            },
            cancelAdjustPoint() {
                this.pointPop = false
                this.initialGrowthForm()
            },
            initialPointForm() {
                this.pointForm = {
                    memberIds: '',
                    isAdd: '1',
                    scoreValue: '',
                    remark: '',
                }
            },
            validatePoint() {
                let { scoreValue, remark} = this.pointForm

                if (scoreValue === '') {
                    this.$Message.error('操作失败，您还未填写成长值！')
                    return true
                }

                if (remark === '') {
                    this.$Message.error('操作失败，您还未填写备注！')
                    return true
                }

                return false
            },
            adjustPoint() {
                let server = '/member-server'
                let url = server + '/member/info/points/edit'

                let data = {
                    ...this.pointForm,
                    orgId: this.searchData.orgId,
                    memberIds: this.memberIds
                }


                let notPass = this.validatePoint()
                if (notPass) {
                    return
                }

                this.pointPop = false
                this.$ajaxPost(url, data)
                    .then(res => {
                        this.initialPointForm()
                        this.initActionList()
                        if (res && res.code === 10000) {
                            this.$Message.success(res.message)
                            this.getList()
                        }
                    })
                    .catch(err => {
                        log(err);
                    });
            },
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
        list-style-type: none;
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

    .sub-action-container {
        list-style-type: none;
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
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: 400px;
        column-gap: 20px;
    }

    .big-block-narrow {
        margin-bottom: 24px;
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

    .form-remind {
        margin-top: 4px;
        font-size:12px;
        font-weight:300;
        color:rgba(146,146,157,1);
        line-height:22px;
    }

    .view-footer {
        display: flex;
        justify-content: flex-end;
        border-top: 1px solid #e8eaec;
        padding: 12px 16px 12px 0;

        .text-narrow {
            margin-right: 16px;
        }
    }


    .huge-block-narrow {
        margin-top: 40px;
    }
</style>