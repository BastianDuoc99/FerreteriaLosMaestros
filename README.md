# Ferretería Los Maestros — EP3 (DSY1104)

Proyecto fullstack del semestral: **React 19 + Vite 8** en el frontend y **Spring Boot 3.5 + MySQL 8** en el backend, con API REST, Swagger/OpenAPI, autenticación JWT, roles y control de acceso en ambas capas.

## Estructura

```text
FerreteriaLosMaestros/
├── frontend/          # React + Vite (consumo real de la API)
├── backend/           # Spring Boot + JPA + Spring Security + JWT
├── database/          # Documentación de la base de datos
└── docker-compose.yml # MySQL 8 para ejecución local
```

Los entregables (documentación, ZIPs y script de arranque) están **fuera del repo**, en
`C:\Users\BastiBrown\Desktop\FerreteriaLosMaestros_Entregables`.

## Requisitos previos

- JDK 17 o superior (verificado con Temurin 21). Si `.\mvnw.cmd` dice `JAVA_HOME not found`, define la variable en la terminal antes de ejecutar:

  ```powershell
  $env:JAVA_HOME = Split-Path -Parent (Split-Path -Parent (Get-Command java).Source)
  ```

- Node 20 o superior y npm
- MySQL 8 (mediante `docker compose` o el script portable de la carpeta de entregables del Escritorio)

## 1. Base de datos MySQL

### Opción A — Docker

```powershell
docker compose up -d mysql
```

Crea la BD `ferreteria`, el usuario `ferreteria` y la contraseña `ferreteria123` en el puerto 3306.

### Opción B — MySQL portable (sin Docker ni permisos de administrador)

```powershell
& "C:\Users\BastiBrown\Desktop\FerreteriaLosMaestros_Entregables\scripts\iniciar-mysql.ps1"
```

El script está fuera del repo, en la carpeta de entregables del Escritorio. Usa `C:\Users\BastiBrown\mysql-8.4` por defecto; puedes cambiar la ruta con `-MysqlHome "C:\ruta\mysql"`. Levanta el servidor en `127.0.0.1:3306`, crea la BD y el usuario si no existen, y deja el proceso corriendo.

> Las credenciales anteriores son **de demostración**, no secretos reales.

## 2. Backend

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Por defecto usa MySQL. Si no tienes MySQL disponible, puedes levantar igual con H2:

```powershell
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```

- API: `http://localhost:8080/api`
- **Swagger UI: `http://localhost:8080/swagger-ui.html`**
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
- Las tablas se crean con JPA (`ddl-auto=update`) y `data.sql` carga 85 productos; `DataSeeder` crea 3 usuarios.

Variables de entorno: copiar `backend/.env.example` y exportarlas (Spring no lee `.env` automáticamente). Las variables son `DB_URL`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, `JWT_EXPIRATION_MS` y `CORS_ALLOWED_ORIGINS`.

## 3. Frontend

```powershell
cd frontend
npm ci
copy .env.example .env
npm run dev
```

Frontend en `http://localhost:5173`. La variable `VITE_API_URL` apunta a `http://localhost:8080/api`.

## Cuentas de demostración

| Correo | Contraseña | Rol |
| --- | --- | --- |
| `admin@duoc.cl` | `1234` | Administrador |
| `vendedor@duoc.cl` | `1234` | Vendedor |
| `cliente@duoc.cl` | `1234` | Contratista |

## Pruebas

```powershell
cd backend
.\mvnw.cmd -B -ntp test        # 8 tests de contexto, API, seguridad y pedidos (H2 en memoria)
```

```powershell
cd frontend
npm test                        # 44 tests unitarios y de componentes
npm run build
```

## Decisiones de integración

- El JWT se guarda solo en `sessionStorage`; el perfil se recupera desde `GET /api/auth/me`, por lo que la sesión sobrevive a una recarga.
- El carrito (productos, cantidades y precios de referencia) se guarda en `localStorage` solo como comodidad de UX; **el total y el stock se recalculan en `PedidoService`** al confirmar el pedido.
- Los roles se validan en el backend (Spring Security + `@PreAuthorize`) y en el frontend (`RutaProtegida`).
- La cuenta corriente solo se puede usar si el administrador la aprobó en el backend.
- La documentación consultable de la API está en Swagger UI y usa el esquema `bearerAuth`.

## Documentación adicional

Todo lo siguiente está en `C:\Users\BastiBrown\Desktop\FerreteriaLosMaestros_Entregables`, salvo `database/README.md`, que sí queda en el repo:

- `documentacion/integracion_api.md` — arquitectura, componentes, flujo REST, configuración y pasos de ejecución.
- `documentacion/manual_usuario.md` — manual de usuario con capturas.
- `documentacion/coleccion_postman.json` — colección para probar los endpoints.
- `entregables/backend.zip` y `entregables/frontend.zip` — ZIPs generados desde el tag `ep3-entrega`.
- `scripts/iniciar-mysql.ps1` — arranque de MySQL portable (Opción B).
- `database/README.md` — esquema y seeds (en el repo).

## Versión entregada EP3

El tag `ep3-entrega` identifica la versión revisada para la entrega de la sección 006.
