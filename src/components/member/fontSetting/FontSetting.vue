<template>
    <Row class="all_box">
<!--        <i-col span="8"  class="left_box">-->
<!--            <Row class="phone_view">-->
<!--                <Scroll class="info_box" height="400" style="margin-top:70px;">-->
<!--                    <Row class="info_title">会员中心</Row>-->

<!--                    <Row class="info_msg" v-for="(item,index) in previewList" :key="index">-->
<!--                        <i-col span="22">{{item}}</i-col>-->
<!--                        <i-col span="2"><Icon type="ios-arrow-forward" size="20"/></i-col>-->
<!--                    </Row>-->
<!--                </Scroll>-->
<!--            </Row>-->
<!--        </i-col>-->
        <i-col span="8">
            <div class="preview-container">
                <div class="time-phone"></div>
                <div class="person-info">
                    <img class="user-photo" :src="defaultPhoto" alt="头像"/>
                    <span class="nick-name">Data4truth</span>
                </div>

                <div class="preview-list" >
                    <div class="field" v-for="(item,index) in previewList" :key="index">
                        <span class="field-name">
                            <span class="required-mark" v-if="item.requiredFields === 1">*</span>
                            <span>{{ item.showName }}</span>
                        </span>
                        <div class="field-value">
                            <span>{{ displayText(item.showType) }}</span>
                            <i v-if="showIcon(item.id)" class="icon iconfont iconRight" title="向右" ></i>
                        </div>
                    </div>
                </div>

                <div class="phone-bottom"></div>
            </div>
        </i-col>
        <i-col span="16" class="right_box">
            <Table :columns="columns" :data="Data" ></Table>

        </i-col>
    </Row>
</template>

<script>

import {axios_get,axios_post} from "../../../utils/axios";
import { log } from "@/utils/tools";
import SwitchCom from "./switchCom"
import phoneTimeImg from "@/assets/images/member/phone_time.png"
import defaultPhoto from "@/assets/images/member/default_member_photo.png"

