package hu.adam.project_inventory.form;

public class CommentForm {

    private long noteId;
    private String comment;

    public CommentForm() {
    }

    public CommentForm(long noteId, String comment) {
        this.noteId = noteId;
        this.comment = comment;
    }

    public long getNoteId() {
        return noteId;
    }

    public void setNoteId(long noteId) {
        this.noteId = noteId;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
