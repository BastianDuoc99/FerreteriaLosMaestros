package cl.dsy1104.ferreteria.service;

import cl.dsy1104.ferreteria.dto.ProductoRequest;
import cl.dsy1104.ferreteria.entity.Producto;
import cl.dsy1104.ferreteria.exception.ApiException;
import cl.dsy1104.ferreteria.repository.ProductoRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ProductoService {

  private final ProductoRepository productoRepository;

  public ProductoService(ProductoRepository productoRepository) {
    this.productoRepository = productoRepository;
  }

  public List<Producto> listar(
      String q, String categoria, String tipo, String subcategoria, boolean stockBajo) {
    return productoRepository.buscar(
        vacioANulo(q), vacioANulo(categoria), vacioANulo(tipo), vacioANulo(subcategoria), stockBajo);
  }

  public List<String> categorias() {
    return productoRepository.findCategorias();
  }

  public List<String> tipos() {
    return productoRepository.findTipos();
  }

  public Producto obtener(String codigo) {
    return productoRepository
        .findById(codigo)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Producto no encontrado: " + codigo));
  }

  @Transactional
  public Producto crear(ProductoRequest solicitud) {
    if (productoRepository.existsById(solicitud.codigo())) {
      throw new ApiException(HttpStatus.CONFLICT, "El código ya existe: " + solicitud.codigo());
    }
    Producto producto = new Producto();
    aplicar(producto, solicitud);
    producto.setCodigo(solicitud.codigo());
    return productoRepository.save(producto);
  }

  @Transactional
  public Producto actualizar(String codigo, ProductoRequest solicitud) {
    Producto producto = obtener(codigo);
    aplicar(producto, solicitud);
    producto.setCodigo(codigo);
    return productoRepository.save(producto);
  }

  @Transactional
  public void eliminar(String codigo) {
    Producto producto = obtener(codigo);
    productoRepository.delete(producto);
  }

  private void aplicar(Producto producto, ProductoRequest solicitud) {
    producto.setCategoria(solicitud.categoria());
    producto.setSubcategoria(solicitud.subcategoria());
    producto.setNombre(solicitud.nombre());
    producto.setMarca(solicitud.marca());
    producto.setUnidad(solicitud.unidad());
    producto.setPrecioCompra(solicitud.precioCompra());
    producto.setPrecio(solicitud.precio());
    producto.setStock(solicitud.stock());
    producto.setStockMinimo(solicitud.stockMinimo());
    producto.setDescripcion(solicitud.descripcion());
    producto.setImagen(solicitud.imagen());
    producto.setTipo(solicitud.tipo());
  }

  private String vacioANulo(String valor) {
    return valor == null || valor.isBlank() ? null : valor.trim();
  }
}
