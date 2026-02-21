from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.shopease_client import sync_reward_to_shopease

router = APIRouter()

class ZKProofPayload(BaseModel):
    wallet_address: str
    proof_data: str
    reward_amount: int

@router.post("/verify-and-mint")
async def verify_and_mint_rewards(payload: ZKProofPayload):
    """
    Receives a ZK Proof from the Nebula frontend (Midnight Network).
    Verifies it, and triggers the HMAC-secured Sync Service to Shop Ease.
    """
    # 1. Verify ZK Proof (Pseudocode integration point)
    # is_valid = verify_midnight_zk_proof(payload.proof_data)
    # if not is_valid: raise HTTPException(status_code=400, detail="Invalid ZK Proof")
    
    # 2. Trigger Shop Ease Sync Service
    try:
        shopease_response = await sync_reward_to_shopease(
            payload.wallet_address, 
            payload.reward_amount, 
            action_type="wellness_journal_entry"
        )
        return {"status": "success", "shopease_sync": shopease_response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
