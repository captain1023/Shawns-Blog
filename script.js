const service = require('./http.js')
const fs = require('fs')
const path = require('path')
const colors = require('colors');
const token = "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"


let blog;
let labels;
let username = 'captain1023'
let repo = 'Shawns-Blog'
/**
 * 从命令行拿到access token,username,repo
 */
function login(){
    // //从命令行拿到access token 和 user name
    // service.test()
    // service.test1()
    const argv = process.argv.slice(2)
    console.log("from terminal".red)
    console.log(argv)
}

async function getIssues(){
    //TODO:需要从Issues中根据pull_request把pull的request过滤出来
    let issues = await service.getIssues('captain1023',repo)
    blog = issues
}

async function getLables(){
    let res = await service.getLables('captain1023',repo)
    labels = res
    console.log(labels)
}

function filterIssuesByLabels(issues,label){
    if(issues === undefined || issues === null) return
    if(labels === '' || labels === undefined) return
    let res = issues.filter((issue)=>{
        //issues是个数组
        //labels也是个数组
        let labels = issue.labels
        if(labels.length === 0){
            //TODO:没有标签
        }
        for(let i = 0;i < labels.length;i++){
            if(labels[i].name === label) return true
        }
        return false
    })
    return res
}
function updateReadMe(summary,coverPage,top,content){
    //更新readMe
    //可以改成filter写 方便维护
    let text = summary + coverPage + top + content
    fs.readFile('README.md','utf8',(err,data)=>{
        if(err) throw err;
        console.log(data)
        fs.writeFile('README.md',text,(err)=>{
            if(err) throw(err)
            console.log('udpate success'.green)
        })

    })

}

function formatIssuesWithLabels(){
    //剩余的issues
    // let HTML = `<details>
    // <summary>${title}</summary>
    // 拼接部分
    // </details>`
    let HTML = ''
    labels.forEach(label=>{
        // console.log(label)
        HTML += '<details>'
        HTML += `<summary>${label.name}</summary>`
        let issueArray = filterIssuesByLabels(blog,label.name)

        issueArray.forEach(issue=>{
            let issueStr = formatIssues(issue)
            HTML += `<h4>${issueStr}</h4>`
        })
        HTML += '</details>'
    })
    return HTML
}

function bundle_summary_sction(){
    //顶部总结部分
    // console.log(labels)
    let total_lable_count = labels.length

    let content = `
<p align='center'>
    <img src="https://badgen.net/badge/labels/${total_lable_count}"/>
    <img src="https://badgen.net/github/issues/${username}/${repo}"/>
    <img src="https://badgen.net/github/forks/${username}/${repo}"/>
    <img src="https://badgen.net/github/stars/${username}/${repo}"/>
    <img src="https://badgen.net/github/watchers/${username}/${repo}"/>
    <img src="https://badgen.net/github/release/${username}/${repo}"/>
</p>
\t\r
`
    // console.log(content)
    return content
}

function sup(text){
    return `<sup>${text}</sup>`
}

function bundleTopIssues(){
    //置顶标签
    let issues = filterIssuesByLabels(blog,':+1:置顶')
    let content = '\t\r## :thumbsup: 置顶\t\r'
    for(let i = 0;i<issues.length;i++){
       content += formatIssues(issues[i]) 
    }
    // console.log(content)
    return content
}

function formatIssues(issue){
    let comment = sup(issue.comments + ':speech_balloon:')
    return `- ${issue.title} ${issue.html_url} ${comment} \t\n`
}
function bundleRencentIssues(){
    //最近更新
}

function cover(){
    let content = `\t\r<h3 align='center'>欢迎来到我的博客,一个记录自己成长的地方,如果有什么文章对您有一点点帮助,烦请stat🙏🙏🙏</h3>\t\r`
    return content
}

async function main(){
    login()
    await getIssues()
    await getLables()
    let summary = bundle_summary_sction()

    let coverPage = cover()

    let top = bundleTopIssues()
    let content = formatIssuesWithLabels()
    console.log(content)
    updateReadMe(summary,coverPage,top,content)
}
main()