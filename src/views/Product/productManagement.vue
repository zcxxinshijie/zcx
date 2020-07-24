<template>
  <div class="subpage-layout">
    <div class="subpage-title">
      产品管理
    </div>

    <div class="subpage-content">
      <!--      请在此处填充内容-->
      <div class="form-area" style="width:100%">
        <div class="form-row" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
          <div class="label-4-input">
            <label>产品名称</label>
            <a-input v-model="form.Proname"/>
          </div>
          <div class="label-4-input">
            <label>产品ID</label>
            <a-input v-model="form.ProID"/>
          </div>
          <div class="label-2-select">
            <label>状态</label>
            <a-select v-model="selected" placeholder="全部" @change="handleChange" :labelInValue="true">
              <a-select-option value="start">启用</a-select-option>
              <a-select-option value="stop">停用</a-select-option>
            </a-select>
          </div>
          <div class="button">
            <a-button type="primary" @click="search">搜索</a-button>
            <a-button style="background-color:#F5F5F5;border:none;color:#666666;" @click="resetInfo">重置</a-button>
          </div>
        </div>
        <div>
          <a-button style="padding: 0 13px;color:#1079FA;background-color:#E3F0FD;border:none" @click="newproduct"><img src="../../assets/product.png" style="margin-right:5px;vertical-align:bottom;" width='20px' height="20px"/>新建产品</a-button>
        </div>
      </div>



      <div class="table-area" style="width:100%;margin-top:20px">
        <a-table style="width:100%;height:100%"
                 :columns="columns"
                 :data-source="data"
                 :pagination="pagination"
                 bordered>
          <template slot="renderStatus" slot-scope="text">
            <span v-if="text === '启用'" style="color:#8ACD2B">{{text}}</span>
            <span v-if="text === '停用'" style="color:#F55943">{{text}}</span>
          </template>
          <template slot="customRender" slot-scope="text,record,index,column">
            <span v-if="searching && form[column.dataIndex].trim() !== ''">
              <template v-for="(fragment, i) in text .toString() .split(new RegExp(`(${form[column.dataIndex].trim()})`, 'i'))">
                <mark v-if="fragment.toLowerCase() === form[column.dataIndex].trim().toLowerCase()" :key="i" class="highlight">{{ fragment }}</mark>
                <template v-else>{{ fragment }}</template>
              </template>
            </span>
            <template v-else>
              {{ text }}
            </template>
          </template>
          <template slot="action" slot-scope="text,record,index">
            <div class="action-btn-layout" style="margin:0 auto;display:flex;justify-content:space-around">
              <a-button style="background-color:#F5F5F5;color:#1079FA;border-color:#F5F5F5; padding:0 15px;"  @click="showModal(record,index)">查看</a-button>
              <a-button type="danger" style="padding:0 15px;" @click="stopButton(record.key)" :id="record.key" v-if="record.state=='启用'" >停用</a-button>
              <a-button type="primary"  style="padding:0 15px;" @click="startButton(record.key)" :id="record.key" v-if="record.state=='停用'">启用</a-button>
            </div>
          </template>
        </a-table>
      </div>
      <a-modal
        class="modal-430"
        title="查看产品"
        :visible="visible1"
        :confirm-loading="confirmLoading1"
        centered
        @ok="handleOk1"
        @cancel="handleCancel1"
        cancelText="关闭"
        okText="提交"
        width= "400px"
        :maskStyle="{'background-color':'rgb(0,0,0,0.2)'}"
        :bodyStyle="{'padding-top':'30px','padding-bottom':'90px'}">
        <div class="modal-body" >
          <a-form-model 
            :model="form2" 
            style="width:360px;"
            :label-col="{span:6}" 
            :wrapper-col="{span:18}">
              <a-form-model-item  label="产品名称" >
                <a-input style="width: 240px;" v-model="form2.Proname"/>
              </a-form-model-item>
              <a-form-model-item  label="产品代码" >
                <a-input style="width: 240px;" v-model="form2.code"/>
              </a-form-model-item>
              <a-form-model-item  label="产品ID">
                <a-input style="width: 240px;" v-model="form2.ProID"/>
              </a-form-model-item>
              <a-form-model-item  label="状态" >
                <a-select placeholder="全部" :labelInValue="true"  :default-value="form2.state" @change="changeForm2State" style="width:240px;">
                  <a-select-option value="start">
                    启用
                  </a-select-option>
                  <a-select-option value="stop">
                    停用
                  </a-select-option>
              </a-select>
              </a-form-model-item>
          </a-form-model>
        </div>
      </a-modal>
