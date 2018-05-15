package ticketson.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ticketson.entity.VenueModify;

/**
 * Created by shea on 2018/2/7.
 */
@Repository
public interface VenueModifyRepository extends JpaRepository<VenueModify,String> {
    Page<VenueModify> findByChecked(boolean checked, Pageable pageable);
    int countByChecked(boolean checked);
}
