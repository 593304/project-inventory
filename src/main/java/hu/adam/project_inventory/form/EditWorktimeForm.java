package hu.adam.project_inventory.form;

import hu.adam.project_inventory.data.Project;
import hu.adam.project_inventory.data.Worktime;

import java.time.LocalDate;
import java.time.LocalTime;

public class EditWorktimeForm extends WorktimeForm {

    private long id;

    public EditWorktimeForm() {
    }

    public EditWorktimeForm(LocalDate startDate, LocalTime startTime, LocalDate endDate, LocalTime endTime, String description, long project, long id) {
        super(startDate, startTime, endDate, endTime, description, project);
        this.id = id;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    @Override
    public Worktime getWorktime(Project project) {
        Worktime worktime = super.getWorktime(project);
        worktime.setId(id);

        return worktime;
    }
}
