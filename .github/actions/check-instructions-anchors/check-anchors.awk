# Maintain in repo: cs-template
# Reports named anchors that nothing links to, and #fragment links whose target
# heading or anchor does not exist. Only files under ai/ and .ai-instructions are
# reported on; every file passed in is scanned for headings, anchors and links.

function slug(heading,   s) {
  s = tolower(heading)
  gsub(/<[^>]*>/, "", s)
  gsub(/[^a-z0-9_ -]/, "", s)
  gsub(/ /, "-", s)
  return s
}

function normalise(path,   count, parts, i, depth, stack, out) {
  count = split(path, parts, "/")
  depth = 0
  for (i = 1; i <= count; i++) {
    if (parts[i] == "" || parts[i] == ".") {
      continue
    }
    if (parts[i] == "..") {
      if (depth > 0) {
        depth--
      }
      continue
    }
    stack[++depth] = parts[i]
  }
  out = ""
  for (i = 1; i <= depth; i++) {
    out = out (i > 1 ? "/" : "") stack[i]
  }
  return out
}

function directory_of(path,   count, parts, i, out) {
  count = split(path, parts, "/")
  out = ""
  for (i = 1; i < count; i++) {
    out = out parts[i] "/"
  }
  return out
}

function is_checked(path) {
  return path ~ /^ai\// || path == ".ai-instructions"
}

FNR == 1 {
  in_fence = 0
  split("", seen_slugs)
  known_files[FILENAME] = 1
}

/^[[:space:]]*(```|~~~)/ {
  in_fence = !in_fence
  next
}

in_fence {
  next
}

/^#+[[:space:]]/ {
  heading = $0
  sub(/^#+[[:space:]]+/, "", heading)
  heading_slug = slug(heading)
  if (heading_slug in seen_slugs) {
    suffix = seen_slugs[heading_slug]
    seen_slugs[heading_slug] = suffix + 1
    heading_slug = heading_slug "-" suffix
  } else {
    seen_slugs[heading_slug] = 1
  }
  anchors[FILENAME SUBSEP heading_slug] = 1
}

{
  line = $0
  gsub(/`[^`]*`/, "", line)

  rest = line
  while (match(rest, /<a id="[^"]*"/)) {
    anchor_id = substr(rest, RSTART + 7, RLENGTH - 8)
    anchors[FILENAME SUBSEP anchor_id] = 1
    explicit_anchors[FILENAME SUBSEP anchor_id] = FNR
    rest = substr(rest, RSTART + RLENGTH)
  }

  rest = line
  while (match(rest, /\]\([^) ]*#[^) ]+\)/)) {
    link = substr(rest, RSTART + 2, RLENGTH - 3)
    rest = substr(rest, RSTART + RLENGTH)
    hash = index(link, "#")
    target = substr(link, 1, hash - 1)
    if (target ~ /^[a-zA-Z][a-zA-Z0-9+.-]*:/) {
      continue
    }
    reference_count++
    reference_file[reference_count] = FILENAME
    reference_line[reference_count] = FNR
    reference_fragment[reference_count] = substr(link, hash + 1)
    reference_target[reference_count] = (target == "") ? FILENAME : normalise(directory_of(FILENAME) target)
  }
}

END {
  failed = 0
  for (i = 1; i <= reference_count; i++) {
    key = reference_target[i] SUBSEP reference_fragment[i]
    referenced[key] = 1
    if (!is_checked(reference_file[i]) || (key in anchors)) {
      continue
    }
    reason = (reference_target[i] in known_files) ? "no heading or anchor with that name" : "target file not found"
    printf "::error file=%s,line=%d::Dangling link to %s#%s (%s)\n", reference_file[i], reference_line[i], reference_target[i], reference_fragment[i], reason
    failed = 1
  }

  for (key in explicit_anchors) {
    if (key in referenced) {
      continue
    }
    split(key, parts, SUBSEP)
    if (!is_checked(parts[1])) {
      continue
    }
    printf "::error file=%s,line=%d::Orphaned anchor #%s has no incoming links\n", parts[1], explicit_anchors[key], parts[2]
    failed = 1
  }

  exit failed
}
