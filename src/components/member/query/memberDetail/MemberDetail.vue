<template>
    <div class="member-detail">
        <h2 class="page-title"  >
            <span @click="backListPage"><i  class="icon iconfont iconBack" title="返回" ></i></span>
            <span @click="backListPage">会员详情</span>
        </h2>
        <Row>
            <i-col span="8" class="left-col">
                <div class="user-info">
                    <div class="user-photo-container" :class="{ 'user-frozen': userInfo.isFrozen }">
                        <img class="user-photo" :src="userInfo.headImg || defaultPhoto" alt="用户头像" />
                        <span class="edit-icon">
                            <i  @click="openBasicInfoPop" class="icon iconfont iconEdit" title="编辑" ></i></span>
                        <div class="frozen-tag" v-if="userInfo.isFrozen">冻结</div>

                    </div>

                    <div class="info-container">
                        <div class="brief-info">
                            <div class="user-name"
                                 :class="{ 'frozen-user-name': userInfo.isFrozen }">{{ userInfo.memberName }}</div>
                            <div v-if="userInfo.lastLoginTime !== ''" class="active-time">
                                <span>最近活跃于</span>
                                <span>{{ dateParser(userInfo.lastLoginTime) }}</span>
                            </div>
                            <div v-else class="active-time">
                                <span>该用户尚未登陆</span>
                            </div>

                            <div class="property-list middle-block-narrow">
                                <div class="property-cell">
                                    <div class="property-name">成长值</div>
                                    <div @click="openGrowthPage"
                                         class="property-value color-text">{{ userInfo.growthBalance }}</div>
                                </div>
                                <div class="separation-line"></div>
                                <div>
                                    <div class="property-name">积分</div>
                                    <!--                <div v-if="cardStatus !== 'cancel'" class="property-value edit-cell">-->
                                    <!--                    <span class="point-value">{{ memberInfo.pointBalance }}</span>-->
                                    <!--                    <i  class="icon iconfont iconEdit" title="编辑" ></i>-->
                                    <!--                </div>-->
                                    <div @click="openPointPage" class="property-value color-text">
                                        <span>{{ userInfo.pointBalance }}</span>
                                    </div>
                                </div>
                                <div v-if="hasVipLevel" class="separation-line"></div>
                                <div  v-if="hasVipLevel">
                                    <div class="property-name">
                                        <span>等级</span>
                                        <i v-if="userInfo.isFrozenLevel" class="icon iconfont iconLocked" title="保级" ></i>
                                    </div>
                                    <div class="property-value" :class="{'grey-text': userInfo.isFrozenLevel }">
                                        <span>{{ createLevelName() }}</span>

                                    </div>
                                </div>
                            </div>


                            <div class="vip-icon-container big-block-narrow">
                                <div v-if="false" class="vip-icon-list">
                                    <img class="vip-icon" :src="superVipIcon" alt="会员图标" />
                                </div>
                                <div v-else class="none-member">
                                    <img  :src="notMemberText" alt="非付费会员" />
                                </div>
                            </div>

                        </div>

                        <ul class="personal-info">
                            <li class="info-row">
                                <i-col span="12" >
                                    <div class="info-name">昵称</div>
                                    <div class="info-value">{{ userInfo.nickName || '-' }}</div>
                                </i-col>
                                <i-col span="12" class="info-value">
                                    <div class="info-name">手机号</div>
                                    <div class="info-value">{{ userInfo.phone }}</div>
                                </i-col>
                            </li>
                            <li class="info-row">
                                <i-col span="12" >
                                    <div class="info-name">出生日期</div>
                                    <div class="info-value">{{ userInfo.birthday || '-' }}</div>
                                </i-col>
                                <i-col span="12" class="info-value">
                                    <div class="info-name">年龄</div>
                                    <div class="info-value">{{ userInfo.age || '-' }}</div>
                                </i-col>
                            </li>
                            <li class="info-row">
                                <i-col span="12" >
                                    <div class="info-name">性别</div>
                                    <div class="info-value">{{ createGenderText(userInfo.sex) }}</div>
                                </i-col>
                                <i-col span="12" class="info-value">
                                    <div class="info-name">婚姻状况</div>
                                    <div class="info-value">{{ createMarriageText(userInfo.maritalStatus) }}</div>
                                </i-col>
                            </li>
                            <li class="info-row">
                                <i-col span="12" >
                                    <div class="info-name">证件类型</div>
                                    <div class="info-value">{{ createPaperText(userInfo.papersType) }}</div>
                                </i-col>
                                <i-col span="12" class="info-value">
                                    <div class="info-name">证件号</div>
                                    <div class="info-value">{{ userInfo.papersNo || '-'}}</div>
                                </i-col>
                            </li>
                        </ul>

                        <footer class="middle-block-narrow">
                            <div class="origin-info">ID：{{ userInfo.id }}</div>
                            <div class="origin-info">注册于 {{ dateParser(userInfo.createTime) }}</div>
                        </footer>
                    </div>
                </div>

                <div class="address-container big-block-narrow">
                    <div class="card-title">
                        <span>收货地址</span>
                        <span>
                            <Tooltip placement="top" :content="addressRemainText()">
                                <i @click="openAddressPop('add')" class="icon iconfont iconAdd" title="增加" ></i>
                            </Tooltip>
                        </span>
                    </div>
                    <div class="address-info" v-for="(item, index) in displayAddressList"
                         :key="index">
                        <div class="default-address" v-if="item.isDefault">[默认地址]</div>
                        <div class="address-order" v-else>地址 {{ item.order }}</div>

                        <div>
                            <span class="icon-space">
                                <i class="icon iconfont iconAddress" title="地址" ></i>
                            </span>
                            <span class="address-text">{{ item.province + item.city + item.county }}</span>
                        </div>
                        <div >

                            <span class="icon-space"></span>
                            <span class="address-text">{{ item.detailed }}</span>

                        </div>
                        <div class="receiver-action">
                            <div>
                                <span class="icon-space">
                                <i class="icon iconfont iconName" title="姓名" ></i>
                            </span>
                                <span class="address-text text-ellipsis">{{ item.receiver }}（{{ item.receiverPhone }}）</span>
                            </div>

                            <div class="modify-address">
                                <Poptip
                                    confirm
                                    title="删除后不可恢复，是否确认删除该地址？"
                                    @on-ok="deleteAddress(item.id)"
                                >
                                    <i  class="icon iconfont iconRemove" title="删除" ></i>
                                </Poptip>

                                <i class="icon iconfont iconEdit" title="编辑"
                                   @click="openAddressPop('edit', item)"
                                ></i>
                            </div>
                        </div>

                    </div>

                    <div class="page-dot-container">
                        <div v-for="(item, index) in addressPageList"
                             :key="index"
                             @click="changeDisplayAddress(item.page, index)"
                             :class="targetPageIndex === index ? 'active-dot' : 'default-dot'"
                             class="page-dot"></div>
                    </div>
                </div>

                <Modal
                        v-model="showAddressPop"
                        :title="createAddressPopTitle()"
                        width="456"
                        footer-hide
                >
                    <div class="content">
                        <Form ref="memberInfo"  :label-width="100" :model="addressForm"
                              :rules="addressModalValidate">
                            <FormItem label="收货地址：" prop="districtList">
