#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
# build-openclaw-cli.sh — Build & install the OpenClaw CLI from a local checkout.
#
# Usage:
#   ./build-openclaw-cli.sh build     # Build a portable .tar.gz
#   ./build-openclaw-cli.sh install   # Install (or update) from the latest tarball
#   ./build-openclaw-cli.sh all       # Build then install in one step
#
# Configuration: edit the variables below.
# ============================================================================

# ── Configurable paths ──────────────────────────────────────────────────────

# Path to the OpenClaw git checkout (source repo).
REPO_DIR="$HOME/Documents/flow/clawdbot"

# Where the CLI tree is installed on this (or target) Mac.
INSTALL_PATH="$HOME/.openclaw-cli"

# Where the `openclaw` symlink is placed (must be in $PATH on the target Mac).
LINK_PATH="/usr/local/bin/openclaw"

# Directory where the tarball is written after build.
DIST_DIR="$HOME/scripts/dist"

# ── End of configuration ────────────────────────────────────────────────────

RED=$'\033[0;31m'
GREEN=$'\033[0;32m'
YELLOW=$'\033[0;33m'
CYAN=$'\033[0;36m'
BOLD=$'\033[1m'
RESET=$'\033[0m'

info()  { printf "${CYAN}▸${RESET} %s\n" "$*"; }
ok()    { printf "${GREEN}✔${RESET} %s\n" "$*"; }
warn()  { printf "${YELLOW}⚠${RESET} %s\n" "$*" >&2; }
fail()  { printf "${RED}✖${RESET} %s\n" "$*" >&2; exit 1; }

# ── Helpers ─────────────────────────────────────────────────────────────────

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || fail "Required command not found: $1"
}

read_pkg_field() {
  node -p "require('$1/package.json').$2" 2>/dev/null || echo "unknown"
}

# ── Build ───────────────────────────────────────────────────────────────────

do_build() {
  require_cmd node
  require_cmd pnpm

  [[ -d "$REPO_DIR" ]] || fail "Repo not found at $REPO_DIR"
  [[ -f "$REPO_DIR/package.json" ]] || fail "No package.json in $REPO_DIR"

  local version arch tarball staging
  version="$(read_pkg_field "$REPO_DIR" version)"
  arch="$(uname -m)"

  info "Building OpenClaw CLI v${version} (${arch}) from ${REPO_DIR}"

  # 1. Install deps
  info "Installing dependencies…"
  (cd "$REPO_DIR" && pnpm install --frozen-lockfile 2>/dev/null || pnpm install)

  # 2. Build TypeScript + hooks + plugin SDK
  info "Building TypeScript (pnpm build)…"
  (cd "$REPO_DIR" && pnpm build)

  # 3. Build control UI
  info "Building Control UI (ui:build)…"
  (cd "$REPO_DIR" && node scripts/ui.js build)

  # 4. Stage files into a clean temp directory
  staging="$(mktemp -d)"
  trap 'rm -rf "$staging"' EXIT

  info "Staging files…"

  # Core files
  cp "$REPO_DIR/openclaw.mjs"  "$staging/"
  cp "$REPO_DIR/package.json"  "$staging/"
  [[ -f "$REPO_DIR/package-lock.json" ]] && cp "$REPO_DIR/package-lock.json" "$staging/" || true

  # Built output
  cp -R "$REPO_DIR/dist" "$staging/dist"

  # Runtime resource directories
  for dir in assets docs extensions skills; do
    if [[ -d "$REPO_DIR/$dir" ]]; then
      cp -R "$REPO_DIR/$dir" "$staging/$dir"
    fi
  done

  # 5. Install production-only deps (native modules compile for current arch)
  info "Installing production dependencies (this may take a moment)…"
  (cd "$staging" && npm install --omit=dev --ignore-scripts=false 2>&1 | tail -5)

  # 6. Create tarball
  mkdir -p "$DIST_DIR"
  tarball="$DIST_DIR/openclaw-cli-${version}-${arch}.tar.gz"
  info "Creating tarball at ${tarball}…"
  tar czf "$tarball" -C "$staging" .

  ok "Build complete: ${tarball}"
  printf "   Size: %s\n" "$(du -sh "$tarball" | cut -f1)"
  printf "   Version: %s\n" "$version"
  printf "   Arch: %s\n" "$arch"
  echo ""
  info "To install on this Mac:  $0 install"
  info "To install on another Mac: copy the tarball + this script, then run: $0 install <path-to-tarball>"
}

# ── Install / Update ───────────────────────────────────────────────────────

