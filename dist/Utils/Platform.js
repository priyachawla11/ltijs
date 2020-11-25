"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classPrivateFieldGet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldGet"));

var _classPrivateFieldSet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldSet"));

// Utis
const Auth = require('./Auth');

const provPlatformDebug = require('debug')('provider:platform');
/**
 * @description Class representing a registered platform.
 */


var _platformName = new WeakMap();

var _platformUrl = new WeakMap();

var _clientId = new WeakMap();

var _authenticationEndpoint = new WeakMap();

var _authConfig2 = new WeakMap();

var _ENCRYPTIONKEY2 = new WeakMap();

var _accesstokenEndpoint = new WeakMap();

var _kid = new WeakMap();

var _Database = new WeakMap();

class Platform {
  /**
     * @param {string} name - Platform name.
     * @param {string} platformUrl - Platform url.
     * @param {string} clientId - Client Id generated by the platform.
     * @param {string} authenticationEndpoint - Authentication endpoint that the tool will use to authenticate within the platform.
     * @param {string} accesstokenEndpoint - Access token endpoint for the platform.
     * @param {string} kid - Key id for local keypair used to sign messages to this platform.
     * @param {string} _ENCRYPTIONKEY - Encryption key used
     * @param {Object} _authConfig - Authentication configurations for the platform.
     */
  constructor(name, platformUrl, clientId, authenticationEndpoint, accesstokenEndpoint, kid, _ENCRYPTIONKEY, _authConfig, Database) {
    _platformName.set(this, {
      writable: true,
      value: void 0
    });

    _platformUrl.set(this, {
      writable: true,
      value: void 0
    });

    _clientId.set(this, {
      writable: true,
      value: void 0
    });

    _authenticationEndpoint.set(this, {
      writable: true,
      value: void 0
    });

    _authConfig2.set(this, {
      writable: true,
      value: void 0
    });

    _ENCRYPTIONKEY2.set(this, {
      writable: true,
      value: void 0
    });

    _accesstokenEndpoint.set(this, {
      writable: true,
      value: void 0
    });

    _kid.set(this, {
      writable: true,
      value: void 0
    });

    _Database.set(this, {
      writable: true,
      value: void 0
    });

    (0, _classPrivateFieldSet2.default)(this, _authConfig2, _authConfig);
    (0, _classPrivateFieldSet2.default)(this, _ENCRYPTIONKEY2, _ENCRYPTIONKEY);
    (0, _classPrivateFieldSet2.default)(this, _platformName, name);
    (0, _classPrivateFieldSet2.default)(this, _platformUrl, platformUrl);
    (0, _classPrivateFieldSet2.default)(this, _clientId, clientId);
    (0, _classPrivateFieldSet2.default)(this, _authenticationEndpoint, authenticationEndpoint);
    (0, _classPrivateFieldSet2.default)(this, _accesstokenEndpoint, accesstokenEndpoint);
    (0, _classPrivateFieldSet2.default)(this, _kid, kid);
    (0, _classPrivateFieldSet2.default)(this, _Database, Database);
  }
  /**
   * @description Gets the platform url.
   */


  async platformUrl() {
    return (0, _classPrivateFieldGet2.default)(this, _platformUrl);
  }
  /**
   * @description Gets the platform client id.
   */


  async platformClientId() {
    return (0, _classPrivateFieldGet2.default)(this, _clientId);
  }
  /**
     * @description Sets/Gets the platform name.
     * @param {string} [name] - Platform name.
     */


  async platformName(name) {
    if (!name) return (0, _classPrivateFieldGet2.default)(this, _platformName);
    await (0, _classPrivateFieldGet2.default)(this, _Database).Modify(false, 'platform', {
      platformUrl: (0, _classPrivateFieldGet2.default)(this, _platformUrl),
      clientId: (0, _classPrivateFieldGet2.default)(this, _clientId)
    }, {
      platformName: name
    });
    (0, _classPrivateFieldSet2.default)(this, _platformName, name);
    return name;
  }
  /**
     * @description Gets the platform Id.
     */


  async platformId() {
    return (0, _classPrivateFieldGet2.default)(this, _kid);
  }
  /**
   * @description Gets the platform key_id.
   */


