"""
Firebase is used ONLY as a live push channel for the digital twin and
dashboard alerts — never as the system of record. Django + Supabase Postgres
stay the source of truth; this module just mirrors small status snapshots
into Firebase Realtime Database so the frontend can subscribe without polling.
"""
from django.conf import settings

_app = None


def _get_app():
    global _app
    if _app is not None:
        return _app
    if not settings.FIREBASE_CREDENTIALS_JSON or not settings.FIREBASE_DATABASE_URL:
        return None
    import firebase_admin
    from firebase_admin import credentials

    cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_JSON)
    _app = firebase_admin.initialize_app(cred, {'databaseURL': settings.FIREBASE_DATABASE_URL})
    return _app


def push_location_status(room_id: int, location_id: int, payload: dict) -> None:
    """Mirror a single location's live status to
    warehouse/rooms/{room_id}/locations/{location_id}. No-op if Firebase
    credentials aren't configured (e.g. local dev without a Firebase project)."""
    app = _get_app()
    if app is None:
        return
    from firebase_admin import db

    ref = db.reference(f'warehouse/rooms/{room_id}/locations/{location_id}', app=app)
    ref.set(payload)
