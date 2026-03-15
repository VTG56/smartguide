from PyPDF2 import PdfReader


def extract_pdf_text(pdf_path: str) -> tuple:
    """
    Extracts text from a PDF file page by page.
    
    Args:
        pdf_path (str): Path to the PDF file
        
    Returns:
        tuple: (number_of_pages, full_text)
    """
    reader = PdfReader(pdf_path)
    pages = len(reader.pages)
    text = ""
    
    # Extract text from each page
    for page_num, page in enumerate(reader.pages):
        page_text = page.extract_text() or ""
        text += f"\n--- Page {page_num + 1} ---\n{page_text}"
    
    return pages, text