"""
Splits code into chunks for LLM review.
Strategy: split on blank lines between logical blocks,
keeping chunks under MAX_LINES. Falls back to hard split.
"""

MAX_LINES = 60
MIN_LINES = 10

def chunk_code(code: str) -> list[str]:
    lines = code.splitlines()
    if len(lines) <= MAX_LINES:
        return [code]

    chunks = []
    current: list[str] = []

    for i, line in enumerate(lines):
        current.append(line)
        is_blank = line.strip() == ""
        at_boundary = is_blank and len(current) >= MIN_LINES

        if at_boundary or len(current) >= MAX_LINES:
            chunk_text = "\n".join(current).strip()
            if chunk_text:
                chunks.append(chunk_text)
            current = []

    # Flush remainder
    if current:
        remainder = "\n".join(current).strip()
        if remainder:
            # Merge tiny remainders into last chunk
            if chunks and len(current) < MIN_LINES:
                chunks[-1] += "\n" + remainder
            else:
                chunks.append(remainder)

    return chunks if chunks else [code]