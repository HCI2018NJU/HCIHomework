package ticketson.controller;

import com.alibaba.fastjson.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import ticketson.model.ConfirmOrderModel;
import ticketson.model.OrderModel;
import ticketson.model.SimpleOrderModel;
import ticketson.model.UnsubscribeModel;
import ticketson.service.OrderService;
import ticketson.service.SubscribeService;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by shea on 2018/2/22.
 * 订单的获取
 */
@RestController
@RequestMapping(value = "/api/order", produces = "application/json;charset=UTF-8")
public class OrderController {
    @Autowired
    OrderService orderService;
    @Autowired
    SubscribeService subscribeService;

    private static final Logger logger = LoggerFactory.getLogger("OrderController");


    /**
     * 获得订单详情 ==
     * @param oid
     * @return
     */
    @PostMapping("/getOrder")
    public @ResponseBody OrderModel getOrder(Long oid){
        return orderService.getOrder(Integer.MAX_VALUE-oid);
    }

    /**
     * 获得订单（订单里的级联信息都要填满）==
     * @param oid
     * @return
     */
    @PostMapping("/getConfirmOrder")
    public @ResponseBody ConfirmOrderModel getConfirmOrder(Long oid) {
//        ConfirmOrderModel confirmOrderModel = orderService.getComfirmOrder(oid);
//        System.out.println(confirmOrderModel.toString());
//        subscribeService.judgeIscanceled(oid);
        return orderService.getConfirmOrder(oid);
    }


    /**
     * 获得会员的订单,其中过滤掉超时取消的订单,按时间排序 ==
     * @param mid 会员ID
     * @return
     */
    @PostMapping("/getMyOrders")
    public @ResponseBody List<SimpleOrderModel> getMyOrders(Long mid, int page, int pageNum, boolean isUnSubscribed){
        //在order数据表中返回此我的订单
        System.out.println(mid+"  "+page+"  "+pageNum+"  "+isUnSubscribed);
        return orderService.getMyOrders(mid,page,pageNum,isUnSubscribed);
    }

    /**
     * 获得我的订单总数 ==
     * @param mid
     * @return
     */
    @PostMapping("/getOrderTotalNum")
    public int getOrderTotalNum(Long mid,boolean isUnSubscribed){
        System.out.println("getOrderTotalNum");
        return orderService.getOrderTotalNum(mid,isUnSubscribed);
    }

    @PostMapping("getOrderToPayTotalNum")
    public int getOrderToPayTotalNum(Long mid){
        return orderService.getOrderToPayTotalNum(mid);
    }

    @PostMapping("/getOrdersToPay")
    public List<SimpleOrderModel> getOrdersToPay(Long mid,int page,int perPage){
        return orderService.getOrdersToPay(mid,page,perPage);
    }

    /**
     * 获得活动某场次已预订的订单,按下单时间排序 ==
     * @param id 活动ID
     * @return
     */
    @PostMapping("/getOrdersByPeriod")
    public @ResponseBody List<SimpleOrderModel> getOrdersByPeriod(Long id,String periodType, int page, int pageNum){
        //在order数据表中返回此我的订单
        System.out.println(id+"  "+page+"  "+pageNum+"  ");
        if(periodType.equals("all")){
            return orderService.getOrdersByAid(id,page,pageNum);
        }else if(periodType.equals("single")){
            return orderService.getOrdersByPid(id,page,pageNum);
        }else {
            return new ArrayList<>();
        }
    }

    /**
     * 获得活动某场次的订单总数 ==
     * @param id
     * @return
     */
    @PostMapping("/getOrderTotalNumByPeriod")
    public int getOrderTotalNumByPeriod(Long id,String periodType){
        System.out.println("getOrderTotalNumByAid");
        if(periodType.equals("all")){
            return orderService.getOrderTotalNumByAid(id);
        }else if(periodType.equals("single")){
            return orderService.getOrderTotalNumByPid(id);
        }else {
            return 0;
        }

    }
}
