<template>
  <div class="subpage-layout">
    <div class="subpage-title">
      设备管理
    </div>
    <div class="subpage-content">
      <!-- 以下是表单部分 -->
      <div class="form-area" style="width:100%" >
        <div class="form-row" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
          <div class="label-3-input">
            <label>渠道名</label>
            <a-input v-model="channel"/>
          </div>
          <div class="label-3-input">
            <label>门店名</label>
            <a-input v-model="distributeShop"/>
          </div>
          <div class="label-4-input">
            <label>设备编号</label>
            <a-input v-model="deviceNumber"/>
          </div>
          <div class="label-4-select">
            <label>设备类型</label>
              <a-select v-model="deviceType">
                  <a-select-option value="打印机">
                      打印机
                  </a-select-option>
                  <a-select-option value="一代训练">
                      一代训练
                  </a-select-option>
                  <a-select-option value="二代训练">
                      二代训练
                  </a-select-option>
                  <a-select-option value="一代检查">
                      一代检查
                  </a-select-option>
                  <a-select-option value="二代检查">
                      二代检查
                  </a-select-option>
              </a-select>
          </div>
          <div class="label-2-select">
            <label>用途</label>
              <a-select v-model="used" placeholder="please select your zone">
                  <a-select-option value="商用">
                      商用
                  </a-select-option>
                  <a-select-option value="测试">
                      测试
                  </a-select-option>
              </a-select>
          </div>
          <div class="label-2-select">
            <label>状态</label>
              <a-select v-model="state" placeholder="please select your zone">
                  <a-select-option value="启用">
                      启用
                  </a-select-option>
                  <a-select-option value="停用">
                      停用
                  </a-select-option>
              </a-select>
          </div>
          <div class="button">
            <a-button type="primary" @click="searchInfo">搜索</a-button>
            <a-button style="background-color:#F5F5F5;border:none;color:#666666;" @click="resetInfo">重置</a-button>
          </div>
        </div>
      </div>
      <div style="margin-bottom: 15px;">
        <a-button style="padding: 0 13px;color:#1079FA;background-color:#E3F0FD;border:none"
                  @click="() => setModalNewVisible(true,false)">
            <img src="../../assets/device.png" style="margin-right:5px;vertical-align:bottom;" width='20px' height="20px"/>新建设备
        </a-button>
      </div>
        <a-table :columns="columns" :data-source="data"
                 :pagination="pagination"
                 :scroll="{ x: 1000 }"
                 bordered>
            <template slot="customRender" slot-scope="text,record,index,column">
                <span v-if="searchFlag && form[column.dataIndex].trim() !== ''">
                    <template
                            v-for="(fragment, i) in text
                      .toString()
                      .split(new RegExp(`(${form[column.dataIndex].trim()})`, 'i'))">
                        <mark v-if="fragment.toLowerCase() === form[column.dataIndex].trim().toLowerCase()"
                              :key="i"
                              class="highlight">{{ fragment }}</mark>
                        <template v-else>{{ fragment }}</template>
                    </template>
                </span>
                <template v-else>
                    {{ text }}
                </template>
            </template>
            <template slot="renderBlueTeethID" slot-scope="text">
                <span v-if="text.length <= 15">{{text}}</span>
                <a-tooltip v-else>
                <template slot="title">
                    {{text}}
                </template>
                {{text.slice(0,15)}}...
                </a-tooltip>
            </template>
            <template slot="renderTwoLine" slot-scope="text">
                    <span v-if="text.length <= 11">{{text}}</span>
                    <a-tooltip v-else>
                    <template slot="title">
                        {{text}}
                    </template>
                    {{text.slice(0,11)}}...
                    </a-tooltip>
            </template>
            <template slot="renderStatus" slot-scope="text">
              <span v-if="text === '启用'" style="color:#8ACD2B">{{text}}</span>
              <span v-if="text === '停用'" style="color:#F55943">{{text}}</span>
            </template>
            <template slot="action" slot-scope="text,record,index">
                <div style="display:flex;justify-content:center">
                    <a-button style="margin:0 5px;color:#1079FA;padding: 0 15px;background-color:#E3F0FD;border:none;"
                          @click="setModal1Visible(true,false,record)">分配</a-button>
                
                    <a-button style="margin:0 5px;color:#1079FA;padding: 0 15px;background-color:#F5F5F5;border:none"
                            @click="setModal2Visible(true,false,record)">查看</a-button>
                    
                    <a-button v-if="!record.isBingding" :id="`button${index}`"
                            style="margin:0 5px;font-size:13px;color:#FFFFFF;padding: 0 6px;background-color:#1079FA;border:none;"
                            @click="setModal3Visible(true,index,'binding')">打印绑定</a-button>
                    <a-button v-if="record.isBingding" :id="`button${index}`"
                      style="margin:0 5px;font-size:13px;border:none;color:#F55943;padding: 0 6px;background-color:#FFDADA;"
                      @click="setModal3Visible(false,index,'release')">打印解绑</a-button>
                </div>
            </template>
        </a-table>
        <a-modal class="modal-430" title="新建设备"
                  :visible="modalNewVisible"
                  width="400px"
                  centered
                  @ok="() => setModalNewVisible(false,true)"
                  @cancel="() => setModalNewVisible(false,false)"
                  cancelText="关闭"
                  okText="提交"
                  :maskStyle="{'background-color':'rgba(0,0,0,0.2)'}">
            <div class="modal-body">
                <a-form-model
                        style="width:360px;"
                        :model="buildDevice"
                        :label-col="labelCol" :wrapper-col="wrapperCol"
                        >
                    <a-form-model-item label="设备编号">
                        <a-input v-model="buildDevice.number2"
                                  style="width: 240px"
                                  placeholder="设备编号" disabled/>
                    </a-form-model-item>
                    <a-form-model-item label="设备名称">
                        <a-input v-model="buildDevice.name1"
                                  style="width: 240px"
                                  placeholder="请输入设备名称"/>
                    </a-form-model-item>
                    <a-form-model-item label="设备类型" prop="deviceType1">
                        <a-select v-model="buildDevice.deviceType1"
                                  style="width: 240px"
                                  defaultValue="打印机">
                            <a-select-option value="打印机">
                                打印机
                            </a-select-option>
                            <a-select-option value="一代训练">
                                一代训练
                            </a-select-option>
                            <a-select-option value="二代训练">
                                二代训练
                            </a-select-option>
                            <a-select-option value="一代检查">
                                一代检查
                            </a-select-option>
                            <a-select-option value="二代检查">
                                二代检查
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="硬件版本">
                        <a-input v-model="buildDevice.deviceVersion"
                                  style="width: 240px"/>
                    </a-form-model-item>
                    <a-form-model-item label="蓝牙标识">
                        <a-input v-model="buildDevice.blueTeethID1"
                                  style="width: 240px"/>
                    </a-form-model-item>
                    <a-form-model-item label="状态" prop="state1">
                        <a-select v-model="buildDevice.state1"
                                  style="width: 240px"
                                  defaultValue="启用">
                            <a-select-option value="启用">
                                启用
                            </a-select-option>
                            <a-select-option value="停用">
                                停用
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                </a-form-model>
            </div>
        </a-modal>
        <a-modal class="modal-430" title="分配设备"
                    width="400px"
                    :visible="modal1Visible"
                    centered
                    @ok="() => setModal1Visible(false,true)"
                    @cancel="() => setModal1Visible(false,false)"
                    cancelText="关闭"
                    okText="提交"
                    :maskStyle="{'background-color':'rgba(0,0,0,0.2)'}">
            <div class="modal-body">
                <a-form-model
                      style="width:360px;"
                      :model="distributeDevice"
                      :label-col="labelCol" :wrapper-col="wrapperCol">
                  <a-form-model-item label="设备名称">
                      <a-input v-model="distributeDevice.name" style="width: 240px" disabled/>
                  </a-form-model-item>
                  <a-form-model-item label="设备编号">
                      <a-input v-model="distributeDevice.number1" style="width: 240px"
                                  disabled/>
                  </a-form-model-item>
                  <a-form-model-item label="分配渠道" prop="Dchannel">
                      <a-select v-model="distributeDevice.Dchannel"
                                  style="width: 240px"
                                  placeholder="请输入设备编号">
                          <a-select-option value="shanghai">
                              Zone one
                          </a-select-option>
                          <a-select-option value="beijing">
                              Zone two
                          </a-select-option>
                      </a-select>
                  </a-form-model-item>
                  <a-form-model-item label="分配门店" prop="Dshop">
                      <a-select v-model="distributeDevice.Dshop"
                                  style="width: 240px"
                                  placeholder="请输入设备编号">
                          <a-select-option value="shanghai">
                              Zone one
                          </a-select-option>
                          <a-select-option value="beijing">
                              Zone two
                          </a-select-option>
                      </a-select>
                  </a-form-model-item>
                  <a-form-model-item label="设备用途" prop="Dused">
                      <a-select v-model="distributeDevice.Dused"
                                  style="width: 240px"
                                  placeholder="klklkl">
                          <a-select-option value="shanghai">
                              Zone one
                          </a-select-option>
                          <a-select-option value="beijing">
                              Zone two
                          </a-select-option>
                      </a-select>
                  </a-form-model-item>
                  <a-form-model-item label="启用时间">
                      <a-date-picker v-model="distributeDevice.Stime" placeholder="" style="width: 240px"/>
                  </a-form-model-item>
                </a-form-model>
            </div>
        </a-modal>
        <a-modal class="modal-430" title="设备信息查看"
                    :visible="modal2Visible"
                    centered
                    width="400px"
                    @ok="() => setModal2Visible(false,true)"
                    @cancel="() => setModal2Visible(false,false)"
                    cancelText="关闭"
                    okText="提交"
                    :maskStyle="{'background-color':'rgba(0,0,0,0.2)'}">
            <div class="modal-body">
              <a-form-model
                      style="width:360px;"
                      :model="look"
                      :label-col="labelCol" :wrapper-col="wrapperCol">
                  <a-form-model-item label="设备编号">
                      <a-input v-model="look.deviceNumber" style="width: 240px" disabled/>
                  </a-form-model-item>
                  <a-form-model-item label="设备名称">
                      <a-input v-model="look.deviceName" style="width: 240px"/>
                  </a-form-model-item>
                  <a-form-model-item label="设备类型">
                       <a-select v-model="look.deviceType"
                                  style="width: 240px"
                                  defaultValue="打印机">
                            <a-select-option value="打印机">
                                打印机
                            </a-select-option>
                            <a-select-option value="一代训练">
                                一代训练
                            </a-select-option>
                            <a-select-option value="二代训练">
                                二代训练
                            </a-select-option>
                            <a-select-option value="一代检查">
                                一代检查
                            </a-select-option>
                            <a-select-option value="二代检查">
                                二代检查
                            </a-select-option>
                        </a-select>
                  </a-form-model-item>
                  <a-form-model-item label="硬件版本">
                      <a-input v-model="look.version" style="width: 240px"/>
                  </a-form-model-item>
                  <a-form-model-item label="蓝牙标志">
                      <a-input v-model="look.blueTeethID" style="width: 240px"/>
                  </a-form-model-item>
                  <a-form-model-item label="状态">
                    <a-select v-model="look.state"
                                style="width: 240px"
                                defaultValue="启用">
                          <a-select-option value="启用">
                              启用
                          </a-select-option>
                          <a-select-option value="停用">
                              停用
                          </a-select-option>
                      </a-select>
                  </a-form-model-item>
                  <a-form-model-item label="分配渠道">
                      <a-select v-model="look.channel"
                                style="width: 240px"
                                defaultValue="渠道1">
                          <a-select-option value="渠道1">
                              渠道1
                          </a-select-option>
                          <a-select-option value="渠道2">
                              渠道2
                          </a-select-option>
                      </a-select>
                  </a-form-model-item>
                  <a-form-model-item label="分配门店">
                      <a-select v-model="look.store"
                                style="width: 240px"
                                defaultValue="门店1">
                          <a-select-option value="门店1">
                              门店1
                          </a-select-option>
                          <a-select-option value="门店2">
                              门店2
                          </a-select-option>
                      </a-select>
                  </a-form-model-item>
                  <a-form-model-item label="设备用途">
                      <a-select v-model="look.use"
                                style="width: 240px"
                                defaultValue="用途1">
                          <a-select-option value="用途1">
                              用途1
                          </a-select-option>
                          <a-select-option value="用途2">
                              用途2
                          </a-select-option>
                      </a-select>
                  </a-form-model-item>
                   <a-form-model-item label="启用时间">
                      <a-date-picker v-model="look.Stime" placeholder="" style="width: 240px"/>
                  </a-form-model-item>
              </a-form-model>
            </div>
        </a-modal>
        <a-modal class="modal-150" title="打印设备"
                    :visible="modal3Visible"
                    centered
                    width="400px"
                    @ok="() => setModal3Visible(false,-1,true)"
                    @cancel="() => setModal3Visible(false,-1,false)"
                    cancelText="关闭"
                    okText="提交"
                    :maskStyle="{'background-color':'rgba(0,0,0,0.2)'}">
            <div class="modal-body">
                <a-form-model :label-col="labelCol"
                                :wrapper-col="wrapperCol">
                    <a-form-model-item label="打印绑定" prop="Dused">
                        <a-select v-model="distributeDevice.Dused"
                                    style="width: 240px"
                                    placeholder="klklkl">
                            <a-select-option value="shanghai">
                                Zone one
                            </a-select-option>
                            <a-select-option value="beijing">
                                Zone two
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                </a-form-model>
            </div>
        </a-modal>
    </div>
  </div>
