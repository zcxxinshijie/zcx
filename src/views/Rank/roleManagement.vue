<template>
  <div class="subpage-layout">
    <div class="subpage-title">
      角色管理
    </div>
    <div class="subpage-content">
      <!-- 以下是表单部分 -->
      <div class="form-area" style="width:100%" >
        <div class="form-row" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
          <div class="label-4-input">
            <label>角色名称</label>
            <a-input v-model="rolename"/>
          </div>
          <div class="button">
            <a-button type="primary" @click="search">搜索</a-button>
            <a-button style="background-color:#F5F5F5;border:none;color:#666666;" @click="resetInfo">重置</a-button>
          </div>
        </div>
        <div>
          <a-button @click="show3" style="padding: 0 13px;color:#1079FA;background-color:#E3F0FD;border:none"><img src="../../assets/role.png" style="margin-right:5px;vertical-align:bottom;" width='20px' height="20px"/>新建角色</a-button>
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
                  .split(new RegExp(`(${form[column.dataIndex].trim()})`, 'i'))"
              >
                <mark
                  v-if="fragment.toLowerCase() === form[column.dataIndex].trim().toLowerCase()"
                  :key="i"
                  class="highlight"
                  >{{ fragment }}</mark
                >
                <template v-else>{{ fragment }}</template>
              </template>
            </span>
            <template v-else>
              {{ text }}
            </template>
          </template>
          <template slot="operation" slot-scope="text, record">
            <div style="display:flex;justify-content:space-around">
              <a-button @click="show1" style="padding:0 15px;background-color:#F5F5F5;color:#1079FA;border-color:#F5F5F5;">
                查看
              </a-button>
              <a-popconfirm
                v-if="data.length"
                title="确定删除该角色?"
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
    </div>
