<template>
  <div class="subpage-layout">
    <div class="subpage-title">
      用户管理
    </div>
    <div class="subpage-content">
    <!-- 以下是表单部分 -->
      <div class="form-area" style="width:100%" >
        <div class="form-row" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
          <div class="label-4-input">
            <label>手机号</label>
            <a-input v-model="form1.tel"/>
          </div>
          <div class="label-4-input">
            <label>登录名</label>
            <a-input v-model="form1.loginname"/>
          </div>
          <div class="label-4-input">
            <label>昵称</label>
            <a-input v-model="form1.nickname"/>
          </div>
          <div class="label-4-input">
            <label>类型</label>
            <a-input v-model="form1.kinds"/>
          </div>
          <div class="button">
            <a-button type="primary" @click="search">搜索</a-button>
            <a-button style="background-color:#F5F5F5;border:none;color:#666666;" @click="reset">重置</a-button>
          </div>
        </div>
      </div>
      <div class="table-area" style="width:100%;margin-top:20px">
        <a-table 
          :columns="columns" 
          :data-source="data" 
          :pagination="pagination"
          :scroll="{x:true}"
          bordered>
          <template slot="renderNickname" slot-scope="text">
            <span v-if="text.length <= 5 && screenWidth < 1650">{{text}}</span>
            <a-tooltip v-else-if="text.length > 5 && screenWidth < 1650">
              <template slot="title">
                {{text}}
              </template>
              {{text.slice(0,5)}}...
            </a-tooltip>
            <span v-else-if="text.length <= 7 && screenWidth >= 1650 && screenWidth < 1850">{{text}}</span>
            <a-tooltip v-else-if="text.length > 7 && screenWidth >= 1650 && screenWidth < 1850">
              <template slot="title">
                {{text}}
              </template>
              {{text.slice(0,7)}}...
            </a-tooltip>
            <span v-else-if="text.length <= 9 && screenWidth >= 1850">{{text}}</span>
            <a-tooltip v-else-if="text.length > 9 && screenWidth >= 1850">
              <template slot="title">
                {{text}}
              </template>
              {{text.slice(0,9)}}...
            </a-tooltip>
          </template>
          <template slot="renderStatus" slot-scope="text">
            <span v-if="text === '正常'" style="color:#8ACD2B">{{text}}</span>
            <span v-if="text === '停用'" style="color:#F55943">{{text}}</span>
          </template>
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
          <template slot="operation" slot-scope="text,record,index">
            <div style="display:flex;justify-content:space-around;">
              <a-button id="table-btn-4" @click="showChangeInfo(record,index)">
                信息修改
              </a-button>
              <a-button id="table-btn-4" @click="showChangeRecipe" >
                修改处方
              </a-button>
              <a-button id="table-btn-3" @click="showTraining">
                训练仪
              </a-button>
              <a-button id="table-btn-3" @click="showCheck" >
                检查仪
              </a-button>
            </div>
          </template>
        </a-table>
      </div>
      <!-- 信息修改弹窗 -->
    <a-modal class="modal-430" :visible="model1visible" title="用户信息" @cancel="handChangeInfo" :maskStyle="{'background-color':'rgb(0,0,0,0.2)'}" width="400px" centered>
      <template slot="footer">
        <a-button key="backinfo" @click="handChangeInfo" >
          关闭
        </a-button>
        <a-button key="submitinfo" type="primary"  @click="submitInfo">
          提交
        </a-button>
      </template>

      <a-form-model :model="form2" :label-col="{span:6}" :wrapper-col="{span:18}" >
        <a-form-model-item label="用户名">
          <a-input v-model="form2.loginname" style="width:240px"/>
        </a-form-model-item>
        <a-form-model-item label="昵称">
          <a-input v-model="form2.nickname" style="width:240px"/>
        </a-form-model-item>
        <a-form-model-item label="手机号">
          <a-input v-model="form2.tel" style="width:240px"/>
        </a-form-model-item>
        <a-form-model-item label="身份证号">
          <a-input v-model="form2.id" style="width:240px"/>
        </a-form-model-item>
        <a-form-model-item label="生日">
          <a-date-picker
            v-model="form2.date1"
            show-time
            type="date"
            placeholder="请选择日期"
            style="width:240px"
          />
          </a-form-model-item>
        <a-form-model-item label="性别">
          <a-select v-model="form2.sex" placeholder="please select your zone" style="width:240px">
            <a-select-option value="male">
              男
            </a-select-option>
            <a-select-option value="female">
              女
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="重置密码">
          <div v-if="mima ===1">
            <a-input v-model="password" style="width:240px;margin-bottom:10px;"/>
            <div class="button">
            <a-button type="primary" @click="resetmima(2)">确定</a-button>
            <a-button @click="resetmima(2)">取消</a-button>
            </div>
            </div>
          <div v-if="mima ===2"><a-button type="primary" @click="resetmima(1)">重置</a-button></div>
        </a-form-model-item> 
      </a-form-model>
    </a-modal>
