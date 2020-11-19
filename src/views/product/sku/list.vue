<template>
  <el-card>
      <CategorySelector @changeCategory="changeCategory"></CategorySelector>
    </el-card>
</template>

<script>
export default {
  name: 'Sku',
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
        categoryLevel: 3,
      },
    };
  },
  methods:{
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
  }
}
</script>


