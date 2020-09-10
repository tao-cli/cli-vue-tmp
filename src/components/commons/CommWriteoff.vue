<!--
 * @Description: 核销通用页面
 * @Author: sam.xutao
 * @Date: 2020-03-10 09:53:27
 * @LastEditTime: 2020-04-02 11:34:23
 * @LastEditors: sam.xutao
 -->
<template>
  <div class="cancle_page">
    <router-view></router-view>
    <div>
      <Form
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        label-position="right"
        :label-width="120"
      >
        <FormItem label="核销模块：" prop="exchangeSource">
          <Select v-model="formValidate.exchangeSource">
            <Option
              v-for="item in moduleList"
              :key="item.code"
              :value="item.code"
            >{{ item.title ||item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="自提码：" prop="exchangeCode" v-if="formValidate.exchangeSource">
          <Row>
            <i-col span="16">
              <i-input
                v-model="formValidate.exchangeCode"
                placeholder="请输入自提码"
                :class="!resFlag?'nores':''"
              ></i-input>
            </i-col>
            <i-col span="4">
              <Button
                style="margin-left:8px; outline:none;"
                @click="onQuery"
                :loading="searchLoading"
              >立即查询</Button>
            </i-col>
          </Row>
          <p v-if="!resFlag" style="color:#FF4C4C; font-size:12px;">{{resMsg||'未查询到对应核销详情，请重新输入'}}</p>
        </FormItem>
        <div v-if="cancelObj.exchangeFlag ? true : goodList.length ? true :false" class="modal">
          <FormItem label="自提详情：" prop="exchangeCodeList">
            <p v-show="goodList.length" style="line-height:22px;margin-top:6px;">为你查询到订单内还存在以下未提货商品，请选择需要一起核销的商品：</p>
            <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
              <Checkbox
                :label="cancelObj.exchangeCode"
                :key="cancelObj.exchangeCode"
                v-show="cancelObj.exchangeFlag"
              >
                <div
                  style="display:flex;justify-content:space-between; padding: 24px;margin-bottom:12px;"
                >
                  <div class="flexbox-infor">
                    <img :src="cancelObj.productImg" :width="40" :height="40" alt="图片" />
                    <section>
                      <p>{{cancelObj.productName}}</p>
                      <p
                        style="color:#9aa8b8"
                      >ID:{{cancelObj.productSkuId}}&nbsp;&nbsp;规格：{{cancelObj.productSpec}}</p>
                    </section>
                  </div>
                  <div>
                    <p>{{cancelObj.productPrice}}</p>
                    <p>x{{cancelObj.productNum}}</p>
                  </div>
                </div>
              </Checkbox>
              <Checkbox :label="item.exchangeCode" v-for="(item ,index) in goodList" :key="index">
                <div
                  style="display:flex;justify-content:space-between; padding: 24px;margin-bottom:12px;"
                >
                  <div class="flexbox-infor">
                    <img :src="item.productImg" :width="40" :height="40" alt="图片" />
                    <section>
                      <p>{{item.productName}}</p>
                      <p
                        style="color:#9aa8b8"
                      >ID:{{item.productSkuId}}&nbsp;&nbsp;规格：{{item.productSpec}}</p>
                    </section>
                  </div>
                  <div>
                    <p>{{item.productPrice}}</p>
                    <p>x{{item.productNum}}</p>
                  </div>
                </div>
              </Checkbox>
            </CheckboxGroup>
            <!-- <div :class="['manu_wrap',{expire_wrap:isExpired||isVerified}]">
              <div class="wrap_left">
                <img :src="cancelObj.productImg" alt />
              </div>
              <div class="wrap_right">
                <Row type="flex" justify="start">
                  <i-col span="16" class="right_title">{{cancelObj.productName}}</i-col>
                </Row>
                <Row>
                  <i-col span="12">
                    <label for="num" style="font-size:14px;">核销数量</label>
                  </i-col>
                </Row>
                <Row>
                  <i-col span="12">
                    <span style="font-size:24px;">{{(cancelObj.productNum||'')}}</span> 件
                  </i-col>
                </Row>
                <Row>
                  <i-col span="12">
                    <label for="type">类型：</label>
                    {{cancelObj.productType}}
                  </i-col>
                  <i-col span="8">
                    <label for="id">ID：</label>
                    {{cancelObj.productSkuId}}
                  </i-col>
                </Row>
                <Row>
                  <i-col span="12">
                    <label for>规格：</label>
                    {{cancelObj.productSpec}}
                  </i-col>
                </Row>
                <Row justify="start">
                            <i-col span="8" ><label for="desc">{{'兑换说明：'}}</label></i-col>
                            <i-col v-html="normalDesc.includes(cancelObj.exchangeDescription)||!cancelObj.exchangeDescription?'-':cancelObj.exchangeDescription"></i-col>
                </Row>
              </div>
            </div>-->
            <p
              style="color:#FF4C4C; font-size:12px;"
              v-if="isExpired||isVerified"
            >{{isVerified?'该商品已完成核销，无法再次核销。':'该商品已过核销期限，无法核销。'}}</p>
          </FormItem>
          <!-- <FormItem label="核销库存点："  prop="repositoryId" v-if="!isExpired&&!isVerified">
                <Select v-model="formValidate.repositoryId" placeholder="请选择库存点" style="width:358px;">
                    <Option v-for="item in depotList" :value="item.repositoryId" :key="item.repositoryId">{{ item.repositoryName }}</Option>
                </Select>
          </FormItem>-->
          <FormItem label="备注：" prop="remark" v-if="!isExpired&&!isVerified">
            <i-input
              type="textarea"
              v-model="formValidate.remark"
              style="width:358px;"
              :maxlength="200"
              placeholder="输入备注信息，最多200字"
            ></i-input>
          </FormItem>
        </div>
      </Form>
      <div class="cancle_btn">
        <Button size="large" style="margin-right: 10px;" @click="onCancel('formValidate')">取消</Button>
        <Button
          size="large"
          type="primary"
          :disabled="!cancelObj||isExpired||isVerified||!checkAllGroup.length"
          @click="confirmCancel"
          :loading="btnLoading"
        >确定核销</Button>
      </div>
    </div>
  </div>
</template>
<script>
const serveAPI = "/mos-order-server";
export default {
  name: "ManualCancell",
  data() {
    return {
      checkAllGroup: [],
      goodList: [],
      moduleList: [], //核销模块列表
      formValidate: {
        exchangeCodeList: [],
        exchangeSource: "",
        exchangeCode: "",
        remark: ""
      },
      resFlag: true,
      resMsg: "",
      searchLoading: false,
      normalDesc: ["请编辑内容1<p><br></p>", "请编辑内容<p><br></p>"],
      cancelObj: {},
      btnLoading: false,
      cancelId: "",
      depotList: [],
      ruleValidate: {
        // repositoryId: [
        //     { required: true, message: '核销库存点不能为空', trigger: 'change',type:'number' }
        // ],
        exchangeCodeList: [
          {
            required: true,
            message: "请选择商品",
            type: "array",
            trigger: "change"
          }
        ],
        exchangeCode: [
          { required: true, message: "核销码不能为空", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    isExpired() {
      return this.cancelObj && this.cancelObj["exchangeStatus"] === "EXPIRED";
    },
    isVerified() {
      return this.cancelObj && this.cancelObj["exchangeStatus"] === "VERIFIED";
    }
  },
  mounted() {
    this.loadModuleList();
  },
  methods: {
    async loadModuleList() {
      const { data } = await this.$ajaxGet(
        serveAPI + "/api/exchange/exchangeSource"
      );
      this.moduleList = data;
    },
    checkAllGroupChange(data) {
      this.formValidate.exchangeCodeList = data;
    },
    // 取消
    onCancel(name) {
      this.$refs[name].resetFields();
      this.cancel();
      this.$emit("on-cancel");
    },
    // 查询
    onQuery() {
      if (!this.formValidate.exchangeCode) {
        this.$Message.warning("请填写核销码");
        return false;
      }
      this.cancelObj = {};
      // 10-23 修改逻辑为先根据核销码查出商品，商品带回对应默认仓库信息
      let obj = {
        exchangeCode: this.formValidate.exchangeCode
      };

      this.searchLoading = true;
      this.$ajaxGet(serveAPI + "/api/exchange/query", obj)
        .then(res => {
          if (res.code === 10000 && res.data) {
            this.cancelObj = res.data;
            this.goodList = res.data.otherGoodsList || [];
            this.resFlag = res.data.exchangeFlag;
            this.resMsg = res.data.notice;
          }
          this.searchLoading = false;
        })
        .catch(err => {
          this.searchLoading = false;
          console.info(err);
        });
    },
    // 获取商品对应仓库列表
    async getRegistoryList(pid) {
      this.depotList = [];
      const {
        data
      } = await this.$ajaxGet(
        "/mall-server/mall/present/stock/presentStockList",
        { presentIdentify: pid }
      );
      if (data && data.list) {
        this.depotList = data.list;
      }
    },
    // 确定核销
    confirmCancel() {
      let obj = {
        ...this.formValidate,
        factoryId: 1,
        factoryName: "默认仓库" // 默认仓库写死
      };
      this.$refs["formValidate"].validate(async valid => {
        if (!valid) {
          this.$Message.error("校验未通过,请检查表单");
        } else {
          this.btnLoading = true;
          const { code } = await this.$ajaxPost(
            serveAPI + "/api/exchange/submit",
            obj
          );
          this.btnLoading = false;
          if (code === 10000) {
            this.$Message.success("核销成功！");
            this.cancel();
            this.$emit("on-cancel");
            this.$emit("getWriteOffList");
          }
        }
      });
    },
    cancel() {
      this.cancelObj = {};
      this.resFlag = true;
      this.goodList = [];
      this.checkAllGroup = [];
    },
    // 判断是否是数字
    checkisNumber(nubmer) {
      var re = /^[0-9]+.?[0-9]*$/;
      return re.test(nubmer);
    }
  }
};
</script>
<style lang="scss">
.modal {
  .ivu-checkbox-group-item {
    width: 100%;
    border-radius: 4px;
    border: 1px solid rgba(225, 230, 235, 1);
    margin-bottom: 12px;
    .ivu-checkbox {
      float: right;
      margin-top: 26px;
      margin-right: 20px;
    }
  }
}
.cancle_page .ivu-form-item {
  margin-bottom: 20px;
}
.wrap_right {
  .ivu-row label {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(154, 168, 184, 1);
  }
  .ivu-row .ivu-col {
    font-size: 12px;
    font-family: SFUIDisplay-Regular, SFUIDisplay;
    font-weight: 400;
    color: #67678f;
  }
  .right_title {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 700;
    color: rgba(62, 69, 82, 1);
  }
}
.nores input {
  background: rgba(255, 76, 76, 0.08);
  border: 1px solid rgba(255, 76, 76, 1);
}
</style>
<style lang="scss" scoped>
.flexbox-infor {
  display: flex;
  img {
    margin-right: 8px;
  }
  > section {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
.cancle_page {
  width: 100%;
  height: 100%;
  padding-top: 20px;
  background: #fff;
}
.cancle_btn {
  display: flex;
  padding-top: 10px;
  justify-content: flex-end;
  margin-top: 50px;
  border-top: 1px solid#E6EBF0;
}
.manu_wrap {
  display: flex;
  padding: 24px;
  justify-content: space-around;
  align-items: space-around;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  width: 358px;
  border: 1px solid rgba(225, 230, 235, 1);
}
.expire_wrap {
  background: rgba(255, 76, 76, 0.08);
  border-radius: 4px;
  border: 1px solid rgba(255, 76, 76, 1);
}
.wrap_left {
  width: 48px;
  height: 48px;
  img {
    width: 100%;
    height: 100%;
  }
}
.wrap_right {
  width: 100%;
  padding-left: 30px;
}
</style>
