# Backend API

API REST del proyecto WebSecurity.

## Requisitos

- Node.js 18+
- Base de datos PostgreSQL
- Archivo `.env` en la carpeta `backend/`

## Variables de entorno

Ejemplo de variables usadas por el backend:

```env
PORT=3000
HOST=0.0.0.0
FRONTEND_URL=http://localhost:4200
JWT_SECRET=tu_secreto
JWT_EXPIRES_IN=1h
BCRYPT_ROUNDS=12
ALLOW_SEED_SUPERADMIN=false
COOKIE_SECURE=false
DATABASE_URL=postgres://usuario:password@host:5432/db
```

Tambien se soportan variables separadas para base de datos (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_SSL`).

## Ejecutar el backend

```bash
cd backend
npm install
npm start
```

Modo desarrollo:

```bash
cd backend
npm run dev
```

Health check:

```http
GET /api/health
```

## Autenticacion

La API usa JWT almacenado en cookie `httpOnly`.

Flujo:

1. Hacer login en `POST /api/auth/login`
2. El backend devuelve cookie `token`
3. Las rutas protegidas validan el JWT en cada peticion con `authMiddleware`

Detalles importantes:

- La sesion expira por inactividad a los 5 minutos
- En rutas de escritura sensibles se valida `Origin` o `Referer`
- El login tiene rate limit y bloqueo temporal por multiples intentos fallidos
- El JWT usa `HS256`, expiracion y validacion de `issuer`/`audience`
- La cookie `token` y la cookie `lastActivity` usan `httpOnly`, `sameSite`, `secure` segun entorno y `path=/`
- Para despliegues HTTPS, usar `NODE_ENV=production` o `COOKIE_SECURE=true` para activar el flag `Secure` en cookies

## Seguridad adicional

- `helmet` configurado explicitamente
- `X-Powered-By` deshabilitado
- CSP restrictiva orientada a API
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer`
- `Strict-Transport-Security` en produccion

## Roles del sistema

Roles base usados por la API:

- `SuperAdmin`
- `Auditor`
- `Registrador`

## Convenciones de respuestas

- `200` consulta o actualizacion correcta
- `201` recurso creado
- `400` datos invalidos
- `401` no autenticado o sesion expirada
- `403` acceso denegado
- `404` recurso no encontrado
- `409` conflicto por duplicados
- `500` error interno del servidor

## Endpoints

### Auth

#### `POST /api/auth/seed-superadmin`

Crea un usuario inicial con rol `SuperAdmin`.

Notas:

- Requiere `Origin` o `Referer` valido
- Solo funciona si `ALLOW_SEED_SUPERADMIN=true` en `.env`
- Se recomienda usarlo una sola vez para inicializacion

Body:

```json
{
  "username": "superadmin",
  "email": "admin@websecurity.com",
  "password": "Admin-12345"
}
```

#### `POST /api/auth/login`

Inicia sesion y crea la cookie `token`.

Requiere `Origin` o `Referer` valido.

Body:

```json
{
  "identifier": "admin@websecurity.com",
  "password": "Admin-12345"
}
```

Respuesta exitosa:

```json
{
  "message": "Login exitoso",
  "user": {
    "id": 1,
    "username": "superadmin",
    "email": "admin@websecurity.com",
    "role": "SuperAdmin"
  }
}
```

#### `POST /api/auth/logout`

Cierra sesion y limpia cookies.

Requiere `Origin` o `Referer` valido.

#### `GET /api/auth/session`

Consulta la sesion actual sin generar un `401` cuando no hay usuario autenticado.

Respuesta sin sesion:

```json
{
  "user": null
}
```

### Protected

#### `GET /api/protected/profile`

Ruta protegida de prueba para validar sesion.

Roles:

- cualquier usuario autenticado

#### `GET /api/protected/admin-only`

Ruta protegida solo para `SuperAdmin`.

### Products

#### `GET /api/products`

Lista productos activos.

Roles:

- `Auditor`
- `Registrador`

#### `GET /api/products/:id`

Obtiene un producto por id.

Roles:

- `Auditor`
- `Registrador`

#### `POST /api/products`

Crea un producto.

Roles:

- `Registrador`

Requiere `Origin` o `Referer` valido.

Body:

```json
{
  "code": "P001",
  "name": "Laptop",
  "description": "Equipo de trabajo",
  "quantity": 10,
  "price": 850.5,
  "category": "Tecnologia"
}
```

Reglas de validacion:

- `code` es obligatorio
- `code` debe ser alfanumerico
- `quantity` debe ser numerico y no puede ser negativo
- `price` debe ser numerico y no puede ser negativo

#### `PUT /api/products/:id`

Actualiza un producto.

Roles:

- `Registrador`

Requiere `Origin` o `Referer` valido.

Body:

```json
{
  "name": "Laptop Pro",
  "description": "Equipo actualizado",
  "quantity": 8,
  "price": 920,
  "category": "Tecnologia"
}
```

Reglas de validacion:

- `name`, `description`, `quantity`, `price` y `category` son obligatorios
- `quantity` debe ser numerico y no puede ser negativo
- `price` debe ser numerico y no puede ser negativo

#### `DELETE /api/products/:id`

Elimina logicamente un producto.

Roles:

- `Registrador`

Requiere `Origin` o `Referer` valido.

### Users

#### `GET /api/users`

Lista usuarios con username, email, rol, permisos y fecha/hora del ultimo login.

Roles:

- `SuperAdmin`
- `Auditor`
- `Registrador`

#### `GET /api/users/:id`

Obtiene un usuario con username, email, rol, permisos y fecha/hora del ultimo login.

Roles:

- `SuperAdmin`
- `Auditor`
- `Registrador`

#### `POST /api/users`

Crea un usuario.

Roles:

- `SuperAdmin`

Requiere `Origin` o `Referer` valido.

Body:

```json
{
  "username": "operador1",
  "email": "operador1@websecurity.com",
  "password": "ClaveSegura123",
  "roleId": 2
}
```

#### `PUT /api/users/:id`

Actualiza usuario.

Roles:

- `SuperAdmin`

Requiere `Origin` o `Referer` valido.

Body:

```json
{
  "username": "operador1",
  "email": "operador1@websecurity.com",
  "roleId": 2,
  "isActive": true
}
```

Cambio opcional de password:

```json
{
  "username": "operador1",
  "email": "operador1@websecurity.com",
  "roleId": 2,
  "isActive": true,
  "password": "NuevaClave123"
}
```

#### `DELETE /api/users/:id`

Desactiva un usuario.

Roles:

- `SuperAdmin`

Requiere `Origin` o `Referer` valido.

### Roles

#### `GET /api/roles`

Lista roles con permisos asignados.

Roles:

- `SuperAdmin`

#### `POST /api/roles`

Crea un rol.

Roles:

- `SuperAdmin`

Requiere `Origin` o `Referer` valido.

Body:

```json
{
  "name": "Soporte",
  "description": "Rol de soporte"
}
```

#### `PUT /api/roles/:id`

Actualiza un rol.

Roles:

- `SuperAdmin`

Requiere `Origin` o `Referer` valido.

Body:

```json
{
  "name": "Soporte Senior",
  "description": "Rol actualizado"
}
```

#### `DELETE /api/roles/:id`

Elimina un rol si no es rol base y si no esta asignado a usuarios.

Roles:

- `SuperAdmin`

Requiere `Origin` o `Referer` valido.

#### `GET /api/roles/permissions/all`

Lista todos los permisos disponibles.

Roles:

- `SuperAdmin`

#### `PUT /api/roles/:id/permissions`

Reemplaza los permisos de un rol.

Roles:

- `SuperAdmin`

Requiere `Origin` o `Referer` valido.

Body:

```json
{
  "permissionIds": [1, 2, 3]
}
```

### Audit Logs

#### `GET /api/audit-logs`

Lista registros de auditoria.

Roles:

- `SuperAdmin`

Filtros opcionales por query:

- `event_type`
- `user_id`
- `date_from`
- `date_to`
- `limit`

Ejemplo:

```http
GET /api/audit-logs?event_type=LOGIN_SUCCESS&limit=50
```

Validaciones:

- `limit` debe estar entre `1` y `500`
- `user_id` debe ser un UUID valido
- `date_from` y `date_to` deben ser fechas validas
- `date_from` no puede ser mayor que `date_to`

## Seguridad implementada

- JWT en cookie `httpOnly`
- JWT con algoritmo `HS256`, expiracion, `issuer` y `audience`
- `helmet` con configuracion explicita
- `cors` con `credentials: true`
- validacion de `Origin/Referer` en rutas sensibles
- rate limit en login con auditoria del bloqueo por IP
- bloqueo temporal por multiples intentos fallidos de usuario
- cierre de sesion por inactividad
- autorizacion por rol
- auditoria de eventos de seguridad y cambios criticos
- `X-Powered-By` deshabilitado

## Prueba rapida en Postman

1. `POST /api/auth/login`
2. Confirmar que Postman guarde la cookie `token`
3. Consumir rutas protegidas con esa cookie
4. En `POST`, `PUT` y `DELETE` agregar header:

```http
Origin: http://localhost:4200
```

Usa el valor real configurado en `FRONTEND_URL`.

Si no envias `Origin`, el backend intentara validar `Referer`. Si no existe ninguno de los dos, la peticion sera rechazada en rutas de escritura protegidas.
