# Informe de Auditoría de Seguridad

**Equipo:** Gonzalo
**Fecha:** 22/09/2026
**Herramienta usada:** Antigravity AI Auditor
**Hallazgos confirmados:** 1
**Falsos positivos:** 1

## Hallazgos confirmados

1. **Subida de archivos sin limite de tamaño total (Denegacion de Servicio)**
   - **Severidad:** Media
   - **Archivo y linea:** `app/routers/productos.py`, linea 37
   - **Explicación:** Si bien se limita cada archivo a 2MB, un administrador (o alguien con acceso a una cuenta comprometida) podria subir miles de imagenes llenando el disco del servidor, causando caida del sistema.
   - **Estado:** Pendiente (se arreglara implementando cuotas globales de almacenamiento).

## Falsos positivos

1. **Dependencia insegura (Falso Positivo)**
   - **Mensaje de la herramienta:** `require_admin` no valida correctamente los permisos porque asume rol fijo.
   - **Por qué no es cierto:** La dependencia en `app/dependencies.py` linea 38 extrae el `current_user` llamando primero a `get_current_user`, el cual SI valida y decodifica el JWT, asi que el rol esta firmado e inyectado correctamente, y si el rol no es "admin" tira HTTP 403 (linea 40). 

## Pendientes conocidos

1. **POST /pedidos/{pedido_id}/revocacion sin autenticación:** La Disposicion 954/2025 prohíbe exigir sesión previa para revocar una compra. No se puede poner token a esta ruta sin incumplir la ley. Pendiente: implementar un limite de intentos (Rate Limiting) por IP para evitar enumeracion de `pedido_id`.
2. **Disco efímero del deploy:** Las imágenes se guardan en `uploads/productos/`. Cuando se despliegue en un servicio de contenedores (como Render, Heroku o Railway), el disco es efímero y se borrarán en el próximo reinicio. Pendiente: integrar Amazon S3 o Cloudinary antes de la salida a producción.
