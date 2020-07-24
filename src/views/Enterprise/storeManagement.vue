<template>
  <div class="subpage-layout">
    <div class="subpage-title">
      门店管理
    </div>
    <div class="subpage-content">
<!--        请在此处填充内容-->
      <div class="form-area" style="width:100%" >
        <div class="form-row" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
          <div class="label-3-input">
            <label>渠道名</label>
            <a-input v-model="form.Channelname"/>
          </div>
          <div class="label-3-input">
            <label>门店名</label>
            <a-input v-model="form.storeName"/>
          </div>
          <div class="label-3-input">
            <label>视光师</label>
            <a-input v-model="form.visionStaff"/>
          </div>
          <div class="label-3-input">
            <label>总店ID</label>
            <a-input v-model="form.headstoreID"/>
          </div>
          <div class="label-2-select">
            <label>状态</label>
            <a-select v-model="state" placeholder="全部" @change="stateHandleChange" :labelInValue="true">
              <a-select-option value="start">启用</a-select-option>
              <a-select-option value="stop">关闭</a-select-option>
            </a-select>
          </div>
          <div class="button">
            <a-button type="primary"  @click="search">搜索</a-button>
            <a-button style="background-color:#F5F5F5;border:none;color:#666666;" @click="resetInfo">重置</a-button>
          </div>
        </div>
        <div>
          <a-button style="padding: 0 13px;color:#1079FA;background-color:#E3F0FD;border:none;margin-right:20px;" @click="newStore"><img src="../../assets/store.png" style="margin-right:5px;vertical-align:bottom;" width='20px' height="20px"/>新建门店</a-button>
          <a-button style="padding: 0 13px;color:#1079FA;background-color:#E3F0FD;border:none;margin-right:20px;" @click="regVisionstaff"><img src="../../assets/addUser.png" style="margin-right:5px;vertical-align:bottom;" width='20px' height="20px"/>注册视光师</a-button>
          <a-button style="padding: 0 13px;color:#1079FA;background-color:#E3F0FD;border:none" @click="Export">导出</a-button>
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
          <template slot="action" slot-scope="text,record">
            <div style="display:flex;justify-content:space-around">
              <a-button style="padding:0 15px;background-color:#F5F5F5;color:#1079FA;border-color:#F5F5F5;"  @click="showModal(record,index)">查看</a-button>
              <a-button style="padding:0 15px;background-color:#F5F5F5;color:#1079FA;border-color:#F5F5F5;"  @click="visionStaff(record,index)">视光师</a-button>
              <a-button type="danger" style="padding:0 10px;" @click="stopButton(record.key)" :id="record.key" v-if="record.state=='启用'" >关闭</a-button>
              <a-button type="primary" style="padding:0 10px;" @click="startButton(record.key)" :id="record.key" v-if="record.state=='关闭'">启用</a-button>
            </div>
          </template>
          <template slot="renderStatus" slot-scope="text">
            <span v-if="text === '启用'" style="color:#8ACD2B">{{text}}</span>
            <span v-if="text === '关闭'" style="color:#F55943">{{text}}</span>
          </template>
          <template slot="renderName" slot-scope="text">
            <span v-if="text.length <= 7">{{text}}</span>
            <a-tooltip v-else>
              <template slot="title">
                {{text}}
              </template>
              {{text.slice(0,7)}}...
            </a-tooltip>
          </template>
          <template slot="renderAddress" slot-scope="text">
            <span v-if="text.length <= 23">{{text}}</span>
            <a-tooltip v-else>
              <template slot="title">
                {{text}}
              </template>
              {{text.slice(0,23)}}...
            </a-tooltip>
          </template>
        </a-table>
      </div>
