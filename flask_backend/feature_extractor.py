"""
URL Feature Extraction Module
Extracts features from URLs for ML model prediction
"""

import re
from urllib.parse import urlparse
import pandas as pd

# Try to import tld, fallback if not available
try:
    from tld import get_tld
    HAS_TLD = True
except ImportError:
    HAS_TLD = False


def get_tld_length(url: str) -> int:
    """Get the length of the top-level domain"""
    if HAS_TLD:
        tld_name = get_tld(url, fail_silently=True)
        return len(tld_name) if tld_name else -1
    else:
        # Fallback: extract TLD manually
        parsed = urlparse(url)
        hostname = parsed.hostname or ''
        parts = hostname.split('.')
        if len(parts) >= 2:
            return len(parts[-1])
        return -1


def extract_features(url: str) -> dict:
    """
    Extract all features from a URL for ML prediction.
    Returns a dictionary of feature names and values.
    """
    features = {}
    
    # Parse URL
    parsed = urlparse(url)
    hostname = parsed.hostname or ''
    path = parsed.path or ''
    
    # 1. use_of_ip - Check if URL uses IP address instead of domain
    ip_pattern = (
        r'(([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.'
        r'([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\/)|'
        r'((0x[0-9a-fA-F]{1,2})\.(0x[0-9a-fA-F]{1,2})\.(0x[0-9a-fA-F]{1,2})\.(0x[0-9a-fA-F]{1,2})\/)|'
        r'(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}'
    )
    features['use_of_ip'] = 1 if re.search(ip_pattern, url) else 0
    
    # 2. abnormal_url - Check if hostname appears in URL (should be there)
    match_abnormal = re.search(re.escape(str(hostname)), url) if hostname else None
    features['abnormal_url'] = 0 if match_abnormal else 1
    
    # 3. count. - Number of dots
    features['count.'] = url.count('.')
    
    # 4. count-www - Number of 'www' occurrences
    features['count-www'] = url.count('www')
    
    # 5. count@ - Number of @ symbols (suspicious)
    features['count@'] = url.count('@')
    
    # 6. count_dir - Number of directories in path
    features['count_dir'] = path.count('/')
    
    # 7. count_embed_domain - Embedded domain check
    features['count_embed_domian'] = path.count('//')
    
    # 8. sus_url - Suspicious keywords
    sus_pattern = r'PayPal|login|signin|bank|account|update|free|lucky|service|bonus|ebayisapi|webscr'
    features['sus_url'] = 1 if re.search(sus_pattern, url, re.IGNORECASE) else 0
    
    # 9. short_url - URL shortener detection
    short_pattern = (
        r'bit\.ly|goo\.gl|shorte\.st|go2l\.ink|x\.co|ow\.ly|t\.co|tinyurl|tr\.im|is\.gd|cli\.gs|'
        r'yfrog\.com|migre\.me|ff\.im|tiny\.cc|url4\.eu|twit\.ac|su\.pr|twurl\.nl|snipurl\.com|'
        r'short\.to|BudURL\.com|ping\.fm|post\.ly|Just\.as|bkite\.com|snipr\.com|fic\.kr|loopt\.us|'
        r'doiop\.com|short\.ie|kl\.am|wp\.me|rubyurl\.com|om\.ly|to\.ly|bit\.do|lnkd\.in|'
        r'db\.tt|qr\.ae|adf\.ly|bitly\.com|cur\.lv|tinyurl\.com|ity\.im|'
        r'q\.gs|po\.st|bc\.vc|twitthis\.com|u\.to|j\.mp|buzurl\.com|cutt\.us|u\.bb|yourls\.org|'
        r'prettylinkpro\.com|scrnch\.me|filoops\.info|vzturl\.com|qr\.net|1url\.com|tweez\.me|v\.gd|'
        r'link\.zip\.net'
    )
    features['short_url'] = 1 if re.search(short_pattern, url, re.IGNORECASE) else 0
    
    # 10. count-https - HTTPS occurrences
    features['count-https'] = url.count('https')
    
    # 11. count-http - HTTP occurrences
    features['count-http'] = url.count('http')
    
    # 12. count% - Percent encoding
    features['count%'] = url.count('%')
    
    # 13. count- - Hyphens
    features['count-'] = url.count('-')
    
    # 14. count= - Equals signs (query params)
    features['count='] = url.count('=')
    
    # 15. url_length - Total URL length
    features['url_length'] = len(url)
    
    # 16. hostname_length - Hostname length
    features['hostname_length'] = len(parsed.netloc)
    
    # 17. fd_length - First directory length
    try:
        path_parts = path.split('/')
        features['fd_length'] = len(path_parts[1]) if len(path_parts) > 1 else 0
    except (IndexError, AttributeError):
        features['fd_length'] = 0
    
    # 18. tld_length - Top-level domain length
    features['tld_length'] = get_tld_length(url)
    
    # 19. count-digits - Number of digits
    features['count-digits'] = sum(1 for c in url if c.isdigit())
    
    # 20. count-letters - Number of letters
    features['count-letters'] = sum(1 for c in url if c.isalpha())
    
    return features


def features_to_dataframe(features: dict) -> pd.DataFrame:
    """
    Convert features dict to DataFrame with correct column order for ML models.
    """
    expected_order = [
        'use_of_ip', 'abnormal_url', 'count.', 'count-www', 'count@',
        'count_dir', 'count_embed_domian', 'short_url', 'count-https',
        'count-http', 'count%', 'count-', 'count=', 'url_length',
        'hostname_length', 'sus_url', 'fd_length', 'tld_length', 
        'count-digits', 'count-letters'
    ]
    df = pd.DataFrame([features])
    return df[expected_order]


def get_feature_descriptions() -> dict:
    """Return human-readable descriptions for each feature"""
    return {
        'use_of_ip': 'Uses IP address instead of domain',
        'abnormal_url': 'Abnormal URL structure',
        'count.': 'Number of dots',
        'count-www': 'WWW occurrences',
        'count@': '@ symbol count (suspicious)',
        'count_dir': 'Directory depth',
        'count_embed_domian': 'Embedded domain indicators',
        'short_url': 'URL shortener detected',
        'count-https': 'HTTPS occurrences',
        'count-http': 'HTTP occurrences',
        'count%': 'Percent encoding count',
        'count-': 'Hyphen count',
        'count=': 'Query parameter indicators',
        'url_length': 'Total URL length',
        'hostname_length': 'Hostname length',
        'sus_url': 'Suspicious keywords detected',
        'fd_length': 'First directory length',
        'tld_length': 'TLD length',
        'count-digits': 'Digit count',
        'count-letters': 'Letter count',
    }

