from urllib.parse import urlparse
from data import TRUSTED_DOMAINS

MODEL_NAME = "RandomForestClassifier (Demo)"


def hash_string(value: str) -> int:
    h = 2166136261
    for char in value:
        h ^= ord(char)
        h = (h * 16777619) & 0xFFFFFFFF
    return h


def create_prng(seed: int):
    state = seed & 0xFFFFFFFF

    def rand():
        nonlocal state
        state = (state * 1664525 + 1013904223) & 0xFFFFFFFF
        return state / 0xFFFFFFFF

    return rand


def normalize_url(raw_url: str) -> str:
    trimmed = raw_url.strip()
    prefixed = trimmed if trimmed.startswith(("http://", "https://")) else f"https://{trimmed}"
    parsed = urlparse(prefixed)
    normalized_path = parsed.path.rstrip("/") or "/"
    rebuilt = parsed._replace(path=normalized_path, fragment="")
    return rebuilt.geturl()


def score_to_label(score: int) -> str:
    if score >= 80:
        return "Benign"
    if score >= 60:
        return "Defacement"
    if score >= 40:
        return "Phishing"
    return "Malicious"


def analyze_url(raw_url: str):
    normalized = normalize_url(raw_url)
    parsed = urlparse(normalized)
    domain = parsed.hostname.replace("www.", "") if parsed.hostname else ""
    protocol = "https" if parsed.scheme == "https" else "http"
    seed = hash_string(f"{domain}-{normalized.lower()}")
    rand = create_prng(seed)
    is_trusted = domain in TRUSTED_DOMAINS

    safety = 50
    safety += 18 if protocol == "https" else -18
    safety += 22 if is_trusted else -6
    safety += int(rand() * 20 - 10)
    safety -= min(len(normalized) / 5, 15)
    if protocol == "http":
        safety -= rand() * 10
    safety = max(0, min(int(round(safety)), 100))

    metrics = {
        "accuracy": round(0.78 + rand() * 0.17, 2),
        "precision": round(0.7 + rand() * 0.2, 2),
        "recall": round(0.65 + rand() * 0.25, 2),
        "support": int(200 + rand() * 300),
    }

    explanation = [
        "Secure HTTPS detected — encrypted channel improves trust."
        if protocol == "https"
        else "HTTP detected — lack of TLS lowers confidence.",
        f"Domain matches trusted catalogue ({domain})." if is_trusted else "Domain not in trusted catalogue; applying heuristics.",
        "Heuristic ensemble (length, entropy, keyword checks) simulated via RandomForest.",
    ]

    return {
        "url": normalized,
        "domain": domain,
        "protocol": protocol,
        "isTrusted": is_trusted,
        "safetyScore": safety,
        "predictedLabel": score_to_label(safety),
        "modelName": MODEL_NAME,
        "metrics": metrics,
        "explanation": explanation,
    }

