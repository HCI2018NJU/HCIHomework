package ticketson.service;

import ticketson.entity.Order;
import ticketson.model.UnsubscribeModel;

import java.util.List;

/**
 * Created by shea on 2018/3/13.
 */
public interface SubscribeService {
    public void allocateTickets();

    /**
     * 将该order类型改为已退订（todo ticket要不要做什么处理）
     * @param oid 订单编号
     * @return
     */
    public UnsubscribeModel unsubscribe(long oid);
    /**
     * 用户立即购买，下订单
     * @return
     */
    public long immediatePurchase(long mid, long pid,Integer totalAmount,Integer level,String prices,float totalPrice);


    /**
     * 用户选座购买，下订单
     * @return
     */
    public long seatPurchase(List layoutSids,Long mid,Long pid,Integer totalAmount,String prices,float totalPrice);

    /**
     * 线下购买，只要把相应的座位设为不可售，把钱化给场馆，在activity表中记录线下营业额，并不生成订单
     * @param layoutSids
     * @param pid
     */
    public float offlinePurchase(List layoutSids,String email,Long pid,Integer totalAmount,String prices,float totalPrice);

    /**
     * 支付订单
     * @param oid
     * @param cid
     * @param payPrice
     * @param bankType
     * @param bid
     * @param bankPsw
     */
    public void pay(long mid,long oid,Long cid,float payPrice,String bankType,long bid,String bankPsw,String couponName,float discount);

    /**
     * 在ticket表中找寻此tid的记录，设为已检票。
     * @param tid 活动对应的座位号
     * @return 检票成功与否
     */
    public void checkIn(long tid);

    /**
     * 获得指定场次和等级的剩余票数
     * @param pid
     * @param level
     * @return
     */
    public int getSeatsLeftCount(long pid,int level);

    /**
     * 在seat数据表中找寻此vid和layout_sid的记录，判断是否可售，并返回
     * @param pid 活动时间段的id
     * @param layoutSid 座位的物理ID
     * @return 是否可售
     */
    public boolean isAvailable(long pid,int layoutSid);


}
