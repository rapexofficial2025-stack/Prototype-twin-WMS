"""
Firebase is used ONLY as a live push channel for the digital twin and
dashboard alerts — never as the system of record. Django + Supabase Postgres
stay the source of truth; this module just mirrors small status snapshots
into Firebase Realtime Database so the frontend can subscribe without polling.
"""
import logging

from django.conf import settings

logger = logging.getLogger(__name__)

_app = None
_init_failed = False


def _get_app():
    global _app, _init_failed
    if _app is not None or _init_failed:
        return _app
    if not settings.FIREBASE_CREDENTIALS_JSON or not settings.FIREBASE_DATABASE_URL:
        _init_failed = True
        return None
    try:
        import firebase_admin
        from firebase_admin import credentials

        cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_JSON)
        _app = firebase_admin.initialize_app(cred, {'databaseURL': settings.FIREBASE_DATABASE_URL})
    except Exception:
        # Misconfigured or missing Firebase credentials must never break a
        # write to the system of record (Postgres) — this channel is a
        # best-effort live-update mirror, not a dependency.
        logger.exception('Firebase init failed; live push disabled for this process')
        _init_failed = True
        return None
    return _app


def push_location_status(room_id: int, location_id: int, payload: dict) -> None:
    """Mirror a single location's live status to
    warehouse/rooms/{room_id}/locations/{location_id}. No-op if Firebase
    isn't configured or unreachable (e.g. local dev without a Firebase project)."""
    app = _get_app()
    if app is None:
        return
    try:
        from firebase_admin import db

        ref = db.reference(f'warehouse/rooms/{room_id}/locations/{location_id}', app=app)
        ref.set(payload)
    except Exception:
        logger.exception('Firebase push failed for location %s', location_id)
