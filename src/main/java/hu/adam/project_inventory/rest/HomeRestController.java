package hu.adam.project_inventory.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/home")
public class HomeRestController {

    private static final DateTimeFormatter formatterDate = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter formatterDateTime = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    @GetMapping("/now/date")
    public String date() {
        return LocalDate.now().format(formatterDate);
    }

    @GetMapping("/now/datetime/{plus-hours}")
    public String dateTime(@PathVariable("plus-hours") long plusHours) {
        return LocalDateTime.now().plusHours(plusHours).format(formatterDateTime);
    }

    @GetMapping("/now/datetime/{start-datetime}/{plus-hours}")
    public String dateTime(@PathVariable("start-datetime") String startDatetime, @PathVariable("plus-hours") long plusHours) {
        return LocalDateTime.parse(startDatetime, formatterDateTime).plusHours(plusHours).format(formatterDateTime);
    }
}
