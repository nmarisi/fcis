
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const mock = new MockAdapter(axios);
const fetchPosts = require('./cms').fetchPosts

it('handles fetching empty posts', async () => {
    mock.onGet("http://jsonplaceholder.typicode.com/posts").reply(() => {
      return [200, []]
    })
    const data = await fetchPosts()
    expect(data).toEqual([])
});