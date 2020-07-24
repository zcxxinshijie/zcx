<template>
  <div id="container">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
    };
  },
  created(){
    this.$router.push('/login');
  }
};
</script>
<style>
#container{
  width:100vw;
  height:100vh;
}
</style>