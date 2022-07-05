// Get CMS data from external REST API and store it in a file
const fs = require('fs')
const axios = require('axios').default
const CMS_URL = 'http://jsonplaceholder.typicode.com/posts'

module.exports = {
  fetchPosts:  async function() {
    const res = await axios.get(CMS_URL)
    console.log('Getting CMS data')
    if (res.status !== 200) {
      console.log('Error occurred, status =', res.status)
      return undefined;
    }
    return res.data;
  },

  main: async function(context) {
    try {
      let postData = await this.fetchPosts();

      let today = new Date()
      today = today.toISOString().slice(0, 10)
      let { summary } = produceSummary(postData)
      fs.writeFileSync('cms-' + today + '.json', JSON.stringify(summary))
      console.log('Wrote CMS report')
      return Promise.resolve(true)

    } catch (err) {
      console.log('An error occurred getting the post data', err)
      return Promise.reject('error')
    }

    function produceSummary(data) {
      console.log('CMS data has: ', data.length, 'records')
      let summary = { posts: 0, users: 0, posts_per_user: 0 }
      let users = []
      for (let i = 0; i < data.length; i++) {
        // console.log('processing record', i, 'for user', res.data[i].userId)
        summary.posts++
        if (!users.includes(data[i].userId)) {
          users.push(data[i].userId)
        }
      }
      summary.users = users.length
      summary.mean_posts_per_user = Math.round(summary.posts / summary.users)
      return  { summary }
    }
  }
}
