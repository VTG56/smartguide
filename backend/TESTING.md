# Lab Manual Backend - Testing Guide

## Server Status

✅ **Server is running at: http://localhost:8000**

## Testing Methods

### 1. Interactive API Documentation (Easiest)

Visit: **http://localhost:8000/docs**

- Scroll to `POST /upload-lab-manual`
- Click "Try it out"
- Click "Choose File" and select a PDF
- Click "Execute"
- See results instantly

### 2. Alternative Interactive Docs

Visit: **http://localhost:8000/redoc** (Alternative UI)

### 3. Python Test Script

Create `test_backend.py` in the backend folder:

```python
import requests
import os

# Test health check
print("Testing health check endpoint...")
response = requests.get("http://localhost:8000/")
print(f"✓ Response: {response.json()}\n")

# Test PDF upload
pdf_path = "sample.pdf"  # Replace with your PDF

if os.path.exists(pdf_path):
    print(f"Testing PDF upload with {pdf_path}...")
    with open(pdf_path, "rb") as f:
        files = {"file": f}
        response = requests.post("http://localhost:8000/upload-lab-manual", files=files)

    result = response.json()
    print(f"✓ Status: {result['status']}")
    print(f"✓ Pages: {result['pages']}")
    print(f"✓ Characters: {result['total_characters']}")
    print(f"✓ Preview: {result['text_preview'][:100]}...\n")
else:
    print(f"⚠ {pdf_path} not found. Place a PDF in the backend folder to test.")
```

Run it:

```bash
python test_backend.py
```

### 4. PowerShell Test (Windows)

```powershell
# Test health check
$response = Invoke-WebRequest -Uri 'http://localhost:8000/' -UseBasicParsing
$response.Content | ConvertFrom-Json

# Test PDF upload (replace with your PDF path)
$pdfPath = "C:\path\to\sample.pdf"
$response = Invoke-WebRequest -Uri 'http://localhost:8000/upload-lab-manual' `
    -Method Post `
    -Form @{file=Get-Item $pdfPath} `
    -UseBasicParsing
$response.Content | ConvertFrom-Json
```

### 5. cURL Test (Linux/Mac/Windows with Git Bash)

```bash
# Health check
curl http://localhost:8000/

# Upload PDF
curl -X POST "http://localhost:8000/upload-lab-manual" \
  -F "file=@/path/to/sample.pdf"
```

### 6. VS Code REST Client

Install the REST Client extension, then create `test.http`:

```http
### Health Check
GET http://localhost:8000/

### Upload PDF
POST http://localhost:8000/upload-lab-manual
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="sample.pdf"
Content-Type: application/pdf

< ./sample.pdf
------WebKitFormBoundary--
```

Click "Send Request" on each endpoint.

## Example Response

```json
{
  "status": "success",
  "pages": 25,
  "text_preview": "Experiment 1: Verification of Ohm's Law...",
  "total_characters": 45328
}
```

## Error Testing

### Test invalid file type

```python
with open("test.txt", "w") as f:
    f.write("This is not a PDF")

files = {"file": open("test.txt", "rb")}
response = requests.post("http://localhost:8000/upload-lab-manual", files=files)
print(response.status_code)  # Should be 400
print(response.json())  # {"detail": "Only PDF files are allowed."}
```

### Expected response:

```json
{
  "detail": "Only PDF files are allowed."
}
```

## Troubleshooting

### Server won't start

```bash
# Kill existing processes on port 8000
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Then restart
uvicorn app.main:app --reload
```

### PDF extraction fails

- Ensure PDF is valid and not corrupted
- Check PyPDF2 is installed: `pip list | grep -i pypdf`

### CORS issues

- Backend already has CORS enabled for all origins
- Should work from any frontend

## File Upload Size Limits

- FastAPI default: 25 MB
- To modify, edit `app/main.py` and add max_upload_size

## API Endpoints Summary

| Method | Endpoint             | Purpose                     |
| ------ | -------------------- | --------------------------- |
| GET    | `/`                  | Health check                |
| POST   | `/upload-lab-manual` | Upload PDF and extract text |

## Next: Creating Test PDFs

If you don't have a test PDF, create one with Python:

```python
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

# Create a simple PDF
pdf_path = "test_lab_manual.pdf"
c = canvas.Canvas(pdf_path, pagesize=letter)
c.drawString(100, 750, "Experiment 1: Verification of Ohm's Law")
c.drawString(100, 730, "Objective: To verify Ohm's Law")
c.drawString(100, 710, "Materials: Resistor, Voltmeter, Ammeter")
c.save()
print(f"Test PDF created: {pdf_path}")
```

Then test with:

```bash
python test_backend.py
```
