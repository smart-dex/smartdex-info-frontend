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
	make build-image