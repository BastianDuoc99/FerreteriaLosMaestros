# Ferretería Los Maestros — EP3

Proyecto fullstack para DSY1104: frontend React + Vite y backend Spring Boot con API REST, JWT, H2 y control de acceso por roles.

## Estructura

- `frontend/`: aplicación React, consume la API REST.
- `backend/`: API Spring Boot, persistencia JPA/H2, seguridad JWT y datos iniciales.
- `database/`: información de la base de datos y datos semilla.
- `documentacion/`: integración, colección Postman y manuales.

## Ejecución

### Backend

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Base de datos H2 en archivo, creada automáticamente en `backend/data/ferreteria.mv.db`.

### Frontend

```powershell
cd frontend
npm ci
copy .env.example .env
npm run dev
```

El frontend queda en `http://localhost:5173` y el backend en `http://localhost:8080`.

## Cuentas de demostración

| Correo | Contraseña | Rol |
| --- | --- | --- |
| `admin@duoc.cl` | `1234` | Administrador |
| `vendedor@duoc.cl` | `1234` | Vendedor |
| `cliente@duoc.cl` | `1234` | Contratista |

## Pruebas

```powershell
cd backend
.\mvnw.cmd -B -ntp test
```

```powershell
cd frontend
npm test
npm run build
```

## Decisiones de integración

- El frontend no persiste usuarios, roles, precios ni stock en `localStorage`.
- La sesión se mantiene con un JWT en `sessionStorage`; el perfil se recupera desde `GET /api/auth/me`.
- Los roles y authorities se validan en el backend con Spring Security.
- Los precios y el descuento de stock se calculan en `PedidoService`, no en el navegador.
- La cuenta corriente solo se puede usar si el administrador la aprobó en el backend.

## Endpoints principales

- `POST /api/auth/registro`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/productos`, `GET /api/productos/{codigo}`, `POST/PUT/DELETE /api/productos`
- `POST /api/pedidos`, `GET /api/pedidos/mios`, `GET /api/pedidos`
- `GET /api/usuarios`, `PUT /api/usuarios/{id}/cuenta-corriente`
- `POST /api/contacto`
