<template>
  <div class="subpage-layout">
    <div class="subpage-title">
      价格管理
    </div>
    <div class="subpage-content" >
<!--      请在此处填充内容-->
<!--      表格上方内容-->
      <div class="form-area" style="width:100%" >
        <div class="form-row" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
          <div class="label-2-input">
            <label>配件名称</label>
            <a-input v-model="form.name"/>
          </div>
          <div class="button">
            <a-button type="primary"
                      @click="search">
              搜索
            </a-button>
            <a-button style="background-color:#F5F5F5;border:none;color:#666666;" @click="reset">重置</a-button>
          </div>
        </div>
        <div>
          <a-button @click="createPrice" style="padding: 0 13px;color:#1079FA;background-color:#E3F0FD;border:none"><img src="../../assets/product.png" style="margin-right:5px;vertical-align:bottom;" width='20px' height="20px"/>新建产品</a-button>
        </div>
      </div>
<!--      表格内容-->
      <div class="table-area" style="width:100%;margin-top:20px;">
        <a-table style="width:100%;height:100%;"
                 :columns="columns"
                 :data-source="this.data"
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
          <template slot="renderStatus" slot-scope="text">
            <span v-if="text === '出售中'" style="color:#8ACD2B">{{text}}</span>
            <span v-if="text === '停售'" style="color:#F55943">{{text}}</span>
          </template>
          <templet slot="action" slot-scope="record">
            <div class="action-btn-layout" style="margin:0 auto;display:flex;justify-content:space-around;">
              <a-button style="padding:0 15px;background-color:#F5F5F5;color:#1079FA;border-color:#F5F5F5;"
                      @click="()=> showModal(record.id)">
                查看
              </a-button>
              <a-button style="padding:0 15px;background-color:#E3F0FD;color:#1079FA;border:none;"
                        @click="()=>upButton(record.id)"
                        :id="record.id"
                        v-if="record.status=='停售'">上架</a-button>
              <a-button style="padding:0 15px;background-color:#FFDADA;color:#F55943;border:none;"
                        @click="()=>downButton(record.id)"
                        :id="record.id"
                        v-if="record.status=='出售中'">下架</a-button>
            </div>
          </templet>
        </a-table>
      </div>
<!--      查看订单详情-->
      <a-modal
        class="modal-430"
        title="订单详情"
        :visible="visible"
        :confirm-loading="confirmLoading"
        centered
        width="400px"
        @ok="handleOk"
        @cancel="handleCancel"
        cancelText="关闭"
        okText="修改"
        :maskStyle="{'background-color':'rgb(0,0,0,0.2)'}"
        :bodyStyle="{'width':'400px','padding-top':'30px','padding-bottom':'60px',
                      'font-family': 'PingFangSC-Regular','font-size': '14px',
                      'font-weight':'Regular'}">
        <div class="modal-body">
          <a-form-model style="width:360px"
                        :labelCol="{span:6}"
                        :wrapperCol="{span:18}"
                        :rules="checkRules"
                        :model="checkForm">
            <a-form-model-item
              label="销售配件">
              <a-input style="width:240px" v-model="parts" default="this.parts"/>
            </a-form-model-item>
            <a-form-model-item label="押金"
                         prop="deposit">
              <a-input style="width:240px"
                       v-model="checkForm.deposit"/>
            </a-form-model-item>
            <a-form-model-item label="进货价格"
                         prop="inPrice">
              <a-input style="width:240px"
                       v-model="checkForm.inPrice"/>
            </a-form-model-item>
            <a-form-model-item label="实际价格"
                         prop="realPrice">
              <a-input style="width:240px"
                       v-model="checkForm.realPrice"/>
            </a-form-model-item>
          </a-form-model>
        </div>
      </a-modal>