<!-- 	  查看弹窗 -->
      <a-modal
        class="modal-430"
        title="查看门店信息"
        :visible="visible1"
        :confirm-loading="confirmLoading1"
        centered
        width="400px"
        @ok="handleOk1"
        @cancel="handleCancel1"
        cancelText="关闭"
        okText="完成"
        :maskStyle="{'background-color':'rgb(0,0,0,0.2)'}"
        :bodyStyle="{'overflow-y':'auto','padding-top':'30px','padding-bottom':'30px'}"
      >
        <div class="modal-body">
          <a-form-model :model="form2" style="width:360px" :labelCol="{span:7}" :wrapperCol="{span:17}">
            <a-form-model-item  label="渠道名称">
              <a-input style="width: 240px;" v-model="form2.Channelname"/>
            </a-form-model-item>
            <a-form-model-item  label="门店电话" >
              <a-input style="width: 240px;" v-model="form2.storeTel"/>
            </a-form-model-item>
            <a-form-model-item  label="门店名称">
              <a-input style="width: 240px;" v-model="form2.storeName"/>
            </a-form-model-item>
            <a-form-model-item  label="门店类型">
              <a-input style="width: 240px;" v-model="form2.storeType"/>
            </a-form-model-item>
            <a-form-model-item  label="门店联系人">
              <a-input style="width: 240px;" v-model="form2.storeLinkman"/>
            </a-form-model-item>
            <a-form-model-item  label="地址">
              <a-textarea style="width: 240px;" v-model="form2.address"/>
            </a-form-model-item>
            <a-form-model-item  label="剩余次数">
              <a-input style="width: 240px;" v-model="form2.restTime"/>
            </a-form-model-item>
            <a-form-model-item  label="状态">
              <a-input style="width: 240px;" v-model="form2.state"/>
            </a-form-model-item>
            <a-form-model-item  label="视光师">
              <a-input style="width: 240px;" v-model="form2.visionStaff"/>
            </a-form-model-item>
            <a-form-model-item  label="总店ID">
              <a-input style="width: 240px;" v-model="form2.headstoreID"/>
            </a-form-model-item>
          </a-form-model>
        </div>
      </a-modal>
<!-- 	新建门店弹窗 -->
      <a-modal
        class="modal-430"
        title="新建门店"
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
            <a-form-item  label="渠道名称">
              <a-select placeholder="全部"  @change="channelHandleChange"  :labelInValue="true"  v-model="newChannelname"  style="width: 240px">
                <a-select-option value="channel_1">优丫直营渠道</a-select-option>
                <a-select-option value="channel_2">丫丫直营渠道</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item  label="地址">
              <a-input  style="width: 240px;" placeholder="请输入地址" v-model="newAddress" />
            </a-form-item>
            <a-form-item  label="联系人名称">
              <a-input style="width: 240px;"  placeholder=" " v-model="newLinkmanName" />
            </a-form-item>
            <a-form-item  label="联系人电话">
              <a-input style="width: 240px;"  placeholder=" " v-model="newLinkmanTel" />
            </a-form-item>
            <a-form-item  label="联系人邮箱">
              <a-input style="width: 240px;"  placeholder=" " v-model="newLinkmanMail" />
            </a-form-item>
            <a-form-item  label="结算模式">
              <a-select placeholder="全部"  @change="patternHandleChange"  :labelInValue="true"  v-model="newPattern"  style="width: 240px;">
                <a-select-option value="secondCard">次卡</a-select-option>
                <a-select-option value="buyOut">买断</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item  label="单次训练价格">
              <a-input style="width: 240px;"  placeholder="XXXX元" v-model="newSingletrainPrice" />
            </a-form-item>
            <a-form-item  label="分成比例">
              <a-input style="width: 240px;"  placeholder=" " v-model="newProportion" />
            </a-form-item>
            <a-form-item  label="门店名称">
              <a-input style="width: 240px;"  placeholder=" " v-model="newStorename" />
            </a-form-item>
            <a-form-item  label="门店类型">
              <a-select placeholder="全部"  @change="storeTypeHandleChange"  :labelInValue="true"  v-model="newStoretype"  style="width: 240px;">
                <a-select-option value="store1">总店</a-select-option>
                <a-select-option value="store2">门店</a-select-option>
                <a-select-option value="store3">医院</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item  label="连锁店">
              <a-select placeholder="全部"  @change="chainstoreHandleChange"  :labelInValue="true"  v-model="newChainstore"  style="width: 240px;">
                <a-select-option value="yes">是</a-select-option>
                <a-select-option value="no">否</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item  label="总店ID">
              <a-input style="width: 240px;"  placeholder=" " v-model="newHeadstoreID" />
            </a-form-item>
            <a-form-item  label="开户银行">
              <a-input style="width: 240px;"  placeholder=" " v-model="newBank" />
            </a-form-item>
            <a-form-item  label="开户银行账号">
              <a-input style="width: 240px;"  placeholder=" " v-model="newBankNumber" />
            </a-form-item>
            <a-form-item  label="企业开户名称">
              <a-input style="width: 240px;"  placeholder=" " v-model="newEnterpriseName" />
            </a-form-item>
          </a-form-model>
        </div>
      </a-modal>
