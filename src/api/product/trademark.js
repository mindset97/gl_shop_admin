import request from '@/utils/request'
export default {
  // DELETE /admin/product/baseTrademark/remove/{id}
  // 删除BaeTrademark
  delete(id){
    // return request({
    //   url:`/admin/product/baseTrademark/remove/${id}`,
    //   method:'delete'
    // })
    return request.delete(`/admin/product/baseTrademark/remove/${id}`)
  },

  //以后添加一个资源，不需要id  但是修改一个资源是有id的   （id不是咱们自己给随意给的，是后端数据库添加自动分配的）
  // POST /admin/product/baseTrademark/save
  // 新增BaseTrademark
  // PUT /admin/product/baseTrademark/update
  // 修改BaseTrademark
  addOrUpdate(trademark){
    if(trademark.id){
      return request.put('/admin/product/baseTrademark/update',trademark)
    }else{
      return request.post('/admin/product/baseTrademark/save',trademark)
    }
  },

  // GET /admin/product/baseTrademark/{page}/{limit}
  // 分页列表
  
  getPageList(page,limit){
    return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
  }

}

// {default:{}}
