package ticketson.service.serviceimpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ticketson.dao.MemberRepository;
import ticketson.dao.OrderRepository;
import ticketson.entity.Member;
import ticketson.entity.Order;
import ticketson.exception.InvalidRequestException;
import ticketson.exception.MethodFailureException;
import ticketson.exception.ResourceConflictException;
import ticketson.exception.ResourceNotFoundException;
import ticketson.model.MemberModel;
import ticketson.model.MemberStatisticsModel;
import ticketson.model.SimpleMemberModel;
import ticketson.service.MemberService;
import ticketson.util.EmailHelper;

import javax.mail.MessagingException;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by shea on 2018/2/6.
 */
@Service
public class MemberServiceImpl implements MemberService {
    @Autowired
    MemberRepository memberRepository;
    @Autowired
    OrderRepository orderRepository;

    /**
     * 用户注册
     *
     * @param email 邮箱
     * @param psw   密码
     * @return
     */
    @Override
    public void register(String email, String psw, String nickname) {
        if(memberRepository.findByEmail(email)!=null){
            throw new ResourceConflictException("该邮箱已被注册");
        }
        Member member = new Member();
        member.setEmail(email);
        member.setPsw(psw);
        member.setNickname(nickname);
        member.setRegisterTime(System.currentTimeMillis());
        try {
            member = EmailHelper.sendActivateMail(member);
        } catch (MessagingException e) {
            e.printStackTrace();
            throw new MethodFailureException("激活链接发送失败");
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            throw new MethodFailureException("激活链接发送失败");
        }
        memberRepository.save(member);
    }

    /**
     * 用户登陆
     *
     * @param email 邮箱
     * @param psw   密码
     * @return 返回用户基本信息
     */
    @Override
    public SimpleMemberModel login(String email, String psw) {
        Member member = memberRepository.findByEmail(email);
        if(member==null||!member.getPsw().equals(psw)){
            throw new InvalidRequestException("用户名或密码错误");
//            return ResultHelper.fillResultString(ResultHelper.WRONG_ACCOUNT,"用户名或密码错误",null);
        }else if(!member.getActivated()){
            throw new ResourceNotFoundException("该账号尚未被激活");
//            return ResultHelper.fillResultString(ResultHelper.ACCOUNT_NOT_ACTIVATE,"该账号尚未被激活",null);
        }else if(member.getIsCanceled()){
            throw new ResourceNotFoundException("会员资格已取消");
//            return ResultHelper.fillResultString(ResultHelper.ACCOUNT_CANCELLED,"会员资格已取消",null);
        }else {
            return new SimpleMemberModel(member);
        }
    }

    /**
     * 用户完善信息
     * @param mid 会员ID
     * @param provinceCode 省
     * @param cityCode     市
     * @param districtCode 区
     * @param nickname 昵称
     * @return
     */
    @Override
    public SimpleMemberModel perfectInfo(long mid, int provinceCode, int cityCode, int districtCode, String nickname) {
        Member member = memberRepository.findOne(mid);
        member.setCityCode(cityCode);
        member.setDistrictCode(districtCode);
        member.setProvinceCode(provinceCode);
        member.setNickname(nickname);
        member = memberRepository.save(member);
        return new SimpleMemberModel(member);
    }

    /**
     * 用户获得基本信息
     *
     * @param mid 用户ID
     * @return 用户基本信息
     */
    @Override
    public MemberModel getInfo(long mid) {
        Member member = memberRepository.findOne(mid);
        return new MemberModel(member);
    }

    /**
     * 会员激活账号
     * @param token 激活码
     * @param email 会员邮箱
     * @return
     */
    @Override
    public String activateEmail(String token, String email) {
        Member member = memberRepository.findByEmail(email);
        if (member != null) {
            //链接从未被尝试激活
            if (!member.getActivated()) {//member.getActivateTime() == 1时，表示用户在规定时间内点击过激活链接
                if (member.getToken().equals(token)) {
                    //在时间内且激活码通过，激活成功
                    member.setActivated(true);
                    //重新设置token防止被禁用的用户利用激活
                    member.setToken(token.replace("1", "c"));
                    memberRepository.save(member);
                    return "/pages/member/index";
                } else {
                    throw new InvalidRequestException("激活码验证不通过");
//                    return "激活码验证不通过";
                }
            //链接被尝试激活并且验证不通过
            }else {
                throw new ResourceConflictException("您已成功激活账号，无需再次激活");
//                return "您已成功激活账号，无需再次激活";
            }
        } else {
            throw new ResourceNotFoundException("woops ~~>,<~~ 无此用户");
//            return "woops ~~>,<~~ 无此用户";
        }
    }

    /**
     * 获得用户的统计数据
     *
     * @param mid
     * @return
     */
    @Override
    public MemberStatisticsModel getStatistics(long mid) {
        //此时
        Calendar end = Calendar.getInstance();
        //五个月之前
        Calendar begin = Calendar.getInstance();
        begin.set(end.get(Calendar.YEAR),end.get(Calendar.MONTH)-4,1);
        //得到近五个月支付成功并且未退订的订单
        List<Order> orders = orderRepository.findByMember_MidAndIsUnSubscribedAndPaySuccessAndOrderDateGreaterThanEqualAndOrderDateLessThanEqualOrderByPayPriceDesc(mid,false,true,begin.getTimeInMillis(),end.getTimeInMillis());
        int unsubscribeNum = orderRepository.countByMember_MidAndIsUnSubscribedAndPaySuccessAndOrderDateGreaterThanEqualAndOrderDateLessThanEqual(mid,true,true,begin.getTimeInMillis(),end.getTimeInMillis());
        //近五个月的消费走势
        Map<String,Double> trend = new TreeMap<>();
        Map<String,Double> type = new TreeMap<>();
        Map<String,Integer> subscribe = new TreeMap<>();
        //初始化预订退订数目的map
        subscribe.put("退订数目",unsubscribeNum);
        subscribe.put("预订数目",orders.size());
        //初始化消费走势的map
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yy年M月");
        Calendar j = begin;
        while (j.getTimeInMillis()<=end.getTimeInMillis()){
            trend.put(simpleDateFormat.format(j.getTime()),0.0);
            j.set(j.get(Calendar.YEAR),j.get(Calendar.MONTH)+1,1);
        }
        for(Order order:orders){
            //设置该类型的订单金额
            if(type.containsKey(order.getType())){
                type.replace(order.getType(),type.get(order.getType())+order.getPayPrice());
            }else {
                type.put(order.getType(),(double)order.getPayPrice());
            }
            //设置该月的订单金额
            Calendar orderDate = Calendar.getInstance();
            orderDate.setTimeInMillis(order.getOrderDate());
            String orderDateKey = simpleDateFormat.format(orderDate.getTime());
            trend.replace(orderDateKey,(double)order.getPayPrice()+trend.get(orderDateKey));
        }
        int endIndex = orders.size()>=3?3:orders.size();
        return new MemberStatisticsModel(trend,type,subscribe,orders.subList(0,endIndex));
    }


}
