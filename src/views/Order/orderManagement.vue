<template>
  <div class="subpage-layout">
    <div class="subpage-title">
      订单管理
    </div>
    <div class="subpage-content">
<!--        请在此处填充内容-->
<!--      搜索重置栏-->
      <div class="form-area" style="width:100%">
        <div class="form-row" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
          <div class="label-2-input">
              <label>姓名</label>
              <a-input v-model="form.user_name"/>
          </div>
          <div class="label-3-input">
            <label>手机号</label>
            <a-input v-model="form.phone_num"/>
          </div>
          <div class="button">
            <a-button @click="search"
                      type="primary">
              搜索
            </a-button>
            <a-button style="background-color:#F5F5F5;border:none;color:#666666;" @click="reset">重置</a-button>
          </div>
        </div>
      </div>
<!--表格展示-->
      <div class="table-area" style="width:100%;margin-top:20px">
        <a-table
                :scroll="{x:1000}"
                 :columns="columns"
                 :data-source="data"
                 :pagination="pagination"
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
          <template slot="action" slot-scope="record">
             <span slot="action">
            <a-button style="padding:0 15px;background-color:#F5F5F5;color:#1079FA;border-color:#F5F5F5;"
                      @click="() => showModal(record.id)">
              查看
            </a-button>
             </span>
          </template>
          <template slot="renderAddress" slot-scope="text">
            <span v-if="text.length <= 21">{{text}}</span>
            <a-tooltip v-else>
              <template slot="title">
                {{text}}
              </template>
              {{text.slice(0,21)}}...
            </a-tooltip>
          </template>
          <template slot="renderBuyer" slot-scope="text">
            <span v-if="text.length <= 8">{{text}}</span>
            <a-tooltip v-else>
              <template slot="title">
                {{text}}
              </template>
              {{text.slice(0,8)}}...
            </a-tooltip>
          </template>
          <template slot="renderTrackingStatus" slot-scope="text">
            <span v-if="text === '待更新'" style="color:#0F79F9">{{text}}</span>
            <span v-else-if="text === '已送达'" style="color:#8ACD2A">{{text}}</span>
            <span v-else-if="text === '已退回'" style="color:#F55943">{{text}}</span>
          </template>
        </a-table>
      </div>
<!--      查看订单详情-->
      <a-modal
        class="modal-430"
        title="订单详情"
        :visible="visible"
        :confirm-loading="confirmLoading"
        width="400px"
        centered
        @ok="handleOk"
        @cancel="handleCancel"
        cancelText="关闭"
        okText="提交"
        :maskStyle="{'background-color':'rgb(0,0,0,0.2)'}"
        :bodyStyle="{'width':'400px','padding-top':'30px','padding-bottom':'60px',
                      'font-family': 'PingFangSC-Regular','font-size': '14px',
                      'font-weight':'Regular'}">
        <div class="modal-body">
          <a-form-model style="width:360px;"
                        :labelCol="{span:6}"
                        :wrapperCol="{span:18}">
            <a-form-item
              label="姓名">
              <a-input style="width:240px" v-model="consignee" default="this.consignee" />
            </a-form-item>
            <a-form-item
                    label="地址">
              <a-input style="width:240px" v-model="address" default="this.address"/>
            </a-form-item>
            <a-form-item
              label="电话">
              <a-input style="width:240px" v-model="tel" default="this.tel"/>
            </a-form-item>
            <a-form-item
              label="物流状态">
              <a-radio-group v-model="logistics_type" @change="onChange" style="display: inline-block" default="this.logistic_type">
                <a-radio :value="0">
                  自提
                </a-radio>
                <a-radio :value="1">
                  物流
                </a-radio>
              </a-radio-group>
              <a-input v-if="logistics_type==1"
                placeholder="物流单号"
                style="width:240px;margin-bottom:10px;"
                v-model="distribution"/>
              <div style="white-space: nowrap">
                <a-select
                        style="width: 90px;margin-right:20px;"
                        @change="handleChange"
                        :labelInValue="true"
                        v-model="selected"
                        >
                  <a-select-option value="待更新">
                    待更新
                  </a-select-option>
                  <a-select-option value="已送达">
                    已送达
                  </a-select-option>
                  <a-select-option value="已退回">
                  已退回
                  </a-select-option>
                </a-select>
                <a-date-picker 
                  @change="dateOnChange"
                  style="width:130px"
                  type="date"
                  :format="dateFormat"
                  placeholder="选择时间"
                  v-model="logisticsTime"/>
              </div>
            </a-form-item>
          </a-form-model>
