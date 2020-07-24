<template>
  <div class="subpage-layout">
    <div class="subpage-title">
      客户训练情况
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
              label="登录名"
              labelAlign="left"
              :colon="false"
              :labelCol="{span:4}"
              :wrapperCol="{span:14}">
              <a-input v-model="loginName"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row style="display:flex;justify-content:space-between;margin-bottom:15px">
          <a-col :span="8">
            <a-form-model-item 
              label="抽取频率"
              labelAlign="left"
              :colon="false"
              :labelCol="{span:4}"
              :wrapperCol="{span:16}">
              <a-select style="width:290px;" v-model="frequency">
                <a-select-option value="1">1</a-select-option>
                <a-select-option value="5">5</a-select-option>
                <a-select-option value="10">10</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item 
              label="用户活跃度"
              labelAlign="left"
              :colon="false"
              :labelCol="{span:5}"
              :wrapperCol="{span:16}">
              <a-select style="width:270px;" v-model="activity" :labelInValue="true">
                <a-select-option value="1">全部用户</a-select-option>
                <a-select-option value="2">前一日有训练的用户</a-select-option>
                <a-select-option value="3">当日有训练的用户</a-select-option>
                <a-select-option value="4">一周内有训练的用户</a-select-option>
                <a-select-option value="5">一月内有训练的用户</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" style="display:flex;">
            <div style="display:flex;align-items:center">
              <a-button type="primary" style="margin-right:30px">搜索</a-button>
              <a-button type="primary" style="margin-right:30px">重置</a-button>
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
          <!-- <template slot="customRender" slot-scope="text,record,index,column">
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
          </template> -->
          <templage slot="checkDetail">
            <a-button type="primary">详细指标</a-button>
          </templage>
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
  {title: '姓名',dataIndex: 'name',align:'center'},
  {title: '年龄',dataIndex: 'age',align:'center'},
  {title: '性别',dataIndex: 'gender',align:'center'},
  {title: '联系方式',dataIndex: 'tel',align:'center'},
  {title: '首次训练日期',dataIndex: 'first_training_date',align:'center'},
  {title: '首次签约日期',dataIndex: 'first_sign_date',align:'center'},
  {title: '购买记录',dataIndex: 'purchase_history',align:'center'},
  {title: '功能障碍',dataIndex: 'function_obstacle',align:'center'},
  {title: '检查结果',dataIndex: 'inspect_result',align:'center'},
  {title: '训练明细',dataIndex: 'training_detail',align:'center',scopedSlots:{customRender:'checkDetail'}},
];

