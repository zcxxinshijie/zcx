<template>
  <div class="subpage-layout">
    <div class="subpage-title">
      套餐管理
    </div>
    <div class="subpage-content">
      <!--      请在此处填充内容-->
      <!--      表格上方内容-->
      <div class="form-area" style="width:100%">
        <div class="form-row" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
          <div class="label-2-input">
            <label>套餐名称</label>
            <a-input v-model="form.packageName"/>
          </div>
          <div class="label-2-select">
            <label>状态</label>
            <a-select placeholder="全部"
                      @change="handleChange"
                      :labelInValue="true"
                      v-model="selected">
              <a-select-option value="start">
                启用
              </a-select-option>
              <a-select-option value="stop">
                停用
              </a-select-option>
            </a-select>
          </div>
          <div class="button">
            <a-button type="primary"
                      @click="search">
              搜索
            </a-button>
            <a-button style="background-color:#F5F5F5;border:none;color:#666666;" @click="resetInfo">重置</a-button>
          </div>
        </div>
        <div>
          <a-button style="padding: 0 13px;color:#1079FA;background-color:#E3F0FD;border:none"
                    @click="createPackage">
            <img src="../../assets/package.png" style="margin-right:5px;vertical-align:bottom;" width='20px' height="20px"/>
            新建套餐
          </a-button>
        </div>
      </div>
      <!--      表格内容-->
      <div class="table-area"
           style="width:100%;margin-top:20px">
        <a-table style="width:100%;height:100%;"
                 :columns="columns"
                 :data-source="data"
                 :pagination="pagination"
                 :scroll="{x:true}"
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
                <template v-else
                          class="highlight">{{ fragment }}</template>
              </template>
            </span>
            <template v-else
                      class="highlight">
              {{ text }}
            </template>

          </template>
          <template slot="action"
                    slot-scope="record"
                    class="highlight">
            <div class="action-btn-layout" style="margin:0 auto;display:flex;justify-content:space-around">
              <a-button style="padding: 0 15px;background-color:#F5F5F5;color:#1079FA;border-color:#F5F5F5;"
                        @click="() => showModal(record.key)">
                查看
              </a-button>
              <a-button type="danger"
                        style="padding: 0 15px;"
                        @click="()=>stopButton(record.key)"
                        :id="record.key"
                        v-if="record.status=='启用'">停用</a-button>
              <a-button type="primary"
                        style="padding: 0 15px;"
                        @click="()=>startButton(record.key)"
                        :id="record.key"
                        v-if="record.status=='停用'">启用</a-button>
            </div>
          </template>
          <template slot="renderStatus" slot-scope="text">
            <span v-if="text === '启用'" style="color:#8ACD2B">{{text}}</span>
            <span v-if="text === '停用'" style="color:#F55943">{{text}}</span>
          </template>
          <!-- 让描述自适应浏览器宽度 -->
          <template slot="renderDescription" slot-scope="text">
            <span v-if="text.length <= 20 && screenWidth <= 1440 && screenWidth >= 1340">{{text}}</span>
            <a-tooltip v-else-if="text.length > 20 && screenWidth <= 1440 && screenWidth >= 1340">
              <template slot="title">
                {{text}}
              </template>
              {{text.slice(0,20)}}...
            </a-tooltip>
            <span v-else-if="text.length <= 22 && (screenWidth < 1500 || screenWidth < 1340)">{{text}}</span>
            <a-tooltip v-else-if="text.length > 22 && (screenWidth < 1500 || screenWidth < 1340)">
              <template slot="title">
                {{text}}
              </template>
              {{text.slice(0,22)}}...
            </a-tooltip>
            <span v-else-if="text.length <= 24 && screenWidth < 1600">{{text}}</span>
            <a-tooltip v-else-if="text.length > 24 && screenWidth < 1600 ">
              <template slot="title">
                {{text}}
              </template>
              {{text.slice(0,24)}}...
            </a-tooltip>
            <span v-else-if="text.length <= 26 && screenWidth < 1700">{{text}}</span>
            <a-tooltip v-else-if="text.length > 26 && screenWidth < 1700">
              <template slot="title">
                {{text}}
              </template>
              {{text.slice(0,26)}}...
            </a-tooltip>
            <span v-else-if="text.length <= 28 && screenWidth < 1900">{{text}}</span>
            <a-tooltip v-else-if="text.length > 28 && screenWidth < 1900">
              <template slot="title">
                {{text}}
              </template>
              {{text.slice(0,28)}}...
            </a-tooltip>
            <span v-else-if="text.length <= 32 && screenWidth >= 1900">{{text}}</span>
            <a-tooltip v-else-if="text.length > 32 && screenWidth >= 1900">
              <template slot="title">
                {{text}}
              </template>
              {{text.slice(0,32)}}...
            </a-tooltip>
          </template>
        </a-table >
      </div>
      <!--      查看-->

      <a-modal
              class="modal-430"
              title="修改套餐"
              :visible="visible"
              :confirm-loading="confirmLoading"
              centered
              width="400px"
              @ok="handleOk"
              @cancel="handleCancel"
              cancelText="关闭"
              okText="修改"
              :maskStyle="{'background-color':'rgb(0,0,0,0.2)'}"
              :bodyStyle="{'width':'400px','padding-top':'30px','padding-bottom':'60px',
                      'font-family': 'PingFangSC-Regular','font-size': '14px',
                      'font-weight':'Regular'}">
        <div class="modal-body" >
          <!-- 共有7步需要完成 -->
          <!--1.绑定校验规则变量  :rules="checkRules"-->
          <!--2.需要给表单绑定一个表单对象（checkForm），表单中用到变量都作为这个表单对象的属性,:model="checkForm"  -->
          <a-form-model
                  :rules="checkRules"
                  :model="checkForm"
                  style="width:360px;"
                  :labelCol="{span:6}"
                  :wrapperCol="{span:18}">
            <a-form-model-item
                    label="套餐名称">
              <a-input v-model="name"
                       default="this.name"
                       style="width:240px"
              />
            </a-form-model-item>
            <!--3.绑定验证规则prop="amount" -->
            <a-form-model-item
                    prop="amount"
                    label="总金额">
              <!--4.在表单对象中添加amount属性v-model="checkForm.amount" -->
              <a-input
                      v-model="checkForm.amount"
                      style="width:240px"/>
            </a-form-model-item>
            <a-form-model-item
                    label="训练次数">
              <a-input
                      v-model.number="times"
                      default-value="this.times"
                      style="width:240px"/>
            </a-form-model-item>
            <!-- 此处设备是新加的 -->
            <a-form-model-item
                    label="设备"
                    style="white-space: nowrap">
              <a-select
                      :labelInValue="true"
                      v-model="equipmentList"
                      placeholder="产品选择"
                      style="width:125px;margin-right:15px;">
                <a-select-option v-for="(item,index) in equipment"
                                 :key="index">
                  {{item}}
                </a-select-option>
              </a-select>
              <a-input
                      placeholder="请输入数量"
                      style="width:100px"/>
            </a-form-model-item>
            <!-- 此处状态是新加的 -->
            <a-form-model-item
                    label="状态">
              <a-select
                      placeholder="全部"
                      :labelInValue="true"
                      style="width:240px">
                <a-select-option value="start">
                  启用
                </a-select-option>
                <a-select-option value="stop">
                  停用
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item
                    label="描述">
              <a-textarea
                      style="width:240px"
                      v-model="description"
                      default-value="this.description"
                      :auto-size="{ minRows: 2, maxRows: 5 }"/>
            </a-form-model-item>
          </a-form-model>
        </div>
      </a-modal>
      <!--新建套餐-->
      <a-modal
              class="modal-430"
              title="新建套餐"
              :visible="newVisible"
              :confirm-loading="confirmLoading"
              centered
              width="400px"
              @ok="createOk"
              @cancel="createCancel"
              cancelText="关闭"
              okText="新建"
              :maskStyle="{'background-color':'rgb(0,0,0,0.2)'}"
              :bodyStyle="{'width':'400px','padding-top':'30px','padding-bottom':'60px',
                      'font-family': 'PingFangSC-Regular','font-size': '14px',
                      'font-weight':'Regular'}">
        <div class="modal-body" >
          <a-form-model
                  style="width:360px;"
                  :labelCol="{span:6}"
                  :wrapperCol="{span:18}">
            <a-form-item
                    label="套餐名称">
              <a-input style="width:240px" v-model="newPackageName"/>
            </a-form-item>
            <a-form-item
                    label="总金额">
              <a-input style="width:240px" v-model="newAmount"/>
            </a-form-item>
            <a-form-item
                    label="训练次数">
              <a-input style="width:240px" v-model="newTrainingNumber"/>
            </a-form-item>
            <a-form-item
                    label="设备"
                    style="white-space: nowrap">
              <a-select @change="equipmentHandleChange"
                        :labelInValue="true"
                        v-model="equipmentList"
                        placeholder="产品选择"
                        style="width:125px;margin-right:15px;">
                <a-select-option v-for="(item,index) in equipment"
                                 :key="index">
                  {{item}}
                </a-select-option>
              </a-select>
              <a-input v-model="newEquipment"
                       placeholder="请输入数量"
                       style="width:100px"/>
            </a-form-item>
            <a-form-item
                    label="状态">
              <a-select
                      placeholder="全部"
                      @change="handleChange"
                      :labelInValue="true"
                      v-model="newStatus"
                      style="width:240px">
                <a-select-option value="start">
                  启用
                </a-select-option>
                <a-select-option value="stop">
                  停用
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
                    label="描述">
              <a-textarea style="width:240px" v-model="newDescription" :auto-size="{ minRows: 2, maxRows: 5 }"/>
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
      title: '套餐名称',
      dataIndex: 'packageName',
      key: 'packageName',
      align:'center',
      scopedSlots:{
        customRender:'customRender'
      },
      width:100,
    },
    {
      title: '总金额',
      dataIndex: 'amount',
      key: 'amount',
      align:'center',
      width:100,
    },
    {
      title: '训练次数',
      key: 'trainingNumber',
      dataIndex: 'trainingNumber',
      align:'center',
      width:100,
    },
    {
      title: '设备',
      key: 'equipment',
      dataIndex: 'equipment',
      align:'center',
      ellipsis: true,
      width:100,
    },
    {
      title: '描述',
      key: 'description',
      dataIndex: 'description',
      align:'center',
      width:155,
      scopedSlots:{
        customRender:'renderDescription'
      },
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      align:'center',
      scopedSlots:{
        customRender:'renderStatus'
      },
      width:65,
    },
    {
      title: '创建时间',
      key: 'createTime',
      dataIndex: 'createTime',
      align:'center',
      width:180,
    },
    {
      title: '操作',
      key: 'action',
      scopedSlots: { customRender: 'action' },
      align:'center',
      width:180,
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
      title: '套餐名称',
      dataIndex: 'packageName',
      key: 'packageName',
      align:'center',
      scopedSlots:{
        customRender:'customRender'
      },
      width:100,
      fixed:'left'
    },
    {
      title: '总金额',
      dataIndex: 'amount',
      key: 'amount',
      align:'center',
      width:100,
    },
    {
      title: '训练次数',
      key: 'trainingNumber',
      dataIndex: 'trainingNumber',
      align:'center',
      width:100,
    },
    {
      title: '设备',
      key: 'equipment',
      dataIndex: 'equipment',
      align:'center',
      ellipsis: true,
      width:100,
    },
    {
      title: '描述',
      key: 'description',
      dataIndex: 'description',
      align:'center',
      width:180,
      scopedSlots:{
        customRender:'renderDescription'
      },
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      align:'center',
      scopedSlots:{
        customRender:'renderStatus'
      },
      width:65,
    },
    {
      title: '创建时间',
      key: 'createTime',
      dataIndex: 'createTime',
      align:'center',
      width:180,
    },
    {
      title: '操作',
      key: 'action',
      scopedSlots: { customRender: 'action' },
      align:'center',
      width:180,
      fixed:'right',
    },
  ];
  //设备 产品中心
  const equipment=["设备1","设备2","设备3","设备4","设备5","设备6"];
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
      packageName:'套餐A',
      amount:20000,
      trainingNumber:500,
      equipment:'二代训练一台',
      description:'套餐价格20000元，训练次数500次，赠送训练仪一台,赠送检查仪一台,赠送训练仪一台',
      status:'停用',
      createTime:formatTime(time),
    },
    {
      key:2,
      packageName:'套餐B',
      amount:20000,
      trainingNumber:500,
      equipment:'二代训练一台',
      description:'套餐价格20000元，训练次数500次，赠送训练仪一台',
      status:'启用',
      createTime:formatTime(time),
    },
    {
      key:3,
      packageName:'套餐C',
      amount:20000,
      trainingNumber:500,
      equipment:'二代训练一台',
      description:'套餐价格20000元，训练次数500次，赠送训练仪一台',
      status:'启用',
      createTime:formatTime(time),
    },
    {
      key:4,
      packageName:'套餐D',
      amount:20000,
      trainingNumber:500,
      equipment:'二代训练一台',
      description:'套餐价格20000元，训练次数500次，赠送训练仪一台',
      status:'停用',
      createTime:formatTime(time),
    },
    {
      key:5,
      packageName:'套餐C',
      amount:20000,
      trainingNumber:500,
      equipment:'二代训练一台',
      description:'套餐价格20000元，训练次数500次，赠送训练仪一台',
      status:'启用',
      createTime:formatTime(time),
    },
    {
      key:6,
      packageName:'套餐B',
      amount:20000,
      trainingNumber:500,
      equipment:'二代训练一台',
      description:'套餐价格20000元，训练次数500次，赠送训练仪一台',
      status:'启用',
      createTime:formatTime(time),
    },
    {
      key:7,
      packageName:'套餐A',
      amount:20000,
      trainingNumber:500,
      equipment:'二代训练一台',
      description:'套餐价格20000元，训练次数500次，赠送训练仪一台',
      status:'启用',
      createTime:formatTime(time),
    },
    {
      key:8,
      packageName:'套餐B',
      amount:20000,
      trainingNumber:500,
      equipment:'二代训练一台',
      description:'套餐价格20000元，训练次数500次，赠送训练仪一台',
      status:'启用',
      createTime:formatTime(time),
    },
    {
      key:9,
      packageName:'套餐C',
      amount:20000,
      trainingNumber:500,
      equipment:'二代训练一台',
      description:'套餐价格20000元，训练次数500次，赠送训练仪一台',
      status:'启用',
      createTime:formatTime(time),
    },
    {
      key:10,
      packageName:'套餐D',
      amount:20000,
      trainingNumber:500,
      equipment:'二代训练一台',
      description:'套餐价格20000元，训练次数500次，赠送训练仪一台',
      status:'启用',
      createTime:formatTime(time),
    },
    {
      key:11,
      packageName:'套餐A',
      amount:20000,
      trainingNumber:500,
      equipment:'二代训练一台',
      description:'套餐价格20000元，训练次数500次，赠送训练仪一台',
      status:'启用',
      createTime:formatTime(time),
    },
    {
      key:12,
      packageName:'套餐A',
      amount:20000,
      trainingNumber:500,
      equipment:'二代训练一台',
      description:'套餐价格20000元，训练次数500次，赠送训练仪一台',
      status:'启用',
      createTime:formatTime(time),
    },
    {
      key:13,
      packageName:'套餐A',
      amount:20000,
      trainingNumber:500,
      equipment:'二代训练一台',
      description:'套餐价格20000元，训练次数500次，赠送训练仪一台',
      status:'启用',
      createTime:formatTime(time),
    },
    {
      key:14,
      packageName:'套餐A',
      amount:20000,
      trainingNumber:500,
      equipment:'二代训练一台',
      description:'套餐价格20000元，训练次数500次，赠送训练仪一台',
      status:'启用',
      createTime:formatTime(time),
    },
    {
      key:15,
      packageName:'套餐A',
      amount:20000,
      trainingNumber:500,
      equipment:'二代训练一台',
      description:'套餐价格20000元，训练次数500次，赠送训练仪一台',
      status:'启用',
      createTime:formatTime(time),
    },
    {
      key:16,
      packageName:'套餐A',
      amount:20000,
      trainingNumber:500,
      equipment:'二代训练一台',
      description:'套餐价格20000元，训练次数500次，赠送训练仪一台',
      status:'启用',
      createTime:formatTime(time),
    }
  ];
  function addNumber(data){
    for(let i = 0;i<data.length;i++){
      if(data[i].number==null){
        data[i].number = i + 1;
      }

    }
  }
  addNumber(data);

  export default {
    data(){
      let checkAmount = (rule, value, callback) => {   //5.定义校验amount的验证规则
        value = Number(value);
        if (isNaN(value)) {
          callback(new Error('请输入数字!'));
        } else {
          callback();
        }
      };
      return{
        form:{
          packageName:'',
          status:'',
        },
        data,
        equipment,
        searching:false,
        pageSize:10,
        pagination:{pageSize:10},
        visible: false,
        confirmLoading: false,
        Label:'',
        newVisible:false,
        selected:undefined,
        name:'',
        amount:0,
        times:0,
        description:null,
        sta:undefined,
        newPackageName:'',
        newAmount:null,
        newTrainingNumber:null,
        newEquipment:'',
        newDescription:'',
        newStatus:undefined,
        theKey:0,
        equipmentList:undefined,
        equipmentName:'',
        screenWidth:null,
        screenHeight:null,
        checkForm:{   //6.表单对象checkForm初始化
          amount:13
        },
        checkRules: { //7.定义总的校验规则
          amount: [
            {validator:checkAmount, trigger:'blur'},
          ],
        }
      }
    },
    mounted() {
      // const e = document.createEvent('Event')
      // e.initEvent('resize', true, true)
      // window.dispatchEvent(e)
      //获取视口宽度，用来自适应的
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
      columns: function(){
        console.log(this.screenWidth)
        return this.screenWidth < 1340 ? columns2:columns1;
      }
    },
    methods:{

      //点击搜索按钮
      search:function(){
        this.searching = true;
        let search_data = data;
        let target = this.form['packageName'].trim()|| '';
        let targetLabel=this.Label.trim()|| '';
        if( target !== ''){
          search_data = search_data.filter(value => {
            return value['packageName'].indexOf(target) > -1;
          })
        }
        if(targetLabel!==' '){
          search_data = search_data.filter(value => {
            return value['status'].indexOf(targetLabel) > -1;
          })
        }
        this.data = search_data;
        console.log(this.data)
      },
      //点击重置按钮
      reset(){
        this.searching = false;
        this.data = data;
        this.Label='';
        this.form = {
          packageName:'',
        };
        this.selected=undefined;

      },
      //点击停用按钮
      stopButton(key){
        const data = [...this.data];
        const check = data.filter(item => item.key== key);
        let obj=document.getElementById(key);
        check[0].status='停用';
        obj.innerHTML='启用';
      },
      //点击启用按钮
      startButton(key){
        const data = [...this.data];
        const check = data.filter(item => item.key== key);
        let obj=document.getElementById(key);
        check[0].status='启用';
        obj.innerHTML='停用';
      },
      equipmentHandleChange(value){
        this.equipmentName=value.label.trim();
      },
      handleChange(value) {
        this.Label=value.label;
        this.selected=value;
        this.newStatus=value;

      },
      //控制对话框显示
      showModal(key) {
        this.theKey=key;
        this.visible = true;
        const data = [...this.data];
        const check = data.filter(item => item.key== key);
        this.name=check[0].packageName;
        this.amount=check[0].amount;
        this.times=check[0].trainingNumber;
        this.description=check[0].description;
        this.sta='start';

      },
      //新建套餐
      createPackage() {
        this.newVisible = true;
        this.newPackageName='';
        this.newAmount=null;
        this.newTrainingNumber=null;
        this.newEquipment='';
        this.newDescription='';
        this.newStatus=undefined;
        this.equipmentList=undefined;
        this.equipmentName='';
        this.newEquipment='';

      },
      //对话框点击开始按钮
      handleOk() {
        let item={
          key:this.theKey,
          packageName:this.name,
          amount:this.amount,
          trainingNumber:this.times,
          equipment:data[this.theKey-1].equipment,
          description:this.description,
          status:data[this.theKey-1].status,
          createTime:data[this.theKey-1].createTime,
          number:this.theKey,
        };
        this.data.splice(this.theKey-1,1,item);
        this.confirmLoading = true;
        setTimeout(() => {
          this.visible = false;
          this.confirmLoading = false;
        }, 2000);
        this.sta=undefined;
      },
      //对话框点击取消按钮
      handleCancel() {
        this.visible = false;
        this.sta=undefined;
      },
      //新建套餐点击开始按钮
      createOk() {
        let item={
          key:this.data[this.data.length-1].key+1,
          packageName:this.newPackageName,
          amount:this.newAmount,
          trainingNumber:this.newTrainingNumber,
          equipment:this.equipmentName+"："+this.newEquipment+"台",
          description:this.newDescription,
          status:this.Label.trim(),
          createTime:formatTime(time),
        };
        this.data.push(item);
        this.data[this.data.length-1].number =this.data.length;
        this.confirmLoading = true;
        setTimeout(() => {
          this.newVisible = false;
          this.confirmLoading = false;
        }, 2000);
      },
      //新建套餐点击取消按钮
      createCancel() {
        this.newVisible = false;
      },
    }
  }
