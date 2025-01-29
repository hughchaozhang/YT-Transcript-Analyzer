
[Serp Youtube Search API Documentation](https://serpapi.com/youtube-search-api)

example Javascript code:

```javascript
const { getJson } = require("serpapi");

getJson({
  engine: "youtube",
  search_query: "star wars",
  api_key: "9c2f56aa8860cda8a15ca53ff4a637c954640c9f6dbbab868c6e8b926da5d42d"
}, (json) => {
  console.log(json["movie_results"]);
});
```
SERP_API_KEY is stored in the environment variables.
