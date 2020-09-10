<template>
    <div>
        <div class="name">{{ item.changeReasonString }}</div>
        <Poptip word-wrap width="200"
                trigger="hover"
                transfer
                placement="top-start"
                :content="item.content"
                :disabled="isDisable"
        >
            <div slot="content">
                <div class="detail-content" v-html="createContent()"></div>
            </div>
            <div class="display-id">{{ item.content }}</div>
        </Poptip>
    </div>
</template>

<script>
    // import { log } from "@/utils/tools";

    export default {
        name: "ChangeTypeCell",
        props: {
            item: Object,
        },
        data() {
            return {
                jump: false,
                pageType: '',
                orgId: '',
            }
        },
        computed: {
            // 签到没有明细气泡 changeReason
            isDisable() {
                return this.item.changeReason === 107
            },
        },
        created() {
            this.initData()
        },
        methods: {
            initData() {
                let orgId = localStorage.orgId
                this.orgId = orgId
            },
            createContent() {
                let { changeReason, content } = this.item
                // 订单长度变化时要修改这部分的 sample.
                let packString = {
                    // 线上退款扣减
                    206: [{
                        name: '退单ID:',
                        type: 'refund',
                        sample: 't2005080002479451',
                    }, {
                        name: '原进单ID:',
                        type: 'order',
                        sample: '012005080000106225',
                    }, ],
                    // 线上消费累积
                    103: [{
                        name: '进单ID:',
                        type: 'order',
                        sample: '012005080000129094',
                    }, ]
                }

                let format = packString[changeReason]
                if (format === undefined) {
                    return content
                }
                let html = this.createReasonHtml(format)

                return html
            },
            createReturnOrder() {
                // let module = {
                //     refund: {
                //
                //     }
                // }
            },
            createReasonHtml(arr) {
                let { content } = this.item
                let text = content
                arr.forEach(item => {
                    let { type, name, sample } = item
                    let start = text.indexOf(name)
                    let nameLen = name.length
                    let sampleLen = sample.length

                    let starter = start + nameLen
                    let orderEnd = start + nameLen + sampleLen
                    let orderId = text.slice(starter, orderEnd)

                    let url = this.createOrderUrl(type, orderId)
                    let anchor = this.createAnchor(orderId, url)
                    // 通过订单号拆成两部分，将锚点加进去
                    let contentPart = text.split(orderId)
                    let complete = contentPart[0] + anchor + contentPart[1]

                    text = complete
                })

                return text
            },
            createOrderUrl(type, orderId) {
                let starters = {
                    refund: '/dealmanage/returnorderdetail?order=',
                    order: '/dealmanage/orderdetail?order='
                }

                let end = `&orgId=${ this.orgId }`
                let orderUrl = starters[type] + orderId + end

                return orderUrl
            },
            createAnchor(text, url) {
                // let { changeReason } = this.item
                let a = `<a class="action-text" href="${ url }"
                    target="_blank">${ text }</a>`

                return a
            }
        }
    }
</script>

<style lang="scss" scoped>
    .name {
        height:24px;
        font-size:14px;
        font-family:SFUIDisplay-Light,SFUIDisplay;
        font-weight:300;
        color:rgba(23,23,37,1);
        line-height:24px;
    }

    .display-id {
        margin-top: 4px;
        height:22px;
        font-size:12px;
        font-family:SFUIDisplay-Light,SFUIDisplay;
        font-weight:300;
        color:rgba(146,146,157,1);
        line-height:22px;
        vertical-align: middle;

        text-overflow:ellipsis;
        width: 180px;
        overflow:hidden;
        white-space:nowrap;
    }

    .display-action {
        cursor: pointer;
        margin-top: 4px;
        height:22px;
        font-size:12px;
        font-family:SFUIDisplay-Light,SFUIDisplay;
        font-weight:300;

        line-height:22px;
        color:rgba(146,146,157,1);
        vertical-align: middle;

        &:hover {
            color: #FF8C08;
        }
    }

    .detail-content {
        word-break: break-all;
    }
</style>