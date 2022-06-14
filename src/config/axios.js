import axios from 'axios'

// const port = 'http://ec2-34-230-75-13.compute-1.amazonaws.com:8080';
// const port = 'http://localhost:8030';
const port = process.env.VUE_APP_API_URL;

const instance = axios.create({
    baseURL: port,
    timeout: 1500000
})

export default instance