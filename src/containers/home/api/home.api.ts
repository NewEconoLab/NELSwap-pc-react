import request from 'utils/request';

/**
 * 查询资产
 * @param str 输入的内容
 */
export const searchSomething = (str:string)=>{
  const opts = {
    method:'fuzzysearchasset',
    params:[
      str
    ]
  }
  return request(opts)
}