package hu.adam.project_inventory.data;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "work_time")
public class WorkTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "work_time_id")
    private long id;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime start;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime end;
    private String description;
    private boolean exported;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @Transient
    @JsonIgnore
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public WorkTime() {
    }

    public WorkTime(LocalDateTime start, LocalDateTime end, String description, boolean exported, Project project) {
        this.start = start;
        this.end = end;
        this.exported = exported;
        this.description = description;
        this.project = project;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public LocalDateTime getStart() {
        return start;
    }

    @JsonIgnore
    public String getStartAsString() {
        return start.format(formatter);
    }

    public void setStart(LocalDateTime start) {
        this.start = start;
    }

    public LocalDateTime getEnd() {
        return end;
    }

    @JsonIgnore
    public String getEndAsString() {
        return end.format(formatter);
    }

    public void setEnd(LocalDateTime end) {
        this.end = end;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isExported() {
        return exported;
    }

    public void setExported(boolean exported) {
        this.exported = exported;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    @Override
    public String toString() {
        return "WorkTime{" +
                "id=" + id +
                ", start=" + start.format(formatter) +
                ", end=" + end.format(formatter) +
                ", exported=" + exported +
                ", project=" + project +
                '}';
    }
}
