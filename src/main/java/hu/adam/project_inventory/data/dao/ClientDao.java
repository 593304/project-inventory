package hu.adam.project_inventory.data.dao;

import hu.adam.project_inventory.data.Client;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface ClientDao extends CrudRepository<Client, Long>, JpaSpecificationExecutor<Client> {
    List<Client> findAllBy();
}
