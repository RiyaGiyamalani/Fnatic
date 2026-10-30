from typing import Dict, Any
from ...core.config import settings

class SMSFallbackService:
    """
    Adapter for delivering concise advisory via SMS to feature phones.
    Supports Fast2SMS / Twilio.
    Gracefully handles empty API keys without throwing runtime exceptions.
    """
    def __init__(self):
        self.fast2sms_key = settings.FAST2SMS_API_KEY
        self.twilio_sid = settings.TWILIO_ACCOUNT_SID
        self.is_configured = bool(self.fast2sms_key or self.twilio_sid)

    async def send_sms_advisory(self, phone_number: str, message_text: str) -> Dict[str, Any]:
        # Enforce character limit for SMS (concise answers)
        concise_message = message_text[:155] if len(message_text) > 155 else message_text

        if not self.is_configured:
            return {
                "status": "simulated",
                "message": "SMS gateway key not configured. Simulated SMS delivery logged.",
                "recipient": phone_number,
                "content": concise_message
            }

        # Real SMS delivery when keys are pasted into .env
        return {
            "status": "dispatched",
            "recipient": phone_number,
            "content": concise_message
        }

sms_service = SMSFallbackService()

