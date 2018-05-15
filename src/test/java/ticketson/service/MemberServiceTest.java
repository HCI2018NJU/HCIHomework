package ticketson.service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import ticketson.model.MemberStatisticsModel;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

/**
 * Created by shea on 2018/3/19.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
public class MemberServiceTest {
    @Autowired
    MemberService memberService;

    @Test
    public void testTime(){
        Map<String,Double> type = new TreeMap<>();
        Map<String,Integer> subscribe = new TreeMap<>();
        Map<String,Double> trend = new TreeMap<>();
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yy年M月");
        //此时
        Calendar end = Calendar.getInstance();
        //五个月之前
        Calendar begin = Calendar.getInstance();
        begin.set(end.get(Calendar.YEAR),end.get(Calendar.MONTH)-4,1);
        Calendar j = begin;
        while (j.getTimeInMillis()<=end.getTimeInMillis()){
            trend.put(simpleDateFormat.format(j.getTime()),0.0);
            j.set(j.get(Calendar.YEAR),j.get(Calendar.MONTH)+1,1);
        }
        //初始化预订退订数目的map
        subscribe.put("退订数目",0);
        subscribe.put("预订数目",0);
//        MemberStatisticsModel memberStatisticsModel = new MemberStatisticsModel(trend,type,subscribe,);
//        System.out.println(memberStatisticsModel);
    }

    @Test
    public void testStatistics(){
        MemberStatisticsModel memberStatisticsModel = memberService.getStatistics(1);
        System.out.println(memberStatisticsModel);
    }
}
