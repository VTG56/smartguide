"""
Script to create test PDF files for testing the backend
"""

try:
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas
    from reportlab.lib import colors
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    
    def create_test_pdf():
        """Create a sample lab manual PDF"""
        pdf_path = "test_lab_manual.pdf"
        
        # Create PDF
        doc = SimpleDocTemplate(pdf_path, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []
        
        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1f4788'),
            spaceAfter=30,
            alignment=1  # Center alignment
        )
        story.append(Paragraph("Laboratory Manual", title_style))
        story.append(Paragraph("Physics Department", styles['Normal']))
        story.append(Spacer(1, 20))
        
        # Experiment 1
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#1f4788'),
            spaceAfter=12
        )
        
        story.append(Paragraph("Experiment 1: Verification of Ohm's Law", heading_style))
        story.append(Spacer(1, 6))
        
        experiment_text = """
        <b>Objective:</b> To verify the relationship between voltage, current, and resistance 
        as stated by Ohm's Law (V = IR).<br/><br/>
        
        <b>Materials Required:</b><br/>
        - Variable DC Power Supply<br/>
        - Ammeter (0-5A range)<br/>
        - Voltmeter (0-100V range)<br/>
        - Resistors (10Ω, 20Ω, 50Ω)<br/>
        - Connecting wires<br/>
        - Rheostat<br/><br/>
        
        <b>Theory:</b><br/>
        Ohm's Law states that the current flowing through a conductor is directly proportional 
        to the potential difference applied across its ends, provided the temperature and physical 
        conditions remain unchanged.<br/><br/>
        
        <b>Procedure:</b><br/>
        1. Set up the circuit as shown in the diagram<br/>
        2. Start with zero voltage<br/>
        3. Gradually increase the voltage in steps of 10V<br/>
        4. Note the corresponding current reading<br/>
        5. Repeat for different resistors<br/>
        6. Plot V vs I graphs<br/><br/>
        
        <b>Observations:</b><br/>
        Record voltage and current readings in the table below.<br/>
        """
        
        story.append(Paragraph(experiment_text, styles['BodyText']))
        story.append(Spacer(1, 20))
        story.append(PageBreak())
        
        # Experiment 2
        story.append(Paragraph("Experiment 2: Study of Series Circuit", heading_style))
        story.append(Spacer(1, 6))
        
        exp2_text = """
        <b>Objective:</b> To study the behavior of resistors when connected in series and 
        verify that the total resistance equals the sum of individual resistances.<br/><br/>
        
        <b>Theory:</b><br/>
        When resistors are connected in series, the same current flows through each resistor. 
        The total voltage drop is the sum of individual voltage drops across each resistor. 
        Therefore, R_total = R1 + R2 + R3 + ...<br/><br/>
        
        <b>Procedure:</b><br/>
        1. Connect resistors in series<br/>
        2. Apply known voltage<br/>
        3. Measure current flowing through circuit<br/>
        4. Calculate total resistance using V = IR<br/>
        5. Compare with sum of individual resistances<br/>
        """
        
        story.append(Paragraph(exp2_text, styles['BodyText']))
        story.append(Spacer(1, 20))
        story.append(PageBreak())
        
        # Experiment 3
        story.append(Paragraph("Experiment 3: Study of Parallel Circuit", heading_style))
        story.append(Spacer(1, 6))
        
        exp3_text = """
        <b>Objective:</b> To study the behavior of resistors when connected in parallel and 
        verify the parallel resistance formula.<br/><br/>
        
        <b>Theory:</b><br/>
        In a parallel circuit, the voltage across each resistor is the same, but current 
        distributes among the branches. The reciprocal of total resistance equals the sum of 
        reciprocals of individual resistances: 1/R_total = 1/R1 + 1/R2 + 1/R3 + ...<br/><br/>
        
        <b>Procedure:</b><br/>
        1. Connect resistors in parallel<br/>
        2. Apply known voltage<br/>
        3. Measure current through each branch<br/>
        4. Calculate equivalent resistance<br/>
        5. Verify using parallel resistance formula<br/>
        """
        
        story.append(Paragraph(exp3_text, styles['BodyText']))
        
        # Build PDF
        doc.build(story)
        print(f"✓ Created test PDF: {pdf_path}")
        print(f"  File size: {len(open(pdf_path, 'rb').read())} bytes")
        return pdf_path
    
    if __name__ == "__main__":
        print("\nCreating test PDF file...")
        pdf_file = create_test_pdf()
        print(f"\nYou can now test the backend with:")
        print(f"  python test_backend.py")
        
except ImportError:
    print("reportlab not installed. Installing...")
    import subprocess
    subprocess.check_call(["pip", "install", "reportlab"])
    print("\nNow run this script again:")
    print("  python create_test_pdf.py")
