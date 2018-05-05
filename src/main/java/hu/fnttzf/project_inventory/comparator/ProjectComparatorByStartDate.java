package hu.fnttzf.project_inventory.comparator;

import hu.fnttzf.project_inventory.data.Project;
import hu.fnttzf.project_inventory.data.WorkTime;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class ProjectComparatorByStartDate implements Comparator<Project> {

    @Override
    public int compare(Project p1, Project p2) {
        List<WorkTime> w1s = p1.getWorkTimes();
        List<WorkTime> w2s = p2.getWorkTimes();

        WorkTime w1 = null;
        WorkTime w2 = null;

        if(!w1s.isEmpty()) {
            w1s.sort(new WorkTimeComparatorByStartDate());
            w1 = w1s.get(w1s.size() - 1);
        }

        if(!w2s.isEmpty()) {
            w2s.sort(new WorkTimeComparatorByStartDate());
            w2 = w2s.get(w2s.size() - 1);
        }

        if(w1 == null && w2 == null)
            return p1.getName().compareTo(p2.getName());
        else if(w1 != null && w2 == null)
            return -1;
        else if(w1 == null && w2 != null)
            return 1;

        return w1.getStart().compareTo(w2.getStart());
    }
}