</script>

<style scoped>
  /*.highlight {*/
  /*  background-color: rgb(253, 245, 1);*/
  /*  padding: 0px;*/
  /*  line-height:48px;*/
  /*  text-align: center;*/
  /*  display:flex;*/
  /*  flex-wrap: nowrap;*/
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
      width:70%;
    }
    .label-2-input,.label-3-input{
      display:flex;
      align-items:center;
    }
    .label-2-input label, .label-3-input label{
      margin-right:8px;
      font-weight:bold;
    }
    .label-2-input input, .label-3-input input{
      width:130px;
    }
    .label-2-select{
      display:flex;
      align-items:center;
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
  }

  @media screen and (min-width: 1280px) {
    .form-row{
      width:60%;
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
    .label-2-select{
      display:flex;
      align-items:center;
    }
    .label-4-select label, .label-2-select label{
      margin-right:13px;
      font-weight:bold;
    }
    .label-2-select .ant-select{
      width:110px;
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
    .label-2-select{
      display:flex;
      align-items:center;
    }
    .label-4-select label, .label-2-select label{
      margin-right:15px;
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
    .label-4-select label, .label-2-select label{
      margin-right:18px;
      font-weight:bold;
    }
    .label-2-select .ant-select{
      width:130px;
    }
    .button{
      display:flex;
      width:150px;
      justify-content: space-between;
    }
    .ant-btn{
      padding:0 18px;
    }
    .action-btn-layout{
      width:90%;
    }
  }
  @media screen and (min-width: 1920px) {
    .form-row{
      width:45%;
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
    .label-4-select label, .label-2-select label{
      margin-right:20px;
      font-weight:bold;
    }
    .label-2-select .ant-select{
      width:140px;
    }
    .button{
      display:flex;
      width:170px;
      justify-content: space-between;
    }
    .ant-btn{
      padding:0 20px;
    }
    .action-btn-layout{
      width:80%;
    }
  }
</style>