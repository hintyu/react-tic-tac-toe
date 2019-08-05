setup: 
	npm install
build:
	echo "build"
run:
	npm start
lightdocker:
	make setup
	make build
	make run
