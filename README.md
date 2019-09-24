# Visual Regression Test
Using BackstopJS library 

- `npm run vrt` run all available visual tests (with dev server already started)
- `npm run vrt:ci` run all available visual tests without showing test report
- `npm run vrt:coverage` start dev server and run all available visual tests
- `npm run vrt:approve` approve changes

## Useful command with vrt/backstop.js
- `node vrt/backstop --test --codeModule=src/pages/daenerys/vrt` run visual tests for a particular code module (with dev server already started), can be used when developing an independent module
- `node vrt/backstop --reference` equivalent to `backstop reference`


# build
1. npm init -y
2. npm i --S express cors axios
3. do sth for file index.js
4. npx create-react-app client
5. cd client && npm i --S axios
6. config 2 file package + npm run dev
7. create new app on heroku
8. npm i -g heroku + heroku login
9. remove .git in folder client (git bash: rm -rf .git) 
10. git init, heroku git:remote.. , git add . , git commit , git push heroku master
11. add db mlab for heroku: 
    + create db using plan 
    + create user 
    + heroku config:set MONGOLAB_URI=mongodb://tora:Nguyendinhtin2701@ds133162.mlab.com:33162/awesome-app
12. mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/awesome-app');

* using `heroku logs` to log error or success