</template>

<script>
    // import ARow from "ant-design-vue/es/grid/Row";
    // import ACol from "ant-design-vue/es/grid/Col";
    import AFormModelItem from "ant-design-vue/es/form-model/FormItem";

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
            title: '设备编号',
            className: 'column-money',
            dataIndex: 'deviceNumber',
            width:100,
            scopedSlots:{
                customRender:'customRender'
            },
            align:'center',
            fixed:'left',
        },
        {
            title: '设备名',
            dataIndex: 'deviceName',
            key: 'deviceName',
            align:'center',
            width:90,
        },
        {
            title: '设备类型',
            key: 'deviceType',
            dataIndex: 'deviceType',
            align:'center',
            width:100,
            scopedSlots:{
                customRender:'customRender'
            },
        },
        {
            title: '硬件版本',
            key: 'version',
            dataIndex: 'version',
            align:'center',
            width:90,
        },
        {
            title: '蓝牙标识',
            key: 'blueTeethID',
            dataIndex: 'blueTeethID',
            align:'center',
            ellipsis:true,
            width:130,
            scopedSlots:{
                customRender:'renderBlueTeethID'
            }
        },
        {
            title: '状态',
            key: 'state',
            dataIndex: 'state',
            align:'center',
            scopedSlots:{
                customRender:'renderStatus'
            },
            width:85,
        },
        {
            title: '分配渠道',
            key: 'channel',
            dataIndex: 'channel',
            align:'center',
            scopedSlots:{
                // customRender:'customRender'
                customRender:'renderTwoLine'
            },
            width:200,
        },
        {
            title: '分配门店',
            key: 'distributeShop',
            dataIndex: 'distributeShop',
            align:'center',
            scopedSlots:{
                // customRender:'customRender',
                customRender:'renderTwoLine'
            },
            width:182,
        },
        {
            title: '用途',
            key: 'used',
            dataIndex: 'used',
            align:'center',
            scopedSlots:{
                customRender:'customRender'
            },
            width:85,
        },
        {
            title: '打印设备编号',
            key: 'printNumber',
            dataIndex: 'printNumber',
            align:'center',
            width:120,
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
            width:260,
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
            key:1,
            deviceNumber:1050618,
            deviceName:'Adam',
            deviceType:'打印机',
            version:12,
            blueTeethID:'7E-9A-0C-8A-1Q',
            state:'启用',
            channel:'优丫优自有机构优丫优自有机构优丫优自有机构',
            distributeShop:'优眼优',
            used:'商用',
            printNumber:100,
            createTime:formatTime(time),
            isBingding:true,
        },
        {
            key:2,
            deviceNumber:1050618,
            deviceName:'xixi',
            deviceType:'打印机',
            version:12,
            blueTeethID:'7E-9A-0C-8A-1Q',
            state:'启用',
            channel:'优丫优自有机构',
            distributeShop:'优眼优',
            used:'商用',
            printNumber:100,
            createTime:formatTime(time),
            isBingding:true,
        },
        {
            key:3,
            deviceNumber:1050618,
            deviceName:'huahua',
            deviceType:'一代训练',
            version:12,
            blueTeethID:'7E-9A-0C-8A-1Q',
            state:'停用',
            channel:'优丫优自有机构',
            distributeShop:'优眼优',
            used:'测试',
            printNumber:100,
            createTime:formatTime(time),
            isBingding:false,
        },
        {
            key:4,
            deviceNumber:1050618,
            deviceName:'pander',
            deviceType:'二代训练',
            version:12,
            blueTeethID:'7E-9A-0C-8A-1Q',
            state:'停用',
            channel:'优丫优他有机构',
            distributeShop:'优眼优',
            used:'测试',
            printNumber:100,
            createTime:formatTime(time),
            isBingding:false,
        },
        {
            key:5,
            deviceNumber:1050618,
            deviceName:'Adam',
            deviceType:'一代检查',
            version:12,
            blueTeethID:'7E-9A-0C-8A-1Q',
            state:'启用',
            channel:'优丫优自有机构',
            distributeShop:'优眼优',
            used:'商用',
            printNumber:100,
            createTime:formatTime(time),
            isBingding:false,
        },
        {
            key:6,
            deviceNumber:1050618,
            deviceName:'Adam',
            deviceType:'二代检查',
            version:12,
            blueTeethID:'7E-9A-0C-8A-1Q',
            state:'启用',
            channel:'优丫优他有机构',
            distributeShop:'优眼优',
            used:'测试',
            printNumber:100,
            createTime:formatTime(time),
            isBingding:false,
        },
        {
            key:7,
            deviceNumber:1050618,
            deviceName:'Adam',
            deviceType:'打印机',
            version:12,
            blueTeethID:'7E-9A-0C-8A-1Q',
            state:'停用',
            channel:'优丫优自有机构',
            distributeShop:'优眼',
            used:'商用',
            printNumber:100,
            createTime:formatTime(time),
            isBingding:false,
        },
        {
            key:8,
            deviceNumber:1050618,
            deviceName:'Adam',
            deviceType:'二代检查',
            version:12,
            blueTeethID:'7E-9A-0C-8A-1Q',
            state:'停用',
            channel:'优丫优自有机构',
            distributeShop:'优眼',
            used:'商用',
            printNumber:100,
            createTime:formatTime(time),
            isBingding:false,
        },
        {
            key:9,
            deviceNumber:1050618,
            deviceName:'Adam',
            deviceType:'一代训练',
            version:12,
            blueTeethID:'7E-9A-0C-8A-1Q',
            state:'启用',
            channel:'优丫优他有机构',
            distributeShop:'优眼',
            used:'测试',
            printNumber:100,
            createTime:formatTime(time),
            isBingding:false,
        },
        {
            key:10,
            deviceNumber:1050618,
            deviceName:'Adam',
            deviceType:'二代训练',
            version:12,
            blueTeethID:'7E-9A-0C-8A-1Q',
            state:'启用',
            channel:'优丫优自有机构',
            distributeShop:'优眼',
            used:'商用',
            printNumber:100,
            createTime:formatTime(time),
            isBingding:false,
        },
        {
            key:11,
            deviceNumber:1050618,
            deviceName:'Adam',
            deviceType:'一代检查',
            version:12,
            blueTeethID:'7E-9A-0C-8A-1Q',
            state:'启用',
            channel:'优丫优他有机构',
            distributeShop:'优眼',
            used:'测试',
            printNumber:100,
            createTime:formatTime(time),
            isBingding:false,
        },
        {
            key:12,
            deviceNumber:1050618,
            deviceName:'Adam',
            deviceType:'打印机',
            version:12,
            blueTeethID:'7E-9A-0C-8A-1Q',
            state:'启用',
            channel:'优丫优自有机构',
            distributeShop:'优眼',
            used:'商用',
            printNumber:100,
            createTime:formatTime(time),
            isBingding:false,
        },
        {
            key:13,
            deviceNumber:1050618,
            deviceName:'Adam',
            deviceType:'一代训练',
            version:12,
            blueTeethID:'7E-9A-0C-8A-1Q',
            state:'停用',
            channel:'优丫优自有机构',
            distributeShop:'优眼',
            used:'测试',
            printNumber:100,
            createTime:formatTime(time),
            isBingding:false,
        },
        {
            key:14,
            deviceNumber:1050618,
            deviceName:'Adam',
            deviceType:'二代训练',
            version:12,
            blueTeethID:'7E-9A-0C-8A-1Q',
            state:'启用',
            channel:'优丫优他有机构',
            distributeShop:'优眼',
            used:'测试',
            printNumber:100,
            createTime:formatTime(time),
            isBingding:false,
        },
        {
            key:15,
            deviceNumber:1050618,
            deviceName:'Adam',
            deviceType:'一代检查',
            version:12,
            blueTeethID:'7E-9A-0C-8A-1Q',
            state:'启用',
            channel:'优丫优他有机构',
            distributeShop:'优眼',
            used:'测试',
            printNumber:100,
            createTime:formatTime(time),
            isBingding:false,
        },
        {
            key:16,
            deviceNumber:1050618,
            deviceName:'Adam',
            deviceType:'二代检查',
            version:12,
            blueTeethID:'7E-9A-0C-8A-1Q',
            state:'启用',
            channel:'优丫优自有机构',
            distributeShop:'优眼',
            used:'测试',
            printNumber:100,
            createTime:formatTime(time),
            isBingding:false,
        },
    ];

    function addNumber(data){
        for(let i = 0;i<data.length;i++){
            data[i].number = i + 1;
        }
    }
    addNumber(data);

    export default {
        components: {AFormModelItem},
        data() {
            return {
                selectedNum:-1,
                data,
                columns,
                labelCol: { span: 6 },
                wrapperCol: { span: 18 },
                modalNewVisible:false,
                modal1Visible:false,
                modal2Visible:false,
                modal3Visible:false,
                searchFlag:false,
                colorFlag:false,
                pageSize:10,
                look:'',
                pagination:{pageSize:10},
                buildDevice:{
                    name1:'',
                    number2:'',
                    deviceType1:'',
                    deviceVersion:'',
                    blueTeethID1:'',
                    state1:'',
                },
                distributeDevice:{
                    name:'',
                    number1:'',
                    Dchannel:'',
                    Dshop:'',
                    Dused:'',
                    Stime:'',
                },
                form: {
                    channel: '',
                    distributeShop: '',
                    deviceNumber: '',
                    used: '',
                    deviceType: '',
                    state: '',
                },
                channel: '',
                distributeShop: '',
                deviceNumber: '',
                used: '',
                deviceType: '',
                state: '',
            };
        },
        computed: {
        },
        methods:{
            searchInfo:function(){
                this.form.channel = this.channel;
                this.form.distributeShop = this.distributeShop;
                this.form.deviceNumber = this.deviceNumber;
                this.form.used = this.used;
                this.form.deviceType = this.deviceType;
                this.form.state = this.state;
                let index = ['channel','distributeShop','deviceNumber','state','used','deviceType'];
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
                this.searchFlag = true;
                this.data = search_data;
                console.log(this.form);
            },
            resetInfo(){
                this.searchFlag = false;
                this.data = data;
                this.form = {
                    channel: '',
                    distributeShop: '',
                    deviceNumber: '',
                    used: '',
                    deviceType: '',
                    state: '',
                };
                this.channel = '';
                this.distributeShop = '';
                this.deviceNumber = '';
                this.used = '';
                this.deviceType = '';
                this.state = '';
            },
            setModalNewVisible(modalNewVisible,Pflag) {
                this.modalNewVisible = modalNewVisible;
                if ((!modalNewVisible && Pflag)) {
                    console.log(this.distributeDevice, 'this.distributeDevice');
                }
            },
            setModal1Visible(modal1Visible,Pflag,value) {
                this.modal1Visible = modal1Visible;
                if ((!modal1Visible && Pflag)) {
                    console.log(this.distributeDevice, 'this.distributeDevice');
                }
                if ((modal1Visible && !Pflag)) {
                    this.distributeDevice.name = value.deviceName;
                    this.distributeDevice.number1=value.deviceNumber;
                    console.log(value.deviceName, 'this.distributeDevice');
                }
            },
            setModal2Visible(modal2Visible,Pflag,value) {
                this.modal2Visible = modal2Visible;
                if ((!modal2Visible && Pflag)) {
                    console.log(this.distributeDevice, 'this.distributeDevice');
                }
                if ((modal2Visible && !Pflag)) {
                    this.look = value;
                }
            },
            setModal3Visible(modal3Visible,value,pflag) {
                this.modal3Visible = modal3Visible;
                if(value > -1 && pflag === 'binding'){
                  this.selectedNum = value;
                  console.log(this.selectedNum)
                }else if(value > -1 && pflag === 'release'){
                  this.data[value].isBingding = false;
                }
                if(value < 0 && pflag){
                  console.log(this.selectedNum);
                  this.data[this.selectedNum].isBingding = true;
                  this.selectedNum = -1;
                }else if(value < 0 && !pflag){
                  this.selectedNum = -1;
                }
            },
        }
    };
