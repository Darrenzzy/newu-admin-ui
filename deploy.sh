#!/bin/bash
  yarn build:prod
  cd ./dist
  module_name='admin'
  tar cvzf "$module_name".tar.gz ./*

  scp "$module_name".tar.gz nuoyou:/www/wwwroot/admin.newuinvest.com

  ssh nuoyou /www/wwwroot/admin.newuinvest.com/restart.sh


