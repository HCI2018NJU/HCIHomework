package ticketson.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ticketson.entity.Coupon;

/**
 * Created by shea on 2018/3/12.
 */
@Repository
public interface CouponRepository extends JpaRepository<Coupon,Long> {

    //寻找已经使用的优惠券
    Page<Coupon> findByMember_MidAndConsumeTimeIsNotNull(long mid, Pageable pageable);

    //寻找已经使用的优惠券数目
    int countByMember_MidAndConsumeTimeIsNotNull(long mid);

    /**
     * 寻找未使用且未过期的优惠券
     */
    Page<Coupon> findByMember_MidAndValidDateEndGreaterThanAndConsumeTimeIsNull(long mid, long date, Pageable pageable);

    /**
     * 寻找未使用且未过期的优惠券数目
     * @param mid
     * @param date
     * @return
     */
    int countByMember_MidAndValidDateEndGreaterThanAndConsumeTimeIsNull(long mid, long date);

    /**
     * 寻找未使用但已过期的优惠券
     * @param mid
     * @param date
     * @return
     */
    Page<Coupon> findByMember_MidAndValidDateEndLessThanEqualAndConsumeTimeIsNull(long mid,long date,Pageable pageable);


    /**
     * 寻找未使用但已过期的优惠券数目
     * @param mid
     * @param date
     * @return
     */
    int countByMember_MidAndValidDateEndLessThanEqualAndConsumeTimeIsNull(long mid,long date);


}
