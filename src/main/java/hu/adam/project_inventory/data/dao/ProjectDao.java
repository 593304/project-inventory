package hu.adam.project_inventory.data.dao;

import hu.adam.project_inventory.data.Client;
import hu.adam.project_inventory.data.Project;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface ProjectDao extends CrudRepository<Project, Long>, JpaSpecificationExecutor<Project> {
    List<Project> findAllBy();
    List<Project> findAllByClient(Client client);
}