<!-- 修改处方弹窗 -->
    <a-modal class="modal-430" :visible="model2visible" title="修改处方" width="400px" @cancel="handChangeRecipe" :maskStyle="{'background-color':'rgb(0,0,0,0.2)'}" centered>
      <template slot="footer">
        <a-button key="backrecipe" @click="handChangeRecipe">
          关闭
        </a-button>
        <a-button key="submitrecipe" type="primary"  @click="submitRecipe" >
          提交
        </a-button>
      </template>
      <div style="display:flex;flex-direction:column;width:100%;">
        <div style="widht:100%;text-align:end;padding-bottom: 15px;border-bottom:1px solid #e8e8e8">
          <a-button type="primary" @click="addrecipe" >
            添加方案
          </a-button>
        </div>
        <div style="width:100%;display:flex;flex-direction:column;">
          <recipe-item v-for="(item,index) of recipeData" :key="item.id" :item="item" :index="index" @click="handleRecipeClick"></recipe-item>
        </div>
      </div>
    </a-modal>
<!-- 新添处方弹窗 -->
    <a-modal class="modal-430" :visible="model5visible" width="400px" @ok="handleaddrecipe" @cancel="handleCancelRecipe" :maskStyle="{'background-color':'rgb(0,0,0,0.2)'}" centered>
      <template slot="title">
        <div style="cursor:pointer;" @click="backToChangeRecipe">
          <a-icon type="arrow-left" style="margin-right:5px"/><span>添加处方</span>
        </div>
      </template>
      <template slot="footer">
        <a-button key="backchangerecipe" @click="handleaddrecipe">
          取消
        </a-button>
        <a-button key="submitchangerecipe" type="primary"  @click="submitrecipe" >
          保存
        </a-button>
      </template>
    
      <a-form-model :model="form5" :label-col="{span: 7}" :wrapper-col="{span:17}">
        <a-form-model-item label="训练项目">
          <a-select v-model="form5.project" placeholder="please select your project" style="width:240px">
          <a-select-option value="1.1">
              调节右眼训练
            </a-select-option>
            <a-select-option value="1.2">
              调节左眼训练
            </a-select-option>
        </a-select>
        </a-form-model-item>
        <a-form-model-item label="右眼正片等级">
          <a-select v-model="form5.levelplus" placeholder="please select your levelplus" style="width:240px">
          <a-select-option value="2.1">
              1.0
            </a-select-option>
            <a-select-option value="2.2">
              1.5
            </a-select-option>
        </a-select>
        </a-form-model-item>
        <a-form-model-item label="右眼正片次数">
          <a-select v-model="form5.timeplus" placeholder="please select your timeplus" style="width:240px">
          <a-select-option value="3.1">
              1
            </a-select-option>
            <a-select-option value="3.2">
              2
            </a-select-option>
        </a-select>
        </a-form-model-item>
        <a-form-model-item label="右眼负片等级">
          <a-select v-model="form5.levelminus" placeholder="please select your levelminus" style="width:240px">
          <a-select-option value="4.1">
              1.0
            </a-select-option>
            <a-select-option value="4.2">
              1.5
            </a-select-option>
        </a-select>
        </a-form-model-item>
        <a-form-model-item label="右眼负片次数">
          <a-select v-model="form5.timeminus" placeholder="please select your timeminus" style="width:240px">
          <a-select-option value="5.1">
              1
            </a-select-option>
            <a-select-option value="5.2">
              2
            </a-select-option>
        </a-select>
        </a-form-model-item>
        <a-form-model-item label="重复次数">
          <a-input v-model="form5.timerepeat" style="width:240px"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
