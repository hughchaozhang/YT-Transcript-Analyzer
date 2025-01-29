Your First API Call
The DeepSeek API uses an API format compatible with OpenAI. By modifying the configuration, you can use the OpenAI SDK or softwares compatible with the OpenAI API to access the DeepSeek API.


| PARAM        | VALUE                        |
| ------------ | ---------------------------- |
| base_url *   |  https://api.deepseek.com    |
| api_key      |  apply for an API key        |

* To be compatible with OpenAI, you can also use https://api.deepseek.com/v1 as the base_url. But note that the v1 here has NO relationship with the model's version.

* The deepseek-chat model has been upgraded to DeepSeek-V3. The API remains unchanged. You can invoke DeepSeek-V3 by specifying model='deepseek-chat'.

* deepseek-reasoner is the latest reasoning model, DeepSeek-R1, released by DeepSeek. You can invoke DeepSeek-R1 by specifying model='deepseek-reasoner'.

Invoke The Chat API
Once you have obtained an API key, you can access the DeepSeek API using the following example scripts. This is a non-stream example, you can set the stream parameter to true to get stream response.

with node.js

```
// Please install OpenAI SDK first: `npm install openai`

import OpenAI from "openai";

const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: '<DeepSeek API Key>'
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: "Hello!" }],
    model: "deepseek-chat",
  });

  console.log(completion.choices[0].message.content);
}

main();
```

more details with chat-completion api call here: [DeepSeek API Documentation](https://api-docs.deepseek.com/api/create-chat-completion)