export default {
    name: "Fontsetting",
    data(){
        return {
            phoneTimeImg: phoneTimeImg,
            defaultPhoto: defaultPhoto,
            previewList:[],  //预览列表
            infoList:null,  //字段列表

            id: null,  //字段ID
            showSerial: null,  //显示顺序
            isRegister:null, //是否是注册必选项 1:是 -1 否
            isMemberData: null,  //会员中心是否显示 1:是 -1 否

            mustArr:[],
            mustList: [],          //不可操作
            BiTType: false,     //表格title
            firstFieldId: '',

            lastFieldId: '',
            //第二期修改
                columns:[
                    {
                        title:"字段",
                        key:"showName",

                    },
                    {
                        title:"",
                        key:"",
                        renderHeader:(h)=>{
                            return h("div",[
                                h("span",this.BiTType?"显示设置":"会员完善字段")
                            ])
                        },
                        render:(h,params)=>{
                            return h(SwitchCom,{
                                props:{
                                    showObj:this.BiTType?{open:"显示",close:"隐藏"}:{open:"是",close:"否"},
                                    isOpen:params.row.isMemberData === 1,
                                    isDisable:params.row.disable,
                                },
                                on:{
                                    changeSwitch:value =>{
                                        let id = params.row.id;
                                        let isShow = value? 1 : -1
                                        this.postCenterSet(id,isShow)
                                    }
                                }
                            })
                        }
                    },
                    {
                        title:"",
                        key:"",
                        width: 100,
                        renderHeader:(h)=>{
                            return h("div",[
                                h("span",this.BiTType?"必填/选填设置":"预约必填字段")
                            ])
                        },
                        render:(h,params)=>{
                            return h(SwitchCom,{
                                props:{
                                    showObj:this.BiTType?{open:"必填",close:"选填"}:{open:"是",close:"否"},
                                    isOpen:params.row.requiredFields === 1,
                                    isDisable:this.BiTType?(params.row.disable || params.row.isMemberData===-1):params.row.disable,
                                },
                                on:{
                                    changeSwitch:value =>{
                                        let id = params.row.id;
                                        let isShow = value? 1 : -1
                                        !this.BiTType&&this.postRegisterSet(id,isShow);
                                        this.BiTType&&this.postRequiredSet(id,isShow)
                                    }
                                }
                            })
                        }
                    },

                    {
                        title:"操作",
                        key:"",
                        width: 100,
                        render:(h,params)=>{
                            let disable = params.row.disable;
                            let { id, isMemberData } = params.row

                            let hideField = isMemberData === -1
                            return h("div",{

                            },[
                                !disable&&h("i",{
                                    class: 'icon iconfont iconUpward',
                                    title: '向上',
                                    props:{

                                    },
                                    style:{
                                        cursor: 'pointer',
                                        color: ((id === this.firstFieldId) || hideField) ? '#E5E2E5' : '#FF8C08',
                                    },
                                    on:{
                                        click:()=>{
                                            if (id === this.firstFieldId) {
                                                this.$Message.error('首位字段不能向上移动')
                                                return
                                            }
                                            if (hideField) {
                                                return
                                            }
                                            this.goUp(params.row.id)
                                        }
                                    }
                                }),
                                !disable&&h("i",{
                                    class: 'icon iconfont iconDownward',
                                    title: '向下',
                                    props:{

                                    },
                                    style:{
                                        cursor: 'pointer',
                                        color: ((id === this.lastFieldId) || hideField) ? '#E5E2E5' : '#FF8C08',
                                    },
                                    on:{
                                        click:()=>{
                                            if (id === this.lastFieldId) {
                                                this.$Message.error('末位字段不能向下移动')
                                                return
                                            }

                                            if (hideField) {
                                                return
                                            }
                                            this.goDown(params.row.id)
                                        }
                                    }
                                })
                            ])
                        }
                    },
                ],
                Data:[]
            //end
        }
    },
    mounted(){
        this.BiTType = localStorage.getItem("orgId") != "13";     //判断是集团还是全程
        this.getAllData();
        // this.mustData()
        
    },
    methods:{
        mustData(){       //不可修改
            let orgId = localStorage.getItem('orgId') || 'AABBCCDDEEFFGGHH66'
            axios_get('/member-server/api/register/config/list',
                {
                    organizationId: orgId,
                    canModify: -1
                }
            ).then((res)=>{
                for(let item of res.data){
                    this.mustList.push({...item,disable:true})
                }
                let arr = [];

                let emptyList = (this.mustList.length !== 0) || (this.infoList.length !== 0)
                if (emptyList) {
                    this.Data = arr.concat(this.mustList,this.infoList)
                }
            }).catch(err=>{
                log(err)
            });
            
        },
        getAllData(){       //可修改
            let orgId = localStorage.getItem('orgId') || 'AABBCCDDEEFFGGHH66'
            axios_get('/member-server/api/register/config/list',
                {
                    organizationId: orgId,
                    canModify: 1
                }
                ).then((res)=>{
                this.infoList = [];
                for(let item of res.data){
                    this.infoList.push({...item,disable:false})
                }
                let arr = [];
                this.Data = arr.concat(this.mustList,this.infoList);
                this.getpreviewList();
            }).catch(err=>{
                console.log(err)
            });
            
        },
        
        //新需求变更
            postCenterSet(id,isShow){
                let DATA = {id: id,isShow: isShow}
                axios_post("/member-server/api/register/config/center/set",DATA)
                .then(res => {
                    if(res.code!==10000){
                        this.$Message.error(res.message);
                        return false;
                    }
                    this.$Message.success(res.message);
                    this.getAllData();
                })
            },
            postRegisterSet(id,isShow){
                let DATA = {id: id,isShow: isShow}
                axios_post("/member-server/api/register/config/register/set",DATA)
                .then(res => {
                    if(res.code!==10000){
                        this.$Message.error(res.message);
                        return false;
                    }
                    this.$Message.success(res.message);
                    this.getAllData();
                })
            },
            postRequiredSet(id,isShow){
                let DATA = {id: id,isShow: isShow}
                axios_post("/member-server/api/register/config/required/set",DATA)
                .then(res => {
                    if(res.code!==10000){
                        this.$Message.error(res.message);
                        return false;
                    }
                    this.$Message.success(res.message);
                    this.getAllData();
                })
            },
        //end
        getpreviewList(){
            let orgId = localStorage.getItem('orgId') || 'AABBCCDDEEFFGGHH66'
            const data = {organizationId:orgId}
            axios_get('/member-server/api/register/config/field/list',data,{headers:{'Content-Type':'application/json'}})
            .then((res)=>{
                if (res&&res.code === 10000) {
                    this.previewList = res.data
                    this.getFirstLast()
                } else {
                    this.$Message.warning(res.message)
                }
            })
        },
        getFirstLast() {
            let length = this.previewList.length
            if (length > 0) {
                let first = this.previewList[0]
                this.firstFieldId = first.id
                let last = this.previewList[length - 1]
                this.lastFieldId = last.id
            }
        },
        goDown(id){
            const data = {id:id,isUp: -1}
            axios_post('/member-server/api/register/config/upDown',data,{headers:{'Content-Type':'application/json'}})
            .then((res)=>{
                res.code !== 10000 && this.$Message.warning(res.message)
                res.code === 10000 && this.getpreviewList()
            })
        },
        goUp(id){
            const data = {id:id,isUp: 1}
            axios_post('/member-server/api/register/config/upDown',data,{headers:{'Content-Type':'application/json'}})
            .then((res)=>{
                res.code !== 10000 && this.$Message.warning(res.message)
                res.code === 10000 && this.getpreviewList()
            })
        },
        displayText(type) {
            let textList = {
                'papersNo': {
                    name: '证件号',
                    text: '322838473827383847',
                },
                'birthday': {
                    name: '生日',
                    text: '1991-01-01',
                },
                'maritalStatus': {
                    name: '婚姻状况',
                    text: '未婚',
                },
                'memberName': {
                    name: '姓名',
                    text: '杭州数理',
                },
                'sex': {
                    name: '性别',
                    text: '男',
                },
                'papersType': {
                    name: '证件类型',
                    text: '身份证',
                },
                'age': {
                    name: '年龄',
                    text: '23',
                },
                'phone': {
                    name: '手机号',
                    text: '139****7261',
                },
            }

            return textList[type].text
        },
        showIcon(id) {
            let showIconIds = [ 218, 222, 223]
            return showIconIds.includes(id)
        }
    }
}
</script>

