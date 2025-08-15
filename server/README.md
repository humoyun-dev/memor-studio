# 🧠 Memor Studio — Django Backend

Multilingual architecture studio backend built with **Django 5** and **Django REST Framework**, featuring a sleek **Unfold admin UI** and a production-ready **Docker** stack (Nginx + Gunicorn + Postgres).

---

## 🔗 Project Overview

* **API Base URL:** `/api/`
* **Admin Panel:** `/admin/`
* **Languages Supported:** Uzbek (`uz`), Russian (`ru`), English (`en`)
* **Core Django Apps:**

  * `news`
  * `projects`
  * `partners`
  * `mediafiles`
  * `team`
  * `awards`
  * `contact`
  * `vacancies`

---

## 🚀 Quick Start with Docker

### 1. Create the `.env` file inside the `server/` directory

```env
# Django
SECRET_KEY=change-me
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (docker-compose service: db)
POSTGRES_DB=app
POSTGRES_USER=app
POSTGRES_PASSWORD=app
DATABASE_URL=postgres://app:app@db:5432/app

# Static/Media paths inside containers
STATIC_ROOT=/app/staticfiles
MEDIA_ROOT=/app/media

# Optional: Auto-create superuser on deploy
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@example.com
DJANGO_SUPERUSER_PASSWORD=change-me
```

---

### 2. Deploy from `server/` directory

```bash
python3 deploy.py
```

This command performs the following:

* Build containers
* Wait for PostgreSQL to be ready
* Run DB migrations
* Create/Update Django superuser (optional)
* Collect static files
* Start all services

---

### 3. Open in Browser

* 🌐 **Site:** [http://localhost/](http://localhost/)
* 🔧 **Admin:** [http://localhost/admin/](http://localhost/admin/)

---

## 🧰 Handy Commands

```bash
python3 deploy.py --no-cache --pull   # Full rebuild with latest images
python3 deploy.py down -v             # Stop and remove containers + volumes
python3 deploy.py help                # Show help/usage
```

---

## 📘 Notes

* 🌍 **Language Selection:**

  * via HTTP header: `Accept-Language: uz|ru|en`
  * or query param: `?lang=uz|ru|en`
* 🗃️ **Static & Media Files:**

  * Stored in **Docker volumes**
  * Served by **Nginx**

---

Let me know if you'd like this converted into a downloadable `.md` file or want an HTML version of it.
