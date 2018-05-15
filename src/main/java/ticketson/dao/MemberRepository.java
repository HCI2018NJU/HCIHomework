package ticketson.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ticketson.entity.Member;

import java.util.List;

/**
 * Created by shea on 2018/2/9.
 */
@Repository
public interface MemberRepository extends JpaRepository<Member,Long> {
    Member findByEmail(String email);

    List<Member> findByRegisterTimeGreaterThanEqualAndRegisterTimeLessThanEqual(long begin,long end);
}