<!-- 训练仪弹窗 -->
    <a-modal class="modal-430" :visible="model3visible" title="训练仪" width="600px" @cancel="handTraining" :maskStyle="{'background-color':'rgb(0,0,0,0.2)'}" centered>
      <template slot="footer">
        <a-button key="backtraining" @click="handTraining">
          关闭
        </a-button>
        <a-button key="submittraining" type="primary"  @click="handTraining" >
          提交
        </a-button>
      </template>
      <div style="height:100%;display:flex;flex-direction:column;justify-content:space-between;align-items:start;margin-bottom:10px">
        <div>
          <a-form-model
            style="width:360px;"
            :label-col="{span:5}" :wrapper-col="{span:19}">
            <a-form-model-item label="训练记录">
              <a-date-picker
                v-model="form4.date2"
                show-time
                type="date"
                placeholder="请选择日期"
                style="width: 200px;"
              />
            </a-form-model-item>            
          </a-form-model>
        </div>
        <div style="width:100%">
          <div style="display:flex;height:32px;"> 
            <div style="width:120px;display:flex;align-items:center;">
              <label style="font-weight:bold;">剩余次数</label>
              <span style="font-size:1.05em;font-weight:bold;padding:0 5px;">{{25}}</span> 次
            </div>
            <div style="display:flex;align-items:center;">
              <div v-if="!model6visible" style="color:#0F79F9;cursor:pointer;" @click="recharge">充值</div>
              <div v-if="model6visible" style="display:flex;align-items:center;">
                <a-input style="width:100px;"/>
                <div style="color:#656565;cursor:pointer;margin:0px 10px 0px 20px;" @click="handlerecharge">取消</div>
                <div style="color:#0F79F9;cursor:pointer;" @click="handlerecharge">确定</div>
              </div>
            </div>
          </div>
          <div style="width:100%;text-align:start;font-size:0.9em;margin-top:5px;">* 次数有效期为1年，即将有<span style="color:red">5</span>次训练到期</div>
        </div>
      </div>
    </a-modal> 
    <!-- 检查仪弹窗 -->
    <a-modal class="modal-430" id="inspect-modal" :visible="model4visible" title="检查仪" width="600px" @cancel="handCheck" :maskStyle="{'background-color':'rgb(0,0,0,0.2)'}" centered>
      <template slot="footer">
        <a-button key="backcheck" @click="handCheck">
          关闭
        </a-button>
      </template>
      <a-menu v-model="current" mode="horizontal">
        <a-menu-item key="report" @click="showinspect(1)"> 专业检查报告 </a-menu-item>
        <a-menu-item key="selftestdata" @click="showinspect(2)"> 自测数据 </a-menu-item>
      </a-menu>
      <div v-if="this.inspect === 1">专业报告</div>
      <div v-else-if="this.inspect === 2">自测数据</div>
  
    </a-modal>
    </div>
  </div>
</template>

