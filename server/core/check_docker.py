import argparse
import json
import shutil
import subprocess
import sys

def run(cmd, timeout=5):
    try:
        p = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
        return p.returncode == 0, (p.stdout or p.stderr).strip()
    except Exception as e:
        return False, str(e)

def detect_compose(timeout=5):
    ok, out = run(["docker", "compose", "version"], timeout=timeout)
    if ok:
        return "plugin", out
    ok2, out2 = run(["docker-compose", "--version"], timeout=timeout)
    if ok2:
        return "standalone", out2
    return None, (out or out2)

def main():
    ap = argparse.ArgumentParser(description="Docker environment checker")
    ap.add_argument("--require-compose", action="store_true",
                    help="Fail if Docker Compose is not available")
    ap.add_argument("--json", action="store_true",
                    help="Print JSON result (no human-readable text)")
    ap.add_argument("--timeout", type=int, default=5, help="Per-command timeout (s)")
    args = ap.parse_args()

    # 1) Docker CLI
    docker_path = shutil.which("docker")
    if not docker_path:
        if args.json:
            print(json.dumps({"ok": False, "docker_cli": False, "reason": "docker CLI not found"}))
        else:
            print("✗ Docker CLI not found")
        sys.exit(2)

    ok_ver, ver_out = run(["docker", "--version"], timeout=args.timeout)
    docker_version = ver_out if ok_ver else None

    # 2) Daemon (server) reachable
    ok_info, server_out = run(["docker", "info", "--format", "{{.ServerVersion}}"], timeout=args.timeout)
    daemon_ok = ok_info
    server_version = server_out if ok_info and server_out else None

    # 3) Compose
    compose_kind, compose_out = detect_compose(timeout=args.timeout)
    compose_ok = compose_kind is not None

    result = {
        "ok": bool(docker_path) and daemon_ok and (compose_ok or not args.require_compose),
        "docker_cli": True,
        "docker_version": docker_version,
        "daemon_ok": daemon_ok,
        "server_version": server_version,
        "compose_ok": compose_ok,
        "compose_kind": compose_kind,
    }

    if args.json:
        print(json.dumps(result))
    else:
        print(f"✓ Docker CLI: {docker_path}" + (f"  ({docker_version})" if docker_version else ""))
        print(("✓ Docker daemon reachable" + (f"  (Server {server_version})" if server_version else ""))
              if daemon_ok else "✗ Docker daemon not reachable")
        if compose_ok:
            print(f"✓ Docker Compose: {compose_kind}  ({compose_out})")
        else:
            print("✗ Docker Compose not found")

    # exit codes
    if not daemon_ok:
        sys.exit(3)
    if args.require_compose and not compose_ok:
        sys.exit(4)
    sys.exit(0)

if __name__ == "__main__":
    main()