<!--                                <al-cascader class="w280"-->
<!--                                             v-model="districtList"-->
<!--                                             @on-change="chooseProvinceCity"-->
<!--                                             :level="2"/>-->
                                <Cascader class="w280" placeholder="请选择省 / 市 / 区" :data="provinceCityList"
                                          @on-change="chooseProvinceCity"
                                          v-model="addressForm.districtList"></Cascader>
                            </FormItem>
                            <FormItem label="" prop="detailed">
                                <Input class="w280" placeholder="请输入详细地址" :maxlength="80"
                                       v-model="addressForm.detailed"  />
                            </FormItem>

                            <FormItem label="收货人：" prop="receiver">
                                <Input class="w280" placeholder="请输入收货人姓名"
                                       :maxlength="10"
                                       v-model="addressForm.receiver"  />
                            </FormItem>
                            <FormItem label="联系方式：" prop="receiverPhone">
                                <Input class="w280" placeholder="请输入收货人联系方式"
                                       :len="11"
                                       v-model="addressForm.receiverPhone"  />
                            </FormItem>

                            <FormItem label="默认地址：">
                                <RadioGroup v-model="defaultAddress">
                                    <Radio label="1">是</Radio>
                                    <Radio label="2">否</Radio>
                                </RadioGroup>
                            </FormItem>
                        </Form>
                        <div slot="footer" class="modal-footer">
                            <Button type="default" size="large"  class="w60 btn-gap"  @click="cancelAddAddress">取消</Button>
                            <Button type="primary" size="large"  class="w60" @click="confirmAddress">确认</Button>
                        </div>
                    </div>
                </Modal>

                <Modal
                        v-model="showBasicInfoPop"
                        title="编辑基本信息"
                        width="456"
                        footer-hide
                       >
                    <div class="content">
                        <Form ref="basicInfo"  :label-width="100" :model="basicInfoForm"
                              :rules="basicInfoValidate">
                            <FormItem label="手机号：" prop="phone">
                                <Input class="w280" placeholder="手机号：" :maxlength="11"
                                       v-model="basicInfoForm.phone"  />
                                <div class="phone-remind">修改后将改变用户登录账号，请谨慎修改。</div>
                            </FormItem>
                            <FormItem label="姓名：" prop="memberName">
                                <Input class="w280" placeholder="请输入姓名"
                                       v-model="basicInfoForm.memberName"  />
                            </FormItem>

                            <FormItem label="证件号码：" prop="papersNo">
                                <i-input class="w280" placeholder="请输入证件号码"
                                         v-model="basicInfoForm.papersNo">
                                    <Select v-model="basicInfoForm.papersTypeInt" slot="prepend" style="width: 90px">
                                        <Option :value="1">身份证</Option>
                                        <Option :value="2">护照</Option>
                                        <Option :value="3">通行证</Option>
                                    </Select>
                                </i-input>
                            </FormItem>

                            <FormItem label="性别：" prop="sex">
                                <Select v-model="basicInfoForm.sex"
                                        class="w280">
                                    <Option value="M">男</Option>
                                    <Option value="F">女</Option>
                                </Select>
                            </FormItem>

                            <FormItem label="出生日期：" prop="birthday">
                                <DatePicker type="date"  :value="basicInfoForm.birthday"
                                            :options="timeOption"
                                            @on-change="handleTimePicker"
                                            format="yyyy-MM-dd"
                                            placeholder="请选择出生日期" class="w280"></DatePicker>
                            </FormItem>


                            <FormItem label="年龄：" prop="age">
                                <Input class="w280" placeholder="请输入年龄"
                                       v-model="basicInfoForm.age"  />
                            </FormItem>

                            <FormItem label="婚姻状况：" prop="maritalStatus">
                                <Select v-model="basicInfoForm.maritalStatus" placeholder="请选择婚姻状况"
                                        class="w280">
                                    <Option :value="1">已婚</Option>
                                    <Option :value="0">未婚</Option>
                                </Select>
                            </FormItem>

                        </Form>
                        <div slot="footer" class="modal-footer">
                            <Button type="default" size="large"  class="w60 btn-gap"  @click="cancelBasicInfo">取消</Button>
                            <Button type="primary" size="large"  class="w60" @click="addBasicInfo">确认</Button>
                        </div>
                    </div>
                </Modal>
            </i-col>
            <i-col span="16" class="right-box">
