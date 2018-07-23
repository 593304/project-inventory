package hu.adam.project_inventory.controller;

import hu.adam.project_inventory.data.Project;
import hu.adam.project_inventory.data.Worktime;
import hu.adam.project_inventory.data.dao.ProjectDao;
import hu.adam.project_inventory.data.dao.WorktimeDao;
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
    private WorktimeDao worktimeDao;

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

        worktimeDao.deleteById(id);

        return "redirect:/";
    }

    private void store(WorktimeForm worktimeForm) {
        Optional<Project> project = projectDao.findById(worktimeForm.getProject());
        Worktime worktime;

        if(project.isPresent())
            worktime = worktimeForm.getWorktime(project.get());
        else
            worktime = worktimeForm.getWorktime(null);

        worktimeDao.save(worktime);
    }
}
