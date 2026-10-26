#!/usr/bin/env python3
"""Build who.zip for Hostinger upload with correct Unix permissions.

PowerShell's Compress-Archive writes no Unix mode bits, so some Linux
extractors create directories as chmod 000 -> EACCES during `next build`.
Directory entries must end in "/" and create_system must be Unix (3),
otherwise strict extractors treat them as files and fail.
"""
import os
import time
import zipfile

INCLUDE_DIRS = ["src", "prisma", "public", "scripts"]
INCLUDE_FILES = [
    "package.json",
    "package-lock.json",
    "next.config.mjs",
    "postcss.config.mjs",
    "tsconfig.json",
    "next-env.d.ts",
    "eslint.config.mjs",
    ".env.example",
    ".gitignore",
    "AGENTS.md",
    "README.md",
    "docker-compose.yml",
]
OUT = "who.zip"


def add(zf: zipfile.ZipFile, path: str, arc: str) -> None:
    arc = arc.replace(os.sep, "/")
    mtime = time.localtime(os.path.getmtime(path))[:6]
    if os.path.isdir(path):
        zi = zipfile.ZipInfo(arc + "/", mtime)
        zi.create_system = 3
        zi.external_attr = (0o40755 << 16) | 0x10
        zf.writestr(zi, "")
    else:
        zi = zipfile.ZipInfo(arc, mtime)
        zi.create_system = 3
        zi.external_attr = 0o100644 << 16
        zi.compress_type = zipfile.ZIP_DEFLATED
        with open(path, "rb") as f:
            zf.writestr(zi, f.read())


with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as zf:
    for f in INCLUDE_FILES:
        if os.path.exists(f):
            add(zf, f, f)
    for d in INCLUDE_DIRS:
        for root, _dirs, files in os.walk(d):
            add(zf, root, root)
            for name in files:
                p = os.path.join(root, name)
                add(zf, p, p)

print(f"wrote {OUT}")
