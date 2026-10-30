#!/usr/bin/env python3
import os
from pathlib import Path

root = Path("C:/Users/marti/OneDrive/Desktop/CXRLOSMP/Proyectos/AplicacionesWeb/Pizzeria/app/docs/responsive")
out = root / "responsive-documentacion.pdf"

# Simple PDF via reportlab
try:
    from reportlab.lib.pagesizes import LETTER
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib import colors
    from reportlab.lib.units import inch
except Exception:
    print("reportlab not available")
    raise

doc = SimpleDocTemplate(str(out), pagesize=LETTER, leftMargin=72, rightMargin=72, topMargin=72, bottomMargin=72)
styles = getSampleStyleSheet()
title_style = ParagraphStyle('Title', parent=styles['Heading1'], fontSize=20, spaceAfter=12, textColor=colors.HexColor('#1f2937'))
h2_style = ParagraphStyle('H2', parent=styles['Heading2'], fontSize=14, spaceAfter=8, textColor=colors.HexColor('#374151'))
normal = styles['BodyText']

story = []

# Portada
story.append(Spacer(1, 1.5*inch))
story.append(Paragraph('PizzaFlow', title_style))
story.append(Paragraph('Documentación de Responsive Design', styles['Title']))
story.append(Spacer(1, 0.3*inch))
story.append(Paragraph('Equipo: Grupo 4-C - UPChiapas', normal))
story.append(Paragraph('Proyecto: Pizzeria (PizzaFlow)', normal))
story.append(Paragraph('Fecha: 30-10-2026', normal))
story.append(Paragraph('Versión: v0.2.0-responsive', normal))
story.append(PageBreak())

# Implementación
md_files = {
    'Portada': root / '00-portada.md',
    'Implementación Responsive': root / 'implementacion-responsive.md',
    'Evidencias': root / 'capturas' / 'README.md'
}

for name, f in md_files.items():
    if not f.exists():
        continue
    story.append(Paragraph(name, h2_style))
    text = f.read_text(encoding='utf-8')
    # Very simple markdown to plain
    for line in text.splitlines():
        if line.startswith('# '):
            story.append(Paragraph(f'<b>{line[2:].strip()}</b>', h2_style))
        elif line.startswith('## '):
            story.append(Paragraph(f'<b>{line[3:].strip()}</b>', styles['Heading3']))
        elif line.startswith('- '):
            story.append(Paragraph(f'• {line[2:]}', normal))
        elif line.strip() == '':
            story.append(Spacer(1, 0.05*inch))
        else:
            # escape html
            story.append(Paragraph(line, normal))
    story.append(PageBreak())

doc.build(story)
print(f'PDF generado: {out}')
