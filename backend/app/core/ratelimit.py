"""Simple in-memory sliding-window rate limiter.

Used for login attempts. In-memory means limits are per-process; this is
suitable for the current single-instance deployment target. For multi-instance
deployments, replace with a shared store or enforce at a proxy/load balancer.
"""

import time
from collections import defaultdict, deque
from threading import Lock

from ..config import get_settings


class SlidingWindowLimiter:
    def __init__(self, max_attempts: int, window_seconds: int) -> None:
        self._max_attempts = max_attempts
        self._window_seconds = window_seconds
        self._events: dict[str, deque[float]] = defaultdict(deque)
        self._lock = Lock()

    def allow(self, key: str) -> bool:
        """Record an attempt and return whether it is allowed."""
        now = time.monotonic()
        with self._lock:
            events = self._events[key]
            while events and now - events[0] >= self._window_seconds:
                events.popleft()
            if len(events) >= self._max_attempts:
                return False
            events.append(now)
            return True

    def reset(self) -> None:
        with self._lock:
            self._events.clear()


_login_limiter: SlidingWindowLimiter | None = None


def get_login_limiter() -> SlidingWindowLimiter:
    global _login_limiter
    if _login_limiter is None:
        settings = get_settings()
        _login_limiter = SlidingWindowLimiter(
            settings.login_rate_limit_max_attempts,
            settings.login_rate_limit_window_seconds,
        )
    return _login_limiter


def reset_login_limiter() -> None:
    get_login_limiter().reset()