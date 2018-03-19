# musclr-server

## How to run this server?

1. Don't forget the npm i, without the node_modules, it won't work
2. In the config folder, add a config.json file with the following format:

```json
{
		"test": {
				"PORT": 3000,
				"MONGODB_URI": "mongodb://localhost:27017/**YOUR_TEST_DATABASE**",
				"JWT_SECRET": "**A_RANDOM_STRING**"
		},
		"development": {
				"PORT": 3000,
				"MONGODB_URI": "mongodb://localhost:27017/**YOUR_DATABASE**",
				"JWT_SECRET": "**A_RANDOM_STRING**"
		}
}
```

3. Run with npm start. Check the package.json for other scripts
