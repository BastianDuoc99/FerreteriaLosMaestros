package cl.dsy1104.ferreteria.repository;

import cl.dsy1104.ferreteria.entity.Producto;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductoRepository extends JpaRepository<Producto, String> {

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select p from Producto p where p.codigo = :codigo")
  Optional<Producto> findByCodigoForUpdate(@Param("codigo") String codigo);

  @Query(
      "select p from Producto p where "
          + "(:q is null or lower(p.nombre) like lower(concat('%', :q, '%')) "
          + "or lower(p.marca) like lower(concat('%', :q, '%')) "
          + "or lower(p.codigo) like lower(concat('%', :q, '%'))) and "
          + "(:categoria is null or p.categoria = :categoria) and "
          + "(:tipo is null or p.tipo = :tipo) and "
          + "(:subcategoria is null or p.subcategoria = :subcategoria) and "
          + "(:stockBajo = false or p.stock <= p.stockMinimo) "
          + "order by p.codigo")
  List<Producto> buscar(
      @Param("q") String q,
      @Param("categoria") String categoria,
      @Param("tipo") String tipo,
      @Param("subcategoria") String subcategoria,
      @Param("stockBajo") boolean stockBajo);

  @Query("select distinct p.categoria from Producto p order by p.categoria")
  List<String> findCategorias();

  @Query("select distinct p.tipo from Producto p order by p.tipo")
  List<String> findTipos();
}
