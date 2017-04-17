/**
 * @file axios.config
 * Created by haner on 2017/4/1.
 * @brief
 */


import axios from 'axios';
import layer from 'layui-layer';
import store from '../stores';
import Storage from '../commons/utils/storage';
import * as types from '../stores/mutation-types';

axios.PARK_API = '/v3'; //api 地址配置   //http://180.97.80.42:9090/v3';

//请求拦截器
axios.interceptors.request.use(config => {
    let user = Storage.get(Storage.TOKEN);
    user && user.token && (config.data['token'] = user.token);
    config.headers['Accept-Version'] = 'v3.0';
    config.headers['Parkingwang-Client-Source'] = 'ParkingWangAPIClientWeb';
    layer.load(2);
    return config;
  },
  err => {
    return Promise.reject(err);
  });


//响应拦截器
axios.interceptors.response.use(response => {
    layer.closeAll('loading');

    if (!response.data) layer.msg('Server Error');

    if (response.data.status && response.data.status === 502) { //信息过时
      layer.msg('用户信息失效，需重新登录！');
      store.commit(types.USER_LOGOUT);
    }
    return response.data;
  },
  error => {
    layer.closeAll('loading');
    return Promise.reject(error.response)
  }
);