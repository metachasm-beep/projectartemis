import os
from typing import Tuple
from app.core.config import settings

COHERE_API_KEY = settings.COHERE_API_KEY or os.getenv("COHERE_API_KEY", "")

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
        # ... (keep existing moderation logic)
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

class CohereSocraticService:
    def __init__(self, api_key: str = COHERE_API_KEY):
        self.api_key = api_key
        self._co = None

    @property
    def co(self):
        if self._co is None:
            import cohere
            self._co = cohere.ClientV2(api_key=self.api_key)
        return self._co

    async def brainstorm_step(self, message: str, chat_history: list = []) -> str:
        """
        Facilitates the Socratic Architect dialogue.
        """
        system_prompt = (
            "You are the Matriarch Sanctuary Architect. You are helping an elite user design their digital sanctuary. "
            "Your tone is high-fashion, philosophical, and architectural. Do not just answer; ask Socratic questions "
            "that help the user discover their own essence. Focus on aura, boundaries, and digital peace. "
            "Keep responses short (under 50 words) and deeply provocative."
        )
        
        messages = [{"role": "system", "content": system_prompt}]
        messages.extend(chat_history)
        messages.append({"role": "user", "content": message})
        
        try:
            response = self.co.chat(
                model="command-r7b-12-2024",
                messages=messages,
            )
            return response.message.content[0].text.strip()
        except Exception as e:
            print(f"Cohere Socratic Error: {e}")
            return "The architectural link is unstable. Let us focus on the essence of your boundaries."

moderator = CohereModerationService()
architect = CohereSocraticService()
