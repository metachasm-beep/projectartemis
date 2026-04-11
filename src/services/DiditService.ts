/**
 * 🛡️ Didit Identity Protocol Service
 * Centralizing the sovereign identity handshake logic.
 */

export const DIDIT_CONFIG = {
  UNILINK: "https://verify.didit.me/u/Nb9myE0NQEy08Au1CoX5fw",
  VERIFICATION_FEE: 33,
  CURRENCY: "INR",
  CALLBACK_PATH: "/verify/callback"
};

class DiditService {
  /**
   * Generates the landing URL for identity verification.
   */
  getVerificationUrl() {
    return DIDIT_CONFIG.UNILINK;
  }

  /**
   * In a future Phase 2 (Session API), this would initiate a unique 
   * verification session and return a redirect URL with a specific ID.
   */
  async initiateVendorSession(userId: string) {
    console.log(`🛡️ Protocol: Initiating biometric session for resident ${userId}`);
    // Placeholder for when we upgrade to the Session API with an API Key
    return this.getVerificationUrl();
  }

  /**
   * Status check logic for returning users.
   */
  parseCallbackStatus(searchParams: URLSearchParams) {
    return {
      sessionId: searchParams.get('verificationSessionId'),
      status: searchParams.get('status'), // 'Approved', 'Declined', etc.
      vendorSessionId: searchParams.get('vendorSessionId')
    };
  }
}

export const diditService = new DiditService();
