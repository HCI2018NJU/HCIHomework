package ticketson.exception;

/**
 * Created by shea on 2018/3/13.
 */
public class MethodFailureException extends RuntimeException {
    /**
     * Constructs a new runtime exception with the specified detail message.
     * The cause is not initialized, and may subsequently be initialized by a
     * call to {@link #initCause}.
     *
     * @param message the detail message. The detail message is saved for
     *                later retrieval by the {@link #getMessage()} method.
     */
    public MethodFailureException(String message) {
        super(message);
    }
}
