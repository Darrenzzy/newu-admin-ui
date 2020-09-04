#!/bin/bash

npm run build:prod

cd /Users/darren/go/src/service/view
git add .
it commit -am "update code"
git push


