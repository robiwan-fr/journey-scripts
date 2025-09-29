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

/**
 * Author: Steve Robrahn steve.robrahn@pingidentity.com
 * Script for triggering an immediate HTTP redirect using the redirectCallback mechanism.
 * Target Environment: ForgeRock Platform, Next-Gen Scripting Engine, JavaScript.
 */

// Configuration data is defined near the top for clarity
var nodeConfig = {
    // The target URL for the user to be redirected to (e.g., an external OAuth Authorization Endpoint)
    targetRedirectUrl: "https://pingidentity.com",
    debugMessage: "Issuing redirect callback to external home page.",
};

// Define all possible outcomes within a single object
var nodeOutcomes = {
    ERROR: "error",
};

// Run main body in an Immediately Invoked Function Expression (IIFE)
(function () {
    // Wrap the body in a try/catch block to handle script exceptions gracefully
    try {
        // The script checks if callbacks are currently empty. If they are, this is the first execution, 
        // and it should issue the redirect callback.
        if (callbacks.isEmpty()) {
            // Keep logging at debug unless it's an error
            logger.debug(nodeConfig.debugMessage);

            // Instruct the platform to issue a Redirect Callback.
            // This is how the node signals the client to redirect the browser to an external URL.
            // The precise signature for redirectCallback is inferred to take the URL parameter.
            callbacksBuilder.redirectCallback(nodeConfig.targetRedirectUrl,null,"GET");
        }

        // --- Handle subsequent callback responses (Should not happen for simple redirects) ---
        
        // If the node logic proceeds past the initial callback check, it means the node 
        // received input (i.e., callbacks were present), which is unexpected for a simple 
        // outbound redirect node.
        
        logger.error("Node was revisited unexpectedly after initiating redirect.");
        action
            .goTo(nodeOutcomes.ERROR) // Use action for consistency [11]
            .withErrorMessage("Unexpected callback submission for redirect node.");

    } catch (e) {
        // Include as much information as possible for errors
        logger.error("Exception during redirect flow: " + e);
        logger.error("Stack trace: " + e.stack);
        action.goTo(nodeOutcomes.ERROR);
    }
})();
