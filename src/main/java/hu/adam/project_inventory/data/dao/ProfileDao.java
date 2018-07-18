package hu.adam.project_inventory.data.dao;

import hu.adam.project_inventory.data.Profile;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface ProfileDao extends CrudRepository<Profile, Long> {
    List<Profile> findAll();
}
