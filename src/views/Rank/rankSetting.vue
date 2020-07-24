<template>
  <div class="subpage-layout">
    <div class="subpage-title">
      权限分配
    </div>
    <div class="subpage-content">
      <!-- 以下是表单部分 -->
      <div class="form-area" style="width:100%" >
        <div class="form-row" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
          <div class="label-4-input">
            <label>手机号</label>
            <a-input v-model="form1.tel"/>
          </div>
          <div class="label-4-input">
            <label>登录名</label>
            <a-input v-model="form1.loginname"/>
          </div>
          <div class="label-4-input">
            <label>昵称</label>
            <a-input v-model="form1.nickname"/>
          </div>
          <div class="button">
            <a-button type="primary" @click="search">搜索</a-button>
            <a-button style="background-color:#F5F5F5;border:none;color:#666666;" @click="resetInfo">重置</a-button>
          </div>
        </div>
        <div>
          <a-button style="padding: 0 13px;color:#1079FA;background-color:#E3F0FD;border:none" @click="show3"><img src="../../assets/roleSetting.png" style="margin-right:5px;vertical-align:bottom;" width='20px' height="20px"/>新建分配</a-button>
        </div>
      </div>
    
      <div class="table-area" style="width:100%;margin-top:20px">
        <a-table style="width:100%;height:100%" 
                :columns="columns" 
                :data-source="data" 
                :pagination="pagination"
                :scroll="{x:true}"
                bordered>
          <template slot="customRender" slot-scope="text,record,index,column">
            <span v-if="searching && form[column.dataIndex].trim() !== ''">
              <template
                v-for="(fragment, i) in text
                  .toString()
                  .split(new RegExp(`(${form[column.dataIndex].trim()})`, 'i'))">
                <mark
                  v-if="fragment.toLowerCase() === form[column.dataIndex].trim().toLowerCase()"
                  :key="i"
                  class="highlight">
                  {{ fragment }}
                </mark>
                <template v-else>{{ fragment }}</template>
              </template>
            </span>
            <template v-else>
              {{ text }}
            </template>
          </template>
          <template slot="renderStatus" slot-scope="text">
            <span v-if="text === '正常'" style="color:#8ACD2B">{{text}}</span>
            <span v-if="text === '异常'" style="color:#F55943">{{text}}</span>
          </template>
          <template slot="renderNickname" slot-scope="text">
            <span v-if="text.length <= 5 && screenWidth <= 1450">{{text}}</span>
            <a-tooltip v-else-if="text.length > 5 && screenWidth <= 1450">
              <template slot="title">
                {{text}}
              </template>
              {{text.slice(0,5)}}...
            </a-tooltip>
            <span v-else-if="text.length <= 7 && screenWidth <= 1650">{{text}}</span>
            <a-tooltip v-else-if="text.length > 7 && screenWidth <= 1650">
              <template slot="title">
                {{text}}
              </template>
              {{text.slice(0,7)}}...
            </a-tooltip>
            <span v-else-if="text.length <= 8 && screenWidth <= 1750">{{text}}</span>
            <a-tooltip v-else-if="text.length > 8 && screenWidth <= 1750">
              <template slot="title">
                {{text}}
              </template>
              {{text.slice(0,8)}}...
            </a-tooltip>
            <span v-else-if="text.length <= 9 && screenWidth <= 1900">{{text}}</span>
            <a-tooltip v-else-if="text.length > 9 && screenWidth <= 1900">
              <template slot="title">
                {{text}}
              </template>
              {{text.slice(0,9)}}...
            </a-tooltip>
            <span v-else-if="text.length <= 10 && screenWidth > 1900">{{text}}</span>
            <a-tooltip v-else-if="text.length > 10 && screenWidth > 1900">
              <template slot="title">
                {{text}}
              </template>
              {{text.slice(0,10)}}...
            </a-tooltip>
          </template>
          <template slot="operation" slot-scope="text,record,index" >
            <div class="table-btn-layout" style="margin:0 auto;display:flex;justify-content:space-around">
              <a-button type="primary" @click="show1(record,index)" style="padding:0 15px;background-color:#F5F5F5;color:#1079FA;border-color:#F5F5F5;">
                查看
              </a-button>
              <a-popconfirm
                    v-if="data.length"
                    title="请问确认删除该角色?"
                    okText="确定"
                    cancelText="取消"
                    @confirm="() => onDelete(record.key)"
                  >
                <a-button style="padding:0 15px;background-color:#FFDADA;color:#F55943;border:none">删除</a-button>
              </a-popconfirm>
            </div>
          </template>
        </a-table>
      </div>
      <!-- 点击查看到弹窗 -->
      <a-modal class="modal-430" v-model="model1visible" title="查看角色" width="400px" @ok="handleOk" okText="提交" cancelText="取消" centered>
        <a-form-model :model="form2" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="ID">
            <a-input v-model="form2.id" style="width:240px"/>
          </a-form-model-item>
          <a-form-model-item label="昵称">
            <a-input v-model="form2.nickname" style="width:240px"/>
          </a-form-model-item>
          <a-form-model-item label="登录名">
            <a-input v-model="form2.loginname" style="width:240px"/>
          </a-form-model-item>
          <a-form-model-item label="手机号">
            <a-input v-model="form2.tel" style="width:240px"/>
          </a-form-model-item>
          <a-form-model-item label="状态">
            <a-input v-model="form2.status" style="width:240px"/>
          </a-form-model-item>
          <a-form-model-item label="角色">
            <a-input v-model="form2.rolename" style="width:240px"/>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <!-- 点击删除的弹窗 -->
      <a-modal v-model="model2visible" title="删除角色" @ok="handleOk">
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </a-modal>
      <a-modal class="modal-430" v-model="model3visible" width="400px" title="新建分配" @ok="handleOk" centered>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </a-modal>
    </div>
  </div>
