ifndef u
u:=sotatek
endif

ifndef env
env:=dev
endif

OS:=$(shell uname)

build-image:
	docker build -t pancake-info .
	docker tag pancake-info registry-server:5000/pancake-info:latest
	docker push registry-server:5000/pancake-info:latest

deploy:
	npm run build
	rsync -a build  sotatek@192.168.1.206:/var/www/test/smartdex-info

deploy-staging:
	npm run build
	rsync -a build  ubuntu@35.73.146.166:/var/www/smart-dex/smartdex-info