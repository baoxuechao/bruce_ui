import request from '@/router/axios';
import { baseUrl } from '@/config/env';

export const getList = () => request({
    url: baseUrl + '/admin/menu/list',
    method: 'get'
})

export const delMenu = (id) => request({
    url: baseUrl + '/admin/menu/delMenu?id=' + id,
    method: 'delete'
})

export const addObj = (data) => request({
    url: baseUrl + '/admin/menu/editMenu',
    method: 'post',
    data: data
})

export const getTree = () => request({
    url: baseUrl + '/admin/menu/getMenuTree',
    method: 'get'
})
