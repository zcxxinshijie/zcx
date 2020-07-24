<template>
  <div class="subpage-layout">
    <div class="subpage-title">
      客户检查情况
    </div>
    <div class="subpage-content">
      <!-- 请在此处填充内容 -->
      <div class="form-area" style="width:100%" >
        <a-row style="display:flex;justify-content:space-between;margin-bottom:15px">
          <a-col :span="6">
            <a-form-model-item 
              label="渠道" 
              labelAlign="left"
              :labelCol="{span:4}"
              :wrapperCol="{span:14}">
              <a-input v-model="channel"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item 
              label="门店"
              labelAlign="left"
              :labelCol="{span:4}"
              :wrapperCol="{span:14}">
              <a-input v-model="store"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item 
              label="设备编号"
              labelAlign="left"
              :labelCol="{span:6}"
              :wrapperCol="{span:14}">
              <a-input v-model="deviceId"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item 
              label="时间间隔"
              labelAlign="left"
              :labelCol="{span:6}"
              :wrapperCol="{span:14}">
              <a-select style="width:120px;" v-model="timeInterval">
                <a-select-option value="order">正序</a-select-option>
                <a-select-option value="reorder">逆序</a-select-option>
              </a-select>
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
          <a-col :span="7" style="display:flex;justify-content:space-between;align-items:center;">
            <a-button style="color:white;background-color:darkgray;" @click=choosePeriod(1)>最近一周</a-button>
            <a-button style="color:white;background-color:darkgray;" @click=choosePeriod(2)>本月</a-button>
            <a-button style="color:white;background-color:darkgray" @click=choosePeriod(3)>最近一月</a-button>
            <a-button style="color:white;background-color:darkgray;" @click=choosePeriod(4)>最近三月</a-button>
          </a-col>
          <a-col :span="7" style="display:flex;align-items:center">
            <div style="margin-left:10%;width:60%;display:flex;justify-content:space-around;align-items:center">
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
          :scroll="{ x: true }"
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
    align:'center',
    fixed: 'left' 
  },
  {
    title: '昵称',
    key: 'nickName',
    dataIndex: 'nickName',
    align:'center',
    fixed: 'left' 
  },
  {
    title: '检查日期',
    key: 'testTime',
    dataIndex: 'testTime',
    align:'center',
    fixed: 'left',
    scopedSlots:{
      customRender:'customRender'
    }
  },
  {
    title: '用户名',
    dataIndex: 'userName',
    key: 'userName',
    align:'center',
    fixed: 'left',
    scopedSlots:{
      customRender:'customRender'
    }
  },
  {
    title: '手机号',
    key: 'telNum',
    dataIndex: 'telNum',
    align:'center',
    fixed: 'left',
    scopedSlots:{
      customRender:'customRender'
    }
  },
  {
    title: '年龄',
    key: 'age',
    dataIndex: 'age',
    align:'center',
    fixed: 'left',
  },
  {
    title: '视力',
    children:[
      {
        title:'远',
        children:[
          {
            title:"类型",
            key:"sight_yuan_type",
            dataIndex:"sight_yuan_type",
            align:'center',
          },
          {
            title:"OD",
            key:"sight_yuan_od",
            dataIndex:"sight_yuan_od",
            align:'center',
          }
        ]
      },
      {
        title:'近',
        children:[
          {
            title:"OS",
            key:"sight_jin_os",
            dataIndex:"sight_jin_os",
            align:'center',
          },
          {
            title:"OU",
            key:"sight_jin_ou",
            dataIndex:"sight_jin_ou",
            align:'center',
          }
        ]
      }
    ]
  },
  {
    title: '红绿测试',
    children:[
      {
        title:'OD',
        key:'honglv_od',
        dataIndex:'honglv_od',
        align:'center'
      },
      {
        title:'OS',
        key:'honglv_os',
        dataIndex:'honglv_os',
        align:'center'
      },
    ]
  },
  {
    title: 'Worth 4',
    children:[
      {
        title:'远',
        key:'worth4_yuan',
        dataIndex:'worth4_yuan',
        align:'center'
      },
      {
        title:'近',
        key:'worth4_jin',
        dataIndex:'worth4_jin',
        align:'center'
      },
    ]
  },
  {
    title: '水平眼位',
    children:[
      {
        title:'远',
        key:'shuipingyanwei_yuan',
        dataIndex:'shuipingyanwei_yuan',
        align:'center'
      },
      {
        title:'近',
        key:'shuipingyanwei_jin',
        dataIndex:'shuipingyanwei_jin',
        align:'center'
      },
    ]
  },
  {
    title: '水平聚散功能',
    children:[
      {
        title:'远BI',
        children:[
          {
            title:'模糊点',
            key:'shuiping_yuanBI_mohudian',
            dataIndex:'shuiping_yuanBI_mohudian',
            align:'center'
          },
          {
            title:'破裂点',
            key:'shuiping_yuanBI_poliedian',
            dataIndex:'shuiping_yuanBI_poliedian',
            align:'center'
          },
          {
            title:'恢复点',
            key:'shuiping_yuanBI_huifudian',
            dataIndex:'shuiping_yuanBI_huifudian',
            align:'center'
          },
        ]
      },
      {
        title:'远BO',
        children:[
          {
            title:'模糊点',
            key:'shuiping_yuanBO_mohudian',
            dataIndex:'shuiping_yuanBI_mohudian',
            align:'center'
          },
          {
            title:'破裂点',
            key:'shuiping_yuanBO_poliedian',
            dataIndex:'shuiping_yuanBI_poliedian',
            align:'center'
          },
          {
            title:'恢复点',
            key:'shuiping_yuanBO_huifudian',
            dataIndex:'shuiping_yuanBI_huifudian',
            align:'center'
          },
        ]
      },
      {
        title:'近BI',
        children:[
          {
            title:'模糊点',
            key:'shuiping_jinBI_mohudian',
            dataIndex:'shuiping_jinBI_mohudian',
            align:'center'
          },
          {
            title:'破裂点',
            key:'shuiping_jinBI_poliedian',
            dataIndex:'shuiping_jinBI_poliedian',
            align:'center'
          },
          {
            title:'恢复点',
            key:'shuiping_jinBI_huifudian',
            dataIndex:'shuiping_jinBI_huifudian',
            align:'center'
          },
        ]
      },
      {
        title:'近BO',
        children:[
          {
            title:'模糊点',
            key:'shuiping_jinBO_mohudian',
            dataIndex:'shuiping_jinBO_mohudian',
            align:'center'
          },
          {
            title:'破裂点',
            key:'shuiping_jinBO_poliedian',
            dataIndex:'shuiping_jinBO_poliedian',
            align:'center'
          },
          {
            title:'恢复点',
            key:'shuiping_jinBO_huifudian',
            dataIndex:'shuiping_jinBO_huifudian',
            align:'center'
          },
        ]
      },
    ]
  },
  {
    title: '聚散灵活度',
    children:[
      {
        title:'周期数',
        key:'jusan_zhouqishu',
        dataIndex:'jusa_zhouqishu',
        align:'center'
      },
      {
        title:'BI',
        key:'jusan_BI',
        dataIndex:'jusan_BI',
        align:'center'
      },
      {
        title:'BO',
        key:'jusan_BO',
        dataIndex:'jusan_BO',
        align:'center'
      },
    ]
  },
  {
    title: '负相对调节',
    children:[
      {
        title:'右',
        key:'fuxiangdui_you',
        dataIndex:'fuxiangdui_you',
        align:'center'
      },
      {
        title:'左',
        key:'fuxiangdui_zuo',
        dataIndex:'fuxiangdui_zuo',
        align:'center'
      },
      {
        title:'双',
        key:'fuxiangdui_shuang',
        dataIndex:'fuxiangdui_shuang',
        align:'center'
      },
    ]
  },
  {
    title: '正相对调节',
    children:[
      {
        title:'右',
        key:'zhengxiangdui_you',
        dataIndex:'zhengxiangdui_you',
        align:'center'
      },
      {
        title:'左',
        key:'zhengxiangdui_zuo',
        dataIndex:'zhengxiangdui_zuo',
        align:'center'
      },
      {
        title:'双',
        key:'zhengxiangdui_shuang',
        dataIndex:'zhengxiangdui_shuang',
        align:'center'
      },
    ]
  },
  {
    title: '调节幅度',
    children:[
      {
        title:'右',
        key:'fudu_you',
        dataIndex:'fudu_you',
        align:'center'
      },
      {
        title:'左',
        key:'fudu_zuo',
        dataIndex:'fudu_zuo',
        align:'center'
      },
      {
        title:'双',
        key:'fudu_shuang',
        dataIndex:'fudu_shuang',
        align:'center'
      },
    ]
  },
  {
    title: '调节灵活度',
    children:[
      {
        title:'右',
        children:[
          {
            title:'周期数',
            key:'tiaojie_you_zhouqishu',
            dataIndex:'tiaojie_you_zhouqishu',
            align:'center'
          },
          {
            title:'正',
            key:'tiaojie_you_zheng',
            dataIndex:'tiaojie_you_zheng',
            align:'center'
          },
          {
            title:'负',
            key:'tiaojie_you_fu',
            dataIndex:'tiaojie_you_fu',
            align:'center'
          },
        ]
      },
      {
        title:'左',
        children:[
          {
            title:'周期数',
            key:'tiaojie_zuo_zhouqishu',
            dataIndex:'tiaojie_zuo_zhouqishu',
            align:'center'
          },
          {
            title:'正',
            key:'tiaojie_zuo_zheng',
            dataIndex:'tiaojie_zuo_zheng',
            align:'center'
          },
          {
            title:'负',
            key:'tiaojie_zuo_fu',
            dataIndex:'tiaojie_zuo_fu',
            align:'center'
          },
        ]
      },
      {
        title:'双',
        children:[
          {
            title:'周期数',
            key:'tiaojie_shuang_zhouqishu',
            dataIndex:'tiaojie_shuang_zhouqishu',
            align:'center'
          },
          {
            title:'正',
            key:'tiaojie_shuang_zheng',
            dataIndex:'tiaojie_shuang_zheng',
            align:'center'
          },
          {
            title:'负',
            key:'tiaojie_shuang_fu',
            dataIndex:'tiaojie_shuang_fu',
            align:'center'
          },
        ]
      },
    ]
  },
  {
    title: 'AC/A',
    key: 'ac_a',
    dataIndex: 'ac_a',
    align:'center'
  },
  {
    title: '立体视敏度',
    key: 'litishi',
    dataIndex: 'litishi',
    align:'center'
  },
  {
    title: '色觉',
    key: 'sejue',
    dataIndex: 'sejue',
    align:'center'
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
    key:1,
    nickName:'Shine',
    testTime:formatTime(time),
    userName:'0001',
    telNum:'12345678901',
    age:'24',
  },
  {
    key:2,
    nickName:'Bob',
    testTime:formatTime(time),
    userName:'0002',
    telNum:'14456422345',
    age:'40',
  },
  {
    key:3,
    nickName:'Anna',
    testTime:formatTime(time),
    userName:'0003',
    telNum:'14345566345',
    age:'18',
  },
  {
    key:4,
    nickName:'Jim',
    testTime:formatTime(time),
    userName:'0004',
    telNum:'11111111111',
    age:'26',
  },
  {
    key:5,
    nickName:'Liam',
    testTime:formatTime(time),
    userName:'0005',
    telNum:'12222222222',
    age:'31',
  },
  {
    key:6,
    nickName:'Dan',
    testTime:formatTime(time),
    userName:'0006',
    telNum:'16666666666',
    age:'34',
  },
  {
    key:7,
    nickName:'Lisa',
    testTime:formatTime(time),
    userName:'0007',
    telNum:'14444446666',
    age:'20',
  },
  {
    key:8,
    nickName:'Olive',
    testTime:formatTime(time),
    userName:'0008',
    telNum:'45673166666',
    age:'28',
  },
  {
    key:9,
    nickName:'UYU',
    testTime:formatTime(time),
    userName:'0009',
    telNum:'24366666666',
    age:'23',
  },
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
      columns,
      data,
      searching:false,
      pageSize:10,
      startTime:null,
      endTime:null,
      channel:'',
      store:'',
      deviceId:'',
      timeInterval:'',
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
    //点击搜索按钮
    search:function(){
      this.searching = true;
      this.form.channel = this.channel;
      this.form.store = this.store;
      this.form.deviceId = this.deviceId;
      this.form.deviceType = this.deviceType; 
      let index = ['channel','store','deviceId','deviceType'];
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
      this.data = search_data;
    },
    reset(){
      this.searching = false;
      this.data = data;
      this.form = {
        channel:'',
        store:'',
        deviceId:'',
      };
      this.channel = '';
      this.store = '';
      this.deviceId = '';
      this.timeInterval = '';
      this.startTime = null;
      this.endTime = null;
    },
    changePageSize:function(e){
      e.target.blur();
      this.pagination = {pageSize: parseInt(this.pageSize)};
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
.ant-table td { white-space: nowrap; }
</style>