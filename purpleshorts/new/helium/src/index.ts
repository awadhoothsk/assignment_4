import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

// app.get('/', (c) => {
//   return c.text('Hello Hono!')
// })

// serve({
//   fetch: app.fetch,
//   port: 3000
// }, (info) => {
//   console.log(`Server is running on http://localhost:${info.port}`)
// })

app.get('/random', (context) => {
  let random = Math.floor(Math.random() * 100)
  return context.json({ random }, 200)  
})

app.get('/time', (context) => {
  return context.json({ time: new Date().toISOString() }, 200)
})
app.get('/envirment', (context) => {
  const envir = process.platform
  const version = process.version
  return context.json({ platform:envir, version: version }, 200)
})

// app.get('/puppet', (context) => {
//   const puppet=url.get
//   return context.json({ puppeteer: 'done' }, 200) 
// })

const nummbers : number[] = [];
app.post('/store-number', async (context) => {
  const body = await context.req.json();
  const number = body.number;
  nummbers.push(number);
  return context.json({ stored: number }, 200);
});
app.get('/get-number', (context) => {
  return context.json({ numbers: nummbers }, 200);
}
);
serve(app);