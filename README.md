# Vusion App

## Development

``` shell
npm install
vusion dev
```
## Config
首先配置nginx，
``` shell
nginx -c yourFolderPath/nginx.config
```
然后启动mongoDB
然后启动后台程序
``` shell
node server/app
```
然后启动vusion-cli
```
vusion dev -O
```


