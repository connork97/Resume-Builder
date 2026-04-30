import re

def format_label(s):
    if not s:
        return ""

    # camelCase Handling
    spaced = re.sub(r'(?<!^)(?=[A-Z])', ' ', s)

    # Underscores/Dashes Handling
    spaced = spaced.replace("_", " ").replace("-", " ")

    # Normalization of Extra Spaces
    spaced = re.sub(r'\s+', ' ', spaced).strip()

    return spaced[:1].upper() + spaced[1:]