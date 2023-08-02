import express from 'express';
//import eventsHandler from '@/server/events'
//import webhookHandler from '@/server/webhook'
var app = express();
app.get('/hello-world', function (req, res) {
    res.send("Hello, World!");
});
// app.get('/issues/:issueId/events', eventsHandler)
// app.post('/webhook', webhookHandler)
export default app;