</template>

<script>
const columns1 = [
  {
    title:'序号',
    dataIndex:'num',
    key:'num',
    align:'center',
    width:65,
  },
  {
    title:'ID',
    dataIndex:'id',
    key:'id',
    align:'center',
    width:100,
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
    align:'center',
    scopedSlots: { customRender: 'renderNickname' },
    width:120,
  },
  {
    title: '登录名',
    dataIndex: 'loginname',
    key: 'loginname',
    align:'center',
    scopedSlots: { customRender: 'customRender' },
    width:120,
  },
  {
    title: '手机号',
    key: 'tel',
    dataIndex: 'tel',
    align:'center',
    scopedSlots: { customRender: 'customRender' },
    width:120,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align:'center',
    width:65,
  },
  {
    title: '角色',
    dataIndex: 'rolename',
    key: 'rolename',
    align:'center',
    width:100,
  },
  {
    title: '创建时间',
    dataIndex: 'time',
    key: 'time',
    align:'center',
    width:160,
  },
  {
    title: '操作',
    key: 'operation',
    align:'center',
    scopedSlots: { customRender: 'operation' },
    width:180,
  },
];
const columns2 = [
  {
    title:'序号',
    dataIndex:'num',
    key:'num',
    align:'center',
    width:65,
    fixed:'left'
  },
  {
    title:'ID',
    dataIndex:'id',
    key:'id',
    align:'center',
    width:100,
    fixed:'left'
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
    align:'center',
    scopedSlots: { customRender: 'renderNickname' },
    width:120,
  },
  {
    title: '登录名',
    dataIndex: 'loginname',
    key: 'loginname',
    align:'center',
    scopedSlots: { customRender: 'customRender' },
    width:120,
  },
  {
    title: '手机号',
    key: 'tel',
    dataIndex: 'tel',
    align:'center',
    scopedSlots: { customRender: 'customRender' },
    width:120,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align:'center',
    width:65,
  },
  {
    title: '角色',
    dataIndex: 'rolename',
    key: 'rolename',
    align:'center',
    width:100,
  },
  {
    title: '创建时间',
    dataIndex: 'time',
    key: 'time',
    align:'center',
    width:160,
  },
  {
    title: '操作',
    key: 'operation',
    align:'center',
    scopedSlots: { customRender: 'operation' },
    width:180,
    fixed:'right'
  },
];
const time = new Date();
let formatTime = function(time){
  let year = time.getFullYear();
  let month = time.getMonth();
  month = month < 10 ? `0${month}` : month;
  let date = time.getDate();
  date = data < 10 ? `0${date}` : date;
  let hour = time.getHours();
  hour = hour < 10 ? `0${hour}` : hour;
  let min = time.getMinutes();
  min = min < 10 ? `0${min}` : min;
  let sec = time.getSeconds();
  sec = sec < 10 ? `0${sec}` : sec;
  return `${year}/${month}/${date} ${hour}:${min}:${sec}`;
}
const data = [
  {
    key: '0',
    num:'1',
    id:'132',
    nickname: '我是超级管理员超级管理员超级管理员超级管理员超级管理员',
    loginname: '123456',
    tel: '12345678111',
    status: '正常',
    rolename:'超级管理员',
    time:formatTime(time),
  },
  {
    key: '1',
    num:'2',
    id:'132',
    nickname: '郑屹',
    loginname: '123456',
    tel: '12345678',
    status: '正常',
    rolename:'超级管理员',
    time:formatTime(time),
  },
  {
    key: '2',
    num:'3',
    id:'132',
    nickname: '郑屹',
    loginname: '123456',
    tel: '12345678',
    status: '正常',
    rolename:'超级管理员',
    time:formatTime(time),
  },
  {
    key: '3',
    num:'4',
    id:'132',
    nickname: '郑屹',
    loginname: '123456',
    tel: '12345678',
    status: '正常',
    rolename:'超级管理员',
    time:formatTime(time),
  },
  {
    key: '4',
    num:'5',
    id:'132',
    nickname: '郑屹',
    loginname: '123456',
    tel: '12345678',
    status: '正常',
    rolename:'超级管理员',
    time:formatTime(time),
  },
  {
    key: '5',
    num:'6',
    id:'132',
    nickname: '郑屹',
    loginname: '123456',
    tel: '12345678',
    status: '正常',
    rolename:'超级管理员',
    time:formatTime(time),
  },
  {
    key: '6',
    num:'7',
    id:'132',
    nickname: '郑屹',
    loginname: '123456',
    tel: '12345678',
    status: '正常',
    rolename:'超级管理员',
    time:formatTime(time),
  },
  {
    key: '7',
    num:'8',
    id:'132',
    nickname: '郑屹',
    loginname: '123456',
    tel: '12345678',
    status: '正常',
    rolename:'超级管理员',
    time:formatTime(time),
  },
  {
    key: '8',
    num:'9',
    id:'132',
    nickname: '郑屹',
    loginname: '123456',
    tel: '12345678',
    status: '正常',
    rolename:'超级管理员',
    time:formatTime(time),
  },
  {
    key: '9',
    num:'10',
    id:'132',
    nickname: '郑屹',
    loginname: '123456',
    tel: '12345678',
    status: '正常',
    rolename:'超级管理员',
    time:formatTime(time),
  },
  {
    key: '10',
    num:'11',
    id:'132',
    nickname: '郑屹',
    loginname: '123456',
    tel: '12345678',
    status: '正常',
    rolename:'超级管理员',
    time:formatTime(time),
  },
  {
    key: '11',
    num:'12',
    id:'132',
    nickname: '郑屹',
    loginname: '123456',
    tel: '12345678',
    status: '正常',
    rolename:'超级管理员',
    time:formatTime(time),
  },
  {
    key: '12',
    num:'13',
    id:'132',
    nickname: '郑屹',
    loginname: '123456',
    tel: '12345678',
    status: '正常',
    rolename:'超级管理员',
    time:formatTime(time),
  },
  {
    key: '13',
    num:'14',
    id:'132',
    nickname: '郑屹',
    loginname: '123456',
    tel: '12345678',
    status: '正常',
    rolename:'超级管理员',
    time:formatTime(time),
  },
  
];

