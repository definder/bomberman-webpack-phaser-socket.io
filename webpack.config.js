var webpack = require("webpack");
var path = require("path");

module.exports = {
    entry: "./public/app/main.js",
    resolve: {
        modulesDirectories: [
            "./public/app/"
        ]
    },
    output: {
        path: path.join(__dirname, "public"),
        filename: "bundle.js"
    }
};
