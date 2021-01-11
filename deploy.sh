#!/bin/bash
  yarn build:prod
  cd ../service/view
  module_name='admin'
  tar cvzf "$module_name".tar.gz admin

  scp "$module_name".tar.gz root@119.28.10.43:/www/wwwroot/admin.newuinvest.com

  ssh root@119.28.10.43 /www/wwwroot/admin.newuinvest.com/restart.sh

