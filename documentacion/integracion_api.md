# Integración frontend-backend

## Flujo de autenticación

1. El usuario envía `POST /api/auth/login` con `{ "email", "password" }`.
2. El backend valida la contraseña con BCrypt y devuelve `AuthResponse` con `token`, `email`, `nombre`, `rol` y `cuentaCorriente`.
3. El frontend guarda solo el JWT en `sessionStorage` mediante `src/services/api.js`.
4. Al recargar la página, `SesionProvider` consulta `GET /api/auth/me` y reconstruye el perfil desde el backend.
5. `RutaProtegida` y `NavBar` usan el rol devuelto por la API, nunca un rol almacenado por el cliente.

## Catálogo

- `GET /api/productos` alimenta inicio, catálogo, detalle y mantenedor.
- El carrito conserva temporalmente productos para la sesión del comprador, pero el total y el stock se recalculan en el servidor.
- `POST /api/pedidos` recibe solo:

```json
{
  "items": [{ "codigo": "MC001", "qty": 2 }],
  "entrega": "retiro",
  "pago": "contado",
  "direccion": ""
}
```

`PedidoService` obtiene el precio de la base de datos, valida stock con bloqueo pesimista y descuenta las unidades.

## Control de acceso

| Endpoint | Acceso |
| --- | --- |
| `GET /api/productos` | público |
| `POST/PUT/DELETE /api/productos` | Administrador o Vendedor |
| `POST /api/pedidos` | cualquier usuario autenticado |
| `GET /api/pedidos/mios` | cualquier usuario autenticado |
| `GET /api/pedidos` | Administrador |
| `GET /api/usuarios` | Administrador |
| `PUT /api/usuarios/{id}/cuenta-corriente` | Administrador |

La opción de pago con cuenta corriente se habilita en el frontend solo si `cuentaCorriente === true` en el perfil remoto. El backend vuelve a validar la aprobación antes de aceptar el pedido.

## CORS y configuración

- Backend: `http://localhost:8080`, CORS permitido para `http://localhost:5173` y `http://127.0.0.1:5173`.
- Frontend: variable `VITE_API_URL`, copiada desde `frontend/.env.example`.

## Verificación

- Backend: `.\mvnw.cmd -B -ntp test` — 8 tests de contexto, API, seguridad y pedidos.
- Frontend: `npm test` — tests de cliente API y flujos con respuestas simuladas.
