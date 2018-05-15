package ticketson.model;

/**
 * Created by shea on 2018/3/20.
 */
public class UnsubscribeModel {
    public double returnMoney;
    public double unsubscribeFees;

    public UnsubscribeModel() {
    }

    public UnsubscribeModel(double returnMoney, double unsubscribeFees) {
        this.returnMoney = returnMoney;
        this.unsubscribeFees = unsubscribeFees;
    }
}
