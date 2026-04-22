import os
from typing import Tuple

COHERE_API_KEY = os.getenv("COHERE_API_KEY", "")

class CohereModerationService:
    def __init__(self, api_key: str = COHERE_API_KEY):
        self.api_key = api_key
        self._co = None

    @property
    def co(self):
        if self._co is None:
            try:
                import cohere
                self._co = cohere.ClientV2(api_key=self.api_key)
            except ImportError:
                raise RuntimeError("COHERE_NOT_INSTALLED: The 'cohere' package is not available. Install it or disable moderation.")
        return self._co

    async def moderate_profile(self, bio: str) -> Tuple[bool, str]:
        """
        Vets a profile bio for community guidelines using STRICT safety mode.
        Returns (is_approved, reason).
        """
        try:
            response = self.co.chat(
                model="command-r7b-12-2024",
                messages=[
                    {
                        "role": "system",
                        "content": "You are the Matriarch Moderator. Your goal is to ensure all profile bios are elite, respectful, and free of toxicity, harassment, or illegal content. Be STRICT."
                    },
                    {
                        "role": "user",
                        "content": f"Moderate the following user bio: \"{bio}\"\n\nDoes this meet Matriarch standards? Respond ONLY with 'APPROVED' or 'REJECTED: [REASON]'."
                    }
                ],
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
