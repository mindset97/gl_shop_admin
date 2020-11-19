<template>
  <div>
    <el-card>
      <CategorySelector
        :isShowList="isShowList"
        @changeCategory="changeCategory"
      ></CategorySelector>
    </el-card>

    <el-card style="margin-top: 20px">
      <!-- 列表相关 -->
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button type="primary" icon="el-icon-plus" @click="showAddSpuForm">添加SPU</el-button>
        <el-table :data="spuList" border style="width: 100%">
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="warning"
                size="mini"
                title="添加SKU"
                icon="el-icon-plus"
                @click="showAddSkuForm(row)"
              ></HintButton>
              <HintButton
                type="primary"
                size="mini"
                title="修改SPU"
                icon="el-icon-edit"
                @click="showUpdateSpuForm(row)"
              ></HintButton>
              <HintButton
                type="info"
                size="mini"
                title="查看SPU所有的SKU"
                icon="el-icon-info"
              ></HintButton>
              <HintButton
                type="danger"
                size="mini"
                title="删除SPU"
                icon="el-icon-delete"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="getSpuList"
          style="text-align: center"
          :pager-count="7"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout=" prev, pager, next, jumper, ->, sizes,total"
          :total="total"
        >
        </el-pagination>
      </div>

      <SpuForm v-show="isShowSpuForm"></SpuForm>
      <SkuForm v-show="isShowSkuForm"></SkuForm>

    </el-card>
  </div>
</template>

<script>
import SpuForm from './components/SpuForm'
import SkuForm from './components/SkuForm'
export default {
  components:{
    SpuForm,
    SkuForm
  },
  name: "Spu",
  data() {
    return {
      isShowList: true, //控制三级分类可操作性的数据

      category1Id: "",
      category2Id: "",
      category3Id: "",
      spuList: [],
      page: 1,
      limit: 3,
      total: 0,

      //控制三个页面切换显示和隐藏的数据
      isShowSpuForm:false,
      isShowSkuForm:false,
    };
  },
  methods: {
    changeCategory({ categoryId, level }) {
      if (level === 1) {
        this.category2Id = "";
        this.category3Id = "";
        this.spuList = [];
        this.category1Id = categoryId;
      } else if (level === 2) {
        this.category3Id = "";
        this.spuList = [];
        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },

    //请求获取spu列表数据
    //常放promise对象表达式
    async getSpuList(page = 1) {
      this.page = page;
      try {
        const result = await this.$API.spu.getList(
          this.page,
          this.limit,
          this.category3Id
        );
        if (result.code === 200) {
          this.spuList = result.data.records;
          this.total = result.data.total;
        } else {
          this.$message.error("获取spu列表失败");
        }
      } catch (error) {
        this.$message.error("请求获取spu列表失败");
      }
    },

    handleSizeChange(size) {
      this.limit = size;
      this.getSpuList();
    },

    //点击添加Spu按钮
    showAddSpuForm(){
      this.isShowSpuForm = true
    },
    //点击修改Spu按钮
    showUpdateSpuForm(row){
      this.isShowSpuForm = true
    },
    //点击添加Sku按钮
    showAddSkuForm(row){
      this.isShowSkuForm = true
    }

  },
};
</script>

