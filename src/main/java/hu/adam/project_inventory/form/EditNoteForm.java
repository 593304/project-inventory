package hu.adam.project_inventory.form;

import hu.adam.project_inventory.data.Note;
import hu.adam.project_inventory.data.Project;

import java.util.Date;

public class EditNoteForm extends NoteForm {

    private long id;

    public EditNoteForm() {
    }

    public EditNoteForm(String date, long project, long id) {
        super(date, project);
        this.id = id;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    @Override
    public Note getNote(Project project) {
        Note note = super.getNote(project);
        note.setId(id);

        return note;
    }
}