<!-- 点击查看到弹窗 -->
    <a-modal class="modal-430" v-model="visible1" title="角色详情" width="400px" @ok="handleOk" cancelText="关闭" okText="提交" centered>
      <p>此部分显示什么还不是很清楚</p>
    </a-modal>

    <a-modal class="modal-430" v-model="visible3" title="新建角色" width="400px" @cancel="handlefound" :maskStyle="{'background-color':'rgb(0,0,0,0.2)'}" centered>
      <template slot="footer">
        <a-button key="back" @click="handlefound" >
          关闭
        </a-button>
        <a-button key="submit" type="primary"  @click="submit" class="primary-btn">
          提交
        </a-button>
      </template>
      <a-form-model :model="form2" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="角色名称">
          <a-input v-model="form.rolename" style="width:240px"/>
        </a-form-model-item>
        <a-form-model-item label="功能模块">
          <a-checkbox-group v-model="form2.function">
            <a-row style="margin:10px 0;">
              <a-col :span="12">  
              <a-checkbox value="1" name="function">
                总览
              </a-checkbox>
              </a-col>
              <a-col :span="12">
              <a-checkbox value="2" name="function">
                用户管理
              </a-checkbox>
              </a-col>
            </a-row>
            <a-row style="margin:10px 0;">
            <a-col :span="12">
            <a-checkbox value="3" name="function">
              门店管理
            </a-checkbox>
            </a-col>
            <a-col :span="12">
            <a-checkbox value="4" name="function">
              订单管理
            </a-checkbox>
            </a-col>
            </a-row>
            <a-row style="margin:10px 0;">
            <a-col :span="12">
            <a-checkbox value="5" name="function">
              训练管理
            </a-checkbox>
            </a-col>
            <a-col :span="12">
            <a-checkbox value="6" name="function">
              数据报表
            </a-checkbox>
            </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-model-item>
      </a-form-model>  
    </a-modal>
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
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    align:'center',
    width:80,
  },
  {
    title: '角色名',
    dataIndex: 'rolename',
    key: 'rolename',
    align:'center',
    scopedSlots: { customRender: 'customRender' },
    width:110,
  },
  {
    title: '功能模块',
    key: 'function',
    align:'center',
    dataIndex: 'function',
    width:500,
  },
  {
    title: '成员人数',
    dataIndex: 'member',
    key: 'member',
    align:'center',
    width:100,
  },
  {
    title: '创建人',
    dataIndex: 'creator',
    key: 'creator',
    align:'center',
    width:95,
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
    fixed:'left',
  },
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    align:'center',
    width:80,
    fixed:'left',
  },
  {
    title: '角色名',
    dataIndex: 'rolename',
    key: 'rolename',
    align:'center',
    scopedSlots: { customRender: 'customRender' },
    width:110,
  },
  {
    title: '功能模块',
    key: 'function',
    align:'center',
    dataIndex: 'function',
    width:500,
  },
  {
    title: '成员人数',
    dataIndex: 'member',
    key: 'member',
    align:'center',
    width:100,
  },
  {
    title: '创建人',
    dataIndex: 'creator',
    key: 'creator',
    align:'center',
    width:95,
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
const data =[
  {
    key:'0',
    num:'1',
    id:'01',
    rolename:'超级管理员',
    function:'全部',
    member:'2',
    creator:'郑屹',
    time:formatTime(time)

  },
  {
    key:'1',
    num:'2',
    id:'02',
    rolename:'渠道',
    function:'总览，用户管理，门店管理，订单管理，训练管理，数据报表',
    member:'7',
    creator:'郑屹',
    time:formatTime(time)

  },
  {
    key:'2',
    num:'3',
    id:'03',
    rolename:'门店',
    function:'总览，用户管理，订单管理，训练管理，数据报表',
    member:'13',
    creator:'郑屹',
    time:formatTime(time)

  },
  {
    key:'3',
    num:'4',
    id:'04',
    rolename:'销售',
    function:'用户管理，训练管理，数据报表',
    member:'3',
    creator:'郑屹',
    time:formatTime(time)

  },
  {
    key:'4',
    num:'5',
    id:'05',
    rolename:'技术支持',
    function:'用户管理，训练管理，数据报表',
    member:'4',
    creator:'郑屹',
    time:formatTime(time)

  },

]

export default {
  data() {
    return {
      data:data,
      visible1:false,
      visible2:false,
      visible3:false,
      rolename:'',
      function:'',
      pageSize:10,
      pagination:{pageSize:10},
      searching:false,
      form:{
        rolename:''
      },
      form2:{
        rolename:'',
        function:''
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      screenWidth:null,
      screenHeight:null,
    }
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
      return this.screenWidth < 1520 ? columns2 : columns1;
    }
  },
  methods: {
    search:function(){
      this.form.rolename = this.rolename;
      let index = ['rolename'];
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
        rolename:''
      };
      this.rolename = '';
    },
    onDelete(key) {
      const data = [...this.data];
      this.data = data.filter(item => item.key !== key);
    },
    show1() {
      this.visible1 = true;
    },
    show2() {
      this.visible2 = true;
    },
    show3() {
      this.visible3 = true;
    },
    handleOk(e) {
      console.log(e);
      this.visible1 = false;
      this.visible2 = false;
      
    },
    handlefound(){
      this.visible3 = false
    },
    submit(){
      this.visible3 = false
    }
  },
}
</script>
<style scoped>
.form-row{
  padding-top:5px;
}
@media screen and (min-width: 1024px) {
  .form-row{
    width:50%;
  }
  .label-4-input{
    display:flex;
    align-items:center;
  }
  .label-4-input label{
    margin-right:15px;
    font-weight:bold;
  }
  .label-4-input input{
    width:130px;
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
    width:40%;
  }
  .label-4-input{
    display:flex;
    align-items:center;
  }
  .label-4-input label{
    margin-right:18px;
    font-weight:bold;
  }
  .label-4-input input{
    width:150px;
  }
  .button{
    display:flex;
    width:130px;
    justify-content: space-between;
  }
  .ant-btn{
    padding:0 13px;
  }
}
@media screen and (min-width: 1440px) {
  .form-row{
    width:40%;
  }
  .label-4-input{
    display:flex;
    align-items:center;
  }
  .label-4-input label{
    margin-right:20px;
    font-weight:bold;
  }
  .label-4-input input{
    width:170px;
  }
  .button{
    display:flex;
    width:145px;
    justify-content: space-between;
  }
  .ant-btn{
    padding:0 15px;
  }
}
@media screen and (min-width: 1680px) {
  .form-row{
    width:35%;
  }
  .label-4-input{
    display:flex;
    align-items:center;
  }
  .label-4-input label{
    margin-right:20px;
    font-weight:bold;
  }
  .label-4-input input{
    width:190px;
  }
  .button{
    display:flex;
    width:155px;
    justify-content: space-between;
  }
  .ant-btn{
    padding:0 18px;
  }
}
@media screen and (min-width: 1920px) {
  .form-row{
    width:30%;
  }
  .label-4-input{
    display:flex;
    align-items:center;
  }
  .label-4-input label{
    margin-right:20px;
    font-weight:bold;
  }
  .label-4-input input{
    width:200px;
  }
  .button{
    display:flex;
    width:165px;
    justify-content: space-between;
  }
  .ant-btn{
    padding:0 20px;
  }
}
</style>