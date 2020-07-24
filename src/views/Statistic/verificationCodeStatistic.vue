<template>
  <div class="subpage-layout">
    <div class="subpage-title">
      验证码信息
    </div>
    <div class="subpage-content">
      <!-- 请在此处填充内容 -->
      <div class="form-area" style="width:36%;display:flex;justify-content:space-between">
        <a-form-model style="width:55%;display:flex;justify-content:space-between" layout="inline" :model="form" v-bind="{labelCol:{span:5},wrapperCol:{offset:1,span:16}}">
          <a-form-model-item label="手机号">
            <a-input v-model="telNumber" />
          </a-form-model-item>
        </a-form-model>
        <div style="width:45%;display:flex;justify-content:space-around;align-items:center">
          <a-button type="primary" @click="search">
            搜索
          </a-button>
          <a-button type="primary" @click="reset">
            重置
          </a-button>
          <a-button style="color:white;background-color:#faad14;" @click="handleExport">
            导出
          </a-button>
        </div>
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
import XLSX from 'xlsx'
const columns = [
  {
    title: '序号',
    dataIndex: 'number',
    key: 'number',
    align:'center'
  },
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    align:'center'
  },
  {
    title: '手机号',
    dataIndex: 'telNumber',
    key: 'telNumber',
    align:'center',
    scopedSlots:{
      customRender:'customRender'
    }
  },
  {
    title: '验证码',
    key: 'verifyCode',
    dataIndex: 'verifyCode',
    align:'center'
  },
  {
    title: '起始时间',
    key: 'startTime',
    dataIndex: 'startTime',
    align:'center'
  },
  {
    title: '结束时间',
    key: 'endTime',
    dataIndex: 'endTime',
    align:'center'
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
    id:2231,
    telNumber:'15022046517',
    verifyCode:'6656',
    startTime:formatTime(time),
    endTime:formatTime(time)
  },
  {
    key:2,
    id:2231,
    telNumber:'123456789011',
    verifyCode:'6656',
    startTime:formatTime(time),
    endTime:formatTime(time)
  },
  {
    key:3,
    id:2231,
    telNumber:'123456789012',
    verifyCode:'6656',
    startTime:formatTime(time),
    endTime:formatTime(time)
  },
  {
    key:4,
    id:2231,
    telNumber:'123456789013',
    verifyCode:'6656',
    startTime:formatTime(time),
    endTime:formatTime(time)
  },
  {
    key:5,
    id:2231,
    telNumber:'123456789014',
    verifyCode:'6656',
    startTime:formatTime(time),
    endTime:formatTime(time)
  },
  {
    key:6,
    id:2231,
    telNumber:'123456789015',
    verifyCode:'6656',
    startTime:formatTime(time),
    endTime:formatTime(time)
  },
  {
    key:7,
    id:2231,
    telNumber:'123456789016',
    verifyCode:'6656',
    startTime:formatTime(time),
    endTime:formatTime(time)
  },
  {
    key:8,
    id:2231,
    telNumber:'123456789018',
    verifyCode:'6656',
    startTime:formatTime(time),
    endTime:formatTime(time)
  },
  {
    key:9,
    id:2231,
    telNumber:'123456789019',
    verifyCode:'6656',
    startTime:formatTime(time),
    endTime:formatTime(time)
  },
  {
    key:10,
    id:2231,
    telNumber:'123456789020',
    verifyCode:'6656',
    startTime:formatTime(time),
    endTime:formatTime(time)
  },
  {
    key:11,
    id:2231,
    telNumber:'123456789021',
    verifyCode:'6656',
    startTime:formatTime(time),
    endTime:formatTime(time)
  },
  {
    key:12,
    id:2231,
    telNumber:'123456789022',
    verifyCode:'6656',
    startTime:formatTime(time),
    endTime:formatTime(time)
  },
  {
    key:13,
    id:2231,
    telNumber:'123456789023',
    verifyCode:'6656',
    startTime:formatTime(time),
    endTime:formatTime(time)
  },
  {
    key:14,
    id:2231,
    telNumber:'123456789024',
    verifyCode:'6656',
    startTime:formatTime(time),
    endTime:formatTime(time)
  },
  {
    key:15,
    id:2231,
    telNumber:'123456789025',
    verifyCode:'6656',
    startTime:formatTime(time),
    endTime:formatTime(time)
  },
  {
    key:16,
    id:2231,
    telNumber:'123456789026',
    verifyCode:'6656',
    startTime:formatTime(time),
    endTime:formatTime(time)
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
        telNumber:''
      },
      telNumber:'',
      data,
      columns,
      searching:false,
      pageSize:10,
      pagination:{pageSize:10},
      selected:undefined,
    }
  },
  methods:{
    //点击搜索按钮
    search:function(){
      this.searching = true;
      this.form.telNumber = this.telNumber;
      let index = ['telNumber'];
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
        telNumber:''
      };
      this.telNumber = '';
      this.selected = undefined;
    },
    clickSelect(value){     
      this.selected = value;
      console.log(value);
    },
    //改变表格每页显示数据条数
    changePageSize:function(e){
      e.target.blur();
      this.pagination = {pageSize: parseInt(this.pageSize)};
    },
    handleExport(){
      let exportedData = [];
      exportedData.push(['验证码信息',null,null,null,null]);
      exportedData.push(['ID','手机号','验证码','起始时间','结束时间']);
      //获得当前表格中的数据
      for(let i = 0; i < this.data.length; i++){
        let temp = this.data[i];
        temp = [temp.id, temp.telNumber, temp.verifyCode, temp.startTime, temp.endTime];
        exportedData.push(temp);
      }
      //创建工作表
      const workSheet = XLSX.utils.aoa_to_sheet(exportedData);
      //合并单元格
      workSheet['!merges'] = [{s:{r:0, c:0}, e:{r:0, c:4}}]
      //创建工作簿
      const workBook = XLSX.utils.book_new();
      //向工作簿中添加工作表
      XLSX.utils.book_append_sheet(workBook, workSheet);
      //输出工作簿
      XLSX.writeFile(workBook, 'newSheet.xlsx',{bookType: 'xlsx'});
    }
  }
}
</script>

<style scoped>
.highlight {
  background-color: rgb(253, 245, 1);
  padding: 0px;
}
</style>