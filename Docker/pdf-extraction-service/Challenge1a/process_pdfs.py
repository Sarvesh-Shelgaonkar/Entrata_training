#!/usr/bin/env python3


import fitz  # That's PyMuPDF
import json
import sys
import time
import re
import unicodedata
import gc
import os
from pathlib import Path
from collections import defaultdict
from dataclasses import dataclass
from typing import List, Dict, Optional, Tuple

# Quick class for text bits
@dataclass
class TextBit:
    text: str
    page: int
    bbox: Tuple[float, float, float, float]
    font_size: float
    font_flags: int
    font_name: str

    @property
    def bold(self) -> bool:
        return bool(self.font_flags & 2**4)

    @property
    def italic(self) -> bool:
        return bool(self.font_flags & 2**1)

# Class to keep track of how long things take
class PerfTracker:
    """Tracks how long stuff takes and some stats"""

    def __init__(self, max_time: float = 30.0):
        self.start = time.time()
        self.max_time = max_time
        self.stats = {
            "time_taken": 0,
            "pages_done": 0,
            "toc_heads": 0,
            "text_heads": 0,
            "final_heads": 0,
            "early_stop": False,
        }

    def log(self, msg: str):
        elapsed = time.time() - self.start
        print(f"[{elapsed:.2f}s] {msg}", file=sys.stderr)

    def time_left(self, buffer: float = 1.0) -> bool:
        elapsed = time.time() - self.start
        return elapsed < (self.max_time - buffer)

    def wrap_up(self):
        self.stats["time_taken"] = time.time() - self.start
        print(f"Stats: {self.stats}", file=sys.stderr)

def clean_text(text: str) -> str:
    """Cleans up text for different languages"""
    if not text:
        return ""

    # Normalize unicode
    text = unicodedata.normalize("NFKC", text)
    
    # Strip out weird direction stuff
    text = re.sub(r"[\u200e\u200f\u202a-\u202e\u2066-\u2069]", "", text)
    
    # Fix spaces in asian text
    text = re.sub(
        r"(?<=[\u4e00-\u9fff\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff])\s+(?=[\u4e00-\u9fff\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff])",
        "",
        text,
    )
    
    # Squash extra spaces
    text = re.sub(r"\s+", " ", text).strip()
    
    return text

def get_doc_title(doc: fitz.Document, pdf_path: str) -> str:
    """Tries to grab the title from metadata or first page"""

    # First try metadata
    try:
        meta = doc.metadata
        if meta and meta.get("title", "").strip():
            title = clean_text(meta["title"])
            if len(title) > 3 and len(title) < 200:
                return title
    except:
        pass

    # Then look at biggest text on page 1
    try:
        if len(doc) > 0:
            page = doc[0]
            blocks = page.get_text("dict")["blocks"]

            max_size = 0
            candidates = []

            for block in blocks:
                if "lines" not in block:
                    continue

                for line in block["lines"]:
                    line_parts = []
                    line_sizes = []

                    for span in line["spans"]:
                        txt = clean_text(span.get("text", ""))
                        size = span.get("size", 0)

                        if txt:
                            line_parts.append(txt)
                            line_sizes.append(size)

                    if line_parts and line_sizes:
                        combined = " ".join(line_parts)
                        avg_size = sum(line_sizes) / len(line_sizes)

                        if avg_size > max_size and len(combined) > 3:
                            max_size = avg_size
                            candidates = [combined]
                        elif avg_size == max_size and avg_size > 0 and len(combined) > 3:
                            candidates.append(combined)

            if candidates and max_size > 0:
                title = candidates[0]  # Just pick the first one
                if 3 < len(title) < 200:
                    return title
    except:
        pass

    # Fallback to filename
    return Path(pdf_path).stem

def grab_toc_heads(doc: fitz.Document, tracker: PerfTracker) -> List[Dict]:
    """Pulls headings from the TOC if it exists"""
    heads = []
    tracker.log("Grabbing TOC headings")

    try:
        toc = doc.get_toc()
        if not toc:
            return heads

        for lvl, title, pg in toc:
            if lvl > 3:  # Stick to top levels
                continue

            txt = clean_text(title)
            if txt and len(txt) > 1:
                heads.append({
                    "level": f"H{lvl}",
                    "text": txt,
                    "page": max(1, pg),
                    "source": "toc",
                })

        tracker.stats["toc_heads"] = len(heads)

    except Exception as e:
        print(f"TOC grab failed: {e}", file=sys.stderr)

    return heads

