package ticketson.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
@ResponseBody
public class GlobalExceptionHandler {

    @ResponseStatus(value = HttpStatus.NOT_FOUND)
    @ExceptionHandler(ResourceNotFoundException.class)
    public String resourceNotFoundHandler(ResourceNotFoundException e) {
        return e.getMessage();
    }

    @ResponseStatus(value = HttpStatus.CONFLICT)
    @ExceptionHandler(ResourceConflictException.class)
    public String resourceConflictHandler(ResourceConflictException e) {
        return e.getMessage();
    }

    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    @ExceptionHandler(InvalidRequestException.class)
    public String invalidRequestHandler(InvalidRequestException e) {
        return e.getMessage();
    }

    @ResponseStatus(value = HttpStatus.METHOD_FAILURE)
    @ExceptionHandler(MethodFailureException.class)
    public String methodFailureHandler(MethodFailureException e){return e.getMessage();}

}
