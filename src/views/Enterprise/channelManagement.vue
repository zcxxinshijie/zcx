<template>
  <div class="subpage-layout">
    <div class="subpage-title">
      渠道管理
    </div>
    <div class="subpage-content">
<!--      请在此处填充内容-->
      <div class="form-area" style="width:100%" >
        <div class="form-row" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
          <div class="label-3-input">
            <label>渠道名称</label>
            <a-input v-model="form.channelName"/>
          </div>
          <div class="label-3-input">
            <label>渠道手机号</label>
            <a-input v-model="form.channelTel"/>
          </div>
          <div class="label-4-select">
            <label>结算模式</label>
            <a-select v-model="pattern" placeholder="全部" @change="patternHandleChange" :labelInValue="true">
              <a-select-option value="buyOut">买断</a-select-option>
              <a-select-option value="secondCard">次卡</a-select-option>
            </a-select>
          </div>
          <div class="label-2-select">
            <label>状态</label>
            <a-select v-model="Status" placeholder="全部" @change="statusHandleChange" :labelInValue="true" >
              <a-select-option value="start">启用</a-select-option>
              <a-select-option value="stop">停用</a-select-option>
            </a-select>
          </div>
          <div class="button">
            <a-button type="primary" @click="search">搜索</a-button>
            <a-button style="background-color:#F5F5F5;border:none;color:#666666;" @click="resetInfo">重置</a-button>
          </div>
        </div>
        <div>
          <a-button style="padding: 0 13px;color:#1079FA;background-color:#E3F0FD;border:none" @click="newChannel"><img src="../../assets/channel.png" style="margin-right:5px;vertical-align:bottom;" width='20px' height="20px"/>新建渠道</a-button>
        </div>
      </div>


      <div class="table-area" style="width:100%;margin-top:20px">
        <a-table style="width:100%;height:100%"
                 :columns="columns"
                 :data-source="data"
                 :pagination="pagination"
                 :scroll="{x:true}"
                 bordered>
          <template slot="customRender" slot-scope="text,record,index,column">
            <span v-if="searching && form[column.dataIndex].trim() !== ''">
              <template v-for="(fragment, i) in text .toString() .split(new RegExp(`(${form[column.dataIndex].trim()})`, 'i'))">
                <mark v-if="fragment.toLowerCase() === form[column.dataIndex].trim().toLowerCase()" :key="i" class="highlight">{{ fragment }}</mark>
                <template v-else>{{ fragment }}</template>
              </template>
            </span>
            <template v-else>
              {{ text }}
            </template>
          </template>
          <template slot="action" slot-scope="text,record,index">
            <div style="display:flex;justify-content:space-around;">
              <a-button style="padding:0 10px;background-color:#F5F5F5;color:#1079FA;border-color:#F5F5F5;"  @click="showModal(record,index)">查看</a-button>
              <a-button type="danger" style="padding:0 10px;" @click="stopButton(record.key)" :id="record.key" v-if="record.Status=='启用'" >停用</a-button>
              <a-button type="primary" style="padding:0 10px;" @click="startButton(record.key)" :id="record.key" v-if="record.Status=='停用'">启用</a-button>
            </div>
          </template>
          <template slot="renderChannel" slot-scope="text">
            <span v-if="text.length <= 8 && screenWidth <=1640">{{text}}</span>
            <a-tooltip v-else-if="text.length > 8 && screenWidth <=1640">
              <template slot="title">
                {{text}}
              </template>
              {{text.slice(0,8)}}...
            </a-tooltip>
            <span v-else-if="text.length <= 10 && screenWidth <=1780">{{text}}</span>
            <a-tooltip v-else-if="text.length > 10 && screenWidth <=1780">
              <template slot="title">
                {{text}}
              </template>
              {{text.slice(0,10)}}...
            </a-tooltip>
            <span v-else-if="text.length <= 12 && screenWidth <= 1900">{{text}}</span>
            <a-tooltip v-else-if="text.length > 12 && screenWidth <= 1900">
              <template slot="title">
                {{text}}
              </template>
              {{text.slice(0,12)}}...
            </a-tooltip>
            <span v-else-if="text.length <= 16 && screenWidth >1900">{{text}}</span>
            <a-tooltip v-else-if="text.length > 16 && screenWidth >1900">
              <template slot="title">
                {{text}}
              </template>
              {{text.slice(0,16)}}...
            </a-tooltip>
          </template>
          <template slot="renderStatus" slot-scope="text">
            <span v-if="text === '启用'" style="color:#8ACD2B">{{text}}</span>
            <span v-if="text === '停用'" style="color:#F55943">{{text}}</span>
          </template>
        </a-table>
      </div>
