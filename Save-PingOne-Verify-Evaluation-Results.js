/*
DISCLAIMER: This code is provided to you expressly as an example  ("Sample Code"). 
It is the responsibility of the individual recipient user, in his/her sole discretion, 
to diligence such Sample Code for accuracy, completeness, security, and final determination 
for appropriateness of use. 
ANY SAMPLE CODE IS PROVIDED ON AN "AS IS" IS BASIS, WITHOUT WARRANTY OF ANY KIND. PING AND 
ITS LICENSORS EXPRESSLY DISCLAIM ALL WARRANTIES,  WHETHER EXPRESS, IMPLIED, OR STATUTORY, 
INCLUDING WITHOUT LIMITATION, THE IMPLIED WARRANTIES  OF MERCHANTABILITY, OR FITNESS FOR 
A PARTICULAR PURPOSE.
PING SHALL NOT HAVE ANY LIABILITY ARISING OUT OF OR RELATING TO ANY USE, IMPLEMENTATION, 
INTEGRATION, OR CONFIGURATION OF ANY SAMPLE CODE IN ANY PRODUCTION ENVIRONMENT OR FOR ANY 
COMMERCIAL DEPLOYMENT(S).
*/

/*
 * Author: Steve Robrahn steve.robrahn@pingidentity.com
 * This script writes PingOne Verify metadata and verified data to multi-valued attributes 
 * of the user profile to enable access within AIC.
 * Attribute references use the PingAM attribute names.
 * See https://docs.pingidentity.com/pingoneaic/latest/identities/user-identity-properties-attributes-reference.html
 * for more details about Attribute References.
 *
 * Script Dependencies:
 * Before this node:
 * A Platform Username node 
 * An Identify Existing User node with identity attribute: userName
 * After this node:
 * A Patch Object node with ignored attributes: userName, identity resource: managed/<realm>_user, 
 * and identity attribute: userName
 */

var nodeConfig = {
    metadataAttribute: "fr-attr-multi3",
    verifiedDataAttribute: "fr-attr-multi4",
    entryLimit: 10
    };

var nodeOutcomes = {
    SUCCESS: "success",
    ERROR: "error",
};

(function () {
    var metadata = nodeState.get("pingOneVerifyMetadata")
    var verifiedData = nodeState.get("pingOneVerifyVerifiedData")
    var failureReason = nodeState.get("pingOneVerifyEvaluationFailureReason")
    if (failureReason) {
        logger.error("pingOneVerifyEvaluation Failed because {}",failureReason)
        action.goto(nodeOutcomes.ERROR);
    }
    // _id in nodeState depends on Identify Existing User node with identity attribute: userName ahead of this script
    var uuid = nodeState.get("_id"); 
    var identity = idRepository.getIdentity(uuid);
    var metadataTemp = identity.getAttributeValues(nodeConfig.metadataAttribute);
    var verifiedDataTemp = identity.getAttributeValues(nodeConfig.verifiedDataAttribute);
    
    
    var attributes = nodeState.get("objectAttributes")
    logger.error("objectAttributes {}",JSON.stringify(attributes))
    
    var metadataValues = []
    var verifiedDataValues = []
    
    if (metadataTemp) {
        metadataValues = metadataTemp.toArray().map(function (item) {
            return String(item);
        })
    }
    metadataValues.push(metadata)
    logger.error("metadataValues {}",JSON.stringify(metadataValues))
    
    if (verifiedDataTemp) {
        verifiedDataValues = verifiedDataTemp.toArray().map(function (item) {
            return String(item);
        })
    }
    verifiedDataValues.push(verifiedData)
    logger.error("verifiedDataValues {}",JSON.stringify(verifiedDataValues))

    if (attributes) {
        attributes.frUnindexedMultivalued3 = metadataValues,
        attributes.frUnindexedMultivalued4 = verifiedDataValues
    }
    nodeState.putShared("objectAttributes", attributes);
    
    action.goTo(nodeOutcomes.SUCCESS);
})();
