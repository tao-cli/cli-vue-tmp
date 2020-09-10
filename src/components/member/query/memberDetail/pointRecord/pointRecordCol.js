// import { log } from "@/utils/tools";
// import ConfirmCellBubble from "./ConfirmCellBubble";
import NameIdCell from "./NameIdCell";
import UpdateTimeCell from "./UpdateTimeCell";
import FilterTableColList from "@/components/base/tableComponent/FilterTableColList";
import GrowthChangeCell from "./GrowthChangeCell";
import ChangeTypeCell from "./ChangeTypeCell";

import "./pointCol.scss"

export const pointRecordCol = function () {
    return [
        {
            title: '流水号',
            minWidth: 220,
            align: 'left',
            render: (h, params) => {
                return h(NameIdCell, {
                    props: {
                        item: params.row
                    }
                })
            }
        },
        {
            title: '变更类型/明细',
            align: 'left',
            width: 200,
            render: (h, params) => {
                return h(ChangeTypeCell, {
                    props: {
                        item: params.row
                    }
                })
            }
        },
        {
            title: '积分变更',
            align: 'center',
            renderHeader: (h)=>{
                return h('div',[
                    h('span','积分变更'),
                    h('Poptip',{
                            class: 'icon-space',
                            props:{
                                trigger: 'hover',
                                placement: "bottom",
                                transfer:true,
                                padding: '0'
                            }
                        },
                        [
                            h("Icon", {
                                props: {
                                    type: "ios-funnel",
                                    color: this.growthFilterFlag ? '#FF8C08' : ''
                                }
                            }),
                            h('div',{
                                slot: 'content'
                            },[
                                h(FilterTableColList, {
                                    props: {
                                        selectList: this.growthFilter
                                    },
                                    on: {
                                        select: item => {
                                            for(var i= 0;i < this.growthFilter.length; i++){
                                                this.growthFilter[i].isSelect = false;
                                            }
                                            item.isSelect = true;
                                            let isAdd = item.id
                                            this.growthFilterFlag = Boolean(isAdd);

                                            this.pageData.page = 1;
                                            this.searchData = Object.assign(this.searchData, {isAdd: isAdd})
                                            this.$nextTick(() => {
                                                this.getList()
                                            })
                                        }
                                    }
                                })
                            ])
                        ])
                ])
            },
            render: (h, params) => {
                return h(GrowthChangeCell, {
                    props: {
                        item: params.row
                    }
                })
            }
        },
        {
            title: '所属门店',
            key: 'orgName',
            align: 'center'
        },
        {
            title: '变更时间',
            key: 'createTime',
            align: 'left',
            render: (h, params) => {
                return h(UpdateTimeCell, {
                    props: {
                        item: params.row
                    }
                })
            }
        },

    ]
}