<!-- 新建产品弹窗 -->
      <a-modal
        class="modal-430"
        title="新建产品"
        :visible="visible2"
        :confirm-loading="confirmLoading2"
        centered
        @ok="handleOk2"
        @cancel="handleCancel2"
        cancelText="关闭"
        okText="完成"
        width= "400px"
        :maskStyle="{'background-color':'rgb(0,0,0,0.2)'}"
        :bodyStyle="{'padding-top':'30px','padding-bottom':'90px'}">
        <div class="modal-body">
          <a-form-model 
            style="width:360px;"
            :label-col="{span:6}" 
            :wrapper-col="{span:18}">
            <a-form-item label="产品名称">
              <a-input type="text" placeholder="请输入产品名称" style="width: 240px" v-model="newproductName"/>
            </a-form-item>
            <a-form-item label="产品代码">
              <a-input placeholder="请输入产品代码" style="width: 240px;" v-model="newproductCode"/>
            </a-form-item>
            <a-form-model-item  label="产品ID">
                <a-input style="width: 240px;" v-model="newproductId" disabled/>
            </a-form-model-item>
            <a-form-item  label="状态">
              <a-select placeholder="全部"  @change="handleChange"  :labelInValue="true"  v-model="newState"  style="width:240px;">
                <a-select-option value="start">
                  启用
                </a-select-option>
                <a-select-option value="stop">
                  停用
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-form-model>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
  const columns = [
  {
    title: '序号',
    dataIndex: 'number',
    key: 'number',
    scopedSlots:{customRender:'number'},
    align:'center',
    width:65,
  },
  {
    title: '产品名称',
    dataIndex: 'Proname',
    key: 'Proname',
    align:'center',
    width:100,
  },
  {
    title: '产品代码',
    dataIndex: 'code',
    key: 'code',
    align:'center',
    width:100,
    //scopedSlots:{
	//customRender:'customRender'
    //}
  },
  {
    title: '产品ID',
    key: 'ProID',
    dataIndex: 'ProID',
    align:'center',
    width:90,
  },
  {
    title: '状态',
    key: 'state',
    dataIndex: 'state',
    align:'center',
    scopedSlots:{customRender:'renderStatus'},
    width:65,
  },
  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime',
    align:'center',
    width:160,
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    align:'center',
    width:150,
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
    let min = time.getMinutes();
    let sec = time.getSeconds();
    return `${year}/${month}/${date} ${hour}:${min}:${sec}`;
  }
  let ID=function () {
    let newID =data.length+1;
        if( newID < 10){
		return `CP-000${newID}`
        }
		if( newID < 100){
		return `CP-00${newID}`
		}
        if( newID < 1000){
		return `CP-0${newID}`
        }
        if( newID < 10000){
		return `CP-${newID}`
        }
  }
  const data = [
  {
    key:1,
    Proname:'复印机',
    code:'DYJ',
    ProID:'CP-0001',
    state:'启用',
    createTime:formatTime(time)
  },
  {
    key:2,
    Proname:'复印机',
    code:'DYJ',
    ProID:'CP-0002',
    state:'停用',
    createTime:formatTime(time)
  },
  {
    key:3,
    Proname:'复印机',
    code:'DYJ',
    ProID:'CP-0003',
    state:'启用',
    createTime:formatTime(time)
  },
  {
    key:4,
    Proname:'打印机',
    code:'DYJ',
    ProID:'CP-0004',
    state:'启用',
    createTime:formatTime(time)
  },
  {
    key:5,
    Proname:'2223',
    code:'DYJ',
    ProID:'CP-0005',
    state:'启用',
    createTime:formatTime(time)
  },
  {
    key:6,
    Proname:'打印机',
    code:'DYJ',
    ProID:'CP-0006',
    state:'启用',
    createTime:formatTime(time)
	},
  {
    key:7,
    Proname:'打印机',
    code:'DYJ',
    ProID:'CP-0007',
    state:'启用',
    createTime:formatTime(time)
  },
  {
    key:8,
    Proname:'打印机',
    code:'DYJ',
    ProID:'CP-0008',
    state:'启用',
    createTime:formatTime(time)
  },
  {
    key:9,
    Proname:'打印机',
    code:'DYJ',
    ProID:'CP-0009',
    state:'启用',
    createTime:formatTime(time)
  },
  {
    key:10,
    Proname:'打印机10',
    code:'DYJ',
    ProID:'CP-0010',
    state:'启用',
    createTime:formatTime(time)
  },
  {
    key:11,
    Proname:'打印机',
    code:'DYJ',
    ProID:'CP-0011',
    state:'停用',
    createTime:formatTime(time)
  },
  {
    key:12,
    Proname:'打印机',
    code:'DYJ',
    ProID:'CP-0012',
    state:'启用',
    createTime:formatTime(time)
  },
  {
    key:13,
    Proname:'打印机',
    code:'DYJ',
    ProID:'CP-0013',
    state:'启用',
    createTime:formatTime(time)
  },
  {
    key:14,
    Proname:'复印机',
    code:'DYJ',
    ProID:'CP-0014',
    state:'启用',
    createTime:formatTime(time)
  },
  {
    key:15,
    Proname:'打印机',
    code:'DYJ',
    ProID:'CP-0015',
    state:'启用',
    createTime:formatTime(time)
  },
  {
    key:16,
    Proname:'打印机',
    code:'DYJ',
    ProID:'CP-0016',
    state:'启用',
    createTime:formatTime(time)
  }
];	
  function addNumber(data){
    for(let i = 0;i<data.length;i++){
      data[i].number = i + 1;
    }
  }
  addNumber(data);

  export default {
    data(){
      return{
        form:{
          Proname:'',
          ProID:'',
        },
        form2:{
          Proname:'',
          code:'',
          state: '',
          PeoID:'',
        },
        data,
        columns,
        searching:false,
        pageSize:10,
        pagination:{pageSize:10},
        visible1: false,
        visible2: false,
        confirmLoading1: false,
        confirmLoading2: false,
        Label:'',
        selected:undefined,
		newproductName:'',
    newproductCode:'',
    newproductId:'CP-1234',
		newState:undefined,
		newproductID:null,
		Key:null,
		Time:undefined,

      }
    },
    created(){
    },
    methods:{

      //点击搜索按钮
      search:function(){
        this.searching = true;
        let search_data = data;
        let target1 = this.form['Proname'].trim();
		let target2 = this.form['ProID'].trim();
        let targetLabel=this.Label.trim();
        if( target1 !== ''){
          search_data = search_data.filter(value => {
            return value['Proname'].indexOf(target1) > -1;	
          })
        }
		if( target2 !== ''){
          search_data = search_data.filter(value => {
            return value['ProID'].indexOf(target2) > -1;	
          })
		}
        if(targetLabel!=''){
          search_data = search_data.filter(value => {
            return value['state'].indexOf(targetLabel) > -1;
          })
        }
      this.data = search_data;
      },
	//重置
      reset(){
        this.searching = false;
        this.data = data;
        this.Label='';
        this.form = {
          Proname:'',
          ProID:'',
        };
        this.selected=undefined;
      },

      handleChange(value) {
        this.Label=value.label;
        this.selected=value;
      },
      //控制对话框显示
      showModal(record,index) {
        this.visible1 = true;
		this.Key=record.key;
        this.form2.Proname=record.Proname;
        this.form2.code=record.code;
        this.form2.state=record.state === '启用' ? {key:"start",value:'启用' }: {key:"stop", value:'停用'};
        this.form2.ProID=record.ProID;
		this.Time=record.createTime;
        this.index=index;	
      },
      newproduct() {
        this.visible2 = true;
		this.newproductName='';
		this.newproductCode='';
		this.newState=undefined;
		this.newproductID='';
      },
      //查看弹窗修改完成
      handleOk1() {
		let item1={
          key:this.Key,
          Proname:this.form2.Proname,
          code:this.form2.code,
          state:this.form2.state,
          ProID:this.form2.ProID,
          createTime:this.Time,
          number:this.Key,
        };
        this.data.splice(this.Key-1,1,item1);

        this.confirmLoading1 = true;
        setTimeout(() => {
          this.visible1 = false;
          this.confirmLoading1 = false;
        }, 2000);
      },
//完成新建

      handleOk2() {
        let newproductID=ID();
        console.log(newproductID)
		let item2={
          key:this.data[this.data.length-1].key+1,
          Proname:this.newproductName,
          code:this.newproductCode,
          state:this.Label.trim(),
          ProID:newproductID,
          createTime:formatTime(time),
        };
        this.data.push(item2);
        this.data[this.data.length-1].number =this.data.length;
        console.log(data)
        //！！！此处代码有待修改！！！
        this.confirmLoading2 = true;
        setTimeout(() => {
          this.visible2 = false;
          this.confirmLoading2 = false;
        }, 2000);
      },
      //对话框点击取消按钮
      handleCancel1() {
        this.visible1 = false;
      },
      handleCancel2() {
        this.visible2 = false;
      },
			//停用启用按钮
      stopButton(key){
        const data = [...this.data];
        const check = data.filter(item => item.key== key);
        let obj=document.getElementById(key);
          check[0].state='停用';
          obj.innerHTML='启用';
      },
      startButton(key){
        const data = [...this.data];
        const check = data.filter(item => item.key== key);
        let obj=document.getElementById(key);
        check[0].state='启用';
        obj.innerHTML='停用';
      },
      changeForm2State(value){  //记录form2状态的改变
        console.log(value);
        this.form2.state = value;
        console.log(this.form2.state);
      }
    }
  }
</script>

<style scoped>
.form-row{
  padding-top:5px;
}
  .highlight {
    background-color: rgb(253, 245, 1);
    padding: 0px;
  }
  @media screen and (min-width: 1024px) {
    .form-row{
      width:95%;
    }
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
    .action-btn-layout{
      width:100%;
    }
  }
  
  @media screen and (min-width: 1280px) {
    .form-row{
      width:80%;
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
    .action-btn-layout{
      width:90%;
    }
  }
  @media screen and (min-width: 1440px) {
    .form-row{
      width:80%;
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
    .action-btn-layout{
      width:80%;
    }
  }
  @media screen and (min-width: 1680px) {
    .form-row{
      width:70%;
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
    .action-btn-layout{
      width:70%;
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
    .ant-select{
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
    .action-btn-layout{
      width:60%;
    }
  }
</style>