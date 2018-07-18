package hu.adam.project_inventory.data.dao;

import hu.adam.project_inventory.data.Project;
import hu.adam.project_inventory.data.WorkTime;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface WorkTimeDao extends CrudRepository<WorkTime, Long>, JpaSpecificationExecutor<WorkTime> {
    List<WorkTime> findAllByOrderByStartDescProjectAsc();

    List<WorkTime> findAllByProjectOrderByStartDesc(Project project);
}
