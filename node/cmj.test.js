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

it('handles failure to fetch data with error response', async () => {
    mock.onGet("http://jsonplaceholder.typicode.com/posts").reply(() => {
        return [403, null]
    })

    await expect(fetchPosts()).rejects.toEqual("error")

});

it('handles failure to fetch data with 201 response', async () => {
    mock.onGet("http://jsonplaceholder.typicode.com/posts").reply(() => {
        return [201, null]
    })
    await expect(fetchPosts()).rejects.toEqual("non 200 status")


});