<template>
  <div>
    <!-- 三级联动组件 -->
    <el-card>
      <CategorySelector @changeCategory="changeCategory"></CategorySelector>
    </el-card>

    <el-card style="margin-top: 20px">
      <!-- 列表页面 -->
      <div v-show="isShowList">
        <!-- 按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="showAddDiv"
          >添加属性</el-button
        >
        <!-- 表格 -->
        <el-table :data="attrList" border style="width: 100%">
          <el-table-column label="序号" type="index" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
              >
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-Button
                type="warning"
                icon="el-icon-edit"
                title="修改属性"
                size="mini"
                @click="showAddDiv"
              ></el-Button>

               <el-popconfirm
                :title="`你确定是删除${row.attrName}吗`"
                @onConfirm="deleteAttr(row)"
              >
                <el-Button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  title="删除属性"
                  size="mini"
                ></el-Button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 添加和修改的页面 -->
      <div v-show="!isShowList">
      <!-- 添加属性页面 -->
        <!-- 请输入属性名和属性值 -->
        <el-form :inline="true" ref="form" :model="attrForm">
          <el-form-item label="属性名">
            <el-input
              v-model="attrForm.attrName"
              placeholder="请输入属性名"
            ></el-input>
          </el-form-item>   
        </el-form>
        
        <!-- 添加属性值和取消按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrForm.attrName"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button @click="isShowList = true">取消</el-button>
        
        <!-- 商品属性属性值列表 -->
        <el-table
          border
          :data="attrForm.attrValueList"
          style="width: 100%; margin: 20px 0"
        >
          <!-- 序号列 -->
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>
          <!-- 属性名称列 -->
          <el-table-column prop="prop" label="属性值名称" width="width">
            <!-- 输入属性值文本框 -->
            <template slot-scope="{ row, $index }">
              <el-input
                :ref="$index"
                v-if="row.isEdit"
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                @blur="toLook(row)"
                @keyup.enter.native="toLook(row)"
                size="mini"
              ></el-input>

               <span
                v-else
                @click="toEdit(row, $index)"
                style="display: inline-block; width: 100%; height: 100%"
                >{{ row.valueName }}</span
              >

            </template>
          </el-table-column>
         <!-- 操作 -->
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 三者顺序：插槽、气泡确认框、按钮 -->
               <!-- 气泡确认框包裹按钮，作用域插槽包裹按钮 ，气泡确认框用的时候一般也是在作用域插槽当中使用-->
              <!-- @onConfirm事件名称+on ,用slot -->
              <el-popconfirm
                :title="`你确定是删除${row.valueName}吗`"
                @onConfirm="attrForm.attrValueList.splice($index, 1)"
              >
              <!-- 删除按钮 -->
              <el-Button
                slot="reference"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除属性值"

              ></el-Button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 保存取消按钮 -->
        <el-button
          type="primary"
          :disabled="attrForm.attrValueList.length === 0"
           @click="addOrUpdateAttr"
          >保存</el-button
        >
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],

      isShowList: true,

      attrForm: {
        attrName: "",
        attrValueList: [
          // {
          //   id:0,
          //   attrId: 0,
          //   valueName: "string",
          // },
        ],
        categoryId: "",
        categoryLevel: 3
      }
    };
  },

  methods: {
    //当列表改变触发的函数
    changeCategory({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        //重新选择1级分类，那么父组件当中要清空23级id及属性列表
        this.category2Id = "";
        this.category3Id = "";
        this.attrList = [];
      } else if (level === 2) {
        this.category2Id = categoryId;
        //重新选择2级分类，那么父组件当中要清空3级id及属性列表
        this.category3Id = "";
        this.attrList = [];
      } else {
        this.category3Id = categoryId;
        //点完三级分类需要发请求获取属性列表数据展示
        this.getAttrList();
      }
    },

    //发请求获取属性列表
    // async返回的promise是成功还是失败，看函数的rerurn
    async getAttrList() {
      let { category1Id, category2Id, category3Id } = this;
      //可能导致错误的代码
      try {
        //等待请求请求结果
        const result = await this.$API.attr.getList(
          category1Id,
          category2Id,
          category3Id
        );
        // 请求成功
        if (result.code === 200) {
          this.attrList = result.data;
          // 请求失败
        } else {
          this.$message.error("获取属性列表失败");
        }
      } catch (error) {
        //错误处理
        this.$message.error("请求属性列表失败");
      }
    },

    //点击添加属性的按钮
    showAddDiv() {
      this.isShowList = false;
      this.attrForm = {
        attrName: "",
        attrValueList: [
          // {
          //   id:0,
          //   attrId: 0,
          //   valueName: "string",
          // },
        ],
        categoryId: this.category3Id, 
        //这个属性只能在这里赋值  不能在data当中直接赋值 ，因为data当中谁先谁后不确定
        categoryLevel: 3
      };
    },

    //点击添加属性值的按钮
    addAttrValue() {
      this.attrForm.attrValueList.push(
        // 这个对象是准备收集的属性值，只不过现在没有用户输入数据，占位
        // 添加这个对象是为了显示一个输入框去收集这个对象
        {
          attrId: this.attrForm.id, //属性值所属属性的id 也就是attrForm的id
          valueName: "",
          //添加是为true
          isEdit: true, 
        }
      );
          //添加新的属性值，创建一个新的input，并自动获取焦点
      this.$nextTick(() => {
        this.$refs[this.attrForm.attrValueList.length - 1].focus();
      });
    },

    //点击修改属性的按钮
    showUpdateDiv(row) {
      this.isShowList = false;
      // this.attrForm = {...row}  
      //数据中有对象，用深拷贝
      this.attrForm = cloneDeep(row);

      this.attrForm.attrValueList.forEach((item) => {
      // $set响应式属性
      // 对于后期添加的新属性，那么要这么添加才是响应式属性
      this.$set(item, "isEdit", false);
    });


    },

    //点击span切换为编辑模式
    toEdit(row,index){
      //赋值很快，创建dom很慢
      row.isEdit=true;
      //添加自动获取焦点
      this.$nextTick(()=>{
        this.$refs[index].focus()
      })
    },

    // input失去焦点或者键盘抬起切换为查看模式
    toLook(row){
      //编辑模式前要对输入内容进行验证
       // 1、输入的数据必须有值
      if (row.valueName.trim() === "") {
        this.$message.warning("输入的数据不能为空");
        row.valueName = "";
        return;
      }

      //2、输入的数据除了自身以外，其它不能有相同
        let isRepeat = this.attrForm.attrValueList.some((item) => {
        if (row !== item) {
          return item.valueName === row.valueName;
        }
      });
        if (isRepeat) {
        this.$message.warning("输入的数据不能和其它的重复");
        return;
       }
        row.isEdit = false;
    },

    //保存属性
    async addOrUpdateAttr(){
      //1、拿参数
     let attr = this.attrForm;
      //整理参数
      // 1、如果属性值没有值 那就是空串，删除这个对象
      // 2、去除参数中多余的参数，比如自己加的isEdit

      // 3、如果属性当中属性值列表没有属性值对象 不发请求
      attr.attrValueList = attr.attrValueList.filter((item) => {
      if (item.valueName !== "") {
        delete item.isEdit;
        // 返回条件为真的数组
          return true;
        }
      });

      if (attr.attrValueList.length === 0) {
        this.$message.warning("属性值必须有东西");
        return;
      }

    //发请求
    //成功干啥失败干啥
    try{
      const result=await this.$API.attr.addOrUpdate(attr);
      if(result.code === 200){
        //提示
        this.$message.success('添加或修改属性成功')
        //跳转
        this.isShowList=true;
        //重新获取数据
        this.getAttrList()
      }else{
        this.$message.error('添加或者修改属性失败')
      }
    }catch(error){
      this.$message.error('请求添加或修改属性失败')
    }
  },

  // 删除属性
  async deleteAttr(row){
    try{
      const result = await this.$API.attr.delete(row.id)
      if(result.code===200){
        this.$message.success('删除属性成功')
        this.getAttrList()
      }else{
        this.$message.error('删除属性失败')
      } 
    }catch(error){
      this.$message.error('请求删除属性失败')
    }
  }

}
}
</script>