  async platformKid() {
    return (0, _classPrivateFieldGet2.default)(this, _kid);
  }
  /**
   * @description Sets/Gets the platform status.
   * @param {Boolean} active - Whether the Platform is active or not.
   */


  async platformActive(active) {
    if (!active) {
      // Get platform status
      const platformStatus = await (0, _classPrivateFieldGet2.default)(this, _Database).Get(false, 'platformStatus', {
        id: (0, _classPrivateFieldGet2.default)(this, _kid)
      });
      if (!platformStatus || platformStatus[0].active) return true;else return false;
    }

    await (0, _classPrivateFieldGet2.default)(this, _Database).Replace(false, 'platformStatus', {
      id: (0, _classPrivateFieldGet2.default)(this, _kid)
    }, {
      id: (0, _classPrivateFieldGet2.default)(this, _kid),
      active: active
    });
    return active;
  }
  /**
     * @description Gets the RSA public key assigned to the platform.
     *
     */


  async platformPublicKey() {
    const key = await (0, _classPrivateFieldGet2.default)(this, _Database).Get((0, _classPrivateFieldGet2.default)(this, _ENCRYPTIONKEY2), 'publickey', {
      kid: (0, _classPrivateFieldGet2.default)(this, _kid)
    });
    return key[0].key;
  }
  /**
     * @description Gets the RSA private key assigned to the platform.
     *
     */


  async platformPrivateKey() {
    const key = await (0, _classPrivateFieldGet2.default)(this, _Database).Get((0, _classPrivateFieldGet2.default)(this, _ENCRYPTIONKEY2), 'privatekey', {
      kid: (0, _classPrivateFieldGet2.default)(this, _kid)
    });
    return key[0].key;
  }
  /**
     * @description Sets/Gets the platform authorization configurations used to validate it's messages.
     * @param {string} method - Method of authorization "RSA_KEY" or "JWK_KEY" or "JWK_SET".
     * @param {string} key - Either the RSA public key provided by the platform, or the JWK key, or the JWK keyset address.
     */


  async platformAuthConfig(method, key) {
    if (!method && !key) return (0, _classPrivateFieldGet2.default)(this, _authConfig2);
    if (method && method !== 'RSA_KEY' && method !== 'JWK_KEY' && method !== 'JWK_SET') throw new Error('INVALID_METHOD. Details: Valid methods are "RSA_KEY", "JWK_KEY", "JWK_SET".');
    const authConfig = {
      method: method || (0, _classPrivateFieldGet2.default)(this, _authConfig2).method,
      key: key || (0, _classPrivateFieldGet2.default)(this, _authConfig2).key
    };
    await (0, _classPrivateFieldGet2.default)(this, _Database).Modify(false, 'platform', {
      platformUrl: (0, _classPrivateFieldGet2.default)(this, _platformUrl),
      clientId: (0, _classPrivateFieldGet2.default)(this, _clientId)
    }, {
      authConfig: authConfig
    });
    (0, _classPrivateFieldSet2.default)(this, _authConfig2, authConfig);
    return authConfig;
  }
  /**
   * @description Sets/Gets the platform authorization endpoint used to perform the OIDC login.
   * @param {string} [authenticationEndpoint - Platform authentication endpoint.
   */


  async platformAuthenticationEndpoint(authenticationEndpoint) {
    if (!authenticationEndpoint) return (0, _classPrivateFieldGet2.default)(this, _authenticationEndpoint);
    await (0, _classPrivateFieldGet2.default)(this, _Database).Modify(false, 'platform', {
      platformUrl: (0, _classPrivateFieldGet2.default)(this, _platformUrl),
      clientId: (0, _classPrivateFieldGet2.default)(this, _clientId)
    }, {
      authEndpoint: authenticationEndpoint
    });
    (0, _classPrivateFieldSet2.default)(this, _authenticationEndpoint, authenticationEndpoint);
    return authenticationEndpoint;
  }
  /**
     * @description Sets/Gets the platform access token endpoint used to authenticate messages to the platform.
     * @param {string} [accesstokenEndpoint] - Platform access token endpoint.
     */


