package hu.adam.project_inventory.rest;

import hu.adam.project_inventory.data.Project;
import hu.adam.project_inventory.data.WorkTime;
import hu.adam.project_inventory.data.dao.ProjectDao;
import hu.adam.project_inventory.data.dao.WorkTimeDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/worktimes")
public class WorktimeRestController {

    @Autowired
    private ProjectDao projectDao;
    @Autowired
    private WorkTimeDao workTimeDao;

    @GetMapping("/list/{project_id}")
    public List<WorkTime> list(@PathVariable("project_id") long projectId) {
        Optional<Project> project = projectDao.findById(projectId);

        if(project.isPresent())
            return workTimeDao.findAllByProjectOrderByStartDesc(project.get());
        else
            return new ArrayList<>();
    }
}
