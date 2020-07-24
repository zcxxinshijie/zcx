<template>
  <div class="subpage-layout">
    <div class="subpage-title">
      用户筛查
    </div>
    <div class="subpage-content">
      <!-- 请在此处填充内容 -->
      <div class="form-area" style="width:100%;display:flex;justify-content:space-between">
        <a-form-model style="width:83%;display:flex;justify-content:space-between" layout="inline" :model="form" v-bind="{labelCol:{span:4},wrapperCol:{offset:1,span:16}}">
          <a-form-model-item label="姓名">
            <a-input v-model="form.name" />
          </a-form-model-item>
          <a-form-model-item label="学校">
            <a-input v-model="form.school" />
          </a-form-model-item>
          <a-form-model-item label="年级">
            <a-input v-model="form.grade" />
          </a-form-model-item>
          <a-form-model-item label="班级">
            <a-input v-model="form.class" />
          </a-form-model-item>
        </a-form-model>
        <div style="width:17%;display:flex;justify-content:space-around;align-items:center">
          <a-button type="primary" @click="search">
            搜索
          </a-button>
          <a-button type="primary" @click="reset">
            重置
          </a-button>
          <a-button style="color:white;background-color:#faad14;">
            导入
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
      <a-modal
        title="Title"
        :visible="visible"
        :confirm-loading="confirmLoading"
        centered
        @ok="handleOk"
        @cancel="handleCancel"
        cancelText="关闭"
        okText="开始"
        :maskStyle="{'background-color':'rgb(0,0,0,0.2)'}"
        :bodyStyle="{'height':'100px'}"
      >
        <div class="modal-body">
          <a-form-item
            label="设备编号"
            :labelCol="{span:6}"
            :wrapperCol="{offset:1,span:15}"
            required>
            <!-- validateStatus=null
            hasFeedback=true
            help=null -->
            <a-input
              placeholder="请输入设备编号"
            />
          </a-form-item>
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
    align:'center'
  },
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    align:'center'
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    align:'center',
    scopedSlots:{
      customRender:'customRender'
    }
  },
  {
    title: '性别',
    key: 'gender',
    dataIndex: 'gender',
    align:'center'
  },
  {
    title: '年龄',
    key: 'age',
    dataIndex: 'age',
    align:'center'
  },
  {
    title: '身份证号',
    key: 'IDnumber',
    dataIndex: 'IDnumber',
    align:'center'
  },
  {
    title: '学校',
    key: 'school',
    dataIndex: 'school',
    align:'center',
    scopedSlots:{
      customRender:'customRender'
    }
  },
  {
    title: '年级',
    key: 'grade',
    dataIndex: 'grade',
    align:'center',
    scopedSlots:{
      customRender:'customRender'
    }
  },
  {
    title: '班级',
    key: 'class',
    dataIndex: 'class',
    align:'center',
    scopedSlots:{
      customRender:'customRender'
    }
  },
  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime',
    align:'center'
  },
  {
    title: '次数',
    key: 'times',
    dataIndex: 'times',
    align:'center'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
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
  let min = time.getMinutes();
  let sec = time.getSeconds();
  return `${year}/${month}/${date} ${hour}:${min}:${sec}`;
}
const data = [
  {
    key:1,
    id:1050618,
    name:'Shine',
    gender:'女',
    age:12,
    IDnumber:'120111199909099090',
    school:'南开小学',
    grade:'五',
    class:'二',
    createTime:formatTime(time),
    times:1
  },
  {
    key:2,
    id:1050618,
    name:'Adam',
    gender:'男',
    age:12,
    IDnumber:'120111199909099090',
    school:'红光小学',
    grade:'一',
    class:'三',
    createTime:formatTime(time),
    times:1
  },
  {
    key:3,
    id:1050618,
    name:'Ann',
    gender:'女',
    age:12,
    IDnumber:'120111199909099090',
    school:'科大附小',
    grade:'二',
    class:'一',
    createTime:formatTime(time),
    times:1
  },
  {
    key:4,
    id:1050618,
    name:'Sue',
    gender:'女',
    age:12,
    IDnumber:'120111199909099090',
    school:'南开小学',
    grade:'四',
    class:'二',
    createTime:formatTime(time),
    times:1
  },
  {
    key:5,
    id:1050618,
    name:'Bob',
    gender:'男',
    age:12,
    IDnumber:'120111199909099090',
    school:'红光小学',
    grade:'六',
    class:'三',
    createTime:formatTime(time),
    times:1
  },
  {
    key:6,
    id:1050618,
    name:'Coco',
    gender:'女',
    age:12,
    IDnumber:'120111199909099090',
    school:'红光小学',
    grade:'五',
    class:'三',
    createTime:formatTime(time),
    times:1
  },
  {
    key:7,
    id:1050618,
    name:'Tim',
    gender:'男',
    age:12,
    IDnumber:'120111199909099090',
    school:'清水河小学',
    grade:'一',
    class:'二',
    createTime:formatTime(time),
    times:1
  },
  {
    key:8,
    id:1050618,
    name:'Lisa',
    gender:'女',
    age:12,
    IDnumber:'120111199909099090',
    school:'南开小学',
    grade:'三',
    class:'一',
    createTime:formatTime(time),
    times:1
  },
  {
    key:9,
    id:1050618,
    name:'Jane',
    gender:'女',
    age:12,
    IDnumber:'120111199909099090',
    school:'南开小学',
    grade:'二',
    class:'三',
    createTime:formatTime(time),
    times:1
  },
  {
    key:10,
    id:1050618,
    name:'Shine',
    gender:'女',
    age:12,
    IDnumber:'120111199909099090',
    school:'南开小学',
    grade:'五',
    class:'二',
    createTime:formatTime(time),
    times:1
  },
  {
    key:11,
    id:1050618,
    name:'Shine',
    gender:'女',
    age:12,
    IDnumber:'120111199909099090',
    school:'南开小学',
    grade:'五',
    class:'二',
    createTime:formatTime(time),
    times:1
  },
  {
    key:12,
    id:1050618,
    name:'Shine',
    gender:'女',
    age:12,
    IDnumber:'120111199909099090',
    school:'南开小学',
    grade:'五',
    class:'二',
    createTime:formatTime(time),
    times:1
  },
  {
    key:13,
    id:1050618,
    name:'Shine',
    gender:'女',
    age:12,
    IDnumber:'120111199909099090',
    school:'南开小学',
    grade:'五',
    class:'二',
    createTime:formatTime(time),
    times:1
  },
  {
    key:14,
    id:1050618,
    name:'Shine',
    gender:'女',
    age:12,
    IDnumber:'120111199909099090',
    school:'南开小学',
    grade:'五',
    class:'二',
    createTime:formatTime(time),
    times:1
  },
  {
    key:15,
    id:1050618,
    name:'Shine',
    gender:'女',
    age:12,
    IDnumber:'120111199909099090',
    school:'南开小学',
    grade:'五',
    class:'二',
    createTime:formatTime(time),
    times:1
  },
  {
    key:16,
    id:1050618,
    name:'Shine',
    gender:'女',
    age:12,
    IDnumber:'120111199909099090',
    school:'南开小学',
    grade:'五',
    class:'二',
    createTime:formatTime(time),
    times:1
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
        name:'',   //这个默认为undefined
        school:'',
        grade:'',
        class:''
      },
      data,
      columns,
      searching:false,
      pageSize:10,
      pagination:{pageSize:10},
      visible: false,
      confirmLoading: false,
    }
  },
  created(){
  },
  methods:{
    //点击搜索按钮
    search:function(){
      this.searching = true;
      let index = ['name','school','grade','class'];
      let search_data = data, i = 0;
      while(i < 4){
        let target = this.form[index[i]].trim();
        console.log(this.form[index[i]])
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
        name:'',
        school:'',
        grade:'',
        class:''
      };
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
.highlight {
  background-color: rgb(253, 245, 1);
  padding: 0px;
}
</style>