  async platformAccessTokenEndpoint(accesstokenEndpoint) {
    if (!accesstokenEndpoint) return (0, _classPrivateFieldGet2.default)(this, _accesstokenEndpoint);
    await (0, _classPrivateFieldGet2.default)(this, _Database).Modify(false, 'platform', {
      platformUrl: (0, _classPrivateFieldGet2.default)(this, _platformUrl),
      clientId: (0, _classPrivateFieldGet2.default)(this, _clientId)
    }, {
      accesstokenEndpoint: accesstokenEndpoint
    });
    (0, _classPrivateFieldSet2.default)(this, _accesstokenEndpoint, accesstokenEndpoint);
    return accesstokenEndpoint;
  }
  /**
     * @description Gets the platform access token or attempts to generate a new one.
     * @param {String} scopes - String of scopes.
     */


  async platformAccessToken(scopes) {
    const token = await (0, _classPrivateFieldGet2.default)(this, _Database).Get((0, _classPrivateFieldGet2.default)(this, _ENCRYPTIONKEY2), 'accesstoken', {
      platformUrl: (0, _classPrivateFieldGet2.default)(this, _platformUrl),
      clientId: (0, _classPrivateFieldGet2.default)(this, _clientId),
      scopes: scopes
    });

    if (!token || (Date.now() - token[0].createdAt) / 1000 > token[0].expires_in) {
      provPlatformDebug('Valid access_token for ' + (0, _classPrivateFieldGet2.default)(this, _platformUrl) + ' not found');
      provPlatformDebug('Attempting to generate new access_token for ' + (0, _classPrivateFieldGet2.default)(this, _platformUrl));
      provPlatformDebug('With scopes: ' + scopes);
      const res = await Auth.getAccessToken(scopes, this, (0, _classPrivateFieldGet2.default)(this, _ENCRYPTIONKEY2), (0, _classPrivateFieldGet2.default)(this, _Database));
      return res;
    } else {
      provPlatformDebug('Access_token found');
      return token[0].token;
    }
  }
  /**
   * @description Retrieves the platform information as a JSON object.
   */


  async platformJSON() {
    const platformJSON = {
      id: (0, _classPrivateFieldGet2.default)(this, _kid),
      url: (0, _classPrivateFieldGet2.default)(this, _platformUrl),
      clientId: (0, _classPrivateFieldGet2.default)(this, _clientId),
      name: (0, _classPrivateFieldGet2.default)(this, _platformName),
      authenticationEndpoint: (0, _classPrivateFieldGet2.default)(this, _authenticationEndpoint),
      accesstokenEndpoint: (0, _classPrivateFieldGet2.default)(this, _accesstokenEndpoint),
      authConfig: (0, _classPrivateFieldGet2.default)(this, _authConfig2),
      publicKey: await this.platformPublicKey(),
      active: await this.platformActive()
    };
    return platformJSON;
  }
  /**
   * @description Deletes a registered platform.
   */


  async delete() {
    await (0, _classPrivateFieldGet2.default)(this, _Database).Delete('platform', {
      platformUrl: (0, _classPrivateFieldGet2.default)(this, _platformUrl),
      clientId: (0, _classPrivateFieldGet2.default)(this, _clientId)
    });
    await (0, _classPrivateFieldGet2.default)(this, _Database).Delete('platformStatus', {
      id: (0, _classPrivateFieldGet2.default)(this, _kid)
    });
    await (0, _classPrivateFieldGet2.default)(this, _Database).Delete('publickey', {
      kid: (0, _classPrivateFieldGet2.default)(this, _kid)
    });
    await (0, _classPrivateFieldGet2.default)(this, _Database).Delete('privatekey', {
      kid: (0, _classPrivateFieldGet2.default)(this, _kid)
    });
    return true;
  }
  /* istanbul ignore next */

  /**
   * @deprecated
   */


  async remove() {
    console.log('Deprecation warning: The Platform.remove() method is now deprecated and will be removed in the 6.0 release. Use Platform.delete() instead.');
    return this.delete();
  }
  /* istanbul ignore next */

  /**
   * @description Sets/Gets the platform authorization endpoint used to perform the OIDC login.
   * @param {string} [authenticationEndpoint] - Platform authentication endpoint.
   * @deprecated
   */


  async platformAuthEndpoint(authenticationEndpoint) {
    return this.platformAuthenticationEndpoint(authenticationEndpoint);
  }

}

module.exports = Platform;