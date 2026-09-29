# Maintain in repo: cs-template
# Reports list items that start with a literal ordered-list marker (1. text) outside
# fenced code blocks, because CommonMark detaches nested content from such items.

FNR == 1 {
  in_fence = 0
}

/^[[:space:]]*(```|~~~)/ {
  in_fence = !in_fence
  next
}

!in_fence && /^[[:space:]]*[0-9]+\.[[:space:]]/ {
  printf "::error file=%s,line=%d::Numbered list marker; use a '- **P1.**' style bullet label instead\n", FILENAME, FNR
  failed = 1
}

END {
  exit failed
}
