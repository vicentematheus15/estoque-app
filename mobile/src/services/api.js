import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.2:3333'
  //  http://localhost:3333 para testar com o axpo pelo celular

export default api;