<script>
import recipeItem from './components/recipeItem.vue'
const columns1 = [
  {
    title:'序号',
    dataIndex:'num',
    key:'num',
    width:65,
    align:'center',
  },
  {
    title: '登录名',
    dataIndex: 'loginname',
    key: 'loginname',
    align:'center',
    scopedSlots: { customRender: 'customRender' },
    width:120,
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
    align:'center',
    scopedSlots: { customRender: 'renderNickname' },
    width:115,
  },
  {
    title: '手机号',
    key: 'tel',
    dataIndex: 'tel',
    align:'center',
    scopedSlots: { customRender: 'customRender' },
    width:120,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align:'center',
    scopedSlots:{customRender:'renderStatus'},
    width:65,
  },
  {
    title: '类型',
    dataIndex: 'kinds',
    key: 'kinds',
    align:'center',
    scopedSlots: { customRender: 'customRender' },
    width:80,
  },
  {
    title: '剩余次数',
    dataIndex: 'counts',
    key: 'counts',
    align:'center',
    width:95,
  },
  {
    title: '创建时间',
    dataIndex: 'time',
    key: 'time',
    align:'center',
    width:180,
  },
  {
    title: '操作',
    key: 'operation',
    align:'center',
    width:240,
    scopedSlots: { customRender: 'operation' },
  },
];
const columns2 = [
  {
    title:'序号',
    dataIndex:'num',
    key:'num',
    width:65,
    align:'center',
    fixed:'left',
  },
  {
    title: '登录名',
    dataIndex: 'loginname',
    key: 'loginname',
    align:'center',
    scopedSlots: { customRender: 'customRender' },
    width:120,
    fixed:'left',
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
    align:'center',
    scopedSlots: { customRender: 'renderNickname' },
    width:115,
  },
  {
    title: '手机号',
    key: 'tel',
    dataIndex: 'tel',
    align:'center',
    scopedSlots: { customRender: 'customRender' },
    width:120,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align:'center',
    scopedSlots:{customRender:'renderStatus'},
    width:65,
  },
  {
    title: '类型',
    dataIndex: 'kinds',
    key: 'kinds',
    align:'center',
    scopedSlots: { customRender: 'customRender' },
    width:80,
  },
  {
    title: '剩余次数',
    dataIndex: 'counts',
    key: 'counts',
    align:'center',
    width:95,
  },
  {
    title: '创建时间',
    dataIndex: 'time',
    key: 'time',
    align:'center',
    width:180,
  },
  {
    title: '操作',
    key: 'operation',
    align:'center',
    width:240,
    scopedSlots: { customRender: 'operation' },
    fixed:'right',
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
    key: '0',
    num:'0',
    loginname: '15982159909',
    nickname: '郑屹',
    tel: '15982159999',
    status: '正常',
    kinds:'消费者',
    counts:'100',
    time:formatTime(time),
  },
  {
    key: '1',
    num:'1',
    loginname: '123456',
    nickname: '优眼体验新用户优眼',
    tel: '12345678',
    status: '停用',
    kinds:'消费者',
    counts:'100',
    time:formatTime(time),
  },
  {
    key: '2',
    num:'2',
    loginname: '123456',
    nickname: '郑屹',
    tel: '12345678',
    status: '停用',
    kinds:'消费者',
    counts:'100',
    time:formatTime(time),
  },
  {
    key: '3',
    num:'3',
    loginname: '123456',
    nickname: '郑屹',
    tel: '12345678',
    status: '正常',
    kinds:'消费者',
    counts:'100',
    time:formatTime(time)
  },
  {
    key: '4',
    num:'4',
    loginname: '123456',
    nickname: '郑屹',
    tel: '12345678',
    status: '正常',
    kinds:'消费者',
    counts:'100',
    time:formatTime(time),
  },
  {
    key: '5',
    num:'5',
    loginname: '123456',
    nickname: '郑屹',
    tel: '12345678',
    status: '正常',
    kinds:'消费者',
    counts:'100',
    time:formatTime(time),
  },
  {
    key: '6',
    num:'6',
    loginname: '123456',
    nickname: '郑屹',
    tel: '12345678',
    status: '正常',
    kinds:'消费者',
    counts:'100',
    time:formatTime(time),
  },
  {
    key: '7',
    num:'7',
    loginname: '123456',
    nickname: '郑屹',
    tel: '12345678',
    status: '正常',
    kinds:'消费者',
    counts:'100',
    time:formatTime(time),
  },
  {
    key: '8',
    num:'8',
    loginname: '123456',
    nickname: '郑屹',
    tel: '12345678',
    status: '正常',
    kinds:'消费者',
    counts:'100',
    time:formatTime(time),
  },
  {
    key: '9',
    num:'9',
    loginname: '123456',
    nickname: '郑屹',
    tel: '12345678',
    status: '正常',
    kinds:'消费者',
    counts:'100',
    time:formatTime(time),
  },
  {
    key: '10',
    num:'10',
    loginname: '123456',
    nickname: '郑屹',
    tel: '12345678',
    status: '正常',
    kinds:'消费者',
    counts:'100',
    time:formatTime(time),
  },
  {
    key: '11',
    num:'11',
    loginname: '123456',
    nickname: '郑屹',
    tel: '12345678',
    status: '正常',
    kinds:'消费者',
    counts:'100',
    time:formatTime(time),
  },
  
];

