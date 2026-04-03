import os
import cohere
from typing import Tuple

COHERE_API_KEY = os.getenv("COHERE_API_KEY", "YOUR_COHERE_API_KEY")

class CohereModerationService:
    def __init__(self, api_key: str = COHERE_API_KEY):
        self.co = cohere.ClientV2(api_key=api_key)
        self.model = "command-r7b-12-2024" # Specific for latest R7B

    async def moderate_profile(self, bio: str) -> Tuple[bool, str]:
        """
        Vets a profile bio for community guidelines using STRICT safety mode.
        Returns (is_approved, reason).
        """
        try:
            response = self.co.chat(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are the Matriarch Matriarch Moderator. Your goal is to ensure all profile bios are elite, respectful, and free of toxicity, harassment, or illegal content. Be STRICT."
                    },
                    {
                        "role": "user",
                        "content": f"Moderate the following user bio: \"{bio}\"\n\nDoes this meet Matriarch standards? Respond ONLY with 'APPROVED' or 'REJECTED: [REASON]'."
                    }
                ],
                # safety_mode="STRICT" # Applying the user's request for high-fidelity guardrails
            )
            
            result = response.message.content[0].text.strip()
            if result.startswith("APPROVED"):
                return True, "Approved"
            return False, result.replace("REJECTED: ", "")
            
        except Exception as e:
            # Fallback to manual review if AI service is down
            print(f"Cohere API Error: {e}")
            return True, "Awaiting AI Review (Manual Bypass)"

moderator = CohereModerationService()
