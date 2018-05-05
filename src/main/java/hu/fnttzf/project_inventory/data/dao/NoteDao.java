package hu.fnttzf.project_inventory.data.dao;

import hu.fnttzf.project_inventory.data.Note;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface NoteDao extends CrudRepository<Note, Long>, JpaSpecificationExecutor<Note> {
}
