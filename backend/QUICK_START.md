# Lab Manual Conversational Assistant - Quick Start Guide

## ✅ SETUP COMPLETE

Your backend is fully configured and **currently running** at: **http://localhost:8000**

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py              # Package marker
│   ├── main.py                  # FastAPI application & endpoints
│   ├── routes/                  # Route modules (for future expansion)
│   ├── services/
│   │   └── pdf_processor.py     # PDF extraction logic
│   └── utils/
│       └── text_cleaner.py      # Text cleaning utilities
├── requirements.txt             # Python dependencies
├── test_backend.py              # Automated test suite
├── create_test_pdf.py           # Test PDF generator
├── README.md                    # Full documentation
├── TESTING.md                   # Testing guide
└── QUICK_START.md               # This file
```

---

## 🚀 How to Use

### 1. **Start the Server** (if not already running)

```bash
cd backend
uvicorn app.main:app --reload
```

### 2. **Test via Web Interface** (Easiest)

Open: **http://localhost:8000/docs**

- Click on the green `POST /upload-lab-manual` endpoint
- Click "Try it out"
- Click "Choose File" and upload a PDF
- Click "Execute"
- View results instantly

### 3. **Test via Python**

```python
import requests

with open("test_lab_manual.pdf", "rb") as f:
    files = {"file": f}
    response = requests.post("http://localhost:8000/upload-lab-manual", files=files)
    print(response.json())
```

### 4. **Run Automated Tests**

```bash
python test_backend.py
```

---

## 📊 API Endpoints

| Endpoint             | Method | Purpose                     |
| -------------------- | ------ | --------------------------- |
| `/`                  | GET    | Health check                |
| `/upload-lab-manual` | POST   | Upload PDF and extract text |

---

## 📋 Sample Response

```json
{
  "status": "success",
  "pages": 2,
  "text_preview": "--- Page 1 ---\nLaboratory Manual - Physics Department\nExperiment 1: Verification of Ohm's Law...",
  "total_characters": 544
}
```

---

## 🧪 Testing Scenarios

### Scenario 1: Test with Your Own PDF

```bash
# Upload any PDF file
python -c "
import requests
with open('your_pdf.pdf', 'rb') as f:
    r = requests.post('http://localhost:8000/upload-lab-manual', files={'file': f})
    print(r.json())
"
```

### Scenario 2: Test Error Handling

```bash
# Try uploading a non-PDF file (should get 400 error)
python -c "
import requests
with open('test.txt', 'w') as tf:
    tf.write('Not a PDF')
with open('test.txt', 'rb') as f:
    r = requests.post('http://localhost:8000/upload-lab-manual', files={'file': f})
    print(f'Status: {r.status_code}')
    print(f'Error: {r.json()}')
"
```

### Scenario 3: Test Health Check

```bash
curl http://localhost:8000/
```

---

## 🔧 Backend Features

✅ **PDF Upload** - Accept PDF files via multipart form data
✅ **Text Extraction** - Extract text from all PDF pages
✅ **Text Cleaning** - Remove extra spaces, fix broken lines
✅ **Page Counting** - Report number of pages
✅ **CORS Enabled** - Ready for frontend integration
✅ **Error Handling** - Graceful error responses
✅ **Automatic Cleanup** - Deletes temporary files
✅ **Interactive Docs** - Swagger UI at `/docs`

---

## 📦 Dependencies

All installed in your environment:

- **fastapi** - Web framework
- **uvicorn** - ASGI server
- **pypdf2** - PDF text extraction
- **python-multipart** - Form data handling

---

## 🔗 Next Steps (For Future Implementation)

1. **Phase 2**: Implement LangChain integration
2. **Phase 3**: Add FAISS vector database
3. **Phase 4**: Implement conversational endpoints
4. **Phase 5**: Add authentication

---

## 🐛 Troubleshooting

### Server won't start

```bash
# Check if port 8000 is in use
netstat -ano | findstr :8000
# Kill the process if needed
taskkill /PID <PID> /F
# Then restart
uvicorn app.main:app --reload
```

### PDF extraction fails

- Ensure PDF is valid and not corrupted
- Check PyPDF2 installation: `pip list | grep -i pypdf`

### Import errors

```bash
# Reinstall dependencies
pip install -r requirements.txt
```

---

## 📚 Documentation Files

- **README.md** - Full project documentation
- **TESTING.md** - Detailed testing methods
- **test_backend.py** - Automated test suite
- **create_test_pdf.py** - Test PDF generator

---

## ✨ Test Results

```
Passed: 3 | Failed: 0 | Skipped: 0

✓ Health Check: PASSED
✓ Invalid File Type: PASSED
✓ PDF Upload: PASSED
```

---

## 🎯 Current Status

| Component          | Status                            |
| ------------------ | --------------------------------- |
| Backend Setup      | ✅ Complete                       |
| API Endpoints      | ✅ Working                        |
| Testing Suite      | ✅ All Pass                       |
| Server Running     | ✅ Active (http://localhost:8000) |
| Documentation      | ✅ Complete                       |
| Ready for Frontend | ✅ Yes                            |

---

**Ready to use!** Start uploading lab manuals 🎓
