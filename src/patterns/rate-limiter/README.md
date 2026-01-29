# Rate limiter

An in-memory sliding window rate limiter with probabilistic garbage collection.

**Detalles clave:**

- Seguimiento por IP
- Limpieza probabilística (1 % de probabilidad por request) que evita timers dedicados de limpieza
- Devuelve headers estándar de rate limit (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`)
- Limitación documentada: funciona solo por instancia; para despliegues distribuidos necesita Redis