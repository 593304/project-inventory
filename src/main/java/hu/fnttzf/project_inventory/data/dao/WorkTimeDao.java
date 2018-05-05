package hu.fnttzf.project_inventory.data.dao;

import hu.fnttzf.project_inventory.data.WorkTime;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface WorkTimeDao extends CrudRepository<WorkTime, Long>, JpaSpecificationExecutor<WorkTime> {
}
