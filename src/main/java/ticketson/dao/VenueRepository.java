package ticketson.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ticketson.entity.Venue;

import java.util.List;

/**
 * Created by shea on 2018/2/6.
 */
@Repository
public interface VenueRepository extends JpaRepository<Venue,String> {
    Page<Venue> findByChecked(boolean checked, Pageable pageable);
    int countByChecked(boolean checked);

    int countByCheckedAndCheckPassedAndRegisterTimeGreaterThanEqualAndRegisterTimeLessThanEqual(boolean checked,boolean checkPassed,long begin,long end);
}
