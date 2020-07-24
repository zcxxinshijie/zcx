<template>
  <div style="width:100%;display:flex;padding: 8px 0;border-bottom: 1px solid #e8e8e8;">
    <div style="width:70%;display:flex;flex-direction:column;">
      <div style="display:flex;">
        <div style="width:53%;height:20px;line-height:20px;margin:5px 0;"><span style="font-size:1.05em;font-weight:bold;">{{item.target}}</span></div>
        <div style="width:47%;height:20px;line-height:20px;margin:5px 0;font-size:0.95em;color:#656565">重复<span>{{item.times}}</span>次</div>
      </div>
      <div style="display:flex;">
        <div style="width:53%;height:20px;line-height:20px;margin:5px 0;font-size:0.95em;color:#656565">右眼正片等级: <span>{{item.rightGrade}}</span></div>
        <div style="width:47%;height:20px;line-height:20px;margin:5px 0;font-size:0.95em;color:#656565">右眼正片次数: <span>{{item.rightTimes}}</span></div>
      </div>
      <div style="display:flex;">
        <div style="width:53%;height:20px;line-height:20px;margin:5px 0;font-size:0.95em;color:#656565">左眼正片等级: <span>{{item.leftGrade}}</span></div>
        <div style="width:47%;height:20px;line-height:20px;margin:5px 0;font-size:0.95em;color:#656565">左眼正片次数: <span>{{item.leftTimes}}</span></div>
      </div>
    </div>
    <div style="width:30%;display:flex;justify-content:space-between;align-items:center;">
      <div style="color:#0F79F9;cursor:pointer;" @click="handleClick('up')">上移</div>
      <div style="color:#0F79F9;cursor:pointer;" @click="handleClick('down')">下移</div>
      <div style="color:#0F79F9;cursor:pointer;" @click="handleClick('cancel')">取消</div>
    </div>
  </div>
</template>

<script>
export default{
  props:{
    item:Object,
    index:Number,
  },
  methods:{
    handleClick(operation){
      this.$emit('click', operation, this.index);
    }
  }
}
</script>
<style scoped>
span{
  font-weight:500;
}
</style>