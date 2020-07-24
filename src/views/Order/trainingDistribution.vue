<template>
  <div class="subpage-layout">
    <div class="subpage-title">
      训练分配
    </div>
    <div class="subpage-content">
<!--      请在此处填充内容-->
<!--      筛选-->
      <div class="form-area" style="width:100%" >
        <div class="form-row" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
          <div class="label-3-input">
            <label>渠道名</label>
            <a-input v-model="form.buyer"/>
          </div>
          <div class="label-3-input">
            <label>门店名</label>
            <a-input v-model="form.seller"/>
          </div>
          <div class="label-2-select">
            <label>类型</label>
            <a-select v-model="operation"
                      placeholder="全部"
                      @change="operationHandleChange"
                      :labelInValue="true">
              <a-select-option value="give">
                赠送
              </a-select-option>
              <a-select-option value="buy">
                购买
              </a-select-option>
            </a-select>
          </div>
          <div class="label-3-input">
            <label>时间</label>
            <a-date-picker
                    v-model="createTime"
                    type="date"
                    placeholder=""
                    @change="onChange"
                    :format="dateFormat"/>
          </div>
          <div class="label-2-select">
            <label>状态</label>
            <a-select v-model="orderStatus"
                      placeholder="全部"
                      @change="statusHandleChange"
                      :labelInValue="true">
              <a-select-option value="success">
                成功
              </a-select-option>
              <a-select-option value="repel">
                撤销
              </a-select-option>
            </a-select>
          </div>
          <div class="button">
            <a-button type="primary"
                      @click="search">
              搜索
            </a-button>
            <a-button style="background-color:#F5F5F5;border:none;color:#666666;" @click="reset">重置</a-button>
          </div>
        </div>
          <div>
            <a-button style="padding: 0 13px;color:#1079FA;background-color:#E3F0FD;border:none"
                      @click="distribute">
              <img src="../../assets/distribution.png" style="margin-right:5px;vertical-align:bottom;" width='20px' height="20px"/>
              分配
            </a-button>
          </div>
      </div>
<!--表格显示-->
      <div class="table-area" style="width:100%;margin-top:20px">
        <a-table style="width:100%;height:100%"
                 :scroll="{x:true}"
                 :columns="columns"
                 :data-source="this.data"
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
          <template slot="action" slot-scope="record">
             <span slot="action">
            <a-button style="background-color:#F5F5F5;color:#1079FA;border-color:#F5F5F5;"
                      @click="() => showRepealModal(record.id)">
              查看
            </a-button>

          </span>
          </template>
          <template slot="renderBuyer" slot-scope="text">
            <span v-if="text.length <= 7">{{text}}</span>
            <a-tooltip v-else>
              <template slot="title">
                {{text}}
              </template>
              {{text.slice(0,7)}}...
            </a-tooltip>
          </template>
          <template slot="renderRemark" slot-scope="text">
            <span v-if="text.length <= 8">{{text}}</span>
            <a-tooltip v-else>
              <template slot="title">
                {{text}}
              </template>
              {{text.slice(0,8)}}...
            </a-tooltip>
          </template>
          <template slot="renderStatus" slot-scope="text">
            <div v-if="text === '成功'" style="color:#8ACD2A">{{text}}</div>
            <div v-else-if="text === '撤销'" style="color:#F55943">{{text}}</div>
          </template>
          <span slot="action">
            <a-button type="primary"
                      style="margin:2px 20px 2px 0"
                      @click="() => showRepealModal(record.id)">
              查看
            </a-button>

          </span>
        </a-table>
      </div>