do_install() {
  require_cmd node

  local tarball="${1:-}"

  # Auto-detect latest tarball if none specified
  if [[ -z "$tarball" ]]; then
    if [[ ! -d "$DIST_DIR" ]]; then
      fail "No dist directory at $DIST_DIR. Run '$0 build' first."
    fi
    tarball="$(ls -t "$DIST_DIR"/openclaw-cli-*.tar.gz 2>/dev/null | head -1)"
    if [[ -z "$tarball" ]]; then
      fail "No tarball found in $DIST_DIR. Run '$0 build' first."
    fi
    info "Auto-selected tarball: $(basename "$tarball")"
  fi

  [[ -f "$tarball" ]] || fail "Tarball not found: $tarball"

  # Show what's about to happen
  info "Installing OpenClaw CLI"
  printf "   Tarball:  %s\n" "$tarball"
  printf "   Install:  %s\n" "$INSTALL_PATH"
  printf "   Symlink:  %s\n" "$LINK_PATH"

  # If previous install exists, back it up (keep one backup)
  if [[ -d "$INSTALL_PATH" ]]; then
    warn "Existing installation found — updating in place"
    local backup="${INSTALL_PATH}.bak"
    rm -rf "$backup"
    cp -R "$INSTALL_PATH" "$backup"
    info "Backup saved to ${backup}"
  fi

  # Extract tarball
  mkdir -p "$INSTALL_PATH"
  info "Extracting…"
  tar xzf "$tarball" -C "$INSTALL_PATH"

  # Make entry point executable
  chmod +x "$INSTALL_PATH/openclaw.mjs"

  # Create/update symlink
  local link_dir
  link_dir="$(dirname "$LINK_PATH")"
  if [[ ! -d "$link_dir" ]]; then
    info "Creating ${link_dir} (may require sudo)…"
    sudo mkdir -p "$link_dir"
  fi

  if [[ -w "$link_dir" ]]; then
    ln -sf "$INSTALL_PATH/openclaw.mjs" "$LINK_PATH"
  else
    info "Symlinking requires sudo…"
    sudo ln -sf "$INSTALL_PATH/openclaw.mjs" "$LINK_PATH"
  fi

  # Verify
  echo ""
  if command -v openclaw >/dev/null 2>&1; then
    local installed_version
    installed_version="$(openclaw --version 2>/dev/null || echo "unknown")"
    ok "OpenClaw CLI installed successfully"
    printf "   Version: %s\n" "$installed_version"
    printf "   Binary:  %s\n" "$LINK_PATH"
  else
    ok "Files installed to ${INSTALL_PATH}"
    warn "The 'openclaw' command is not in PATH. Ensure ${link_dir} is in your \$PATH."
    printf "   Add to ~/.zshrc:  export PATH=\"%s:\$PATH\"\n" "$link_dir"
  fi
}

# ── Uninstall ──────────────────────────────────────────────────────────────

do_uninstall() {
  info "Uninstalling OpenClaw CLI"

  if [[ -L "$LINK_PATH" ]]; then
    info "Removing symlink ${LINK_PATH}"
    if [[ -w "$(dirname "$LINK_PATH")" ]]; then
      rm -f "$LINK_PATH"
    else
      sudo rm -f "$LINK_PATH"
    fi
  fi

  if [[ -d "$INSTALL_PATH" ]]; then
    info "Removing ${INSTALL_PATH}"
    rm -rf "$INSTALL_PATH"
  fi

  if [[ -d "${INSTALL_PATH}.bak" ]]; then
    info "Removing backup ${INSTALL_PATH}.bak"
    rm -rf "${INSTALL_PATH}.bak"
  fi

  ok "Uninstalled"
}

# ── Main ───────────────────────────────────────────────────────────────────

usage() {
  printf "%sbuild-openclaw-cli.sh%s — Build & install the OpenClaw CLI from source.\n" "$BOLD" "$RESET"
  echo ""
  printf "%sUsage:%s\n" "$BOLD" "$RESET"
  echo "  $0 build               Build a portable .tar.gz from the local repo"
  echo "  $0 install [tarball]    Install/update from tarball (auto-picks latest if omitted)"
  echo "  $0 all                  Build + install in one step"
  echo "  $0 uninstall            Remove the installed CLI"
  echo "  $0 help                 Show this help"
  echo ""
  printf "%sConfiguration (edit the script):%s\n" "$BOLD" "$RESET"
  echo "  REPO_DIR      = $REPO_DIR"
  echo "  INSTALL_PATH  = $INSTALL_PATH"
  echo "  LINK_PATH     = $LINK_PATH"
  echo "  DIST_DIR      = $DIST_DIR"
}

case "${1:-help}" in
  build)
    do_build
    ;;
  install)
    do_install "${2:-}"
    ;;
  all)
    do_build
    do_install
    ;;
  uninstall)
    do_uninstall
    ;;
  help|--help|-h)
    usage
    ;;
  *)
    warn "Unknown command: $1"
    usage
    exit 1
    ;;
esac
