const {Configuration, OpenAiApi} = require('openai');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const token = process.env.API_TOKEN;
const config = new Configuration({apiKey: token});
const openai = new OpenAiApi(config);

const app = express();
app.use(bodyParser.json());
let messages = [];

app.post('/write', (req, res) => {
    const{message, style} = req.body; // message is the input from the user, style is how the system will answer
    messages.push([
            {role: "system", content: style},
            {role: 'user', content: message}
    ])
    getComm(res);
})

function gptComm(res){
    openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages
    }).then((data) => {
        messages.push(
            {role: "assistant", content: data.data.choices[0].message.content}
        );
        if(data.data.choices[0].finish_reason !== "stop"){
            message.push(
                {role: "user", content: 'continue'}
            );
            getSelectionRange(res);
        } else{
            res.send(messages.filter((message) => message.role === "assistant").map((message)=> message.content));
        }
    }).catch((err)=> {
        console.log(err);
    });
}
