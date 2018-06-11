package ticketson.util;

import ticketson.entity.Member;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.Properties;

/**
 * Created by shea on 2018/2/12.
 */
public class EmailHelper {

    private static final String FROM = "shea_wong@163.com";//发件人的email
    private static final String PWD = "76JmFrcauWvJ";//发件人密码--邮箱密码
    private static final String URL = "Http://localhost:8080/activateEmail";
    private static final int TIMELIMIT = 1000*60*60*24; //激活邮件过期时间24小时
    private static final String TITLE = "请确认您的邮件--TicketsOn";
    private static final String HOST = "smtp.163.com";
    private static final String SMTP = "smtp";

    /**
     * 发送激活链接
     * @param member 会员信息
     * @return
     * @throws MessagingException
     * @throws NoSuchAlgorithmException
     */
    public static Member sendActivateMail(Member member) throws MessagingException, NoSuchAlgorithmException {
        //注册邮箱
        String to  = member.getEmail();
        //激活码--用于激活邮箱账号
        String token = md5(member.getEmail()+System.currentTimeMillis());
        member.setToken(token);
        System.out.println(token);
        //过期时间
        String content =
                "<p style='margin-left:100px'><div style='color:#ff5a5f;font-size:24px'>TicketsOn</div>" +
                        "<p>您好!</p><p>欢迎加入TicketsOn！在开始使用TicketsOn之前，您必须先确认您的电子邮件地址。</p>" +
                        "<br>"+
                        "<a href='"+URL+"?token="+token+"&&email="+to+"' style='text-decoration: none'>" +
                        "<label style='background-color:#ff5a5f;color:white;cursor:pointer;padding: 6px 40px 6px 40px;'>激活账号</label></a>"+
                        "<br>"+
                        "<br>"+
                        "</p>";
        //调用发送邮箱服务
        sendMail(to, TITLE, content);
        return member;
    }



    /**
     * 发送邮件
     * @param to 接收方
     * @param title 邮件主题
     * @param content 邮件内容
     * @throws AddressException
     * @throws MessagingException
     */
    private static void sendMail(String to,String title,String content) throws AddressException, MessagingException {

        Properties props = new Properties(); //可以加载一个配置文件
        // 使用smtp：简单邮件传输协议
        props.put("mail.smtp.host", HOST);//存储发送邮件服务器的信息
        props.put("mail.smtp.auth", "true");//同时通过验证
        Session session = Session.getInstance(props);//根据属性新建一个邮件会话
        //session.setDebug(true); //有他会打印一些调试信息。
        MimeMessage message = new MimeMessage(session);//由邮件会话新建一个消息对象
        message.setFrom(new InternetAddress(FROM));//设置发件人的地址
        message.setRecipient(Message.RecipientType.TO, new InternetAddress(to));//设置收件人,并设置其接收类型为TO
        message.setSubject(title);//设置标题
        //设置信件内容
        //message.setText(mailContent); //发送 纯文本 邮件 todo
        message.setContent(content, "text/html;charset=gbk"); //发送HTML邮件，内容样式比较丰富
        message.setSentDate(new Date());//设置发信时间
        message.saveChanges();//存储邮件信息
        //发送邮件
        Transport transport = session.getTransport(SMTP);
        //Transport transport = session.getTransport();
        transport.connect(FROM, PWD);
        transport.sendMessage(message, message.getAllRecipients());//发送邮件,其中第二个参数是所有已设好的收件人地址
        transport.close();
    }

    private static String md5(String str) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("MD5");
        md.update(str.getBytes());
        return new BigInteger(1,md.digest()).toString(16);
    }
}
