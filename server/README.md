🏛️ Memor Studio — Django Backend

Backend for an architecture studio built with Django 5 + DRF. It’s multilingual (uz/ru/en), ships a modern Unfold admin UI, and runs on a Docker stack (Nginx + Gunicorn + Postgres).
API base: /api/ • Admin: /admin/
Apps: news, projects, partners, mediafiles, team, awards, contact, vacancies

⸻

🚀 Quick Start (Docker)

1) Create .env (inside server/)

server/.env:

# Django
SECRET_KEY=change-me
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Postgres (docker-compose service "db")
POSTGRES_DB=app
POSTGRES_USER=app
POSTGRES_PASSWORD=app
DATABASE_URL=postgres://app:app@db:5432/app

# Static/Media inside containers (match docker-compose volumes)
STATIC_ROOT=/app/staticfiles
MEDIA_ROOT=/app/media

# Optional: auto-create superuser during deploy
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@example.com
DJANGO_SUPERUSER_PASSWORD=change-me

2) One command

From the server/ folder:

python3 deploy.py

This runs build → DB ready → migrate → superuser → collectstatic → up automatically.

3) Open
	•	🌐 Site: http://localhost/
	•	🔐 Admin: http://localhost/admin/

⸻

🔧 Handy commands

python3 deploy.py --no-cache --pull   # clean rebuild
python3 deploy.py down -v             # stop & remove volumes
python3 deploy.py help                # usage summary

That’s it—just run the command and you’re good to go.
