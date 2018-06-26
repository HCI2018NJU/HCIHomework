package ticketson.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ticketson.entity.Order;

import java.util.List;

/**
 * Created by shea on 2018/2/9.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order,Long> {

    Page<Order> findByMember_MidAndIsUnSubscribedAndPaySuccess(long mid, boolean isUnSubscribed, boolean paySuccess,Pageable pageable);

    List<Order> findByMember_MidAndIsUnSubscribedAndPaySuccessAndOrderDateGreaterThanEqualAndOrderDateLessThanEqualOrderByPayPriceDesc(long mid,boolean isUnsubscribed,boolean paySuccess,long begin,long end);

    int countByMember_MidAndIsUnSubscribedAndPaySuccessAndOrderDateGreaterThanEqualAndOrderDateLessThanEqual(long mid,boolean isUnsubscribed,boolean paySuccess,long begin,long end);

    List<Order> findByPeriod_Activity_Venue_VidAndIsUnSubscribedAndPaySuccessAndOrderDateGreaterThanEqualAndOrderDateLessThanEqual(String vid,boolean isUnsubscribed,boolean paySuccess,long begin,long end);

    int countByPeriod_Activity_Venue_VidAndIsUnSubscribedAndPaySuccessAndOrderDateGreaterThanEqualAndOrderDateLessThanEqual(String vid,boolean isUnsubscribed,boolean paySuccess,long begin,long end);

    List<Order> findByIsUnSubscribedAndPaySuccessAndOrderDateGreaterThanEqualAndOrderDateLessThanEqual(boolean isUnsubscribed,boolean paySuccess,long begin,long end);

    Page<Order> findByPeriod_Activity_AidAndPaySuccess(long aid,boolean paySuccess,Pageable pageable);

    Page<Order> findByPeriod_PidAndPaySuccess(long pid,boolean paySuccess,Pageable pageable);

    int countByMember_MidAndIsUnSubscribedAndPaySuccess(long mid,boolean isUnSubscribed,boolean paySuccess);


    //得到未支付的订单所用
    int countByMember_MidAndIsUnSubscribedAndPaySuccessAndIsCanceled(long mid,boolean isUnsubscribed,boolean paySuccess,boolean isCanceled);
    Page<Order> findByMember_MidAndIsUnSubscribedAndPaySuccessAndIsCanceled(long mid,boolean isUnsubscribed,boolean paySuccess,boolean isCanceled,Pageable pageable);



    int countByPeriod_Activity_Aid(long aid);

    int countByPeriod_Pid(long pid);

    //配票所用
    List<Order> findByIsUnSubscribedAndIsImmediatePurchaseAndPaySuccessAndIsAllocatedAndPeriod_BeginLessThanEqual(boolean isUnsubscribed,boolean isImmediatePurchase,boolean paySuccess,boolean isAllocated,long allocateDate);

    //超时取消所用
    List<Order> findByIsUnSubscribedAndPaySuccessAndIsCanceledAndOrderDateLessThan(boolean isUnsubscribed,boolean paySuccess,boolean isCanceled,long time);

//    List<Order> findByIsUnSubscribedAndIsImmediatePurchaseAndPaySuccessAndIsAllocated(boolean isUnsubscribed,boolean isImmediatePurchase,boolean paySuccess,boolean isAllocated);
}
