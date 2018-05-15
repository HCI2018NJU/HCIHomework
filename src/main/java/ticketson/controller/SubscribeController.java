package ticketson.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import ticketson.entity.Order;
import ticketson.model.UnsubscribeModel;
import ticketson.service.SubscribeService;
import ticketson.util.ResultHelper;

import java.util.List;

/**
 * Created by shea on 2018/3/13.
 *  处理购票、票务的逻辑
 */
@RestController
@RequestMapping(value = "/api/subscribe", produces = "application/json;charset=UTF-8")
public class SubscribeController {
    private static final Logger logger = LoggerFactory.getLogger("OrderController");
    @Autowired
    SubscribeService subscribeService;

    /**
     * 用户立即购买,下订单 ==
     * @return
     */
    @PostMapping("/immediatePurchase")
    public long immediatePurchase(Long mid, Long pid,Integer totalAmount,Integer level,String prices,float totalPrice){
        return subscribeService.immediatePurchase(mid,pid,totalAmount,level,prices,totalPrice);
    }

    /**
     * 用户选座购买，下订单 ==
     * @return
     */
    @PostMapping("/seatPurchase")
    public long seatPurchase(String layoutSids,Long mid,Long pid,Integer totalAmount,String prices,float totalPrice){
        List list = JSON.parseArray(layoutSids);
        return subscribeService.seatPurchase(list,mid,pid,totalAmount,prices,totalPrice);
    }

    /**
     * 线下购票
     * @param layoutSids
     * @param pid
     * @param totalAmount
     * @param totalPrice
     */
    @PostMapping("/offlinePurchase")
    public float offlinePurchase(String layoutSids,String email,Long pid,Integer totalAmount,String prices,float totalPrice){
        System.out.println(layoutSids);
        List list = JSON.parseArray(layoutSids);
        return subscribeService.offlinePurchase(list,email,pid,totalAmount,prices,totalPrice);
    }

    /**
     * 支付订单 ==
     * @param oid
     * @param cid
     * @param payPrice
     * @param bankType
     * @param bid
     * @param bankPsw
     * @return
     */
    @PostMapping("/pay")
    public void pay(long mid, long oid,Long cid,float payPrice,String bankType,long bid,String bankPsw,String couponName,float discount){
        subscribeService.pay(mid,oid,cid,payPrice,bankType,bid,bankPsw,couponName,discount);
    }

    /**
     * 检票
     * @param tid 活动对应的座位号
     * @return 检票成功与否
     */
    @PostMapping("/checkIn")
    public void checkIn(long tid){
        //在ticket表中找寻此tid的记录，设为已检票。如果没有此记录或已经检票，则返回error
        subscribeService.checkIn(tid);
    }

    /**
     * 获得该场次和等级的剩余张数 ==
     * @param pid
     * @param level
     * @return
     */
    @PostMapping("/getSeatsLeftCount")
    public int getSeatsLeftCount(long pid,int level){
        return subscribeService.getSeatsLeftCount(pid,level);
    }


    /**
     * 在某个活动时间段下一个区域的每一个座位是否可售 ==
     * @param pid 场馆ID
     * @param layout_sids 座位的物理ID数组
     * @return
     */
    @PostMapping("/isAllAvailable")
    public @ResponseBody String isAllAvailable(long pid,String layout_sids){
        List jsons = JSONArray.parseArray(layout_sids);
        JSONObject jsonObject = new JSONObject();
        for (Object json:jsons){
            int layout_sid = Integer.parseInt(json.toString());
            boolean isAvailable = subscribeService.isAvailable(pid,layout_sid);
            jsonObject.put(json.toString(),isAvailable);
        }
        return JSON.toJSONString(jsonObject);
    }

    /**
     * 在某个活动时间段下某个座位是否可售 ==
     * @param pid 场馆ID
     * @param layout_sid 座位的物理ID
     * @return 是否可售
     */
    @PostMapping("/isAvailable")
    public boolean isAvailable(long pid,int layout_sid){
        //在seat数据表中找寻此vid和layout_sid的记录，判断是否可售，并返回。
        return subscribeService.isAvailable(pid,layout_sid);
    }

    /**
     * 会员退订
     * @param oid 订单编号
     * @return
     */
    @PostMapping("/unsubscribe")
    public UnsubscribeModel unsubscribe(Long oid){
        //将该order类型改为已退订（todo ticket要不要做什么处理）
        return subscribeService.unsubscribe(oid);
    }

}
