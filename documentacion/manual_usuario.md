# Manual de usuario — Ferretería Los Maestros

Aplicación web para comprar materiales de ferretería. Frontend: `http://localhost:5173`. API y Swagger: `http://localhost:8080`.

> **Nota para la entrega:** las marcas `[Captura N: ...]` indican el lugar exacto donde debes insertar cada captura de pantalla antes de subir el manual a AVA.

---

## 1. Inicio y catálogo

1. Abre `http://localhost:5173`. Verás el encabezado con el logo, el menú y el contador del carrito.
   `[Captura 1: página de inicio con el encabezado y productos destacados]`
2. Haz clic en **Productos**. Se lista el catálogo real obtenido desde `GET /api/productos` (85 productos).
3. Usa los filtros de **categoría**, **tipo** y el buscador para reducir la lista.
   `[Captura 2: catálogo con filtros aplicados]`
4. Haz clic en una tarjeta para ver el detalle: precio, stock, marca y botón **Añadir al carrito**.
   `[Captura 3: detalle de producto]`

## 2. Registro

1. En el menú, entra a **Registro**.
2. Completa nombre, apellidos, RUN (con dígito verificador), correo (`@duoc.cl`, `@profesor.duoc.cl` o `@gmail.com`), contraseña (4–10 caracteres), región, comuna, dirección y tipo de cliente.
3. Si eliges **Contratista**, marca *Solicitar cuenta corriente*. La cuenta queda **pendiente de aprobación**; el administrador debe aprobarla en el panel `/admin`.
   `[Captura 4: formulario de registro completado]`
4. Al enviar, verás un mensaje de confirmación y podrás iniciar sesión.

## 3. Inicio de sesión y sesión persistente

1. Entra a **Login** y usa una de las cuentas demo:

   | Correo | Contraseña | Rol |
   | --- | --- | --- |
   | `admin@duoc.cl` | `1234` | Administrador |
   | `vendedor@duoc.cl` | `1234` | Vendedor |
   | `cliente@duoc.cl` | `1234` | Contratista |

2. El encabezado muestra tu nombre y rol.
   `[Captura 5: encabezado con usuario autenticado y rol]`
3. **Recarga la página (F5)**: la sesión se mantiene porque el JWT se guarda en `sessionStorage` y el perfil se recupera con `GET /api/auth/me`.
   `[Captura 6: sesión conservada tras recargar]`
4. Si el token expira o se manipula, la sesión se cierra automáticamente y te devuelve al login.

## 4. Carrito y compra

1. Desde el catálogo, añade dos productos distintos y ajusta las cantidades.
   `[Captura 7: carrito con dos productos y total]`
2. En **Carrito**, elige el tipo de entrega:
   - **Retiro**: no requiere dirección.
   - **Despacho**: aparece un campo de dirección obligatorio.
3. Elige el pago:
   - **Contado**: disponible para todos.
   - **Cuenta corriente**: solo si el perfil indica que fue aprobada por el administrador; si no, el backend responde 403.
4. Pulsa **Confirmar pedido**. El backend recalcula precios y descuenta stock.
   `[Captura 8: confirmación de pedido exitoso]`

## 5. Mis pedidos

1. Con sesión iniciada, entra a **Mis pedidos**.
2. Verás el historial con fecha, total, estado y detalle de cada pedido.
   `[Captura 9: historial de pedidos del usuario]`

## 6. Panel de administración (solo Administrador o Vendedor)

1. Entra a **Admin**. Verás la tabla con los 85 productos.
   `[Captura 10: panel admin con tabla de productos]`
2. Para crear un producto, completa el formulario (código único, categoría, marca, precios, stock, imagen y tipo) y guarda.
3. Para **editar**, pulsa **Editar** en la fila correspondiente: el formulario se precarga con los datos actuales. Guarda para aplicar los cambios (se envía un `PUT`).
4. Para eliminar, pulsa **Eliminar** y confirma (se envía un `DELETE`).
   `[Captura 11: formulario de producto y resultado de la acción]`
5. Si eres **Administrador**, verás el panel **Cuenta corriente** con las solicitudes pendientes. Pulsa **Aprobar** en el usuario deseado.
   `[Captura 12: aprobación de cuenta corriente]`
6. Si intentas entrar con un rol `Contratista`, la aplicación redirige al inicio (restricción de ruta en frontend y 403 en backend).

## 7. API documentada con Swagger

1. Abre `http://localhost:8080/swagger-ui.html`. Verás todos los endpoints agrupados (auth, productos, pedidos, usuarios, contacto).
   `[Captura 13: Swagger UI con la lista de endpoints]`
2. Haz `POST /api/auth/login` con `{"email":"admin@duoc.cl","password":"1234"}` y copia el valor de `token`.
   `[Captura 14: respuesta de login con el JWT]`
3. Pulsa **Authorize** y pega el token. Ahora puedes ejecutar `GET /api/usuarios` y obtener 200.
   `[Captura 15: Authorize y GET /api/usuarios con 200]`
4. Prueba `GET /api/usuarios` **sin autorizar**: obtendrás 401. Con el token de `vendedor@duoc.cl` obtendrás 403.
   `[Captura 16: respuestas 401 y 403]`

## 8. Contacto

1. Entra a **Contacto**, escribe nombre, correo y mensaje.
2. Al enviar, el mensaje se almacena en la tabla `contactos` y aparece un aviso de confirmación.
   `[Captura 17: formulario de contacto enviado]`

## 9. Cerrar sesión

1. Pulsa **Salir** en el encabezado. El token se elimina y las rutas protegidas dejan de estar disponibles.
   `[Captura 18: estado de sesión cerrada]`
