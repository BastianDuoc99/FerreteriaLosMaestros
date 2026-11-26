const DOMINIOS_PERMITIDOS = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

export function validEmail(valor) {
  const correo = String(valor || "").trim();
  if (!correo || correo.length > 100) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) && DOMINIOS_PERMITIDOS.test(correo);
}

export function digitoVerificadorRun(cuerpo) {
  const texto = String(cuerpo || "").replace(/\D/g, "");
  let suma = 0;
  let multiplicador = 2;

  for (let i = texto.length - 1; i >= 0; i--) {
    suma += Number(texto[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = suma % 11;
  const digito = 11 - resto;

  if (digito === 11) return "0";
  if (digito === 10) return "K";
  return String(digito);
}

export function validRun(valor) {
  const texto = String(valor || "")
    .replace(/[.\s-]/g, "")
    .toUpperCase();
  const coincidencia = texto.match(/^(\d{6,8})([0-9K])$/);
  if (!coincidencia) return false;
  return digitoVerificadorRun(coincidencia[1]) === coincidencia[2];
}

export function validPassword(valor) {
  const texto = String(valor || "");
  return texto.length >= 4 && texto.length <= 10;
}

export function validarLogin({ email, password }) {
  const errores = {};

  if (!email?.trim()) {
    errores.email = "El correo es requerido.";
  } else if (!validEmail(email)) {
    errores.email = "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
  }

  if (!password) {
    errores.password = "La contraseña es requerida.";
  } else if (!validPassword(password)) {
    errores.password = "Debe tener entre 4 y 10 caracteres.";
  }

  return errores;
}

export function validarRegistro({
  run,
  nombre,
  apellidos,
  email,
  password,
  direccion,
}) {
  const errores = {};

  if (!validRun(run)) {
    errores.run = "RUN inválido. Revisa el dígito verificador. Ej: 12345678-5.";
  }

  if (!nombre?.trim()) {
    errores.nombre = "El nombre es requerido.";
  } else if (nombre.length > 50) {
    errores.nombre = "Máximo 50 caracteres.";
  }

  if (!apellidos?.trim()) {
    errores.apellidos = "Los apellidos son requeridos.";
  } else if (apellidos.length > 100) {
    errores.apellidos = "Máximo 100 caracteres.";
  }

  if (!validEmail(email)) {
    errores.email = "Correo inválido o no permitido.";
  }

  if (!validPassword(password)) {
    errores.password = "Debe tener entre 4 y 10 caracteres.";
  }

  if (!direccion?.trim()) {
    errores.direccion = "La dirección es requerida.";
  } else if (direccion.length > 300) {
    errores.direccion = "Máximo 300 caracteres.";
  }

  return errores;
}

export function validarContacto({ nombre, correo, comentario }) {
  const errores = {};

  if (!nombre?.trim()) {
    errores.nombre = "El nombre es requerido.";
  } else if (nombre.length > 100) {
    errores.nombre = "Máximo 100 caracteres.";
  }

  // El backend exige correo no vacío y con formato válido (ContactoRequest).
  if (!correo?.trim()) {
    errores.correo = "El correo es requerido.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
    errores.correo = "Correo inválido.";
  }

  if (!comentario?.trim()) {
    errores.comentario = "El comentario es requerido.";
  } else if (comentario.length > 500) {
    errores.comentario = "Máximo 500 caracteres.";
  }

  return errores;
}

export function validarProducto({
  codigo,
  nombre,
  descripcion,
  precio,
  precioCompra,
  stock,
  stockMinimo,
  categoria,
  subcategoria,
  marca,
  unidad,
}) {
  const errores = {};

  if (!codigo?.trim() || codigo.trim().length < 3) {
    errores.codigo = "El código es requerido y debe tener al menos 3 caracteres.";
  }

  if (!nombre?.trim()) {
    errores.nombre = "El nombre es requerido.";
  } else if (nombre.length > 100) {
    errores.nombre = "Máximo 100 caracteres.";
  }

  if (!categoria) {
    errores.categoria = "Selecciona una categoría.";
  }

  if (!subcategoria?.trim()) {
    errores.subcategoria = "La subcategoría es requerida.";
  } else if (subcategoria.length > 60) {
    errores.subcategoria = "Máximo 60 caracteres.";
  }

  if (!marca?.trim()) {
    errores.marca = "La marca es requerida.";
  } else if (marca.length > 60) {
    errores.marca = "Máximo 60 caracteres.";
  }

  if (!unidad?.trim()) {
    errores.unidad = "La unidad de venta es requerida.";
  } else if (unidad.length > 30) {
    errores.unidad = "Máximo 30 caracteres.";
  }

  if (descripcion && descripcion.length > 500) {
    errores.descripcion = "Máximo 500 caracteres.";
  }

  if (
    precioCompra === "" ||
    Number.isNaN(Number(precioCompra)) ||
    Number(precioCompra) < 0
  ) {
    errores.precioCompra = "Ingresa un precio de compra numérico mayor o igual a 0.";
  }

  if (precio === "" || Number.isNaN(Number(precio)) || Number(precio) < 0) {
    errores.precio = "Ingresa un precio de venta numérico mayor o igual a 0.";
  }

  if (stock === "" || !/^\d+$/.test(String(stock))) {
    errores.stock = "Ingresa un stock entero mayor o igual a 0.";
  }

  if (stockMinimo === "" || !/^\d+$/.test(String(stockMinimo))) {
    errores.stockMinimo = "Ingresa un stock mínimo entero mayor o igual a 0.";
  }

  return errores;
}
