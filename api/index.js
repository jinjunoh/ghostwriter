const {Configuration, OpenAiApi} = require('openai');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const token = process.env.API_TOKEN;
const config = new Configuration({apiKey: token});
const openai = new OpenAiApi(config);

const app = express();
app.use(bodyParser.json());
app.post('/write', (req, res) => {
    const{message, style} = req.body; // message is the input from the user, style is how the system will answer
    openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {role: "system", content: style},
            {role: 'user', content: message}
        ]
    }).then((data) => {
        res.send(data.data.choices[0].message.content);
    }).catch((err)=> {
        console.log(err);
    })
})