<!--          <a-form-item-->
<!--                  label="训练次数"-->
<!--                  :labelCol="{span:6}"-->
<!--                  :wrapperCol="{offset:1,span:15}">-->
<!--            <a-input v-model="trainingNumber" default="this.trainingNumber" disabled="true"/>-->
<!--          </a-form-item>-->
<!--          <a-form-item-->
<!--                  label="实际次数"-->
<!--                  :labelCol="{span:6}"-->
<!--                  :wrapperCol="{offset:1,span:15}">-->
<!--            <a-input v-model="actualFrequency" default="this.actualFrequency" disabled="true"/>-->
<!--          </a-form-item>-->
<!--          <a-form-item-->
<!--                  label="训练费用"-->
<!--                  :labelCol="{span:6}"-->
<!--                  :wrapperCol="{offset:1,span:15}">-->
<!--            <a-input v-model="trainingExpenses" default="this.trainingExpenses" disabled="true"/>-->
<!--          </a-form-item>-->
<!--          <a-form-item-->
<!--                  label="押金费用"-->
<!--                  :labelCol="{span:6}"-->
<!--                  :wrapperCol="{offset:1,span:15}">-->
<!--            <a-input v-model="deposit" default="this.deposit" disabled="true"/>-->
<!--          </a-form-item>-->
        </div>
      </a-modal>

    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  // const statusObj = {
  //   "wait" : "待更新",
  //   "arrived" : "已送达",
  //   "returned" : "已退回",
  // }
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      align:'center',
      width:65,
      fixed:'left',
    },
    {
      title: '订单号',
      dataIndex: 'order_no',
      key: 'order_no',
      align:'center',
      width:150,
      fixed:'left',
    },
    {
      title: '设备编号',
      dataIndex: 'equipmentNumber',
      key: 'equipmentNumber',
      align:'center',
      width:110,
    },
    {
      title: '买方',
      dataIndex: 'buyer',
      key: 'buyer',
      align:'center',
      width:150,
      scopedSlots:{
        customRender:'renderBuyer'
      },
    },
    {
      title: '收货人',
      dataIndex: 'user_name',
      key: 'user_name',
      align:'center',
      ellipsis: true,
      width:100,
    },
    {
      title: '地址',
      key: 'address',
      dataIndex: 'address',
      align:'center',
      scopedSlots:{
        customRender:'renderAddress'
      },
      width:180,
    },
    {
      title: '物流状态',
      key: 'express_num',
      dataIndex: 'express_num',
      align:'center',
      scopedSlots:{
        customRender:'renderTrackingStatus'
      },
      width:100,
    },
    {
      title: '训练次数',
      key: 'training_times',
      dataIndex: 'training_times',
      align:'center',
      width:100,
    },
    {
      title: '实际次数',
      key: 'real_times',
      dataIndex: 'real_times',
      align:'center',
      width:100,
    },
    {
      title: '训练费用',
      key: 'train_price',
      dataIndex: 'train_price',
      align:'center',
      width:120,
    },
    {
      title: '押金费用',
      key: 'device_price',
      dataIndex: 'device_price',
      align:'center',
      width:100,
    },
    {
      title: '租用日期',
      key: 'time_period',
      dataIndex: 'time_period',
      align:'center',
      width:180,
    },
    {
      title: '创建时间',
      key: 'ctime',
      dataIndex: 'ctime',
      align:'center',
      width:180,
    },
    {
      title: '操作',
      key: 'action',
      scopedSlots: { customRender: 'action' },
      align:'center',
      width:120,
      fixed:'right'
    },
  ];
  //通过value找key
  // function findKey(obj, value, compare = (a, b) => a === b) {
  //   return Object.keys(obj).find(k => compare(obj[k], value))
  // }
  // const time = new Date();
  // let formatTime = function(time){
  //   let year = time.getFullYear();
  //   let month = time.getMonth();
  //   month = month < 10 ? `0${month}` : month;
  //   let date = time.getDate();
  //   date = date < 10 ? `0${date}` : date;
  //   let hour = time.getHours();
  //   hour = hour < 10 ? `0${hour}` : hour;
  //   let min = time.getMinutes();
  //   min = min < 10 ? `0${min}` : min;
  //   let sec = time.getSeconds();
  //   sec = sec < 10 ? `0${sec}` : sec;
  //   return `${year}/${month}/${date} ${hour}:${min}:${sec}`;
  // }
  //value=1自提 value=2物流
  // const data = [
  //   {
  //     key:1,
  //     orderNumber:'DD202006110000',
  //     equipmentNumber:8037,
  //     buyer:'何氏眼科何氏眼科何氏眼科何氏眼科何氏眼科',
  //     consignee:'小明',
  //     tel:'18444668899',
  //     address:'浙江省嘉兴市当湖街道浙江省嘉兴市当湖街道浙江省嘉兴市当湖街道',
  //     trackingStatus:'待更新',
  //     trainingNumber:100,
  //     actualFrequency:150,
  //     trainingExpenses:15000,
  //     deposit:3000,
  //     hireDate:formatTime(time),
  //     createTime:formatTime(time),
  //     logisticsTime:'',
  //     distribution:'',
  //     value:1,
  //   },
  //   {
  //     key:2,
  //     orderNumber:'DD202006110000',
  //     equipmentNumber:8037,
  //     buyer:'何氏眼科',
  //     consignee:'刘鑫',
  //     tel:'15022048517',
  //     address:'浙江省嘉兴市当湖街道',
  //     trackingStatus:'待更新',
  //     trainingNumber:100,
  //     actualFrequency:150,
  //     trainingExpenses:15000,
  //     deposit:3000,
  //     hireDate:formatTime(time),
  //     createTime:formatTime(time),
  //     logisticsTime:'',
  //     distribution:'',
  //     value:1,
  //   },
  //   {
  //     key:3,
  //     orderNumber:'DD202006110000',
  //     equipmentNumber:8037,
  //     buyer:'何氏眼科',
  //     consignee: '小红',
  //     tel:'13152526666',
  //     address:'浙江省嘉兴市当湖街道',
  //     trackingStatus:'待更新',
  //     trainingNumber:100,
  //     actualFrequency:150,
  //     trainingExpenses:15000,
  //     deposit:3000,
  //     hireDate:formatTime(time),
  //     createTime:formatTime(time),
  //     logisticsTime:'',
  //     distribution:'',
  //     value:1,
  //   },
  //   {
  //     key:4,
  //     orderNumber:'DD202006110000',
  //     equipmentNumber:8037,
  //     buyer:'何氏眼科',
  //     consignee:'刘鑫',
  //     tel:'15022048517',
  //     address:'浙江省嘉兴市当湖街道',
  //     trackingStatus:'已送达',
  //     trainingNumber:100,
  //     actualFrequency:150,
  //     trainingExpenses:15000,
  //     deposit:3000,
  //     hireDate:formatTime(time),
  //     createTime:formatTime(time),
  //     logisticsTime:'',
  //     distribution:'',
  //     value:1,
  //   },
  //   {
  //     key:5,
  //     orderNumber:'DD202006110000',
  //     equipmentNumber:8037,
  //     buyer:'何氏眼科',
  //     consignee:'刘鑫',
  //     tel:'15022048517',
  //     address:'浙江省嘉兴市当湖街道',
  //     trackingStatus:'已送达',
  //     trainingNumber:100,
  //     actualFrequency:150,
  //     trainingExpenses:15000,
  //     deposit:3000,
  //     hireDate:formatTime(time),
  //     createTime:formatTime(time),
  //     logisticsTime:'',
  //     distribution:'',
  //     value:1,
  //   },
  //   {
  //     key:6,
  //     orderNumber:'DD202006110000',
  //     equipmentNumber:8037,
  //     buyer:'何氏眼科',
  //     consignee:'刘鑫',
  //     tel:'15022048517',
  //     address:'浙江省嘉兴市当湖街道',
  //     trackingStatus:'已送达',
  //     trainingNumber:100,
  //     actualFrequency:150,
  //     trainingExpenses:15000,
  //     deposit:3000,
  //     hireDate:formatTime(time),
  //     createTime:formatTime(time),
  //     logisticsTime:'',
  //     distribution:'',
  //     value:1,
  //
  //   },
  //   {
  //     key:7,
  //     orderNumber:'DD202006110000',
  //     equipmentNumber:8037,
  //     buyer:'何氏眼科',
  //     consignee:'刘鑫',
  //     tel:'15022048517',
  //     address:'浙江省嘉兴市当湖街道',
  //     trackingStatus:'已送达',
  //     trainingNumber:100,
  //     actualFrequency:150,
  //     trainingExpenses:15000,
  //     deposit:3000,
  //     hireDate:formatTime(time),
  //     createTime:formatTime(time),
  //     logisticsTime:'',
  //     distribution:'',
  //     value:1,
  //   },
  //   {
  //     key:8,
  //     orderNumber:'DD202006110000',
  //     equipmentNumber:8037,
  //     buyer:'何氏眼科',
  //     consignee:'刘鑫',
  //     tel:'15022048517',
  //     address:'浙江省嘉兴市当湖街道',
  //     trackingStatus:'已退回',
  //     trainingNumber:100,
  //     actualFrequency:150,
  //     trainingExpenses:15000,
  //     deposit:3000,
  //     hireDate:formatTime(time),
  //     createTime:formatTime(time),
  //     logisticsTime:'',
  //     distribution:'',
  //     value:1,
  //   },
  //   {
  //     key:9,
  //     orderNumber:'DD202006110000',
  //     equipmentNumber:8037,
  //     buyer:'何氏眼科',
  //     consignee:'小明',
  //     tel:'18444668899',
  //     address:'浙江省嘉兴市当湖街道',
  //     trackingStatus:'已退回',
  //     trainingNumber:100,
  //     actualFrequency:150,
  //     trainingExpenses:15000,
  //     deposit:3000,
  //     hireDate:formatTime(time),
  //     createTime:formatTime(time),
  //     logisticsTime:'',
  //     distribution:'',
  //     value:2,
  //   },
  //   {
  //     key:10,
  //     orderNumber:'DD202006110000',
  //     equipmentNumber:8037,
  //     buyer:'何氏眼科',
  //     consignee:'刘鑫',
  //     tel:'15022048517',
  //     address:'浙江省嘉兴市当湖街道',
  //     trackingStatus:'已退回',
  //     trainingNumber:100,
  //     actualFrequency:150,
  //     trainingExpenses:15000,
  //     deposit:3000,
  //     hireDate:formatTime(time),
  //     createTime:formatTime(time),
  //     logisticsTime:'',
  //     distribution:'',
  //     value:2,
  //   },
  //   {
  //     key:11,
  //     orderNumber:'DD202006110000',
  //     equipmentNumber:8037,
  //     buyer:'何氏眼科',
  //     consignee:'刘鑫',
  //     tel:'15022048517',
  //     address:'浙江省嘉兴市当湖街道',
  //     trackingStatus:'已退回',
  //     trainingNumber:100,
  //     actualFrequency:150,
  //     trainingExpenses:15000,
  //     deposit:3000,
  //     hireDate:formatTime(time),
  //     createTime:formatTime(time),
  //     logisticsTime:'',
  //     distribution:'',
  //     value:2,
  //   },
  //   {
  //     key:12,
  //     orderNumber:'DD202006110000',
  //     equipmentNumber:8037,
  //     buyer:'何氏眼科',
  //     consignee:'刘鑫',
  //     tel:'15022048517',
  //     address:'浙江省嘉兴市当湖街道',
  //     trackingStatus:'已退回',
  //     trainingNumber:100,
  //     actualFrequency:150,
  //     trainingExpenses:15000,
  //     deposit:3000,
  //     hireDate:formatTime(time),
  //     createTime:formatTime(time),
  //     logisticsTime:'',
  //     distribution:'',
  //     value:2,
  //   },
  //   {
  //     key:13,
  //     orderNumber:'DD202006110000',
  //     equipmentNumber:8037,
  //     buyer:'何氏眼科',
  //     consignee:'刘鑫',
  //     tel:'15022048517',
  //     address:'浙江省嘉兴市当湖街道',
  //     trackingStatus:'已退回',
  //     trainingNumber:100,
  //     actualFrequency:150,
  //     trainingExpenses:15000,
  //     deposit:3000,
  //     hireDate:formatTime(time),
  //     createTime:formatTime(time),
  //     logisticsTime:'',
  //     distribution:'',
  //     value:2,
  //   },
  //   {
  //     key:14,
  //     orderNumber:'DD202006110000',
  //     equipmentNumber:8037,
  //     buyer:'何氏眼科',
  //     consignee:'刘鑫',
  //     tel:'15022048517',
  //     address:'浙江省嘉兴市当湖街道',
  //     trackingStatus:'待更新',
  //     trainingNumber:100,
  //     actualFrequency:150,
  //     trainingExpenses:15000,
  //     deposit:3000,
  //     hireDate:formatTime(time),
  //     createTime:formatTime(time),
  //     logisticsTime:'',
  //     distribution:'',
  //     value:2,
  //   },
  //   {
  //     key:15,
  //     orderNumber:'DD202006110000',
  //     equipmentNumber:8037,
  //     buyer:'何氏眼科',
  //     consignee:'小红',
  //     tel:'13152526666',
  //     address:'浙江省嘉兴市当湖街道',
  //     trackingStatus:'待更新',
  //     trainingNumber:100,
  //     actualFrequency:150,
  //     trainingExpenses:15000,
  //     deposit:3000,
  //     hireDate:formatTime(time),
  //     createTime:formatTime(time),
  //     logisticsTime:'',
  //     distribution:'',
  //     value:2,
  //   },
  //   {
  //     key:16,
  //     orderNumber:'DD202006110000',
  //     equipmentNumber:8037,
  //     buyer:'何氏眼科',
  //     consignee:'刘鑫',
  //     tel:'15022048517',
  //     address:'浙江省嘉兴市当湖街道',
  //     trackingStatus:'待更新',
  //     trainingNumber:100,
  //     actualFrequency:150,
  //     trainingExpenses:15000,
  //     deposit:3000,
  //     hireDate:formatTime(time),
  //     createTime:formatTime(time),
  //     logisticsTime:'',
  //     distribution:'',
  //     value:2,
  //   },
  // ];
  // function addNumber(data){
  //   for(let i = 0;i<data.length;i++){
  //     data[i].number = i + 1;
  //   }
  // }
  // addNumber(data);
  export default {
    data() {
      return {
        dateFormat: 'YYYY/MM/DD',
        form:{
          phone_num:'',
          user_name:'',
        },
        //data,
        data:null,
        allData:null,
        columns,
        searching:false,
        pageSize:10,
        pagination:{pageSize:10},
        visible: false,
        confirmLoading: false,
        logistics_type:null,
        orderNumber:'',
        consignee:'',
        address:'',
        tel:'',
        trainingNumber:0,
        actualFrequency:0,
        trainingExpenses:0,
        deposit:0,
        distribution:'',
        theKey:0,
        logisticsTime:'',
        trackingStatus:'',
        selected:{
               key: "wait",
               label: " 待更新 ",
            },

      };
    },
    created() {
      axios({
        method:'get',
        url:'/device_findAll.json',
      }).then(res=>{
        this.data=res.data.data.info;
        this.allData=this.data;
        // let length=res.data.data.num;
        // for(let i=0;i<length;i++){
        //   if(this.data[i].logistics_type==0){
        //     this.data[i].logistics_type='自提';
        //   }
        //   else{
        //     this.data[i].logistics_type='物流';
        //   }
        // }
      }).catch(function (error) { // 请求失败处理
        console.log(error);
      });
    },
    computed: {

    },
    methods:{
      //选择器
      handleChange(value) {
        this.selected[this.theKey-1]=value;
        this.trackingStatus=value.label;
      },
      //点击搜索
      search:function(){
        this.searching = true;
        let index = ['phone_num','user_name'];
        let search_data = this.data, i = 0;
        while(i < 2){
          let target = this.form[index[i]].trim();
          if( target !== ''){
            search_data = search_data.filter(value => {
              return value[index[i]].indexOf(target) > -1;
            })
          }
          i++;
        }
        this.data = search_data;
      },
      //点击重置
      reset(){
        this.searching = false;
        this.data = this.allData;
        this.form = {
          phone_num:'',
          user_name:'',
        };
      },
      //控制对话框显示
      showModal(id) {
        this.visible = true;
        this.theKey=id;
        const data = [...this.data];
        const check = data.filter(item => item.id== id);
        this.orderNumber=check[0].order_no;
        this.consignee=check[0].user_name;
        this.address=check[0].address;
        this.tel=check[0].phone_num;
        this.trainingNumber=check[0].training_times;
        this.actualFrequency=check[0].real_times;
        this.trainingExpenses=check[0].train_price;
        this.deposit=check[0].device_price;
        this.distribution=check[0].logistics_num;
        this.logisticsTime=check[0].logisticsTime;
        this.trackingStatus=check[0].express_num;
        this.selected={
          key:this.trackingStatus,
          value:this.trackingStatus};
        this.logistics_type=check[0].logistics_type;
        console.log(this.logistics_type)
      },
      //对话框点击开始按钮
      handleOk() {
        let item={
          id:this.theKey,
          order_no:this.data[this.theKey-1].order_no,
          equipmentNumber:this.data[this.theKey-1].equipmentNumber,
          buyer:this.data[this.theKey-1].buyer,
          user_name:this.consignee,
          phone_num:this.tel,
          address:this.address,
          express_num:this.trackingStatus.trim(),
          training_times:this.data[this.theKey-1].training_times,
          real_times:this.data[this.theKey-1].real_times,
          train_price:this.data[this.theKey-1].train_price,
          device_price:this.data[this.theKey-1].device_price,
          time_period:this.data[this.theKey-1].time_period,
          ctime:this.data[this.theKey-1].ctime,
          logistics_num: this.distribution,
          logisticsTime:this.logisticsTime,
          logistics_type:this.logistics_type,
        };
        this.data.splice(this.theKey-1,1,item);
        //console.log(item.trackingStatus)
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
      //自提和物流选择
      onChange(e) {
        this.logistics_type= e.target.value;
      },
      //日期选择
      dateOnChange(date, dateString) {
        this.logisticsTime=dateString;
        console.log(this.logisticsTime);
      },
    },
  };
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
      width:75%;
    }
    .label-2-input,.label-3-input{
      display:flex;
      align-items:center;
    }
    .label-2-input label, .label-3-input label{
      margin-right:10px;
      font-weight:bold;
    }
    .label-2-input input, .label-3-input input{
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
      width:63%;
    }
    .label-2-input,.label-3-input{
      display:flex;
      align-items:center;
    }
    .label-2-input label, .label-3-input label{
      margin-right:13px;
      font-weight:bold;
    }
    .label-2-input input, .label-3-input input{
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
      width:55%;
    }
    .label-2-input,.label-3-input{
      display:flex;
      align-items:center;
    }
    .label-2-input label, .label-3-input label{
      margin-right:15px;
      font-weight:bold;
    }
    .label-2-input input, .label-3-input input{
      width:160px;
    }
    .button{
      display:flex;
      width:140px;
      justify-content: space-between;
    }
    .ant-btn{
      padding:0 15px;
    }
  }
  @media screen and (min-width: 1680px) {
    .form-row{
      width:50%;
    }
    .label-2-input,.label-3-input{
      display:flex;
      align-items:center;
    }
    .label-2-input label, .label-3-input label{
      margin-right:18px;
      font-weight:bold;
    }
    .label-2-input input, .label-3-input input{
      width:170px;
    }
    .button{
      display:flex;
      width:150px;
      justify-content: space-between;
    }
    .ant-btn{
      padding:0 18px;
    }
  }
  @media screen and (min-width: 1920px) {
    .form-row{
      width:50%;
    }
    .label-2-input,.label-3-input{
      display:flex;
      align-items:center;
    }
    .label-2-input label, .label-3-input label{
      margin-right:20px;
      font-weight:bold;
    }
    .label-2-input input, .label-3-input input{
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
  }
</style>