<!-- 查看弹窗 -->
      <a-modal
        class="modal-430"
        title="渠道信息"
        :visible="visible1"
        :confirm-loading="confirmLoading1"
        centered
        width="400px"
        @ok="handleOk1"
        @cancel="handleCancel1"
        cancelText="关闭"
        okText="提交"
        :maskStyle="{'background-color':'rgb(0,0,0,0.2)'}"
        :bodyStyle="{'padding-top':'30px','padding-bottom':'30px'}">
        <div class="modal-body">
          <a-form-model :model="form2" style="width:360px" :labelCol="{span:7}" :wrapperCol="{span:17}">
            <a-form-model-item  label="渠道名称">
              <a-input style="width: 240px;" v-model="form2.channelName"/>
            </a-form-model-item>
            <a-form-model-item  label="渠道手机号">
              <a-input style="width: 240px;" v-model="form2.channelTel"/>
            </a-form-model-item>
            <a-form-model-item   label="渠道联系人">
              <a-input style="width: 240px;" v-model="form2.channelLinkman"/>
            </a-form-model-item>
            <a-form-model-item  label="模式">
              <a-input style="width: 240px;" v-model="form2.pattern"/>
            </a-form-model-item>
            <a-form-model-item  label="单次训练价格">
              <a-input style="width: 240px;" v-model="form2.singletrainPrice"/>
            </a-form-model-item>
            <a-form-model-item  label="分成比例">
              <a-input style="width: 240px;" v-model="form2.proportion"/>
            </a-form-model-item>
            <a-form-model-item  label="剩余次数">
              <a-input style="width: 240px;" v-model="form2.restTime"/>
            </a-form-model-item>
            <a-form-model-item  label="状态">
              <a-input style="width: 240px;" v-model="form2.Status"/>
            </a-form-model-item>
          </a-form-model>
        </div>
      </a-modal>
<!-- 新建渠道弹窗 -->
      <a-modal
        class="modal-430"
        title="新建渠道"
        :visible="visible2"
        :confirm-loading="confirmLoading2"
        centered
        width="400px"
        @ok="handleOk2"
        @cancel="handleCancel2"
        cancelText="关闭"
        okText="提交"
        :maskStyle="{'background-color':'rgb(0,0,0,0.2)'}"
        :bodyStyle="{'padding-top':'30px','padding-bottom':'30px','overflow-y':'auto',}">
        <div class="modal-body">
          <a-form-model style="width:360px" :labelCol="{span:7}" :wrapperCol="{span:17}">
            <a-form-item label="渠道名称">
              <a-input style="width: 240px;" placeholder=" " v-model="newChannelname"/>
            </a-form-item>
            <a-form-item label="渠道手机号">
              <a-input style="width: 240px;" placeholder="QD15022046517" v-model="newChanneltel" :disabled="true"/>
            </a-form-item>
            <a-form-item label="地址">
              <a-input style="width: 240px;" placeholder=" " v-model="newAdress"/>
            </a-form-item>
            <a-form-item label="渠道联系人">
              <a-input style="width: 240px;" placeholder=" " v-model="newChannellinkman"/>
            </a-form-item>
            <a-form-item label="联系人电话">
              <a-input style="width: 240px;" placeholder=" " v-model="newLinkmanTel"/>
            </a-form-item>
            <a-form-item label="联系人邮箱">
              <a-input style="width: 240px;" placeholder=" " v-model="newLinkmanMail"/>
            </a-form-item>
            <a-form-item  label="结算模式">
              <a-select  placeholder="全部"  @change="handleChangePattern"  :labelInValue="true"  v-model="newPattern" style="width: 240px;">
                <a-select-option value="buyOut">买断</a-select-option>
                <a-select-option value="secondCard">次卡</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="单次训练价格">
              <a-input style="width: 240px;" placeholder="XXXX元" v-model="newSingletrainPrice"/>
            </a-form-item>
            <a-form-item label="分成比例">
              <a-input style="width: 240px;" placeholder=" " v-model="newProportion"/>
            </a-form-item>
            <a-form-item label="开户银行">
              <a-input style="width: 240px;" placeholder=" " v-model="newBank"/>
            </a-form-item>
            <a-form-item label="开户银行账号">
              <a-input style="width: 240px;" placeholder=" " v-model="newBankNumber"/>
            </a-form-item>
            <a-form-item label="企业开户名称">
              <a-input style="width: 240px;" placeholder=" " v-model="newEnterpriseName"/>
            </a-form-item>
          </a-form-model>
        </div>
      </a-modal>



    </div>
  </div>