<!-- 	注册视光师弹窗 -->
      <a-modal  
        class="modal-430"
        title="注册视光师"
        :visible="visible3"
        :confirm-loading="confirmLoading3"
        centered
        @ok="handleOk3"
        @cancel="handleCancel3"
        cancelText="关闭"
        okText="提交"
        width="400px"
        :maskStyle="{'background-color':'rgb(0,0,0,0.2)'}"
        :bodyStyle="{'padding-top':'30px','padding-bottom':'90px'}"
      >
        <div class="modal-body">
          <a-form-model style="width:360px" :labelCol="{span:6}" :wrapperCol="{span:18}">
            <a-form-item  label="手机号">
              <a-input style="width: 240px;"  placeholder=" " v-model="newVisionTel"/>
            </a-form-item>
            <a-form-item  label="昵称">
              <a-input style="width: 240px;"  placeholder=" " v-model="newVisionName" />
            </a-form-item>
            <a-form-item  label="用户姓名">
              <a-input style="width: 240px;"  placeholder=" " v-model="newUserName"/>
            </a-form-item>
            <a-form-item  label="邮箱">
              <a-input style="width: 240px;"  placeholder=" " v-model="newVisionMail"/>
            </a-form-item>
          </a-form-model>
        </div>
      </a-modal>
<!-- 视光师弹窗 -->
      <a-modal
        title="视光师"
        :visible="visible4"
        :confirm-loading="confirmLoading4"
        centered
        @ok="handleOk4"
        @cancel="handleCancel4"
        cancelText="关闭"
        okText="提交"
        width="600px"
        :maskStyle="{'background-color':'rgb(0,0,0,0.2)'}"
      >
        <div class="modal-body">
          <div class="form-row" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
            <div>
              <label>姓名：</label>
              <a-input style="width: 120px;" v-model="form3.visionstaffName" />
            </div>

            <div >
              <a-button type="primary"  style="margin:0px 15px 0px 0;padding:0 13px;"  @click="search2">搜索</a-button>
              <a-button style="background-color:#F5F5F5;border:none;color:#666666;margin:0px 15px 0px 0;padding:0 13px;" @click="reset2">重置</a-button>
              <a-button style="background-color:#F5F5F5;border:none;color:#1079FA;padding:0 13px;"    @click="addVisionstaff">添加</a-button>
            </div>
          </div>

