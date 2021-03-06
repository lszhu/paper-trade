import Config from '../../config'
import config from '../config'
import singleton from '../../common/singleton'
const { mainDB } = singleton
const tokenSql = "SELECT wf_token.TokenID,wf_token.ClientType,wf_token.MemberCode,wf_token.TokenValue,wf_token.ValidityTime,wf_member.Status FROM wf_token LEFT JOIN wf_member ON wf_member.MemberCode=wf_token.MemberCode WHERE wf_token.TokenValue=?";
const updateTokenSql = "UPDATE wf_token set ValidityTime=? WHERE TokenID=?";

function updateToken(tokenId) {
    mainDB.query(updateTokenSql, { replacements: [new Date(), tokenId] })
}
async function checkToken(token, isLogin) {
    let result = 0
    let memberCode = ""
    let tokenModel = await mainDB.query(tokenSql, { replacements: [token], type: "SELECT" })
    tokenModel = tokenModel[0]
    if (isLogin) {
        if (!token) {
            result = { Status: 40012, Explain: "Token 不能为空" }
        } else {
            if (tokenModel) {
                memberCode = tokenModel.MemberCode
                if (Date.parse(tokenModel.ValidityTime) + config.tokenTime * 60 < new Date().getTime()) {
                    result = { Status: 40012, Explain: "您还没有登录，请登录后操作" }
                } else if (tokenModel.Status != 1) {
                    result = { Status: 40012, Explain: "您的账号已经停用,如有疑问请联系客服!" }
                } else {
                    updateToken(tokenModel.TokenID)
                }
            } else {
                result = { Status: 40012, Explain: "您的登录已丢失,请重新登录" }
            }
        }
    } else {
        memberCode = tokenMode.MemberCode
        updateToken(tokenModel.TokenID)
    }
    return { result, memberCode, token }
}
//token验证中间件

function checkLogin(isLogin) {
    return async function(req, res, next) {
        let { result, memberCode, token } = await checkToken(req.header('Token') || req.params.Token, isLogin)
        req.memberCode = memberCode
        req.token = token
        if (result === 0) next()
        else res.send(result)
    }
}
export default checkLogin