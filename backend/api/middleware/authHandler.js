import RestStatus from "http-status-codes";
import { rest, oauthUtil } from "blockapps-rest";
import jwtDecode from "jwt-decode";
import config from "../../load.config";
import constants from "../../helpers/constants";
import dappJs from "../../dapp/dapp/dapp";
import oauthHelper from "../../helpers/oauthHelper";

class AuthHandler {
  static authorizeRequest(req, res, next) {
    return async (req, res, next) => {
      const tokenName = req.app.oauth.getCookieNameAccessToken();
      const accessTokenFromCookie = req.cookies[tokenName];
      if (!accessTokenFromCookie) {
        return rest.response.status(RestStatus.UNAUTHORIZED, res, {
          loginUrl: req.app.oauth.getSigninURL()
        });
      }
      try {
        await req.app.oauth.validateAndGetNewToken(req, res);
      } catch (err) {
        return rest.response.status(RestStatus.UNAUTHORIZED, res, {
          loginUrl: req.app.oauth.getSigninURL()
        });
      }
      req.accessToken = { token: accessTokenFromCookie };
      req.user = await oauthHelper.createStratoUser(req.accessToken);
      req.decodedToken = jwtDecode(accessTokenFromCookie);
      return next();
    };
  }

  static init(app) {
    try {
      app.oauth = oauthUtil.init(config.nodes[0].oauth2);
    } catch (err) {
      console.log(err);
      console.error("Error initializing oauth handlers");
      process.exit(1);
    }
  }
}

export default AuthHandler;