export default {
  data() {
    return {
      data:data,
      index:-1,
      pageSize:10,
      searching:false,
      pagination:{pageSize:10},
      model1visible: false,
      model2visible: false,
      model3visible: false,
      form:{
            tel:"",
            loginname:'',
            nickname:'',
      },
      form1:{
            tel:"",
            loginname:'',
            nickname:'',
      },
      form2:{tel:"",
            loginname:'',
            nickname:'',
            id:'',
            rolename:'',
            status:'',
        },
      
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      screenWidth:null,
      screenHeight:null,      
    };
  },
  mounted() {
    this.screenWidth = document.body.clientWidth;
    this.screenHeight = document.body.clientHeight;
    window.onresize = (() => {
      let timer = null;
      return ()=>{
        if(!timer){
          timer = setTimeout(()=>{
            this.screenWidth = document.body.clientWidth;
            this.screenHeight = document.body.clientHeight;
            timer = null;
          },500);
        }
      }
    })();
  },
  computed:{
    columns:function(){
      return this.screenWidth < 1300 ? columns2 : columns1;
    }
  },
  methods: {
    //搜索
    search:function(){
      console.log(this.form1),
      this.form.tel = this.form1.tel;
      this.form.loginname = this.form1.loginname;
      this.form.nickname = this.form1.nickname;
      let index = ['tel','loginname','nickname',];
      let search_data = data, i = 0;
      while(i < index.length){
        let target = this.form[index[i]].trim();
        if( target !== ''){
          search_data = search_data.filter(value => {
            return value[index[i]].indexOf(target) > -1;
          })
        }
        i++;
      }
      this.searching = true;
      this.data = search_data;
    },
    reset(){
      this.searching = false;
      this.data = data;
      this.form = {
        tel:'',
        loginname:'',
        nickname:'',
      };
      this.form1.tel = '';
      this.form1.loginname = '';
      this.form1.nickname = '';
    },
    onDelete(key) {
      const data = [...this.data];
      this.data = data.filter(item => item.key !== key);
    },

   show1(record,index) {
      this.model1visible = true;
      this.form2.loginname=record.loginname;
      this.form2.nickname=record.nickname;
      this.form2.tel=record.tel;
      this.form2.id=record.id;
      this.form2.status=record.status;
      this.form2.rolename=record.rolename;
      this.index=index;
    },
    show2() {
      this.model2visible = true;
    },
    show3() {
      this.model3visible = true;
    },
    handleOk(e) {
      console.log(e);
      this.model1visible = false;
      this.model2visible = false;
      this.model3visible = false;
    },
  },
};
</script>
<style scoped>
.form-row{
  padding-top:5px;
  padding-right:5px;
}
@media screen and (min-width: 1024px) {
  .label-3-input label, .label-4-input label{
    margin-right:8px;
    font-weight:bold;
  }
  .label-4-input input{
    width:130px;
  }
  .label-4-select label, .label-2-select label{
    margin-right:8px;
    font-weight:bold;
  }
  .label-2-select .ant-select{
    width:100px;
  }
  .button{
    display:flex;
    width:120px;
    justify-content: space-between;
  }
  .ant-btn{
    padding:0 10px;
  }
}

