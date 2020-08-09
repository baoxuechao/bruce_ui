import request from '@/router/axios';
import { baseUrl } from '@/config/env';
import qs from 'qs';

export const loginByUsername = (username, password, code, redomStr) => {
    let dataObj = qs.stringify({'grant_type': 'password', 'client_id': 'client-app', 'client_secret': '123456', 'username': username, 'password': password})
    return request({
        url: baseUrl + '/auth/oauth/token?code=' + code + '&redomStr=' + redomStr,
        method: 'post',
        meta: {
            isToken: false
        },
        data: dataObj
    })
}

export const getUserInfo = () => request({
    url: baseUrl + '/admin/user/getUserInfo',
    method: 'get'
});

export const refeshToken = () => request({
    url: baseUrl + '/user/refesh',
    method: 'post'
})

export const getMenu = (parentId) => request({
    url: baseUrl + '/admin/menu/getMenu?parentId=' + parentId,
    method: 'get'
});

export const getTopMenu = () => request({
    url: baseUrl + '/admin/menu/getTopMenu',
    method: 'get'
});

export const sendLogs = (list) => request({
    url: baseUrl + '/user/logout',
    method: 'post',
    data: list
})

export const logout = () => request({
    url: baseUrl + '/user/logout',
    meta: {
        isToken: false
    },
    method: 'get'
})
