package hu.adam.project_inventory.comparator;

import hu.adam.project_inventory.data.WorkTime;

import java.util.Comparator;

public class WorkTimeComparatorByStartDate implements Comparator<WorkTime> {

    @Override
    public int compare(WorkTime o1, WorkTime o2) {
        return o1.getStart().compareTo(o2.getStart());
    }
}
