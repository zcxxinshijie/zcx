<template>
  <div class="subpage-layout">
    <div class="subpage-title">
      检查仪使用明细
    </div>
    <div class="subpage-content">
      <!-- 请在此处填充内容 -->
      <div class="form-area" style="width:100%" >
        <a-row style="display:flex;justify-content:space-between;margin-bottom:15px">
          <a-col :span="8">
            <a-form-model-item 
              label="渠道" 
              labelAlign="left"
              :labelCol="{span:3}"
              :wrapperCol="{span:14}">
              <a-input v-model="channel"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item 
              label="门店"
              labelAlign="left"
              :labelCol="{span:3}"
              :wrapperCol="{span:14}">
              <a-input v-model="store"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item 
              label="设备编号"
              labelAlign="left"
              :labelCol="{span:5}"
              :wrapperCol="{span:14}">
              <a-input v-model="deviceId"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row style="display:flex;justify-content:space-between;margin-bottom:15px">
          <a-col :span="9">
            <a-form-model-item 
              label="时间"
              labelAlign="left"
              :labelCol="{span:3}"
              :wrapperCol="{span:20}">
              <a-date-picker 
                style="width:45%" 
                placeholder="开始日期"
                v-model="startTime"
                :disabled-date="disabledStartDate"/>
              <span style="margin:0 10px">—</span>
              <a-date-picker 
                style="width:45%" 
                placeholder="结束日期"
                v-model="endTime"
                :disabled-date="disabledEndDate"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="7" style="display:flex;justify-content:space-around;align-items:center;">
            <a-button style="color:white;background-color:darkgray;" @click=choosePeriod(1)>最近一周</a-button>
            <a-button style="color:white;background-color:darkgray;" @click=choosePeriod(2)>本月</a-button>
            <a-button style="color:white;background-color:darkgray" @click=choosePeriod(3)>最近一月</a-button>
            <a-button style="color:white;background-color:darkgray;" @click=choosePeriod(4)>最近三月</a-button>
          </a-col>
          <a-col :span="7" style="display:flex;align-items:center">
            <div style="margin-left:10%;width:55%;display:flex;justify-content:space-around;align-items:center">
              <a-button type="primary" @click="search">搜索</a-button>
              <a-button type="primary" @click="reset">重置</a-button>
              <a-button style="color:white;background-color:#faad14;">导出</a-button>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="table-area" style="width:100%;margin-top:20px">
        <a-table style="width:100%;height:100%" 
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
          <span slot="action">
            <a-button type="primary" 
              style="margin:2px 20px 2px 0"
              @click="showModal">
              开始筛查
            </a-button>
            <a-button type="primary">报告</a-button>
          </span>
        </a-table>
        <div style="width:250px;position:relative;top:-80px;">
          <span>每页显示</span>
          <a-input style="width:35px;height:30px;text-align:center;outline:none;margin:0 3px;padding:0 2px" 
            v-model="pageSize" 
            defaultValue="10"
            @blur="changePageSize"
            @pressEnter="changePageSize"
            />
          <span>条记录</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const columns = [
  {
    title: '序号',
    dataIndex: 'number',
    key: 'number',
    align:'center'
  },
  {
    title: '设备编号',
    dataIndex: 'deviceId',
    key: 'deviceId',
    align:'center',
    scopedSlots:{
      customRender:'customRender'
    }
  },
  {
    title: '渠道',
    dataIndex: 'channel',
    key: 'channel',
    align:'center',
    scopedSlots:{
      customRender:'customRender'
    }
  },
  {
    title: '门店',
    key: 'store',
    dataIndex: 'store',
    align:'center',
    scopedSlots:{
      customRender:'customRender'
    }
  },
  {
    title: '手机号',
    key: 'telNumber',
    dataIndex: 'telNumber',
    align:'center'
  },
  {
    title: '昵称',
    key: 'nickName',
    dataIndex: 'nickName',
    align:'center'
  },
  {
    title: '检查项目数量',
    key: 'testNum',
    dataIndex: 'testNum',
    align:'center'
  },
  {
    title: '服务器时间',
    key: 'serverTime',
    dataIndex: 'serverTime',
    align:'center'
  },
  {
    title: '检查时间',
    key: 'testTime',
    dataIndex: 'testTime',
    align:'center',
    scopedSlots:{
      customRender:'customRender'
    }
  }
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
const data = [
  {
    key:1,
    deviceId:'0001',
    channel:'优丫优直营渠道',
    store:'爱尔眼科',
    telNumber:'15523568790',
    nickName:'Shine',
    testNum:'2',
    serverTime:formatTime(time),
    testTime:formatTime(time)
  },
  {
    key:2,
    deviceId:'0002',
    channel:'优丫优直营渠道',
    store:'爱尔眼科',
    telNumber:'15523568790',
    nickName:'Shine',
    testNum:'2',
    serverTime:formatTime(time),
    testTime:formatTime(time)
  },
  {
    key:3,
    deviceId:'0003',
    channel:'新视直营渠道',
    store:'光明眼科',
    telNumber:'15523568790',
    nickName:'Shine',
    testNum:'2',
    serverTime:formatTime(time),
    testTime:formatTime(time)
  },
  {
    key:4,
    deviceId:'0004',
    channel:'新视直营渠道',
    store:'光明眼科',
    telNumber:'15523568790',
    nickName:'Shine',
    testNum:'2',
    serverTime:formatTime(time),
    testTime:formatTime(time)
  },
  {
    key:5,
    deviceId:'0005',
    channel:'新视直营渠道',
    store:'光明眼科',
    telNumber:'15523568790',
    nickName:'Shine',
    testNum:'2',
    serverTime:formatTime(time),
    testTime:formatTime(time)
  },
  {
    key:6,
    deviceId:'0006',
    channel:'健康直营渠道',
    store:'优眼眼科',
    telNumber:'15523568790',
    nickName:'Shine',
    testNum:'2',
    serverTime:formatTime(time),
    testTime:formatTime(time)
  },
  {
    key:7,
    deviceId:'0007',
    channel:'健康直营渠道',
    store:'优眼眼科',
    telNumber:'15523568790',
    nickName:'Shine',
    testNum:'2',
    serverTime:formatTime(time),
    testTime:formatTime(time)
  },
  {
    key:8,
    deviceId:'0008',
    channel:'健康直营渠道',
    store:'优眼眼科',
    telNumber:'15523568790',
    nickName:'Shine',
    testNum:'2',
    serverTime:formatTime(time),
    testTime:formatTime(time)
  },
  {
    key:9,
    deviceId:'0009',
    channel:'健康直营渠道',
    store:'优眼眼科',
    telNumber:'15523568790',
    nickName:'Shine',
    testNum:'2',
    serverTime:formatTime(time),
    testTime:formatTime(time)
  },
  {
    key:10,
    deviceId:'0010',
    channel:'快销直营渠道',
    store:'哲文眼科',
    telNumber:'15523568790',
    nickName:'Shine',
    testNum:'2',
    serverTime:formatTime(time),
    testTime:formatTime(time)
  },
  {
    key:11,
    deviceId:'0011',
    channel:'快销直营渠道',
    store:'哲文眼科',
    telNumber:'15523568790',
    nickName:'Shine',
    testNum:'2',
    serverTime:formatTime(time),
    testTime:formatTime(time)
  },
  {
    key:12,
    deviceId:'0012',
    channel:'快销直营渠道',
    store:'哲文眼科',
    telNumber:'15523568790',
    nickName:'Shine',
    testNum:'2',
    serverTime:formatTime(time),
    testTime:formatTime(time)
  },
  {
    key:13,
    deviceId:'0013',
    channel:'快销直营渠道',
    store:'哲文眼科',
    telNumber:'15523568790',
    nickName:'Shine',
    testNum:'2',
    serverTime:formatTime(time),
    testTime:formatTime(time)
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
        channel:'',
        store:'',
        deviceId:'',
        testTime:'',
      },
      channel:'',
      store:'',
      deviceId:'',
      testTime:'',
      startTime:null,
      endTime:null,
      columns:columns,
      data:data,
      searching:false,
      pageSize:10,
      pagination:{pageSize:10},
    }
  },
  methods:{
    disabledStartDate(startTime) {
      const endTime = this.endTime;
      if (!startTime || !endTime) {
        return false;
      }
      return startTime.valueOf() > endTime.valueOf();
    },
    disabledEndDate(endTime) {
      const startTime = this.startTime;
      if (!endTime || !startTime) {
        return false;
      }
      return startTime.valueOf() >= endTime.valueOf();
    },
    choosePeriod(index){
      let date = new Date();
      let month = date.getMonth(); //此getMonth()从0开始
      let year = date.getFullYear();
      if(index === 1){//最近一周
        let day = date.getDate();
        let startDate = new Date(year, month, day - 7);
        let endDate = new Date(year, month, day - 1);
        this.startTime = `${startDate.getFullYear()}/${startDate.getMonth() + 1}/${startDate.getDate()}`;
        this.endTime = `${endDate.getFullYear()}/${endDate.getMonth() + 1}/${endDate.getDate()}`;
      }else if(index === 2){//本月
        let day = date.getDate();
        this.startTime = `${year}/${month + 1}/1`;
        this.endTime = `${year}/${month + 1}/${day}`;
      }else if(index === 3){//最近一月
        let endDate = new Date(year, month, 0);
        this.startTime = `${endDate.getFullYear()}/${endDate.getMonth() + 1}/1`;
        this.endTime = `${endDate.getFullYear()}/${endDate.getMonth() + 1}/${endDate.getDate()}`;
      }else if(index === 4){ //最近三月
        let startDate = new Date(year, month - 3, 1);
        let endDate = new Date(year, month, 0);
        this.startTime = `${startDate.getFullYear()}/${startDate.getMonth() + 1}/1`;
        this.endTime = `${endDate.getFullYear()}/${endDate.getMonth() + 1}/${endDate.getDate()}`;
      }
    },
    //点击搜索按钮
    search:function(){
      this.form.channel = this.channel;
      this.form.store = this.store;
      this.form.deviceId = this.deviceId;
      this.form.testTime = this.testTime ? this.testTime.format('YYYY/MM/DD') : '';
      let index = ['channel','store','deviceId','testTime'];
      let search_data = data, i = 0;
      while(i < index.length){
        console.log(this.form[index[i]])
        let target = this.form[index[i]].trim();
        if( target !== ''){
          search_data = search_data.filter(value => {
            return value[index[i]].indexOf(target) > -1;
          })
        }
        i++;
      }
      this.data = search_data;
      this.searching = true;
    },
    reset(){
      this.searching = false;
      this.data = data;
      this.form = {
        channel:'',
        store:'',
        deviceId:'',
        testTime:''
      };
      this.channel = '';
      this.store = '';
      this.deviceId = '';
      this.testTime = '';
    },
    //改变表格每页显示数据条数
    changePageSize:function(e){
      e.target.blur();
      this.pagination = {pageSize: parseInt(this.pageSize)};
    },
    //控制对话框显示
    showModal() {
      this.visible = true;
    },
    //对话框点击开始按钮
    handleOk() {
      //！！！此处代码有待修改！！！
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
  }
}
</script>
<style scoped>
.ant-row::before, .ant-row::after{
  content:none;
}
.highlight {
  background-color: rgb(253, 245, 1);
  padding: 0px;
}
</style>