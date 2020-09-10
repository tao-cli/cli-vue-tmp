<template>
    <div>
        <RadioGroup v-model="orderType" type="button"
                    @on-change="changeOrderType"
        >
            <Radio label="in">进单类型</Radio>
            <Radio label="out">退单类型</Radio>
        </RadioGroup>

        <div class="search-block big-block-narrow">
            <DatePicker type="daterange" placement="bottom-end"
                        class="component-narrow w280"
                        placeholder="开始时间 → 结束时间"
                        @on-change="handleTimePiker"
                        :confirm="true"
                        format="yyyy-MM-dd"
                        :value="[searchData.createOrderTimeStart, searchData.createOrderTimeEnd]"
            ></DatePicker>

            <i-input v-model="tempOrderNo" search
                     @on-search="getList"
                     class="w240 identity-search button-gap"
                     placeholder="订单编号检索" >
                <i  class="icon iconfont iconSearch"  title="更多" slot="suffix"></i>
            </i-input>
        </div>

        <Table v-if="listType === 'order'" class="middle-block-narrow"
               :columns="orderCol" :data="orderData" :loading="loading"></Table>
        <Table v-if="listType === 'refund'"  class="middle-block-narrow"
               :columns="refundCol" :data="refundData" :loading="loading"></Table>

        <Page
                class="middle-block-narrow"
                :total="pageData.count"
                :current="pageData.page"
                :page-size="pageData.size"
                show-elevator
                show-total
                @on-change="onPageChange"
                @on-page-size-change="onPageSize"
        />
    </div>
</template>

<script>
    import { log } from "@/utils/tools";
    import {orderStatusList, expressTypeList, orderSourceList, refundStatusList} from "./orderStatusList";
    import { orderCol } from "./orderCol";
    import { refundCol } from "./refundCol"
    import {userTravelAction} from "./userTravelAction";

    export default {
        name: "OrderRecord",
        props: {
            memberId: String,
        },
        data() {
            return {
                orgId: '',
                // 订单 order, 退单 refund
                listType: 'order',
                orgName: '',
                tempOrderNo: '',
                searchData: {
                    orgId: '',
                    memberKeyword: this.memberId,
                    createOrderTimeStart: '',
                    createOrderTimeEnd: '',

                    orderNo: '',
                    orderStatus: '',

                    refundNo: '',
                    refundStatus: '',
                },

                loading: false,

                tableCol: '',
                orderCol: orderCol.call(this),
                userTravelAction: userTravelAction,
                listData: [],
                orderData: [],

                pageData: {
                    count: 0,
                    page: 1,
                    size: 10,
                },
                orderStatusList: orderStatusList,
                expressTypeList: expressTypeList,

                orderType: 'in',
                statusFlag: false,

                orderSourceList: orderSourceList,
                orderFlag: false,

                refundCol: refundCol.call(this),
                refundStatusList: refundStatusList,
                refundStatusFlag: false,
                refundData: [],
            }
        },
        created() {
            this.initData()
            this.getList()
        },
        methods: {
            initData() {
                let orgId = localStorage.orgId || 'AABBCCDDEEFFGGHH66'
                let orgName = localStorage.orgName
                this.searchData.orgId = orgId
                this.orgName = orgName

                this.tableCol = this.orderCol
            },
            formatData() {
                let { memberKeyword, orderStatus, refundStatus, createOrderTimeStart, createOrderTimeEnd } = this.searchData
                let order = {
                    orgId: '',
                    memberKeyword: memberKeyword,
                    createOrderTimeStart,
                    createOrderTimeEnd,

                    orderNo: this.tempOrderNo,
                    orderStatus: orderStatus,
                }

                let refund = {
                    memberKeyword: memberKeyword,
                    createOrderTimeStart,
                    createOrderTimeEnd,
                    refundNo: this.tempOrderNo,
                    refundStatus: refundStatus,
                }


                let data = order
                if (this.listType === 'refund') {
                    data = refund
                }
                return data
            },
            formatOrderData() {
                let data = {
                    ...this.searchData,
                    ...this.pageData,
                    memberInfoFlag: true,
                }
                data.orderNo = this.tempOrderNo

                let realValue = {}
                this.$_.forEach(data, function(value, key) {
                    if (value !== '') {
                        realValue[key] = value
                    }
                });
                delete realValue.count

                return realValue
            },
            getList() {
                this.loading = true
                let data =  this.formatOrderData()

                let server = '/mos-order-server'
                let url = server + '/api/order/bserver/list'

                if (this.listType === 'refund') {
                    url = server + '/api/refund/bserver/list'
                }
                this.$ajaxPost(url, data)
                    .then(res=>{
                        this.loading = false
                        if(res&&res.code === 10000){
                            let { count, list } = res.data
                            if (this.listType === 'order') {
                                this.orderData = list
                            } else {
                                this.refundData = list
                            }
                            this.pageData.count = count
                        }
                    })
                    .catch(err=>{
                        log(err);
                    })
            },
            // handleTimePiker(val){
            //     let startDate = val[0]
            //     let endDate = val[1]
            //
            //     this.searchData.createOrderTimeStart = startDate
            //     this.searchData.createOrderTimeEnd = endDate
            //     this.getList()
            // },
            handleTimePiker(val){
                let startDate = val[0]
                let endDate = val[1]
                if (startDate) {
                    startDate = startDate + " 00:00:00"
                    endDate = endDate + " 23:59:59"
                }

                Object.assign( this.searchData, {
                    createOrderTimeStart: startDate,
                    createOrderTimeEnd: endDate,
                })
                this.pageData.page = 1
                this.getList()
            },
            onPageChange(page) {
                this.pageData.page = page
                this.$nextTick(() => {
                    this.getList();
                });
            },
            onPageSize(size) {
                this.pageData.size = size;
                this.getList();
            },
            changeOrderType() {
                if (this.orderType === 'in') {
                    this.listType = 'order'
                } else {
                    this.listType = 'refund'
                }
                this.getList()
            }

        }
    }
</script>

<style lang="scss" scoped>

    .search-block {
        display: flex;
        justify-content: space-between;
    }



    .mini-block-narrow {
        margin-top: 8px;
    }

    .small-block-narrow {
        margin-top: 16px;
    }

    .middle-block-narrow {
        margin-top: 20px;
    }


    .big-block-narrow {
        margin-top: 24px;
    }
</style>
