<template>
  <div class="subpage-layout">
    <div class="subpage-title">
      运营数据
    </div>
    <div class="subpage-content">
      <div class="form-area" style="width:100%" >
        <a-row style="display:flex;justify-content:space-between;margin-bottom:15px">
          <a-col :span="8">
            <a-form-model-item 
              label="渠道" 
              labelAlign="left"
              :colon="false"
              :labelCol="{span:3}"
              :wrapperCol="{span:14}">
              <a-input v-model="channel"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item 
              label="门店"
              labelAlign="left"
              :colon="false"
              :labelCol="{span:3}"
              :wrapperCol="{span:14}">
              <a-input v-model="store"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item 
              label="时间间隔"
              labelAlign="left"
              :colon="false"
              :labelCol="{span:4}"
              :wrapperCol="{span:14}">
              <a-select style="width:290px;" v-model="interval" placeholder="请选择">
                <a-select-option value="1">日</a-select-option>
                <a-select-option value="2">周</a-select-option>
                <a-select-option value="3">月</a-select-option>
                <a-select-option value="4">年</a-select-option>
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
          <a-col :span="7" style="display:flex;justify-content:space-around;align-items:center;">
            <a-button style="color:white;background-color:darkgray;" @click=choosePeriod(1)>最近一周</a-button>
            <a-button style="color:white;background-color:darkgray;" @click=choosePeriod(2)>本月</a-button>
            <a-button style="color:white;background-color:darkgray" @click=choosePeriod(3)>最近一月</a-button>
            <a-button style="color:white;background-color:darkgray;" @click=choosePeriod(4)>最近三月</a-button>
          </a-col>
          <a-col :span="7" style="display:flex;align-items:center">
            <div style="margin-left:10%;width:60%;display:flex;justify-content:space-around;align-items:center">
              <a-button type="primary" >搜索</a-button>
              <a-button type="primary" >重置</a-button>
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
  {title: '展开',dataIndex: 'expand',align:'center'},
  {title: '渠道/门店名称',dataIndex: 'channel',align:'center'},
  {title: '门店数量',dataIndex: 'store_count',align:'center'},
  {title: '门店活跃量',dataIndex: 'store_activity',align:'center'},
  {title: '训练次数',dataIndex: 'training_count',align:'center'},
  {title: '单台平均训练次数',dataIndex: 'average_training_count',align:'center'},
  {title: '分配次数',dataIndex: 'distribution_time',align:'center'},
  {title: '剩余总次数',dataIndex: 'left_time',align:'center'},
  {title: '折合收入测算',dataIndex: 'equal_income',align:'center'},
];
  
const data = [
  {
    key: 1,
    channel: 'UYU直营',
    store_count:23,
    store_activity:20,
    training_count:100,
    average_training_count:10,
    distribution_time:4,
    left_time:3,
    equal_income:3,
    children: [
      {
        key: 11,
        channel: 'UYU直营',
        store_count:23,
        store_activity:20,
        training_count:100,
        average_training_count:10,
        distribution_time:4,
        left_time:3,
        equal_income:3,
      },
      {
        key: 12,
        channel: 'UYU直营',
        store_count:23,
        store_activity:20,
        training_count:100,
        average_training_count:10,
        distribution_time:4,
        left_time:3,
        equal_income:3,
      },
      {
        key: 13,
        channel: 'UYU直营',
        store_count:23,
        store_activity:20,
        training_count:100,
        average_training_count:10,
        distribution_time:4,
        left_time:3,
        equal_income:3,
      },
    ],
  },
  {
    key: 2,
    channel: 'UYU直营',
    store_count:23,
    store_activity:20,
    training_count:100,
    average_training_count:10,
    distribution_time:4,
    left_time:3,
    equal_income:3,
    children: [
      {
        key: 21,
        channel: 'UYU直营',
        store_count:23,
        store_activity:20,
        training_count:100,
        average_training_count:10,
        distribution_time:4,
        left_time:3,
        equal_income:3,
      },
      {
        key: 22,
        channel: 'UYU直营',
        store_count:23,
        store_activity:20,
        training_count:100,
        average_training_count:10,
        distribution_time:4,
        left_time:3,
        equal_income:3,
      },
      {
        key: 23,
        channel: 'UYU直营',
        store_count:23,
        store_activity:20,
        training_count:100,
        average_training_count:10,
        distribution_time:4,
        left_time:3,
        equal_income:3,
      },
    ],
  },
  {
    key: 4,
    channel: 'UYU直营',
    store_count:23,
    store_activity:20,
    training_count:100,
    average_training_count:10,
    distribution_time:4,
    left_time:3,
    equal_income:3,
  },
  {
    key: 5,
    channel: 'UYU直营',
    store_count:0,
    store_activity:20,
    training_count:100,
    average_training_count:10,
    distribution_time:4,
    left_time:3,
    equal_income:3,
    children:[]
  },
  {
    key: 6,
    channel: 'UYU直营',
    store_count:23,
    store_activity:20,
    training_count:100,
    average_training_count:10,
    distribution_time:4,
    left_time:3,
    equal_income:3,
  },
  {
    key: 3,
    channel: 'UYU直营',
    store_count:23,
    store_activity:20,
    training_count:100,
    average_training_count:10,
    distribution_time:4,
    left_time:3,
    equal_income:3,
    children: [
      {
        key: 31,
        channel: 'UYU直营',
        store_count:23,
        store_activity:20,
        training_count:100,
        average_training_count:10,
        distribution_time:4,
        left_time:3,
        equal_income:3,
      },
      {
        key: 32,
        channel: 'UYU直营',
        store_count:23,
        store_activity:20,
        training_count:100,
        average_training_count:10,
        distribution_time:4,
        left_time:3,
        equal_income:3,
      },
      {
        key: 33,
        channel: 'UYU直营',
        store_count:23,
        store_activity:20,
        training_count:100,
        average_training_count:10,
        distribution_time:4,
        left_time:3,
        equal_income:3,
      },
    ],
  },
  {
    key: 7,
    channel: 'UYU直营',
    store_count:23,
    store_activity:20,
    training_count:100,
    average_training_count:10,
    distribution_time:4,
    left_time:3,
    equal_income:3,
  }
];

export default {
  data(){
    return{
      columns,
      data,
      channel:'',
      store:'',
      interval:null,
      startTime:null,
      endTime:'',
      pageSize:10,
      pagination:{pageSize:10},
    }
  },
  created(){
    //使用axios示例
    this.axios.get('https://api.coindesk.com/v1/bpi/currentprice.json')
      .then(response => {console.log(response)})
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
    //改变表格每页显示数据条数
    changePageSize:function(e){
      e.target.blur();
      this.pagination = {pageSize: parseInt(this.pageSize)};
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