<!--                <header class="block-name">用户旅程</header>-->

                <Tabs type="card" v-model="selectedTab">
                    <TabPane v-for="tab in memberTabs" :key="tab.value"
                             :name="tab.value"
                             :label="tab.label">

                    </TabPane>
                </Tabs>

                <keep-alive>
                    <component v-bind:is="currentTabComponent" :memberId="memberId"></component>
                    <!--                        <UserTravel :memberId="memberId"/>-->
                </keep-alive>
            </i-col>
        </Row>

    </div>
</template>

<script>
    import { log, dateParser, getIdentityInfo } from "@/utils/tools";
    // import { provinceCityList } from '@/utils/provinceCityList';
    import UserTravel from "./userTravel/UserTravel";
    import OrderRecord from "./orderRecord/OrderRecord";
    import IdentityRecord from "./identityRecord/IdentityRecord";
    import PointRecord from "./pointRecord/PointRecord";

    import defaultPhoto from "@/assets/images/member/default_member_photo.png"

    import superVipIcon from "@/assets/images/member/super_vip_icon.png";
    import notMemberText from "@/assets/images/member/not_member_text.png";

    export default {
        name: "MemberDetail",
        components: {
            UserTravel,
            OrderRecord,
            IdentityRecord,
            PointRecord,
        },
        data() {
            return {
                memberId: '',
                timeOption:{
                    disabledDate (date) {
                        // 禁用过去的时间
                        return date && date.valueOf() > Date.now() - 86400000;
                    }
                },
                defaultPhoto: defaultPhoto,
                superVipIcon: superVipIcon,
                notMemberText: notMemberText,




                userInfo: {
                    id: '',
                    authenStatus: '',
                    birthday: '',
                    createTime: '',
                    modifyTime: '',

                    growthBalance: '',
                    isFrozen: '',
                    isFrozenLevel: '',

                    isPerfect: '',
                    memberName: '',
                    organizationId: '',
                    phone: '',

                    pointBalance: '',
                    sourceCode: '',
                    status: '',
                    virtualPhone: '',

                    levelName: '',
                    lastLoginTime: '',
                    papersType: '',
                    papersNo: '',
                    levelId: '',

                    payMember: '',
                    nickName: '',
                    age: '',
                    sex: '',

                    headImg: '',
                },

                showBasicInfoPop: false,
                basicInfoForm: {
                    id: '',
                    memberName: '',
                    sex: '',
                    papersTypeInt: 1,
                    papersNo: '',

                    birthday: '',
                    age: '',
                    phone: '',
                    maritalStatus: '',
                },
                basicInfoValidate: {
                    phone: [
                        {
                            required: true,
                            message: "请输入手机号",
                            trigger: 'blur',
                            type: 'string'
                        },
                    ],
                    papersNo: {
                        type: "string",
                        trigger: 'blur',
                        asyncValidator: (rule, value) => {
                            return new Promise((resolve, reject) => {
                                let reg = /^[1-8][0-9]{5}(19|20)\d{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;
                                let identity = this.basicInfoForm.papersTypeInt === 1
                                if (identity && !reg.test(value)) {
                                    reject('证件号')
                                } else {
                                    this.autoFillInfo(value)
                                    resolve();
                                }
                            });
                        },
                        message: "请输入正确的证件号",
                    }
                },

                addressList: [],
                orderAddressList: [],
                displayAddressList: [],
                addressPageList: [],
                addressLimit: 18,

                targetPageIndex: 0,
                deleteAddressId: '',
                showAddressPop: false,
                districtList: [],

                addressPopType: 'add',
                currentAddressInfo: '',
                addressForm: {
                    province: '',
                    city: '',
                    county: '',
                    detailed: '',

                    receiver: '',
                    receiverPhone: '',
                    isDefault: '',
                    districtList: []
                },
                defaultAddress: '1',

                phoneReg: /^1[3456789]\d{9}$/,
                addressModalValidate: {
                    districtList: [
                        {
                            required: true,
                            message: "请选择省/市/区",
                            trigger: 'change',
                            type: 'array'
                        },
                    ],
                    detailed: [
                        {
                            required: true,
                            message: "请输入收货地址",
                            trigger: 'blur',
                            type: 'string'
                        },
                    ],
                    receiver: [
                        {
                            required: true,
                            message: "请输入收货人姓名",
                            trigger: 'blur',
                            type: 'string'
                        },
                    ],
                    receiverPhone: [
                        {
                            required: true,
                            message: "请输入收货人联系方式",
                            trigger: 'blur',
                            type: 'string'
                        },
                        {
                            type: "string",
                            trigger: 'blur',
                            asyncValidator: (rule, value) => {
                                return new Promise((resolve, reject) => {
                                    let reg = this.phoneReg
                                    if (!reg.test(value)) {
                                        reject('证件号')
                                    } else {
                                        resolve();
                                    }
                                });
                            },
                            message: "请输入正确的联系方式",
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
                maritalStatusList: [
                    {
                        value: 0,
                        label: '未婚',
                    },
                    {
                        value: 1,
                        label: '已婚',
                    },
                    {
                        value: 2,
                        label: '离异',
                    },
                ],

                paperTypeList: [
                    {
                        value: 1,
                        label: '身份证',
                    },
                    {
                        value: 2,
                        label: '护照',
                    },
                    {
                        value: 3,
                        label: '通行证',
                    },
                ],

                memberTabs: [
                    {
                        label: '用户旅程',
                        value: 'userTravel',
                    },
                    {
                        label: '积分记录',
                        value: 'points',
                    },
                    {
                        label: '订单记录',
                        value: 'order',
                    },
                    {
                        label: '身份记录',
                        value: 'identity',
                    },
                ],
                selectedTab: 'points',
            }
        },
        computed: {
            hasVipLevel() {
                return this.userInfo.levelId !== '-1'
            },
            provinceCityList() {
                return this.$store.getters.cascadeCitys
            },
            isPayMember() {
                return this.userInfo.payMember !== '-1'
            },
            currentTabComponent() {
                let tabList = {
                    userTravel: 'UserTravel',
                    order: 'OrderRecord',
                    identity: 'IdentityRecord',
                    points: 'PointRecord',
                }
                return tabList[this.selectedTab]
            }
        },
        created() {
            this.initData()
            this.getMemberDetail()
        },
        methods: {
            dateParser(date) {
                return dateParser(date)
            },
            initData() {
                this.memberId = this.$route.query.id
            },
            createGenderText(type) {
                let item = this.$_.find(this.simpleGenderList, { value: type })
                if (item === undefined) {
                    return '-'
                }
                return item.label
            },
            createMarriageText(type) {
                let item = this.$_.find(this.maritalStatusList, { value: type })
                if (item === undefined) {
                    return '-'
                }
                return item.label
            },
            // 证件类型
            createPaperText(type) {
                let item = this.$_.find(this.paperTypeList, { value: type })
                if (item === undefined) {
                    return '-'
                }
                return item.label
            },
            getMemberDetail() {
                let data = {
                    memberId: this.memberId,
                }

                let server = '/member-server'
                let url = server + '/member/info/detail'

                this.$ajaxGet(url, data)
                    .then(res=>{
                        if(res&&res.code === 10000){
                            let resData = res.data
                            let { birthday } = resData


                            Object.assign(this.userInfo, resData)
                            this.userInfo.birthday = (birthday === undefined) ? '' : dateParser(birthday, 'YYYY-MM-DD')

                            this.addressList = resData.memberAddressDoList
                            this.createAddressPage()
                            this.orderAddressData()
                        }
                    })
                    .catch(err=>{
                        log(err);
                    })
            },
            chooseProvinceCity(value, selectedData) {
                let [ provinceName, cityName, countyName ] = value
                let [ provinceItem, cityItem, countyItem ] = selectedData

                if (value.length > 0) {
                    Object.assign(this.addressForm, {
                        province: provinceName,
                        city: cityName,
                        county: countyName,
                        provinceCode: provinceItem.code,
                        cityCode: cityItem.code,
                        countyCode: countyItem.code,
                    })
                } else {
                    Object.assign(this.addressForm, {
                        province: '',
                        city: '',
                        county: '',
                        provinceCode: '',
                        cityCode: '',
                        countyCode: '',
                    })
                }
            },
            createAddressPage() {
                let filterPage = 3
                let length = this.addressList.length
                let pageLength = Math.ceil(length / filterPage)

                let tempList = []
                for(let i = 0; i < pageLength; i++) {
                    let page = i * 3
                    let item = {
                        page: page,
                        active: i === 0,
                    }
                    tempList.push(item)
                }

                this.addressPageList = tempList
            },
            changeDisplayAddress(page, index) {
                this.displayAddressList = this.orderAddressList.slice(page, page + 3)
                this.targetPageIndex = index
            },
            orderAddressData() {
                let defaultAddress = ''
                let tempList = []
                let hasDefaultAddress = this.$_.find(this.addressList, { isDefault: true })

                let order = hasDefaultAddress ? 2 : 1
                this.addressList.forEach((item) => {
                    if (item.isDefault) {
                        defaultAddress = {
                            ...item,
                            order: 0,
                        }
                    } else {
                        let name = {
                            ...item,
                            order: order,
                        }
                        order++
                        tempList.push(name)
                    }
                })

                if (defaultAddress !== '') {
                    tempList.unshift(defaultAddress)
                }

                this.orderAddressList = tempList
                this.displayAddressList = this.orderAddressList.slice(0, 3)
            },
            addressRemainText() {
                let length = this.addressList.length
                let text = ''
                text = `还可添加 ${ this.addressLimit - this.addressList.length} 条地址信息`
                if (length >= this.addressLimit) {
                    text = `已无法继续添加`
                }

                return text
            },
            deleteAddress(id) {
                this.deleteAddressId = id
                this.sendDeleteRequest()
            },
            sendDeleteRequest() {
                let server = '/member-server'
                let url = server + '/member/address/delete'
                let data = {
                    id: this.deleteAddressId,
                }
                this.$ajaxPost(url, data)
                    .then(res=>{
                        if(res&&res.code === 10000){
                            this.$Message.success(res.message)
                            this.getMemberDetail()
                        }
                    })
                    .catch(err=>{
                        log(err);
                    })
            },
            openAddressPop(type, currentAddress) {
                let length = this.addressList.length
                this.currentAddressInfo = currentAddress
                if (length >= this.addressLimit) {
                    this.$Message.error('收货地址添加已达上限')
                    return
                }

                this.showAddressPop = true
                this.addressPopType = type

                if (type === 'edit') {
                    this.fillAddressPop()
                }
                this.createAddressPopTitle()
            },
            fillAddressPop() {
                Object.assign(this.addressForm, this.currentAddressInfo)
                let { province, city, county, isDefault } = this.currentAddressInfo
                this.addressForm.districtList = [province, city, county]
                this.defaultAddress = isDefault ? '1' : '2'
            },
            formatAddressData() {
                let data = {
                    ...this.addressForm,
                    memberId: this.memberId,
                    isDefault: this.defaultAddress === '1',
                }
                delete data.districtList

                return data
            },
            validateAddress() {
                let { districtList, detailed, receiver, receiverPhone} = this.addressForm
                let emptyAddress = districtList.length === 0
                if (emptyAddress) {
                    this.$Message.error('保存失败，您还未填写区域信息！')
                    return true
                }

                if (detailed === '') {
                    this.$Message.error('保存失败，您还未填写详细地址！')
                    return true
                }
                if (receiver === '') {
                    this.$Message.error('保存失败，您还未填写收货人！')
                    return true
                }
                if (receiverPhone === '') {
                    this.$Message.error('保存失败，您还未填写联系方式！')
                    return true
                } else if( !this.phoneReg.test(receiverPhone)) {
                    this.$Message.error('保存失败，联系方式格式错误！')
                    return true
                }

                return false
            },
            confirmAddress() {
                let type = this.addressPopType
                if (type === 'add') {
                    this.addAddress()
                } else if (type === 'edit') {
                    this.editAddress()
                }
            },
            editAddress() {
                let server = '/member-server'
                let url = server + '/member/address/modify'

                let notPass = this.validateAddress('memberInfo')
                if (notPass) {
                    this.showAddressPop = true
                    return
                }
                let data = this.formatAddressData()
                data.id = this.currentAddressInfo.id

                this.$ajaxPost(url, data)
                    .then(res => {
                        this.cancelAddAddress()
                        if (res && res.code === 10000) {
                            this.$Message.success(res.message)
                            this.getMemberDetail()
                        }
                    })
                    .catch(err => {
                        log(err);
                    });
            },
            addAddress() {
                let server = '/member-server'
                let url = server + '/member/address/add'

                let notPass = this.validateAddress('memberInfo')
                if (notPass) {
                    this.showAddressPop = true
                    return
                }
                this.showAddressPop = false

                let data = this.formatAddressData()

                this.$ajaxPost(url, data)
                    .then(res => {
                        this.cancelAddAddress()
                        if (res && res.code === 10000) {
                            this.$Message.success(res.message)
                            this.getMemberDetail()
                        }
                    })
                    .catch(err => {
                        log(err);
                    });
            },

            cancelAddAddress() {
                this.showAddressPop = false
                this.addressForm = {
                    province: '',
                    city: '',
                    county: '',
                    detailed: '',

                    receiver: '',
                    receiverPhone: '',
                    isDefault: '',
                }

                this.defaultAddress = '1'
                this.districtList = []
            },
            createAddressPopTitle() {
                let text = this.addressPopType === 'add' ? '新增' : '编辑'
                let complete = text + '收货地址'
                return complete
            },
            handleTimePicker(val) {
                this.memberForm.birthday = val
            },
            openBasicInfoPop() {
                this.showBasicInfoPop = true
                let { id, memberName, sex, papersNo, birthday, age, phone, maritalStatus, papersType} = this.userInfo

                Object.assign(this.basicInfoForm, {
                    id: id,
                    memberName: memberName,
                    sex: sex,
                    papersTypeInt: papersType,
                    papersNo: papersNo,

                    birthday: birthday,
                    age: age,
                    phone: phone,
                    maritalStatus: maritalStatus,
                })
                // let { maritalStatus } = this.userInfo
                // this.basicInfoForm = maritalStatus === 1
            },
            validateBasicInfo() {
                let { phone} = this.basicInfoForm

                if (phone === '') {
                    this.$Message.error('保存失败，您还未填写手机号！')
                    return true
                }


                return false
            },
            cancelBasicInfo() {
                this.showBasicInfoPop = false
                this.$refs['basicInfo'].resetFields()
            },
            formatBasicInfo() {
                let data = {
                    ...this.basicInfoForm,
                }

                return data
            },
            addBasicInfo() {
                let server = '/member-server'
                let url = server + '/member/info/modify'

                let notPass = this.validateBasicInfo()
                if (notPass) {
                    return
                }
                this.showBasicInfoPop = false

                let data = this.formatBasicInfo()

                this.$ajaxPost(url, data)
                    .then(res => {
                        if (res && res.code === 10000) {
                            this.$Message.success(res.message)
                            this.getMemberDetail()
                        }
                    })
                    .catch(err => {
                        log(err);
                    });
            },
            backListPage() {
                this.$router.push("/member/manage/query")
            },
            createLevelName() {
                let { levelId, levelName } = this.userInfo
                let text = `${levelId.slice(0, 2).toUpperCase()} ${levelId.slice(2)}-${levelName}`
                return text
            },
            openGrowthPage() {
                let phone = this.userInfo.phone
                this.$router.push({
                    path:"/member/level/growthDetail",
                    query: {
                        phone : phone ,
                    }})
            },
            openPointPage() {
                let phone = this.userInfo.phone
                this.$router.push({
                    path:"/right/pointManage/pointDetail",
                    query: {
                        phone : phone ,
                    }})
            },
            autoFillInfo(cardId) {
                let birthday = getIdentityInfo(cardId, 1)
                let sex = getIdentityInfo(cardId, 2)
                let age = getIdentityInfo(cardId, 3)
                Object.assign(this.basicInfoForm, {
                    birthday: birthday,
                    sex: sex,
                    age: age,
                })
            }
        },
    }
</script>

<style lang="scss"  scoped>
    .page-title {
        margin-bottom: 28px;
        vertical-align: middle;
        & > span {
            cursor: pointer;
            vertical-align: middle;
            font-family: SFUIDisplay-Semibold;
            font-weight: 600;
            text-align: left;
            color: rgba(62, 69, 82, 1);
            font-size: 24px;
            line-height: 32px;
            /*vertical-align: middle;*/
        }

        .iconBack {
            display: inline-block;
            position: relative;
            padding-right: 12px;
            font-size: 24px;
            vertical-align: middle;
            transform: translateY(-2.5px);
        }
    }


    .left-col {
        /*margin-right: 24px;*/
        padding-right: 24px;
    }

    .user-info {
        width:360px;
        background:rgba(255,255,255,1);
        box-shadow:0px 2px 12px 0px rgba(0,0,0,0.04);
        border-radius:16px;
        overflow: hidden;
    }

    .user-photo-container {
        position: relative;
        width:360px;
        height:76px;

        border-radius:16px 16px 0 0;
        background:url('../../../../assets/images/member/user_background.png') no-repeat 0 0;
        background-size:100%;


    }

    .user-frozen {
        background:url('../../../../assets/images/member/user_background_frozen.png') no-repeat 0 0;
    }

    .edit-icon {
        position: absolute;
        top: 88px;
        right: 24px;

        .iconEdit {
            cursor: pointer;
            color: #B6B3B6;
            &:hover {
                color: #FF8C08;
            }
        }
    }

    .user-photo {
        position: absolute;
        width: 88px;
        z-index: 2;
        top: 32px;
        left: 50%;
        transform: translateX(-50%);

        border-radius: 50%;
        background: rgba(255,255,255,1);
        border:1px solid rgba(226,226,234,1);
        padding: 4px;
    }

    .info-container {
        padding: 24px;
        background:rgba(255,255,255,1);
        box-shadow:0px 2px 12px 0px rgba(0,0,0,0.04);
        border-radius:16px;
    }

    .brief-info {
        border-bottom: 1px solid rgba(226,226,234,1);
    }

    .user-name {
        margin-top: 52px;
        text-align: center;
        font-size:24px;
        font-weight:500;

        color:rgba(23,23,37,1);
        line-height:34px;
    }

    .frozen-user-name {
        color:rgba(146,146,157,1);
    }

    .active-time {
        margin-top: 6px;
        text-align: center;
        & > span {
            font-size:12px;
            font-weight:300;
            color:rgba(146,146,157,1);
            line-height:22px;
        }

        & > span:first-child {
            padding-right: 4px;
        }
    }


    .property-list {
        display: flex;
        justify-content: space-evenly;
    }

    .separation-line {
        margin-top: 16px;
        height: 16px;
        border-right: 1px solid rgba(226,226,234,1);
    }
    .property-name {

        font-size:12px;
        font-weight:300;
        color:rgba(181,181,190,1);
        vertical-align: middle;
        line-height: 24px;

        & > span {
            font-size:12px;
        }

        & > .iconLocked {
            font-size: 18px;
        }
    }

    .property-value {
        margin-top: 10px;
        height: 26px;
        box-sizing: border-box;
        font-size:14px;

        vertical-align: middle;
        font-weight:500;
        color:rgba(23,23,37,1);
        text-align: center;
    }

    .grey-text {
        color:rgba(146,146,157,1);
    }

    /*.iconEdit {*/
    /*    display: none;*/
    /*    vertical-align: middle;*/
    /*}*/

    .edit-cell {
        .iconfont {
            cursor: pointer;
            color: #FF8C08;
        }
    }

    .edit-cell:hover  {
        & > .point-value {
            display: none;
        }
        & > .iconEdit {
            display: inline;
        }
    }


    .middle-block-narrow {
        margin-top: 20px;
    }


    .big-block-narrow {
        margin-top: 24px;
    }

    .vip-icon-container {
        margin-bottom: 40px;
    }

    .none-member {
        display: flex;
        justify-content: center;

        & > img {
            width: 116px;
            height: auto;
        }
    }

    .vip-icon-list {
        display: flex;
        justify-content: center;
    }

    .vip-icon {
        width: 20px;
        height: 20px;
    }

    .color-text {
        color:rgba(255,140,8,1);
    }

    .personal-info {
        border-bottom: 1px solid rgba(226,226,234,1);
        padding-top: 2px;
        padding-bottom: 24px;
    }

    .info-row {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
    }

    .info-name {
        font-size:12px;
        font-weight:300;
        color:rgba(146,146,157,1);
        line-height:22px;
    }

    .info-value {
        margin-top: 4px;
    }

    .origin-info {
        font-size:10px;
        font-weight:300;
        color:rgba(181,181,190,1);
        line-height:20px;

        text-align: center;
    }

    .right-box {
        background-color: white;
        border-radius: 24px;
        padding: 24px;
    }

    .block-name {
        position: relative;
        font-size:18px;
        font-weight:500;
        color:rgba(23,23,37,1);
        line-height:28px;

        padding-bottom: 24px;
        border-bottom: 1px solid rgba(226,226,234,1);

        &::before {
            position: absolute;
            left: -24px;
            content: '\00a0';
            width:6px;
            height:28px;

            background:rgba(255,140,8,1);
            border-radius:0px 8px 8px 0px;
        }
    }


    .component-narrow {
        margin-right: 8px;
    }

    .address-container {
        width:360px;
        box-sizing: border-box;
        padding: 24px;
        background:rgba(255,255,255,1);
        box-shadow:0px 2px 12px 0px rgba(0,0,0,0.04);
        border-radius:16px;
    }

    .card-title {
        display: flex;
        justify-content: space-between;

        & > span:first-child {
            font-size:16px;
            font-weight:500;
            color:rgba(23,23,37,1);
            line-height:26px;
        }

        .iconAdd {
            cursor: pointer;
            color: rgba(255,140,8,1);
        }
    }

    .address-info {
        margin-bottom: 20px;
        .iconfont {
            color: rgba(146,146,157,1);
            vertical-align: middle;
        }
    }

    .address-order {
        font-size:12px;
        font-weight:300;
        color:rgba(146,146,157,1);
        line-height:22px;
    }

    .address-text {
        display: inline-block;
        font-size:14px;
        font-weight:300;
        color:rgba(23,23,37,1);
        line-height:24px;
        vertical-align: middle;

        width: 220px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .receiver-action {
        display: flex;
        justify-content: space-between;

        &:first-child {
            margin-right: 4px;
        }
        .iconfont {
            vertical-align: middle;
            cursor: pointer;
        }
    }

    .modify-address {
        display: none;
    }

    .address-info:hover .modify-address {
        display: inline-block;
        .iconfont:hover  {
            color:rgba(255,140,8,1);
        }
    }

    .icon-space {
        display: inline-block;
        width: 28px;
        .iconfont {
            vertical-align: middle;
        }
    }

    .default-address {
        font-size:12px;
        font-weight:300;
        color:rgba(255,140,8,1);
        line-height:22px;
    }

    .page-dot-container {
        display: flex;
        justify-content: center;

        & > div:not(:last-child) {
            margin-right: 4px;
        }
    }

    .page-dot {
        cursor: pointer;
        border-radius: 2px;
    }

    .default-dot {
        width:12px;
        height:4px;
        background:rgba(226,226,234,1);
        border-radius:2px;
    }

    .active-dot {
        width:24px;
        height:4px;
        background:rgba(255,140,8,1);
        border-radius:2px;
    }

    .modal-footer {
        border-top: 1px solid rgba(226,226,234,1);
        display: flex;
        justify-content: flex-end;
        padding-top: 14px;
    }

    .btn-gap {
        margin-right: 8px;
    }

    .phone-remind {
        margin-top: 4px;
        font-size:12px;
        font-weight:300;
        color:rgba(146,146,157,1);
        line-height:22px;
    }

    .frozen-tag {
        position: absolute;
        top: -4px;
        left: -18px;
        font-size: 10px;
        font-weight: 300;
        color: white;
        background-color: #B4B3BF;
        transform: rotate(-45deg);
        padding: 10px 20px 4px 20px;
    }
</style>
