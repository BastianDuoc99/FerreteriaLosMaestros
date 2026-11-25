package cl.dsy1104.ferreteria.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "productos")
public class Producto {

  @Id
  @Column(name = "codigo", nullable = false, length = 20)
  private String codigo;

  @Column(name = "categoria", nullable = false, length = 120)
  private String categoria;

  @Column(name = "subcategoria", length = 120)
  private String subcategoria;

  @Column(name = "nombre", nullable = false, length = 200)
  private String nombre;

  @Column(name = "marca", length = 100)
  private String marca;

  @Column(name = "unidad", length = 50)
  private String unidad;

  @Column(name = "precio_compra", nullable = false, precision = 12, scale = 2)
  private BigDecimal precioCompra;

  @Column(name = "precio", nullable = false, precision = 12, scale = 2)
  private BigDecimal precio;

  @Column(name = "stock", nullable = false)
  private int stock;

  @Column(name = "stock_minimo", nullable = false)
  private int stockMinimo;

  @Column(name = "descripcion", length = 1000)
  private String descripcion;

  @Column(name = "imagen", length = 255)
  private String imagen;

  @Column(name = "tipo", length = 80)
  private String tipo;

  public String getCodigo() {
    return codigo;
  }

  public void setCodigo(String codigo) {
    this.codigo = codigo;
  }

  public String getCategoria() {
    return categoria;
  }

  public void setCategoria(String categoria) {
    this.categoria = categoria;
  }

  public String getSubcategoria() {
    return subcategoria;
  }

  public void setSubcategoria(String subcategoria) {
    this.subcategoria = subcategoria;
  }

  public String getNombre() {
    return nombre;
  }

  public void setNombre(String nombre) {
    this.nombre = nombre;
  }

  public String getMarca() {
    return marca;
  }

  public void setMarca(String marca) {
    this.marca = marca;
  }

  public String getUnidad() {
    return unidad;
  }

  public void setUnidad(String unidad) {
    this.unidad = unidad;
  }

  public BigDecimal getPrecioCompra() {
    return precioCompra;
  }

  public void setPrecioCompra(BigDecimal precioCompra) {
    this.precioCompra = precioCompra;
  }

  public BigDecimal getPrecio() {
    return precio;
  }

  public void setPrecio(BigDecimal precio) {
    this.precio = precio;
  }

  public int getStock() {
    return stock;
  }

  public void setStock(int stock) {
    this.stock = stock;
  }

  public int getStockMinimo() {
    return stockMinimo;
  }

  public void setStockMinimo(int stockMinimo) {
    this.stockMinimo = stockMinimo;
  }

  public String getDescripcion() {
    return descripcion;
  }

  public void setDescripcion(String descripcion) {
    this.descripcion = descripcion;
  }

  public String getImagen() {
    return imagen;
  }

  public void setImagen(String imagen) {
    this.imagen = imagen;
  }

  public String getTipo() {
    return tipo;
  }

  public void setTipo(String tipo) {
    this.tipo = tipo;
  }
}