<!-- 表格2,视光师 -->
          <div class="table-area" style="width:100%;margin-top:30px">
           <a-table 
            style="width:100%;"
            :columns="columns_vision"
            :data-source="data2"
            :pagination="false"
            :scroll="{ y: 300 }"
            bordered>
             <template slot="customRender" slot-scope="text,record,index,column">
               <span v-if="searching && form[column.dataIndex].trim() !== ''">
                 <template v-for="(fragment, i) in text .toString() .split(new RegExp(`(${form[column.dataIndex].trim()})`, 'i'))" >
                   <mark v-if="fragment.toLowerCase() === form[column.dataIndex].trim().toLowerCase()" :key="i" class="highlight">{{ fragment }}</mark>
                   <template v-else>{{ fragment }}</template>
                 </template>
               </span>
               <template v-else>
                 {{ text }}
               </template>
             </template >
            <span slot="action" slot-scope="scope">
              <div style="color:#0F79F9;cursor:pointer;" @click.native.prevent="deleteRow(scope.$index, data2)">删除</div>
            </span>
            <!-- 用表格的footer来添加视光师 -->
            <template v-if="showFooter" slot="footer">
              <div style="width:450px;height:40px;display:flex;justify-content:space-between;align-items:center;">
                <a-form-item style="width:260px;margin:auto 0;" label="请输入手机号" :labelCol="{span:10}" :wrapperCol="{span:14}"><a-input style="width:120px"/></a-form-item>
                <div style="width:160px;display:flex;justify-content:space-around;margin:auto 0;">
                  <a-button type="primary" @click="submitAddVisionStaff">提交</a-button>
                  <a-button @click="cancelAddVisionStaff">取消</a-button>
                </div>
              </div>
            </template>
           </a-table>
          </div>
        </div>
      </a-modal>
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
      align:'center',
      width:65,
      fixed:'left',
    },
    {
      title: '渠道名称',
      dataIndex: 'Channelname',
      key: 'Channelname',
      align:'center',
      width:150,
      scopedSlots:{customRender:'renderName'},
      fixed:'left',
    },
    {
      title: '门店电话',
      key: 'storeTel',
      dataIndex: 'storeTel',
      align:'center',
      width:110,
    },
    {
      title: '门店名称',
      key: 'storeName',
      dataIndex: 'storeName',
      align:'center',
      width:150,
      scopedSlots:{customRender:'renderName'},
    },
    {
      title: '门店类型',
      key: 'storeType',
      dataIndex: 'storeType',
      align:'center',
      width:100,
    },
    {
      title: '门店联系人',
      key: 'storeLinkman',
      dataIndex: 'storeLinkman',
      align:'center',
      width:105
    },
    {
      title: '地址',
      key: 'address',
      dataIndex: 'address',
      align:'center',
      scopedSlots:{customRender:'renderAddress'},
      width:195,
    },
    {
      title: '剩余次数',
      key: 'restTime',
      dataIndex: 'restTime',
      align:'center',
      width:100,
    },
    {
      title: '状态',
      key: 'state',
      dataIndex: 'state',
      align:'center',
      scopedSlots:{customRender:'renderStatus'},
      width:80,
    },
    {
      title: '视光师',
      key: 'visionStaff',
      dataIndex: 'visionStaff',
      align:'center',
      width:100,
    },
    {
      title: '总店ID',
      key: 'headstoreID',
      dataIndex: 'headstoreID',
      align:'center',
      width:120,
    },
    {
      title: '创建时间',
      key: 'createTime',
      dataIndex: 'createTime',
      align:'center',
      width:160
    },
    {
      title: '操作',
      key: 'action',
      scopedSlots: { customRender: 'action' },
      align:'center',
      width:260,
      fixed:'right'
    }
  ];
  const time = new Date();
  let formatTime = function(time){
    let year = time.getFullYear();
    let month = time.getMonth();
    month = month < 10 ? `0${month}` : month;
    let date = time.getDate();
    date = date < 10 ? `0${date}` : date;
    let hour = time.getHours();
    let min = time.getMinutes();
    let sec = time.getSeconds();
    return `${year}/${month}/${date} ${hour}:${min}:${sec}`;
  }
  const data = [
    {
      key:1,
      Channelname:'优丫直营渠道优丫直营渠道优丫直营渠道',
      storeTel:'18444668899',
      storeName:'四川华西眼科优丫直营渠道优丫直营渠道',
      storeType:'门店',
      storeLinkman:"岳云鹏",
      address:'四川成都四川成都四川成都四川成都四川成都四川成都四川成都',
      restTime:"不限次",
      state:'关闭',
      visionStaff:"王五",
      visionstaffTel:'1213216',
      headstoreID:"zd20200715",
      createTime:formatTime(time),
    },
    {
      key:2,
      Channelname:'优丫直营渠道',
      storeTel:'18444668899',
      storeName:'四川华西眼科1',
      storeType:'门店',
      storeLinkman:"岳云鹏1",
      address:'四川成都',
      restTime:"不限次",
      state:'启用',
      visionStaff:"王五",
      visionstaffTel:'1213216',
      headstoreID:"5",
      createTime:formatTime(time),
    },
    {
      key:3,
      Channelname:'丫丫直营渠道',
      storeTel:'18444668899',
      storeName:'四川华西眼科2',
      storeType:'门店',
      storeLinkman:"岳云鹏2",
      address:'四川成都',
      restTime:"不限次",
      state:'启用',
      visionStaff:"张三",
      visionstaffTel:'1231513216',
      headstoreID:"8",
      createTime:formatTime(time),
    },
    {
      key:4,
      Channelname:'优丫直营渠道',
      storeTel:'18444668899',
      storeName:'四川华西眼科3',
      storeType:'门店',
      storeLinkman:"岳云鹏3",
      address:'四川成都',
      restTime:"不限次",
      state:'启用',
      visionStaff:"赵四",
      visionstaffTel:'12315116',
      headstoreID:"16",
      createTime:formatTime(time),
    },
    {
      key:5,
      Channelname:'丫丫直营渠道',
      storeTel:'18444668899',
      storeName:'四川华西眼科',
      storeType:'门店',
      storeLinkman:"赵四",
      address:'四川成都',
      restTime:"不限次",
      state:'启用',
      visionStaff:"张三",
      visionstaffTel:'1231513216',
      headstoreID:"12",
      createTime:formatTime(time),
    },
    {
      key:6,
      Channelname:'三丫直营渠道',
      storeTel:'18444668899',
      storeName:'四川华西眼科',
      storeType:'门店',
      storeLinkman:"张三",
      address:'四川成都',
      restTime:"不限次",
      state:'启用',
      visionStaff:"张三",
      visionstaffTel:'1231513216',
      headstoreID:"11",
      createTime:formatTime(time),
    },
    {
      key:7,
      Channelname:'二丫直营渠道',
      storeTel:'18444668899',
      storeName:'四川华西眼科',
      storeType:'门店',
      storeLinkman:"岳云鹏",
      address:'四川成都',
      restTime:"不限次",
      state:'启用',
      visionStaff:"赵四",
      visionstaffTel:'12315116',
      headstoreID:"100",
      createTime:formatTime(time),
    },
    {
      key:8,
      Channelname:'优丫直营渠道',
      storeTel:'18444668899',
      storeName:'四川华西眼科',
      storeType:'门店',
      storeLinkman:"岳云鹏",
      address:'四川成都',
      restTime:"不限次",
      state:'启用',
      visionStaff:'张三',
      visionstaffTel:'1231513216',
      headstoreID:"100",
      createTime:formatTime(time),
    },
    {
      key:9,
      Channelname:'优丫直营渠道',
      storeTel:'18444668899',
      storeName:'四川华西眼科',
      storeType:'门店',
      storeLinkman:"岳云鹏",
      address:'四川成都',
      restTime:"不限次",
      state:'启用',
      visionStaff:'张东',
      visionstaffTel:'121321607970',
      headstoreID:"100",
      createTime:formatTime(time),
    },
    {
      key:10,
      Channelname:'优丫直营渠道',
      storeTel:'18444668899',
      storeName:'四川华西眼科',
      storeType:'门店',
      storeLinkman:"岳云鹏",
      address:'四川成都',
      restTime:"不限次",
      state:'启用',
      visionStaff:"张八",
      visionstaffTel:'1213212136',
      headstoreID:"100",
      createTime:formatTime(time),
    },
    {
      key:11,
      Channelname:'优丫直营渠道',
      storeTel:'18444668899',
      storeName:'四川华西眼科',
      storeType:'门店',
      storeLinkman:"岳云鹏",
      address:'四川成都',
      restTime:"不限次",
      state:'关闭',
      visionStaff:"张九",
      visionstaffTel:'12132164586906',
      headstoreID:"100",
      createTime:formatTime(time),
    },
  ];
  const columns_vision = [
    {
      title: '视光师姓名',
      dataIndex: 'visionstaffName',
      key: 'visionstaffName',
      align:'center'
    },
    {
      title: '手机号',
      dataIndex: 'visionstaffTel',
      key: 'visionstaffTel',
      align:'center'
    },
    {
      title: '加入时间',
      key: 'joinTime',
      dataIndex: 'joinTime',
      align:'center'
    },
    {
      title: '状态',
      key: 'state',
      dataIndex: 'state',
      align:'center'
    },
    {
      title: '操作',
      key: 'action',
      scopedSlots: { customRender: 'action' },
      align:'center'
    }
  ];
