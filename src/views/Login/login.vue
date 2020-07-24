<template>
  <div class="login-background">
    <img src="../../assets/login.png" style="position:fixed;width:100%;height:100%;"/>
    <div style="display:flex;justify-content:center;width:50%;height:100%;">
      <div class="login-container" style="display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;">
        <div style="font-size:44px;color:#0E425E;">新视光后台管理系统</div>
        <img src="../../assets/logo.png" style="width:70%;height:15%;margin-top:30px"/>
        <div style="width:65%;height:100%;display:flex;flex-direction:column;margin-top:40px">
          <p style="font-size:23px;font-weight:bold;color:#28292B">登录</p>
          <div style="display:flex;align-items:center;width:100%;height:45px;border:1px solid #E5E9EF;border-radius:5px;margin-top:10px">
            <img src="../../assets/user.png" style="width:20px;height:20px;margin-left:20px;"/>
            <a-input 
              style="width:80%;height:100%;font-size:16px;box-shadow: none;border: none;"
              placeholder="请输入登录手机号"
            ></a-input>
          </div>
          <div style="display:flex;align-items:center;width:100%;height:45px;border:1px solid #E5E9EF;border-radius:5px;margin-top:30px">
            <img src="../../assets/houtai-08.png" style="width:20px;height:20px;margin-left:20px;"/>
            <a-input 
              style="width:80%;height:100%;font-size:16px;box-shadow: none;border: none;"
              placeholder="请输入账户密码"
            ></a-input>
          </div>
          <div style="width:100%;text-align:end;color:#A0A2A8;margin-top:15px;cursor:pointer;">忘记密码？</div>
          <div style="text-align:center;margin-top:30px">
            <a-button id="button-style" type="primary" style="width:100%;height:45px;font-size:18px;border-radius:5px;" @click="login">登录</a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods:{
    login(){
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.login-background{
  width:100%;
  height:100%;
}
#button-style.ant-btn-primary{
  background-color:#1079FA;
}
#button-style.ant-btn-primary:active{
  background-color:#0a4c9e;
}
@media screen and (min-width: 1024px){
  .login-container{
    top:15%;
    width:100%;
    height:80%;
  }
}
@media screen and (min-width: 1280px){
  .login-container{
    top:18%;
    width:70%;
    height:80%;
  }
}
@media screen and (min-width: 1336px){
  .login-container{
    top:18%;
    width:65%;
    height:80%;
  }
}
@media screen and (min-width: 1680px){
  .login-container{
    top:18%;
    width:60%;
    height:80%;
  }
}
@media screen and (min-width: 1680px){
  .login-container{
    top:18%;
    width:55%;
    height:80%;
  }
}
</style>