import requests
from bs4 import BeautifulSoup
import json
import time
import os

LINKS = [
    "https://uganc.edu.gn/facultes-et-instituts/7400-2/",
    "https://uganc.edu.gn/facultes-et-instituts/7406-2/",
    "https://uganc.edu.gn/facultes-et-instituts/centre-informatique/",
    "https://uganc.edu.gn/facultes-et-instituts/institut-des-chemins-de-fer/",
    "https://uganc.edu.gn/facultes-et-instituts/institut-polytechnique/"
]

def scrape_faculties():
    results = []
    
    for url in LINKS:
        print(f"Scraping {url}...")
        try:
            res = requests.get(url, timeout=15)
            res.raise_for_status()
            soup = BeautifulSoup(res.text, 'html.parser')
            
            # Find the main content
            title_el = soup.find('h1') or soup.find('h2')
            title = title_el.text.strip() if title_el else url.split('/')[-2].replace('-', ' ').title()
            
            paragraphs = soup.find_all('p')
            text_content = "\n".join([p.text.strip() for p in paragraphs if len(p.text.strip()) > 20])
            
            # Find lists (often contain filières or programs)
            lists = soup.find_all('ul')
            list_content = ""
            for ul in lists:
                for li in ul.find_all('li'):
                    txt = li.text.strip()
                    if txt:
                        list_content += f"- {txt}\n"
            
            combined_text = f"{text_content}\n\nProgrammes et départements:\n{list_content}"
            
            results.append({
                "universite": "UGANC",
                "faculte": title,
                "url": url,
                "description_detaillee": combined_text[:3000] # Limiting size
            })
            time.sleep(1) # Be polite
        except Exception as e:
            print(f"Error scraping {url}: {e}")
            
    output_path = os.path.join(os.path.dirname(__file__), 'scraped_uganc_filieres.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
        
    print(f"Saved {len(results)} faculty profiles to {output_path}")

if __name__ == '__main__':
    scrape_faculties()
