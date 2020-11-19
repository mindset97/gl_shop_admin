import request from '@/utils/request'
export default {
  // GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
  // attrInfoList
  getList(category1Id,category2Id,category3Id){
    return request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  },

  // DELETE /admin/product/deleteAttr/{attrId}
  // deleteAttr
  delete(attrId){
    return request.delete(`/admin/product/deleteAttr/${attrId}`)
  },

  // POST /admin/productveAttrInfo
  // saveAttrInfo
  //添加修改一体化
  addOrUpdate(attr){
    return request.post(`/admin/productveAttrInfo`,attr)
  }
}

// {
//   "attrName": "string",
//   "attrValueList": [
//     {
//       "attrId": 0,
//       "id": 0,
//       "valueName": "string"
//     }
//   ],
//   "categoryId": 0,
//   "categoryLevel": 0,
//   "id": 0
// }