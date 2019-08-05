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
        lighthouse http://localhost:3000 --output=json
