from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from app.services.pdf_processor import extract_pdf_text
from app.utils.text_cleaner import clean_text

app = FastAPI(title="Lab Manual Conversational Assistant", version="1.0.0")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "Lab Manual Conversational Assistant API is running"}


@app.post("/upload-lab-manual")
async def upload_lab_manual(file: UploadFile = File(...)):
    """
    Upload a laboratory manual PDF and extract text content.
    
    Args:
        file: PDF file to upload
        
    Returns:
        JSON response with extracted text info
    """
    # Validate file extension
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    # Save file temporarily
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    try:
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)

        # Extract text from PDF
        pages, raw_text = extract_pdf_text(file_path)
        
        # Clean extracted text
        cleaned_text = clean_text(raw_text)
        
        # Generate preview
        preview = cleaned_text[:1000] + ("..." if len(cleaned_text) > 1000 else "")
        
        return JSONResponse({
            "status": "success",
            "pages": pages,
            "text_preview": preview,
            "total_characters": len(cleaned_text)
        })
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")
    
    finally:
        # Clean up temporary file
        if os.path.exists(file_path):
            os.remove(file_path)