function addNum(data){
  for(let i = 0; i < data.length; i++){
    data[i].num = i + 1;
  }
}
addNum(data);

export default {
  components:{
    recipeItem
  },
  data() {
    return {
      data:data,
      times:'',
      index:-1,
      mima:2,
      password:'',
      theme: 'dark',
      pageSize:10,
      searching:false,
      current: ['report'],
      pagination:{pageSize:10},
      model1visible: false,
      model2visible: false,
      model3visible: false,
      model4visible: false,
      model5visible: false,
      model6visible: false,
      inspect:1,
      form:{
            tel:"",
            loginname:'',
            nickname:'',
            kinds:'',
      },
      form1:{
            tel:"",
            loginname:'',
            nickname:'',
            kinds:'',
      },
      form2:{tel:"",
            loginname:'',
            nickname:'',
            name: '',
            id:'',
            sex:'',
        date1: undefined,
        },
        form4:{
          date2: undefined,
          times:'',
        },
        form5:{
            project:"",
            levelplus:'',
            timeplus:'',
            levelminus:'',
            timeminus:'',
            timerepeat:''
      },
      recipeData:[ //修改处方弹窗里的数据
        {
          id:0,
          target:'调节左眼训练',
          times:1,
          rightGrade:'1.50',
          rightTimes:2,
          leftGrade:'1.50',
          leftTimes:2
        },
        {
          id:1,
          target:'调节右眼训练',
          times:2,
          rightGrade:'1.50',
          rightTimes:2,
          leftGrade:'1.50',
          leftTimes:2
        },
        {
          id:2,
          target:'调节左眼训练',
          times:3,
          rightGrade:'1.50',
          rightTimes:2,
          leftGrade:'1.50',
          leftTimes:2
        },
        {
          id:3,
          target:'调节右眼训练',
          times:4,
          rightGrade:'1.50',
          rightTimes:2,
          leftGrade:'1.50',
          leftTimes:2
        }
      ],
      screenWidth:null,
      screenHeight:null,
    };
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
    this.axios
      .get('https://api.coindesk.com/v1/bpi/currentprice.json')
      .then(response => (console.log(response)))
  },
  computed:{
    columns:function(){
      return this.screenWidth < 1380 ? columns2 : columns1;
    }
  },
  methods: {
    //搜索
    search:function(){
      console.log(this.form1),
      this.form.tel = this.form1.tel;
      this.form.loginname = this.form1.loginname;
      this.form.nickname = this.form1.nickname;
      this.form.kinds = this.form1.kinds;
      let index = ['tel','loginname','nickname','kinds'];
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
      this.searching = true;
      this.data = search_data;
    },
    reset(){
      this.searching = false;
      this.data = data;
      this.form = {
        tel:'',
        loginname:'',
        nickname:'',
        kinds:''
      };
      this.form1.tel = '';
      this.form1.loginname = '';
      this.form1.nickname = '';
      this.form1.kinds = '';
    },

   showChangeInfo(record,index) {
      this.model1visible = true;
      this.form2.loginname=record.loginname;
      this.form2.nickname=record.nickname;
      this.form2.tel=record.tel;
      this.index=index;
    },
    submitInfo(){console.log(this.data[this.index])
      let temp = {...this.data[this.index],...this.form2};
      this.data.splice(this.index, 1, temp);
      console.log(this.data)
      this.model1visible = false;
    },
    handChangeInfo(e) {
      console.log(e);
      this.model1visible = false;
    },
    backToChangeRecipe(){
      this.model2visible = true;
      this.model5visible = false;
    },
    showChangeRecipe(){
      this.model2visible = true;
    },
    handChangeRecipe(e){
      console.log(e);
      this.model2visible = false;
    },
    submitRecipe(){
      this.model2visible = false;
    },
    handleRecipeClick(operation, index){
      if(operation === 'up'){
        if(index > 0){
          let temp = this.recipeData.splice(index,1);
          this.recipeData.splice(index - 1, 0, ...temp);
        }
      }else if(operation === 'down'){
        if(index < this.recipeData.length -  1){
          let temp = this.recipeData.splice(index, 1);
          this.recipeData.splice(index + 1, 0, ...temp);
        }
      }else if(operation === 'cancel'){
        this.recipeData.splice(index, 1);
      }
      console.log(this.recipeData)
    },
    showTraining(){
      this.model3visible = true;
    },
    handTraining(e){
      console.log(e);
      this.model3visible = false;
    },
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    showCheck(){
      this.model4visible=true;
    },
    handCheck(){
      this.model4visible=false;
    },
    addrecipe(){
      this.model2visible=false;
      this.model5visible=true;
    },
    
    handleaddrecipe(){
      this.model5visible=false;
      this.model2visible=true;
    },
    handleCancelRecipe(){
      this.model5visible = false;
      this.model2visible = true;
    },
    submitrecipe(){
      this.model5visible=false;
      this.model2visible=true;
    },
    showinspect(index){
      this.inspect = index;
    },
    recharge(){
      this.model6visible=true;
    },
    handlerecharge(){
      this.model6visible=false;
    },
    resetmima(index){
      this.mima = index;
    }
  },
};
</script>
<style scoped>
#inspect-modal .ant-modal-body{
  padding-top:10px;
}