def extract_texts(doc: fitz.Document, tracker: PerfTracker) -> List[TextBit]:
    """Pulls out text elements from pages, tries to be smart about it"""
    tracker.log("Pulling text elements")
    
    elems = []
    total_pages = len(doc)
    
    for pg_num in range(total_pages):
        try:
            page = doc[pg_num]
            blocks = page.get_text("dict")["blocks"]
            
            for block in blocks:
                if "lines" not in block:
                    continue
                
                for line in block["lines"]:
                    spans = []
                    for span in line["spans"]:
                        txt = clean_text(span.get("text", ""))
                        if txt:
                            spans.append({
                                'text': txt,
                                'x': span.get("bbox", [0, 0, 0, 0])[0],
                                'size': span.get("size", 12),
                                'flags': span.get("flags", 0),
                                'font': span.get("font", ""),
                                'bbox': span.get("bbox", (0, 0, 0, 0))
                            })
                    
                    if not spans:
                        continue
                    
                    spans.sort(key=lambda s: s['x'])
                    
                    parts = []
                    prev = None
                    
                    for span in spans:
                        if prev and span['x'] - prev['bbox'][2] > 5:
                            parts.append(" ")
                        parts.append(span['text'])
                        prev = span
                    
                    combined = "".join(parts).strip()
                    
                    if combined and len(combined) > 1:
                        avg_size = sum(s['size'] for s in spans) / len(spans)
                        common_flags = max(set(s['flags'] for s in spans), key=lambda f: [s['flags'] for s in spans].count(f))
                        
                        elems.append(TextBit(
                            text=combined,
                            page=pg_num + 1,
                            bbox=spans[0]['bbox'],
                            font_size=avg_size,
                            font_flags=common_flags,
                            font_name=spans[0]['font']
                        ))
        
        except Exception as e:
            print(f"Page {pg_num + 1} error: {e}", file=sys.stderr)
            continue
    
    tracker.stats["pages_done"] = total_pages
    tracker.log(f"Got {len(elems)} text bits")
    return elems

def is_metadata(txt: str, pg: int) -> bool:
    """Checks if it's probably just metadata junk"""
    
    patterns = [
        r'^\d{1,2}\s+(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s+\d{4}$',
        r'^https?://',
        r'^Page\s+\d+',
        r'^www\.',
        r'^\d{4}-\d{2}-\d{2}$',
    ]
    
    if pg <= 3:
        return any(re.match(p, txt, re.IGNORECASE) for p in patterns)
    
    return any(re.match(p, txt, re.IGNORECASE) for p in patterns[:2])

def looks_like_heading(txt: str, size: float, bold: bool, body_size: float, pg: int) -> bool:
    """Decides if this text is a heading"""
    
    if not txt or len(txt.strip()) < 3:
        return False
    
    txt = txt.strip()
    words = len(txt.split())
    
    if is_metadata(txt, pg):
        return False
    
    rejects = [
        len(txt) > 150 or words > 15,
        txt.endswith((".", "!", "?", ";")) and words > 8,
        re.match(r"^[.\-_=]{5,}$", txt),
        "@" in txt or "http" in txt.lower(),
        len(set(txt.replace(" ", ""))) < 3 and len(txt) > 10,
        words == 1 and txt.lower() in ["the", "and", "or", "of", "page"],
    ]
    
    if any(rejects):
        return False
    
    strong = [
        r"^\d+\.\s+[A-Z]",
        r"^\d+\.\d+\s+[A-Z]",
        r"^\d+\.\d+\.\d+\s+[A-Z]",
        r"^Appendix\s+[A-Z]",
        r"^(Chapter|Section|Part|Phase)\s+",
        r"^(Abstract|Introduction|Conclusion|References|Bibliography|Acknowledgments|Summary|Background|Overview|Milestones)$",
        r"^Table\s+of\s+Contents$",
        r"^(Round|Phase)\s+\d+[AB]?:",
    ]
    
    if any(re.match(p, txt, re.IGNORECASE) for p in strong):
        return True
    
    ratio = size / body_size
    if ratio > 1.15 or (bold and ratio > 1.05):
        if 3 <= words <= 12 and not any(phrase in txt.lower() for phrase in [" will be ", " are the ", " is the ", " can be "]) and txt[0].isupper():
            return True
    
    if txt.isupper() and 3 <= len(txt) <= 50 and words <= 8:
        return True
    
    if txt.istitle() and 3 <= words <= 8 and len(txt) <= 70:
        return True
    
    return False

def get_level(txt: str, size: float, bold: bool, body_size: float) -> str:
    """Figures out if it's H1, H2, or H3"""
    
    ratio = size / body_size
    
    h1_checks = [
        re.match(r"^\d+\.?\s+[A-Z]", txt),
        re.match(r"^(Abstract|Introduction|Conclusion|References|Bibliography|Summary|Background|Overview)$", txt, re.IGNORECASE),
        re.match(r"^Appendix\s+[A-Z]", txt, re.IGNORECASE),
        re.match(r"^(Chapter|Part|Section)\s+\d+", txt, re.IGNORECASE),
        ratio >= 1.4,
        (bold and ratio >= 1.25 and len(txt.split()) <= 5),
    ]
    
    if any(h1_checks):
        return "H1"
    
    h2_checks = [
        re.match(r"^\d+\.\d+\.?\s+[A-Z]", txt),
        re.match(r"^Phase\s+[IVX]+", txt, re.IGNORECASE),
        ratio >= 1.2,
        (bold and ratio >= 1.1),
    ]
    
    if any(h2_checks):
        return "H2"
    
    return "H3"

