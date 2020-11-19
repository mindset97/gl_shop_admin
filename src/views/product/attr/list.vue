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
              <el-Button
                type="danger"
                icon="el-icon-delete"
                title="删除属性"
                size="mini"
              ></el-Button>
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
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-Button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除属性值"
              ></el-Button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 保存取消按钮 -->
        <el-button
          type="primary"
          :disabled="attrForm.attrValueList.length === 0"
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
          valueName: ""
        }
      );
    },

    //点击修改属性的按钮
    showUpdateDiv(row) {
      this.isShowList = false;
      // this.attrForm = {...row}  
      //数据中有对象，用深拷贝
      this.attrForm = cloneDeep(row);
    },

 
  }
};
</script>
