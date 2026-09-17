def extract_slate_text(slate_nodes):
    if slate_nodes is None:
        return ""

    if isinstance(slate_nodes, dict):
        slate_nodes = [slate_nodes]

    slate_text_list = []
    for node in slate_nodes:
        if not isinstance(node, dict):
            continue

        if "text" in node:
            slate_text_list.append(node.get("text") or "")
        elif "children" in node:
            slate_text_list.append(extract_slate_text(node["children"]))

    return "".join(slate_text_list)


def extract_slate_text_with_breaks(block_nodes):
    # * Extract text from top-level/block Slate Nodes
    # * For each node in node list, extract its text content, and join with a space
    # * For Child Nodes, recursively extract their text content via extract_slate_text
    # * Return the joined text as a single string
    if block_nodes is None:
        return ""

    if isinstance(block_nodes, dict):
        block_nodes = [block_nodes]

    slate_text_lines_list = []
    for node in block_nodes:
        if isinstance(node, dict) and "children" in node:
            slate_text_lines_list.append(extract_slate_text(node["children"]))
        elif isinstance(node, dict) and "text" in node:
            slate_text_lines_list.append(node.get("text") or "")

    return " ".join(line for line in slate_text_lines_list if line)


def build_resume_plain_text(resume):
    # * Take Resume Title, Section/Subsection/Field Labels, and Slate Content from Section and Field Values
    # * Append each piece of text data to resume_text_list
    # * Join all items in resume_text_list into one plain text string blob, separated by spaces for searchability
    resume_text_list = [resume.title or ""]

    for column in resume.columns:
        for section in column.sections:
            if section.label:
                resume_text_list.append(section.label)
            resume_text_list.append(extract_slate_text_with_breaks(section.value))

            for subsection in section.subsections:
                if subsection.label:
                    resume_text_list.append(subsection.label)

                for field in subsection.fields:
                    if field.label:
                        resume_text_list.append(field.label)
                    resume_text_list.append(extract_slate_text_with_breaks(field.value))

    plain_text = " ".join(p for p in resume_text_list if p)
    return " ".join(plain_text.split())