<!--      新建训练分配-->
      <a-modal
        class="modal-430"
        title="训练购买"
        :visible="visible"
        :confirm-loading="confirmLoading"
        centered
        width="400px"
        @ok="handleOk"
        @cancel="handleCancel"
        cancelText="关闭"
        okText="新建"
        :maskStyle="{'background-color':'rgb(0,0,0,0.2)'}"
        :bodyStyle="{'width':'400px','padding-top':'30px','padding-bottom':'60px',
                      'font-family': 'PingFangSC-Regular','font-size': '14px',
                      'font-weight':'Regular'}">
        <div class="modal-body">
          <a-form-model style="width:360px;"
                        :labelCol="{span:6}"
                        :wrapperCol="{span:18}"
                        :rules="createCheckRules"
                        :model="createCheckForm">
            <a-form-model-item label="购买类型">
              <a-select @change="handleChange"
                        :labelInValue="true"
                        style="width:240px"
                        v-model="purchase">
                <a-select-option value="channel">
                  渠道
                </a-select-option>
                <a-select-option value="shop">
                  门店
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item
              label="渠道名称"
              v-if="purchasePattern=='channel'">
              <a-select placeholder="渠道"
                @change="nameHandleChange"
                :labelInValue="true"
                style="width:240px"
                v-model="nameChannel">
                <a-select-option
                  v-for="(item,index) in channel"
                  :key="index">
                  {{item}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item
              label="门店名称"
              v-if="purchasePattern=='shop'">
              <a-select 
                placeholder="门店"
                @change="nameHandleChange"
                :labelInValue="true"
                style="width:240px"
                v-model="nameStore">
                <a-select-option 
                  v-for="(item,index) in store"
                  :key="index">
                  {{item}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item
              label="类别">
              <a-select 
                @change="categoryHandleChange"
                :labelInValue="true"
                style="width:240px"
                v-model="nameCategory">
                <a-select-option value="practice">
                  训练
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item
              label="操作类型">
              <a-select 
                placeholder="分配"
                style="width:240px"
                :labelInValue="true"
                @change="operationHandleChange"
                v-model="newOperation">
                <a-select-option value="buy">
                  购买
                </a-select-option>
                <a-select-option value="give">
                  赠送
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item
              label="套餐">
              <a-select 
                placeholder="选择套餐"
                @change="packageHandleChange"
                :labelInValue="true"
                v-model="thePackageName"
                style="width:240px">
                <a-select-option 
                  v-for="(item,index) in thePackage"
                  :key="index">
                  {{item}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="次数"
                               prop="times">
              <a-input style="width:240px" v-model="createCheckForm.times"/>
            </a-form-model-item>
            <a-form-model-item label="金额"
                         prop="amount">
              <a-input style="width:240px" v-model="createCheckForm.amount"/>
            </a-form-model-item>
            <a-form-model-item
              label="套餐描述">
              <a-textarea :auto-size="{ minRows: 2, maxRows: 5 }" style="width:240px" v-model="newPackageInfo"/>
            </a-form-model-item>
            <a-form-model-item
              label="备注">
              <a-textarea :auto-size="{ minRows: 2, maxRows: 5 }" style="width:240px" v-model="remark"/>
            </a-form-model-item>
          </a-form-model>
        </div>
      </a-modal>
<!--      查看分配-->
      <a-modal
        class="modal-430"
        title="训练分配详情"
        :visible="repealVisible"
        :confirm-loading="confirmLoading"
        centered
        width="400px"
        @ok="handleRepeal"
        @cancel="handleCancel"
        cancelText="关闭"
        okText="撤销"
        :maskStyle="{'background-color':'rgb(0,0,0,0.2)'}"
        :bodyStyle="{'width':'400px','padding-top':'30px','padding-bottom':'60px',
                      'font-family': 'PingFangSC-Regular','font-size': '14px',
                      'font-weight':'Regular'}">
        <div class="modal-body">
          <a-form-model
            style="width:360px"
            :labelCol="{span:6}"
            :wrapperCol="{span:18}"
            :rules="checkRules"
            :model="checkForm">
            <a-form-model-item
              label="买方">
              <a-input style="width:240px" v-model="theBuyer"/>
            </a-form-model-item>
            <a-form-model-item
              label="卖方">
              <a-input style="width:240px" v-model="theSeller"/>
            </a-form-model-item>
            <a-form-model-item
              label="类别">
              <a-input style="width:240px" v-model="theCategory"/>
            </a-form-model-item>
            <a-form-model-item
              label="操作类型">
              <a-input style="width:240px" v-model="theOperation"/>
            </a-form-model-item>
            <a-form-model-item
              label="套餐">
              <a-input style="width:240px" v-model="thePack"/>
            </a-form-model-item>
            <a-form-model-item
              label="次数"
              prop="theTimes">
              <a-input style="width:240px" v-model="checkForm.theTimes"/>
            </a-form-model-item>
            <a-form-model-item
              label="金额"
              prop="theAmount">
              <a-input style="width:240px" v-model="checkForm.theAmount"/>
            </a-form-model-item>
            <a-form-item
              label="套餐描述">
              <a-textarea :auto-size="{ minRows: 2, maxRows: 5 }" style="width:240px" v-model="thePackageInfo"/>
            </a-form-item>
            <a-form-item
              label="备注">
              <a-textarea :auto-size="{ minRows: 2, maxRows: 5 }" style="width:240px" v-model="theRemark"/>
            </a-form-item>
          </a-form-model>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
  import axios from "axios";

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      scopedSlots:{customRender:'id'},
      align:'center',
      width:65,
      fixed:'left',
    },
    {
      title: '买方',
      dataIndex: 'buyer',
      key: 'buyer',
      scopedSlots:{
        customRender:'renderBuyer'
      },
      align:'center',
      width:150,
      fixed:'left',
    },
    {
      title: '卖方',
      dataIndex: 'seller',
      key: 'seller',
      align:'center',
      scopedSlots:{
        customRender:'customRender'
      },
      width:120,
    },
    {
      title: '类别',
      key: 'category',
      dataIndex: 'category',
      align:'center',
      ellipsis: true,
      width:81,
    },
    {
      title: '操作类型',
      key: 'op_type',
      dataIndex: 'op_type',
      align:'center',
      width:100,
    },
    {
      title: '订单号',
      key: 'orderno',
      dataIndex: 'orderno',
      align:'center',
      width:170,
    },
    {
      title: '次数',
      key: 'training_times',
      dataIndex: 'training_times',
      align:'center',
      ellipsis: true,
      width:70,
    },
    {
      title: '金额',
      key: 'training_amt',
      dataIndex: 'training_amt',
      align:'center',
      width:110,
    },
    {
      title: '操作人',
      key: 'op_name',
      dataIndex: 'op_name',
      align:'center',
      width:90,
    },
    {
      title: '订单状态',
      key: 'status',
      dataIndex: 'status',
      align:'center',
      scopedSlots:{
        customRender:'renderStatus'
      },
      width:100,
    },
    {
      title: '创建时间',
      key: 'create_time',
      dataIndex: 'create_time',
      align:'center',
      width: 160,
    },
    {
      title: '更新时间',
      key: 'uptime_time',
      dataIndex: 'uptime_time',
      align:'center',
      width: 160,
    },
    {
      title: '备注',
      key: 'remark',
      dataIndex: 'remark',
      align:'center',
      width:160,
      scopedSlots:{
        customRender:'renderRemark'
      },
    },

    {
      title: '操作',
      key: 'action',
      scopedSlots: { customRender: 'action' },
      align:'center',
      ellipsis: true,
      width:140,
      fixed:'right'
    },
  ];
  //渠道
  const channel=["渠道1","渠道2","渠道3","渠道4","渠道5","渠道6"];
  //门店
  const store=["门店1","门店2","门店3","门店4","门店5",];
  //套餐
  const thePackage=["套餐1","套餐2","套餐3","套餐4","套餐5"];
  //当年登录账号
  const adminID="LJQ";
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
  //生成订单号
  let createOrderNumber=function () {
    let year = time.getFullYear();
    let month = time.getMonth()+1;
    month = month < 10 ? `0${month}` : month;
    let date = time.getDate();
    date = date < 10 ? `0${date}` : date;
    let hour = time.getHours();
    hour = hour < 10 ? `0${hour}` : hour;
    let min = time.getMinutes();
    min = min < 10 ? `0${min}` : min;
    let currentTime=`${year}${month}${date}${hour}${min}`
    return "FP"+currentTime;
  }
  // const data = [
  //   {
  //     key:1,
  //     buyer:'优眼线下直营体验优眼线下直营体验店优眼线下直营体验店',
  //     seller:'公司',
  //     category:'训练',
  //     operation:'赠送',
  //     orderNumber:'FP2020204154465048',
  //     theTimes:1,
  //     money:0,
  //     operator:'谷晓文',
  //     orderStatus:'成功',
  //     createTime:'2020/06/05 17:16:02',
  //     updateTime:formatTime(time),
  //     remark:'',
  //     packageName:'套餐1',
  //     newPackageInfo:''
  //   },
  //   {
  //     key:2,
  //     buyer:'小明',
  //     seller:'公司',
  //     category:'训练',
  //     operation:'购买',
  //     orderNumber:'FP2020204154465048',
  //     theTimes:1,
  //     money:0,
  //     operator:'谷晓文',
  //     orderStatus:'成功',
  //     createTime:formatTime(time),
  //     updateTime:formatTime(time),
  //     remark:'啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦',
  //     packageName:'套餐1',
  //     newPackageInfo:'滴答滴答'
  //   },
  //   {
  //     key:3,
  //     buyer:'yangluoyi',
  //     seller:'学校',
  //     category:'训练',
  //     operation:'赠送',
  //     orderNumber:'FP2020204154465048',
  //     theTimes:1,
  //     money:0,
  //     operator:'谷晓文',
  //     orderStatus:'成功',
  //     createTime:formatTime(time),
  //     updateTime:formatTime(time),
  //     remark:'',
  //     packageName:'套餐1',
  //     newPackageInfo:''
  //   },
  //   {
  //     key:4,
  //     buyer:'yangluoyi',
  //     seller:'公司',
  //     category:'训练',
  //     operation:'赠送',
  //     orderNumber:'FP2020204154465048',
  //     theTimes:1,
  //     money:0,
  //     operator:'谷晓文',
  //     orderStatus:'成功',
  //     createTime:'2020/06/15 17:16:02',
  //     updateTime:formatTime(time),
  //     remark:'',
  //     packageName:'套餐1',
  //     newPackageInfo:''
  //   },
  //   {
  //     key:5,
  //     buyer:'yangluoyi',
  //     seller:'公司',
  //     category:'训练',
  //     operation:'赠送',
  //     orderNumber:'FP2020204154465048',
  //     theTimes:1,
  //     money:0,
  //     operator:'谷晓文',
  //     orderStatus:'成功',
  //     createTime:formatTime(time),
  //     updateTime:formatTime(time),
  //     remark:'',
  //     packageName:'套餐1',
  //     newPackageInfo:''
  //   },
  //   {
  //     key:6,
  //     buyer:'小明',
  //     seller:'学校',
  //     category:'训练',
  //     operation:'购买',
  //     orderNumber:'FP2020204154465048',
  //     theTimes:1,
  //     money:0,
  //     operator:'谷晓文',
  //     orderStatus:'成功',
  //     createTime:formatTime(time),
  //     updateTime:formatTime(time),
  //     remark:'',
  //     packageName:'套餐1',
  //     newPackageInfo:''
  //   },
  //   {
  //     key:7,
  //     buyer:'yangluoyi',
  //     seller:'公司',
  //     category:'训练',
  //     operation:'赠送',
  //     orderNumber:'FP2020204154465048',
  //     theTimes:1,
  //     money:0,
  //     operator:'谷晓文',
  //     orderStatus:'成功',
  //     createTime:'2020/06/05 17:16:02',
  //     updateTime:formatTime(time),
  //     remark:'',
  //     packageName:'套餐1',
  //     newPackageInfo:''
  //   },
  //   {
  //     key:8,
  //     buyer:'小明',
  //     seller:'公司',
  //     category:'训练',
  //     operation:'赠送',
  //     orderNumber:'FP2020204154465048',
  //     theTimes:1,
  //     money:0,
  //     operator:'谷晓文',
  //     orderStatus:'撤销',
  //     createTime:formatTime(time),
  //     updateTime:formatTime(time),
  //     remark:'',
  //     packageName:'套餐1',
  //     newPackageInfo:''
  //   },
  //   {
  //     key:9,
  //     buyer:'yangluoyi',
  //     seller:'公司',
  //     category:'训练',
  //     operation:'赠送',
  //     orderNumber:'FP2020204154465048',
  //     theTimes:1,
  //     money:0,
  //     operator:'谷晓文',
  //     orderStatus:'成功',
  //     createTime:'2020/06/28 17:16:02',
  //     updateTime:formatTime(time),
  //     remark:'',
  //     packageName:'套餐1',
  //     newPackageInfo:''
  //   },
  //   {
  //     key:10,
  //     buyer:'yangluoyi',
  //     seller:'公司',
  //     category:'训练',
  //     operation:'赠送',
  //     orderNumber:'FP2020204154465048',
  //     theTimes:1,
  //     money:0,
  //     operator:'谷晓文',
  //     orderStatus:'撤销',
  //     createTime:formatTime(time),
  //     updateTime:formatTime(time),
  //     remark:'',
  //     packageName:'套餐1',
  //     newPackageInfo:''
  //   },
  //   {
  //     key:11,
  //     buyer:'yangluoyi',
  //     seller:'公司',
  //     category:'训练',
  //     operation:'赠送',
  //     orderNumber:'FP2020204154465048',
  //     theTimes:1,
  //     money:0,
  //     operator:'谷晓文',
  //     orderStatus:'成功',
  //     createTime:'2020/06/28 17:16:02',
  //     updateTime:formatTime(time),
  //     remark:'',
  //     packageName:'套餐1',
  //     newPackageInfo:''
  //   },
  //   {
  //     key:12,
  //     buyer:'小明',
  //     seller:'学校',
  //     category:'训练',
  //     operation:'赠送',
  //     orderNumber:'FP2020204154465048',
  //     theTimes:1,
  //     money:0,
  //     operator:'谷晓文',
  //     orderStatus:'成功',
  //     createTime:formatTime(time),
  //     updateTime:formatTime(time),
  //     remark:'',
  //     packageName:'套餐1',
  //     newPackageInfo:''
  //   },
  //   {
  //     key:13,
  //     buyer:'yangluoyi',
  //     seller:'公司',
  //     category:'训练',
  //     operation:'赠送',
  //     orderNumber:'FP2020204154465048',
  //     theTimes:1,
  //     money:0,
  //     operator:'谷晓文',
  //     orderStatus:'成功',
  //     createTime:formatTime(time),
  //     updateTime:formatTime(time),
  //     remark:'',
  //     packageName:'套餐1',
  //     newPackageInfo:''
  //   },
  //   {
  //     key:14,
  //     buyer:'yangluoyi',
  //     seller:'公司',
  //     category:'训练',
  //     operation:'赠送',
  //     orderNumber:'FP2020204154465048',
  //     theTimes:1,
  //     money:0,
  //     operator:'谷晓文',
  //     orderStatus:'成功',
  //     createTime:formatTime(time),
  //     updateTime:formatTime(time),
  //     remark:'',
  //     packageName:'套餐1',
  //     newPackageInfo:''
  //   },
  //   {
  //     key:15,
  //     buyer:'yangluoyi',
  //     seller:'公司',
  //     category:'训练',
  //     operation:'赠送',
  //     orderNumber:'FP2020204154465048',
  //     theTimes:1,
  //     money:0,
  //     operator:'谷晓文',
  //     orderStatus:'成功',
  //     createTime:formatTime(time),
  //     updateTime:formatTime(time),
  //     remark:'',
  //     packageName:'套餐1',
  //     newPackageInfo:''
  //   },
  //   {
  //     key:16,
  //     buyer:'yangluoyi',
  //     seller:'公司',
  //     category:'训练',
  //     operation:'赠送',
  //     orderNumber:'FP2020204154465048',
  //     theTimes:1,
  //     money:0,
  //     operator:'谷晓文',
  //     orderStatus:'成功',
  //     createTime:formatTime(time),
  //     updateTime:formatTime(time),
  //     remark:'',
  //     packageName:'套餐1',
  //     newPackageInfo:''
  //   }
  // ];
  // function addNumber(data){
  //   for(let i = 0;i<data.length;i++){
  //     data[i].number = i + 1;
  //   }
  // }
  // addNumber(data);
  export default {
    data() {
      let checkAmount = (rule, value, callback) => {   //5.定义校验amount的验证规则
        value = Number(value);
        if (isNaN(value)) {
          callback(new Error('请输入数字!'));
        } else {
          callback();
        }
      };
      return {
        dateFormat: 'YYYY/MM/DD',
        form:{
          buyer:'',
          seller:'',
          operation:'',
          orderStatus:'',
          createTime:'',
        },
        //data,
        data:null,
        allData:null,
        adminID,
        channel,
        store,
        thePackage,
        columns,
        searching:false,
        pageSize:10,
        pagination:{pageSize:10},
        visible: false,
        repealVisible:false,
        confirmLoading: false,
        operationLabel:'',
        statusLabel:'',
        Label:'',
        selected:undefined,
        newStatus:undefined,
        operation:undefined,
        orderStatus:undefined,
        createTime:undefined,
        dateString:'',
        purchasePattern:'',
        channelName:'',
        storeName:'',
        newCategory:'',
        newPackageInfo:'',
        remark:'',
        purchase:undefined,
        nameChannel:undefined,
        nameStore:undefined,
        nameCategory:undefined,
        newOperation:undefined,
        thePackageName:undefined,
        packageName:'',
        theBuyer:'',
        theSeller:'',
        theCategory:'',
        theOperation:'',
        thePack:'',
        thePackageInfo:'',
        theRemark:'',
        theKey:0,
        createCheckForm:{   //6.表单对象checkForm初始化
          times:null,
          amount:null,
        },
        createCheckRules: { //7.定义总的校验规则
          times: [
            {validator:checkAmount, trigger:'blur'},
          ],
          amount: [
            {validator:checkAmount, trigger:'blur'},
          ],
        },
        checkForm:{   //6.表单对象checkForm初始化
          theTimes:null,
          theAmount:null,
        },
        checkRules: { //7.定义总的校验规则
          theTimes: [
            {validator:checkAmount, trigger:'blur'},
          ],
          theAmount: [
            {validator:checkAmount, trigger:'blur'},
          ],
        }
      };
    },
    created() {
      axios({
        method:'get',
        url:'/train_all.json',
      }).then(res=>{
        this.data=res.data.data.info;
        this.allData=this.data;
      }).catch(function (error) { // 请求失败处理
        console.log(error);
      });
    },
    computed: {

    },
    methods:{
      onPanelChange(value, mode) {
        console.log(value, mode);
      },
      onChange(date, dateString) {
        this.dateString=dateString;
        //console.log(this.createTime)
      },
      handleChange(value) {
        this.Label=value.label;
        this.selected=value;
        this.newStatus=value;
        this.purchasePattern=value.key.trim();
      },
      nameHandleChange(value){
        this.channelName=value.label.trim();
        this.storeName=value.label.trim();
        //console.log(this.storeName||this.channelName)
      },
      categoryHandleChange(value){
        this.newCategory=value.label.trim();
      },
      operationHandleChange(value) {
        this.operationLabel=value.label;
        this.form.operation=value;
        //this.newStatus=value;

      },
      packageHandleChange(value){
        this.packageName=value.label.trim();
      },
      statusHandleChange(value) {
        this.statusLabel=value.label;
        this.form.orderStatus=value;

      },
      //点击搜索
      search:function(){
        this.searching = true;
        let index = ['buyer','seller'];
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
        let operationTargetLabel=this.operationLabel.trim();
        if(operationTargetLabel!=undefined){
          search_data = search_data.filter(value => {
            return value['op_type'].indexOf(operationTargetLabel) > -1;
          })
        }
        let statusTargetLabel=this.statusLabel.trim()|| '';
        if(statusTargetLabel!=''){
          search_data = search_data.filter(value => {
            return value['status'].indexOf(statusTargetLabel) > -1;
          })
        }
        let dateTargetLabel=this.dateString.trim()|| '';
        if(dateTargetLabel!=''){
          search_data = search_data.filter(value => {
            return value['create_time'].indexOf(dateTargetLabel) > -1;
          })
        }
        this.data = search_data;
      },
      //点击重置
      reset(){
        this.searching = false;
        this.data = this.allData;
        this.operationLabel='';
        this.statusLabel='';
        this.dateString='';
        this.form = {
          buyer:'',
          seller:'',
          operation:'',
          orderStatus:'',
          createTime:'',
        };
        this.operation=undefined;
        this.orderStatus=undefined;
        this.createTime=undefined;
      },
      //控制对话框显示
      showModal() {
        this.visible = true;
      },
      //查看撤销
      showRepealModal(id){
        this.theKey=id;
        this.repealVisible=true;
        const data = [...this.data];
        const check = data.filter(item => item.id== id);
        this.theBuyer=check[0].buyer;
        this.theSeller=check[0].seller;
        this.theCategory=check[0].category;
        this.theOperation=check[0].op_type;
        this.thePack=check[0].packageName;
        this.checkForm.theTimes=check[0].training_times;
        this.checkForm.theAmount=check[0].training_amt;
        this.thePackageInfo=check[0].newPackageInfo;
        this.theRemark=check[0].remark;
      },
      distribute(){
        this.visible = true;
        this.purchase=undefined;
        this.nameChannel=undefined;
        this.nameStore=undefined
        this.nameCategory=undefined;
        this.newOperation=undefined;
        this.thePackageName=undefined;
        this.times=null;
        this.amount=null;
        this.remark='';
        this.newPackageInfo='';
      },
      //对话框点击开始按钮
      handleOk() {
        let thisOrderNumber=createOrderNumber();
        console.log(thisOrderNumber)
        let item={
          id:this.data[this.data.length-1].id+1,
          buyer:this.storeName||this.channelName,
          seller:this.adminID,
          category:this.newCategory,
          op_type:this.operationLabel,
          orderno:thisOrderNumber,
          training_times:this.times,
          training_amt:this.amount,
          op_name:this.adminID,
          status:'成功',
          create_time:formatTime(time),
          uptime_time:formatTime(time),
          remark:this.remark,
          packageName:this.packageName,
          newPackageInfo:this.newPackageInfo,
        };
        this.data.push(item);
        //this.data[this.data.length-1].number =this.data.length;
        this.confirmLoading = true;
        setTimeout(() => {
          this.visible = false;
          this.confirmLoading = false;
        }, 2000);
      },
      //对话框点击取消按钮
      handleCancel() {
        this.visible = false;
        this.repealVisible=false;
      },
      handleRepeal(){
        this.confirmLoading = true;
        setTimeout(() => {
          this.repealVisible = false;
          this.confirmLoading = false;
        }, 2000);
        this.data[this.theKey-1].status="撤销";
      }
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
      width:80px;
    }
    .ant-calendar-picker{
      width:120px;
    }
    .button{
      display:flex;
      width:125px;
      justify-content: space-between;
    }
    .ant-btn{
      padding:0 10px;
    }
  }

  @media screen and (min-width: 1280px) {
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
    .label-4-input input{
      width:100px;
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
      width:90px;
    }
    .button{
      display:flex;
      width:145px;
      justify-content: space-between;
    }
    .ant-btn{
      padding:0 15px;
    }
  }
  @media screen and (min-width: 1440px) {
    .label-3-input,.label-4-input{
      display:flex;
      align-items:center;
    }
    .label-3-input label, .label-4-input label{
      margin-right:12px;
      font-weight:bold;
    }
    .label-3-input input{
      width:130px;
    }
    .label-4-input input{
      width:110px;
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
      width:100px;
    }
    .button{
      display:flex;
      width:145px;
      justify-content: space-between;
    }
    .ant-btn{
      padding:0 15px;
    }
  }
  @media screen and (min-width: 1680px) {
    .form-row{
      width:90%;
    }
    .label-3-input,.label-4-input{
      display:flex;
      align-items:center;
    }
    .label-3-input label, .label-4-input label{
      margin-right:13px;
      font-weight:bold;
    }
    .label-3-input input{
      width:150px;
    }
    .label-4-input input{
      width:130px;
    }
    .label-4-select, .label-2-select{
      display:flex;
      align-items:center;
    }
    .label-4-select label, .label-2-select label{
      margin-right:13px;
      font-weight:bold;
    }
    .ant-select{
      width:110px;
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
      width:85%;
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
      width:170px;
    }
    .label-4-input input{
      width:140px;
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
      width:105px;
    }
    .button{
      display:flex;
      width:170px;
      justify-content: space-between;
    }
    .ant-btn{
      padding:0 20px;
    }
  }
</style>