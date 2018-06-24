package hu.adam.project_inventory.data.dao;

import hu.adam.project_inventory.data.Note;
import hu.adam.project_inventory.data.Project;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface NoteDao extends CrudRepository<Note, Long>, JpaSpecificationExecutor<Note> {
    List<Note> findAllByOrderByDateDesc();

    List<Note> findAllByProject(Project project);
}
