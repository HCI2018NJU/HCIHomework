package ticketson.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ticketson.entity.Activity;
import ticketson.entity.Venue;

import java.util.List;

/**
 * Created by shea on 2018/2/7.
 */
@Repository
public interface ActivityRepository extends JpaRepository<Activity,Long> {
    /**
     * 寻找正在售票的活动
     * @param now
     * @param pageable
     * @return
     */
    Page<Activity> findByEndSellGreaterThan(long now,Pageable pageable);
    Page<Activity> findByEndSellGreaterThanAndEndSellLessThanEqual(long now,long time,Pageable pageable);
    Page<Activity> findByFatherTypeAndEndSellGreaterThan(String fatherType,long now,Pageable pageable);
    Page<Activity> findByFatherTypeAndEndSellGreaterThanAndEndSellLessThanEqual(String fatherType,long now,long time,Pageable pageable);
    Page<Activity> findByTypeAndEndSellGreaterThan(String type,long now,Pageable pageable);
    Page<Activity> findByTypeAndEndSellGreaterThanAndEndSellLessThanEqual(String type,long now,long time,Pageable pageable);

    Page<Activity> findByCityCodeAndEndSellGreaterThan(int cityCode,long now,Pageable pageable);
    Page<Activity> findByCityCodeAndEndSellGreaterThanAndEndSellLessThanEqual(int cityCode,long now,long time,Pageable pageable);
    Page<Activity> findByCityCodeAndFatherTypeAndEndSellGreaterThan(int cityCode,String fatherType,long now,Pageable pageable);
    Page<Activity> findByCityCodeAndFatherTypeAndEndSellGreaterThanAndEndSellLessThanEqual(int cityCode,String fatherType,long now,long time,Pageable pageable);
    Page<Activity> findByCityCodeAndTypeAndEndSellGreaterThan(int cityCode,String type,long now,Pageable pageable);
    Page<Activity> findByCityCodeAndTypeAndEndSellGreaterThanAndEndSellLessThanEqual(int cityCode,String type,long now,long time,Pageable pageable);

    /**
     * 寻找正在售票的活动数目
     * @param now
     * @return
     */
    int countByEndSellGreaterThan(long now);
    int countByEndSellGreaterThanAndEndSellLessThanEqual(long now,long time);
    int countByFatherTypeAndEndSellGreaterThan(String fatherType,long now);
    int countByFatherTypeAndEndSellGreaterThanAndEndSellLessThanEqual(String fatherType,long now,long time);
    int countByTypeAndEndSellGreaterThan(String type,long now);
    int countByTypeAndEndSellGreaterThanAndEndSellLessThanEqual(String type,long now,long time);

    int countByCityCodeAndEndSellGreaterThan(int cityCode,long now);
    int countByCityCodeAndEndSellGreaterThanAndEndSellLessThanEqual(int cityCode,long now,long time);
    int countByCityCodeAndFatherTypeAndEndSellGreaterThan(int cityCode,String fatherType,long now);
    int countByCityCodeAndFatherTypeAndEndSellGreaterThanAndEndSellLessThanEqual(int cityCode,String fatherType,long now,long time);
    int countByCityCodeAndTypeAndEndSellGreaterThan(int cityCode,String type,long now);
    int countByCityCodeAndTypeAndEndSellGreaterThanAndEndSellLessThanEqual(int cityCode,String type,long now,long time);


    List<Activity> findAll();

    /**
     * 寻找尚未开始的活动
     * @param vid
     * @param now
     * @param pageable
     * @return
     */
    Page<Activity> findByVenue_VidAndBeginGreaterThan(String vid,long now,Pageable pageable);

    int countByVenue_VidAndBeginGreaterThan(String vid,long now);

    /**
     * 寻找正在进行的活动
     * @param vid
     * @param beginGreater
     * @param endLess
     * @param pageable
     * @return
     */
    Page<Activity> findByVenue_VidAndBeginLessThanEqualAndEndGreaterThanEqual(String vid,long beginGreater,long endLess,Pageable pageable);
    Page<Activity> findByVenue_VidAndBeginLessThanAndEndGreaterThan(String vid,long beginGreater,long endLess,Pageable pageable);
    Page<Activity> findByVenue_VidAndBeginLessThan(String vid,long now,Pageable pageable);
    Page<Activity> findByVenue_VidAndEndGreaterThan(String vid,long now,Pageable pageable);

    int countByVenue_VidAndBeginLessThanEqualAndEndGreaterThanEqual(String vid,long beginGreater,long endLess );

    /**
     * 寻找已经结束的活动
     * @param vid
     * @param now
     * @param pageable
     * @return
     */
    Page<Activity> findByVenue_VidAndEndLessThan(String vid,long now,Pageable pageable);

    int countByVenue_VidAndEndLessThan(String vid,long now);


    Page<Activity> findByTurnoverSettledAndEndSellLessThan(boolean turnoverSettled,long now,Pageable pageable);

    int countByTurnoverSettled(boolean turnoverSettled);


    List<Activity> findByTurnoverSettled(boolean turnoverSettled);

    List<Activity> findByVenue_VidAndEndSellGreaterThanEqual(String vid,long begin);

    int countByVenue_Vid(String vid);
    Page<Activity> findByVenue_Vid(String vid,Pageable pageable);

}