def pull_headings(elems: List[TextBit], tracker: PerfTracker) -> List[Dict]:
    """Extracts headings from the text elements"""
    tracker.log("Extracting headings")
    
    if not elems:
        tracker.log("Nothing to extract!")
        return []
    
    body_cands = []
    for el in elems:
        if not el.bold and len(el.text.split()) > 5:
            body_cands.append(el.font_size)
    
    if body_cands:
        body_size = max(set(body_cands), key=body_cands.count)
    else:
        all_sizes = [el.font_size for el in elems if not el.bold]
        body_size = max(set(all_sizes), key=all_sizes.count) if all_sizes else 12
    
    tracker.log(f"Body font size detected: {body_size:.1f}")
    
    heads = []
    seen = set()
    
    for el in elems:
        txt = el.text.strip()
        low_txt = txt.lower()
        
        if low_txt in seen:
            continue
        
        if looks_like_heading(txt, el.font_size, el.bold, body_size, el.page):
            lvl = get_level(txt, el.font_size, el.bold, body_size)
            
            heads.append({
                "level": lvl,
                "text": txt,
                "page": el.page,
                "source": "analysis",
            })
            
            seen.add(low_txt)
    
    heads.sort(key=lambda x: (x["page"], x["level"]))
    tracker.stats["text_heads"] = len(heads)
    tracker.log(f"Found {len(heads)} headings")
    return heads

def merge_heads(toc_heads: List[Dict], text_heads: List[Dict]) -> List[Dict]:
    """Combines TOC and text headings, removes duplicates"""
    finals = []
    seen = set()

    for head in toc_heads:
        norm = head["text"].lower().strip()
        if norm not in seen and len(head["text"]) > 2:
            finals.append({
                "level": head["level"],
                "text": head["text"],
                "page": head["page"],
            })
            seen.add(norm)

    for head in text_heads:
        norm = head["text"].lower().strip()

        if norm in seen:
            continue

        similar = False
        for s in seen:
            if (norm in s or s in norm) and abs(len(norm) - len(s)) < 10:
                similar = True
                break

            clean_n = re.sub(r"^\d+\.?\s*", "", norm)
            clean_s = re.sub(r"^\d+\.?\s*", "", s)
            if clean_n == clean_s and len(clean_n) > 5:
                similar = True
                break

        if not similar and len(head["text"]) > 2:
            finals.append({
                "level": head["level"],
                "text": head["text"],
                "page": head["page"],
            })
            seen.add(norm)

    finals.sort(key=lambda x: (x["page"], x["level"]))
    return finals

def make_outline(pdf_path: str) -> Dict:
    """Main func to build the outline"""
    tracker = PerfTracker(max_time=30.0)
    
    try:
        doc = fitz.open(pdf_path)
        tracker.log(f"PDF loaded, {len(doc)} pages")
        
        title = get_doc_title(doc, pdf_path)
        toc_heads = grab_toc_heads(doc, tracker)
        
        elems = extract_texts(doc, tracker)
        text_heads = pull_headings(elems, tracker)
        
        finals = merge_heads(toc_heads, text_heads)
        tracker.stats["final_heads"] = len(finals)
        
        doc.close()
        del elems
        gc.collect()
        
        tracker.wrap_up()
        return {"title": title, "outline": finals}
        
    except Exception as e:
        print(f"PDF error: {e}", file=sys.stderr)
        raise

def handle_pdf(pdf_path: str, out_path: str):
    """Processes one PDF and dumps to JSON"""
    try:
        res = make_outline(pdf_path)

        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(res, f, ensure_ascii=False, indent=2)

        print(f"Done: {Path(pdf_path).name} -> {Path(out_path).name}")
        return True

    except Exception as e:
        print(f"Failed {Path(pdf_path).name}: {e}")
        return False

def main():
    """Batch process PDFs in input dir"""
    in_dir = Path("input")
    out_dir = Path("output")

    out_dir.mkdir(parents=True, exist_ok=True)

    pdfs = list(in_dir.glob("*.pdf"))

    if not pdfs:
        print("No PDFs in input dir")
        sys.exit(1)

    print(f"Processing {len(pdfs)} PDFs")

    successes = 0
    start = time.time()

    for pdf in pdfs:
        out_file = pdf.stem + ".json"
        out_path = out_dir / out_file

        if handle_pdf(str(pdf), str(out_path)):
            successes += 1

    total_t = time.time() - start

    print("\nDone:")
    print(f"  Success: {successes}/{len(pdfs)}")
    print(f"  Time: {total_t:.2f}s")
    print(f"  Output: {out_dir}")

if __name__ == "__main__":
    if len(sys.argv) == 2 and not os.path.exists("/app/input"):
        pdf_path = sys.argv[1]
        if not Path(pdf_path).is_file():
            print(f"PDF not found: {pdf_path}", file=sys.stderr)
            sys.exit(1)
        
        try:
            res = make_outline(pdf_path)
            print(json.dumps(res, ensure_ascii=False, indent=2))
        except Exception as e:
            print(f"Error: {e}", file=sys.stderr)
            sys.exit(1)
    else:
        main()
