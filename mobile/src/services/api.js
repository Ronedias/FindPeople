import axios from 'axios';


const api = axios.create({
    // para aplicação emulada no android pelo avd do android studio caso não funcione troque o ip 
    //para 10.0.2.2
    baseURL: 'http://192.168.0.106:3333',
});


export default api;