<!--      新建配件-->
      <a-modal
        class="modal-430"
        title="新建配件"
        :visible="newVisible"
        :confirm-loading="confirmLoading"
        centered
        width="400px"
        @ok="createOk"
        @cancel="createCancel"
        cancelText="关闭"
        okText="新建"
        :maskStyle="{'background-color':'rgb(0,0,0,0.2)'}"
        :bodyStyle="{'width':'400px','padding-top':'30px','padding-bottom':'60px',
                      'font-family': 'PingFangSC-Regular','font-size': '14px',
                      'font-weight':'Regular'}">
        <div class="modal-body">
           <a-form-model style="width:360px"
                         :labelCol="{span:6}"
                         :wrapperCol="{span:18}"
                         :rules="createCheckRules"
                         :model="createCheckForm">
            <a-form-model-item label="销售配件">
              <a-input style="width:240px" v-model="newParts"/>
            </a-form-model-item>
            <a-form-model-item label="押金"
                         prop="newDeposit">
              <a-input style="width:240px"
                       v-model="createCheckForm.newDeposit"/>
            </a-form-model-item>
            <a-form-model-item label="进货价格"
                         prop="newInPrice">
              <a-input style="width:240px"
                       v-model="createCheckForm.newInPrice"/>
            </a-form-model-item>
            <a-form-model-item label="实际价格"
                         prop="newRealPrice">
              <a-input style="width:240px"
                       v-model="createCheckForm.newRealPrice"/>
            </a-form-model-item>
          </a-form-model>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  // const columns1 = [
  //   {
  //     title: '序号',
  //     dataIndex: 'number',
  //     key: 'number',
  //     scopedSlots:{customRender:'number'},
  //     align:'center',
  //     width:65,
  //   },
  //   {
  //     title: '销售配件',
  //     dataIndex: 'parts',
  //     key: 'parts',
  //     align:'center',
  //     scopedSlots:{
  //       customRender:'customRender'
  //     },
  //     width:110,
  //   },
  //   {
  //     title: '押金',
  //     dataIndex: 'deposit',
  //     key: 'deposit',
  //     align:'center',
  //     width:90,
  //   },
  //   {
  //     title: '进货价格',
  //     key: 'inPrice',
  //     dataIndex: 'inPrice',
  //     align:'center',
  //     width:100,
  //   },
  //   {
  //     title: '实际价格',
  //     key: 'realPrice',
  //     dataIndex: 'realPrice',
  //     align:'center',
  //     width:100,
  //   },
  //   {
  //     title: '状态',
  //     key: 'status',
  //     dataIndex: 'status',
  //     align:'center',
  //     scopedSlots:{
  //       customRender:'renderStatus'
  //     },
  //     width:90,
  //   },
  //   {
  //     title: '创建时间',
  //     key: 'createTime',
  //     dataIndex: 'createTime',
  //     align:'center',
  //     width:180,
  //   },
  //   {
  //     title: '操作',
  //     key: 'action',
  //     scopedSlots: { customRender: 'action' },
  //     align:'center',
  //     width:180
  //   },
  // ];
  const columns1 = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      scopedSlots:{customRender:'id'},
      align:'center',
      width:65,
    },
    {
      title: '销售配件',
      dataIndex: 'name',
      key: 'name',
      align:'center',
      scopedSlots:{
        customRender:'customRender'
      },
      width:110,
    },
    {
      title: '押金',
      dataIndex: 'cash_pledge',
      key: 'cash_pledge',
      align:'center',
      width:90,
    },
    {
      title: '进货价格',
      key: 'prime_cost',
      dataIndex: 'prime_cost',
      align:'center',
      width:100,
    },
    {
      title: '实际价格',
      key: 'real_price',
      dataIndex: 'real_price',
      align:'center',
      width:100,
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      align:'center',
      scopedSlots:{
        customRender:'renderStatus'
      },
      width:90,
    },
    {
      title: '创建时间',
      key: 'createTime',
      dataIndex: 'createTime',
      align:'center',
      width:180,
    },
    {
      title: '操作',
      key: 'action',
      scopedSlots: { customRender: 'action' },
      align:'center',
      width:180
    },
  ];
  // const columns2 = [
  //   {
  //     title: '序号',
  //     dataIndex: 'number',
  //     key: 'number',
  //     scopedSlots:{customRender:'number'},
  //     align:'center',
  //     width:65,
  //     fixed:'left',
  //   },
  //   {
  //     title: '销售配件',
  //     dataIndex: 'parts',
  //     key: 'parts',
  //     align:'center',
  //     scopedSlots:{
  //       customRender:'customRender'
  //     },
  //     width:110,
  //     fixed:'left',
  //   },
  //   {
  //     title: '押金',
  //     dataIndex: 'deposit',
  //     key: 'deposit',
  //     align:'center',
  //     width:90,
  //   },
  //   {
  //     title: '进货价格',
  //     key: 'inPrice',
  //     dataIndex: 'inPrice',
  //     align:'center',
  //     width:100,
  //   },
  //   {
  //     title: '实际价格',
  //     key: 'realPrice',
  //     dataIndex: 'realPrice',
  //     align:'center',
  //     width:100,
  //   },
  //   {
  //     title: '状态',
  //     key: 'status',
  //     dataIndex: 'status',
  //     align:'center',
  //     scopedSlots:{
  //       customRender:'renderStatus'
  //     },
  //     width:90,
  //   },
  //   {
  //     title: '创建时间',
  //     key: 'createTime',
  //     dataIndex: 'createTime',
  //     align:'center',
  //     width:180,
  //   },
  //   {
  //     title: '操作',
  //     key: 'action',
  //     scopedSlots: { customRender: 'action' },
  //     align:'center',
  //     width:180,
  //     fixed:'right',
  //   },
  // ];
  const columns2 = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      scopedSlots:{customRender:'id'},
      align:'id',
      width:65,
      fixed:'id',
    },
    {
      title: '销售配件',
      dataIndex: 'name',
      key: 'name',
      align:'name',
      scopedSlots:{
        customRender:'customRender'
      },
      width:110,
      fixed:'left',
    },
    {
      title: '押金',
      dataIndex: 'cash_pledge',
      key: 'cash_pledge',
      align:'center',
      width:90,
    },
    {
      title: '进货价格',
      key: 'inPrice',
      dataIndex: 'inPrice',
      align:'center',
      width:100,
    },
    {
      title: '实际价格',
      key: 'prime_cost',
      dataIndex: 'prime_cost',
      align:'center',
      width:100,
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      align:'center',
      scopedSlots:{
        customRender:'renderStatus'
      },
      width:90,
    },
    {
      title: '创建时间',
      key: 'createTime',
      dataIndex: 'createTime',
      align:'center',
      width:180,
    },
    {
      title: '操作',
      key: 'action',
      scopedSlots: { customRender: 'action' },
      align:'center',
      width:180,
      fixed:'right',
    },
  ];
  const time = new Date();
  let formatTime = function(time){
    let year = time.getFullYear();
    let month = time.getMonth()+1;
    month = month < 10 ? `0${month}` : month;
    let date = time.getDate();
    date = date < 10 ? `0${date}` : date;
    let hour = time.getHours();
    hour = hour < 10 ? `0${hour}` : hour;
    let min = time.getMinutes();
    min = min < 10 ? `0${min}` : min;
    let sec = time.getSeconds();
    sec = sec < 10 ? `0${sec}` : sec;
    return `${year}/${month}/${date} ${hour}:${min}:${sec}`;
  }
  // const data = [
  //   {
  //     key:1,
  //     parts:'机头',
  //     deposit:3000,
  //     inPrice:150,
  //     realPrice:100,
  //     status:'出售中',
  //     createTime:formatTime(time)
  //   },
  //   {
  //     key:2,
  //     parts:'目镜盘',
  //     deposit:3000,
  //     inPrice:150,
  //     realPrice:100,
  //     status:'出售中',
  //     createTime:formatTime(time)
  //   },
  //   {
  //     key:3,
  //     parts:'z形板',
  //     deposit:3000,
  //     inPrice:150,
  //     realPrice:100,
  //     status:'停售',
  //     createTime:formatTime(time)
  //   },
  //   {
  //     key:4,
  //     parts:'机头',
  //     deposit:3000,
  //     inPrice:150,
  //     realPrice:100,
  //     status:'出售中',
  //     createTime:formatTime(time)
  //   },
  //   {
  //     key:5,
  //     parts:'目镜盘',
  //     deposit:3000,
  //     inPrice:150,
  //     realPrice:100,
  //     status:'出售中',
  //     createTime:formatTime(time)
  //   },
  //   {
  //     key:6,
  //     parts:'z形板',
  //     deposit:3000,
  //     inPrice:150,
  //     realPrice:100,
  //     status:'出售中',
  //     createTime:formatTime(time)
  //   },
  //   {
  //     key:7,
  //     parts:'目镜盘',
  //     deposit:3000,
  //     inPrice:150,
  //     realPrice:100,
  //     status:'出售中',
  //     createTime:formatTime(time)
  //   },
  //   {
  //     key:8,
  //     parts:'机头',
  //     deposit:3000,
  //     inPrice:150,
  //     realPrice:100,
  //     status:'出售中',
  //     createTime:formatTime(time)
  //   },
  //   {
  //     key:9,
  //     parts:'机头',
  //     deposit:3000,
  //     inPrice:150,
  //     realPrice:100,
  //     status:'出售中',
  //     createTime:formatTime(time)
  //   },
  //   {
  //     key:10,
  //     parts:'机头',
  //     deposit:3000,
  //     inPrice:150,
  //     realPrice:100,
  //     status:'出售中',
  //     createTime:formatTime(time)
  //   },
  //   {
  //     key:11,
  //     parts:'机头',
  //     deposit:3000,
  //     inPrice:150,
  //     realPrice:100,
  //     status:'出售中',
  //     createTime:formatTime(time)
  //   },
  //   {
  //     key:12,
  //     parts:'机头',
  //     deposit:3000,
  //     inPrice:150,
  //     realPrice:100,
  //     status:'出售中',
  //     createTime:formatTime(time)
  //   },
  //   {
  //     key:13,
  //     parts:'机头',
  //     deposit:3000,
  //     inPrice:150,
  //     realPrice:100,
  //     status:'出售中',
  //     createTime:formatTime(time)
  //   },
  //   {
  //     key:14,
  //     parts:'机头',
  //     deposit:3000,
  //     inPrice:150,
  //     realPrice:100,
  //     status:'出售中',
  //     createTime:formatTime(time)
  //   },
  //   {
  //     key:15,
  //     parts:'机头',
  //     deposit:3000,
  //     inPrice:150,
  //     realPrice:100,
  //     status:'出售中',
  //     createTime:formatTime(time)
  //   },
  //   {
  //     key:16,
  //     parts:'机头',
  //     deposit:3000,
  //     inPrice:150,
  //     realPrice:100,
  //     status:'出售中',
  //     createTime:formatTime(time)
  //   }
  // ];


  export default {
    data(){
      let check = (rule, value, callback) => {
        //value = Number(value);
        console.log(value)
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字!'));
        } else {
          callback();
        }
      };
      return{
        form:{
          name:''
        },
        //data,
        data:null,
        allData:null,
        searching:false,
        pageSize:10,
        pagination:{pageSize:10},
        visible: false,
        confirmLoading: false,
        newVisible:false,
        parts:'',
        newParts:'',
        theKey:0,
        screenWidth:null,
        screenHeight:null,
        checkForm: {
          deposit:0,
          inPrice:0,
          realPrice:0,
        },
        checkRules: {
          deposit: [
            {validator:check, trigger:'blur'},
          ],
          inPrice: [
            {validator:check, trigger:'blur'},
          ],
          realPrice: [
            {validator:check, trigger:'blur'},
          ],
        },
        createCheckForm: {
          newDeposit:null,
          newInPrice:null,
          newRealPrice:null,
        },
        createCheckRules: {
          newDeposit: [
            {validator:check, trigger:'blur'},
          ],
          newInPrice: [
            {validator:check, trigger:'blur'},
          ],
          newRealPrice: [
            {validator:check, trigger:'blur'},
          ],
        }
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
      return this.screenWidth < 1110 ? columns2 : columns1;
    }
  },
    created() {
      axios({
        method:'get',
        url:'/accessories_findAll.json',
      }).then(res=>{
        this.data=res.data.data.info;
        this.allData=this.data;
        let length=res.data.data.num;
        for(let i=0;i<length;i++){
          if(this.data[i].status==0){
            this.data[i].status='出售中';
          }
          else{
            this.data[i].status='停售';
          }
        }
      }).catch(function (error) { // 请求失败处理
        console.log(error);
      });

    },
    methods:{
      //点击搜索按钮
      search:function(){
        this.searching = true;
        //let search_data = data;
        let search_data = this.data;
        let target = this.form['name'].trim();
        if( target !== ''){
          search_data = search_data.filter(value => {
            return value['name'].indexOf(target) > -1;
          })
        }
        this.data = search_data;
      },
      //重置
      reset(){
        this.searching = false;
        //this.data = data;
        this.data = this.allData;
        this.form = {
          name:'',
        };
      },
      //上架
      upButton(id){
        const data = [...this.data];
        const check = data.filter(item => item.id== id);
        let obj=document.getElementById(id);
        check[0].status='出售中';
        obj.innerHTML='下架';
      },
      //下架
      downButton(id){
        const data = [...this.data];
        const check = data.filter(item => item.id== id);
        let obj=document.getElementById(id);
        check[0].status='停售';
        obj.innerHTML='上架';
      },
      //控制对话框显示
      showModal(id) {
        this.theKey=id;
        this.visible = true
        const data = [...this.data];
        const check = data.filter(item => item.id== id);
        this.parts=check[0].name;
        this.checkForm.deposit=check[0].cash_pledge;
        this.checkForm.inPrice=check[0].prime_cost;
        this.checkForm.realPrice=check[0].real_price;
      },
      //控制新建配件显示
      createPrice() {
        this.newVisible = true;
        this.newParts='';
        this.newDeposit=null;
        this.newInPrice=null;
        this.newRealPrice=null;
      },
      ///查看提交修改
      handleOk() {
        let item={
          id:this.theKey,
          name:this.parts,
          cash_pledge:this.checkForm.deposit,
          prime_cost:this.checkForm.inPrice,
          real_price:this.checkForm.realPrice,
          // status:data[this.theKey-1].status,
          // createTime:data[this.theKey-1].createTime,
          status:this.data[this.theKey-1].status,
          createTime:this.data[this.theKey-1].createTime,
        };
        this.data.splice(this.theKey-1,1,item);
        this.confirmLoading = true;
        setTimeout(() => {
          this.visible = false;
          this.confirmLoading = false;
        }, 2000);
      },
      //对话框点击取消按钮
      handleCancel() {
        this.visible = false;
      },
      //新建配件对话框点击开始按钮
      createOk() {
        let item={
          id:this.data[this.data.length-1].id+1,
          name:this.newParts,
          cash_pledge:this.newDeposit,
          prime_cost:this.newInPrice,
          real_price:this.newRealPrice,
          status:'出售中',
          //status:0,
          createTime:formatTime(time),
        };
        this.data.push(item);
        this.data[this.data.length-1].number =this.data.length;
        this.confirmLoading = true;
        setTimeout(() => {
          this.newVisible = false;
          this.confirmLoading = false;
        }, 2000);
      },
      //新建配件对话框点击取消按钮
      createCancel() {
        this.newVisible= false;
      },
    }
  }
