import axios from 'axios';

axios.defaults.baseURL = 'https://simulator-api.onrender.com/v1';
axios.headers = { "Content-type": "application/json" }

const getSims = (params) => {
    return axios.get('/sims', {params})
};
const get = (id) => {
    return axios.get(`/sims/${id}`);
};
const create = (data) => {
    return axios.post("/batches", data);
};
const update = (id, data) => {
    return axios.put(`/sims/${id}`, data);
};
const findByName = (name) => {
    return axios.get(`/sims?search=${name}`);
};

const SimServices = { getSims, get, create, update, findByName };

export default SimServices