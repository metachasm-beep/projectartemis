from typing import Dict, Any
import random

class AadhaarService:
    @staticmethod
    def verify_otp(aadhaar_number: str, otp: str) -> Dict[str, Any]:
        """
        Mock implementation of Aadhaar OTP verification.
        In production, this would call UIDAI or a 3rd party provider.
        """
        # Logic: If OTP is '123456', return success.
        if otp == "123456":
            return {
                "success": True,
                "data": {
                    "full_name": "Aadhaar User",
                    "dob": "1995-05-15",
                    "gender": "Female" if int(aadhaar_number[-1]) % 2 == 0 else "Male",
                    "aadhaar_last_4": aadhaar_number[-4:],
                    "verification_id": f"AA-{random.randint(100000, 999999)}"
                }
            }
        return {"success": False, "error": "Invalid OTP"}

aadhaar_service = AadhaarService()
