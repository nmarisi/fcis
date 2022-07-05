// Get CMS data from external REST API and store it in a file
const fs = require('fs')
const axios = require('axios').default
const CMS_URL = 'http://jsonplaceholder.typicode.com/posts'

async function fetchPosts() {
    let res;
    try {
        res = await axios.get(CMS_URL);
    } catch (err) {
        console.log('An error occurred getting the post data', err)
        return Promise.reject('error')
    }

    console.log('Getting CMS data')
    if (res.status !== 200) {
        console.log('Error occurred, status =', res.status)
        return Promise.reject('non 200 status')
    }
    return res.data;
}

module.exports = {
    fetchPosts: fetchPosts,

    main: async function (context) {
        try {
            let postData = await fetchPosts();

            let today = new Date()
            today = today.toISOString().slice(0, 10)
            let {summary} = produceSummary(postData)
            fs.writeFileSync('cms-' + today + '.json', JSON.stringify(summary))
            console.log('Wrote CMS report')
            return Promise.resolve(true)

        } catch (err) {
            console.log('An error occurred getting the post data', err)
            return Promise.reject('error')
        }

        function produceSummary(data) {
            console.log('CMS data has: ', data.length, 'records')
            let summary = {posts: data.length, users: 0, posts_per_user: 0}
            const users = new Set(data.map((item)=> item.userId))

            summary.users = users.size
            summary.mean_posts_per_user = Math.round(data.length / summary.users)
            return {summary}
        }
    }
}
