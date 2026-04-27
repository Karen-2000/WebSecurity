# WebSecurity

Proyecto web con frontend en Angular y backend en Node.js/Express para gestion de autenticacion, usuarios, productos, roles y auditoria.

## Modulos principales

- `frontend`: interfaz web del sistema
- `backend`: API REST, autenticacion JWT, autorizacion por roles y auditoria

## Estructura del proyecto

```text
WebSecurity/
|-- backend/
|-- frontend/
|-- README.md
```

## Tecnologias usadas

### Frontend

- Angular
- TypeScript

### Backend

- Node.js
- Express
- PostgreSQL
- JWT
- bcrypt

## Justificacion del stack

Se eligio Angular porque ofrece renderizado seguro por defecto mediante escaping de plantillas, separacion clara de componentes y soporte maduro para formularios, guards e interceptores HTTP. En el backend se eligio Node.js con Express por su madurez, ecosistema amplio de middlewares de seguridad y facilidad para construir APIs REST con autenticacion JWT. PostgreSQL se usa como base relacional por su soporte de integridad, consultas parametrizadas y estabilidad en aplicaciones transaccionales. Para seguridad, el stack integra `bcrypt`, `helmet`, `jsonwebtoken`, `express-rate-limit`, cookies `HttpOnly` y validacion de `Origin/Referer`.

## Funcionalidades implementadas

- Inicio y cierre de sesion
- Autenticacion con JWT en cookie `httpOnly`
- Control de acceso por roles
- Gestion de usuarios
- Gestion de productos
- Gestion de roles y permisos
- Log de auditoria
- Expiracion de sesion por inactividad
- Rate limiting y bloqueo temporal en login
- Validacion de `Origin/Referer` en rutas de escritura
- Headers de seguridad con `helmet`

## Requisitos

- Node.js 18+
- npm
- PostgreSQL

## Ejecutar el proyecto

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
npm install
npm start
```

Modo desarrollo del backend:

```bash
cd backend
npm run dev
```

## Documentacion

- Documentacion general de la API: [backend/README.md](backend/README.md)
- El README del backend incluye:
  - variables de entorno
  - autenticacion
  - roles
  - endpoints disponibles
  - ejemplos de bodies y respuestas

## Endpoints principales

Base URL del backend:

```text
http://localhost:3000/api
```

Modulos expuestos:

- `/auth`
- `/protected`
- `/products`
- `/users`
- `/roles`
- `/audit-logs`

## Seguridad implementada

- JWT validado en cada peticion protegida
- Cookies `httpOnly`
- Cookies con `sameSite`, `secure` y expiracion segun entorno
- `helmet` con politicas explicitas
- `cors` con credenciales
- Validacion de `Origin/Referer` en rutas sensibles
- Autorizacion por rol
- Registro de auditoria de eventos criticos con IP
- Rate limiting y bloqueo temporal por multiples intentos fallidos

## Objetivo del proyecto

Centralizar la gestion segura de usuarios, productos y permisos dentro de una arquitectura separada entre frontend y backend, cumpliendo requerimientos funcionales y de seguridad del sistema.
