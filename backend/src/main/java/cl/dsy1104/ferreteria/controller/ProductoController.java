package cl.dsy1104.ferreteria.controller;

import cl.dsy1104.ferreteria.dto.ProductoRequest;
import cl.dsy1104.ferreteria.entity.Producto;
import cl.dsy1104.ferreteria.service.ProductoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

  private final ProductoService productoService;

  public ProductoController(ProductoService productoService) {
    this.productoService = productoService;
  }

  @GetMapping
  public List<Producto> listar(
      @RequestParam(required = false) String q,
      @RequestParam(required = false) String categoria,
      @RequestParam(required = false) String tipo,
      @RequestParam(required = false) String subcategoria,
      @RequestParam(defaultValue = "false") boolean stockBajo) {
    return productoService.listar(q, categoria, tipo, subcategoria, stockBajo);
  }

  @GetMapping("/categorias")
  public List<String> categorias() {
    return productoService.categorias();
  }

  @GetMapping("/tipos")
  public List<String> tipos() {
    return productoService.tipos();
  }

  @GetMapping("/{codigo}")
  public Producto obtener(@PathVariable String codigo) {
    return productoService.obtener(codigo);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Producto crear(@Valid @RequestBody ProductoRequest solicitud) {
    return productoService.crear(solicitud);
  }

  @PutMapping("/{codigo}")
  public Producto actualizar(
      @PathVariable String codigo, @Valid @RequestBody ProductoRequest solicitud) {
    return productoService.actualizar(codigo, solicitud);
  }

  @DeleteMapping("/{codigo}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void eliminar(@PathVariable String codigo) {
    productoService.eliminar(codigo);
  }
}
