package ticketson.util;

import com.alibaba.fastjson.JSONObject;

/**
 * Created by shea on 2018/2/12.
 */
public class ResultHelper {
    public static final int SUCCESS = 1;
    public static final int DUPLICATE_ACCOUNT = 2;
    public static final int WRONG_ACCOUNT = 3;
    public static final int FAIL_SEND_EMAIL = 4;
    //会员账号尚未激活
    public static final int ACCOUNT_NOT_ACTIVATE = 5;
    //会员资格已取消
    public static final int ACCOUNT_CANCELLED = 6;
    //未审核
    public static final int VENUE_UNCHECKED = 7;
    //审核不通过
    public static final int VENUE_CHECK_FAIL = 8;
    //图片上传错误
    public static final int POST_PHOTO_ERROR = 9;
    //时间解析错误
    public static final int TIME_PARSE_ERROR = 10;
    //暂无平面图
    public static final int NO_LAYOUTS = 11;
    //订单支付超时被取消
    public static final int CANCEL_OF_PAY_OVERTIME = 12;
    //余额不足
    public static final int POOR_BANLANCE = 13;
    //积分不足
    public static final int POOR_CREDIT = 14;
    /**
     *
     * @param status 0为正确，其他均为错误
     * @param message 正确或错误的信息
     * @param result
     * @return
     */
    public static String fillResultString(Integer status, String message, Object result){
        JSONObject jsonObject = new JSONObject(){{
            put("status", status);
            put("message", message);
            put("result", result);
        }};
        return jsonObject.toString();
    }
}
