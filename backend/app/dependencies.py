# backend/app/dependencies.py
# This file contains the rate limiting logic.

import time
from collections import defaultdict
from fastapi import HTTPException, Request

# A simple in-memory store for rate limiting.
# defaultdict(list) will create a new list for any new user IP.
request_counts = defaultdict(list)
RATE_LIMIT_DURATION = 10  # seconds
RATE_LIMIT_REQUESTS = 5   # max requests

async def rate_limiter(request: Request):
    """
    A simple in-memory rate limiter based on client IP.
    """
    client_ip = request.client.host
    current_time = time.time()

    # Get the list of timestamps for the client IP
    request_timestamps = request_counts[client_ip]

    # Remove timestamps that are outside the rate limit window
    valid_timestamps = [t for t in request_timestamps if t > current_time - RATE_LIMIT_DURATION]

    # If the number of recent requests exceeds the limit, raise an error
    if len(valid_timestamps) >= RATE_LIMIT_REQUESTS:
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Try again later."
        )

    # Add the current request's timestamp and update the store
    valid_timestamps.append(current_time)
    request_counts[client_ip] = valid_timestamps