@media screen and (min-width: 1280px) {
  .form-row{
    width:90%;
  }
  .label-3-input,.label-4-input{
    display:flex;
    align-items:center;
  }
  .label-3-input label, .label-4-input label{
    margin-right:10px;
    font-weight:bold;
  }
  .label-4-input input{
    width:150px;
  }
  .label-4-select, .label-2-select{
    display:flex;
    align-items:center;
  }
  .label-4-select label, .label-2-select label{
    margin-right:10px;
    font-weight:bold;
  }
  .label-2-select .ant-select{
    width:120px;
  }
  .button{
    display:flex;
    width:140px;
    justify-content: space-between;
  }
  .ant-btn{
    padding:0 15px;
  }
  .table-btn-layout{
    width:90%
  }
}
@media screen and (min-width: 1440px) {
  .form-row{
    width:90%;
  }
  .label-3-input,.label-4-input{
    display:flex;
    align-items:center;
  }
  .label-3-input label, .label-4-input label{
    margin-right:13px;
    font-weight:bold;
  }
  .label-4-input input{
    width:170px;
  }
  .label-4-select, .label-2-select{
    display:flex;
    align-items:center;
  }
  .label-4-select label, .label-2-select label{
    margin-right:13px;
    font-weight:bold;
  }
  .label-2-select .ant-select{
    width:140px;
  }
  .button{
    display:flex;
    width:160px;
    justify-content: space-between;
  }
  .ant-btn{
    padding:0 18px;
  }
  .table-btn-layout{
    width:80%
  }
}
@media screen and (min-width: 1680px) {
  .form-row{
    width:80%;
  }
  .label-3-input,.label-4-input{
    display:flex;
    align-items:center;
  }
  .label-3-input label, .label-4-input label{
    margin-right:15px;
    font-weight:bold;
  }
  .label-4-input input{
    width:190px;
  }
  .label-4-select, .label-2-select{
    display:flex;
    align-items:center;
  }
  .label-4-select label, .label-2-select label{
    margin-right:15px;
    font-weight:bold;
  }
  .label-2-select .ant-select{
    width:160px;
  }
  .button{
    display:flex;
    width:170px;
    justify-content: space-between;
  }
  .ant-btn{
    padding:0 20px;
  }
  .table-btn-layout{
    width:70%
  }
}
@media screen and (min-width: 1920px) {
  .form-row{
    width:70%;
  }
  .label-3-input,.label-4-input{
    display:flex;
    align-items:center;
  }
  .label-3-input label, .label-4-input label{
    margin-right:20px;
    font-weight:bold;
  }
  .label-4-input input{
    width:210px;
  }
  .label-4-select, .label-2-select{
    display:flex;
    align-items:center;
  }
  .label-4-select label, .label-2-select label{
    margin-right:20px;
    font-weight:bold;
  }
  .ant-select-selection{
    width:180px;
  }
  .button{
    display:flex;
    width:170px;
    justify-content: space-between;
  }
  .ant-btn{
    padding:0 20px;
  }
  .table-btn-layout{
    width:60%
  }
}
</style>