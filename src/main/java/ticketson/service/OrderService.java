package ticketson.service;

import ticketson.model.ConfirmOrderModel;
import ticketson.model.OrderModel;
import ticketson.model.SimpleOrderModel;

import java.util.List;

/**
 * Created by shea on 2018/2/8.
 */
public interface OrderService {

    /**
     * 获得订单
     * @param oid
     * @return
     */
    public OrderModel getOrder(long oid);

    public ConfirmOrderModel getConfirmOrder(long oid);



    /**
     * 获得会员订单
     * @param mid
     * @param page
     * @param pageNum
     * @param isUnSubscribed
     * @return
     */
    public List<SimpleOrderModel> getMyOrders(long mid, int page, int pageNum, boolean isUnSubscribed);

    /**
     * 获得我的订单总数
     * @param mid
     * @param isUnSubscribed
     * @return
     */
    public int getOrderTotalNum(long mid, boolean isUnSubscribed);

    public int getOrderToPayTotalNum(Long mid);

    public List<SimpleOrderModel> getOrdersToPay(Long mid,int page,int perPage);

    /**
     * 获得活动已预订的订单,按下单时间排序 ==
     * @param aid
     * @param page
     * @param pageNum
     * @return
     */
    public List<SimpleOrderModel> getOrdersByAid(Long aid, int page, int pageNum);

    /**
     * 获得活动的订单总数
     * @param aid
     * @return
     */
    public int getOrderTotalNumByAid(Long aid);

    /**
     * 获得场次已预订的订单,按下单时间排序 ==
     *
     * @param pid
     * @param page
     * @param pageNum
     * @return
     */
    public List<SimpleOrderModel> getOrdersByPid(Long pid, int page, int pageNum);

    /**
     * 获得活动的订单总数
     *
     * @param pid
     * @return
     */
    public int getOrderTotalNumByPid(Long pid);




}
