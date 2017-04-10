let config = {
    port: 10002,
    tokenTime: 14400000,
    clientInitAll: { forceUpdate: 2.4, quotation: { source: "sina" }, dbVersion: 1 }, //所有客户端配置
    clientInitDefault: {

    }, //默认配置
    clientInit: { //特定版本客户端配置
        "2.5": { showTrade: false }
    },
    FinancialIndex: {
        us: [{ Title: "", URL: "" }],
        hk: [{ Title: "", URL: "" }],
        hs: [{ Title: "", URL: "" }],
        get sz() {
            return this.hs
        },
        get sh() {
            return this.hs
        }
    },
    EveryDayURL: "http://h5.wolfstree.tv/"
}

if (process.env.NODE_ENV === "production") {
    Object.assign(config, require('./pconfig.js'))
}
for (let k in config.clientInit) {
    config.clientInit[k] = Object.assign(Object.assign(Object.assign({}, config.clientInitDefault), config.clientInit[k]), config.clientInitAll)
}
export default config