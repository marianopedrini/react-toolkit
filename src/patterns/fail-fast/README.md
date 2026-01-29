# Fail Fast

Patrón para hacer fallar la aplicación en tiempo de ejecución apenas se accede a una variable de entorno crítica faltante en **runtime**.

Variables de entorno validadas en tiempo de ejecución mediante *lazy getters* (`get prop()`), evitando fallos en tiempo de build cuando las variables no están definidas. 

**Detalles clave:**

- Los *lazy getters* permiten que el módulo se importe durante el build sin romper la aplicación: la validación solo se dispara cuando el valor se accede realmente
- Separación clara entre `publicEnv` (seguro para el cliente) y `serverEnv` (solo servidor)
- `as const` congela la forma del objeto y mejora la seguridad de tipos