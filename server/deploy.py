import argparse
import os
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PY = sys.executable or "python3"

DEFAULT_PATTERNS = [
    r"\bdeploy(ing|ed)?\b",
    r"\bbuild(ing|ed)?\b",
    r"\bmakemigrations\b",
    r"\bmigrate\b",
    r"\bcollectstatic\b",
    r"\bsuperuser\b",
    r"\bstarting\b|\bstarted\b|\bready\b|\bhealthy\b",
    r"\bsuccess\b|\bdone\b|\bcomplete(d)?\b",
]

HELP_TEXT = r"""
Deploy helper — commands & options

USAGE
  python deploy.py [OPTIONS]                # full deploy (preflight → build → DB → migrate → superuser → collectstatic → up)
  python deploy.py help                     # show this help
  python deploy.py build                    # just build images
  python deploy.py up                       # start containers (detached)
  python deploy.py down [-v|--volumes]      # stop containers (optionally remove volumes)

PREFLIGHT (Docker)
  --skip-ensure     Skip core/ensure_docker.py (auto-install/start Docker)
  --skip-check      Skip core/check_docker.py --require-compose

DEPLOY OPTIONS
  -f, --file PATH   Compose file (default: docker-compose.yml)
  -p, --project STR Compose project name
  --service STR     Django service name (default: web)
  --no-cache        Build without cache
  --pull            Try to pull newer base images
  --check-migrations    Dry-run: fail if model changes require migrations
  --make-migrations     Run makemigrations before migrate (writes migration files)
  --skip-migrate    Skip manage.py migrate
  --skip-superuser  Skip ensure superuser step (env-based)
  --skip-collectstatic  Skip manage.py collectstatic
  --skip-db         Skip starting/waiting for the 'db' service

LOGGING
  --verbose         Show full logs (disable quiet mode)
  --patterns REGEX [REGEX ...]
                    In quiet mode, only lines matching these regexes are printed.

ENV VARS (examples)
  DJANGO_SUPERUSER_USERNAME=admin
  DJANGO_SUPERUSER_EMAIL=admin@example.com
  DJANGO_SUPERUSER_PASSWORD=change-me
"""

def print_help_and_exit():
    print(HELP_TEXT.strip())
    raise SystemExit(0)

