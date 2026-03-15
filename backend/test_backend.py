"""
Simple test script for Lab Manual Backend API
"""

import requests
import json
import sys
from pathlib import Path

BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test the health check endpoint"""
    print("\n" + "="*60)
    print("TEST 1: Health Check")
    print("="*60)
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"✓ Status Code: {response.status_code}")
        print(f"✓ Response: {json.dumps(response.json(), indent=2)}")
        return True
    except Exception as e:
        print(f"✗ Error: {e}")
        print("Make sure the server is running: uvicorn app.main:app --reload")
        return False


def test_invalid_file():
    """Test uploading a non-PDF file"""
    print("\n" + "="*60)
    print("TEST 2: Invalid File Type (should fail gracefully)")
    print("="*60)
    try:
        # Create a temporary text file
        test_file = "test_invalid.txt"
        with open(test_file, "w") as f:
            f.write("This is not a PDF file")
        
        with open(test_file, "rb") as f:
            files = {"file": f}
            response = requests.post(f"{BASE_URL}/upload-lab-manual", files=files)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        Path(test_file).unlink()  # Clean up
        
        if response.status_code == 400:
            print("✓ Correctly rejected non-PDF file")
            return True
        else:
            print("✗ Should have returned 400 status code")
            return False
            
    except Exception as e:
        print(f"✗ Error: {e}")
        return False


def test_pdf_upload(pdf_path):
    """Test uploading a PDF file"""
    print("\n" + "="*60)
    print(f"TEST 3: PDF Upload - {pdf_path}")
    print("="*60)
    
    if not Path(pdf_path).exists():
        print(f"✗ PDF file not found: {pdf_path}")
        print("\nTo create a test PDF, run:")
        print("  python create_test_pdf.py")
        return False
    
    try:
        with open(pdf_path, "rb") as f:
            files = {"file": f}
            response = requests.post(f"{BASE_URL}/upload-lab-manual", files=files)
        
        print(f"Status Code: {response.status_code}")
        result = response.json()
        print(f"\nResponse:")
        print(f"  Status: {result.get('status')}")
        print(f"  Pages: {result.get('pages')}")
        print(f"  Total Characters: {result.get('total_characters')}")
        print(f"  Preview: {result.get('text_preview')[:200]}...")
        
        if response.status_code == 200 and result.get('status') == 'success':
            print("\n✓ PDF uploaded and processed successfully")
            return True
        else:
            print("\n✗ Unexpected response")
            return False
            
    except Exception as e:
        print(f"✗ Error: {e}")
        return False


def main():
    print("\n")
    print("╔" + "="*58 + "╗")
    print("║  Lab Manual Backend - Test Suite               ║")
    print("╚" + "="*58 + "╝")
    
    results = []
    
    # Test 1: Health check
    results.append(("Health Check", test_health_check()))
    
    if not results[0][1]:
        print("\n✗ Server is not running. Start it with:")
        print("  uvicorn app.main:app --reload")
        sys.exit(1)
    
    # Test 2: Invalid file
    results.append(("Invalid File Type", test_invalid_file()))
    
    # Test 3: PDF upload
    pdf_files = ["test_lab_manual.pdf", "sample.pdf", "manual.pdf"]
    pdf_found = None
    for pdf in pdf_files:
        if Path(pdf).exists():
            pdf_found = pdf
            break
    
    if pdf_found:
        results.append(("PDF Upload", test_pdf_upload(pdf_found)))
    else:
        print("\n" + "="*60)
        print("TEST 3: PDF Upload - SKIPPED")
        print("="*60)
        print("No test PDF found. To create one, run:")
        print("  python create_test_pdf.py")
        results.append(("PDF Upload", None))
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    for test_name, result in results:
        if result is True:
            print(f"✓ {test_name}: PASSED")
        elif result is False:
            print(f"✗ {test_name}: FAILED")
        else:
            print(f"- {test_name}: SKIPPED")
    
    passed = sum(1 for _, r in results if r is True)
    failed = sum(1 for _, r in results if r is False)
    skipped = sum(1 for _, r in results if r is None)
    
    print("\n" + "-"*60)
    print(f"Passed: {passed} | Failed: {failed} | Skipped: {skipped}")
    print("="*60 + "\n")


if __name__ == "__main__":
    main()
