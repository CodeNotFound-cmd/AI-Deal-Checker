# AI Deal Checker Backend API

A FastAPI-based backend service that provides AI-powered financial document analysis and risk assessment capabilities.

## Features

- **Document Upload & Extraction**: Simulates AI-powered field extraction from PDF/Word documents
- **Risk Assessment**: Rule-based validation with mock AI logic for realistic risk scoring
- **Scenario Simulation**: What-if analysis with dynamic risk recalculation
- **Benchmark Comparison**: Industry standard compliance checking
- **AI Explanations**: Plain-English reasoning for validation decisions
- **Deal Management**: Complete CRUD operations for deal lifecycle

## API Endpoints

### Core Endpoints

- `POST /upload` - Upload document and extract fields
- `POST /validate` - Run risk assessment and validation
- `POST /simulate` - Scenario analysis with modified parameters
- `GET /summary/{deal_id}` - Generate AI-powered summary
- `GET /deals` - List all processed deals
- `GET /deal/{deal_id}` - Get complete deal details
- `DELETE /deal/{deal_id}` - Delete deal from storage

### Utility Endpoints

- `GET /` - API information
- `GET /health` - Health check

## Quick Start

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Server**
   ```bash
   python main.py
   ```
   
   Or using uvicorn directly:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Access API Documentation**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## Mock AI Logic

The backend simulates intelligent document analysis using:

### Risk Scoring Rules
- **Missing Critical Fields**: +20-30 points
  - Interest Rate: +30 (highest impact)
  - Counterparty: +25
  - Notional Amount: +20
- **Date Inconsistencies**: +25 points
- **Large Notional Amounts**: +15 points (>$100M)
- **Non-standard Settlement**: +10 points
- **Currency Issues**: +15 points

### AI Explanations
- Regulatory references (ISDA standards)
- Plain-English reasoning
- Actionable recommendations
- Document snippet highlighting

### Benchmark Comparison
- Industry standard compliance checking
- Color-coded status indicators
- Detailed descriptions for each requirement

## Data Models

### ExtractedFields
```python
{
    "counterparty": "ABC Bank Ltd.",
    "notional_amount": "100000000",
    "currency": "USD",
    "interest_rate": "5.25",
    "trade_date": "2024-01-15",
    "maturity_date": "2025-01-15",
    "settlement_date": "2024-01-17",
    "collateral": "Government Bonds",
    "termination_clause": "30 days"
}
```

### ValidationResult
```python
{
    "field": "Interest Rate",
    "status": "error",  # valid, warning, error
    "explanation": "Missing interest rate violates ISDA standards",
    "severity": "high",  # low, medium, high
    "confidence": 0.95
}
```

### RiskAssessment
```python
{
    "risk_score": 73,
    "risk_level": "High Risk",
    "validations": [...],
    "ai_explanations": {...},
    "benchmark_comparison": [...]
}
```

## Integration with Frontend

The API is designed to work seamlessly with the React frontend:

1. **CORS Enabled**: Allows cross-origin requests from frontend
2. **JSON Responses**: Clean, structured data for easy consumption
3. **Error Handling**: Proper HTTP status codes and error messages
4. **Realistic Timing**: Simulated processing delays for demo realism

## Production Considerations

For production deployment:

1. **Database**: Replace in-memory storage with PostgreSQL/MongoDB
2. **Authentication**: Add JWT-based auth for user management
3. **File Storage**: Use cloud storage (AWS S3) for document persistence
4. **Real AI**: Integrate actual NLP/ML models for document processing
5. **Monitoring**: Add logging, metrics, and health checks
6. **Security**: Input validation, rate limiting, and security headers

## Architecture

```
Frontend (React) → API Gateway → FastAPI Backend → AI Engine
                                      ↓
                              In-Memory Storage
                              (Production: Database)
```

The backend provides a complete simulation of an enterprise-grade financial document analysis system, perfect for hackathon demonstrations while maintaining the flexibility to scale to production requirements.