def compose_cmd() -> list[str]:
    if shutil.which("docker") and subprocess.run(
        ["docker", "compose", "version"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    ).returncode == 0:
        return ["docker", "compose"]
    if shutil.which("docker-compose"):
        return ["docker-compose"]
    print("❌ Neither `docker compose` nor `docker-compose` found.", file=sys.stderr)
    sys.exit(1)

def run(cmd: list[str], *, verbose: bool, patterns=None, env=None, cwd=None, show_cmd=False) -> int:
    patterns = patterns or []
    regexes = [re.compile(p, re.IGNORECASE) for p in patterns]

    if verbose:
        print("➜", " ".join(cmd))
        return subprocess.call(cmd, cwd=cwd or ROOT, env=env or os.environ.copy())

    if show_cmd:
        print("•", " ".join(cmd))

    proc = subprocess.Popen(
        cmd, cwd=cwd or ROOT, env=env or os.environ.copy(),
        stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1
    )
    captured = []
    while True:
        line = proc.stdout.readline()
        if not line and proc.poll() is not None:
            break
        if not line:
            continue
        captured.append(line)
        if regexes and any(r.search(line) for r in regexes):
            print(line, end="")
    proc.wait()
    if proc.returncode != 0:
        print(f"\n❌ Command failed ({proc.returncode}): {' '.join(cmd)}", file=sys.stderr)
        tail = "".join(captured[-40:])
        if tail:
            print("─ Last output (tail) ─", file=sys.stderr)
            print(tail, file=sys.stderr, end="")
    return proc.returncode

def preflight_ensure_docker(*, verbose: bool) -> int:
    script = ROOT / "core" / "ensure_docker.py"
    if not script.exists():
        return 0
    return run([PY, str(script)], verbose=verbose, patterns=["docker", "compose", "ready"], show_cmd=verbose)

def preflight_check_docker(*, verbose: bool) -> int:
    script = ROOT / "core" / "check_docker.py"
    if not script.exists():
        print("⚠ core/check_docker.py not found, skipping check.")
        return 0
    return run([PY, str(script), "--require-compose"], verbose=verbose,
               patterns=["Docker", "daemon", "Compose", "OK", "Ready", "✓", "✗"],
               show_cmd=verbose)

def build(no_cache=False, pull=False, file=None, project=None, *, verbose=False, patterns=None):
    cmd = compose_cmd()
    if file:    cmd += ["-f", file]
    if project: cmd += ["-p", project]
    cmd += ["build"]
    if no_cache: cmd += ["--no-cache"]
    if pull:     cmd += ["--pull"]
    return run(cmd, verbose=verbose, patterns=patterns)

def up(detach=True, file=None, project=None, *, verbose=False, patterns=None):
    cmd = compose_cmd()
    if file:    cmd += ["-f", file]
    if project: cmd += ["-p", project]
    cmd += ["up"]
    if detach:  cmd += ["-d"]
    return run(cmd, verbose=verbose, patterns=patterns)

def down(remove_volumes=False, file=None, project=None, *, verbose=False, patterns=None):
    cmd = compose_cmd()
    if file:    cmd += ["-f", file]
    if project: cmd += ["-p", project]
    cmd += ["down"]
    if remove_volumes: cmd += ["-v"]
    return run(cmd, verbose=verbose, patterns=patterns)

def exec_manage(args: list[str], service="web", file=None, project=None, *, verbose=False, patterns=None):
    cmd = compose_cmd()
    if file:    cmd += ["-f", file]
    if project: cmd += ["-p", project]
    cmd += ["run", "--rm", service, "python", "manage.py"] + args
    return run(cmd, verbose=verbose, patterns=patterns)

def exec_python(code: str, service="web", file=None, project=None, *, verbose=False, patterns=None):
    code = "import os; os.environ.setdefault('DJANGO_SETTINGS_MODULE','config.settings');\n" + code
    heredoc = f"python - <<'PY'\n{code}\nPY"
    cmd = compose_cmd()
    if file:    cmd += ["-f", file]
    if project: cmd += ["-p", project]
    cmd += ["run", "--rm", service, "sh", "-lc", heredoc]
    return run(cmd, verbose=verbose, patterns=patterns)

def compose_services(file=None, project=None) -> list[str]:
    cmd = compose_cmd()
    if file:    cmd += ["-f", file]
    if project: cmd += ["-p", project]
    cmd += ["config", "--services"]
    proc = subprocess.run(cmd, cwd=ROOT, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    if proc.returncode != 0:
        return []
    return [s.strip() for s in proc.stdout.splitlines() if s.strip()]

def up_service(name: str, file=None, project=None, *, verbose=False, patterns=None) -> int:
    cmd = compose_cmd()
    if file:    cmd += ["-f", file]
    if project: cmd += ["-p", project]
    cmd += ["up", "-d", name]
    return run(cmd, verbose=verbose, patterns=patterns)

def wait_for_postgres(file=None, project=None, *, verbose=False, timeout=90) -> bool:
    """Wait until `db` is healthy by running pg_isready inside it."""
    start = time.time()
    while time.time() - start < timeout:
        cmd = compose_cmd()
        if file:    cmd += ["-f", file]
        if project: cmd += ["-p", project]
        cmd += ["exec", "db", "sh", "-lc",
                'PGUSER="${POSTGRES_USER:-postgres}" PGDATABASE="${POSTGRES_DB:-postgres}" pg_isready -U "$PGUSER" -d "$PGDATABASE"']
        rc = subprocess.call(cmd, cwd=ROOT,
                             stdout=(None if verbose else subprocess.DEVNULL),
                             stderr=(None if verbose else subprocess.STDOUT))
        if rc == 0:
            print("DB: ready")
            return True
        time.sleep(2)
    print("DB: wait timed out")
    return False

def ensure_db_ready(file=None, project=None, *, verbose=False, patterns=None, skip=False):
    if skip:
        return True
    services = compose_services(file=file, project=project)
    if "db" not in services:
        return True
    print("• Starting database…")
    if up_service("db", file=file, project=project, verbose=verbose, patterns=patterns) != 0:
        return False
    print("• Waiting for database to be ready…")
    return wait_for_postgres(file=file, project=project, verbose=verbose)

def make_migrations(service="web", file=None, project=None, *, verbose=False, patterns=None, check=False):
    args = ["makemigrations"]
    if check:
        args += ["--check", "--dry-run"]
    return exec_manage(args, service=service, file=file, project=project,
                       verbose=verbose, patterns=patterns)

def ensure_superuser(service="web", file=None, project=None, *, verbose=False, patterns=None):
    code = r"""
import os, django, sys, traceback
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()

u = os.environ.get("DJANGO_SUPERUSER_USERNAME", "").strip()
p = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "").strip()
e = os.environ.get("DJANGO_SUPERUSER_EMAIL", "").strip()

def log(msg): print(f"superuser: {msg}")

if not u or not p:
    log("skip (missing env: DJANGO_SUPERUSER_USERNAME or DJANGO_SUPERUSER_PASSWORD)")
    sys.exit(0)

try:
    obj = None
    # Try by email first (if provided), then username
    if e:
        obj = User.objects.filter(email=e).first()
    if not obj:
        obj = User.objects.filter(username=u).first()

    if obj is None:
        obj = User(username=u, email=e or "")
        obj.is_staff = True
        obj.is_superuser = True
        obj.set_password(p)
        obj.save()
        log(f"created username={u} email={e or '-'}")
    else:
        changed = False
        if e and obj.email != e:
            obj.email = e; changed = True
        if not obj.is_staff: obj.is_staff = True; changed = True
        if not obj.is_superuser: obj.is_superuser = True; changed = True
        obj.set_password(p); changed = True
        obj.save()
        log(f"updated username={obj.username} email={obj.email or '-'} (changed={changed})")

    # print final list for visibility
    cnt = User.objects.filter(is_superuser=True).count()
    log(f"total superusers={cnt}")

except Exception as ex:
    log("error: " + str(ex))
    traceback.print_exc()
    sys.exit(1)
"""
    return exec_python(code, service=service, file=file, project=project,
                       verbose=verbose, patterns=patterns)


def parse_args():
    p = argparse.ArgumentParser(description="Deploy with preflight (ensure+check docker) and quiet logs")
    p.add_argument("--file", "-f", default="docker-compose.yml", help="Compose file path")
    p.add_argument("--project", "-p", default=None, help="Compose project name")
    p.add_argument("--service", default="web", help="Django service name (default: web)")

    p.add_argument("--skip-ensure", action="store_true", help="Skip core/ensure_docker.py")
    p.add_argument("--skip-check", action="store_true", help="Skip core/check_docker.py --require-compose")

    # deploy flags
    p.add_argument("--no-cache", action="store_true", help="Build without cache")
    p.add_argument("--pull", action="store_true", help="Attempt to pull newer base images")
    p.add_argument("--skip-collectstatic", action="store_true", help="Skip collectstatic")
    p.add_argument("--check-migrations", action="store_true",
                   help="Dry-run: fail if model changes require migrations")
    p.add_argument("--make-migrations", action="store_true",
                   help="Run makemigrations before migrate (writes migration files)")
    p.add_argument("--skip-migrate", action="store_true", help="Skip migrate")
    p.add_argument("--skip-superuser", action="store_true", help="Skip ensure superuser")
    p.add_argument("--skip-db", action="store_true", help="Skip starting/waiting for the 'db' service")

    # logging
    p.add_argument("--verbose", action="store_true", help="Show full logs (disable quiet mode)")
    p.add_argument("--patterns", nargs="*", default=None, help="Custom regex patterns in quiet mode")

    # subcommands
    sub = p.add_subparsers(dest="action")
    sub.add_parser("build")
    sub.add_parser("up")
    dp = sub.add_parser("down"); dp.add_argument("-v", "--volumes", action="store_true")
    sub.add_parser("help")

    return p.parse_args()

def step(msg: str):
    print(f"• {msg}")

def main():
    args = parse_args()
    compose_file, project, service = args.file, args.project, args.service
    verbose = args.verbose
    patterns = (args.patterns if args.patterns is not None else DEFAULT_PATTERNS)
    action = args.action or "deploy"

    if action == "help":
        print_help_and_exit()

    if action == "build":
        step("Build started…")
        sys.exit(build(no_cache=args.no_cache, pull=args.pull, file=compose_file, project=project,
                       verbose=verbose, patterns=patterns))

    if action == "up":
        step("Starting containers…")
        sys.exit(up(detach=True, file=compose_file, project=project,
                    verbose=verbose, patterns=patterns))

    if action == "down":
        step("Stopping containers…")
        sys.exit(down(remove_volumes=args.volumes, file=compose_file, project=project,
                      verbose=verbose, patterns=patterns))

    print("🚀 Deploy in progress…")

    if not args.skip_ensure:
        step("Ensure Docker (install/start if needed)")
        if preflight_ensure_docker(verbose=verbose) != 0:
            sys.exit(2)

    if not args.skip_check:
        step("Check Docker & Compose")
        if preflight_check_docker(verbose=verbose) != 0:
            sys.exit(3)

    step("Build")
    if build(no_cache=args.no_cache, pull=args.pull, file=compose_file, project=project,
             verbose=verbose, patterns=patterns) != 0:
        sys.exit(1)

    # NEW: bring up DB & wait (if present)
    step("Database")
    if not ensure_db_ready(file=compose_file, project=project, verbose=verbose,
                           patterns=patterns, skip=args.skip_db):
        sys.exit(1)

    if args.check_migrations:
        step("Check migrations")
        if make_migrations(service=service, file=compose_file, project=project,
                           verbose=verbose, patterns=patterns, check=True) != 0:
            sys.exit(1)

    if args.make_migrations:
        step("Make migrations")
        if make_migrations(service=service, file=compose_file, project=project,
                           verbose=verbose, patterns=patterns, check=False) != 0:
            sys.exit(1)

    if not args.skip_migrate:
        step("Migrate")
        if exec_manage(["migrate", "--noinput"], service=service, file=compose_file, project=project,
                       verbose=verbose, patterns=patterns) != 0:
            sys.exit(1)


    if not args.skip_superuser:
        step("Ensure superuser")
        if ensure_superuser(service=service, file=compose_file, project=project,
                            verbose=verbose, patterns=patterns) != 0:
            sys.exit(1)

    if not args.skip_collectstatic:
        step("Collect static files")
        if exec_manage(["collectstatic", "--noinput"], service=service, file=compose_file, project=project,
                       verbose=verbose, patterns=patterns) != 0:
            sys.exit(1)

    step("Starting containers")
    if up(detach=True, file=compose_file, project=project, verbose=verbose, patterns=patterns) != 0:
        sys.exit(1)

    print("✅ Ready")

if __name__ == "__main__":
    main()