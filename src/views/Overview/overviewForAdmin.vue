<template>
  <div class="view-layout">
    <!-- 画图示例 -->
      <div style="width: 28%;margin-right: 1%">
          <div id="patientType" style="margin-bottom: 2%">
              <p class="wenzi">患者类型分布</p>
              <div id="test2"></div>
          </div>
          <div id="useAge">
              <p class="wenzi">使用年龄分布</p>
              <div id="example"></div>
          </div>
      </div>
      <div class="view2">
          <div style="display:flex;flex-direction:column;">
              <p class="wenzi">新视锐全国分布</p>
<!--              style="margin: auto;width: 78%;height: 70%;"-->
              <div id="test5" ></div>
          </div>
          <div id="dongtai">
              <p class="wenzi">实时动态</p>
              <ul style="margin-top:calc((100vh - 68px) * 0.05);">
                  <li><span style="margin: 0 4px;color: #0f19ff">用户</span>在<span style="margin: 0 4px;color: #0f19ff">视力康复中心</span>进行了训练</li>
                  <li><span style="margin: 0 4px;color: #0f19ff">用户</span>在<span style="margin: 0 4px;color: #0f19ff">视力康复中心</span>进行了训练</li>
                  <li><span style="margin: 0 4px;color: #0f19ff">用户</span>在<span style="margin: 0 4px;color: #0f19ff">视力康复中心</span>进行了训练</li>
<!--                  <li><span style="margin: 0 4px;color: #0f19ff">用户</span>在<span style="margin: 0 4px;color: #0f19ff">视力康复中心</span>进行了训练</li>-->
              </ul>
          </div>
          <div style="margin-bottom:calc((100vh - 68px) * 0.02);;">
              <p class="wenzi">总览</p>
              <a-row style="margin:calc((100vh - 68px) * 0.025 + 15px) 30px 10px">
                  <a-col span="12" style="display: flex;justify-content: flex-start;">
                      <img src="../../assets/用户.png" alt="Big Boat" width="45" height="40" style="margin: 15px 10px 0 0">
                      <a-statistic title="累计注册用户" style="margin: auto 0; line-height:19px;"
                                   :value-style="{ 'margin-top': '1px' }"
                                   :value="1128">
                      </a-statistic>
                  </a-col>
                  <a-col span="12" style="display: flex;justify-content: flex-start;">
                      <img src="../../assets/图表-02.png" alt="Big Boat" width="50" height="45" style="margin: 15px 10px 0 0">
                      <a-statistic title="累计注册视光师"
                                   style="margin: auto 0; line-height:19px;"
                                   :value="1228">
                      </a-statistic>
                  </a-col>
              </a-row>
              <a-row style="margin: 20px 20px 0 30px">
                  <a-col span="12" style="display: flex;justify-content: flex-start;">
                      <img src="../../assets/图表-01.png" alt="Big Boat" width="45" height="40" style="margin: 15px 10px 0 0">
                      <a-statistic title="累计注册渠道"
                                   style="margin: auto 0; line-height:19px;"
                                   :value="1128">
                      </a-statistic>
                  </a-col>
                  <a-col span="12" style="display: flex;justify-content: flex-start;">
                      <img src="../../assets/图表-03.png" alt="Big Boat" width="45" height="40" style="margin: 15px 10px 0 0">
                      <a-statistic id="statistic" title="累计注册门店"
                                   style="margin: auto 0; line-height:19px;"
                                   :value="1228">
                      </a-statistic>
                  </a-col>
              </a-row>
          </div>
      </div>
      <div style="width: 33%">
          <div class="boxx3">
              <p class="wenzi">用户增长趋势</p>
              <div id="test3" style="margin:0 auto;padding:calc((100vh - 68px) * 0.025) 0 0;"></div>
              <p class="wenzi">订单增长趋势</p>
              <div id="test1" style="margin:0 auto;padding:calc((100vh - 68px) * 0.025) 0 0;"></div>
          </div>
          <div id="goodsForm">
              <p class="wenzi">订单增长趋势</p>
              <div id="test4" style="margin:0 auto;padding:calc((100vh - 68px) * 0.03) 0 0;"></div>
          </div>
      </div>
  </div>
</template>

<script>
    import {Chart, registerShape} from '@antv/g2';
    import DataSet from '@antv/data-set';
    import ARow from "ant-design-vue/es/grid/Row";
    import ACol from "ant-design-vue/es/grid/Col";
