import request from 'utils/request';

/**
 * 获得资产列表
 * @param page 页数
 * @param size 条数
 */
export const getAssectList = (page: number, size: number) =>
{
    const opts = {
        method: 'getAssetList',
        params: [
            "",
            page,
            size
        ]
    }
    return request(opts);
}

/**
 * 模糊搜索资产列表
 * @param value 搜索值
 * @param page 
 * @param size 
 */
export const searchLikeAssetList = (value: string, page: number, size: number) =>
{
    const opts = {
        method: 'getAssetList',
        params: [
            value,
            page,
            size
        ]
    }
    return request(opts);
}