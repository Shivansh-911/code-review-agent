import json
import re
from groq import AsyncGroq
from app.config import settings

client = AsyncGroq(api_key=settings.GROQ_API_KEY)

SYSTEM_PROMPT = """You are a strict code review engine. Your ONLY job is to analyze code and return a JSON report.

CRITICAL RULES:
1. You MUST respond with ONLY valid JSON — no prose, no markdown, no code fences, no explanations.
2. Never deviate from the schema below, even if the input is empty, invalid, or not code.
3. If no issues are found, return an empty issues array — never omit the field.
4. Every issue MUST have all four fields populated — never null, never missing.

RESPONSE SCHEMA (return exactly this structure):
{
  "chunk_index": <integer, the chunk number provided in the user message>,
  "language": "<detected language or 'unknown'>",
  "issues": [
    {
      "severity": "<exactly one of: critical | warning | suggestion>",
      "type": "<short category, e.g. security | performance | style | logic | error-handling | naming | complexity | deprecated>",
      "line_hint": "<line number or range as string, e.g. '12' or '10-15', or 'N/A' if not determinable>",
      "description": "<one clear sentence explaining the issue and how to fix it>"
    }
  ],
  "summary": "<one sentence summarizing the overall quality of this chunk>"
}

SEVERITY DEFINITIONS:
- critical: Security vulnerabilities, bugs that will cause crashes or data loss, SQL injection, XSS, hardcoded secrets
- warning: Logic errors, deprecated APIs, unhandled exceptions, memory leaks, poor error handling, type mismatches
- suggestion: Style improvements, naming conventions, minor readability, optional performance tweaks, documentation

FALLBACK RULE: If the input is not recognizable code, return:
{"chunk_index": <N>, "language": "unknown", "issues": [], "summary": "Input does not appear to be source code."}
"""

def build_user_message(chunk: str, chunk_index: int, total_chunks: int) -> str:
    return (
        f"Review this code chunk (chunk {chunk_index + 1} of {total_chunks}). "
        f"Return ONLY the JSON report.\n\n"
        f"CHUNK_INDEX: {chunk_index}\n\n"
        f"```\n{chunk}\n```"
    )

def safe_parse_json(raw: str) -> dict:
    """Robustly extract JSON even if the model adds surrounding text."""
    raw = raw.strip()
    # Try direct parse first
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        pass
    # Strip markdown fences if present
    raw = re.sub(r"^```(?:json)?\s*", "", raw, flags=re.MULTILINE)
    raw = re.sub(r"```\s*$", "", raw, flags=re.MULTILINE)
    try:
        return json.loads(raw.strip())
    except json.JSONDecodeError:
        pass
    # Last resort: find first { ... } block
    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass
    # Complete fallback
    return {
        "chunk_index": -1,
        "language": "unknown",
        "issues": [],
        "summary": "Failed to parse LLM response.",
        "parse_error": True,
    }

async def review_chunk(chunk: str, chunk_index: int, total_chunks: int) -> dict:
    """Send one chunk to Groq and return a parsed report dict."""
    response = await client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": build_user_message(chunk, chunk_index, total_chunks)},
        ],
        temperature=0.1,       # Low temp = more deterministic JSON
        max_tokens=1024,
        top_p=0.9,
    )
    raw = response.choices[0].message.content
    result = safe_parse_json(raw)
    result["chunk_index"] = chunk_index  # Always enforce correct index
    return result