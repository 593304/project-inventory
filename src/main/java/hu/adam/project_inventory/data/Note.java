package hu.adam.project_inventory.data;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "note")
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "note_id")
    private long id;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate date;
    @ElementCollection
    private List<String> comments;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @Transient
    @JsonIgnore
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public Note() {
        comments = new ArrayList<>();
    }

    public Note(LocalDate date, List<String> comments, Project project) {
        this.date = date;
        this.comments = comments;
        this.project = project;
    }

    public Note(String date, Project project) {
        this.date = LocalDate.parse(date, formatter);
        this.comments = new ArrayList<>();
        this.project = project;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    @JsonIgnore
    public String getDateAsString() {
        return date.format(formatter);
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public List<String> getComments() {
        return comments;
    }

    public void setComments(List<String> comments) {
        this.comments = comments;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    @Override
    public String toString() {
        return "Note{" +
                "id=" + id +
                ", date=" + date.format(formatter) +
                ", comments=" + comments +
                ", project=" + project +
                '}';
    }
}