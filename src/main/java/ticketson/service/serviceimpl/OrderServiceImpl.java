package ticketson.service.serviceimpl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import ticketson.dao.*;
import ticketson.entity.*;
import ticketson.exception.InvalidRequestException;
import ticketson.exception.ResourceNotFoundException;
import ticketson.model.ConfirmOrderModel;
import ticketson.model.OrderModel;
import ticketson.model.SimpleOrderModel;
import ticketson.service.OrderService;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by shea on 2018/2/8.
 */
@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    OrderService orderService;

    private static final Logger logger = LoggerFactory.getLogger("OrderServiceImpl");


    /**
     * 获得订单
     *
     * @param oid
     * @return
     */
    @Override
    public OrderModel getOrder(long oid) {
        Order order = orderRepository.findOne(oid);
        if(order==null){
            throw new ResourceNotFoundException("此订单不存在");
        }
        return new OrderModel(order);
    }

    @Override
    public ConfirmOrderModel getConfirmOrder(long oid){
        Order order = orderRepository.findOne(oid);
        if(order==null){
            throw new InvalidRequestException("此订单不存在");
        }
        if(order.getPaySuccess()){
            throw new InvalidRequestException("订单已支付");
        }
        if(order.getIsCanceled()){
            throw new InvalidRequestException("超时支付，订单已自动取消");
        }
        return new ConfirmOrderModel(order);
    }



    /**
     * 获得会员订单
     * @param mid
     * @param page
     * @param pageNum
     * @param isUnSubscribed 是否退订
     * @return
     */
    @Override
    public List<SimpleOrderModel> getMyOrders(long mid, int page, int pageNum, boolean isUnSubscribed) {
        Pageable pageable = new PageRequest(page,pageNum, Sort.Direction.DESC,"orderDate");
        Page<Order> orderPage = orderRepository.findByMember_MidAndIsUnSubscribedAndPaySuccess(mid,isUnSubscribed,true,pageable);
        List<Order> orders = orderPage.getContent();
        List<SimpleOrderModel> orderModels = new ArrayList<>();
        for(Order order:orders){
            SimpleOrderModel orderModel = new SimpleOrderModel(order);
            orderModels.add(orderModel);
        }
        return orderModels;
    }

    /**
     * 获得我的订单总数
     *
     * @param mid
     * @param isUnSubscribed 是否退订
     * @return
     */
    @Override
    public int getOrderTotalNum(long mid, boolean isUnSubscribed) {
        int total = orderRepository.countByMember_MidAndIsUnSubscribed(mid,isUnSubscribed);
        return total;
    }

    @Override
    public int getOrderToPayTotalNum(Long mid) {
        int total = orderRepository.countByMember_MidAndIsUnSubscribedAndPaySuccessAndIsCanceled(mid,false,false,false);

        return total;
    }

    @Override
    public List<SimpleOrderModel> getOrdersToPay(Long mid, int page, int perPage) {
        Pageable pageable = new PageRequest(page,perPage,Sort.Direction.DESC,"orderDate");
        Page<Order> orderPage = orderRepository.findByMember_MidAndIsUnSubscribedAndPaySuccessAndIsCanceled(mid,false,false,false,pageable);
        List<Order> orders = orderPage.getContent();
        List<SimpleOrderModel> orderModels = new ArrayList<>();
        for(Order order:orders){
            SimpleOrderModel orderModel = new SimpleOrderModel(order);
            orderModels.add(orderModel);
        }
        return orderModels;
    }

    /**
     * 获得活动已预订的订单,按下单时间排序 ==
     *
     * @param aid
     * @param page
     * @param pageNum
     * @return
     */
    @Override
    public List<SimpleOrderModel> getOrdersByAid(Long aid, int page, int pageNum) {
        Pageable pageable = new PageRequest(page,pageNum, Sort.Direction.DESC,"orderDate");
        Page<Order> orderPage = orderRepository.findByPeriod_Activity_AidAndPaySuccess(aid,true,pageable);
        List<Order> orders = orderPage.getContent();
        List<SimpleOrderModel> orderModels = new ArrayList<>();
        for(Order order:orders){
            SimpleOrderModel orderModel = new SimpleOrderModel(order);
            orderModels.add(orderModel);
        }
        return orderModels;
    }

    /**
     * 获得活动的订单总数
     *
     * @param aid
     * @return
     */
    @Override
    public int getOrderTotalNumByAid(Long aid) {
        return orderRepository.countByPeriod_Activity_Aid(aid);
    }


    /**
     * 获得场次已预订的订单,按下单时间排序 ==
     *
     * @param pid
     * @param page
     * @param pageNum
     * @return
     */
    @Override
    public List<SimpleOrderModel> getOrdersByPid(Long pid, int page, int pageNum) {
        Pageable pageable = new PageRequest(page,pageNum, Sort.Direction.DESC,"orderDate");
        Page<Order> orderPage = orderRepository.findByPeriod_PidAndPaySuccess(pid,true,pageable);
        List<Order> orders = orderPage.getContent();
        List<SimpleOrderModel> orderModels = new ArrayList<>();
        for(Order order:orders){
            SimpleOrderModel orderModel = new SimpleOrderModel(order);
            orderModels.add(orderModel);
        }
        return orderModels;
    }

    /**
     * 获得活动的订单总数
     *
     * @param pid
     * @return
     */
    @Override
    public int getOrderTotalNumByPid(Long pid) {
        return orderRepository.countByPeriod_Pid(pid);
    }
}