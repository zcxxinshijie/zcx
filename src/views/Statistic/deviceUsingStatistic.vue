<template>
  <div class="subpage-layout">
    <div class="subpage-title">
      设备使用数据统计
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
              label="设备类型"
              labelAlign="left"
              :labelCol="{span:6}"
              :wrapperCol="{span:14}">
              <a-select v-model="deviceSelect" style="width:120px">
                <a-select-option value="train">训练仪</a-select-option>
                <a-select-option value="test">检查仪</a-select-option>
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
              <a-date-picker E
                style="width:45%" 
                placeholder="结束日期"
                v-model="endTime"
                :disabled-date="disabledEndDate"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="7" style="display:flex;justify-content:space-around;align-items:center;">
            <a-button style="color:white;background-color:darkgray;" @click=choosePeriod(1)>最近一月</a-button>
            <a-button style="color:white;background-color:darkgray;" @click=choosePeriod(2)>本月</a-button>
            <a-button style="color:white;background-color:darkgray" @click=choosePeriod(3)>最近半年</a-button>
            <a-button style="color:white;background-color:darkgray;" @click=choosePeriod(4)>最近一年</a-button>
          </a-col>
          <a-col :span="7" style="display:flex;align-items:center">
            <div style="margin-left:10%;width:60%;display:flex;justify-content:space-around;align-items:center">
              <a-button type="primary" @click="search">搜索</a-button>
              <a-button type="primary" @click="reset">重置</a-button>
              <a-button style="color:white;background-color:#faad14;" @click="handleExport">导出</a-button>
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
// import XLSX from 'xlsx'
const columns = [
  {
    title: '序号',
    dataIndex: 'number',
    key: 'number',
    align:'center'
  },
  {
    title: '设备类型',
    key: 'deviceType',
    dataIndex: 'deviceType',
    align:'center',
    scopedSlots:{
      customRender:'customRender'
    }
  },
  {
    title: '设备编号',
    key: 'deviceId',
    dataIndex: 'deviceId',
    align:'center',
    scopedSlots:{
      customRender:'customRender'
    }
  },
  {
    title: '渠道名称',
    dataIndex: 'channel',
    key: 'channel',
    align:'center',
    scopedSlots:{
      customRender:'customRender'
    }
  },
  {
    title: '门店名称',
    key: 'store',
    dataIndex: 'store',
    align:'center',
    scopedSlots:{
      customRender:'customRender'
    }
  }
];
const data = [
  {
    key:1,
    deviceType:'训练仪',
    deviceId:'1168',
    channel:'优丫优自有机构',
    store:'优眼',
    time1:2,
    time2:4,
    time3:1,
    time4:2,
    time5:4,
    time6:1,
    time7:2,
    time8:4,
    time9:1,
    time10:2,
    time11:4,
    time12:1,
  },
  {
    key:2,
    deviceType:'训练仪',
    deviceId:'1129',
    channel:'优丫优自有机构',
    store:'优眼',
    time1:2,
    time2:4,
    time3:1,
    time4:2,
    time5:4,
    time6:1,
    time7:2,
    time8:4,
    time9:1,
    time10:2,
    time11:4,
    time12:1,
  },
  {
    key:3,
    deviceType:'训练仪',
    deviceId:'1629',
    channel:'优丫优自有机构',
    store:'优眼',
    time1:2,
    time2:4,
    time3:1,
    time4:2,
    time5:4,
    time6:1,
    time7:2,
    time8:4,
    time9:1,
    time10:2,
    time11:4,
    time12:1,
  },
  {
    key:4,
    deviceType:'训练仪',
    deviceId:'1029',
    channel:'优丫优自有机构',
    store:'优眼',
    time1:2,
    time2:4,
    time3:1,
    time4:2,
    time5:4,
    time6:1,
    time7:2,
    time8:4,
    time9:1,
    time10:2,
    time11:4,
    time12:1,
  },
  {
    key:5,
    deviceType:'训练仪',
    deviceId:'1189',
    channel:'优丫优自有机构',
    store:'优眼',
    time1:2,
    time2:4,
    time3:1,
    time4:2,
    time5:4,
    time6:1,
    time7:2,
    time8:4,
    time9:1,
    time10:2,
    time11:4,
    time12:1,
  },
  {
    key:6,
    deviceType:'训练仪',
    deviceId:'1149',
    channel:'优丫优自有机构',
    store:'优眼',
    time1:2,
    time2:4,
    time3:1,
    time4:2,
    time5:4,
    time6:1,
    time7:2,
    time8:4,
    time9:1,
    time10:2,
    time11:4,
    time12:1,
  },
  {
    key:7,
    deviceType:'训练仪',
    deviceId:'1937',
    channel:'优丫优自有机构',
    store:'优眼',
    time1:2,
    time2:4,
    time3:1,
    time4:2,
    time5:4,
    time6:1,
    time7:2,
    time8:4,
    time9:1,
    time10:2,
    time11:4,
    time12:1,
  },
  {
    key:8,
    deviceType:'训练仪',
    deviceId:'0284',
    channel:'优丫优自有机构',
    store:'优眼',
    time1:2,
    time2:4,
    time3:1,
    time4:2,
    time5:4,
    time6:1,
    time7:2,
    time8:4,
    time9:1,
    time10:2,
    time11:4,
    time12:1,
  },
  {
    key:9,
    deviceType:'训练仪',
    deviceId:'9244',
    channel:'优丫优自有机构',
    store:'优眼',
    time1:2,
    time2:4,
    time3:1,
    time4:2,
    time5:4,
    time6:1,
    time7:2,
    time8:4,
    time9:1,
    time10:2,
    time11:4,
    time12:1,
  },
  {
    key:10,
    deviceType:'训练仪',
    deviceId:'2968',
    channel:'优丫优自有机构',
    store:'优眼',
    time1:2,
    time2:4,
    time3:1,
    time4:2,
    time5:4,
    time6:1,
    time7:2,
    time8:4,
    time9:1,
    time10:2,
    time11:4,
    time12:1,
  },
  {
    key:11,
    deviceType:'训练仪',
    deviceId:'0274',
    channel:'优丫优自有机构',
    store:'优眼',
    time1:2,
    time2:4,
    time3:1,
    time4:2,
    time5:4,
    time6:1,
    time7:2,
    time8:4,
    time9:1,
    time10:2,
    time11:4,
    time12:1,
  },
  {
    key:12,
    deviceType:'训练仪',
    deviceId:'8327',
    channel:'优丫优自有机构',
    store:'优眼',
    time1:2,
    time2:4,
    time3:1,
    time4:2,
    time5:4,
    time6:1,
    time7:2,
    time8:4,
    time9:1,
    time10:2,
    time11:4,
    time12:1,
  },
  {
    key:13,
    deviceType:'训练仪',
    deviceId:'7593',
    channel:'优丫优自有机构',
    store:'优眼',
    time1:2,
    time2:4,
    time3:1,
    time4:2,
    time5:4,
    time6:1,
    time7:2,
    time8:4,
    time9:1,
    time10:2,
    time11:4,
    time12:1,
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
      form:{
        channel:'',
        store:'',
        deviceId:'',
        deviceType:'',
      },
      channel:'',
      store:'',
      deviceId:'',
      deviceSelect:'',
      startTime:null,
      endTime:null,
      columns:columns,
      data:data,
      searching:false,
      pageSize:10,
      pagination:{pageSize:10},
    }
  },
  computed:{
    deviceType: function(){
      if(this.deviceSelect === 'train') return '训练仪';
      if(this.deviceSelect === 'test') return '检查仪';
      return '';
     }
  },
  created(){
    let date = new Date();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    for(let i = 3; i > 0; i--){
      let target = `${month - i > 0 ? year : year - 1}.${(month - i + 11) % 12 + 1}`;
      let temp = {
        title: target,
        key: `time${3 - i + 1}`,
        dataIndex: `time${3 - i + 1}`,
        align:'center',
      }
      this.columns.push(temp);
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
      let startMonth, startYear = -1;
      let len = 0;
      if(index === 1){//最近一月
        date = new Date(year, month, 0); //此month从1开始
        let days = date.getDate();
        this.startTime = `${year}/${month}/1`;
        this.endTime = `${year}/${month}/${days}`;
        startMonth = month;
        startYear = year;
        len = 1;
      }else if(index === 2){//本月
        this.startTime = `${year}/${month + 1}/1`;
        this.endTime = `${year}/${month + 1}/${date.getDate()}`;
        startMonth = month + 1;
        startYear = year;
        len = 1;
      }else if(index === 3){//最近半年
        startMonth = (month - 6 + 12) % 12;
        startYear = month >= 6 ? year : year - 1;
        this.startTime = `${startYear}/${startMonth + 1}/1`;
        let endDate = new Date(year, month, 0);
        let days = endDate.getDate();
        this.endTime = `${year}/${month}/${days}`;
        len = 6;
      }else if(index === 4){ //最近一年
        startMonth = month;
        startYear = year - 1;
        this.startTime = `${startYear}/${startMonth + 1}/1`;
        let endDate = new Date(year, month, 0);
        let days = endDate.getDate();
        this.endTime = `${year}/${month}/${days}`;
        len = 12;
      }
      let startM = startMonth;
      let startY = startYear;
      let columns = this.columns.slice(0,5);
      for(let i = 0; i < len; i++){
        let temp = {
          title: `${startY}.${startM}`,
          key: `time${i}`,
          dataIndex: `time${i + 1}`,
          align:'center',
        };
        columns.push(temp);
        startY = startM + 1 > 12 ? startY + 1 : startY;
        startM = startM + 1 > 12 ? 1 : startM + 1;         
      }
      this.columns = columns;
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
        deviceType:'',
      };
      this.channel = '';
      this.store = '';
      this.deviceId = '';
      this.deviceSelect = '';
      this.startTime = null;
      this.endTime = null;
    },
    changePageSize:function(e){
      e.target.blur();
      this.pagination = {pageSize: parseInt(this.pageSize)};
    },
    handleExport(){
      let exportedData = [];
      exportedData.push(['设备使用数据统计',null,null,null]);
      //未完成：根据时间区间显示不同内容的表格
      exportedData.push(['设备类型','设备编号','渠道名称','门店名称']);
      let startTime = this.startTime;
      let endTime = this.endTime;
      if(startTime === '' || endTime === '') return;
      let startMonth,startYear,startDate = 0;
      let endMonth,endYear,endDate = 0;
      [startYear,startMonth,startDate] = startTime.match(/\d+/g);
      [endYear,endMonth,endDate] = endTime.match(/\d+/g);
      console.log(startYear);
      console.log(startMonth);
      console.log(startDate);
      console.log(endYear);
      console.log(endMonth);
      console.log(endDate);
      // while(startMonth !== endMonth){
      //   console.log(startMonth)
      //   // exportedData[0].push(null);
      //   // exportedData[1].push(`${startYear}年${startMonth}月`);
      //   if(startMonth + 1 > 12){
      //     startMonth = 1;
      //     startYear++;
      //   }else{
      //     startMonth++;
      //   }
      // }
      console.log(startYear)
      // console.log(exportedData);
      //获得当前表格中的数据
      // for(let i = 0; i < this.data.length; i++){
      //   let temp = this.data[i];
      //   temp = [temp.id, temp.telNumber, temp.verifyCode, temp.startTime, temp.endTime];
      //   exportedData.push(temp);
      // }
      // //创建工作表
      // const workSheet = XLSX.utils.aoa_to_sheet(exportedData);
      // //合并单元格
      // workSheet['!merges'] = [{s:{r:0, c:0}, e:{r:0, c:4}}]
      // //创建工作簿
      // const workBook = XLSX.utils.book_new();
      // //向工作簿中添加工作表
      // XLSX.utils.book_append_sheet(workBook, workSheet);
      // //输出工作簿
      // XLSX.writeFile(workBook, 'newSheet.xlsx',{bookType: 'xlsx'});
    }
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