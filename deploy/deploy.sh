#!/bin/bash
git config --global push.default simple # we only want to push one branch — master
# specify the repo on the live server as a remote repo, and name it 'production'
# <user> here is the separate user you created for deploying
git remote add production ssh://pepo4343@203.146.251.194:22~/ubuntu_server/fit_nodejs
git push production master # push our updates