import os
import hmac
import hashlib
import json
import time
import httpx
from uuid import uuid4
from dotenv import load_dotenv

load_dotenv()

SHOPEASE_API_URL = os.getenv("SHOPEASE_API_URL", "http://localhost:5001/api/v1/nebula")
WEBHOOK_SECRET = os.getenv("NEBULA_WEBHOOK_SECRET", "super-secret-hmac-key")

def generate_signature(payload: dict, timestamp: str) -> str:
    """Generates an HMAC SHA256 signature for the payload."""
    # Ensure consistent JSON serialization format across Python and Node.js
    message = f"{timestamp}.{json.dumps(payload, separators=(',', ':'))}"
    signature = hmac.new(
        key=WEBHOOK_SECRET.encode('utf-8'),
        msg=message.encode('utf-8'),
        digestmod=hashlib.sha256
    ).hexdigest()
    return signature

async def sync_reward_to_shopease(wallet_address: str, amount: int, action_type: str):
    """Triggers the authenticated Webhook to Shop Ease."""
    timestamp = str(int(time.time()))
    tx_id = str(uuid4()) # Unique Transaction ID for Idempotency
    
    payload = {
        "tx_id": tx_id,
        "wallet_address": wallet_address,
        "stardust_earned": amount,
        "action_type": action_type
    }
    
    signature = generate_signature(payload, timestamp)
    
    headers = {
        "Content-Type": "application/json",
        "X-Nebula-Signature": signature,
        "X-Nebula-Timestamp": timestamp
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.patch(
            f"{SHOPEASE_API_URL}/sync-rewards",
            json=payload,
            headers=headers
        )
        return response.json()
