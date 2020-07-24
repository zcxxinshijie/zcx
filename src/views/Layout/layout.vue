<template>
  <div id="layout">
    <a-layout id="components-layout-demo-custom-trigger">
      <a-layout-sider id="sider" theme="light" v-model="collapsed" :trigger="null" collapsible style="height:100vh;overflow:auto;">
        <div class="logo">
          <img v-show="!collapsed" src="../../assets/logo.png" alt="新视光后台管理系统" style="width:200px;height:68px"/>
          <img v-show="collapsed" src="../../assets/logo2.png" alt="新视光后台管理系统" style="width:70px;height:60px;margin:4px 5px;"/>
        </div>
        <a-menu id="menu" theme="light" mode="inline" :inline-collapsed="collapsed" :default-selected-keys="['1']">
          <a-menu-item key="1">
            <router-link to="/">
              <i class="iconfont icon-houtai-01 sider-menu-icon"></i>
              <span>总览</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="2">
            <router-link to='/user'>
              <i class="iconfont icon-houtai-02 sider-menu-icon"></i>
              <span>用户管理</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="3">
            <router-link to='/device'>
              <i class="iconfont icon-houtai-03 sider-menu-icon"></i>
              <span>设备管理</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="4">
            <router-link to='/product'>
              <i class="iconfont icon-houtai-04 sider-menu-icon"></i>
              <span>产品中心</span>
            </router-link>
          </a-menu-item>
          <a-sub-menu key="sub1">
            <span slot="title">
              <i class="iconfont icon-houtai-05 sider-menu-icon"></i>
              <span>订单中心</span>
            </span>
            <a-menu-item key="5">
              <router-link to='/order/package_management'>
                <span>套餐管理</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="6">
              <router-link to='/order/price_management'>
                <span>价格管理</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="7">
              <router-link to='/order/order_management'>
                <span>订单管理</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="8">
              <router-link to='/order/training_distribution'>
                <span>训练分配</span>
              </router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <span slot="title">
              <i class="iconfont icon-houtai-06 sider-menu-icon"></i>
              <span>企业中心</span>
            </span>
            <a-menu-item key="9">
              <router-link to='/enterprise/channel_management'>
                <span>渠道管理</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="10">
              <router-link to='/enterprise/store_management'>
                <span>门店管理</span>
              </router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub3">
            <span slot="title">
              <i class="iconfont icon-houtai-07 sider-menu-icon"></i>
              <span>统计中心</span>
            </span>
            <a-menu-item key="11">
              <router-link to='/statistic/operation'>
                <span>运营数据</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="12">
              <router-link to='/statistic/training_using'>
                <span>训练使用</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="13">
              <router-link to='/statistic/client_training'>
                <span>客户训练情况</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="14">
              <router-link to='/statistic/client_test'>
                <span>客户检查情况</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="15">
              <router-link to='/statistic/user_filter'>
                <span>用户筛查</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="16">
              <router-link to='/statistic/testing_instrument_using'>
                <span>检查仪使用明细</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="17">
              <router-link to='/statistic/device_using'>
                <span>设备使用数据统计</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="18">
              <router-link to='/statistic/verification_code'>
                <span>验证码信息</span>
              </router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub4">
            <span slot="title">
              <i class="iconfont icon-houtai-08 sider-menu-icon"></i>
              <span>权限中心</span>
            </span>
            <a-menu-item key="19">
              <router-link to='/rank/role_management'> 
                <span>角色管理</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="20">
              <router-link to='/rank/rank_distribution'>
                <span>权限分配</span>
              </router-link>
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="background: #fff; padding: 0;height:68px;display:flex;align-items:center;justify-content:space-between">
          <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="() => (collapsed = !collapsed)"
          />
          <div style="width:500px;display:flex;align-items:center;justify-content:space-around;">
            <div style="display:flex;align-items:center;width:200px;height:40px;background-color:#EBEFF2;border-radius:20px;">
              <img src="../../assets/search.png" style="margin-left:5px;width:36px;height:36px;"/>
              <input style="width:130px;height:35px;border:none;background-color:#EBEFF2;outline:none;font-size:16px;">
            </div>
            <div style="text-align:center;">
              <img src="../../assets/bell.png" style="width:34px;height:34px;"/>
            </div>
            <div style="width:180px;height:68px;display:flex;align-items:center;">
              <a-avatar style="cursor:pointer" @click="toLogin" src="http://i.gongxiao8.com/uploads/i_2_2633841449x3707222293_26.jpg"  size="large"/>
              <div title="视光师13429838102" style="width:120px;height:68px;margin-left:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:16px;color:#1079FA">视光师13429838102</div>
            </div>
          </div>
        </a-layout-header>
        <a-layout-content
          :style="{ margin: '24px 16px', background: '#fff', minHeight: '280px' }"
        >
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>
<script>
export default {
  data() {
    return {
      collapsed: false,
    };
  },
  methods:{
    toLogin(){
      this.$router.push('/login');
    }
  }
};
</script>
<style scoped>
#layout{
  width:100%;
  height:100%;
}

#sider::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
#sider{
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

li.ant-menu-item{
  margin-top:0px;
}

#components-layout-demo-custom-trigger{
  width:100%;
  height:100%;
}

#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  position:fixed;
  left:0;
  top:0;
  z-index:100;
  background-color:white;
  height: 68px;
  color: white;
  font-size: 1.2rem;
  font-weight:bold;
  text-align:center;
  overflow: hidden;
}
#menu{
  margin-top:68px;
}
</style>
