from typing import Dict, Any
import random

class AadhaarService:
    @staticmethod
    def request_otp(aadhaar_number: str) -> Dict[str, Any]:
        """
        Simulates requesting an OTP from UIDAI.
        In production, this would use the UIDAI OTP API 2.5 spec.
        """
        # For now, we always succeed in sending the 'simulation' OTP
        return {
            "success": True, 
            "message": "OTP sent to your registered Aadhaar mobile number",
            "txn": f"TXN-{random.randint(100000, 999999)}"
        }

    @staticmethod
    def verify_otp(user_id: str, aadhaar_number: str, otp: str) -> Dict[str, Any]:
        """
        Verifies the OTP against UIDAI records.
        Using '123456' as the magic success code for now.
        """
        if otp == "123456":
            return {
                "success": True,
                "data": {
                    "full_name": "Aadhaar User",
                    "dob": "1995-05-15",
                    "gender": "Female",
                    "aadhaar_last_4": aadhaar_number[-4:],
                    "verification_id": f"AA-{random.randint(100000, 999999)}"
                }
            }
        return {"success": False, "error": "Invalid Aadhaar OTP. Handshake failed."}

aadhaar_service = AadhaarService()
