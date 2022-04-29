const path = require('path')
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin')
module.exports = ({ config, mode }) => {
    config.resolve.alias = {
        ...config.resolve.alias,
    }
    config.module.rules.push({
        include: path.resolve(__dirname, '../src'),
        // use: [
        //     {
        //         loader: require.resolve('awesome-typescript-loader'),
        //     },
        // ],
        test: /\.(ts|tsx)$/,
    })
    config.resolve.extensions.push('.ts', '.tsx')
    config.module.rules.push({
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: [
            {
                loader: require.resolve('awesome-typescript-loader'),
                query: {
                    name: '[name].[ext]',
                },
            },
        ],
        include: path.resolve(__dirname, '../public'),
    })
    config.resolve.plugins = [new TsconfigPathsPlugin({ extensions: config.resolve.extensions })]
    return config
}
