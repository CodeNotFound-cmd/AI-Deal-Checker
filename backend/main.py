from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
import json
import uuid
import random
from datetime import datetime, timedelta
import re

app = FastAPI(
    title="AI Deal Checker API",
    description="Backend service for AI-powered financial document analysis",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for demo purposes
deals_storage: Dict[str, Dict] = {}

# Pydantic Models
class ExtractedFields(BaseModel):
    counterparty: Optional[str] = None
    notional_amount: Optional[str] = None
    currency: Optional[str] = None
    interest_rate: Optional[str] = None
    trade_date: Optional[str] = None
    maturity_date: Optional[str] = None
    settlement_date: Optional[str] = None
    collateral: Optional[str] = None
    termination_clause: Optional[str] = None

class ValidationResult(BaseModel):
    field: str
    status: str  # "valid", "warning", "error"
    explanation: str
    severity: str  # "low", "medium", "high"
    confidence: Optional[float] = None
    standard_value: Optional[str] = None
    document_snippet: Optional[str] = None

class RiskAssessment(BaseModel):
    risk_score: int
    risk_level: str
    validations: List[ValidationResult]
    ai_explanations: Dict[str, str]
    benchmark_comparison: List[Dict[str, Any]]
    audit_trail: List[Dict[str, Any]]

class SimulationRequest(BaseModel):
    deal_id: str
    modified_fields: Dict[str, str]

class SimulationResponse(BaseModel):
    deal_id: str
    original_risk_score: int
    new_risk_score: int
    score_change: int
    updated_validations: List[ValidationResult]

# Mock AI Logic and Rules Engine
class AIValidationEngine:
    def __init__(self):
        self.critical_fields = ["counterparty", "notional_amount", "interest_rate"]
        self.standard_benchmarks = {
            "interest_rate": {"required": True, "standard": "Must be specified"},
            "termination_clause": {"required": True, "standard": "30 days notice"},
            "currency": {"required": True, "standard": "ISO 4217 format"},
            "settlement_date": {"required": True, "standard": "T+2 settlement"},
            "collateral": {"required": False, "standard": "Government bonds preferred"}
        }
        
    def extract_fields_from_document(self, filename: str) -> ExtractedFields:
        """Simulate AI document extraction with realistic mock data"""
        
        # Mock extraction based on filename patterns or random selection
        mock_extractions = [
            {
                "counterparty": "ABC Bank Ltd.",
                "notional_amount": "100000000",
                "currency": "USD",
                "interest_rate": None,  # Intentionally missing
                "trade_date": "2024-01-15",
                "maturity_date": "2025-01-15",
                "settlement_date": "2024-01-17",
                "collateral": "Government Bonds",
                "termination_clause": None
            },
            {
                "counterparty": "Global Finance Corp",
                "notional_amount": "50000000",
                "currency": "EUR",
                "interest_rate": "3.25",
                "trade_date": "2024-01-14",
                "maturity_date": "2025-01-14",
                "settlement_date": "2024-01-16",
                "collateral": "Corporate Bonds",
                "termination_clause": "30 days"
            },
            {
                "counterparty": "International Bank",
                "notional_amount": "75000000",
                "currency": "GBP",
                "interest_rate": "4.75",
                "trade_date": "2024-01-13",
                "maturity_date": "2025-01-13",
                "settlement_date": "2024-01-15",
                "collateral": None,
                "termination_clause": "14 days"
            }
        ]
        
        # Select extraction based on filename hash for consistency
        extraction_index = hash(filename) % len(mock_extractions)
        selected_extraction = mock_extractions[extraction_index]
        
        # Add some randomness to simulate AI uncertainty
        if random.random() < 0.3:  # 30% chance to make a field missing
            fields_to_potentially_miss = ["interest_rate", "termination_clause", "collateral"]
            field_to_miss = random.choice(fields_to_potentially_miss)
            selected_extraction[field_to_miss] = None
            
        return ExtractedFields(**selected_extraction)
    
    def validate_fields(self, fields: ExtractedFields) -> RiskAssessment:
        """Run comprehensive validation with AI-powered risk assessment"""
        
        validations = []
        risk_score = 0
        ai_explanations = {}
        
        # Critical field validation
        for field in self.critical_fields:
            field_value = getattr(fields, field)
            if not field_value:
                severity = "high" if field == "interest_rate" else "medium"
                risk_increase = 30 if field == "interest_rate" else 20
                risk_score += risk_increase
                
                validation = ValidationResult(
                    field=field.replace("_", " ").title(),
                    status="error",
                    explanation=f"Missing {field.replace('_', ' ')} - critical for risk assessment",
                    severity=severity,
                    confidence=0.95,
                    standard_value="Required" if field == "interest_rate" else "Present",
                    document_snippet=f'"{field.replace("_", " ").title()}: [MISSING]" - Field not found in document'
                )
                validations.append(validation)
                
                # AI explanation
                if field == "interest_rate":
                    ai_explanations[field] = {
                        "reasoning": "Interest rate is fundamental for derivative pricing and risk calculation. Without it, the deal cannot be properly valued or hedged.",
                        "regulation": "ISDA Master Agreement Section 4.3 requires explicit rate specification",
                        "recommendation": "Contact counterparty to confirm rate terms before proceeding"
                    }
            else:
                validation = ValidationResult(
                    field=field.replace("_", " ").title(),
                    status="valid",
                    explanation=f"{field.replace('_', ' ').title()} properly specified",
                    severity="low",
                    confidence=0.98,
                    standard_value="Present",
                    document_snippet=f'"{field.replace("_", " ").title()}: {field_value}" - Successfully extracted'
                )
                validations.append(validation)
        
        # Date consistency validation
        if fields.trade_date and fields.maturity_date:
            trade_date = datetime.strptime(fields.trade_date, "%Y-%m-%d")
            maturity_date = datetime.strptime(fields.maturity_date, "%Y-%m-%d")
            
            if trade_date >= maturity_date:
                risk_score += 25
                validations.append(ValidationResult(
                    field="Date Consistency",
                    status="error",
                    explanation="Trade date must be before maturity date",
                    severity="high",
                    confidence=0.99,
                    standard_value="Trade < Maturity",
                    document_snippet=f'"Trade Date: {fields.trade_date}, Maturity Date: {fields.maturity_date}" - Invalid sequence'
                ))
            else:
                validations.append(ValidationResult(
                    field="Date Consistency",
                    status="valid",
                    explanation="Trade and maturity dates are consistent",
                    severity="low",
                    confidence=0.99,
                    standard_value="Trade < Maturity",
                    document_snippet=f'"Trade Date: {fields.trade_date}, Maturity Date: {fields.maturity_date}" - Valid sequence'
                ))
        
        # Currency validation
        if fields.currency:
            valid_currencies = ["USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD"]
            if fields.currency in valid_currencies:
                validations.append(ValidationResult(
                    field="Currency",
                    status="valid",
                    explanation="Currency code follows ISO 4217 standard",
                    severity="low",
                    confidence=0.99,
                    standard_value="ISO 4217",
                    document_snippet=f'"Currency: {fields.currency}" - Valid ISO code'
                ))
            else:
                risk_score += 15
                validations.append(ValidationResult(
                    field="Currency",
                    status="warning",
                    explanation="Non-standard currency code detected",
                    severity="medium",
                    confidence=0.85,
                    standard_value="ISO 4217",
                    document_snippet=f'"Currency: {fields.currency}" - Non-standard code'
                ))
        
        # Counterparty risk assessment (mock sanctions check)
        if fields.counterparty:
            # Simulate sanctions database check
            high_risk_entities = ["Sanctioned Corp", "Blocked Entity Ltd", "Restricted Bank"]
            if any(entity in fields.counterparty for entity in high_risk_entities):
                risk_score += 50
                validations.append(ValidationResult(
                    field="Counterparty Sanctions",
                    status="error",
                    explanation="Entity appears on sanctions watchlist",
                    severity="high",
                    confidence=0.92,
                    standard_value="Clean entity",
                    document_snippet=f'"Counterparty: {fields.counterparty}" - Flagged in sanctions database'
                ))
            elif "Bank" not in fields.counterparty:
                risk_score += 10
                validations.append(ValidationResult(
                    field="Counterparty Type",
                    status="warning",
                    explanation="Non-bank counterparty may require additional due diligence",
                    severity="medium",
                    confidence=0.78,
                    standard_value="Financial institution",
                    document_snippet=f'"Counterparty: {fields.counterparty}" - Non-bank entity'
                ))
            else:
                validations.append(ValidationResult(
                    field="Counterparty Verification",
                    status="valid",
                    explanation="Counterparty appears to be legitimate financial institution",
                    severity="low",
                    confidence=0.88,
                    standard_value="Financial institution",
                    document_snippet=f'"Counterparty: {fields.counterparty}" - Verified bank entity'
                ))
        
        # Notional amount risk assessment
        if fields.notional_amount:
            try:
                notional = float(fields.notional_amount)
                if notional > 100000000:  # $100M threshold
                    risk_score += 15
                    validations.append(ValidationResult(
                        field="Notional Amount",
                        status="warning",
                        explanation="Large notional amount increases exposure risk",
                        severity="medium",
                        confidence=0.95,
                        standard_value="< $100M",
                        document_snippet=f'"Notional Amount: ${notional:,.0f}" - Exceeds threshold'
                    ))
                else:
                    validations.append(ValidationResult(
                        field="Notional Amount",
                        status="valid",
                        explanation="Notional amount within acceptable risk parameters",
                        severity="low",
                        confidence=0.95,
                        standard_value="< $100M",
                        document_snippet=f'"Notional Amount: ${notional:,.0f}" - Within limits'
                    ))
            except ValueError:
                risk_score += 20
                validations.append(ValidationResult(
                    field="Notional Amount",
                    status="error",
                    explanation="Invalid notional amount format",
                    severity="high",
                    confidence=0.99,
                    standard_value="Numeric format",
                    document_snippet=f'"Notional Amount: {fields.notional_amount}" - Invalid format'
                ))
        
        # Settlement period validation
        if fields.trade_date and fields.settlement_date:
            trade_date = datetime.strptime(fields.trade_date, "%Y-%m-%d")
            settlement_date = datetime.strptime(fields.settlement_date, "%Y-%m-%d")
            settlement_days = (settlement_date - trade_date).days
            
            if settlement_days == 2:  # T+2 is standard
                validations.append(ValidationResult(
                    field="Settlement Period",
                    status="valid",
                    explanation="T+2 settlement aligns with market standards",
                    severity="low",
                    confidence=0.95,
                    standard_value="T+2",
                    document_snippet=f'"Settlement: T+{settlement_days}" - Standard period'
                ))
            elif settlement_days > 5:
                risk_score += 10
                validations.append(ValidationResult(
                    field="Settlement Period",
                    status="warning",
                    explanation="Extended settlement period may increase counterparty risk",
                    severity="medium",
                    confidence=0.88,
                    standard_value="T+2",
                    document_snippet=f'"Settlement: T+{settlement_days}" - Extended period'
                ))
        
        # Add some randomness to simulate AI uncertainty
        risk_score += random.randint(-5, 5)
        risk_score = max(0, min(100, risk_score))  # Clamp between 0-100
        
        # Determine risk level
        if risk_score <= 30:
            risk_level = "Low Risk"
        elif risk_score <= 60:
            risk_level = "Medium Risk"
        else:
            risk_level = "High Risk"
        
        # Generate benchmark comparison
        benchmark_comparison = self._generate_benchmark_comparison(fields)
        
        # Generate audit trail
        audit_trail = self._generate_audit_trail(fields, validations)
        
        return RiskAssessment(
            risk_score=risk_score,
            risk_level=risk_level,
            validations=validations,
            ai_explanations=ai_explanations,
            benchmark_comparison=benchmark_comparison,
            audit_trail=audit_trail
        )
    
    def _generate_benchmark_comparison(self, fields: ExtractedFields) -> List[Dict[str, Any]]:
        """Generate industry benchmark comparison data"""
        
        comparisons = []
        
        # Interest Rate Benchmark
        comparisons.append({
            "field": "Interest Rate Specification",
            "standard": "Required (ISDA 2002)",
            "extracted": "Missing" if not fields.interest_rate else f"{fields.interest_rate}% (Compliant)",
            "status": "violation" if not fields.interest_rate else "compliant",
            "description": "All derivative contracts must specify interest rate terms"
        })
        
        # Termination Clause
        comparisons.append({
            "field": "Termination Clause",
            "standard": "30 days notice",
            "extracted": "Missing" if not fields.termination_clause else f"{fields.termination_clause} (Compliant)",
            "status": "warning" if not fields.termination_clause else "compliant",
            "description": "Standard market practice requires termination provisions"
        })
        
        # Currency
        comparisons.append({
            "field": "Currency Denomination",
            "standard": "ISO 4217 format",
            "extracted": f"{fields.currency} (Compliant)" if fields.currency else "Missing",
            "status": "compliant" if fields.currency else "violation",
            "description": "Currency code follows international standards"
        })
        
        # Settlement Period
        if fields.trade_date and fields.settlement_date:
            trade_date = datetime.strptime(fields.trade_date, "%Y-%m-%d")
            settlement_date = datetime.strptime(fields.settlement_date, "%Y-%m-%d")
            settlement_days = (settlement_date - trade_date).days
            
            comparisons.append({
                "field": "Settlement Period",
                "standard": "T+2 (Standard)",
                "extracted": f"T+{settlement_days} ({'Compliant' if settlement_days == 2 else 'Non-standard'})",
                "status": "compliant" if settlement_days == 2 else "warning",
                "description": "Settlement timing aligns with market conventions"
            })
        
        return comparisons

    def _generate_audit_trail(self, fields: ExtractedFields, validations: List[ValidationResult]) -> List[Dict[str, Any]]:
        """Generate audit trail events for compliance tracking"""
        
        from datetime import datetime, timedelta
        
        events = []
        base_time = datetime.now() - timedelta(minutes=5)
        
        # Document upload event
        events.append({
            "id": "1",
            "timestamp": (base_time + timedelta(seconds=0)).isoformat(),
            "type": "upload",
            "title": "Document Uploaded",
            "description": "Financial agreement document uploaded successfully",
            "user": "System",
            "status": "completed"
        })
        
        # Extraction event
        events.append({
            "id": "2",
            "timestamp": (base_time + timedelta(seconds=13)).isoformat(),
            "type": "extraction",
            "title": "Data Extraction Completed",
            "description": f"{sum(1 for v in fields.dict().values() if v)} fields extracted with high confidence",
            "user": "AI Engine",
            "status": "completed"
        })
        
        # Validation events
        event_id = 3
        for validation in validations:
            if validation.status in ["error", "warning"]:
                events.append({
                    "id": str(event_id),
                    "timestamp": (base_time + timedelta(seconds=30 + event_id * 5)).isoformat(),
                    "type": "validation",
                    "title": f"{validation.field} {validation.status.title()}",
                    "description": validation.explanation,
                    "user": "Validation Engine",
                    "severity": validation.severity,
                    "status": "flagged" if validation.status == "error" else "completed"
                })
                event_id += 1
        
        # Risk calculation event
        events.append({
            "id": str(event_id),
            "timestamp": (base_time + timedelta(minutes=1)).isoformat(),
            "type": "validation",
            "title": "Risk Score Calculated",
            "description": "Comprehensive risk assessment completed",
            "user": "Risk Engine",
            "status": "completed"
        })
        
        return events

# Initialize AI engine
ai_engine = AIValidationEngine()

# API Endpoints
@app.get("/")
async def root():
    return {"message": "AI Deal Checker API", "version": "1.0.0", "status": "active"}

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """Upload and extract fields from financial document"""
    
    try:
        # Validate file type
        allowed_types = ["application/pdf", "application/msword", 
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        
        # Generate unique deal ID
        deal_id = str(uuid.uuid4())
        
        # Simulate AI extraction
        extracted_fields = ai_engine.extract_fields_from_document(file.filename)
        
        # Store deal data
        deals_storage[deal_id] = {
            "deal_id": deal_id,
            "filename": file.filename,
            "uploaded_at": datetime.now().isoformat(),
            "extracted_fields": extracted_fields.dict(),
            "status": "extracted"
        }
        
        return {
            "deal_id": deal_id,
            "filename": file.filename,
            "extraction_confidence": round(random.uniform(0.85, 0.98), 2),
            "extracted_fields": extracted_fields.dict(),
            "fields_extracted": sum(1 for v in extracted_fields.dict().values() if v is not None),
            "total_fields": len(extracted_fields.dict())
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")

@app.post("/validate")
async def validate_deal(deal_id: str):
    """Validate extracted fields and calculate risk score"""
    
    if deal_id not in deals_storage:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    try:
        deal_data = deals_storage[deal_id]
        extracted_fields = ExtractedFields(**deal_data["extracted_fields"])
        
        # Run AI validation
        risk_assessment = ai_engine.validate_fields(extracted_fields)
        
        # Update deal storage
        deals_storage[deal_id].update({
            "risk_assessment": risk_assessment.dict(),
            "status": "validated",
            "validated_at": datetime.now().isoformat()
        })
        
        return {
            "deal_id": deal_id,
            "risk_score": risk_assessment.risk_score,
            "risk_level": risk_assessment.risk_level,
            "validations": [v.dict() for v in risk_assessment.validations],
            "ai_explanations": risk_assessment.ai_explanations,
            "benchmark_comparison": risk_assessment.benchmark_comparison,
            "processing_time_ms": random.randint(800, 1500)  # Simulate processing time
            "audit_trail": risk_assessment.audit_trail
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Validation failed: {str(e)}")

@app.post("/simulate")
async def simulate_scenario(request: SimulationRequest):
    """Run what-if scenario analysis with modified field values"""
    
    if request.deal_id not in deals_storage:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    try:
        deal_data = deals_storage[request.deal_id]
        original_fields = ExtractedFields(**deal_data["extracted_fields"])
        original_risk_score = deal_data.get("risk_assessment", {}).get("risk_score", 0)
        
        # Create modified fields
        modified_fields_dict = original_fields.dict()
        modified_fields_dict.update(request.modified_fields)
        modified_fields = ExtractedFields(**modified_fields_dict)
        
        # Run validation on modified fields
        new_assessment = ai_engine.validate_fields(modified_fields)
        
        score_change = new_assessment.risk_score - original_risk_score
        
        return SimulationResponse(
            deal_id=request.deal_id,
            original_risk_score=original_risk_score,
            new_risk_score=new_assessment.risk_score,
            score_change=score_change,
            updated_validations=new_assessment.validations
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")

@app.get("/summary/{deal_id}")
async def get_deal_summary(deal_id: str):
    """Generate AI-powered plain English summary of deal analysis"""
    
    if deal_id not in deals_storage:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    try:
        deal_data = deals_storage[deal_id]
        risk_assessment = deal_data.get("risk_assessment", {})
        risk_score = risk_assessment.get("risk_score", 0)
        validations = risk_assessment.get("validations", [])
        
        # Generate AI summary based on risk factors
        critical_issues = [v for v in validations if v.get("severity") == "high"]
        warning_issues = [v for v in validations if v.get("severity") == "medium"]
        
        if risk_score >= 70:
            risk_description = "high risk"
            recommendation = "Recommend immediate human review and additional due diligence before proceeding."
        elif risk_score >= 40:
            risk_description = "moderate risk"
            recommendation = "Consider additional verification of flagged items before approval."
        else:
            risk_description = "low risk"
            recommendation = "Deal appears suitable for standard processing workflow."
        
        # Build detailed summary
        summary_parts = [
            f"This financial agreement presents {risk_description} with an overall score of {risk_score}/100."
        ]
        
        if critical_issues:
            critical_fields = [issue["field"] for issue in critical_issues]
            summary_parts.append(f"Critical concerns identified: {', '.join(critical_fields)}.")
        
        if warning_issues:
            warning_fields = [issue["field"] for issue in warning_issues]
            summary_parts.append(f"Additional attention required for: {', '.join(warning_fields)}.")
        
        summary_parts.append(recommendation)
        
        # Add specific insights
        insights = []
        if any("Interest Rate" in v.get("field", "") for v in validations if v.get("status") == "error"):
            insights.append("Missing interest rate specification creates pricing uncertainty and regulatory compliance risk.")
        
        if any("Counterparty" in v.get("field", "") for v in validations if v.get("status") == "warning"):
            insights.append("Counterparty verification incomplete - enhanced due diligence recommended.")
        
        return {
            "deal_id": deal_id,
            "risk_score": risk_score,
            "risk_level": risk_assessment.get("risk_level", "Unknown"),
            "summary": " ".join(summary_parts),
            "key_insights": insights,
            "critical_issues_count": len(critical_issues),
            "warning_issues_count": len(warning_issues),
            "generated_at": datetime.now().isoformat(),
            "confidence": round(random.uniform(0.88, 0.96), 2)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summary generation failed: {str(e)}")

@app.get("/deals")
async def list_deals():
    """Get list of all processed deals for dashboard"""
    
    deals_list = []
    for deal_id, deal_data in deals_storage.items():
        risk_assessment = deal_data.get("risk_assessment", {})
        
        deals_list.append({
            "deal_id": deal_id,
            "filename": deal_data.get("filename", "Unknown"),
            "counterparty": deal_data.get("extracted_fields", {}).get("counterparty", "Unknown"),
            "notional_amount": deal_data.get("extracted_fields", {}).get("notional_amount", "0"),
            "currency": deal_data.get("extracted_fields", {}).get("currency", "USD"),
            "risk_score": risk_assessment.get("risk_score", 0),
            "risk_level": risk_assessment.get("risk_level", "Unknown"),
            "status": deal_data.get("status", "uploaded"),
            "uploaded_at": deal_data.get("uploaded_at"),
            "validated_at": deal_data.get("validated_at")
        })
    
    # Sort by upload date (most recent first)
    deals_list.sort(key=lambda x: x.get("uploaded_at", ""), reverse=True)
    
    return {
        "deals": deals_list,
        "total_count": len(deals_list),
        "high_risk_count": len([d for d in deals_list if d["risk_score"] >= 70]),
        "medium_risk_count": len([d for d in deals_list if 40 <= d["risk_score"] < 70]),
        "low_risk_count": len([d for d in deals_list if d["risk_score"] < 40])
    }

@app.get("/deal/{deal_id}")
async def get_deal_details(deal_id: str):
    """Get complete deal details including all analysis results"""
    
    if deal_id not in deals_storage:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    return deals_storage[deal_id]

@app.delete("/deal/{deal_id}")
async def delete_deal(deal_id: str):
    """Delete a deal from storage"""
    
    if deal_id not in deals_storage:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    del deals_storage[deal_id]
    return {"message": f"Deal {deal_id} deleted successfully"}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "deals_in_storage": len(deals_storage),
        "api_version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)