const data_vision = [
   {
      visionstaffName:'张三',
      userName:'张三',
      visionstaffTel:'1231513216',
      joinTime:formatTime(time),
      state:"已绑定",
    },
   {  
      visionstaffName:'赵四',
      userName:'Lisi',
      visionstaffTel:'12315116',
      joinTime:formatTime(time),
      state:"已绑定",
    },
   {  
      visionstaffName:'王五',
      userName:'wangwu',
      visionstaffTel:'1213216',
      joinTime:formatTime(time),
      state:"已绑定",
    },
   {  
      visionstaffName:'赵六',
      userName:'zhaoliu',
      visionstaffTel:'121327686716',
      joinTime:formatTime(time),
      state:"已绑定",
    },
   {  
      visionstaffName:'张八',
      userName:'zhangba',
      visionstaffTel:'1213212136',
      joinTime:formatTime(time),
      state:"已绑定",
    },
   {  
      visionstaffName:'张九',
      userName:'zhangjiu',
      visionstaffTel:'12132164586906',
      joinTime:formatTime(time),
      state:"已绑定",
    },
   {  
      visionstaffName:'张东',
      userName:'zhangdong',
      visionstaffTel:'121321607970',
      joinTime:formatTime(time),
      state:"已绑定",
    },
  ];
  const data2 = [
	
  ];
  const data3 = [
	
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
        form:{
          Channelname:'',
          storeName:'',
          visionStaff:'',
          headstoreID:'',
          },
        form2:{
          Channelname:'',
          storeTel:'',
          storeName:'',
          storeType:'',
          storeLinkman:'',
          address:'',
          restTime:'',
          state: '',
          visionStaff:'',
          headstoreID:'',
          },
        form3:{
          visionstaffName:'',
                },
            data,
        data2,
        data3,
        data_vision,
            columns,
        columns_vision,
            searching:false,
            pageSize:10,
            pagination:{pageSize:10},
            visible1: false,
            visible2: false,
            visible3: false,
            visible4: false,
            confirmLoading1: false,
            confirmLoading2: false,
            confirmLoading3: false,
            confirmLoading4: false,
            state:undefined,
        Channelname:undefined,
        pattern:undefined,
        chainstore:undefined,
        storeType:undefined,
        stateLabel:'',
        channelLabel:'',
        storeTypeLabel:'',
        patternLabel:'',
        chainstoreLabel:'',
        label:undefined,
        newChannelname:'',
        newAddress:'',
        newLinkmanName:'',
        newLinkmanTel:'',
        newLinkmanMail:'',
        newPattern:undefined,
        newSingletrainPrice:'',
        newProportion:'',
        //newStoretel:null,
        newStorename:'',
        newStoretype:undefined,
        //newStorelinkman:'',
        newChainstore:undefined,
        //newResttime:'',
        newState:undefined,
        //newVisionstaff:'',
        newHeadstoreID:null,
        newBank:'',
        newBankNumber:'',
        newEnterpriseName:'',
        newVisionTel:null,
        newVisionName:'',
        newUserName:'',
        newVisionMail:'',
        Key:null,
        Time:undefined,
        showFooter:false,//显示添加视光师的表格Footer
      };
    },
    created() {
    },
    computed: {

    },
    methods:{	
      stateHandleChange(value) {
        this.stateLabel=value.label.trim();
        this.state=value;
      },
      channelHandleChange(value){
        this.channelLabel = value.label;
        this.Channelname = value;
      },
      patternHandleChange(value){
        this.patternLabel = value.label.trim();
		this.pattern = value;
      },
      
      storeTypeHandleChange(value){
        this.storeTypeLabel = value.label.trim();
		this.storeType = value.label.trim();
      },

      chainstoreHandleChange(value){
        this.chainstoreLabel = value.label.trim();
      },
      // handleChange(value) {
      //   this.Label=value.label;
      // },
      //点击搜索
      search:function(){
        this.searching = true;
       let search_data = data;
        let target1 = this.form['Channelname'].trim();
        let target2 = this.form['storeName'].trim();
        let target3 = this.form['visionStaff'].trim();
        let target4 = this.form['headstoreID'].trim();
        let targetLabel=this.stateLabel;
        if( target1 !== ''){
          search_data = search_data.filter(value => {
            return value['Channelname'].indexOf(target1) > -1;
          })
        }
        if( target2 !== ''){
          search_data = search_data.filter(value => {
            return value['storeName'].indexOf(target2) > -1;
          })
        }
        if( target3 !== ''){
          search_data = search_data.filter(value => {
            return value['visionStaff'].indexOf(target3) > -1;
          })
        }
        if( target4 !== ''){
          search_data = search_data.filter(value => {
            return value['headstoreID'].indexOf(target4) > -1;
          })
        }

        if(targetLabel!=undefined){
          search_data = search_data.filter(value => {
            return value['state'].indexOf(targetLabel) > -1;
          })
        }
      this.data = search_data;
      },
// 视光师弹窗搜索功能
     search2:function(){
      this.searching = true;
      let search_data = data_vision;
      let target = this.form3['visionstaffName'].trim();
      //console.log(target)
        if( target !== ''){
          search_data = search_data.filter(value => {
            return value['visionstaffName'].indexOf(target) > -1;
          })
      }
      this.data2 = data2.concat(search_data);
      //this.data2.push(search_data);
	//console.log(search_data);
/* 		this.searching = true;
		let search_data = data_vision;
		let target = this.form['visionstaffName'];
        if( target !== ''){
          search_data = search_data.filter(value => {
            return value['visionstaffName'].indexOf(target) > -1;
          })
        }
        this.data2 = search_data; */
        // let Num = data_vision.length + 1;	
        //let item={
		// number:Num,
		//visionstaffName:search_data.visionStaff,
		//visionstaffTel:search_data.visionstaffTel,
		//joinTime:formatTime(time),
		//state:'未绑定',
      //}
        //this.data2.push(item);
      },

      //改变表格每页显示数据条数
    //视光师弹窗添加
      addVisionstaff(){
        this.showFooter = true;
      },
      //提交添加视光师，里面内容还需补充
      submitAddVisionStaff(){
        this.showFooter = false;
      },
      cancelAddVisionStaff(){
        this.showFooter = false;
      },
//删除视光师
/*      delete_vision(index) {
        this.data2.splice(index, 1);
      }, */
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      //点击重置
      reset(){
        this.searching = false;
        this.data = data;
        this.form = {
          Channelname:'',
          storeName:'',
          visionStaff:'',
          headstoreID:'',
        };
        this.state=undefined;
      },
//视光师弹窗重置
      reset2(){
        this.searching = false;
        this.data2 = data2;
        this.form3 = {
          visionstaffName:'',
        };
      },
      //查看
      showModal(record,index) {
        this.visible1 = true;
		this.Key=record.key;
        this.form2.Channelname=record.Channelname;
        this.form2.storeTel=record.storeTel;
        this.form2.storeName=record.storeName;
        this.form2.storeType=record.storeType;
        this.form2.storeLinkman=record.storeLinkman;
        this.form2.address=record.address;
        this.form2.restTime=record.restTime;
        this.form2.state=record.state;
        this.form2.visionStaff=record.visionStaff;
        this.form2.headstoreID=record.headstoreID;
		this.Time=record.createTime;
        this.index=index;
      },
      newStore() {
        this.visible2 = true;
		this.newChannelname=undefined;
		this.newAddress='';
		this.newLinkmanName='';
		this.newLinkmanTel='';
		this.newLinkmanMail='';
		this.newPattern=undefined;
		this.newSingletrainPrice='';
		this.newProportion='';
		this.newStorename='';
		this.newStoretype=undefined;
		this.newChainstore=undefined;
		this.newHeadstoreID='';
		this.newState=undefined;
		this.newBank='';
		this.newBankNumber='';
		this.newEnterpriseName='';
      },
      regVisionstaff() {
        this.visible3 = true;
      },
      visionStaff(record,index) {
		this.visible4 = true;
		let item={
			visionstaffName:record.visionStaff,
			visionstaffTel:record.visionstaffTel,
			joinTime:formatTime(time),
			state:'已绑定',
		};
		this.index=index;
        this.data2.splice(0,1,item);
      },


/*      visionStaffDelete:function(){
        this.data2.splice(0,1);
      }, */

     //查看对话框提交
      handleOk1() {
		let item1={
          key:this.Key,
          Channelname:this.form2.Channelname,
          storeTel:this.form2.storeTel,
          storeName:this.form2.storeName,
          storeType:this.form2.storeType,
          storeLinkman:this.form2.storeLinkman,
          address:this.form2.address,
          restTime:this.form2.restTime,
          state:this.form2.state,
          visionStaff:this.form2.visionStaff,
          headstoreID:this.form2.headstoreID,
          createTime:this.Time,
          number:this.Key,
        };
        this.data.splice(this.Key-1,1,item1);
        this.confirmLoading1 = true;
        setTimeout(() => {
          this.visible1 = false;
          this.confirmLoading1 = false;
        }, 2000);
      },
	//新建门店提交
      handleOk2() {
		let item={
          key:this.data[this.data.length-1].key+1,
          Channelname:this.channelLabel,
          storeTel:this.newStoretel,
          storeName:this.newStorename,
          storeType:this.storeType,
          storeLinkman:this.newLinkmanName,
          address:this.newAddress,
          restTime:122,
          state:"启用",
          visionStaff:'',
          headstoreID:this.newHeadstoreID,
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
      },
	//注册视光师提交
      handleOk3() {
		// let item={
  //         visionStaffName:this.newVisionName,
  //         userName:this.newUserName,
  //         visionstaffTel:this.newVisionTel,
  //         joinTime:formatTime(time),
  //         state:'已绑定',
  //       };
  //       this.data_vision.push(item);
        this.confirmLoading3 = true;
        setTimeout(() => {
          this.visible3 = false;
          this.confirmLoading3 = false;
        }, 2000);
      },
	//视光师弹窗提交
      handleOk4() {
        this.confirmLoading4 = true;
        setTimeout(() => {
          this.visible4 = false;
          this.confirmLoading4 = false;
        }, 2000);
        this.showFooter = false;
      },
      //对话框点击取消按钮
      handleCancel1() {
        this.visible1 = false;
      },
      handleCancel2() {
        this.visible2 = false;
      },
      handleCancel3() {
        this.visible3 = false;
      },
      handleCancel4() {
        this.visible4 = false;
        this.showFooter = false;
      },
//停用启用按钮
      stopButton(key){
        const data = [...this.data];
        const check = data.filter(item => item.key== key);
        let obj=document.getElementById(key);
          check[0].state='关闭';
          obj.innerHTML='启用';
      },
      startButton(key){
        const data = [...this.data];
        const check = data.filter(item => item.key== key);
        let obj=document.getElementById(key);
        check[0].state='启用';
        obj.innerHTML='关闭';
      },
    //导出,
    //导出功能先关闭
      Export(){
      //   let exportedData = [];
      //   exportedData.push(['门店信息（全部）',null,null,null,null]);
      //   exportedData.push(['渠道名称','门店电话','门店名称','门店类型','门店联系人','地址','剩余次数','状态','视光师','总店ID','创建时间']);
      // //获得当前表格中的数据
      //   for(let i = 0; i < this.data.length; i++){
      //     let temp = this.data[i];
      //     temp = [temp.Channelname, temp.storeTel, temp.storeName, temp.storeType, temp.storeLinkman,temp.address,temp.restTime,temp.state,temp.visionStaff,temp.headstoreID,temp.createTime];
      //     exportedData.push(temp);
      //   }
      // //创建工作表
      //   const workSheet = XLSX.utils.aoa_to_sheet(exportedData);
      // //合并单元格
      //   workSheet['!merges'] = [{s:{r:0, c:0}, e:{r:0, c:4}}]
      // //创建工作簿
      //   const workBook = XLSX.utils.book_new();
      // //向工作簿中添加工作表
      //   XLSX.utils.book_append_sheet(workBook, workSheet);
      // //输出工作簿
      //   XLSX.writeFile(workBook, '门店信息.xlsx',{bookType: 'xlsx'});
      }
    },
  };
</script>
<style scoped>
.form-row{
  padding-top:5px;
  padding-right:5px;
}
  .highlight {
    background-color: rgb(253, 245, 1);
    padding: 0px;
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
    width:130px;
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
    width:110px;
  }
  .label-4-input input{
    width:90px;
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
    width:75px;
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
  .label-3-input,.label-4-input{
    display:flex;
    align-items:center;
  }
  .label-3-input label, .label-4-input label{
    margin-right:12px;
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
    margin-right:12px;
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
    width:140px;
  }
  .label-4-input input{
    width:120px;
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
    width:90%;
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