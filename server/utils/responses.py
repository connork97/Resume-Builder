from flask import jsonify

COLORS = {
    "reset" or "default": "\033[0m",
    "black": "\033[30m",
    "white": "\033[37m",
    "red": "\033[31m",
    "green": "\033[32m",
    "yellow": "\033[33m",
    "blue": "\033[34m",
    "magenta": "\033[35m",
    "cyan": "\033[36m",
}

ERRORS = {
    "BAD_REQUEST": {"status": 400, "message": "Invalid or incomplete request."},
    "UNAUTHORIZED": {"status": 401, "message": "User authentication required."},
    "FORBIDDEN": {
        "status": 403,
        "message": "You do not have permission to perform this action.",
    },
    "NOT_FOUND": {"status": 404, "message": "Resource not found."},
    "CONFLICT": {"status": 409, "message": "Conflict with existing data."},
    "VALIDATION_ERROR": {"status": 422, "message": "Validation failed."},
    "SERVER_ERROR": {"status": 500, "message": "Internal server error."},
}


def generate_error(error_type="SERVER_ERROR", code=None, message=None):
    error_type = (error_type or "SERVER_ERROR").upper()
    error_def = ERRORS.get(error_type, ERRORS["SERVER_ERROR"])

    error = {
        "type": error_type,
        "code": code or error_type,
        "message": message or error_def["message"],
    }

    print(f"{COLORS['red']}ERROR: {error} {COLORS['reset']}")
    # print(f"{COLORS['red']}ERROR: {error['type']}, {error['code']}, {error['message']}")
    return (
        jsonify(
            {
                "error": {
                    "type": error_type,
                    "code": code or error_type,
                    "message": message or error_def["message"],
                }
            }
        ),
        error_def["status"] or 400,
    )


def generate_success(
    success_type="OK", data=None, message=None, code=None, resource="Resource"
):
    SUCCESS_DICT = {
        "OK": {"status": 200, "code": "SUCCESS", "message": "Request successful."},
        "CREATE": {
            "status": 201,
            "code": "CREATED_SUCCESSFULLY",
            "message": f"{resource} created successfully.",
        },
        "UPDATE": {
            "status": 200,
            "code": "UPDATED_SUCCESSFULY",
            "message": f"{resource} updated successfully.",
        },
        "DELETE": {
            "status": 200,
            "code": "DELETED_SUCCESSFULY",
            "message": f"{resource} deleted successfully.",
        },
    }
    success_def = SUCCESS_DICT.get(success_type, SUCCESS_DICT["OK"])
    success = {
        "type": success_type,
        "code": code or success_def["code"],
        "message": message or success_def["message"],
    }
    # print(f"{COLORS['green']}SUCCESS: {success}{COLORS['reset']}")
    return (
        jsonify(
            {
                "success": {
                    "type": success_type,
                    "code": code or success_def["code"],
                    "message": message or success_def["message"],
                },
                "data": data,
            }
        ),
        success_def["status"],
    )


def color_print(color, text):
    print(f"{COLORS.get(color)}{text}{COLORS.get('reset')}")


def print_pending_request(type="", route="", text="", emphasized_info=""):
    print(
        f"{COLORS['yellow']}Received {type} request for {COLORS['magenta']}{route} {COLORS['yellow']}{text} {COLORS['magenta']}{emphasized_info}{COLORS.get('reset')}"
    )


def print_successful_request(text="", emphasized_info_1="", emphasized_info_2=""):
    print(
        f"{COLORS['green']}SUCCESS: {text} {COLORS['magenta']}{emphasized_info_1} {emphasized_info_2}{COLORS['reset']}"
    )
