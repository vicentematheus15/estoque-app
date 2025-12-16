import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333'
           // 'http://IP DA MAQUINA QUE VAI PASSAR PROS CELULARES:3333'
});

export default api;