</script>

<style scoped>
    .form-row{
        padding-right:10px;
        padding-top:5px;
    }
    .modal-body{
        display: flex;
        /*flex-direction:column;*/
        justify-content: center;
        /*margin-left: 120px;*/
    }
@media screen and (min-width: 1024px) {
  .label-3-input label, .label-4-input label{
    font-weight:bold;
  }
  .label-3-input input{
    width:100px;
  }
  .label-4-input input{
    width:100px;
  }
  .label-4-select label, .label-2-select label{
    font-weight:bold;
  }
  .label-4-select .ant-select{
    width:95px;
  }
  .label-2-select .ant-select{
    width:70px;
  }
  .button{
    display:flex;
    width:120px;
    justify-content: space-between;
  }
  .ant-btn{
    padding:0 6px;
  }
}

@media screen and (min-width: 1280px) {
  .label-3-input label, .label-4-input label{
    font-weight:bold;
    margin-right:3px;
  }
  .label-3-input input{
    width:100px;
  }
  .label-4-input input{
    width:100px;
  }
  .label-4-select label, .label-2-select label{
    font-weight:bold;
    margin-right:3px;
  }
  .label-4-select .ant-select{
    width:95px;
  }
  .label-2-select .ant-select{
    width:70px;
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

@media screen and (min-width: 1366px) {
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
  .label-4-select .ant-select{
    width:100px;
  }
  .label-2-select .ant-select{
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
  .label-4-select .ant-select{
    width:105px;
  }
  .label-2-select .ant-select{
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
  .label-4-select .ant-select{
    width:110px;
  }
  .label-2-select .ant-select{
    width:85px;
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
  .label-4-select .ant-select{
    width:115px;
  }
  .label-2-select .ant-select{
    width:90px;
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
