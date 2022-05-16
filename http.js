
const axios = require('axios');

const http = axios.create({
    baseURL:"https://api.github.com/"
})

http.interceptors.request.use(config=>{
    config.headers.post['Content-Type'] = 'application/x-www-fromurlencodeed'
    if(this.token){
        config.headers['Authorization'] = 'bearer' + token
    }
    return config
},err=>{
    Promise.reject(err)
})

/**
 * ge Issues under a specific repo
 */
async function getIssues(username,repo){
    if(repo === '' || repo === undefined) return new Error("require repo name")
    if(username === '' || username === undefined) return new Error("require username")
    let issues;
    // https://api.github.com/repos/OWNER/REPO/issues
    let url = `repos/${username}/${repo}/issues`
    try{
        issues = await http.get(url)
    }catch(err){
        throw(err)
    }
    return issues === undefined ? new Error("issues problem") : issues.data
}
async function getLables(username,repo){
    if(repo === '' || repo === undefined) return new Error("require repo name")
    if(username === '' || username === undefined) return new Error("require username")
    let labels;
    let url = `repos/${username}/${repo}/labels`
    try{
        labels = await http.get(url)
    }catch(err){
        throw(err)
    }
    return labels === undefined ? new Error("labels problem") : labels.data
}
module.exports = {
    getIssues:getIssues,
    getLables:getLables,
    http:http
}