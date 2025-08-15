import os
import platform
import shutil
import subprocess
import sys
import time

def run(cmd, check=False, quiet=False):
    kwargs = dict(
        stdout=subprocess.DEVNULL if quiet else None,
        stderr=subprocess.STDOUT if quiet else None,
        text=True
    )
    print("•", " ".join(cmd))
    p = subprocess.run(cmd, **kwargs)
    if check and p.returncode != 0:
        raise RuntimeError(f"Command failed: {' '.join(cmd)} (code {p.returncode})")
    return p.returncode == 0

def which(exe: str) -> bool:
    return shutil.which(exe) is not None

def docker_cli_ok() -> bool:
    return which("docker")

def docker_daemon_ok(timeout=3) -> bool:
    try:
        return run(["docker", "info", "--format", "{{.ServerVersion}}"], quiet=True)
    except Exception:
        return False

def compose_ok() -> bool:
    if run(["docker", "compose", "version"], quiet=True):
        return True
    return run(["docker-compose", "--version"], quiet=True)  # legacy v1

def ensure_compose_linux():
    # First try plugin (Debian/Ubuntu naming)
    if which("apt"):
        run(["sudo", "apt-get", "update"], quiet=True)
        if run(["sudo", "apt-get", "install", "-y", "docker-compose-plugin"], quiet=True):
            return compose_ok()
    if which("curl"):
        if not which("docker-compose"):
            arch = platform.machine()
            # normalize arch names
            if arch == "x86_64":
                arch = "x86_64"
            elif arch in ("aarch64", "arm64"):
                arch = "aarch64"
            url = f"https://github.com/docker/compose/releases/download/v2.27.0/docker-compose-linux-{arch}"
            # Download and install
            run(["sudo", "curl", "-L", url, "-o", "/usr/local/bin/docker-compose"])
            run(["sudo", "chmod", "+x", "/usr/local/bin/docker-compose"])
    return compose_ok()

def ensure_docker_linux() -> bool:
    # Prefer official convenience script (covers most distros)
    if not which("curl"):
        # Try install curl quickly (Debian/Ubuntu)
        if which("apt"):
            run(["sudo", "apt-get", "update"])
            run(["sudo", "apt-get", "install", "-y", "curl", "ca-certificates", "gnupg"])
        elif which("dnf"):
            run(["sudo", "dnf", "install", "-y", "curl", "ca-certificates", "gnupg"])
        elif which("yum"):
            run(["sudo", "yum", "install", "-y", "curl", "ca-certificates", "gnupg"])

    if not which("curl"):
        print("✗ curl not available — cannot fetch Docker installer.")
        return False

    # Install using get.docker.com
    run(["curl", "-fsSL", "https://get.docker.com", "-o", "get-docker.sh"])
    if not run(["sudo", "sh", "get-docker.sh"]):
        return False

    # Enable & start service
    if which("systemctl"):
        run(["sudo", "systemctl", "enable", "docker"])
        run(["sudo", "systemctl", "start", "docker"])

    # Add current user to docker group (no sudo)
    user = os.environ.get("SUDO_USER") or os.environ.get("USER")
    if user:
        run(["sudo", "usermod", "-aG", "docker", user])
        print("ℹ You may need to re-login or run: newgrp docker")

    return True

def start_daemon_macos():
    # Try to start Docker Desktop app
    run(["open", "-a", "Docker"])
    # Wait up to ~90s for the daemon
    for _ in range(90):
        if docker_daemon_ok():
            return True
        time.sleep(1)
    return False

def ensure_docker_macos() -> bool:
    # Prefer Docker Desktop via Homebrew
    if which("brew"):
        ok = run(["brew", "install", "--cask", "docker"])
        if not ok:
            return False
        print("… Starting Docker Desktop")
        if start_daemon_macos():
            return True
        print("✗ Could not auto-start Docker Desktop. Please open it from Applications.")
        return docker_daemon_ok()
    else:
        print("✗ Homebrew not found. Install Docker Desktop from: https://www.docker.com/products/docker-desktop/")
        return False

def ensure_compose_macos():
    # Docker Desktop ships Compose v2 plugin
    # If still missing (CLI-only setups), try brew:
    if compose_ok():
        return True
    if which("brew"):
        run(["brew", "install", "docker-compose"])
    return compose_ok()

def main():
    sys_platform = sys.platform
    is_win = sys_platform.startswith("win")
    is_mac = sys_platform == "darwin"
    is_linux = sys_platform.startswith("linux")

    print("== Docker environment check ==")

    # 1) CLI
    if not docker_cli_ok():
        print("… Docker CLI not found.")
        if is_win:
            print("→ Please install Docker Desktop for Windows: https://www.docker.com/products/docker-desktop/")
            sys.exit(2)
        elif is_mac:
            print("→ Installing Docker Desktop (brew cask)…")
            if not ensure_docker_macos():
                sys.exit(2)
        elif is_linux:
            print("→ Installing Docker Engine (get.docker.com)…")
            if not ensure_docker_linux():
                sys.exit(2)
        else:
            print(f"Unsupported OS: {sys_platform}")
            sys.exit(2)
    else:
        print("✓ Docker CLI found")

    # 2) Daemon
    if not docker_daemon_ok():
        print("… Docker daemon not reachable. Trying to start it.")
        if is_win:
            print("→ Please start Docker Desktop and wait until it reports 'Docker is running'.")
            sys.exit(3)
        elif is_mac:
            if not start_daemon_macos():
                print("✗ Failed to start Docker Desktop automatically.")
                sys.exit(3)
        elif is_linux:
            started = False
            if which("systemctl"):
                started = run(["sudo", "systemctl", "start", "docker"])
            if not started:
                run(["sudo", "service", "docker", "start"])
            # small wait then re-check
            time.sleep(2)
            if not docker_daemon_ok():
                print("✗ Docker daemon still not reachable.")
                sys.exit(3)
    print("✓ Docker daemon is running")

    if not compose_ok():
        print("… Docker Compose not found. Installing.")
        ok = False
        if is_mac:
            ok = ensure_compose_macos()
        elif is_linux:
            ok = ensure_compose_linux()
        else:
            print("→ On Windows, Compose is included in Docker Desktop.")
            ok = False

        if not ok:
            print("✗ Failed to install Docker Compose.")
            sys.exit(4)
    print("✓ Docker Compose is available")

    print("✅ Ready")
    sys.exit(0)

if __name__ == "__main__":
    main()