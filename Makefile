all:
	npm install --save alexa-sdk
	cd src; zip -r data * ../node_modules/ ; mv data.zip ../data.zip


