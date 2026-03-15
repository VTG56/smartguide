import re


def clean_text(text: str) -> str:
    """
    Cleans extracted PDF text:
    - Removes excessive spaces and tabs
    - Fixes broken lines (hyphenated words)
    - Removes multiple consecutive newlines
    - Normalizes whitespace
    
    Args:
        text (str): Raw extracted text from PDF
        
    Returns:
        str: Cleaned text
    """
    # Remove multiple spaces and tabs
    text = re.sub(r"[ \t]+", " ", text)
    
    # Fix broken lines (join lines ending with hyphen)
    text = re.sub(r"-\n", "", text)
    
    # Remove multiple newlines (replace with single newline)
    text = re.sub(r"\n+", "\n", text)
    
    # Normalize to strip leading/trailing spaces
    text = text.strip()
    
    return text