</template>

<script>
  const columns1 = [
    {
      title: '序号',
      dataIndex: 'number',
      key: 'number',
      scopedSlots:{customRender:'number'},
      align:'center',
      width:65,
    },
    {
      title: '渠道名称',
      dataIndex: 'channelName',
      key: 'channelName',
      scopedSlots:{
        customRender:'renderChannel'
      },
      align:'center',
      width:160,
    },
    {
      title: '渠道手机号',
      dataIndex: 'channelTel',
      key: 'channelTel',
      align:'center',
      scopedSlots:{
        customRender:'customRender'
      },
      width:110,
    },
    {
      title: '渠道联系人',
      key: 'channelLinkman',
      dataIndex: 'channelLinkman',
      align:'center',
      width:110,
    },
    {
      title: '结算模式',
      key: 'pattern',
      dataIndex: 'pattern',
      align:'center',
      width:95,
/*     scopedSlots:{
        customRender:'customRender'
      }, */
    },
    {
      title: '单次训练价格',
      key: 'singletrainPrice',
      dataIndex: 'singletrainPrice',
      align:'center',
      width:120,
    },
    {
      title: '分成比例',
      key: 'proportion',
      dataIndex: 'proportion',
      align:'center',
      width:95,
    },
    {
      title: '剩余次数',
      key: 'restTime',
      dataIndex: 'restTime',
      align:'center',
      width:95,
    },
    {
      title: '状态',
      key: 'Status',
      dataIndex: 'Status',
      align:'center',
      width:65,
      scopedSlots:{
        customRender:'renderStatus'
      },
    },
    {
      title: '创建时间',
      key: 'createTime',
      dataIndex: 'createTime',
      align:'center',
      width:160,
    },
    {
      title: '操作',
      key: 'action',
      scopedSlots: { customRender: 'action' },
      align:'center',
      width:150
    },
  ];
  const columns2 = [
    {
      title: '序号',
      dataIndex: 'number',
      key: 'number',
      scopedSlots:{customRender:'number'},
      align:'center',
      width:65,
      fixed:'left'
    },
    {
      title: '渠道名称',
      dataIndex: 'channelName',
      key: 'channelName',
      scopedSlots:{
        customRender:'renderChannel'
      },
      align:'center',
      width:160,
      fixed:'left'
    },
    {
      title: '渠道手机号',
      dataIndex: 'channelTel',
      key: 'channelTel',
      align:'center',
      scopedSlots:{
        customRender:'customRender'
      },
      width:110,
    },
    {
      title: '渠道联系人',
      key: 'channelLinkman',
      dataIndex: 'channelLinkman',
      align:'center',
      width:110,
    },
    {
      title: '结算模式',
      key: 'pattern',
      dataIndex: 'pattern',
      align:'center',
      width:95,
/*     scopedSlots:{
        customRender:'customRender'
      }, */
    },
    {
      title: '单次训练价格',
      key: 'singletrainPrice',
      dataIndex: 'singletrainPrice',
      align:'center',
      width:120,
    },
    {
      title: '分成比例',
      key: 'proportion',
      dataIndex: 'proportion',
      align:'center',
      width:95,
    },
    {
      title: '剩余次数',
      key: 'restTime',
      dataIndex: 'restTime',
      align:'center',
      width:95,
    },
    {
      title: '状态',
      key: 'Status',
      dataIndex: 'Status',
      align:'center',
      width:65,
      scopedSlots:{
        customRender:'renderStatus'
      },
    },
    {
      title: '创建时间',
      key: 'createTime',
      dataIndex: 'createTime',
      align:'center',
      width:160,
    },
    {
      title: '操作',
      key: 'action',
      scopedSlots: { customRender: 'action' },
      align:'center',
      width:150,
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
  const data = [
    {
      key:1,
      channelName:'网网网网网网网网网网网网',
      channelTel:'15135168511',
      channelLinkman:'张三',
      pattern:'买断',
      singletrainPrice:'4',
      proportion:'2',
      restTime:'2',
      Status:'启用',
      createTime:formatTime(time),
    },
    {
      key:2,
      channelName:'张',
      channelTel:'151351685',
      channelLinkman:'张三',
      pattern:'买断',
      singletrainPrice:'51',
      proportion:'-',
      restTime:'21',
      Status:'启用',
      createTime:formatTime(time),
    },
    {
      key:3,
      channelName:'谷',
      channelTel:'1513685',
      channelLinkman:'张五',
      pattern:'次卡',
      singletrainPrice:'515',
      proportion:'3',
      restTime:'323',
      Status:'停用',
      createTime:formatTime(time),
    },
    {
      key:4,
      channelName:'谷',
      channelTel:'1513685',
      channelLinkman:'张五',
      pattern:'次卡',
      singletrainPrice:'515',
      proportion:'3',
      restTime:'323',
      Status:'停用',
      createTime:formatTime(time),
    },
    {
      key:5,
      channelName:'谷',
      channelTel:'1513685',
      channelLinkman:'张五',
      pattern:'次卡',
      singletrainPrice:'515',
      proportion:'3',
      restTime:'323',
      Status:'停用',
      createTime:formatTime(time),
    },
    {
      key:6,
      channelName:'谷',
      channelTel:'1513685',
      channelLinkman:'张五',
      pattern:'次卡',
      singletrainPrice:'515',
      proportion:'3',
      restTime:'323',
      Status:'停用',
      createTime:formatTime(time),
    },
    {
      key:7,
      channelName:'朱',
      channelTel:'1513685',
      channelLinkman:'张五',
      pattern:'买断',
      singletrainPrice:'515',
      proportion:'3',
      restTime:'323',
      Status:'停用',
      createTime:formatTime(time),
    },
    {
      key:8,
      channelName:'王',
      channelTel:'1513685',
      channelLinkman:'张五',
      pattern:'次卡',
      singletrainPrice:'515',
      proportion:'3',
      restTime:'323',
      Status:'停用',
      createTime:formatTime(time),
    },
    {
      key:9,
      channelName:'谷',
      channelTel:'1512313685',
      channelLinkman:'张五',
      pattern:'次卡',
      singletrainPrice:'515',
      proportion:'3',
      restTime:'323',
      Status:'停用',
      createTime:formatTime(time),
    },
    {
      key:10,
      channelName:'谷',
      channelTel:'15133546685',
      channelLinkman:'张五',
      pattern:'次卡',
      singletrainPrice:'515',
      proportion:'3',
      restTime:'323',
      Status:'停用',
      createTime:formatTime(time),
    },
    {
      key:11,
      channelName:'谷小',
      channelTel:'15137576685',
      channelLinkman:'张五',
      pattern:'次卡',
      singletrainPrice:'515',
      proportion:'3',
      restTime:'323',
      Status:'停用',
      createTime:formatTime(time),
    },
    {
      key:12,
      channelName:'孟',
      channelTel:'15186753685',
      channelLinkman:'张五',
      pattern:'次卡',
      singletrainPrice:'515',
      proportion:'3',
      restTime:'323',
      Status:'停用',
      createTime:formatTime(time),
    },
    {
      key:13,
      channelName:'谷晓',
      channelTel:'1513685',
      channelLinkman:'张五',
      pattern:'次卡',
      singletrainPrice:'515',
      proportion:'3',
      restTime:'323',
      Status:'启用',
      createTime:formatTime(time),
    },

  ];
  function addNumber(data){
    for(let i = 0;i<data.length;i++){
      data[i].number = i + 1;
    }
  }
  addNumber(data);
  export default {
    data() {
      return {
        // dateFormat: 'YYYY/MM/DD',
        form:{
          channelName:'',
          channelTel:'',
        },
        form2:{
          channelName:'',
          channelTel:'',
          channelLinkman: '',
          pattern:'',
          singletrainPrice:'',
          proportion:'',
          restTime:'',
          Status:'',
        },
        data,
        searching:false,
        pageSize:10,
        pagination:{pageSize:10},
        visible1: false,
        visible2: false,
        confirmLoading1: false,
        confirmLoading2: false,
        patternLabel:'',
        statusLabel:'',
        Label:'',
        selected:undefined,
        pattern:undefined,
        Status:undefined,
        // createTime:undefined,
        dateString:'',
        sta:undefined,
		newChannelname:'',
		newChanneltel:null,
		newAdress:'',
		newChannellinkman:'',
		newLinkmanTel:'',
		newLinkmanMail:'',
		newPattern:undefined,
		newSingletrainPrice:'',
		newProportion:'',
		newBank:'',
		newBankNumber:'',
		newEnterpriseName:'',
		//newResttime:null,
		newStatus:undefined,
        Key:null,
        Time:undefined,
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
    },
    computed:{
      columns:function(){
        return this.screenWidth < 1500 ? columns2 : columns1;
      }
    },
    methods:{
      handleChangePattern(value) {
        this.Label1=value.label;

        this.newPattern=value;
      },
/*      handleChangeStatus(value) {
        this.Label2=value.label;
        // this.selected=value;
        this.newStatus=value;
      }, */
      patternHandleChange(value) {
        this.patternLabel=value.label;
        this.form.pattern=value;
        //this.newStatus=value;

      },
      statusHandleChange(value) {
        this.statusLabel=value.label;
        this.form.Status=value;

      },
      //点击搜索
      search:function(){
        this.searching = true;
        let index = ['channelName','channelTel'];
        let search_data = this.data, i = 0;
        while(i<2){
          let target = this.form[index[i]].trim();
          if( target !== ''){
            search_data = search_data.filter(value => {
              return value[index[i]].indexOf(target) > -1;
            })
          }
          i++;
        }
        let patternTargetLabel=this.patternLabel.trim();
        if(patternTargetLabel!=undefined){
          search_data = search_data.filter(value => {
            return value['pattern'].indexOf(patternTargetLabel) > -1;
          })
        }
        let statusTargetLabel=this.statusLabel.trim();
        if(statusTargetLabel!=undefined){
          search_data = search_data.filter(value => {
            return value['Status'].indexOf(statusTargetLabel) > -1;
          })
        }
        this.data = search_data;
      },
      //点击重置
      reset(){
        this.searching = false;
        this.data = data;
        this.patternLabel='';
        this.statusLabel='';
        this.dateString='';
        this.form = {
          channelName:'',
          channelTel:'',
        };
        this.pattern=undefined;
        this.Status=undefined;
      },
      //控制对话框显示
      showModal(record,index) {
        this.visible1 = true;
		this.Key=record.key;
        this.form2.channelName=record.channelName;
        this.form2.channelTel=record.channelTel;
        this.form2.channelLinkman=record.channelLinkman;
        this.form2.pattern=record.pattern;
        this.form2.singletrainPrice=record.singletrainPrice;
        this.form2.proportion=record.proportion;
        this.form2.restTime=record.restTime;
        this.form2.Status=record.Status;
		this.Time=record.createTime;
        this.index=index;	
      },
      newChannel() {
		this.visible2 = true;
		this.newChannelname='';
		this.newChanneltel=null;
		this.newAdress='';
		this.newChannellinkman='';
		this.newLinkmanTel='';
		this.newLinkmanMail='';
		this.newPattern=undefined;
		this.newSingletrainPrice=null;
		this.newProportion='';
		//this.newResttime=null;
		this.newStatus=undefined;
		this.newBank='';
		this.newBankNumber='';
		this.newEnterpriseName='';
      },
      //对话框点击开始按钮
	//查看弹窗提交
      handleOk1() {
		let item1={
          key:this.Key,
          channelName:this.form2.channelName,
          channelTel:this.form2.channelTel,
          channelLinkman:this.form2.channelLinkman,
          pattern:this.form2.pattern,
          singletrainPrice:this.form2.singletrainPrice,
          proportion:this.form2.proportion,
          restTime:this.form2.restTime,
          Status:this.form2.Status,
          createTime:this.Time,
          number:this.Key,
        };
        this.data.splice(this.Key-1,1,item1);
        //！！！此处代码有待修改！！！
        this.confirmLoading1 = true;
        setTimeout(() => {
          this.visible1 = false;
          this.confirmLoading1 = false;
        }, 2000);
      },
	//新建提交
      handleOk2() {
        console.log('2')
        let item={
          key:this.data[this.data.length-1].key+1,
          channelName:this.newChannelname,
          channelTel:'15022046517',
          channelLinkman:this.newChannellinkman,
          pattern:this.Label1,
          singletrainPrice:this.newSingletrainPrice,
          proportion:this.newProportion,
          restTime:'',
          Status:'启用',
          createTime:formatTime(time),
        };
        this.data.push(item);
        this.data[this.data.length-1].number =this.data.length;
        console.log(data)

        this.confirmLoading2 = true;
        setTimeout(() => {
          this.visible2 = false;
          this.confirmLoading2 = false;
        }, 2000);
        this.sta=undefined;
      },
      //对话框点击取消按钮
      handleCancel1() {
        this.visible1 = false;
      },
      handleCancel2() {
        this.visible2 = false;
      },
     //停用启用按钮
      stopButton(key){
        const data = [...this.data];
        const check = data.filter(item => item.key== key);
        let obj=document.getElementById(key);
          check[0].Status='停用';
          obj.innerHTML='启用';
      },
      startButton(key){
        const data = [...this.data];
        const check = data.filter(item => item.key== key);
        let obj=document.getElementById(key);
        check[0].Status='启用';
        obj.innerHTML='停用';
      },
    },
  };
</script>

<style scoped>
.form-row{
  padding-top:5px;
}
@media screen and (min-width: 1024px) {
  .label-3-input label, .label-4-input label{ 
    margin-right:5px;
    font-weight:bold;
  }
  .label-3-input input{
    width:100px;
  }
  .label-4-input input{
    width:100px;
  }
  .label-4-select label, .label-2-select label{
    margin-right:5px;
    font-weight:bold;
  }
  .ant-select{
    width:75px;
  }
  .button{
    display:flex;
    width:110px;
    justify-content: space-between;
  }
  .ant-btn{
    padding:0 8px;
  }
}

@media screen and (min-width: 1280px) {
  .form-row{
    width:90%;
  }
  .label-3-input,.label-4-input{
    display:flex;
    align-items:center;
  }
  .label-3-input label, .label-4-input label{
    margin-right:8px;
    font-weight:bold;
  }
  .label-3-input input{
    width:120px;
  }
  .label-4-select, .label-2-select{
    display:flex;
    align-items:center;
  }
  .label-4-select label, .label-2-select label{
    margin-right:8px;
    font-weight:bold;
  }
  .ant-select{
    width:80px;
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
@media screen and (min-width: 1440px) {
  .form-row{
    width:85%;
  }
  .label-3-input,.label-4-input{
    display:flex;
    align-items:center;
  }
  .label-3-input label, .label-4-input label{
    margin-right:12px;
    font-weight:bold;
  }
  .label-3-input input{
    width:140px;
  }
  .label-4-select, .label-2-select{
    display:flex;
    align-items:center;
  }
  .label-4-select label, .label-2-select label{
    margin-right:12px;
    font-weight:bold;
  }
  .ant-select{
    width:90px;
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
    width:80%;
  }
  .label-3-input,.label-4-input{
    display:flex;
    align-items:center;
  }
  .label-3-input label, .label-4-input label{
    margin-right:15px;
    font-weight:bold;
  }
  .label-3-input input{
    width:160px;
  }
  .label-4-select, .label-2-select{
    display:flex;
    align-items:center;
  }
  .label-4-select label, .label-2-select label{
    margin-right:15px;
    font-weight:bold;
  }
  .ant-select{
    width:100px;
  }
  .button{
    display:flex;
    width:160px;
    justify-content: space-between;
  }
  .ant-btn{
    padding:0 20px;
  }
}
@media screen and (min-width: 1920px) {
  .form-row{
    width:80%;
  }
  .label-3-input,.label-4-input{
    display:flex;
    align-items:center;
  }
  .label-3-input label, .label-4-input label{
    margin-right:18px;
    font-weight:bold;
  }
  .label-3-input input{
    width:180px;
  }
  .label-4-select, .label-2-select{
    display:flex;
    align-items:center;
  }
  .label-4-select label, .label-2-select label{
    margin-right:18px;
    font-weight:bold;
  }
  .ant-select{
    width:105px;
  }
  .button{
    display:flex;
    width:165px;
    justify-content: space-between;
  }
  .ant-btn{
    padding:0 20px;
  }
}
</style>