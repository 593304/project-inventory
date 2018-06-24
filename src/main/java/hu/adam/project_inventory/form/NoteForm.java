package hu.adam.project_inventory.form;

import hu.adam.project_inventory.data.Note;
import hu.adam.project_inventory.data.Project;

import java.util.Date;

public class NoteForm {

    private String date;
    private long project;

    public NoteForm() {
    }

    public NoteForm(String date, long project) {
        this.date = date;
        this.project = project;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public long getProject() {
        return project;
    }

    public void setProject(long project) {
        this.project = project;
    }

    public Note getNote(Project project) {
        return new Note(date, project);
    }
}
