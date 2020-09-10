<template>
    <div class="confirm-bubble">
        <span v-if="toConfig" @click="actionBubble('edit')" class="action-text">待配置</span>
        <span v-else   @click="actionBubble('edit')"
              :class="{'border-btn': showDelete }"
              class="action-text"> 编辑</span>

        <Poptip  v-model="showPop" trigger="click" placement="top" :transfer="true"
                confirm
                 @on-ok="actionBubble('delete')"
                title="等级删除后不可恢复，是否确认该操作？"
        >
            <span v-if="!toConfig && showDelete" class="action-btn action-text">
                删除
            </span>
        </Poptip>

    </div>
</template>

<script>
    // import {log} from "@/utils/tools";

    export default {
        name: "ConfirmCellBubble",
        props: {
            item: Object,
            isLast: Boolean,
            levelCount: Number,
            isActive: Boolean,
        },
        data() {
            return {
                showPop: false,
                toConfig: false,
                showDelete: false,
            };
        },
        created() {
            this.showConfigBtn()
        },
        watch: {
            isActive() {
                this.showDelete = false
                this.showConfigBtn()
            }
        },
        methods: {
            showConfigBtn() {
                let showDelete = this.isLast && (this.item.levelId !== 'Lv1') && (!this.isActive)
                if (this.item.id === '-') {
                    this.toConfig = true
                    this.showPop = false
                } else if ( showDelete ) {
                    this.showDelete = true
                }
            },
            actionBubble(type) {
                if (this.levelCount === 11 && this.toConfig) {
                    this.$Message.error('最多支持 10 个等级')
                    return
                }
                this.$emit('actionBubble', type, this.item)
            }
        }
    }
</script>

<style scoped lang="scss">
    .border-btn {
        position: relative;
        cursor: pointer;
        padding-right: 8px;
        line-height: 24px;

        &:after {
            content: '';
            position: absolute;
            right: 0;
            top: 0px;

            bottom: 0px;
            width: 1px;
            background-color: #e2e2ea;
        }
    }

    .normal-text {

    }

    .action-text {
        cursor: pointer;
        color: #FF8C08;
    }

    .action-btn {
        padding-left: 8px;
    }
</style>
