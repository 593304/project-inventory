package hu.adam.project_inventory.controller;

import hu.adam.project_inventory.data.Project;
import hu.adam.project_inventory.data.WorkTime;
import hu.adam.project_inventory.data.dao.ProjectDao;
import hu.adam.project_inventory.data.dao.WorkTimeDao;
import hu.adam.project_inventory.form.EditWorktimeForm;
import hu.adam.project_inventory.form.WorktimeForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Optional;

@Controller
@RequestMapping("/worktimes")
public class WorktimeController {

    @Autowired
    private ProjectDao projectDao;
    @Autowired
    private WorkTimeDao workTimeDao;

    @PostMapping("")
    public String save(@ModelAttribute WorktimeForm worktimeForm) {

        store(worktimeForm);

        return "redirect:/";
    }

    @PostMapping("/edit")
    public String edit(@ModelAttribute EditWorktimeForm editWorktimeForm) {

        store(editWorktimeForm);

        return "redirect:/";
    }

    @PostMapping("/delete/{id}")
    public String delete(@PathVariable("id") long id) {

        workTimeDao.deleteById(id);

        return "redirect:/";
    }

    private void store(WorktimeForm worktimeForm) {
        Optional<Project> project = projectDao.findById(worktimeForm.getProject());
        WorkTime workTime;

        if(project.isPresent())
            workTime = worktimeForm.getWorktime(project.get());
        else
            workTime = worktimeForm.getWorktime(null);

        workTimeDao.save(workTime);
    }
}