<style  lang="scss" scoped>
    .all_box{
        background-color: white;
        box-shadow:0px 2px 12px 0px rgba(0,0,0,0.04);
        border-radius:16px;
        padding: 24px;
    }

    .right_box{
        padding-left: 24px;
    }

    .preview-container {
        width:377px;
        height: 812px;
        border-radius:24px;
        box-sizing: border-box;

        border: 1px solid #e8eaec;
        /*overflow: hidden;*/
    }

    .time-phone {
        width: 375px;
        height: 86px;
        border-radius: 24px 24px 0 0;
        background:url('../../../assets/images/member/phone_time.png') no-repeat 0 0;
        background-size:100%;
    }

    .person-info {
        position: relative;
        width: 375px;
        height: 146px;
        background:url('../../../assets/images/member/person_info.png') no-repeat 0 0;
        background-size:100%;

        padding: 34px 28px;
    }

    .user-photo {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        border: 1px solid white;

        vertical-align: middle;
        font-weight: bolder;
    }

    .nick-name {
        display: inline-block;
        margin-left: 16px;
        font-size:16px;
        font-weight:bold;
        color:rgba(82,82,82,1);
        line-height:18px;

        vertical-align: middle;
    }

    .preview-list {
        z-index: 2;
        position: relative;
        top: -20px;
        padding: 20px;

        width:375px;
        height:490px;
        background:rgba(255,255,255,1);
        border-radius:24px 24px 0px 0px;
    }

    .field {
        display: flex;
        margin-bottom: 12px;
        justify-content: space-between;
        border-radius:4px;
        border:1px solid rgba(226,226,226,1);
        padding: 12px 14px;
    }

    .field-name {
        height:20px;
        font-size:14px;
        font-weight:500;
        color:rgba(194,194,194,1);

        line-height:20px;
    }

    .field-value {
        font-size:14px;
        font-weight:400;
        color:rgba(43,43,43,1);
        line-height:20px;
    }
    .required-mark {
        font-size:16px;
        font-weight:400;
        color:rgba(255,76,76,1);
        line-height:20px;

        padding-right: 4px;
    }

    .phone-bottom {
        width: 375px;
        height: 86px;
        background:url('../../../assets/images/member/phone_bottom.png') no-repeat 0 0;
        background-size:100%;
        border-radius:0 0 24px 24px;

        box-shadow: 0px -10px 30px 0px rgba(136, 129, 129, 0.15);
    }

    .action-text {
        cursor: pointer;
        color: #FF8C08;
    }

    .fontsetting{
        height:40px;
        line-height:40px;
        border-bottom:1px solid #dcdee2;
        padding-left:30px;
    }
    .phone_title{
        text-align:center;
        margin-top:40px;
    }
    .info_box{
        width:250px;
        height:450px;
        margin:0 auto;
        overflow:hidden;
    }
    .info_title{
        height:40px;
        line-height:40px;
        margin-bottom:10px;
        text-align:center;
    }
    .info_msg{
        width:200px;
        height:40px;
        line-height:40px;
        margin:0 auto;
        margin-bottom:10px;
        padding:0 10px;
        background:#ffffff;
    }
    .table_box{
        text-align:center;
    }
    
    .table_body{
        border-top:1px solid #dcdee2;
    }
    .table_cell{
        height:40px;
        line-height:40px;
        border-right:1px solid #dcdee2;
    }
    .table_cell:last-child{
        border:none;
    }
    .left_btn,.right_btn{
        display:inline-block;
    }
    .left_btn{
        margin-right:15px;
    }

    .field-value {
        vertical-align: middle;
        line-height: 20px;
        /* height: 20px; */
        display: inline-block;
        & > span {
          vertical-align: middle;
        }

        & > .icon {
            font-size: 20px;
            color: #8F8F91;
            vertical-align: middle;
        }
    }
</style>
