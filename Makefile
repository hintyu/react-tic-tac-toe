setup: 
	npm install
build:
	echo "build"
run:
	node src/index.js
lightdocker:
	make setup
	make build
	make run
