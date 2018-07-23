package hu.adam.project_inventory.data.dao;

import hu.adam.project_inventory.data.Project;
import hu.adam.project_inventory.data.Worktime;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Transactional
public interface WorktimeDao extends CrudRepository<Worktime, Long>, JpaSpecificationExecutor<Worktime> {
    List<Worktime> findAllByOrderByStartDescProjectAsc();

    List<Worktime> findAllByProjectOrderByStartDesc(Project project);

    List<Worktime> findAllByStartGreaterThanEqualAndEndLessThanEqual(LocalDateTime start, LocalDateTime end);
}