</script>

<style scoped>
  /*.highlight {*/
  /*  background-color: rgb(253, 245, 1);*/
  /*  padding: 0px;*/
  /*}*/
  /*.button{*/
  /*  width:85px;*/
  /*  height:32px;*/
  /*  background:rgba(16,121,250,1);*/
  /*  border-radius:6px;*/
  /*}*/
  .form-row{
    padding-top:5px;
  }
  @media screen and (min-width: 1024px) {
    .form-row{
      width:50%;
    }
    .label-2-input{
      display:flex;
      align-items:center;
    }
    .label-2-input label{
      margin-right:15px;
      font-weight:bold;
    }
    .label-2-input input{
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
    .label-2-input{
      display:flex;
      align-items:center;
    }
    .label-2-input label{
      margin-right:18px;
      font-weight:bold;
    }
    .label-2-input input{
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
    .label-2-input{
      display:flex;
      align-items:center;
    }
    .label-2-input label{
      margin-right:20px;
      font-weight:bold;
    }
    .label-2-input input{
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
    .action-btn-layout{
      width:90%;
    }
  }
  @media screen and (min-width: 1680px) {
    .form-row{
      width:35%;
    }
    .label-2-input{
      display:flex;
      align-items:center;
    }
    .label-2-input label{
      margin-right:20px;
      font-weight:bold;
    }
    .label-2-input input{
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
    .action-btn-layout{
      width:80%;
    }
  }
  @media screen and (min-width: 1920px) {
    .form-row{
      width:30%;
    }
    .label-2-input{
      display:flex;
      align-items:center;
    }
    .label-2-input label{
      margin-right:20px;
      font-weight:bold;
    }
    .label-2-input input{
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
    .action-btn-layout{
      width:70%;
    }
  }
</style>