.box{
padding: 0px 0px;
}
.form-row{
  padding-right:10px;
  padding-top:5px;
}

@media screen and (min-width: 1024px) {
  .label-3-input label, .label-4-input label{
    margin-right:8px;
    font-weight:bold;
  }
  .label-4-input input{
    width:120px;
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
  #table-btn-4, #table-btn-3{
    margin:0 3px;
    background-color:#F5F5F5;
    color:#1079FA;
    border:none;
  }
  #table-btn-4.ant-btn{
    font-size:13px;
    padding:0 5px;
    height:32px;
    line-height: 32px;
  }
  #table-btn-3.ant-btn{
    font-size:14px;
    padding:0 9px;
    height:32px;
    line-height: 32px;
  }
}

@media screen and (min-width: 1280px) {
  .form-row{
    width:100%;
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
  #table-btn-4, #table-btn-3{
    margin:0 5px;
    background-color:#F5F5F5;
    color:#1079FA;
    border:none;
  }
}
@media screen and (min-width: 1440px) {
  .form-row{
    width:100%;
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
  #table-btn-4, #table-btn-3{
    margin:0 7px;
    background-color:#F5F5F5;
    color:#1079FA;
    border:none;
  }
}
@media screen and (min-width: 1680px) {
  .form-row{
    width:95%;
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
  #table-btn-4, #table-btn-3{
    margin:0 9px;
    background-color:#F5F5F5;
    color:#1079FA;
    border:none;
  }
}
@media screen and (min-width: 1920px) {
  .form-row{
    width:85%;
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
  #table-btn-4, #table-btn-3{
    margin:0 12px;
    background-color:#F5F5F5;
    color:#1079FA;
    border:none;
  }
}
</style>