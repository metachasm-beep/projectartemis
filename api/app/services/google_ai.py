import os
import google.generativeai as genai
from app.core.config import settings
from typing import List, Optional

GOOGLE_API_KEY = settings.GOOGLE_API_KEY or os.getenv("GOOGLE_API_KEY", "")

class GoogleSocraticService:
    def __init__(self, api_key: str = GOOGLE_API_KEY):
        if api_key:
            genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-3-pro-preview')

    async def brainstorm_step(self, message: str, chat_history: list = []) -> str:
        """
        Facilitates the Socratic Architect dialogue using Google Gemini 3.
        """
        system_instruction = (
            "You are the Matriarch Sanctuary Architect. You are helping an elite user design their digital sanctuary. "
            "Your tone is high-fashion, philosophical, and architectural. Do not just answer; ask Socratic questions "
            "that help the user discover their own essence. Focus on aura, boundaries, and digital peace. "
            "Keep responses short (under 50 words) and deeply provocative."
        )
        
        # Configure model with system instruction
        model = genai.GenerativeModel(
            model_name="gemini-3-pro-preview",
            system_instruction=system_instruction
        )
        
        try:
            # Simple interaction for now (stateless at the AI level, stateful in Turso)
            response = model.generate_content(message)
            return response.text.strip()
        except Exception as e:
            print(f"Google AI Error: {e}")
            return "The celestial architect is reflecting. Let us contemplate your boundaries in silence for a moment."

class GoogleModerationService:
    def __init__(self, api_key: str = GOOGLE_API_KEY):
        if api_key:
            genai.configure(api_key=api_key)

    async def moderate_profile(self, bio: str) -> tuple[bool, str]:
        """Vets a profile bio using Gemini."""
        model = genai.GenerativeModel('gemini-3-flash-preview')
        prompt = (
            "You are the Matriarch Moderator. Vets the following bio for toxicity, "
            "harassment, or illegal content. Respond ONLY with 'APPROVED' or 'REJECTED: [REASON]'.\n\n"
            f"Bio: \"{bio}\""
        )
        try:
            response = model.generate_content(prompt)
            result = response.text.strip()
            if result.startswith("APPROVED"):
                return True, "Approved"
            return False, result.replace("REJECTED: ", "")
        except Exception as e:
            print(f"Google Moderation Error: {e}")
            return True, "Awaiting Review"

architect = GoogleSocraticService()
moderator = GoogleModerationService()
