# API Layer with Tagged ISR

Capa centralizada de fetch para Next.js App Router con revalidacion granular mediante tags de ISR.

**Detalles clave:**

- Wrapper generico `apiRequest<T>()` que unifica base URL, headers, manejo de errores y configuracion de `next: { tags }`
- Funciones de dominio como API publica (`getPage`, `getHeader`, etc.) que encapsulan endpoints y tags
- Revalidacion selectiva: `revalidateTag('page_/about/')` regenera solo las paginas asociadas a ese tag, sin rebuild completo
- Separacion entre infraestructura (fetch wrapper) y dominio (funciones exportadas)
