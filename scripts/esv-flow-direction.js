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
 * Script for directing user flow based on the value of Environment secrets and variables (ESVs).
 * Target Environment: ForgeRock Platform, Next-Gen Scripting Engine, JavaScript.
 */

// Configuration data is defined near the top for clarity
var nodeConfig = {
    propertyName: "esv.my.variable", // The name of the ESV to evaluate
};

// Define all possible outcomes within a single object
var nodeOutcomes = {
    TRUE: "true",
    FALSE: "false",
    ERROR: "error",
};

// Run main body in an Immediately Invoked Function Expression (IIFE)
(function () {
    // Wrap the body in a try/catch block to handle script exceptions gracefully
    try {
        var myProperty = systemEnv.getProperty(nodeConfig.propertyName);

        if (myProperty === "true") {
            action.goTo(nodeOutcomes.TRUE);
        } else if (myProperty === "false") {
            action.goTo(nodeOutcomes.FALSE);
        } else {
            logger.error("ESV 'esv.my.variable' is not set to 'true' or 'false'. Actual value: " + myProperty);
            action.goTo(nodeOutcomes.ERROR);
        }

    } catch (e) {
        // Include as much information as possible for errors
        logger.error("Exception during ESV evaluation: " + e);
        logger.error("Stack trace: " + e.stack);
        action.goTo(nodeOutcomes.ERROR);
    }
})();