export default {
    components: {ACol, ARow},
    data(){
    return{
        height:document.documentElement.clientHeight,
        width:document.documentElement.clientWidth,
      //此处定义响应式数据
        basicColumnChartProp:{
            data:[
                { name: 'London', 月份: 'Jan.', 月均降雨量: 18.9 },
                { name: 'London', 月份: 'Feb.', 月均降雨量: 28.8 },
                { name: 'London', 月份: 'Mar.', 月均降雨量: 39.3 },
                { name: 'London', 月份: 'Apr.', 月均降雨量: 81.4 },
                { name: 'London', 月份: 'May', 月均降雨量: 47 },
                { name: 'London', 月份: 'Jun.', 月均降雨量: 20.3 },
                { name: 'Berlin', 月份: 'Jan.', 月均降雨量: 12.4 },
                { name: 'Berlin', 月份: 'Feb.', 月均降雨量: 23.2 },
                { name: 'Berlin', 月份: 'Mar.', 月均降雨量: 34.5 },
                { name: 'Berlin', 月份: 'Apr.', 月均降雨量: 99.7 },
                { name: 'Berlin', 月份: 'May', 月均降雨量: 52.6 },
                { name: 'Berlin', 月份: 'Jun.', 月均降雨量: 35.5 },
            ],
            container:'example',
        },
        basicTestProp:{
            data:[
                { feature: 'Battery', value: 0.22, phone: 'iPhone' },
                { feature: 'Brand', value: 0.28, phone: 'iPhone' },
                { feature: 'Contract', value: 0.29, phone: 'iPhone' },
                { feature: 'Design', value: 0.17, phone: 'iPhone' },
                { feature: 'Battery', value: 0.27, phone: 'Samsung' },
                { feature: 'Brand', value: 0.16, phone: 'Samsung' },
                { feature: 'Contract', value: 0.35, phone: 'Samsung' },
                { feature: 'Design', value: 0.13, phone: 'Samsung' },
                { feature: 'Battery', value: 0.26, phone: 'Nokia Smartphone' },
                { feature: 'Brand', value: 0.1, phone: 'Nokia Smartphone' },
                { feature: 'Contract', value: 0.3, phone: 'Nokia Smartphone' },
                { feature: 'Design', value: 0.14, phone: 'Nokia Smartphone' },
            ],
            container:'test1'
        },
        basicTestOne:{
            data:[
                { type: '分类一', value: 27 },
                { type: '分类二', value: 25 },
                { type: '分类三', value: 18 },
                { type: '分类四', value: 15 },
                { type: '分类五', value: 10 },
                { type: 'Other', value: 5 },
            ],
            container:'test2'
        },
        basicTestTwo:{
            data:[
                { time: '10:10', call: 4, people: 2 },
                { time: '10:15', call: 2, people: 3 },
                { time: '10:20', call: 13, people: 5 },
                { time: '10:25', call: 9, people: 1 },
                { time: '10:30', call: 5, people: 3 },
                { time: '10:35', call: 8, people: 1 },
                { time: '10:40', call: 13, people: 2 }
            ],
            container:'test3'
        },
        basicTestThree:{
            data:[
                { type: '销售总额1', value: 34 },
                { type: '销售总额2', value: 85 },
                { type: '销售总额3', value: 103 },
                { type: '销售总额4', value: 142 },
                { type: '销售总额5', value: 251 },
            ],
            container:'test4'
        },
    }
  },
  mounted(){
    //示例：绘制图表
      this.testView1();
      this.drawLine1();
      this.testView4();
      this.testView2();
      this.testView();
      this.testView3();
  },
  methods:{
      testView1(){
          const data2 = this.basicTestOne.data;
          let max = 0;
          data2.forEach(function(obj) {
              if (obj.value > max) {
                  max = obj.value;
              }
          });

// 自定义 other 的图形，增加两条线
          registerShape('interval', 'slice-shape', {
              draw(cfg, container) {
                  const points = cfg.points;
                  const origin = cfg.data;
                  const percent = origin.value / max;
                  const xWidth = points[2].x - points[1].x;
                  const width = xWidth * percent;
                  let path = [];
                  path.push(['M', points[0].x, points[0].y]);
                  path.push(['L', points[1].x, points[1].y]);
                  path.push(['L', points[0].x + width, points[2].y]);
                  path.push(['L', points[0].x + width, points[3].y]);
                  path.push('Z');
                  path = this.parsePath(path);
                  return container.addShape('path', {
                      attrs: {
                          fill: cfg.color,
                          path,
                      },
                  });
              },
          });
          const chart = new Chart({
              container: this.basicTestOne.container,
              width: this.basicTestOne_width,
              height: this.basicTestOne_height,
              autoFit:true,
          });
          chart.coordinate('theta', {
              radius: 0.8,
          });
          chart.data(data2);
          chart.tooltip({
              showTitle: false,
              showMarkers: false,
          });
          chart.legend('type',{
              position: 'bottom',
              autoWrap:false,
              itemSpacing: 10,
              marker:{
                  symbol:'square',
              }
          });
          chart
              .interval()
              .adjust('stack')
              .position('value')
              .color('type')
              .shape('slice-shape');

          chart.interaction('element-active');

          chart.render();
      },
      drawLine1(){
          const data = this.basicColumnChartProp.data;
          const chart = new Chart({
              container: this.basicColumnChartProp.container,
              width: this.basicColumnChartProp_width,
              height: this.basicColumnChartProp_height,
              autoFit:true,
          });
          chart.data(data);
          chart.scale('月均降雨量', {
              min: 0,
              max: 120,
          });
          // chart.scale({
          //     people: {
          //         min: 0,
          //         max: 6,
          //     },
          // });
          chart.tooltip({
              showMarkers: false,
              shared: true,
          });
          chart.interval().position('月份*月均降雨量')
              .color('name').adjust([
              {
                  type: 'dodge',
                  marginRatio: 0,
              },
          ]);
          chart.interaction('active-region');
          chart.render();
      },
      testView4(){
          fetch('https:/g2.antv.vision/zh/examples/data/china-provinces.geo.json')
              .then(res => res.json())
              .then(mapData => {
                  const chart = new Chart({
                      container: 'test5',
                      autoFit: true,
                      width:385,
                      height: 319,
                      padding: [5, 5]
                  });
                  chart.tooltip({
                      showTitle: false,
                      showMarkers: false,
                      shared: true,
                  });
                  // 同步度量
                  chart.scale({
                      longitude: {
                          sync: true
                      },
                      latitude: {
                          sync: true
                      }
                  });
                  chart.axis(false);
                  chart.legend(false);

                  // 绘制地图背景
                  const ds = new DataSet();
                  const worldMap = ds.createView('back')
                      .source(mapData, {
                          type: 'GeoJSON'
                      });
                  const worldMapView = chart.createView();
                  worldMapView.data(worldMap.rows);
                  worldMapView.tooltip(false);
                  worldMapView.polygon().position('longitude*latitude').style({
                      fill: '#9df2ff',
                      stroke: '#ffffff',
                      lineWidth: 1
                  });

                  // 可视化用户数据
                  const userData = [
                      { name: '新疆维吾尔自治区', value: 86.8 },
                      { name: '西藏自治区', value: 106.3 },
                      { name: '云南省', value: 94.7 },
                      { name: '湖南省', value: 98 },
                      { name: '吉林省', value: 98.4 },
                  ];
                  const userDv = ds.createView()
                      .source(userData)
                      .transform({
                          geoDataView: worldMap,
                          field: 'name',
                          type: 'geo.region',
                          as: ['longitude', 'latitude']
                      })
                      .transform({
                          type: 'map',
                          callback: obj => {
                              obj.trend = (obj.value > 100) ? '男性更多' : '女性更多';
                              return obj;
                          }
                      });
                  const userView = chart.createView();
                  userView.data(userDv.rows);
                  userView.scale({
                      trend: {
                          alias: '每100位女性对应的男性数量'
                      }
                  });
                  userView.polygon()
                      .position('longitude*latitude')
                      .color('trend', ['#F51D27', '#0A61D7'])
                      .tooltip('name*trend')
                      .style({
                          fillOpacity: 0.85
                      })
                      .animate({
                          leave: {
                              animation: 'fade-out'
                          }
                      });
                  userView.interaction('element-active');

                  chart.render();
              });
      },
      testView2(){
          const data1 = this.basicTestTwo.data;
          const chart = new Chart({
              container: this.basicTestTwo.container,
              width: this.basicTestTwo_width,
              height: this.basicTestTwo_height,
              autoFit:true,
          });
          chart.data(data1);
          chart.scale({
              people: {
                  min: 0,
                  max: 6,
              },
          });
          chart.axis('people',{
              grid:null,
          });
          chart.axis('time', {
              grid: {
                  type: 'line',
                  lineStyle: {
                      stroke: '#d9d9d9',
                      lineWidth: 1,
                  },
                  align: 'center' // 网格顶点从两个刻度中间开始
              }
          });
          chart.tooltip({
              shared: true,
          });
          chart.line()
              .position('time*people')
              .color('#FF1655')
              .size(3)
              .shape('smooth');
          chart
              .area()
              .position('time*people')
              .color('#fdafbe')
              .shape('smooth');

          chart.interaction('active-region');
          chart.removeInteraction('legend-filter'); // 自定义图例，移除默认的分类图例筛选交互
          chart.render();
      },
      testView(){
          const data1 = this.basicTestProp.data;
          const chart = new Chart({
              container: this.basicTestProp.container,
              width: this.basicTestProp_width,
              height: this.basicTestProp_height,
              autoFit:true,
          });
          chart.data(data1);
          chart.line().position('feature*value').color('phone');
          chart.render();
      },
      testView3(){
          const data1 = this.basicTestThree.data;
          const chart = new Chart({
              container: this.basicTestThree.container,
              width: this.basicTestThree_width,
              height: this.basicTestThree_height,
              autoFit:true,
          });
          chart.data(data1);
          chart.scale('value',{
              nice: true
          });
          chart.axis('type', {
              title: null,
              tickLine: null,
              line: null,
          });

          chart.axis('value', {
              label: null,
              title: null,
              // title: {
              //     offset: 30,
              //     style: {
              //         fontSize: 12,
              //         fontWeight: 300,
              //     },
              // },
          });
          chart.legend(false);
          chart.coordinate().transpose();
          chart
              .point()
              .adjust('stack')
              .position('type*value')
              .color('type')
              .size(5)
              .shape('circle');
          chart
              .interval()
              .position('type*value')
              .color('type')
              .size(6)
              .label('value', {
                  style: {
                      fill: '#8d8d8d',
                  },
                  offset: 10,
              });
          chart.interaction('element-active');
          chart.render();
      },
    // drawLine(){
    //     // 基于准备好的dom，初始化echarts实例
    //     let myChart = this.echarts.init(document.getElementById('example'))
    //     // 绘制图表
    //     myChart.setOption({
    //         title: { text: '在Vue中使用echarts',
    //                   textStyle: {
    //                     color: 'rgb(255,255,255)'
    //                   },
    //                  },
    //         textStyle: {
    //                     color: 'rgb(255,255,255)'
    //                 },
    //         tooltip: {},
    //         xAxis: {
    //             data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
    //         },
    //         yAxis: {},
    //         series: [{
    //             name: '销量',
    //             type: 'bar',
    //             data: [5, 20, 36, 10, 10, 20]
    //         }]
    //     });
    // }
  }
}
</script>
<style scoped>
.view-layout{
    /*border-style: dotted;*/
    height:100%;
    width:100%;
    min-width: 755px;
    margin: 0 auto;
    background:rgba(235,239,241,1);
    display: flex;
    justify-content: center;
}
#patientType{
    height:49%;
    border-radius:6px;
    background-color: rgba(255,255,255,1);
}
#test2{
    display: flex;
    align-items: center;
    width:calc((100vw - 200px) * 0.26);
    height:calc((100vh - 68px) * 0.39);
    margin: 0 auto;
}
#test3{
    width:calc((100vw - 200px) * 0.29);
    height:calc((100vh - 68px) * 0.27);
}
#test1{
    width:calc((100vw - 200px) * 0.29);
    height:calc((100vh - 68px) * 0.27);
}
#test4{
    width:calc((100vw - 200px) * 0.29);
    height:calc((100vh - 68px) * 0.24);
}
#test5{
    width:calc((100vw - 200px) * 0.25);
    height:calc((100vh - 68px) * 0.37);
    margin: auto;
}
/*#dongtai{*/
/*    height:calc((100vh - 68px) * 0.25);*/
/*}*/
#example{
    display: flex;
    align-items: center;
    width:calc((100vw - 200px) * 0.25);
    height:calc((100vh - 68px) * 0.40);
    margin: 0 auto;
}
#goodsForm{
    /*width:384px;*/
    /*height:228px;*/
    /*width:99%;*/
    height:32%;
    border-radius:6px;
    background-color: rgba(255,255,255,1);
}
#useAge{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height:50%;
    border-radius:6px;
    background-color: rgba(255,255,255,1);
}
.boxx3{
    /*width:384px;*/
    /*height:544px;*/
    /*width:99%;*/
    height:67%;
    margin-bottom: 2%;
    border-radius:6px;
    background-color: rgba(255,255,255,1);
}
.view2{
    display:flex;
    flex-direction:column;
    justify-content: space-between;
    width: 36%;
    margin-right: 1%;
    height:100%;
    border-radius:6px;
    background-color: rgba(255,255,255,1);
}
ul
{
    list-style-type:none;
    /*list-style-type:circle;*/
}
ul li::before {
    content: "●";
    color: #0f19ff;
    position: relative;
    margin-right: 5px;
    font-size: 22px;
}
ul li{
    height:calc((100vh - 68px) * 0.045);
    font-weight:bold;
    font-size: calc((100vh - 68px) * 0.02);
}
#statistic.ant-statistic-title{
    font-size: 20px;
    background-color: #42b983;
}
.wenzi{
    height:0px;
    padding: 15px 23px 0;
    font-size:18px;
    font-weight:600;
    color:rgba(0,0,0,1);
}
</style>






