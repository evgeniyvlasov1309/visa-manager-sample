const path = require("path");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env) => ({
    entry: ["./src/scripts/Index.tsx"],
    mode: env.production ? "production" : "development",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.[fullhash].js",
        publicPath: "/",
        clean: true,
    },
    devServer: {
        port: 3000,
        compress: true,
        host: "0.0.0.0",
        //hot: true,
        static: "./dist",
        allowedHosts: "all",
        historyApiFallback: true,
    },
    watchOptions: {
        poll: true,
    },
    module: {
        rules: [
            {
                test: /\.(js|ts)x?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.(scss|css)$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            },
        ],
    },
    devtool: !env.production && "inline-source-map",
    optimization: {
        minimizer: [`...`, new CssMinimizerPlugin()],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            favicon: "./favicon.png",
        }),
        new MiniCssExtractPlugin({
            filename: "bundle.[fullhash].css",
        }),
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js", ".png", ".svg"],
        alias: {
            "@styles": path.resolve(__dirname, "src/styles"),
            "@shared": path.resolve(__dirname, "src/scripts/shared"),
            "@pages": path.resolve(__dirname, "src/scripts/pages"),
            "@scripts": path.resolve(__dirname, "src/scripts"),
            "@assets": path.resolve(__dirname, "src/assets"),
        },
    },
});
