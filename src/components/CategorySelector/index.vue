<template>
  <div>
    <!-- 行内表单 inline横向排列 必定写model,收集数据-->
    <el-form :inline="true" :model="cForm" class="demo-form-inline">

      <!-- 一级分类 -->
      <el-form-item label="一级分类">
        <!-- 请选择 -->
        <el-select
          v-model="cForm.category1Id"
          placeholder="请选择"
           @change="handlerCategory1"
        >    
        <!-- 遍历选项 -->
        <!-- 收集表单数据，默认收集的是value值 -->
        <el-option
          :label="c1.name"
          :value="c1.id"
          v-for="c1 in category1List"
          :key="c1.id"
        >
        </el-option>
        </el-select>
      </el-form-item>

       <!-- 二级分类 -->
      <el-form-item label="二级分类">
        <el-select
          v-model="cForm.category2Id"
          placeholder="请选择"
         @change="handlerCategory2"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="(c2, index) in category2List"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>

       <!-- 三级分类 -->
      <el-form-item label="三级分类">
        <el-select
          v-model="cForm.category3Id"
          placeholder="请选择"
          @change="handlerCategory3"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="(c3, index) in category3List"
            :key="c3.id"
         
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      cForm: {
        category1Id:'',
        category2Id:'',
        category3Id:'',
      },
      category1List:[],
      category2List:[],
      category3List:[],
    };
  },

  mounted() {
     // 获取1级分类列表
    this.getCategory1List();
  },
  methods: {
    // 获取1级分类列表
    // async返回的promise成功还是失败，看函数的return
    async getCategory1List() {
      try {
        const result = await this.$API.category.getCategorys1()
        if(result.code === 200){
          this.category1List = result.data
        }
      } catch (error) {
        this.$message.error('请求获取一级分类失败')
      }
    },


   //选中一级分类，请求获取对应的二级分类
   async handlerCategory1(category1Id){
     //点击1级分类，清空23级分类的列表和收集的id
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      this.category2List = []
      this.category3List = []

      this.$emit('changeCategory',{categoryId:category1Id,level:1})

      try{
        const result =await this.$API.category.getCategorys2(category1Id)
        if(result.code===200){
           this.category2List = result.data
        }
      }catch(error){
         this.$message.error('请求获取一级分类失败')
          
      }
   },
    
   //选中2级分类 请求获取对应的3级分类
    async handlerCategory2(category2Id){
      
      //点击2级分类 清空3级分类的列表和收集的id
      this.cForm.category3Id = ''
      this.category3List = []

      this.$emit('changeCategory',{categoryId:category2Id,level:2})

      try {
        const result = await this.$API.category.getCategorys3(category2Id)
        if(result.code === 200){
          this.category3List = result.data
        }
      } catch (error) {
        this.$message.error('请求获取三级分类失败')
      }
    },

    //选中3级分类
    handlerCategory3(category3Id){
      this.$emit('changeCategory',{categoryId:category3Id,level:3})
    }
  }
};
</script>

<style lang="less" scoped></style>