const data = [
  {
    key: 1,
    name: 'Shine',
    age:23,
    gender:'女',
    tel:'1246382910',
    first_training_date:'2020.4.6',
    first_sign_date:'2020.3.7',
    purchase_history:'2020.3.8, 1次',
    function_obstacle:'',
    check_result:'',
    children: [
      {
        key: 11,
        name: 'Shine',
        age:23,
        gender:'女',
        tel:'1246382910',
        first_training_date:'2020.4.6',
        first_sign_date:'2020.3.7',
        purchase_history:'2020.3.8, 1次',
        function_obstacle:'',
        check_result:''
      },
      {
        key: 12,
        name: 'Shine',
        age:23,
        gender:'女',
        tel:'1246382910',
        first_training_date:'2020.4.6',
        first_sign_date:'2020.3.7',
        purchase_history:'2020.5.8, 5次',
        function_obstacle:'',
        check_result:''
      },
      {
        key: 13,
        name: 'Shine',
        age:23,
        gender:'女',
        tel:'1246382910',
        first_training_date:'2020.4.6',
        first_sign_date:'2020.3.7',
        purchase_history:'2020.7.8, 10次',
        function_obstacle:'',
        check_result:''
      },
    ]
  },
  {
    key: 2,
    name: 'Bob',
    age:26,
    gender:'男',
    tel:'1246111110',
    first_training_date:'2020.1.16',
    first_sign_date:'2020.1.16',
    purchase_history:'2020.1.18, 1次',
    function_obstacle:'',
    check_result:'',
    children: [
      {
        key: 21,
        name: 'Bob',
        age:26,
        gender:'男',
        tel:'1246111110',
        first_training_date:'2020.1.16',
        first_sign_date:'2020.1.16',
        purchase_history:'2020.1.18, 1次',
        function_obstacle:'',
        check_result:'',
      },
      {
        key: 22,
        name: 'Bob',
        age:26,
        gender:'男',
        tel:'1246111110',
        first_training_date:'2020.1.16',
        first_sign_date:'2020.1.16',
        purchase_history:'2020.2.24, 10次',
        function_obstacle:'',
        check_result:'',
      },
      {
        key: 23,
        name: 'Bob',
        age:26,
        gender:'男',
        tel:'1246111110',
        first_training_date:'2020.1.16',
        first_sign_date:'2020.1.16',
        purchase_history:'2020.5.18, 15次',
        function_obstacle:'',
        check_result:'',
      },
    ]
  },
  {
    key: 3,
    name: 'Liam',
    age:19,
    gender:'男',
    tel:'1223678110',
    first_training_date:'2020.5.18',
    first_sign_date:'2020.5.16',
    purchase_history:'2020.5.18, 1次',
    function_obstacle:'',
    check_result:'',
    children: [
      {
        key: 31,
        name: 'Liam',
        age:19,
        gender:'男',
        tel:'1223678110',
        first_training_date:'2020.5.18',
        first_sign_date:'2020.5.16',
        purchase_history:'2020.5.18, 1次',
        function_obstacle:'',
        check_result:'',
      },
      {
        key: 32,
        name: 'Liam',
        age:19,
        gender:'男',
        tel:'1223678110',
        first_training_date:'2020.5.18',
        first_sign_date:'2020.5.16',
        purchase_history:'2020.6.18, 10次',
        function_obstacle:'',
        check_result:'',
      }
    ]
  },
  {
    key: 4,
    name: 'Shine',
    age:23,
    gender:'女',
    tel:'1246382910',
    first_training_date:'2020.4.6',
    first_sign_date:'2020.3.7',
    purchase_history:'2020.3.8, 1次',
    function_obstacle:'',
    check_result:'',
    children: [
      {
        key: 41,
        name: 'Shine',
        age:23,
        gender:'女',
        tel:'1246382910',
        first_training_date:'2020.4.6',
        first_sign_date:'2020.3.7',
        purchase_history:'2020.3.8, 1次',
        function_obstacle:'',
        check_result:''
      },
      {
        key: 42,
        name: 'Shine',
        age:23,
        gender:'女',
        tel:'1246382910',
        first_training_date:'2020.4.6',
        first_sign_date:'2020.3.7',
        purchase_history:'2020.5.8, 5次',
        function_obstacle:'',
        check_result:''
      },
      {
        key: 43,
        name: 'Shine',
        age:23,
        gender:'女',
        tel:'1246382910',
        first_training_date:'2020.4.6',
        first_sign_date:'2020.3.7',
        purchase_history:'2020.7.8, 10次',
        function_obstacle:'',
        check_result:''
      },
    ]
  },
  {
    key: 5,
    name: 'Bob',
    age:26,
    gender:'男',
    tel:'1246111110',
    first_training_date:'2020.1.16',
    first_sign_date:'2020.1.16',
    purchase_history:'2020.1.18, 1次',
    function_obstacle:'',
    check_result:'',
    children: [
      {
        key: 51,
        name: 'Bob',
        age:26,
        gender:'男',
        tel:'1246111110',
        first_training_date:'2020.1.16',
        first_sign_date:'2020.1.16',
        purchase_history:'2020.1.18, 1次',
        function_obstacle:'',
        check_result:'',
      },
      {
        key: 52,
        name: 'Bob',
        age:26,
        gender:'男',
        tel:'1246111110',
        first_training_date:'2020.1.16',
        first_sign_date:'2020.1.16',
        purchase_history:'2020.2.24, 10次',
        function_obstacle:'',
        check_result:'',
      },
      {
        key: 53,
        name: 'Bob',
        age:26,
        gender:'男',
        tel:'1246111110',
        first_training_date:'2020.1.16',
        first_sign_date:'2020.1.16',
        purchase_history:'2020.5.18, 15次',
        function_obstacle:'',
        check_result:'',
      },
    ]
  },
  {
    key: 6,
    name: 'Liam',
    age:19,
    gender:'男',
    tel:'1223678110',
    first_training_date:'2020.5.18',
    first_sign_date:'2020.5.16',
    purchase_history:'2020.5.18, 1次',
    function_obstacle:'',
    check_result:'',
    children: [
      {
        key: 61,
        name: 'Liam',
        age:19,
        gender:'男',
        tel:'1223678110',
        first_training_date:'2020.5.18',
        first_sign_date:'2020.5.16',
        purchase_history:'2020.5.18, 1次',
        function_obstacle:'',
        check_result:'',
      },
      {
        key: 62,
        name: 'Liam',
        age:19,
        gender:'男',
        tel:'1223678110',
        first_training_date:'2020.5.18',
        first_sign_date:'2020.5.16',
        purchase_history:'2020.6.18, 10次',
        function_obstacle:'',
        check_result:'',
      }
    ]
  }
]
export default {
  data(){
    return{
      columns,
      data,
      channel:'',
      store:'',
      loginName:'',
      frequency:null,
      activity:{key:'1',label:'全部用户'},
      pageSize:10,
      pagination:{pageSize:10},
    }
  },
  methods:{
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
</style>