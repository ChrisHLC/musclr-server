# musclr-server

## How to run this server?

### Install MongoDB
1. Install the MongoDB Community Server:  [Download](https://www.mongodb.com/download-center?jmp=nav#community)
2. Check the installation tutorial: [Tutorial](https://docs.mongodb.com/manual/administration/install-community/), on windows for example you need to run the following command in a Command Prompt :md \data\db in C:\Program Files\MongoDB\Server\3.6\ (or the place where you installed it)

### Node
1. Don't forget the npm i, without the node_modules, it won't work
2. In the config folder, add a config.json file with the following format adn replace the data in uppercase:

```json
{
		"test": {
				"PORT": 3000,
				"MONGODB_URI": "mongodb://localhost:27017/YOUR_TEST_DATABASE",
				"JWT_SECRET": "A_RANDOM_STRING"
		},
		"development": {
				"PORT": 3000,
				"MONGODB_URI": "mongodb://localhost:27017/YOUR_DATABASE",
				"JWT_SECRET": "A_RANDOM_STRING"
		}
}
```
3. Launch mongod.exe (otherwise you will have the "something went wrong in your console")
4. Run with npm start. Check the package.json for other scripts
